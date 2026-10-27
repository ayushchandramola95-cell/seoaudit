import fs from 'fs';

const content = fs.readFileSync('C:/Users/anyar/.antigravity-ide/extensions/saoudrizwan.claude-dev-4.1.26-universal/dist/extension.js', 'utf8');

const providers = [];
const regex = /"apiProvider","([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  providers.push(match[1]);
}

console.log("Providers found:", Array.from(new Set(providers)));

// Search for gemini handler or GoogleHandler
const handlers = content.match(/[A-Za-z0-9_]+Handler/g);
console.log("Handlers found:", Array.from(new Set(handlers || [])).filter(h => h.toLowerCase().includes('gemini') || h.toLowerCase().includes('google') || h.toLowerCase().includes('vertex')));
