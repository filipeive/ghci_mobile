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

    // Write ONLY the code definitions to the .hs file (proper Haskell source)
    const moduleCode = code || '';

    fs.writeFile(filepath, moduleCode, (err) => {
        if (err) {
            return res.status(500).json({ success: false, output: 'Erro no servidor: falha ao criar arquivo.' });
        }

        // Build GHCi stdin commands:
        // 1. :load the file (parsed as proper Haskell with correct indentation)
        // 2. Evaluate the expression (if any)
        // 3. :quit
        let stdinCommands = `:load ${filepath}\n`;
        if (expression) {
            stdinCommands += `${expression}\n`;
        }
        stdinCommands += `:quit\n`;

        // Write stdin commands to a separate temp file
        const stdinFile = path.join(tempDir, `stdin_${crypto.randomBytes(4).toString('hex')}.txt`);
        fs.writeFile(stdinFile, stdinCommands, (err2) => {
            if (err2) {
                fs.unlink(filepath, () => {});
                return res.status(500).json({ success: false, output: 'Erro no servidor.' });
            }

            exec(`ghci -v0 -ignore-dot-ghci < "${stdinFile}"`, { timeout: 15000 }, (execErr, stdout, stderr) => {
                // Cleanup temp files
                fs.unlink(filepath, () => {});
                fs.unlink(stdinFile, () => {});

                if (execErr && execErr.killed) {
                    return res.status(200).json({
                        success: false,
                        output: '⚠️ Erro: Tempo Limite Excedido (15 Segundos).\nO código demorou muito para responder. Cuidado com possíveis loops infinitos.'
                    });
                }

                let output = (stdout || '') + (stderr || '');
                let cleanOutput = output;

                // Cleanup GHCi noise
                cleanOutput = cleanOutput.replace(/GHCi, version.*?(?:\n|\r\n)/g, '');
                cleanOutput = cleanOutput.replace(/Leaving GHCi\./g, '');
                cleanOutput = cleanOutput.replace(/\[[\d]+ of [\d]+\] Compiling.*?(?:\n|\r\n)/g, ''); // Remove module compilation messages
                cleanOutput = cleanOutput.replace(/Ok,.*?loaded\..*?(?:\n|\r\n)/g, ''); // Remove "Ok, modules loaded." 
                cleanOutput = cleanOutput.replace(/^.*?>\s?/gm, ''); // Removes 'Prelude> ', 'ghci> ', '*Main> ' etc.

                cleanOutput = cleanOutput.trim();

                return res.status(200).json({
                    success: !execErr || execErr.code === 0,
                    output: cleanOutput || '(Nenhuma saída gerada)'
                });
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`GHCi PWA Server running on http://localhost:${PORT}`);
});
