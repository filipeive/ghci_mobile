document.addEventListener('DOMContentLoaded', () => {

    // ===== HASKELL AUTOCOMPLETE DICTIONARY =====
    const haskellKeywords = [
        'case', 'class', 'data', 'deriving', 'do', 'else', 'if', 'import',
        'in', 'infixl', 'infixr', 'instance', 'let', 'module', 'newtype',
        'of', 'otherwise', 'then', 'type', 'where', 'forall', 'qualified',
        'as', 'hiding', 'default', 'foreign'
    ];

    const haskellTypes = [
        'Int', 'Integer', 'Float', 'Double', 'Char', 'String', 'Bool',
        'Maybe', 'Just', 'Nothing', 'Either', 'Left', 'Right', 'IO',
        'True', 'False', 'Ordering', 'EQ', 'LT', 'GT',
        'Show', 'Read', 'Eq', 'Ord', 'Num', 'Enum', 'Bounded',
        'Integral', 'Fractional', 'Floating', 'Functor', 'Monad',
        'Applicative', 'Foldable', 'Traversable'
    ];

    const haskellFunctions = [
        // Prelude
        'abs', 'acos', 'acosh', 'all', 'and', 'any', 'appendFile',
        'asin', 'asinh', 'atan', 'atanh', 'break', 'ceiling', 'compare',
        'concat', 'concatMap', 'const', 'cos', 'cosh', 'curry', 'cycle',
        'div', 'drop', 'dropWhile', 'elem', 'error', 'even', 'exp',
        'filter', 'flip', 'floor', 'fmap', 'foldl', 'foldl1', 'foldr',
        'foldr1', 'fromInteger', 'fromIntegral', 'fst', 'gcd', 'getChar',
        'getLine', 'head', 'id', 'init', 'interact', 'iterate', 'last',
        'lcm', 'length', 'lines', 'log', 'lookup', 'map', 'mapM', 'mapM_',
        'max', 'maximum', 'min', 'minimum', 'mod', 'negate', 'not', 'notElem',
        'null', 'odd', 'or', 'otherwise', 'pi', 'pred', 'print', 'product',
        'putChar', 'putStr', 'putStrLn', 'quot', 'quotRem', 'read',
        'readFile', 'readLn', 'rem', 'repeat', 'replicate', 'return',
        'reverse', 'round', 'scanl', 'scanl1', 'scanr', 'scanr1',
        'sequence', 'sequence_', 'show', 'signum', 'sin', 'sinh', 'snd',
        'sort', 'span', 'splitAt', 'sqrt', 'succ', 'sum', 'tail', 'take',
        'takeWhile', 'tan', 'tanh', 'toInteger', 'truncate', 'uncurry',
        'undefined', 'unlines', 'until', 'unwords', 'unzip', 'unzip3',
        'words', 'writeFile', 'zip', 'zip3', 'zipWith', 'zipWith3',
        // Data.List
        'group', 'groupBy', 'intercalate', 'intersperse', 'isInfixOf',
        'isPrefixOf', 'isSuffixOf', 'nub', 'nubBy', 'partition',
        'permutations', 'sortBy', 'sortOn', 'subsequences', 'transpose',
        'union', 'intersect',
        // Data.Maybe
        'fromJust', 'fromMaybe', 'isJust', 'isNothing', 'maybe',
        'catMaybes', 'mapMaybe', 'listToMaybe', 'maybeToList'
    ];

    // Custom hint function
    function haskellHint(cm) {
        const cur = cm.getCursor();
        const token = cm.getTokenAt(cur);
        let start = token.start;
        let end = cur.ch;
        const word = token.string.slice(0, end - start);

        // Don't hint inside strings or comments
        if (token.type === 'string' || token.type === 'comment') return null;

        // Need at least 2 chars to trigger
        if (word.length < 2) return null;

        const lower = word.toLowerCase();

        // Collect user-defined identifiers from the document
        const docText = cm.getValue();
        const userWords = new Set();
        const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_']*)\b/g;
        let match;
        while ((match = identifierRegex.exec(docText)) !== null) {
            const w = match[1];
            if (w.length >= 2 && w !== word) userWords.add(w);
        }

        // Build suggestions with categories
        const suggestions = [];
        const seen = new Set();

        function addMatches(list, category, badgeClass) {
            for (const item of list) {
                if (seen.has(item)) continue;
                if (item.toLowerCase().startsWith(lower)) {
                    seen.add(item);
                    suggestions.push({
                        text: item,
                        displayText: item,
                        category: category,
                        badgeClass: badgeClass,
                        render: function(el, self, data) {
                            const badge = document.createElement('span');
                            badge.className = 'hint-badge ' + data.badgeClass;
                            badge.textContent = data.category;
                            el.appendChild(badge);
                            el.appendChild(document.createTextNode(data.displayText));
                        }
                    });
                }
            }
        }

        addMatches(haskellKeywords, 'KW', 'hint-badge-keyword');
        addMatches(haskellTypes, 'TYPE', 'hint-badge-type');
        addMatches(haskellFunctions, 'FN', 'hint-badge-fn');
        addMatches([...userWords], 'VAR', 'hint-badge-var');

        if (suggestions.length === 0) return null;

        return {
            list: suggestions,
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
        };
    }

    // Register hint helper
    CodeMirror.registerHelper('hint', 'haskell', haskellHint);

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
        lineWrapping: true,
        placeholder: 'main = putStrLn "Olá GHCi Mobile!"',
        hintOptions: {
            completeSingle: false,
            alignWithWord: true
        },
        extraKeys: {
            'Tab': (cm) => cm.replaceSelection('  ', 'end'),
            'Ctrl-Space': (cm) => cm.showHint({ hint: haskellHint })
        }
    });

    // Make editor fill its container
    editor.setSize('100%', '100%');

    // ===== AUTO-TRIGGER AUTOCOMPLETE (debounced) =====
    let hintTimeout = null;
    editor.on('inputRead', (cm, change) => {
        // Only trigger on character input, not deletions or pastes
        if (change.origin !== '+input') return;
        const ch = change.text[0];
        // Don't trigger on whitespace or special chars
        if (!ch || /\s/.test(ch)) return;

        if (hintTimeout) clearTimeout(hintTimeout);
        hintTimeout = setTimeout(() => {
            // Check if a hint menu is already open
            if (cm.state.completionActive) return;
            cm.showHint({ hint: haskellHint, completeSingle: false });
        }, 300);
    });

    // ===== PERSISTENCE =====
    const savedCode = localStorage.getItem('ghci_mobile_code');
    if (savedCode) {
        editor.setValue(savedCode);
    }

    editor.on('change', (cm) => {
        localStorage.setItem('ghci_mobile_code', cm.getValue());
    });

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
        localStorage.removeItem('ghci_mobile_code');
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
