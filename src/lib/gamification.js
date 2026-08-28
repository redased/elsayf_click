import prisma from '@/lib/prisma';

// Seuils d'XP pour chaque niveau
// Niveau 1: 0 XP
// Niveau 2: 100 XP
// Niveau 3: 300 XP
// Niveau 4: 600 XP (Progression non-linéaire)
export const calculateLevel = (xp) => {
    // Formule simple : Niveau = 1 + racine carrée(XP / 100)
    // 100 XP => Niv 2
    // 400 XP => Niv 3
    // 900 XP => Niv 4
    return Math.floor(1 + Math.sqrt(xp / 100));
};

export async function addXp(userId, amount) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { xp: true, level: true }
        });

        if (!user) return null;

        const newXp = user.xp + amount;
        const newLevel = calculateLevel(newXp);
        const leveledUp = newLevel > user.level;

        await prisma.user.update({
            where: { id: userId },
            data: {
                xp: newXp,
                level: newLevel
            }
        });

        return {
            currentXp: newXp,
            currentLevel: newLevel,
            leveledUp
        };
    } catch (error) {
        console.error('Error adding XP:', error);
        return null; // Fail safe
    }
}
