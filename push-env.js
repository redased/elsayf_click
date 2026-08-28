const fs = require('fs');
const { execSync } = require('child_process');

try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split(/\r?\n/);

    const envVars = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const index = trimmed.indexOf('=');
        if (index > 0) {
            const key = trimmed.substring(0, index).trim();
            let val = trimmed.substring(index + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            envVars[key] = val;
        }
    }

    console.log('Found environment variables:', Object.keys(envVars));

    const targets = ['production', 'preview', 'development'];

    for (const [key, val] of Object.entries(envVars)) {
        if (!key) continue;
        console.log(`\nAdding/Overwriting ${key}...`);
        for (const target of targets) {
            try {
                const escapedVal = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$');
                console.log(`  -> ${target}...`);
                // Use --force to overwrite existing variables
                execSync(`npx -y vercel env add "${key}" "${target}" --value "${escapedVal}" --yes --force`, { stdio: 'ignore' });
                console.log(`  ✅ Done ${target}`);
            } catch (err) {
                console.error(`  ❌ Failed to add ${key} to ${target}`);
            }
        }
    }
    console.log('\nAll done!');
} catch (error) {
    console.error('Error running script:', error);
}
