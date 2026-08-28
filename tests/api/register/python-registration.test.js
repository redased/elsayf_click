/**
 * Tests unitaires pour l'inscription Python
 *
 * Pour exécuter ces tests:
 * npm install --save-dev jest @testing-library/jest-dom
 * npm test
 */

const { PythonRegistrationTest } = require('./python-registration-helpers');

describe('Python Registration API Tests', () => {

    // Test 1: Validation des champs obligatoires
    describe('Validation des champs obligatoires', () => {

        test('devrait échouer sans nom', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: '',
                lastName: 'Dupont',
                email: 'test@example.com'
            });

            expect(response.status).toBe(400);
            expect(response.data.error).toContain('nom');
        });

        test('devrait échouer sans prénom', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: '',
                email: 'test@example.com'
            });

            expect(response.status).toBe(400);
            expect(response.data.error).toContain('prénom');
        });

        test('devrait échouer sans email', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: ''
            });

            expect(response.status).toBe(400);
            expect(response.data.error).toContain('email');
        });

        test('devrait échouer avec email invalide', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'email-invalide'
            });

            expect(response.status).toBe(400);
            expect(response.data.error).toContain('invalide');
        });

        test('devrait réussir avec champs minimaux valides', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.dupont@example.com'
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });
    });

    // Test 2: Gestion des doublons
    describe('Gestion des doublons', () => {

        test('devrait échouer si email déjà utilisé', async () => {
            const userData = {
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'duplicate@example.com'
            };

            // Première inscription
            await PythonRegistrationTest.sendRequest(userData);

            // Deuxième inscription avec même email
            const response = await PythonRegistrationTest.sendRequest(userData);

            expect(response.status).toBe(409);
            expect(response.data.error).toContain('existe déjà');
        });
    });

    // Test 3: Champs optionnels
    describe('Champs optionnels', () => {

        test('devrait accepter téléphone', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.phone@example.com',
                phone: '+213555123456'
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });

        test('devrait accepter filière', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.filiere@example.com',
                filiere: 'OBAC'
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });

        test('devrait accepter modules', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.modules@example.com',
                modules: ['excel', 'word', 'automatisation']
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });

        test('devrait accepter autre module', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.other@example.com',
                otherModule: 'Machine Learning avancé'
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });

        test('devrait accepter projet', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.project@example.com',
                project: 'Créer un dashboard de ventes'
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });

        test('devrait accepter demande personnalisée', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.custom@example.com',
                customRequest: 'Je souhaite des cours le week-end'
            });

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
        });
    });

    // Test 4: Inscription complète
    describe('Inscription complète', () => {

        test('devrait réussir avec tous les champs', async () => {
            const fullData = {
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.full@example.com',
                phone: '+213555123456',
                filiere: 'CEM',
                modules: ['excel', 'word', 'automatisation', 'data_analysis'],
                otherModule: 'Visualisation de données',
                project: 'Automatiser les rapports mensuels de mon entreprise',
                customRequest: 'Préfère les cours en vidéo'
            };

            const response = await PythonRegistrationTest.sendRequest(fullData);

            expect([200, 201]).toContain(response.status);
            expect(response.data.success).toBe(true);
            expect(response.data.user).toBeDefined();
            expect(response.data.user.email).toBe(fullData.email);
        });
    });

    // Test 5: Validation des emails
    describe('Validation des formats d\'email', () => {

        const invalidEmails = [
            'plainaddress',
            '@missingusername.com',
            'username@.com',
            'username@com',
            'username..double.dot@domain.com',
            'username@-domain.com',
        ];

        test.each(invalidEmails)('devrait rejeter "%s"', async (email) => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: email
            });

            expect(response.status).toBe(400);
        });

        const validEmails = [
            'test@example.com',
            'user.name@example.com',
            'user+tag@example.co.uk',
            'user_name@example-domain.com',
        ];

        test.each(validEmails)('devrait accepter "%s"', async (email) => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: email
            });

            expect([200, 201]).toContain(response.status);
        });
    });

    // Test 6: Filières
    describe('Validation des filières', () => {

        const validFilieres = ['OBAC', 'CEM', 'Universitaire', 'Professionnel', 'Autre'];

        test.each(validFilieres)('devrait accepter la filière "%s"', async (filiere) => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: `jean.${filiere}@example.com`,
                filiere: filiere
            });

            expect([200, 201]).toContain(response.status);
        });
    });

    // Test 7: Modules
    describe('Validation des modules', () => {

        const validModules = [
            'excel', 'word', 'email', 'automatisation',
            'data_analysis', 'web_scraping', 'dashboards', 'api'
        ];

        test('devrait accepter tous les modules valides', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.allmodules@example.com',
                modules: validModules
            });

            expect([200, 201]).toContain(response.status);
        });

        test('devrait accepter un seul module', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.singlemodule@example.com',
                modules: ['excel']
            });

            expect([200, 201]).toContain(response.status);
        });
    });

    // Test 8: Code de parrainage
    describe('Code de parrainage', () => {

        test('devrait accepter un code de parrainage valide', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.referral@example.com',
                refCode: 'VALID_REF_CODE'
            }, {
                headers: {
                    'Cookie': 'ref_code=VALID_REF_CODE'
                }
            });

            expect([200, 201]).toContain(response.status);
        });
    });

    // Test 9: Caractères spéciaux
    describe('Caractères spéciaux et internationalisation', () => {

        test('devrait accepter les accents dans le nom', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'François',
                lastName: 'Éléonore',
                email: 'francois.eleonore@example.com'
            });

            expect([200, 201]).toContain(response.status);
        });

        test('devrait accepter les caractères arabes', async () => {
            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'محمد',
                lastName: 'بن عودة',
                email: 'mohamed@example.com'
            });

            expect([200, 201]).toContain(response.status);
        });
    });

    // Test 10: Limites de longueur
    describe('Limites de longueur des champs', () => {

        test('devrait accepter nom long (100 caractères)', async () => {
            const longName = 'A'.repeat(100);

            const response = await PythonRegistrationTest.sendRequest({
                firstName: longName,
                lastName: 'Dupont',
                email: 'jean.long@example.com'
            });

            expect([200, 201]).toContain(response.status);
        });

        test('devrait accepter description de projet longue (1000 caractères)', async () => {
            const longProject = 'A'.repeat(1000);

            const response = await PythonRegistrationTest.sendRequest({
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.longproject@example.com',
                project: longProject
            });

            expect([200, 201]).toContain(response.status);
        });
    });
});
