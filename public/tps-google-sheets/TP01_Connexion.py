"""
TP1: Votre première connexion Google Sheets
==========================================

Objectif: Connecter Python à Google Sheets et lister toutes vos feuilles.

Prérequis:
- Un compte Google
- service-account.json téléchargé depuis Google Cloud Console
- Bibliothèques installées: pip install gspread google-auth

Instructions:
1. Placez votre fichier service-account.json dans le même dossier
2. Exécutez: python TP01_Connexion.py
3. Acceptez l'autorisation si demandé
"""

import gspread
from google.oauth2.service_account import Credentials

def connect_with_service_account():
    """
    Connexion avec un Service Account (recommandé pour l'automatisation)
    """
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
              'https://www.googleapis.com/auth/drive']

    credentials = Credentials.from_service_account_file(
        'service-account.json',
        scopes=SCOPES
    )
    return gspread.authorize(credentials)

def main():
    print("=" * 60)
    print("TP1: Connexion à Google Sheets")
    print("=" * 60)

    # Connexion
    print("\n📡 Connexion à Google Sheets...")
    try:
        gc = connect_with_service_account()
        print("✅ Connexion réussie!")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        print("\n💡 Vérifiez que:")
        print("   - service-account.json existe dans ce dossier")
        print("   - Le service account a accès à Sheets")
        return

    # Lister les feuilles
    print("\n📊 Vos feuilles Google Sheets:")
    try:
        sheets = gc.list_spreadsheet_files()
        for i, sheet in enumerate(sheets[:10], 1):
            print(f"   {i}. {sheet['name']}")

        if len(sheets) > 10:
            print(f"   ... et {len(sheets) - 10} autres")

        # Bonus: Ouvrir la première feuille
        if sheets:
            print(f"\n🔍 Ouverture de la première feuille...")
            first_sheet = gc.open(sheets[0]['name'])
            print(f"✅ Ouvert: {first_sheet.title}")
            print(f"   Onglets: {[ws.title for ws in first_sheet.worksheets()]}")

    except Exception as e:
        print(f"❌ Erreur: {e}")

    print("\n" + "=" * 60)
    print("TP1 terminé! 🎉")
    print("=" * 60)

if __name__ == '__main__':
    main()
