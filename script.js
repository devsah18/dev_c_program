/* =====================================================
   DEV C PROGRAM
   Main JavaScript
===================================================== */


/* =====================================================
   C PROGRAM EXAMPLES
===================================================== */

const programs = {

    greeting: `#include <stdio.h>

void greeting() {
    printf("Hello, welcome to Dev C Program!");
}

int main() {

    greeting();

    return 0;
}`,

    prime: `#include <stdio.h>

int main() {

    int n;
    int i;
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

    if (isPrime) {
        printf("%d is a prime number.", n);
    }
    else {
        printf("%d is not a prime number.", n);
    }

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
}`
};


/* =====================================================
   LOAD PROGRAM
===================================================== */

function loadProgram(programName) {

    const codeBox =
        document.getElementById("code");

    if (!programs[programName]) {

        console.error(
            "Program not found:",
            programName
        );

        return;
    }

    codeBox.value =
        programs[programName];

    document
        .getElementById("compiler")
        .scrollIntoView({
            behavior: "smooth"
        });

    document
        .getElementById("output")
        .textContent =
        "Program loaded.\n\nClick ▶ Run Code to execute.";
}


/* =====================================================
   COPY CODE
===================================================== */

document
    .getElementById("copyButton")
    .addEventListener("click", async function () {

        const code =
            document.getElementById("code").value;

        try {

            await navigator.clipboard.writeText(code);

            this.textContent = "✅ Copied!";

            setTimeout(() => {

                this.textContent = "📋 Copy";

            }, 1500);

        }

        catch (error) {

            alert(
                "Unable to copy code."
            );

        }

    });


/* =====================================================
   CLEAR OUTPUT
===================================================== */

document
    .getElementById("clearButton")
    .addEventListener("click", function () {

        document
            .getElementById("output")
            .textContent =
            "Output will appear here...";

    });


/* =====================================================
   RUN CODE
===================================================== */

/*
   IMPORTANT:

   Change this URL after you deploy
   your Python backend.

   For local testing:

   http://127.0.0.1:5000/run

*/

const API_URL =
    "http://127.0.0.1:5000/run";


async function runCode() {

    const codeBox =
        document.getElementById("code");

    const inputBox =
        document.getElementById("input");

    const outputBox =
        document.getElementById("output");

    const runButton =
        document.getElementById("runButton");


    const code =
        codeBox.value.trim();

    const input =
        inputBox.value;


    /* Empty code */

    if (!code) {

        outputBox.textContent =
            "❌ Please enter C code.";

        return;
    }


    /* Loading */

    runButton.disabled = true;

    runButton.textContent =
        "⏳ Running...";

    outputBox.textContent =
        "Compiling your C program...";


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    code: code,

                    input: input

                })

            });


        const result =
            await response.json();


        /* Server error */

        if (!response.ok) {

            outputBox.textContent =
                "❌ Server Error\n\n" +
                (result.error ||
                 "Something went wrong.");

            return;
        }


        /* Compilation error */

        if (result.compile_error) {

            outputBox.textContent =
                "❌ COMPILATION ERROR\n\n" +
                result.compile_error;

            return;
        }


        /* Program output */

        let finalOutput =
            result.output || "";


        /* Runtime error */

        if (result.error) {

            finalOutput +=
                "\n\n⚠️ ERROR\n" +
                result.error;

        }


        if (!finalOutput.trim()) {

            finalOutput =
                "Program finished successfully.\n" +
                "No output was produced.";

        }


        outputBox.textContent =
            finalOutput;


    }

    catch (error) {

        console.error(error);

        outputBox.textContent =
            "❌ CONNECTION ERROR\n\n" +
            "Could not connect to the C compiler server.\n\n" +
            "Make sure your Python backend is running.";

    }

    finally {

        runButton.disabled = false;

        runButton.textContent =
            "▶ Run Code";

    }
}


/* =====================================================
   SEARCH PROGRAMS
===================================================== */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const programCards =
    document.querySelectorAll(
        ".program-card"
    );


searchInput.addEventListener(
    "input",
    function () {

        const search =
            this.value
                .toLowerCase()
                .trim();


        programCards.forEach(card => {

            const name =
                card
                    .dataset
                    .name
                    .toLowerCase();


            if (name.includes(search)) {

                card.style.display =
                    "flex";

            }

            else {

                card.style.display =
                    "none";

            }

        });

    }
);


/* =====================================================
   CATEGORY FILTER
===================================================== */

const categoryButtons =
    document.querySelectorAll(
        ".category-button"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            /* Remove active */

            categoryButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            /* Add active */

            this.classList.add(
                "active"
            );


            const category =
                this.dataset.category;


            programCards.forEach(card => {

                const cardCategory =
                    card.dataset.category;


                if (
                    category === "all" ||
                    cardCategory === category
                ) {

                    card.style.display =
                        "flex";

                }

                else {

                    card.style.display =
                        "none";

                }

            });

        }
    );

});


/* =====================================================
   DARK / LIGHT MODE
===================================================== */

const themeButton =
    document.getElementById(
        "themeButton"
    );


themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light"
        );


        if (
            document.body.classList.contains(
                "light"
            )
        ) {

            this.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

        else {

            this.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    }
);


/* =====================================================
   LOAD SAVED THEME
===================================================== */

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light"
    );

    themeButton.textContent =
        "🌙";

}


/* =====================================================
   KEYBOARD SHORTCUT
===================================================== */

/*
   Ctrl + Enter
   = Run C program
*/

document
    .getElementById("code")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                event.preventDefault();

                runCode();

            }

        }
    );


/* =====================================================
   TAB SUPPORT IN CODE EDITOR
===================================================== */

document
    .getElementById("code")
    .addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Tab") {

                event.preventDefault();


                const start =
                    this.selectionStart;

                const end =
                    this.selectionEnd;


                this.value =
                    this.value.substring(
                        0,
                        start
                    ) +
                    "    " +
                    this.value.substring(
                        end
                    );


                this.selectionStart =
                    this.selectionEnd =
                    start + 4;

            }

        }
    );
