#!/bin/bash
# Exécuter APRÈS que les DNS de elsayf.click pointent vers ce serveur (72.61.161.87)
# Usage: bash /root/elsayf_click/activate_ssl.sh

set -e

echo "🔍 Vérification DNS elsayf.click..."
IP_SERVEUR="72.61.161.87"
IP_DNS=$(dig +short elsayf.click A 2>/dev/null | head -1)

if [ "$IP_DNS" != "$IP_SERVEUR" ]; then
    echo "❌ DNS pas encore propagé !"
    echo "   elsayf.click → $IP_DNS"
    echo "   Ce serveur   → $IP_SERVEUR"
    echo ""
    echo "Configure chez ton registrar :"
    echo "  A  @    72.61.161.87"
    echo "  A  www  72.61.161.87"
    echo ""
    echo "Re-lance ce script une fois la propagation faite."
    exit 1
fi

echo "✅ DNS OK ($IP_DNS)"

echo "🔧 Test config Nginx..."
nginx -t

echo "🔄 Rechargement Nginx..."
nginx -s reload

echo "🔐 Obtention certificat SSL (Certbot)..."
certbot --nginx \
    -d elsayf.click \
    -d www.elsayf.click \
    --non-interactive \
    --agree-tos \
    --email admin@statlabo.com \
    --redirect

echo "🔄 Rechargement final Nginx..."
nginx -s reload

echo "💾 Sauvegarde PM2..."
pm2 save

echo ""
echo "🎉 Terminé ! elsayf.click est en ligne :"
echo "   https://elsayf.click"
