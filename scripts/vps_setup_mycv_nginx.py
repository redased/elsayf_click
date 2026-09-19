import paramiko
import os

def setup_nginx():
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

    listen 80;
    listen [::]:80;
}
"""

    sftp = ssh.open_sftp()
    with sftp.file('/etc/nginx/sites-available/mycv', 'w') as f:
        f.write(nginx_conf)
    sftp.close()

    stdin, stdout, stderr = ssh.exec_command('ln -sf /etc/nginx/sites-available/mycv /etc/nginx/sites-enabled/mycv && nginx -t && systemctl reload nginx')
    out = stdout.read().decode('ascii', 'replace')
    err = stderr.read().decode('ascii', 'replace')
    print('STDOUT:', out)
    print('STDERR:', err)
    ssh.close()

if __name__ == '__main__':
    setup_nginx()
