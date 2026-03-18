document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const runBtn = document.getElementById('run-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const clearBtn = document.getElementById('clear-btn');
    
    // Novas funcionalidades
    const uploadBtn = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');
    const usefulCmds = document.getElementById('useful-cmds');
    const terminalInput = document.getElementById('terminal-input');
    const sendExprBtn = document.getElementById('send-expr-btn');

    // Execução de Expressão (REPL)
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processExpression();
        }
    });

    sendExprBtn.addEventListener('click', () => {
        processExpression();
    });

    async function processExpression() {
        const expr = terminalInput.value.trim();
        if (!expr) return;

        const code = codeEditor.value.trim();
        terminalInput.value = '';
        
        appendOutput(`ghci> ${expr}`, 'info');
        
        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, expression: expr })
            });

            const data = await response.json();
            if (data.success) {
                appendOutput(data.output, 'success');
            } else {
                appendOutput(data.output, 'error');
            }
        } catch (error) {
            appendOutput('Erro de conexão.', 'error');
        } finally {
            const terminalBody = document.querySelector('.terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    // Carregar Arquivo
    uploadBtn.addEventListener('click', () => {
        fileUpload.click();
    });

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            codeEditor.value = e.target.result;
            updateLineNumbers();
            appendOutput(`Arquivo '${file.name}' carregado com sucesso.`, 'success');
        };
        reader.readAsText(file);
        
        // Reset file input
        fileUpload.value = '';
    });

    // Comandos Úteis
    usefulCmds.addEventListener('change', (e) => {
        const cmd = e.target.value;
        if (!cmd) return;
        
        // Insert cmd at cursor or append
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        codeEditor.value = codeEditor.value.substring(0, start) + cmd + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + cmd.length;
        
        codeEditor.focus();
        updateLineNumbers();
        
        // Reset select
        usefulCmds.value = '';
    });

    // Sync line numbers
    codeEditor.addEventListener('input', () => {
        updateLineNumbers();
    });

    codeEditor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = codeEditor.scrollTop;
    });

    // Handle tab key in textarea (Preserves Undo History)
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            // Use execCommand to keep Undo/Redo history (Ctrl+Z)
            document.execCommand('insertText', false, '    ');
            updateLineNumbers();
        }
    });

    function updateLineNumbers() {
        const lines = codeEditor.value.split('\n').length;
        let lineNumbersHTML = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersHTML += i + '<br>';
        }
        lineNumbers.innerHTML = lineNumbersHTML;
    }

    clearBtn.addEventListener('click', () => {
        terminalOutput.innerHTML = '<span class="welcome-msg">Output limpo.</span>';
    });

    runBtn.addEventListener('click', async () => {
        const code = codeEditor.value.trim();
        if (!code) {
            appendOutput('O editor está vazio. Digite algum código Haskell.', 'error');
            return;
        }

        runBtn.classList.add('loading');
        runBtn.querySelector('span').innerText = 'Rodando...';
        appendOutput('Compilando e executando...', 'info');

        try {
            // Using absolute or relative path that points to self API
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.success) {
                appendOutput(data.output, 'success');
            } else {
                appendOutput(data.output, 'error');
            }
        } catch (error) {
            appendOutput('Erro de conexão. Servidor está offline?', 'error');
        } finally {
            runBtn.classList.remove('loading');
            runBtn.querySelector('span').innerText = 'Rodar';
            // Scroll to bottom of terminal
            const terminalBody = document.querySelector('.terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function appendOutput(text, type) {
        const div = document.createElement('div');
        
        let colorClass = 'text-slate-300';
        if (type === 'error') colorClass = 'error-text';
        if (type === 'success') colorClass = 'success-text';
        if (type === 'info') colorClass = 'info-text';
        if (type === 'repl') colorClass = 'repl-input-line';

        div.className = `terminal-text ${colorClass} whitespace-pre-wrap break-all`;
        div.textContent = text;
        
        terminalOutput.appendChild(div);
        
        // Auto scroll to bottom
        const terminalOutputArea = document.getElementById('terminal-output');
        terminalOutputArea.scrollTop = terminalOutputArea.scrollHeight;
    }
});
