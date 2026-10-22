const quizData = [
    {
        question: "1. What are Fundamental Rights?",
        options: [
            "Basic rights guaranteed by the Constitution of India",
            "Rules made by schools",
            "Online safety rules",
            "Only political rules"
        ],
        answer: 0
    },

    {
        question: "2. Which Fundamental Right ensures equality before the law?",
        options: [
            "Right to Freedom",
            "Right to Equality",
            "Right Against Exploitation",
            "Right to Freedom of Religion"
        ],
        answer: 1
    },

    {
        question: "3. Which Fundamental Right protects people from human trafficking and forced labour?",
        options: [
            "Right to Equality",
            "Right to Freedom",
            "Right Against Exploitation",
            "Cultural and Educational Rights"
        ],
        answer: 2
    },

    {
        question: "4. Which Fundamental Right gives people freedom to practise and profess religion?",
        options: [
            "Right to Freedom of Religion",
            "Right to Equality",
            "Right Against Exploitation",
            "Right to Constitutional Remedies"
        ],
        answer: 0
    },

    {
        question: "5. Which Fundamental Right allows people to approach courts for enforcement of Fundamental Rights?",
        options: [
            "Right to Freedom",
            "Cultural and Educational Rights",
            "Right Against Exploitation",
            "Right to Constitutional Remedies"
        ],
        answer: 3
    }
];


let currentQuestion = 0;

let answers = new Array(quizData.length).fill(null);


/* ELEMENTS */

const question =
    document.getElementById("question");

const options =
    document.getElementById("options");

const questionNumbers =
    document.getElementById("questionNumbers");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const submitBtn =
    document.getElementById("submitBtn");

const resultCard =
    document.getElementById("resultCard");

const scoreText =
    document.getElementById("scoreText");

const percentageText =
    document.getElementById("percentageText");

const correctAnswers =
    document.getElementById("correctAnswers");

const wrongAnswers =
    document.getElementById("wrongAnswers");

const resultMessage =
    document.getElementById("resultMessage");

const reviewBtn =
    document.getElementById("reviewBtn");

const retryBtn =
    document.getElementById("retryBtn");

const reviewCard =
    document.getElementById("reviewCard");

const reviewContent =
    document.getElementById("reviewContent");

const backResultBtn =
    document.getElementById("backResultBtn");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultSubtitle =
    document.getElementById("resultSubtitle");

const continueBtn =
    document.getElementById("continueBtn");


/* LOAD QUESTION */

function loadQuestion() {

    const q = quizData[currentQuestion];

    question.textContent = q.question;

    options.innerHTML = "";


    q.options.forEach((option, index) => {

        options.innerHTML += `
            <label>

                <input
                    type="radio"
                    name="answer"
                    value="${index}"
                    ${answers[currentQuestion] == index ? "checked" : ""}
                >

                ${option}

            </label>
        `;
    });


    createBoxes();


    /* PREVIOUS BUTTON */

    if (currentQuestion === 0) {

        prevBtn.style.display = "none";

    } else {

        prevBtn.style.display = "inline-block";

    }


    /* NEXT / SUBMIT BUTTON */

    if (currentQuestion === quizData.length - 1) {

        nextBtn.style.display = "none";

        submitBtn.style.display = "inline-block";

    } else {

        nextBtn.style.display = "inline-block";

        submitBtn.style.display = "none";

    }
}


/* QUESTION NUMBER BOXES */

function createBoxes() {

    questionNumbers.innerHTML = "";


    quizData.forEach((item, index) => {

        let className = "q-box";


        if (index === currentQuestion) {

            className += " active";

        } else if (answers[index] !== null) {

            className += " answered";

        }


        questionNumbers.innerHTML += `
            <div
                class="${className}"
                data-index="${index}"
            >
                ${index + 1}
            </div>
        `;
    });


    /* BOX CLICK */

    document.querySelectorAll(".q-box").forEach(box => {

        box.addEventListener("click", function () {

            saveAnswer();

            currentQuestion =
                Number(this.dataset.index);

            loadQuestion();

        });

    });
}


/* SAVE ANSWER */

function saveAnswer() {

    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );


    if (selected) {

        answers[currentQuestion] =
            Number(selected.value);

    }
}


/* NEXT BUTTON */

nextBtn.addEventListener("click", function () {

    saveAnswer();


    if (currentQuestion < quizData.length - 1) {

        currentQuestion++;

        loadQuestion();

    }
});


/* PREVIOUS BUTTON */

prevBtn.addEventListener("click", function () {

    saveAnswer();


    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }
});


/* SUBMIT QUIZ */

submitBtn.addEventListener("click", function () {

    saveAnswer();


    let score = 0;


    quizData.forEach((q, index) => {

        if (answers[index] === q.answer) {

            score++;

        }

    });


    const total = quizData.length;

    const percentage =
        Math.round((score / total) * 100);

    const wrong =
        total - score;


    /* DISPLAY SCORE */

    scoreText.textContent =
        `${score} / ${total}`;

    percentageText.textContent =
        `${percentage}%`;

    correctAnswers.textContent =
        score;

    wrongAnswers.textContent =
        wrong;


    /* PASS */

    if (score >= 4) {

        resultIcon.textContent = "🎉";

        resultTitle.textContent =
            "Congratulations!";

        resultSubtitle.textContent =
            "You successfully passed the Fundamental Rights quiz.";

        resultMessage.textContent =
            "🏆 Fundamental Rights Course Completed!";


        const loggedInEmail =
            localStorage.getItem("loggedInEmail");


        if (loggedInEmail) {

            const completionKey =
                "fundamentalRightsCompleted_" +
                loggedInEmail;


            localStorage.setItem(
                completionKey,
                "true"
            );

        }


        continueBtn.style.display =
            "inline-block";


    } else {

        /* FAIL */

        resultIcon.textContent = "📚";

        resultTitle.textContent =
            "Keep Learning!";

        resultSubtitle.textContent =
            "You didn't pass this time. Review the lesson and try again.";

        resultMessage.textContent =
            "❌ Quiz Not Passed. Try Again!";

        continueBtn.style.display =
            "none";
    }


    /* HIDE QUESTION CONTENT */

    document.querySelector(
        ".question-card"
    ).style.display = "none";


    document.querySelector(
        ".button-area"
    ).style.display = "none";


    /* HIDE QUESTION PANEL */

    document.querySelector(
        ".question-panel"
    ).style.display = "none";


    /* RESULT FULL WIDTH */

    const quizPanel =
        document.querySelector(".quiz-panel");

    quizPanel.style.gridColumn =
        "1 / -1";


    resultCard.style.display =
        "block";
});


/* RETRY QUIZ */

retryBtn.addEventListener("click", function () {

    currentQuestion = 0;

    answers =
        new Array(quizData.length).fill(null);


    /* HIDE RESULT */

    resultCard.style.display =
        "none";

    reviewCard.style.display =
        "none";


    /* SHOW QUESTION */

    document.querySelector(
        ".question-card"
    ).style.display = "block";


    document.querySelector(
        ".button-area"
    ).style.display = "grid";


    document.querySelector(
        ".question-panel"
    ).style.display = "block";


    /* RESET RIGHT PANEL */

    const quizPanel =
        document.querySelector(".quiz-panel");

    quizPanel.style.gridColumn =
        "auto";


    loadQuestion();
});


/* REVIEW ANSWERS */

reviewBtn.addEventListener("click", function () {

    reviewContent.innerHTML = "";


    quizData.forEach((q, index) => {

        const selected =
            answers[index];


        const isCorrect =
            selected === q.answer;


        const yourAnswer =
            selected !== null
                ? q.options[selected]
                : "Not Answered";


        const cleanQuestion =
            q.question.replace(
                /^\d+\.\s*/,
                ""
            );


        reviewContent.innerHTML += `
            <div class="review-item">

                <h3>
                    Q${index + 1}. ${cleanQuestion}
                </h3>


                <div class="answer-box ${
                    isCorrect
                        ? "correct-answer"
                        : "wrong-answer"
                }">

                    <span class="answer-label">
                        Your Answer:
                    </span>

                    ${isCorrect ? "✓" : "✗"}

                    ${yourAnswer}

                </div>


                ${
                    !isCorrect
                        ? `
                            <div class="answer-box correct-answer">

                                <span class="answer-label">
                                    Correct Answer:
                                </span>

                                ✓ ${q.options[q.answer]}

                            </div>
                        `
                        : ""
                }

            </div>
        `;
    });


    resultCard.style.display =
        "none";


    reviewCard.style.display =
        "block";
});


/* BACK TO RESULT */

backResultBtn.addEventListener("click", function () {

    reviewCard.style.display =
        "none";

    resultCard.style.display =
        "block";
});


/* START QUIZ */

loadQuestion();