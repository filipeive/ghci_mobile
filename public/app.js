document.addEventListener('DOMContentLoaded', () => {
    // ===== CODEMIRROR EDITOR =====
    const editor = CodeMirror(document.getElementById('editor-wrapper'), {
        mode: 'haskell',
        theme: 'material-darker',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        indentUnit: 2,
        tabSize: 2,
        indentWithTabs: false,
        lineWrapping: false,
        placeholder: 'main = putStrLn "Olá GHCi Mobile!"',
        extraKeys: {
            'Tab': (cm) => cm.replaceSelection('  ', 'end')
        }
    });

    // Make editor fill its container
    editor.setSize('100%', '100%');

    // ===== DOM ELEMENTS =====
    const runBtn = document.getElementById('run-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const clearBtn = document.getElementById('clear-btn');
    const toastEl = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const uploadBtn = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');
    const usefulCmds = document.getElementById('useful-cmds');
    const terminalInput = document.getElementById('terminal-input');
    const sendExprBtn = document.getElementById('send-expr-btn');
    const downloadBtn = document.getElementById('download-btn');
    const installBtn = document.getElementById('install-btn');
    const newBtn = document.getElementById('new-btn');
    const searchBtn = document.getElementById('search-btn');

    let deferredPrompt;
    let toastTimer = null;

    // ===== SEARCH FUNCTIONALITY =====
    searchBtn.addEventListener('click', () => {
        editor.execCommand('find');
    });

    // ===== TOAST NOTIFICATION SYSTEM =====
    function showToast(message, type = 'info') {
        toastMsg.textContent = message;
        
        // Set icon
        const icon = toastEl.querySelector('ion-icon');
        if (type === 'success') icon.name = 'checkmark-circle-outline';
        else if (type === 'error') icon.name = 'alert-circle-outline';
        else icon.name = 'information-circle-outline';

        // Set class
        toastEl.className = `toast toast-${type} show`;

        // Auto-dismiss
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    }

    // ===== PWA INSTALLATION =====
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') installBtn.classList.add('hidden');
        deferredPrompt = null;
    });

    // ===== FILE OPERATIONS =====
    downloadBtn.addEventListener('click', () => {
        const code = editor.getValue();
        if (!code.trim()) {
            showToast('Editor vazio', 'error');
            return;
        }
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exercicio.hs';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Código exportado como exercicio.hs', 'success');
    });

    uploadBtn.addEventListener('click', () => fileUpload.click());

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            editor.setValue(ev.target.result);
            showToast(`Arquivo "${file.name}" carregado`, 'success');
        };
        reader.readAsText(file);
        fileUpload.value = '';
    });

    newBtn.addEventListener('click', () => {
        if (editor.getValue().trim() && !confirm('Limpar todo o código do editor?')) return;
        editor.setValue('');
        showToast('Editor limpo', 'info');
    });

    // ===== TEMPLATES =====
    usefulCmds.addEventListener('change', (e) => {
        let cmd = e.target.value;
        if (!cmd) return;
        
        // Decode HTML entities
        cmd = cmd.replace(/&#34;/g, '"');

        // Insert at cursor
        const cursor = editor.getCursor();
        editor.replaceRange(cmd, cursor);
        editor.focus();
        
        usefulCmds.value = '';
    });

    // ===== TERMINAL REPL =====
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') processExpression();
    });

    sendExprBtn.addEventListener('click', processExpression);

    async function processExpression() {
        const expr = terminalInput.value.trim();
        if (!expr) return;

        const code = editor.getValue().trim();
        terminalInput.value = '';

        appendOutput(`ghci> ${expr}`, 'info');

        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, expression: expr })
            });
            const data = await response.json();
            appendOutput(data.output, data.success ? 'success' : 'error');
        } catch (error) {
            appendOutput('Erro de conexão com o servidor.', 'error');
        }
    }

    // ===== RUN BUTTON =====
    runBtn.addEventListener('click', async () => {
        const code = editor.getValue().trim();
        if (!code) {
            showToast('Editor vazio — escreva algum código Haskell', 'error');
            return;
        }

        // Visual feedback
        const runText = runBtn.querySelector('#run-text');
        const runIcon = runBtn.querySelector('#run-icon');
        runText.textContent = 'Compilando...';
        runIcon.name = 'hourglass-outline';
        runBtn.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await response.json();

            if (data.success) {
                if (data.output.includes('Módulos carregados com sucesso')) {
                    showToast('Código carregado com sucesso ✓', 'success');
                } else {
                    appendOutput(data.output, 'success');
                }
            } else {
                appendOutput(data.output, 'error');
            }
        } catch (error) {
            showToast('Servidor offline ou erro de rede', 'error');
        } finally {
            runText.textContent = 'Rodar';
            runIcon.name = 'play';
            runBtn.style.pointerEvents = '';
        }
    });

    // ===== CLEAR TERMINAL =====
    clearBtn.addEventListener('click', () => {
        terminalOutput.innerHTML = '<div id="terminal-placeholder" class="terminal-placeholder">Terminal limpo</div>';
        showToast('Terminal limpo', 'info');
    });

    // ===== OUTPUT RENDERING =====
    function appendOutput(text, type) {
        // Remove placeholder
        const placeholder = document.getElementById('terminal-placeholder');
        if (placeholder) placeholder.remove();

        const div = document.createElement('div');
        div.className = `output-line ${type}`;
        div.textContent = text;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});
