#!/bin/bash
cd /root/elsayf

# Mettre à jour le schéma Prisma
cat >> prisma/schema.prisma << 'PRISMAEOF'

model CourseAccess {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  grantedBy String
  grantedAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
}

model CourseContent {
  id          String   @id @default(cuid())
  lessonId    String
  title       String
  content     String
  contentType String   @default("text") // text, code, video, mixed
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
}
PRISMAEOF

# Générer et pousser
npx prisma generate > /dev/null 2>&1
npx prisma db push > /dev/null 2>&1

echo "✅ Schéma mis à jour !"
