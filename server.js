const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const rateLimit = require('express-rate-limit');

// Rate limiting to prevent abuse (classroom-friendly: 60 req/min per IP)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per minute (1 per second avg)
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, output: '⚠️ Muitas requisições. Por favor, aguarde um momento antes de tentar novamente.' }
});

app.use(cors());
app.use(express.json({ limit: '500kb' })); // Limit body size to 500KB
app.use('/api/', limiter); // Apply rate limit to all API routes

// Serve the PWA from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

app.post('/api/run', (req, res) => {
    const { code, expression } = req.body;
    if (!code && !expression) {
        return res.status(400).json({ success: false, output: 'Erro: Nenhum código ou expressão fornecida.' });
    }

    // Security Check: Block dangerous modules/functions
    const forbiddenPatterns = [
        'System.Process',
        'System.IO.Unsafe',
        'System.Directory',
        'System.Posix',
        'Network.Socket',
        'GHC.IO.Handle',
        'foreign import',
        'unsafePerformIO'
    ];

    const fullCode = `${code} ${expression}`;
    for (const pattern of forbiddenPatterns) {
        if (fullCode.includes(pattern)) {
            return res.status(403).json({
                success: false,
                output: `❌ Acesso Negado: O uso do módulo ou função '${pattern}' não é permitido por razões de segurança.`
            });
        }
    }

    const { exec } = require('child_process');
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filename = `script_${crypto.randomBytes(4).toString('hex')}.hs`;
    const filepath = path.join(tempDir, filename);

    // If expression exists, we run context + expression. Otherwise just context.
    const fullInput = expression ? `${code}\n${expression}\n:quit\n` : `${code}\n:quit\n`;

    fs.writeFile(filepath, fullInput, (err) => {
        if (err) {
            return res.status(500).json({ success: false, output: 'Erro no servidor: falha ao criar arquivo.' });
        }

        exec(`ghci -v0 -ignore-dot-ghci < "${filepath}"`, { timeout: 15000 }, (execErr, stdout, stderr) => {
            fs.unlink(filepath, () => { });

            if (execErr && execErr.killed) {
                return res.status(200).json({
                    success: false,
                    output: '⚠️ Erro: Tempo Limite Excedido (15 Segundos).\nO código demorou muito para responder. Cuidado com possíveis loops infinitos.'
                });
            }

            let output = stdout || stderr || '';
            let cleanOutput = output;

            // Cleanup GHCi noise more aggressively
            cleanOutput = cleanOutput.replace(/GHCi, version.*?(?:\n|\r\n)/g, '');
            cleanOutput = cleanOutput.replace(/Leaving GHCi\./g, '');
            cleanOutput = cleanOutput.replace(/^.*?>\s?/gm, ''); // Removes 'Prelude> ', 'ghci> ', etc. at the start of any line

            cleanOutput = cleanOutput.trim();

            return res.status(200).json({
                success: !execErr || execErr.code === 0,
                output: cleanOutput || '(Nenhuma saída gerada)'
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`GHCi PWA Server running on http://localhost:${PORT}`);
});
