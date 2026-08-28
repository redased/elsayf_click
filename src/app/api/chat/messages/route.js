import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Récupérer les messages pour l'utilisateur connecté
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Récupérer les messages destinés à l'utilisateur ou à tous (toUserId = null)
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { toUserId: session.user.id },
          { toUserId: null }, // Messages broadcast à tous
        ],
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('[Chat API] Error fetching messages:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Envoyer un message (Admin/Super Admin uniquement)
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est Admin ou Super Admin
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const { message, messageType = 'text', metadata = null, toUserId = null, sendToAll = false } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: "Le message ne peut pas être vide" }, { status: 400 });
    }

    // Si sendToAll = true, on envoie à tous les étudiants
    if (sendToAll) {
      const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        select: { id: true },
      });

      // Créer un message pour chaque étudiant
      const messagesToCreate = students.map(student => ({
        fromUserId: session.user.id,
        toUserId: student.id,
        message: message.trim(),
        messageType,
        metadata: metadata ? JSON.stringify(metadata) : null,
      }));

      await prisma.chatMessage.createMany({
        data: messagesToCreate,
      });

      return NextResponse.json({
        success: true,
        message: `Message envoyé à ${students.length} étudiant(s)`,
        count: students.length,
      });
    }

    // Envoyer à un utilisateur spécifique ou broadcast (toUserId = null)
    const newMessage = await prisma.chatMessage.create({
      data: {
        fromUserId: session.user.id,
        toUserId: toUserId || null,
        message: message.trim(),
        messageType,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('[Chat API] Error sending message:', error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 });
  }
}

// PATCH - Marquer un message comme lu
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json({ error: "messageId requis" }, { status: 400 });
    }

    await prisma.chatMessage.update({
      where: {
        id: messageId,
        toUserId: session.user.id, // S'assurer que c'est bien le destinataire
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Chat API] Error marking message as read:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
