document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const highlighterOverlay = document.getElementById('highlighter-overlay');
    const highlightContent = document.getElementById('highlight-content');
    const lineNumbers = document.getElementById('line-numbers');
    const runBtn = document.getElementById('run-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const clearBtn = document.getElementById('clear-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    // Novas funcionalidades
    const uploadBtn = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');
    const usefulCmds = document.getElementById('useful-cmds');
    const terminalInput = document.getElementById('terminal-input');
    const sendExprBtn = document.getElementById('send-expr-btn');
    const downloadBtn = document.getElementById('download-btn');
    const installBtn = document.getElementById('install-btn');

    let deferredPrompt;

    // Sistema de Notificação (Toast)
    function showToast(message, type = 'info') {
        toastMessage.textContent = message;
        
        // Reset styles/icons based on type
        if (type === 'success') {
            toastIcon.name = 'checkmark-circle';
            toastIcon.className = 'text-emerald-500 text-lg';
        } else if (type === 'error') {
            toastIcon.name = 'alert-circle';
            toastIcon.className = 'text-rose-500 text-lg';
        } else {
            toastIcon.name = 'information-circle';
            toastIcon.className = 'text-primary-500 text-lg';
        }

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Sincronização do Highlighter
    function syncHighlighter() {
        const content = codeEditor.value;
        // Escape HTML
        highlightContent.textContent = content;
        // Trigger Prism
        Prism.highlightElement(highlightContent);
        // Sync scroll (Vertical e Horizontal)
        highlighterOverlay.scrollTop = codeEditor.scrollTop;
        highlighterOverlay.scrollLeft = codeEditor.scrollLeft;
    }

    // Lógica de Instalação PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBtn.classList.add('hidden');
        }
        deferredPrompt = null;
    });

    // Exportar Código (.hs)
    downloadBtn.addEventListener('click', () => {
        const code = codeEditor.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exercicio.hs';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Código exportado com sucesso', 'success');
    });

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
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }

    const newBtn = document.getElementById('new-btn');

    // Novo Arquivo (Limpar)
    newBtn.addEventListener('click', () => {
        if (confirm('Limpar todo o código do editor?')) {
            codeEditor.value = '';
            syncHighlighter();
            updateLineNumbers();
            showToast('Editor limpo', 'info');
        }
    });

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
            syncHighlighter();
            updateLineNumbers();
            showToast('Arquivo carregado', 'success');
        };
        reader.readAsText(file);
        
        // Reset file input
        fileUpload.value = '';
    });

    // Comandos Úteis e Templates
    usefulCmds.addEventListener('change', (e) => {
        let cmd = e.target.value;
        if (!cmd) return;
        
        cmd = cmd.split('&#34;').join('"');

        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        codeEditor.value = codeEditor.value.substring(0, start) + cmd + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + cmd.length;
        
        codeEditor.focus();
        syncHighlighter();
        updateLineNumbers();
        
        usefulCmds.value = '';
    });

    // Sync editor effects
    codeEditor.addEventListener('input', () => {
        syncHighlighter();
        updateLineNumbers();
    });

    codeEditor.addEventListener('scroll', () => {
        highlighterOverlay.scrollTop = codeEditor.scrollTop;
        highlighterOverlay.scrollLeft = codeEditor.scrollLeft;
        lineNumbers.scrollTop = codeEditor.scrollTop;
    });

    // Handle tab key
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
            syncHighlighter();
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
        terminalOutput.innerHTML = '<div class="text-slate-500 italic text-xs">Excluído com sucesso. Aguardando novos comandos...</div>';
        showToast('Saída do terminal limpa', 'info');
    });

    runBtn.addEventListener('click', async () => {
        const code = codeEditor.value.trim();
        if (!code) {
            showToast('O editor está vazio', 'error');
            return;
        }

        runBtn.classList.add('loading');
        runBtn.querySelector('span').innerText = 'Processando...';
        
        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.success) {
                // If it's a success message without real code output, show toast
                if (data.output.includes('Módulos carregados com sucesso')) {
                    showToast('Código carregado com sucesso', 'success');
                } else {
                    appendOutput(data.output, 'success');
                }
            } else {
                appendOutput(data.output, 'error');
            }
        } catch (error) {
            showToast('Erro de conexão com o servidor', 'error');
        } finally {
            runBtn.classList.remove('loading');
            runBtn.querySelector('span').innerText = 'Rodar / Carregar';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    function appendOutput(text, type) {
        const div = document.createElement('div');
        
        let colorClass = 'text-slate-300';
        if (type === 'error') colorClass = 'text-rose-400 font-semibold';
        if (type === 'success') colorClass = 'text-emerald-400 font-medium';
        if (type === 'info') colorClass = 'text-primary-400';

        div.className = `terminal-text ${colorClass} whitespace-pre-wrap break-all border-l-2 ${type === 'error' ? 'border-rose-500' : 'border-primary-500'} pl-3 py-1 bg-white/5 rounded-r-lg`;
        div.textContent = text;
        
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Initial sync
    syncHighlighter();
});
