import paramiko
import os
import sys
import time

def deploy():
    key_path = os.path.expanduser('~/.ssh/id_ed25519_github')
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    k = paramiko.Ed25519Key.from_private_key_file(key_path)
    
    print("[1/3] Connexion SSH a 165.245.251.31...")
    ssh.connect('165.245.251.31', port=22, username='root', pkey=k, timeout=15)
    print("[2/3] Lancement du build Next.js de production sur le serveur...")

    cmd = "cd /root/elsayf && npm run build"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    for raw_line in iter(stdout.readline, ""):
        # Nettoyage ascii pour eviter tout bug de console Windows
        clean_line = raw_line.encode('ascii', 'replace').decode('ascii')
        sys.stdout.write(clean_line)
        sys.stdout.flush()

    status = stdout.channel.recv_exit_status()
    print(f"\nCode de sortie build : {status}")

    if status == 0:
        print("\n[3/3] Redemarrage de PM2 elsayf-web...")
        stdin, stdout, stderr = ssh.exec_command("pm2 restart elsayf-web && pm2 status")
        out = stdout.read().decode('ascii', 'replace')
        print(out)
        print("\n>>> DEPLOIEMENT TERMINE AVEC SUCCES SUR DIGITALOCEAN ! <<<")
    else:
        err = stderr.read().decode('ascii', 'replace')
        print(f"Erreur lors du build :\n{err}")

    ssh.close()

if __name__ == '__main__':
    deploy()
