import re

with open("/etc/nginx/sites-available/default", "r") as f:
    content = f.read()

# Find the ghci_mobile block and everything up to its closing brace
pattern = r'# === NODE/STATIC: GHCI MOBILE PWA ===.*?location /ghci_mobile \{[^}]*\}'
new_block = '''# === NODE/STATIC: GHCI MOBILE PWA ===
    location /ghci_mobile {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        alias /var/www/html/ghci_mobile/public;
        index index.html;
        try_files $uri $uri/ =404;
    }'''

result = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open("/etc/nginx/sites-available/default", "w") as f:
    f.write(result)

print("Nginx config fixed!")