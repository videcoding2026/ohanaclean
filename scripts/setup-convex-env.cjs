const { execSync } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname, '..');

const envVars = [
  ['VITE_CONVEX_SITE_URL', 'https://steady-owl-944.convex.site'],
  ['SITE_URL', 'https://steady-owl-944.convex.cloud'],
  ['JWT_ISSUER', 'https://steady-owl-944.convex.cloud'],
];

console.log('Configurando variaveis de ambiente do Convex...\n');

for (const [key, value] of envVars) {
  try {
    execSync(`npx convex env set ${key} "${value}"`, {
      cwd,
      stdio: 'inherit',
    });
    console.log(`  OK  ${key}`);
  } catch (err) {
    console.error(`  ERR ${key}: tente executar manualmente:\n  npx convex env set ${key} "${value}"\n`);
  }
}

console.log('\nPronto.');
