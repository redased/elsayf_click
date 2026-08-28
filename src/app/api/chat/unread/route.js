import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Compter les messages non lus
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const count = await prisma.chatMessage.count({
      where: {
        OR: [
          { toUserId: session.user.id },
          { toUserId: null },
        ],
        isRead: false,
      },
    });

    return NextResponse.json({ unreadCount: count });
  } catch (error) {
    console.error('[Chat API] Error counting unread:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
