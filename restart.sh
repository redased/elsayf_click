#!/bin/bash
echo "🔄 Redémarrage de l'application El Sayf..."

# Rebuild Next.js
echo "📦 Build Next.js..."
npm run build

# Restart PM2 with standalone server
echo "🔄 Redémarrage PM2..."
pm2 restart elsayf-click

# Wait for startup
echo "⏳ Attente du démarrage..."
sleep 3

# Show logs
echo "📝 Logs récents:"
pm2 logs elsayf-click --lines 15 --nostream

echo "✅ Application redémarrée!"
echo "🌐 URL: https://elsayf.click"
