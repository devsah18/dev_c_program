# Dev C Program - Working C Compiler

## Structure

- `index.html`, `style.css`, `script.js` = GitHub Pages frontend
- `backend/` = Flask + GCC compiler API

GitHub Pages is static, so it cannot compile C itself. Deploy the `backend` as a separate web service.

## Deploy backend on Render

1. Push this project to GitHub.
2. In Render, create **New → Web Service**.
3. Select the same repository.
4. Set **Language = Docker**.
5. Set Dockerfile path to `backend/Dockerfile` if the Dockerfile is not at the repository root.
6. Deploy.
7. Open `https://YOUR-SERVICE.onrender.com/health`.
8. It should return JSON showing `"status": "ok"` and a GCC path.
9. Copy your Render service URL.
10. In `script.js`, replace:
   `https://YOUR-BACKEND.onrender.com/run`
   with:
   `https://YOUR-SERVICE.onrender.com/run`
11. Commit and push `script.js`.
12. Open your GitHub Pages site and test **Run Code**.

## Local backend

Linux/macOS:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Windows PowerShell:
```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

You also need GCC installed locally. Then temporarily set the frontend API URL to:
`http://127.0.0.1:10000/run`

## Important security note

This is a starter educational compiler service, not a hardened public code-execution sandbox. Do not use it for untrusted internet traffic at scale without stronger isolation, resource limits, rate limiting, authentication and network restrictions.
