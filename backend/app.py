import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

MAX_CODE = 50_000
MAX_INPUT = 20_000
MAX_OUTPUT = 64_000
COMPILE_TIMEOUT = 8
RUN_TIMEOUT = 3

def clean_output(value: str) -> str:
    value = value or ""
    if len(value) > MAX_OUTPUT:
        return value[:MAX_OUTPUT] + "\n\n[Output truncated]"
    return value

@app.get("/health")
def health():
    return jsonify({"status": "ok", "compiler": shutil.which("gcc") or "gcc not found"})

@app.post("/run")
def run_code():
    data = request.get_json(silent=True) or {}
    code = data.get("code", "")
    stdin = data.get("input", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify({"error": "C code is required."}), 400
    if not isinstance(stdin, str):
        return jsonify({"error": "Input must be text."}), 400
    if len(code) > MAX_CODE:
        return jsonify({"error": f"Code is too large. Maximum is {MAX_CODE} characters."}), 413
    if len(stdin) > MAX_INPUT:
        return jsonify({"error": f"Input is too large. Maximum is {MAX_INPUT} characters."}), 413

    gcc = shutil.which("gcc")
    if not gcc:
        return jsonify({"error": "GCC is not installed on the compiler server."}), 500

    with tempfile.TemporaryDirectory(prefix="devc_") as tmp:
        workdir = Path(tmp)
        source = workdir / "main.c"
        executable = workdir / "main"

        source.write_text(code, encoding="utf-8")

        compile_cmd = [
            gcc, str(source),
            "-std=c11", "-O2", "-pipe",
            "-Wall", "-Wextra",
            "-o", str(executable)
        ]

        try:
            compiled = subprocess.run(
                compile_cmd,
                cwd=workdir,
                capture_output=True,
                text=True,
                timeout=COMPILE_TIMEOUT
            )
        except subprocess.TimeoutExpired:
            return jsonify({"compile_error": "Compilation timed out."}), 408
        except Exception as exc:
            return jsonify({"error": f"Compiler could not start: {exc}"}), 500

        if compiled.returncode != 0:
            return jsonify({
                "compile_error": clean_output(compiled.stderr or compiled.stdout)
            }), 422

        try:
            executed = subprocess.run(
                [str(executable)],
                cwd=workdir,
                input=stdin,
                capture_output=True,
                text=True,
                timeout=RUN_TIMEOUT
            )
        except subprocess.TimeoutExpired:
            return jsonify({
                "output": "",
                "error": f"Program exceeded the {RUN_TIMEOUT}-second execution limit."
            })
        except Exception as exc:
            return jsonify({"error": f"Program could not start: {exc}"}), 500

        output = clean_output(executed.stdout)
        runtime_error = clean_output(executed.stderr)

        if executed.returncode != 0 and not runtime_error:
            runtime_error = f"Program exited with code {executed.returncode}."

        return jsonify({
            "output": output,
            "error": runtime_error,
            "exit_code": executed.returncode
        })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port)
