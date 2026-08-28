"""
TP4: Système CRUD complet avec gspread
=====================================

Objectif: Créer un système de gestion de contacts avec
         Create, Read, Update, Delete

Ce script crée un menu interactif pour gérer des contacts
stockés dans Google Sheets.
"""

import gspread
from google.oauth2.service_account import Credentials

class ContactsManager:
    """Gestionnaire de contacts avec Google Sheets"""

    def __init__(self, sheet_name):
        self.gc = self._connect()
        self.sheet = self.gc.open(sheet_name)
        self.worksheet = self.sheet.sheet1

    def _connect(self):
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file('service-account.json', scopes=SCOPES)
        return gspread.authorize(creds)

    def add_contact(self, nom, email, telephone, entreprise):
        """CREATE: Ajouter un contact"""
        row = [nom, email, telephone, entreprise]
        self.worksheet.append_row(row)
        print(f"✅ Contact ajouté: {nom}")

    def get_all_contacts(self):
        """READ: Lire tous les contacts"""
        return self.worksheet.get_all_records()

    def update_contact(self, nom, field, value):
        """UPDATE: Modifier un contact"""
        contacts = self.get_all_contacts()
        col_map = {'Email': 2, 'Téléphone': 3, 'Entreprise': 4}

        if field not in col_map:
            print(f"❌ Champ invalide: {field}")
            return False

        for i, contact in enumerate(contacts, start=2):
            if contact['Nom'].lower() == nom.lower():
                col = col_map[field]
                self.worksheet.update_cell(i, col, value)
                print(f"✅ {nom} mis à jour: {field} = {value}")
                return True

        print(f"❌ Contact '{nom}' non trouvé")
        return False

    def delete_contact(self, nom):
        """DELETE: Supprimer un contact"""
        contacts = self.get_all_contacts()
        for i, contact in enumerate(contacts, start=2):
            if contact['Nom'].lower() == nom.lower():
                self.worksheet.delete_rows(i)
                print(f"✅ Contact supprimé: {nom}")
                return True

        print(f"❌ Contact '{nom}' non trouvé")
        return False

    def display_contacts(self):
        """Afficher tous les contacts"""
        contacts = self.get_all_contacts()
        print("\n📋 Liste des contacts:")
        print(f"{'Nom':<20} {'Email':<30} {'Téléphone':<15}")
        print("-" * 65)
        for c in contacts:
            print(f"{c['Nom']:<20} {c['Email']:<30} {c.get('Téléphone', ''):<15}")


def main():
    print("=" * 50)
    print("📇 GESTIONNAIRE DE CONTACTS")
    print("=" * 50)

    manager = ContactsManager('TP_Contacts')  # Changez le nom de votre feuille

    while True:
        print("\n1. Ajouter un contact")
        print("2. Lister tous les contacts")
        print("3. Modifier un contact")
        print("4. Supprimer un contact")
        print("5. Quitter")

        choice = input("\nVotre choix (1-5): ")

        if choice == '1':
            nom = input("Nom: ")
            email = input("Email: ")
            tel = input("Téléphone: ")
            entreprise = input("Entreprise: ")
            manager.add_contact(nom, email, tel, entreprise)

        elif choice == '2':
            manager.display_contacts()

        elif choice == '3':
            nom = input("Nom du contact à modifier: ")
            champ = input("Champ (Email/Téléphone/Entreprise): ")
            valeur = input(f"Nouvelle valeur pour {champ}: ")
            manager.update_contact(nom, champ, valeur)

        elif choice == '4':
            nom = input("Nom du contact à supprimer: ")
            confirm = input(f"Confirmer suppression de {nom}? (o/n): ")
            if confirm.lower() == 'o':
                manager.delete_contact(nom)

        elif choice == '5':
            print("👋 Au revoir!")
            break


if __name__ == '__main__':
    main()
