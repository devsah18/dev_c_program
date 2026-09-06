/* Dev C Program - Version 2 */
const programs = {
hello: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
sum: `#include <stdio.h>

int main() {
    int a, b;

    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);

    printf("Sum = %d\\n", a + b);
    return 0;
}`,
greeting: `#include <stdio.h>

void greeting() {
    printf("Hello, welcome to Dev C Program!\\n");
}

int main() {
    greeting();
    return 0;
}`,
prime: `#include <stdio.h>

int main() {
    int n, i;
    int isPrime = 1;

    printf("Enter a number: ");
    scanf("%d", &n);

    if (n <= 1) {
        isPrime = 0;
    }

    for (i = 2; i <= n / 2; i++) {
        if (n % i == 0) {
            isPrime = 0;
            break;
        }
    }

    if (isPrime)
        printf("%d is a prime number.\\n", n);
    else
        printf("%d is not a prime number.\\n", n);

    return 0;
}`,
evenodd: `#include <stdio.h>

int main() {
    int n;

    printf("Enter a number: ");
    scanf("%d", &n);

    if (n % 2 == 0)
        printf("%d is even.\\n", n);
    else
        printf("%d is odd.\\n", n);

    return 0;
}`,
forloop: `#include <stdio.h>

int main() {
    int i;

    for (i = 1; i <= 10; i++) {
        printf("%d\\n", i);
    }

    return 0;
}`,
whileloop: `#include <stdio.h>

int main() {
    int i = 1;

    while (i <= 10) {
        printf("%d\\n", i);
        i++;
    }

    return 0;
}`,
factorial: `#include <stdio.h>

int main() {
    int n, i;
    unsigned long long factorial = 1;

    printf("Enter a positive number: ");
    scanf("%d", &n);

    if (n < 0) {
        printf("Factorial is not defined for negative numbers.\\n");
        return 0;
    }

    for (i = 1; i <= n; i++) {
        factorial *= i;
    }

    printf("%d! = %llu\\n", n, factorial);
    return 0;
}`
};

/*
 * IMPORTANT:
 * After deploying the backend, replace this URL.
 * Example:
 * const API_URL = "https://your-service-name.onrender.com/run";
 */
const API_URL = "https://YOUR-BACKEND.onrender.com/run";

const $ = (id) => document.getElementById(id);
const codeBox = $("code");
const inputBox = $("input");
const outputBox = $("output");
const runButton = $("runButton");
const statusBadge = $("compilerStatus");

function loadProgram(name) {
    if (!programs[name]) return;
    codeBox.value = programs[name];
    outputBox.textContent = "Program loaded.\n\nClick ▶ Run Code to execute.";
    $("compiler").scrollIntoView({ behavior: "smooth", block: "start" });
    codeBox.focus();
}

document.querySelectorAll(".open-button").forEach(button => {
    button.addEventListener("click", () => loadProgram(button.dataset.program));
});

$("copyButton").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(codeBox.value);
        $("copyButton").textContent = "✅ Copied!";
        setTimeout(() => $("copyButton").textContent = "📋 Copy", 1500);
    } catch {
        outputBox.textContent = "❌ Could not copy the code.";
    }
});

$("clearButton").addEventListener("click", () => {
    outputBox.textContent = "Output will appear here...";
});

$("formatHintButton").addEventListener("click", () => {
    outputBox.textContent = "Shortcuts:\n\nCtrl + Enter  → Run code\nTab          → Insert 4 spaces\n\nFor scanf(), put input in the Input box.";
});

async function runCode() {
    const code = codeBox.value.trim();
    const input = inputBox.value;

    if (!code) {
        outputBox.textContent = "❌ Please enter C code.";
        return;
    }

    if (API_URL.includes("YOUR-BACKEND")) {
        outputBox.textContent =
            "⚠️ Backend URL is not configured yet.\n\n" +
            "Open script.js and replace YOUR-BACKEND with your deployed backend URL.";
        return;
    }

    runButton.disabled = true;
    runButton.textContent = "⏳ Running...";
    outputBox.textContent = "Compiling and running your C program...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, input })
        });

        let result;
        try {
            result = await response.json();
        } catch {
            throw new Error(`Server returned HTTP ${response.status} with an invalid response.`);
        }

        if (!response.ok) {
            outputBox.textContent = "❌ Server Error\n\n" + (result.error || "Request failed.");
            return;
        }

        if (result.compile_error) {
            outputBox.textContent = "❌ COMPILATION ERROR\n\n" + result.compile_error;
            return;
        }

        let text = result.output || "";
        if (result.error) text += (text ? "\n\n" : "") + "⚠️ ERROR\n" + result.error;

        outputBox.textContent = text.trim()
            ? text
            : "Program finished successfully.\nNo output was produced.";
    } catch (error) {
        console.error(error);
        outputBox.textContent =
            "❌ CONNECTION ERROR\n\n" +
            "The compiler server could not be reached.\n\n" +
            "Check that the backend is deployed, running, and that API_URL in script.js is correct.";
        statusBadge.textContent = "● Offline";
        statusBadge.className = "status offline";
    } finally {
        runButton.disabled = false;
        runButton.textContent = "▶ Run Code";
    }
}

runButton.addEventListener("click", runCode);

const searchInput = $("searchInput");
const cards = [...document.querySelectorAll(".program-card")];
const categoryButtons = [...document.querySelectorAll(".category-button")];
const noResults = $("noResults");

function filterPrograms() {
    const query = searchInput.value.toLowerCase().trim();
    const category = document.querySelector(".category-button.active").dataset.category;
    let visible = 0;

    cards.forEach(card => {
        const matchesSearch = card.dataset.name.toLowerCase().includes(query);
        const matchesCategory = category === "all" || card.dataset.category === category;
        const show = matchesSearch && matchesCategory;
        card.hidden = !show;
        if (show) visible++;
    });

    noResults.hidden = visible !== 0;
}

searchInput.addEventListener("input", filterPrograms);

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        filterPrograms();
    });
});

const themeButton = $("themeButton");
function applyTheme(theme) {
    document.body.classList.toggle("light", theme === "light");
    themeButton.textContent = theme === "light" ? "🌙" : "☀️";
}
applyTheme(localStorage.getItem("theme") || "dark");

themeButton.addEventListener("click", () => {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
});

codeBox.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        runCode();
    }

    if (event.key === "Tab") {
        event.preventDefault();
        const start = codeBox.selectionStart;
        const end = codeBox.selectionEnd;
        codeBox.value = codeBox.value.slice(0, start) + "    " + codeBox.value.slice(end);
        codeBox.selectionStart = codeBox.selectionEnd = start + 4;
    }
});

$("year").textContent = new Date().getFullYear();
$("topicCount").textContent = `${cards.length}+`;

async function checkBackend() {
    if (API_URL.includes("YOUR-BACKEND")) {
        statusBadge.textContent = "● Backend not set";
        statusBadge.className = "status offline";
        return;
    }
    const healthURL = API_URL.replace(/\/run\/?$/, "/health");
    try {
        const response = await fetch(healthURL, { method: "GET" });
        if (!response.ok) throw new Error("Health check failed");
        statusBadge.textContent = "● Compiler online";
        statusBadge.className = "status online";
    } catch {
        statusBadge.textContent = "● Compiler offline";
        statusBadge.className = "status offline";
    }
}
checkBackend();
