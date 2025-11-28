const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('base64');

// Output for display
console.log('\n🔑 Згенерований NEXTAUTH_SECRET:');
console.log(secret);
console.log('\n📝 Скопіюйте це значення в .env файл як NEXTAUTH_SECRET\n');

// Output just the secret for script usage (last line)
console.log(secret);

