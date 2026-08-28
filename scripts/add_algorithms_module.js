const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const algorithmContent = {
    title: "Fondations de l'Algorithmique",
    intro: "Avant même d'écrire une seule ligne de code Python, vous devez comprendre comment un ordinateur 'pense'. L'algorithmique est l'art de décomposer un problème complexe en une suite d'instructions simples et logiques.",
    image: "/images/course-python/lesson0.png",
    sections: `
# 0. Pourquoi l'Algorithmique ?

Imaginez que vous deviez expliquer à un robot comment faire une tasse de thé. Si vous oubliez de lui dire de 'faire chauffer l'eau', il mettra le sachet dans de l'eau froide. Un ordinateur est extrêmement rapide, mais **extrêmement bête**. Il fait exactement ce que vous lui dites, ni plus, ni moins.

---

## 1. Qu'est-ce qu'un Algorithme ?
Un algorithme est simplement une **recette**. 
*   **Entrée** : Ingrédients (Données).
*   **Traitement** : Étapes de la recette (Logique).
*   **Sortie** : Le plat cuisiné (Résultat).

---

## 2. Les Variables : Les Boîtes de Stockage
Pour cuisiner, vous avez besoin de bols pour mettre vos ingrédients. En informatique, ce sont les **variables**.
*   **Nom** : L'étiquette sur le bol (ex: 'sucre').
*   **Valeur** : Ce qu'il y a dedans (ex: 50 grammes).
*   **Type** : La nature de l'objet (Peut-on verser du liquide dedans ? Est-ce un solide ?).

> [!NOTE]
> Un algorithme manipule des variables pour transformer l'état initial en état final.

---

## 3. Les Structures de Contrôle (Si... Alors)
C'est le moment où l'on prend des décisions.
**Exemple :**
*   **SI** le ciel est gris **ALORS** prendre un parapluie.
*   **SINON** (si le ciel est bleu) ne rien prendre.

En programmation, cela permet de créer des programmes intelligents qui s'adaptent aux situations.

---

## 4. Les Boucles : L'Art de la Répétition
Pourquoi copier-coller 100 fois la même instruction ?
*   **Boucle POUR** : "Fais 10 pompes." (On connaît le nombre à l'avance).
*   **Boucle TANT QUE** : "Continue à courir TANT QUE tu n'es pas fatigué." (On dépend d'une condition).

---

## 5. Les Tableaux : Organiser ses Données
Un tableau est comme un casier d'école. Chaque compartiment a un numéro (**index**) et contient une information. Cela permet de gérer des milliers de données facilement.

---

## 6. Cas Pratique : La Recherche Linéaire
Comment trouver un nom dans une liste de 100 personnes ?
1.  Prendre le premier nom.
2.  Est-ce le bon ?
    *   OUI : C'est fini !
    *   NON : Passer au suivant.
3.  Recommencer jusqu'à la fin.

> [!TIP]
> Un bon algorithme n'est pas seulement celui qui marche, c'est celui qui est le plus **efficace** (le plus rapide ou celui qui utilise le moins de mémoire).
`
};

async function main() {
    const courseSlug = 'python-integral';
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });

    if (!course) {
        console.error('Course not found');
        return;
    }

    console.log('--- Shifting existing lessons and inserting Algorithms module ---');

    // 1. Shift all existing lessons for this course
    const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'desc' }
    });

    for (const lesson of lessons) {
        await prisma.lesson.update({
            where: { id: lesson.id },
            data: { order: lesson.order + 1 }
        });
    }
    console.log(`✅ ${lessons.length} lessons shifted.`);

    // 2. Create the new Algorithm lesson at order 1
    const newLesson = await prisma.lesson.create({
        data: {
            title: algorithmContent.title,
            order: 1,
            duration: 90,
            courseId: course.id,
            content: algorithmContent.intro
        }
    });
    console.log('✅ New lesson created: Fondations de l\'Algorithmique');

    // 3. Add content to the new lesson
    await prisma.courseContent.create({
        data: {
            lessonId: newLesson.id,
            contentType: 'text',
            title: "Logique et Algorithmie",
            content: algorithmContent.sections.replace('$IMAGE_PLACEHOLDER$', algorithmContent.image),
            order: 1
        }
    });
    console.log('✅ Detailed content added to the new lesson.');

    console.log('--- Process complete! ---');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
