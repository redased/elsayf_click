import paramiko
import os
import sys

def run_vps_cmd(cmd):
    key_path = os.path.expanduser('~/.ssh/id_ed25519_github')
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    k = paramiko.Ed25519Key.from_private_key_file(key_path)
    ssh.connect('165.245.251.31', port=22, username='root', pkey=k, timeout=15)
    
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('ascii', 'replace')
    err = stderr.read().decode('ascii', 'replace')
    
    if out:
        print(out)
    if err:
        sys.stderr.write(err + '\n')
        
    ssh.close()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        cmd = ' '.join(sys.argv[1:])
        run_vps_cmd(cmd)
    else:
        print("Usage: python scripts/vps_cmd.py <command>")
