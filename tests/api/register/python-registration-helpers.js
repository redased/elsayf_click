/**
 * Helpers pour les tests d'inscription Python
 *
 * Ces fonctions facilitent les tests de l'API d'inscription Python
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class PythonRegistrationTest {
    /**
     * Simule une requête à l'API d'inscription Python
     * @param {Object} data - Données d'inscription
     * @param {Object} options - Options supplémentaires (headers, etc.)
     * @returns {Promise<{status: number, data: any}>}
     */
    static async sendRequest(data, options = {}) {
        try {
            const defaultOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data)
            };

            const finalOptions = { ...defaultOptions, ...options };

            // Toujours utiliser le mock pour les tests unitaires
            // Pour tester l'API réelle, utilisez TEST_REAL_API=true
            if (process.env.TEST_REAL_API !== 'true') {
                return this.mockRequest(data, finalOptions);
            }

            // Requête réelle
            const response = await fetch(`${API_URL}/api/register/python`, finalOptions);
            const responseData = await response.json();

            return {
                status: response.status,
                data: responseData
            };
        } catch (error) {
            return {
                status: 500,
                data: { error: error.message }
            };
        }
    }

    /**
     * Simule une requête pour les tests unitaires
     * @param {Object} data - Données d'inscription
     * @param {Object} options - Options de la requête
     * @returns {Promise<{status: number, data: any}>}
     */
    static async mockRequest(data, options) {
        const { firstName, lastName, email, phone, filiere, modules, otherModule, project, customRequest } = data;

        // Validation des champs obligatoires
        if (!firstName || !lastName || !email) {
            return {
                status: 400,
                data: { error: 'Les champs nom, prénom et email sont obligatoires' }
            };
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                status: 400,
                data: { error: 'Adresse email invalide' }
            };
        }

        // Simulation d'un utilisateur existant
        if (email === 'duplicate@example.com') {
            return {
                status: 409,
                data: { error: 'Un utilisateur avec cet email existe déjà' }
            };
        }

        // Succès
        return {
            status: 201,
            data: {
                success: true,
                message: 'Inscription réussie',
                user: {
                    id: 'mock-user-id',
                    name: `${firstName} ${lastName}`,
                    email: email
                }
            }
        };
    }

    /**
     * Génère des données de test aléatoires
     * @param {Object} overrides - Champs à override
     * @returns {Object} Données de test
     */
    static generateTestData(overrides = {}) {
        const randomId = Math.floor(Math.random() * 10000);

        return {
            firstName: 'Test',
            lastName: `User${randomId}`,
            email: `test.user${randomId}@example.com`,
            phone: '+213555123456',
            filiere: 'OBAC',
            modules: ['excel', 'word'],
            otherModule: '',
            project: 'Projet de test',
            customRequest: 'Demande de test',
            ...overrides
        };
    }

    /**
     * Teste un scénario complet d'inscription
     * @param {Object} testData - Données à tester
     * @returns {Promise<boolean>} Succès ou échec
     */
    static async testFullRegistration(testData) {
        const response = await this.sendRequest(testData);

        console.log('Test Result:', {
            status: response.status,
            data: response.data
        });

        return response.status === 201 || response.status === 200;
    }

    /**
     * Valide tous les scénarios de test
     * @returns {Promise<Object>} Résultats des tests
     */
    static async runAllTests() {
        const results = {
            passed: 0,
            failed: 0,
            tests: []
        };

        // Test 1: Champs minimaux
        try {
            const test1 = await this.testFullRegistration(this.generateTestData({
                phone: '',
                filiere: '',
                modules: []
            }));
            results.tests.push({ name: 'Champs minimaux', passed: test1 });
            if (test1) results.passed++; else results.failed++;
        } catch (e) {
            results.tests.push({ name: 'Champs minimaux', passed: false, error: e.message });
            results.failed++;
        }

        // Test 2: Tous les champs
        try {
            const test2 = await this.testFullRegistration(this.generateTestData());
            results.tests.push({ name: 'Tous les champs', passed: test2 });
            if (test2) results.passed++; else results.failed++;
        } catch (e) {
            results.tests.push({ name: 'Tous les champs', passed: false, error: e.message });
            results.failed++;
        }

        // Test 3: Email invalide
        try {
            const test3 = await this.sendRequest(this.generateTestData({
                email: 'invalid-email'
            }));
            const passed = test3.status === 400;
            results.tests.push({ name: 'Email invalide', passed: passed });
            if (passed) results.passed++; else results.failed++;
        } catch (e) {
            results.tests.push({ name: 'Email invalide', passed: false, error: e.message });
            results.failed++;
        }

        // Test 4: Champs manquants
        try {
            const test4 = await this.sendRequest({
                firstName: '',
                lastName: 'Test',
                email: 'test@example.com'
            });
            const passed = test4.status === 400;
            results.tests.push({ name: 'Champs manquants', passed: passed });
            if (passed) results.passed++; else results.failed++;
        } catch (e) {
            results.tests.push({ name: 'Champs manquants', passed: false, error: e.message });
            results.failed++;
        }

        return results;
    }
}

module.exports = { PythonRegistrationTest };

// Exécution si appelé directement
if (require.main === module) {
    (async () => {
        console.log('🧪 Exécution des tests d\'inscription Python...\n');

        const results = await PythonRegistrationTest.runAllTests();

        console.log('\n📊 Résultats:');
        console.log(`✅ Passés: ${results.passed}`);
        console.log(`❌ Échoués: ${results.failed}`);
        console.log(`📈 Taux de réussite: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

        console.log('\n📋 Détails:');
        results.tests.forEach(test => {
            const icon = test.passed ? '✅' : '❌';
            console.log(`${icon} ${test.name}${test.error ? ` - ${test.error}` : ''}`);
        });

        process.exit(results.failed > 0 ? 1 : 0);
    })();
}
