import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://elsayf.click/api/cv/track"
events = [
    {"action": "CREATE", "templateId": "developer", "candidateTitle": "Ingénieur Fullstack & IA", "device": "desktop"},
    {"action": "DOWNLOAD_PDF", "templateId": "developer", "candidateTitle": "Ingénieur Fullstack & IA", "device": "desktop"},
    {"action": "CREATE", "templateId": "minimalist", "candidateTitle": "Étudiant Master Recherche", "device": "mobile"},
    {"action": "PRINT", "templateId": "minimalist", "candidateTitle": "Étudiant Master Recherche", "device": "mobile"},
    {"action": "EXPORT_JSON", "templateId": "executive", "candidateTitle": "Manager Stratégie & Finance", "device": "desktop"}
]

for ev in events:
    req = urllib.request.Request(
        url,
        data=json.dumps(ev).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, context=ctx) as response:
        print(ev["action"], "->", response.status, response.read().decode("utf-8"))

