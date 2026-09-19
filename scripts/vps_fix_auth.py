import paramiko
import os
import sys

def fix_auth():
    key_path = os.path.expanduser('~/.ssh/id_ed25519_github')
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    k = paramiko.Ed25519Key.from_private_key_file(key_path)
    
    print("[1/4] Connexion SSH au VPS (165.245.251.31)...")
    ssh.connect('165.245.251.31', port=22, username='root', pkey=k, timeout=15)
    
    print("[2/4] Restauration du route.js NextAuth v5 officiel sur le VPS...")
    route_content = 'import { handlers } from "@/auth";\nexport const { GET, POST } = handlers;\n'
    # Write route.js directly via SFTP
    sftp = ssh.open_sftp()
    with sftp.open('/root/elsayf/src/app/api/auth/[...nextauth]/route.js', 'w') as f:
        f.write(route_content)
    
    # Also update auth.ts on VPS
    with open('src/auth.ts', 'r', encoding='utf-8') as f:
        local_auth_ts = f.read()
    with sftp.open('/root/elsayf/src/auth.ts', 'w') as f:
        f.write(local_auth_ts)
    sftp.close()
    print("Fichiers NextAuth v5 mis a jour avec succes sur le VPS !")

    print("\n[3/4] Compilation Next.js de production sur le VPS...")
    stdin, stdout, stderr = ssh.exec_command('cd /root/elsayf && npm run build')
    for raw_line in iter(stdout.readline, ""):
        sys.stdout.write(raw_line.encode('ascii', 'replace').decode('ascii'))
        sys.stdout.flush()
    status = stdout.channel.recv_exit_status()
    print(f"Code de sortie build : {status}")

    print("\n[4/4] Redemarrage de PM2 elsayf-web...")
    stdin, stdout, stderr = ssh.exec_command('pm2 restart elsayf-web && pm2 status')
    out = stdout.read().decode('ascii', 'replace')
    print(out)

    ssh.close()
    print("\n>>> CORRECTIF APPLIQUE ET REDEMARRE SUR DIGITALOCEAN ! <<<")

if __name__ == '__main__':
    fix_auth()
