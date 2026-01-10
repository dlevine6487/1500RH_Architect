
const fs = require('fs');
const crypto = require('crypto');

const FILE_NAME = 'S71500RH Strategy Architect_v2.html';

function generateCSP() {
    try {
        let content = fs.readFileSync(FILE_NAME, 'utf8');

        // Find all content inside <script> tags
        const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
        const allScripts = [...content.matchAll(scriptRegex)];

        if (allScripts.length === 0) {
            console.log("No <script> tag found in the file.");
            return;
        }

        console.log(`Found ${allScripts.length} script blocks.`);

        const allHashes = allScripts.map((m, index) => {
            const scriptContent = m[1];
            const hash = crypto
                .createHash('sha256')
                .update(scriptContent, 'utf8')
                .digest('base64');
            return `'sha256-${hash}'`;
        }).join(' ');

        // Update the Meta Tag to split script-src and style-src
        const metaRegex = /<meta http-equiv="Content-Security-Policy" content="(.*?)">/;

        // We permit unsafe-inline for styles to support the inline CSS and style attributes
        // We use hashes for scripts
        // We allow data: and blob: for images/PDFs
        // We explicitly block object-src to prevent Flash/applets
        const newCspContent = `default-src 'self' data: blob:; script-src 'self' ${allHashes}; style-src 'self' 'unsafe-inline'; object-src 'none';`;

        const updatedContent = content.replace(metaRegex, `<meta http-equiv="Content-Security-Policy" content="${newCspContent}">`);

        fs.writeFileSync(FILE_NAME, updatedContent, 'utf8');

        console.log(`✅ Success! Updated CSP with split policy.`);
        console.log(`New CSP: ${newCspContent}`);
    } catch (err) {
        console.error("❌ Error processing file:", err.message);
    }
}

generateCSP();
