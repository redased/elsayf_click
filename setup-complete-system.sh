#!/bin/bash

echo "🚀 Installation du système complet de rôles et éditeur de cours..."

cd /root/elsayf

# 1. Mettre à jour le schéma Prisma
echo "📝 Mise à jour du schéma..."

# Ajouter la relation courseAccess au modèle Course
sed -i '/registrationRequests \[\]/a\  courseAccess        CourseAccess[]' prisma/schema.prisma

# Ajouter la relation courseAccess au modèle User
sed -i '/courseProgress   CourseProgress\[\]/a\  courseAccess        CourseAccess[]' prisma/schema.prisma

# 2. Générer le client Prisma
echo "🔧 Génération Prisma..."
npx prisma generate > /dev/null 2>&1
npx prisma db push > /dev/null 2>&1

echo "✅ Schéma mis à jour !"

