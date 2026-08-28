#!/usr/bin/env node

/**
 * Script pour exécuter les tests d'inscription Python
 *
 * Usage:
 * node tests/run-python-registration-tests.js
 */

const { PythonRegistrationTest } = require('./api/register/python-registration-helpers');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  🧪 Tests d\'inscription Python - El Sayf                   ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

(async () => {
    const startTime = Date.now();

    try {
        const results = await PythonRegistrationTest.runAllTests();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║  📊 Résultats des tests                                     ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        console.log(`⏱️  Durée: ${duration}s`);
        console.log(`✅ Tests passés: ${results.passed}`);
        console.log(`❌ Tests échoués: ${results.failed}`);
        console.log(`📈 Taux de réussite: ${results.passed + results.failed > 0 ? ((results.passed / (results.passed + results.failed)) * 100).toFixed(1) : 0}%\n`);

        console.log('📋 Détails des tests:\n');
        console.log('┌─────────────────────────────┬──────────┬──────────────────────┐');
        console.log('│ Test                        │ Statut   │ Détails              │');
        console.log('├─────────────────────────────┼──────────┼──────────────────────┤');

        results.tests.forEach((test, index) => {
            const status = test.passed ? '✅ PASS  ' : '❌ FAIL  ';
            const details = test.error ? test.error.substring(0, 20) : 'OK';
            console.log(`│ ${index + 1}. ${test.name.padEnd(25)} │ ${status} │ ${details.padEnd(20)} │`);
        });

        console.log('└─────────────────────────────┴──────────┴──────────────────────┘\n');

        // Test manuel avec l'API réelle
        if (process.env.TEST_REAL_API === 'true') {
            console.log('🌐 Test avec l\'API réelle...\n');

            const testData = PythonRegistrationTest.generateTestData({
                email: `real.test.${Date.now()}@example.com`
            });

            console.log('Données de test:');
            console.log(JSON.stringify(testData, null, 2));
            console.log();

            const realResult = await fetch('http://localhost:3000/api/register/python', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });

            console.log(`Status: ${realResult.status}`);
            const data = await realResult.json();
            console.log('Response:', data);
            console.log();
        }

        // Exit code basé sur les résultats
        process.exit(results.failed > 0 ? 1 : 0);

    } catch (error) {
        console.error('\n❌ Erreur lors de l\'exécution des tests:');
        console.error(error);
        process.exit(1);
    }
})();
