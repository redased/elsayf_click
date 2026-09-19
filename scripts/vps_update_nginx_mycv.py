import paramiko
import os

def update_nginx():
    key_path = os.path.expanduser('~/.ssh/id_ed25519_github')
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    k = paramiko.Ed25519Key.from_private_key_file(key_path)
    ssh.connect('165.245.251.31', port=22, username='root', pkey=k, timeout=15)

    nginx_conf = """server {
    server_name mycv.click www.mycv.click;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/mycv.click/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/mycv.click/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.mycv.click) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = mycv.click) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name mycv.click www.mycv.click;

    listen 80;
    listen [::]:80;
    return 404; # managed by Certbot
}
"""

    sftp = ssh.open_sftp()
    with sftp.file('/etc/nginx/sites-available/mycv', 'w') as f:
        f.write(nginx_conf)
    sftp.close()

    stdin, stdout, stderr = ssh.exec_command('nginx -t && systemctl reload nginx')
    out = stdout.read().decode('ascii', 'replace')
    err = stderr.read().decode('ascii', 'replace')
    print('STDOUT:', out)
    print('STDERR:', err)
    ssh.close()

if __name__ == '__main__':
    update_nginx()
