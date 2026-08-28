
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
npx prisma migrate dev --name add_invitations
node prisma/seed-r.js
npm run dev
