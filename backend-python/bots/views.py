from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .scraper import scrape_metadata
import subprocess
import tempfile
import os
import sys

class ScrapeView(APIView):
    def post(self, request):
        target_url = request.data.get('url')
        if not target_url:
            return Response({'error': 'URL required'}, status=status.HTTP_400_BAD_REQUEST)
        result = scrape_metadata(target_url)
        return Response(result)

class StatusView(APIView):
    def get(self, request):
        return Response({'status': 'online', 'service': 'Bot Engine v1.0'})

class ExecuteView(APIView):
    def post(self, request):
        code = request.data.get('code', '')
        packages = request.data.get('packages', [])  # liste de pip packages à installer

        if not code:
            return Response({'output': 'Aucun code fourni.'})

        # Installer les packages demandés
        if packages:
            for pkg in packages[:10]:  # max 10 packages
                pkg = pkg.strip()
                if pkg and pkg.replace('-','').replace('_','').replace('.','').isalnum():
                    subprocess.run(
                        [sys.executable, '-m', 'pip', 'install', pkg, '-q'],
                        timeout=30, capture_output=True
                    )

        # Écrire le code dans un fichier temp
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
            f.write(code)
            tmp_path = f.name

        try:
            result = subprocess.run(
                [sys.executable, tmp_path],
                capture_output=True,
                text=True,
                timeout=15,
                env={**os.environ, 'MPLBACKEND': 'Agg'}  # matplotlib sans GUI
            )
            output = result.stdout
            if result.stderr:
                output += ('\n' if output else '') + result.stderr
            return Response({'output': output or '(Aucun output)'})
        except subprocess.TimeoutExpired:
            return Response({'output': 'Timeout: exécution > 15 secondes.'})
        except Exception as e:
            return Response({'output': f'Erreur: {str(e)}'})
        finally:
            os.unlink(tmp_path)
