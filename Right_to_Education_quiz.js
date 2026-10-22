const quizData = [

    {
        question: "1. What does the Right to Education mean?",
        options: [
            "Every child should have an opportunity to receive education",
            "Only adults can receive education",
            "Education is available only online",
            "Only teachers have the right to education"
        ],
        answer: 0
    },

    {
        question: "2. Why is education important?",
        options: [
            "It helps children develop knowledge and skills",
            "It prevents children from learning new things",
            "It is only useful for entertainment",
            "It removes the need for learning"
        ],
        answer: 0
    },

    {
        question: "3. What principle means education opportunities should be provided fairly?",
        options: [
            "Equality",
            "Competition",
            "Entertainment",
            "Secrecy"
        ],
        answer: 0
    },

    {
        question: "4. What kind of environment should students have for learning?",
        options: [
            "A safe and respectful environment",
            "An unsafe environment",
            "An environment without rules",
            "An environment where students cannot ask questions"
        ],
        answer: 0
    },

    {
        question: "5. How can education help children in the future?",
        options: [
            "It can help them build knowledge, skills, and future opportunities",
            "It prevents them from developing skills",
            "It removes all future opportunities",
            "It is only useful during childhood"
        ],
        answer: 0
    }

];


let currentQuestion = 0;

let answers =
    new Array(quizData.length).fill(null);


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

    const q =
        quizData[currentQuestion];

    question.textContent =
        q.question;

    options.innerHTML = "";


    q.options.forEach((option, index) => {

        options.innerHTML += `

            <label>

                <input
                    type="radio"
                    name="answer"
                    value="${index}"
                    ${
                        answers[currentQuestion] === index
                            ? "checked"
                            : ""
                    }
                >

                ${option}

            </label>

        `;
    });


    createBoxes();


    if (currentQuestion === 0) {

        prevBtn.style.display = "none";

    } else {

        prevBtn.style.display =
            "inline-block";
    }


    if (
        currentQuestion ===
        quizData.length - 1
    ) {

        nextBtn.style.display = "none";

        submitBtn.style.display =
            "inline-block";

    } else {

        nextBtn.style.display =
            "inline-block";

        submitBtn.style.display =
            "none";
    }
}


/* QUESTION BOXES */

function createBoxes() {

    questionNumbers.innerHTML = "";


    quizData.forEach((item, index) => {

        let className = "q-box";


        if (
            index === currentQuestion
        ) {

            className += " active";

        } else if (
            answers[index] !== null
        ) {

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


    document
        .querySelectorAll(".q-box")
        .forEach(box => {

            box.addEventListener(
                "click",
                function () {

                    saveAnswer();

                    currentQuestion =
                        Number(
                            this.dataset.index
                        );

                    loadQuestion();

                }
            );

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


/* NEXT */

nextBtn.addEventListener(
    "click",
    function () {

        saveAnswer();


        if (
            currentQuestion <
            quizData.length - 1
        ) {

            currentQuestion++;

            loadQuestion();
        }

    }
);


/* PREVIOUS */

prevBtn.addEventListener(
    "click",
    function () {

        saveAnswer();


        if (currentQuestion > 0) {

            currentQuestion--;

            loadQuestion();
        }

    }
);


/* SUBMIT */

submitBtn.addEventListener(
    "click",
    function () {

        saveAnswer();


        let score = 0;


        quizData.forEach(
            (q, index) => {

                if (
                    answers[index] ===
                    q.answer
                ) {

                    score++;
                }

            }
        );


        const total =
            quizData.length;

        const percentage =
            Math.round(
                (score / total) * 100
            );

        const wrong =
            total - score;


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

            resultIcon.textContent =
                "🎉";

            resultTitle.textContent =
                "Congratulations!";

            resultSubtitle.textContent =
                "You successfully passed the Right to Education quiz.";

            resultMessage.textContent =
                "🏆 Right to Education Course Completed!";


            const loggedInEmail =
                localStorage.getItem(
                    "loggedInEmail"
                );


            if (loggedInEmail) {

                const completionKey =
                    "rightToEducationCompleted_" +
                    loggedInEmail;


                localStorage.setItem(
                    completionKey,
                    "true"
                );

            }


            continueBtn.style.display =
                "inline-block";


        } else {

            resultIcon.textContent =
                "📚";

            resultTitle.textContent =
                "Keep Learning!";

            resultSubtitle.textContent =
                "Review the lesson and try the quiz again.";

            resultMessage.textContent =
                "❌ Quiz Not Passed. Try Again!";

            continueBtn.style.display =
                "none";
        }


        document.querySelector(
            ".question-card"
        ).style.display = "none";


        document.querySelector(
            ".button-area"
        ).style.display = "none";


        document.querySelector(
            ".question-panel"
        ).style.display = "none";


        resultCard.style.display =
            "block";

    }
);


/* RETRY */

retryBtn.addEventListener(
    "click",
    function () {

        currentQuestion = 0;

        answers =
            new Array(
                quizData.length
            ).fill(null);


        resultCard.style.display =
            "none";

        reviewCard.style.display =
            "none";


        document.querySelector(
            ".question-card"
        ).style.display = "block";


        document.querySelector(
            ".button-area"
        ).style.display = "grid";


        document.querySelector(
            ".question-panel"
        ).style.display = "block";


        loadQuestion();

    }
);


/* REVIEW ANSWERS */

reviewBtn.addEventListener(
    "click",
    function () {

        reviewContent.innerHTML = "";


        quizData.forEach(
            (q, index) => {

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
                            Q${index + 1}.
                            ${cleanQuestion}
                        </h3>


                        <div class="answer-box ${
                            isCorrect
                                ? "correct-answer"
                                : "wrong-answer"
                        }">

                            <span class="answer-label">
                                Your Answer:
                            </span>

                            ${
                                isCorrect
                                    ? "✓"
                                    : "✗"
                            }

                            ${yourAnswer}

                        </div>


                        ${
                            !isCorrect
                                ? `

                                    <div class="answer-box correct-answer">

                                        <span class="answer-label">
                                            Correct Answer:
                                        </span>

                                        ✓
                                        ${q.options[q.answer]}

                                    </div>

                                  `
                                : ""
                        }

                    </div>

                `;

            }
        );


        resultCard.style.display =
            "none";

        reviewCard.style.display =
            "block";

    }
);


/* BACK TO RESULT */

backResultBtn.addEventListener(
    "click",
    function () {

        reviewCard.style.display =
            "none";

        resultCard.style.display =
            "block";

    }
);


/* START QUIZ */

loadQuestion();