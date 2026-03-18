const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

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

        exec(`ghci -ignore-dot-ghci < "${filepath}"`, { timeout: 15000 }, (execErr, stdout, stderr) => {
            fs.unlink(filepath, () => {});

            if (execErr && execErr.killed) {
                return res.status(200).json({ 
                    success: false, 
                    output: '⚠️ Erro: Tempo Limite Excedido (15 Segundos).\nO código demorou muito para responder. Cuidado com possíveis loops infinitos.' 
                });
            }

            let output = stdout || stderr || '';
            let cleanOutput = output;
            
            // Cleanup GHCi noise
            cleanOutput = cleanOutput.replace(/GHCi, version.*?(?:\n|\r\n)/g, '');
            cleanOutput = cleanOutput.replace(/ghci> /g, '');
            cleanOutput = cleanOutput.replace(/Leaving GHCi\./g, '');
            
            // If we ran an expression, GHCi usually echoes the input code in stdout if it was large
            // or just outputs the result. We want the last lines mostly.
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
