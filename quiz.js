/* =========================================================
   LEARN2LIVE - UNIVERSAL QUIZ.JS
   ALL CATEGORIES
   Google Sheets + Apps Script
   Random 10 Questions
   Pass Mark = 6 / 10
   EXPLANATION SUPPORT
   UNIVERSAL COMPLETION SYSTEM
========================================================= */

"use strict";


/* =========================================================
   GOOGLE SHEET API
========================================================= */

const QUIZ_API_URL =
    "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";


/* =========================================================
   QUIZ SETTINGS
========================================================= */

const DEFAULT_CATEGORY = "First Aid";
const DEFAULT_SUBCATEGORY = "CPR";

const QUIZ_SIZE = 10;
const PASS_MARK = 6;


/* =========================================================
   GLOBAL STATE
========================================================= */

let allQuestions = [];
let quizQuestions = [];

let currentQuestionIndex = 0;

let userAnswers = {};

let quizStarted = false;
let quizCompleted = false;
let quizPassed = false;

let reviewMode = false;

let savedQuizState = null;


/* =========================================================
   LAST RESULT
========================================================= */

let lastQuizResult = {

    correct: 0,
    wrong: 0,
    total: 0,
    percentage: 0,
    passed: false

};


/* =========================================================
   DOM REFERENCES
========================================================= */

let startScreen;
let questionScreen;
let submitScreen;
let resultScreen;
let loadingScreen;
let errorScreen;

let explanationScreen;
let explanationReviewList;

let resumeCard;

let startButton;
let resumeButton;

let previousButton;
let nextButton;

let reviewButton;
let submitButton;

let viewExplanationButton;
let backToResultButton;

let retakeButton;
let finishButton;

let retryButton;

let backButton;

let exitModal;
let closeExitModal;
let stayQuizButton;
let exitQuizButton;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeDOM();

        bindEvents();

        loadQuiz();

    }
);


/* =========================================================
   INITIALIZE DOM
========================================================= */

function initializeDOM() {

    startScreen =
        document.getElementById(
            "quizStartScreen"
        );

    questionScreen =
        document.getElementById(
            "quizQuestionScreen"
        );

    submitScreen =
        document.getElementById(
            "quizSubmitScreen"
        );

    resultScreen =
        document.getElementById(
            "quizResultScreen"
        );

    loadingScreen =
        document.getElementById(
            "quizLoadingScreen"
        );

    errorScreen =
        document.getElementById(
            "quizErrorScreen"
        );


    explanationScreen =
        document.getElementById(
            "quizExplanationScreen"
        );

    explanationReviewList =
        document.getElementById(
            "explanationReviewList"
        );


    resumeCard =
        document.getElementById(
            "resumeCard"
        );


    startButton =
        document.getElementById(
            "startQuizButton"
        );

    resumeButton =
        document.getElementById(
            "resumeButton"
        );


    previousButton =
        document.getElementById(
            "previousButton"
        );

    nextButton =
        document.getElementById(
            "nextQuestionButton"
        );


    reviewButton =
        document.getElementById(
            "reviewQuizButton"
        );

    submitButton =
        document.getElementById(
            "submitQuizButton"
        );


    viewExplanationButton =
        document.getElementById(
            "viewExplanationButton"
        );

    backToResultButton =
        document.getElementById(
            "backToResultButton"
        );


    retakeButton =
        document.getElementById(
            "retakeQuizButton"
        );

    finishButton =
        document.getElementById(
            "finishQuizButton"
        );


    retryButton =
        document.getElementById(
            "retryQuizButton"
        );


    backButton =
        document.getElementById(
            "backButton"
        );


    exitModal =
        document.getElementById(
            "exitModal"
        );

    closeExitModal =
        document.getElementById(
            "closeExitModal"
        );

    stayQuizButton =
        document.getElementById(
            "stayQuizButton"
        );

    exitQuizButton =
        document.getElementById(
            "exitQuizButton"
        );

}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents() {

    if (startButton) {

        startButton.addEventListener(
            "click",
            startNewQuiz
        );

    }


    if (resumeButton) {

        resumeButton.addEventListener(
            "click",
            resumeQuiz
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousQuestion
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextQuestion
        );

    }


    if (reviewButton) {

        reviewButton.addEventListener(
            "click",
            reviewQuiz
        );

    }


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            submitQuiz
        );

    }


    if (viewExplanationButton) {

        viewExplanationButton.addEventListener(
            "click",
            showExplanationReview
        );

    }


    if (backToResultButton) {

        backToResultButton.addEventListener(
            "click",
            showResultScreen
        );

    }


    if (retakeButton) {

        retakeButton.addEventListener(
            "click",
            retakeQuiz
        );

    }


    if (finishButton) {

        finishButton.addEventListener(
            "click",
            finishQuiz
        );

    }


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadQuiz
        );

    }


    if (backButton) {

        backButton.addEventListener(
            "click",
            handleBack
        );

    }


    if (closeExitModal) {

        closeExitModal.addEventListener(
            "click",
            closeExit
        );

    }


    if (stayQuizButton) {

        stayQuizButton.addEventListener(
            "click",
            closeExit
        );

    }


    if (exitQuizButton) {

        exitQuizButton.addEventListener(
            "click",
            exitQuiz
        );

    }


    window.addEventListener(
        "beforeunload",
        function () {

            if (
                quizStarted &&
                !quizCompleted
            ) {

                saveQuizState();

            }

        }
    );

}


/* =========================================================
   CATEGORY
========================================================= */

function getQuizCategory() {

    const value =
        document.body.dataset.category ||
        getUrlParameter("category") ||
        DEFAULT_CATEGORY;

    return cleanQuizName(value);

}


/* =========================================================
   SUBCATEGORY
========================================================= */

function getQuizSubcategory() {

    const value =
        document.body.dataset.subcategory ||
        getUrlParameter("subcategory") ||
        getUrlParameter("subCategory") ||
        DEFAULT_SUBCATEGORY;

    return cleanQuizName(value);

}


/* =========================================================
   CLEAN QUIZ NAME
========================================================= */

function cleanQuizName(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\s*&\s*/g, " & ")
        .toLowerCase();

}


/* =========================================================
   DISPLAY NAME
========================================================= */

function getQuizDisplayName(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}


/* =========================================================
   URL PARAMETER
========================================================= */

function getUrlParameter(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name) || "";

}


/* =========================================================
   LOAD QUIZ
========================================================= */

async function loadQuiz() {

    showLoading();


    try {

        /* log removed */;


        /* log removed */;


        /* log removed */;


        const url =
            QUIZ_API_URL +
            "?type=questions&_=" +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP Error " +
                response.status
            );

        }


        const rawData =
            await response.json();


        /* log removed */;


        let questions = [];


        if (Array.isArray(rawData)) {

            questions =
                rawData;

        }


        else if (
            rawData &&
            Array.isArray(
                rawData.questions
            )
        ) {

            questions =
                rawData.questions;

        }


        else if (
            rawData &&
            Array.isArray(
                rawData.data
            )
        ) {

            questions =
                rawData.data;

        }


        else if (
            rawData &&
            Array.isArray(
                rawData.result
            )
        ) {

            questions =
                rawData.result;

        }


        if (!questions.length) {

            throw new Error(
                "Google Sheet returned 0 questions."
            );

        }


        allQuestions =
            questions
                .map(
                    normalizeQuestion
                )
                .filter(
                    isValidQuestion
                );


        if (!allQuestions.length) {

            throw new Error(
                "No valid questions found."
            );

        }


        /* log removed */;


        createQuizQuestions();

        updateStartScreen();

        checkResumeState();

        showStartScreen();


    } catch (error) {

        console.error(
            "QUIZ LOAD ERROR:",
            error
        );


        showError(
            error.message ||
            "Unable to load quiz."
        );

    }

}


/* =========================================================
   DEBUG
========================================================= */

function debugQuizData() {

    /* log removed */;


    /* log removed */;


    /* log removed */;


    /* log removed */;


    /* log removed */;


    /* log removed */;


    /* log removed */;


    /* log removed */;


    /* log removed */;


    console.table(
        allQuestions.map(
            function (q) {

                return {

                    Category:
                        q.Category,

                    Subcategory:
                        q.Subcategory,

                    Question:
                        q.Question

                };

            }
        )
    );


    /* log removed */;

}


/* =========================================================
   CREATE CATEGORY + SUBCATEGORY QUIZ
========================================================= */

function createQuizQuestions() {

    const category =
        normalizeQuizMatch(
            getQuizCategory()
        );


    const subcategory =
        normalizeQuizMatch(
            getQuizSubcategory()
        );


    /* log removed */;


    /* log removed */;


    const filtered =
        allQuestions.filter(
            function (question) {

                const questionCategory =
                    normalizeQuizMatch(
                        question.Category
                    );


                const questionSubcategory =
                    normalizeQuizMatch(
                        question.Subcategory
                    );


                return (
                    questionCategory ===
                    category &&

                    questionSubcategory ===
                    subcategory
                );

            }
        );


    /* log removed */;


    if (!filtered.length) {

        throw new Error(
            "No questions found for " +
            getQuizCategory() +
            " → " +
            getQuizSubcategory() +
            ". Please check the Category and Subcategory values in Google Sheets."
        );

    }


    quizQuestions =
        shuffleArray(
            filtered.slice()
        ).slice(
            0,
            Math.min(
                QUIZ_SIZE,
                filtered.length
            )
        );


    if (!quizQuestions.length) {

        throw new Error(
            "Unable to create quiz questions."
        );

    }


    /* log removed */;

}


/* =========================================================
   QUIZ MATCH NORMALIZER
========================================================= */

function normalizeQuizMatch(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(
            /[&/_-]+/g,
            " "
        )
        .replace(
            /[^\w\s]/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
   NORMALIZE QUESTION
========================================================= */

function normalizeQuestion(
    item,
    index
) {

    if (!item) {

        return null;

    }


    return {

        QuestionID:
            cleanValue(
                item.QuestionID ??
                item.questionID ??
                item.questionId ??
                item.id ??
                ("Q" + (index + 1))
            ),


        Category:
            cleanValue(
                item.Category ??
                item.category ??
                ""
            ),


        Subcategory:
            cleanValue(
                item.Subcategory ??
                item.subcategory ??
                item.SubCategory ??
                item.subCategory ??
                ""
            ),


        Question:
            cleanValue(
                item.Question ??
                item.question ??
                item.QuestionText ??
                item.questionText ??
                ""
            ),


        OptionA:
            cleanQuizOption(
                item.OptionA ??
                item.optionA ??
                item.A ??
                item.option_a ??
                ""
            ),


        OptionB:
            cleanQuizOption(
                item.OptionB ??
                item.optionB ??
                item.B ??
                item.option_b ??
                ""
            ),


        OptionC:
            cleanQuizOption(
                item.OptionC ??
                item.optionC ??
                item.C ??
                item.option_c ??
                ""
            ),


        OptionD:
            cleanQuizOption(
                item.OptionD ??
                item.optionD ??
                item.D ??
                item.option_d ??
                ""
            ),


        CorrectAnswer:
            cleanValue(
                item.CorrectAnswer ??
                item.correctAnswer ??
                item.correctanswer ??
                item.Answer ??
                item.answer ??
                ""
            ),


        Explanation:
            cleanValue(
                item.Explanation ??
                item.explanation ??
                item.EXPLANATION ??
                item.ExplanationText ??
                item.explanationText ??
                ""
            )

    };

}


/* =========================================================
   CLEAN OPTION
========================================================= */

function cleanQuizOption(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    if (
        typeof value === "object" &&
        value !== null
    ) {

        if (
            value instanceof Date
        ) {

            return value.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                }
            );

        }


        try {

            return String(
                value
            ).trim();

        } catch {

            return "";

        }

    }


    return String(
        value
    ).trim();

}


/* =========================================================
   VALID QUESTION
========================================================= */

function isValidQuestion(question) {

    if (!question) {

        return false;

    }


    return (

        String(
            question.Question
        ).trim() !== "" &&

        String(
            question.OptionA
        ).trim() !== "" &&

        String(
            question.OptionB
        ).trim() !== "" &&

        String(
            question.OptionC
        ).trim() !== "" &&

        String(
            question.OptionD
        ).trim() !== ""

    );

}


/* =========================================================
   START SCREEN
========================================================= */

function showStartScreen() {

    hideAllScreens();


    if (startScreen) {

        startScreen.hidden =
            false;

        startScreen.classList.add(
            "active"
        );

    }

}


/* =========================================================
   START NEW QUIZ
========================================================= */

function startNewQuiz() {

    clearSavedQuizState();


    currentQuestionIndex = 0;

    userAnswers = {};

    quizStarted = true;

    quizCompleted = false;

    quizPassed = false;

    reviewMode = false;


    lastQuizResult = {

        correct: 0,
        wrong: 0,
        total: quizQuestions.length,
        percentage: 0,
        passed: false

    };


    renderQuestion();

    showQuestionScreen();

}


/* =========================================================
   RESUME QUIZ
========================================================= */

function resumeQuiz() {

    if (!savedQuizState) {

        startNewQuiz();

        return;

    }


    userAnswers =
        savedQuizState.answers || {};


    currentQuestionIndex =
        Number(
            savedQuizState.currentIndex || 0
        );


    if (
        currentQuestionIndex < 0 ||
        currentQuestionIndex >=
        quizQuestions.length
    ) {

        currentQuestionIndex = 0;

    }


    quizStarted = true;

    quizCompleted = false;

    quizPassed = false;

    reviewMode = false;


    renderQuestion();

    showQuestionScreen();

}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

    if (!quizQuestions.length) {

        showError(
            "No questions available."
        );

        return;

    }


    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    if (!question) {

        showError(
            "Question could not be loaded."
        );

        return;

    }


    const currentQuestionElement =
        document.getElementById(
            "currentQuestion"
        );


    const totalQuestionsElement =
        document.getElementById(
            "totalQuestions"
        );


    const questionNumberElement =
        document.getElementById(
            "questionNumber"
        );


    const questionTextElement =
        document.getElementById(
            "questionText"
        );


    const optionsContainer =
        document.getElementById(
            "optionsContainer"
        );


    const progressFill =
        document.getElementById(
            "quizProgressFill"
        );


    const explanationBox =
        document.getElementById(
            "questionExplanation"
        );


    const explanationText =
        document.getElementById(
            "explanationText"
        );


    const total =
        quizQuestions.length;


    const number =
        currentQuestionIndex + 1;


    if (currentQuestionElement) {

        currentQuestionElement.textContent =
            number;

    }


    if (totalQuestionsElement) {

        totalQuestionsElement.textContent =
            total;

    }


    if (questionNumberElement) {

        questionNumberElement.textContent =
            "Question " +
            number;

    }


    if (questionTextElement) {

        questionTextElement.textContent =
            question.Question;

    }


    if (progressFill) {

        progressFill.style.width =
            (
                (number / total) *
                100
            ) +
            "%";

    }


    /* =====================================================
       OPTIONS
    ===================================================== */

    if (optionsContainer) {

        optionsContainer.innerHTML = "";


        const options = [

            {
                letter: "A",
                text: question.OptionA
            },

            {
                letter: "B",
                text: question.OptionB
            },

            {
                letter: "C",
                text: question.OptionC
            },

            {
                letter: "D",
                text: question.OptionD
            }

        ];


        options.forEach(
            function (option) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "quiz-option";


                button.dataset.answer =
                    option.letter;


                const selectedAnswer =
                    normalizeAnswer(
                        userAnswers[
                            question.QuestionID
                        ]
                    );


                if (
                    selectedAnswer ===
                    option.letter
                ) {

                    button.classList.add(
                        "selected"
                    );

                }


                if (reviewMode) {

                    button.disabled =
                        true;


                    const correctAnswer =
                        normalizeAnswer(
                            question.CorrectAnswer
                        );


                    if (
                        option.letter ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }


                    if (
                        option.letter ===
                        selectedAnswer &&
                        option.letter !==
                        correctAnswer
                    ) {

                        button.classList.add(
                            "incorrect"
                        );

                    }

                }


                button.innerHTML = `

                    <span class="option-letter">
                        ${option.letter}
                    </span>

                    <span class="option-text">
                        ${escapeHTML(
                            option.text
                        )}
                    </span>

                    <span class="option-check">
                        <i class="fa-solid fa-check"></i>
                    </span>

                `;


                if (!reviewMode) {

                    button.addEventListener(
                        "click",
                        function () {

                            selectAnswer(
                                question.QuestionID,
                                option.letter
                            );

                        }
                    );

                }


                optionsContainer.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       EXPLANATION HIDDEN DURING QUIZ
    ===================================================== */

    if (
        explanationBox &&
        explanationText
    ) {

        explanationText.textContent =
            "";

        explanationBox.hidden =
            true;

        explanationBox.style.display =
            "none";

    }


    updateNavigation();

    updateQuestionNavigator();

}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(
    questionID,
    answer
) {

    if (
        quizCompleted ||
        reviewMode
    ) {

        return;

    }


    userAnswers[questionID] =
        answer;


    renderQuestion();

    saveQuizState();

}


/* =========================================================
   PREVIOUS
========================================================= */

function previousQuestion() {

    if (
        currentQuestionIndex <= 0
    ) {

        return;

    }


    currentQuestionIndex--;

    renderQuestion();

    saveQuizState();

}


/* =========================================================
   NEXT
========================================================= */

function nextQuestion() {

    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    if (!question) {

        return;

    }


    if (
        !reviewMode &&
        !userAnswers[
            question.QuestionID
        ]
    ) {

        return;

    }


    if (
        currentQuestionIndex >=
        quizQuestions.length - 1
    ) {

        if (reviewMode) {

            showResultAfterReview();

            return;

        }


        showSubmitScreen();

        return;

    }


    currentQuestionIndex++;

    renderQuestion();


    if (!reviewMode) {

        saveQuizState();

    }

}


/* =========================================================
   UPDATE NAVIGATION
========================================================= */

function updateNavigation() {

    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    const hasAnswer =
        question &&
        Boolean(
            userAnswers[
                question.QuestionID
            ]
        );


    if (previousButton) {

        previousButton.disabled =
            currentQuestionIndex === 0;

    }


    if (nextButton) {

        if (reviewMode) {

            nextButton.disabled =
                false;


            if (
                currentQuestionIndex ===
                quizQuestions.length - 1
            ) {

                nextButton.innerHTML = `
                    Back to Result
                    <i class="fa-solid fa-arrow-left"></i>
                `;

            } else {

                nextButton.innerHTML = `
                    Next
                    <i class="fa-solid fa-arrow-right"></i>
                `;

            }


            return;

        }


        nextButton.disabled =
            !hasAnswer;


        if (
            currentQuestionIndex ===
            quizQuestions.length - 1
        ) {

            nextButton.innerHTML = `
                Review Quiz
                <i class="fa-solid fa-arrow-right"></i>
            `;

        } else {

            nextButton.innerHTML = `
                Next
                <i class="fa-solid fa-arrow-right"></i>
            `;

        }

    }

}


/* =========================================================
   QUESTION NAVIGATOR
========================================================= */

function updateQuestionNavigator() {

    const buttons =
        document.querySelectorAll(
            ".question-number"
        );


    if (!buttons.length) {

        return;

    }


    buttons.forEach(
        function (button) {

            const index =
                Number(
                    button.dataset.question
                );


            button.classList.remove(
                "current"
            );

            button.classList.remove(
                "answered"
            );


            if (
                index ===
                currentQuestionIndex
            ) {

                button.classList.add(
                    "current"
                );

            }


            const question =
                quizQuestions[index];


            if (
                question &&
                userAnswers[
                    question.QuestionID
                ]
            ) {

                button.classList.add(
                    "answered"
                );

            }

        }
    );

}


/* =========================================================
   SUBMIT SCREEN
========================================================= */

function showSubmitScreen() {

    updateSubmitSummary();

    hideAllScreens();


    if (submitScreen) {

        submitScreen.hidden =
            false;

        submitScreen.classList.add(
            "active"
        );

    }


    saveQuizState();

}


/* =========================================================
   SUBMIT SUMMARY
========================================================= */

function updateSubmitSummary() {

    const total =
        quizQuestions.length;


    const answered =
        quizQuestions.filter(
            function (question) {

                return Boolean(
                    userAnswers[
                        question.QuestionID
                    ]
                );

            }
        ).length;


    const remaining =
        total - answered;


    const totalElement =
        document.getElementById(
            "submitTotal"
        );


    const answeredElement =
        document.getElementById(
            "submitAnswered"
        );


    const remainingElement =
        document.getElementById(
            "submitRemaining"
        );


    const messageElement =
        document.getElementById(
            "submitMessage"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (answeredElement) {

        answeredElement.textContent =
            answered;

    }


    if (remainingElement) {

        remainingElement.textContent =
            remaining;

    }


    if (messageElement) {

        if (remaining > 0) {

            messageElement.textContent =
                "You still have " +
                remaining +
                " unanswered question" +
                (
                    remaining > 1
                        ? "s."
                        : "."
                ) +
                " You can submit or review your answers.";

        } else {

            messageElement.textContent =
                "All questions are answered. You can submit your quiz now.";

        }

    }

}


/* =========================================================
   REVIEW QUIZ
========================================================= */

function reviewQuiz() {

    if (!quizCompleted) {

        reviewMode = false;

        currentQuestionIndex = 0;

        renderQuestion();

        showQuestionScreen();

        return;

    }


    showExplanationReview();

}


/* =========================================================
   SHOW RESULT AFTER REVIEW
========================================================= */

function showResultAfterReview() {

    reviewMode = false;

    showResultScreen();

}


/* =========================================================
   CALCULATE CORRECT
========================================================= */

function calculateCorrectAnswers() {

    let correct = 0;


    quizQuestions.forEach(
        function (question) {

            const selected =
                normalizeAnswer(
                    userAnswers[
                        question.QuestionID
                    ]
                );


            const correctAnswer =
                normalizeAnswer(
                    question.CorrectAnswer
                );


            if (
                selected &&
                selected === correctAnswer
            ) {

                correct++;

            }

        }
    );


    return correct;

}


/* =========================================================
   CALCULATE WRONG
========================================================= */

function calculateWrongAnswers() {

    let wrong = 0;


    quizQuestions.forEach(
        function (question) {

            const selected =
                normalizeAnswer(
                    userAnswers[
                        question.QuestionID
                    ]
                );


            const correctAnswer =
                normalizeAnswer(
                    question.CorrectAnswer
                );


            if (
                !selected ||
                selected !== correctAnswer
            ) {

                wrong++;

            }

        }
    );


    return wrong;

}


/* =========================================================
   CALCULATE PERCENTAGE
========================================================= */

function calculatePercentage() {

    const total =
        quizQuestions.length;


    const correct =
        calculateCorrectAnswers();


    return total > 0
        ? Math.round(
            (
                correct /
                total
            ) *
            100
        )
        : 0;

}


/* =========================================================
   SUBMIT QUIZ
========================================================= */

function submitQuiz() {

    /* -----------------------------------------
       SAFETY
    ----------------------------------------- */

    if (
        quizCompleted
    ) {

        return;

    }


    /* -----------------------------------------
       CHECK ALL QUESTIONS ANSWERED
    ----------------------------------------- */

    const answered =
        quizQuestions.filter(
            function (question) {

                return Boolean(
                    userAnswers[
                        question.QuestionID
                    ]
                );

            }
        ).length;


    if (
        answered !==
        quizQuestions.length
    ) {

        updateSubmitSummary();

        return;

    }


    let correct = 0;

    let wrong = 0;


    quizQuestions.forEach(
        function (question) {

            const selected =
                normalizeAnswer(
                    userAnswers[
                        question.QuestionID
                    ]
                );


            const correctAnswer =
                normalizeAnswer(
                    question.CorrectAnswer
                );


            if (
                selected &&
                selected === correctAnswer
            ) {

                correct++;

            } else {

                wrong++;

            }

        }
    );


    const total =
        quizQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (
                    correct /
                    total
                ) *
                100
            )
            : 0;


    const passed =
        correct >= PASS_MARK;


    quizCompleted =
        true;


    quizStarted =
        false;


    quizPassed =
        passed;


    reviewMode =
        false;


    lastQuizResult = {

        correct:
            correct,

        wrong:
            wrong,

        total:
            total,

        percentage:
            percentage,

        passed:
            passed

    };


    clearSavedQuizState();


    showResult(
        correct,
        wrong,
        total,
        percentage,
        passed
    );

}


/* =========================================================
   RESULT
========================================================= */

function showResult(
    correct,
    wrong,
    total,
    percentage,
    passed
) {

    const scoreValue =
        document.getElementById(
            "scoreValue"
        );


    const scoreTotal =
        document.getElementById(
            "scoreTotal"
        );


    const scorePercentage =
        document.getElementById(
            "scorePercentage"
        );


    const correctElement =
        document.getElementById(
            "correctAnswers"
        );


    const wrongElement =
        document.getElementById(
            "wrongAnswers"
        );


    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    const resultStatus =
        document.getElementById(
            "resultStatus"
        );


    const resultIcon =
        document.getElementById(
            "resultIcon"
        );


    if (scoreValue) {

        scoreValue.textContent =
            correct;

    }


    if (scoreTotal) {

        scoreTotal.textContent =
            total;

    }


    if (scorePercentage) {

        scorePercentage.textContent =
            percentage +
            "%";

    }


    if (correctElement) {

        correctElement.textContent =
            correct;

    }


    if (wrongElement) {

        wrongElement.textContent =
            wrong;

    }


    if (resultStatus) {

        resultStatus.textContent =
            passed
                ? "Passed"
                : "Not Passed";


        resultStatus.classList.toggle(
            "passed",
            passed
        );


        resultStatus.classList.toggle(
            "failed",
            !passed
        );

    }


    if (resultMessage) {

        if (passed) {

            resultMessage.textContent =
                "Congratulations! You passed the " +
                getQuizSubcategory() +
                " quiz with " +
                correct +
                " out of " +
                total +
                " correct answers.";

        } else {

            resultMessage.textContent =
                "You scored " +
                correct +
                " out of " +
                total +
                ". You need at least " +
                PASS_MARK +
                " correct answers to pass.";

        }

    }


    if (resultIcon) {

        if (passed) {

            resultIcon.innerHTML =
                `<i class="fa-solid fa-trophy"></i>`;

        } else {

            resultIcon.innerHTML =
                `<i class="fa-solid fa-rotate-right"></i>`;

        }

    }


    /* =====================================================
       FINISH BUTTON
    ===================================================== */

    if (finishButton) {

        if (passed) {

            finishButton.hidden =
                false;

            finishButton.style.display =
                "inline-flex";

            finishButton.disabled =
                false;

            finishButton.innerHTML = `
                Finish
                <i class="fa-solid fa-check"></i>
            `;

        } else {

            finishButton.hidden =
                true;

            finishButton.style.display =
                "none";

            finishButton.disabled =
                true;

        }

    }


    /* =====================================================
       RETAKE BUTTON
    ===================================================== */

    if (retakeButton) {

        retakeButton.hidden =
            false;

        retakeButton.style.display =
            "inline-flex";

    }


    /* =====================================================
       EXPLANATION BUTTON
    ===================================================== */

    if (viewExplanationButton) {

        viewExplanationButton.hidden =
            false;

        viewExplanationButton.style.display =
            "inline-flex";

        viewExplanationButton.disabled =
            false;

        viewExplanationButton.innerHTML = `
            <i class="fa-solid fa-lightbulb"></i>
            View Explanations
        `;

    }


    if (reviewButton) {

        reviewButton.hidden =
            true;

        reviewButton.style.display =
            "none";

    }


    hideAllScreens();


    if (resultScreen) {

        resultScreen.hidden =
            false;

        resultScreen.classList.add(
            "active"
        );

    }

}


/* =========================================================
   SHOW RESULT SCREEN
========================================================= */

function showResultScreen() {

    reviewMode = false;


    if (!quizCompleted) {

        return;

    }


    showResult(
        lastQuizResult.correct,
        lastQuizResult.wrong,
        lastQuizResult.total,
        lastQuizResult.percentage,
        lastQuizResult.passed
    );

}


/* =========================================================
   VIEW EXPLANATIONS
========================================================= */

function showExplanationReview() {

    if (
        !quizCompleted ||
        !quizQuestions.length
    ) {

        return;

    }


    if (!explanationScreen) {

        console.error(
            "quizExplanationScreen not found."
        );

        return;

    }


    if (!explanationReviewList) {

        console.error(
            "explanationReviewList not found."
        );

        return;

    }


    let html = "";


    quizQuestions.forEach(
        function (question, index) {

            const selectedAnswer =
                normalizeAnswer(
                    userAnswers[
                        question.QuestionID
                    ]
                );


            const correctAnswer =
                normalizeAnswer(
                    question.CorrectAnswer
                );


            const selectedText =
                getOptionText(
                    question,
                    selectedAnswer
                );


            const correctText =
                getOptionText(
                    question,
                    correctAnswer
                );


            const explanation =
                String(
                    question.Explanation || ""
                ).trim();


            const isCorrect =
                selectedAnswer &&
                selectedAnswer ===
                correctAnswer;


            let selectedClass =
                "answer-box";


            if (isCorrect) {

                selectedClass +=
                    " correct-answer";

            }
            else if (selectedAnswer) {

                selectedClass +=
                    " wrong-answer";

            }


            html += `

                <article
                    class="explanation-review-item"
                >

                    <div class="explanation-question-number">
                        Question ${index + 1}
                    </div>


                    <h3 class="explanation-question">
                        ${escapeHTML(
                            question.Question
                        )}
                    </h3>


                    <div class="explanation-answers">

                        <div class="${selectedClass}">

                            <span class="answer-label">
                                Your Answer
                            </span>

                            <strong>
                                ${
                                    selectedAnswer
                                        ? escapeHTML(
                                            selectedAnswer +
                                            ". " +
                                            selectedText
                                        )
                                        : "Not Answered"
                                }
                            </strong>

                        </div>


                        <div class="answer-box correct-answer">

                            <span class="answer-label">
                                Correct Answer
                            </span>

                            <strong>
                                ${
                                    correctAnswer
                                        ? escapeHTML(
                                            correctAnswer +
                                            ". " +
                                            correctText
                                        )
                                        : "Not Available"
                                }
                            </strong>

                        </div>

                    </div>


                    <div class="explanation-content">

                        <div class="explanation-title">

                            <i class="fa-solid fa-lightbulb"></i>

                            Explanation

                        </div>


                        <p>
                            ${
                                explanation
                                    ? escapeHTML(
                                        explanation
                                    )
                                    : "No explanation available for this question."
                            }
                        </p>

                    </div>

                </article>

            `;

        }
    );


    explanationReviewList.innerHTML =
        html;


    hideAllScreens();


    explanationScreen.hidden =
        false;


    explanationScreen.classList.add(
        "active"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================================================
   GET OPTION TEXT
========================================================= */

function getOptionText(
    question,
    letter
) {

    switch (
        normalizeAnswer(letter)
    ) {

        case "A":

            return String(
                question.OptionA || ""
            ).trim();


        case "B":

            return String(
                question.OptionB || ""
            ).trim();


        case "C":

            return String(
                question.OptionC || ""
            ).trim();


        case "D":

            return String(
                question.OptionD || ""
            ).trim();


        default:

            return "";

    }

}


/* =========================================================
   RETAKE
========================================================= */

function retakeQuiz() {

    clearSavedQuizState();


    userAnswers = {};

    currentQuestionIndex = 0;

    quizCompleted = false;

    quizStarted = true;

    quizPassed = false;

    reviewMode = false;


    lastQuizResult = {

        correct: 0,
        wrong: 0,
        total: 0,
        percentage: 0,
        passed: false

    };


    try {

        createQuizQuestions();

        updateStartScreen();

        renderQuestion();

        showQuestionScreen();

    } catch (error) {

        console.error(
            "RETAKE ERROR:",
            error
        );


        showError(
            error.message ||
            "Unable to start quiz again."
        );

    }

}


/* =========================================================
   FINISH QUIZ
   ONLY AFTER ACTUAL PASS
========================================================= */

async function finishQuiz() {

    /* -----------------------------------------
       QUIZ MUST BE SUBMITTED
    ----------------------------------------- */

    if (
        !quizCompleted ||
        !quizPassed
    ) {

        console.warn(
            "Finish blocked: quiz not passed."
        );

        return;

    }


    /* -----------------------------------------
       ALL QUESTIONS MUST HAVE ANSWERS
    ----------------------------------------- */

    if (
        !quizQuestions.length
    ) {

        console.warn(
            "Finish blocked: no questions."
        );

        return;

    }


    const answeredCount =
        quizQuestions.filter(
            function (question) {

                return Boolean(
                    userAnswers[
                        question.QuestionID
                    ]
                );

            }
        ).length;


    if (
        answeredCount !==
        quizQuestions.length
    ) {

        console.warn(
            "Finish blocked: not all questions answered."
        );

        return;

    }


    /* -----------------------------------------
       SAVE COMPLETION
    ----------------------------------------- */

    /* WAIT for the save (local + Google Sheet) BEFORE leaving the page,
       otherwise the browser cancels the request and progress is lost */
    const saved =
        await saveCompletion();


    if (!saved) {

        console.warn(
            "Completion was not saved."
        );

        return;

    }


    /* -----------------------------------------
       GO TO DASHBOARD
    ----------------------------------------- */

    window.location.href =
        "dashboard.html";

}


/* =========================================================
   GET UNIVERSAL COMPLETION KEY
========================================================= */

function getCompletionKey() {

    const category =
        normalizeKey(
            getQuizCategory()
        );


    const subcategory =
        normalizeKey(
            getQuizSubcategory()
        );


    const userKey =
        getUserKey();


    if (
        !category ||
        !subcategory ||
        !userKey ||
        userKey === "guest"
    ) {

        return "";

    }


    return (
        "learn2live_" +
        category +
        "_" +
        subcategory +
        "_completed_" +
        userKey
    );

}


/* =========================================================
   SAVE COMPLETION
   UNIVERSAL - ALL CATEGORIES
========================================================= */

/* =========================================================
   SAVE COMPLETION
   LOCAL STORAGE + GOOGLE SHEETS
========================================================= */



async function saveCompletion() {

    if (!quizCompleted || !quizPassed) {
        return false;
    }

    if (!quizQuestions.length) {
        return false;
    }

    const answeredCount = quizQuestions.filter(
        function (question) {
            return Boolean(userAnswers[question.QuestionID]);
        }
    ).length;

    if (answeredCount !== quizQuestions.length) {
        return false;
    }

    const userKey = getUserKey();

    if (!userKey || userKey === "guest") {
        console.warn("Completion blocked: user not logged in.");
        return false;
    }

    const category = getQuizDisplayName(getQuizCategory());
    const subcategory = getQuizDisplayName(getQuizSubcategory());

    if (!category || !subcategory) {
        return false;
    }

    const completedAt = new Date().toISOString();
    const universalKey = getCompletionKey();

    if (!universalKey) {
        return false;
    }

    // SAVE UNIVERSAL CATEGORY + TOPIC COMPLETION
    localStorage.setItem(universalKey, "true");
    localStorage.setItem(universalKey + "_date", completedAt);

    // UNIVERSAL TOPIC COMPLETION KEYS
    const topicKeys = getTopicCompletionKeys(
        getQuizSubcategory(),
        userKey
    );

    topicKeys.forEach(function (key) {
        localStorage.setItem(key, "true");
        localStorage.setItem(key + "_date", completedAt);
    });

    // KEEP ORIGINAL LEGACY KEY
    const legacyKey =
        "learn2live_" +
        normalizeKey(getQuizSubcategory()) +
        "_completed_" +
        userKey;

    localStorage.setItem(legacyKey, "true");
    localStorage.setItem(legacyKey + "_date", completedAt);

    // LOCAL COMPLETION ARRAY
    try {
        let completedTopics = [];
        const existing = localStorage.getItem("learn2liveCompleted");

        if (existing) {
            const parsed = JSON.parse(existing);

            if (Array.isArray(parsed)) {
                completedTopics = parsed;
            }
        }

        const alreadyExists = completedTopics.some(
            function (item) {
                return (
                    String(item.email || "").toLowerCase() ===
                        userKey.toLowerCase() &&
                    normalizeKey(item.category) === normalizeKey(category) &&
                    normalizeKey(item.topic) === normalizeKey(subcategory)
                );
            }
        );

        if (!alreadyExists) {
            completedTopics.push({
                email: userKey,
                category: category,
                topic: subcategory,
                completed: true,
                completedAt: completedAt
            });
        } else {
            completedTopics = completedTopics.map(function (item) {
                if (
                    String(item.email || "").toLowerCase() ===
                        userKey.toLowerCase() &&
                    normalizeKey(item.category) === normalizeKey(category) &&
                    normalizeKey(item.topic) === normalizeKey(subcategory)
                ) {
                    return {
                        ...item,
                        completed: true,
                        completedAt: completedAt
                    };
                }

                return item;
            });
        }

        localStorage.setItem(
            "learn2liveCompleted",
            JSON.stringify(completedTopics)
        );

    } catch (error) {
        console.warn("Local completion array error:", error);
    }

    // SAVE TOPIC COMPLETION TO GOOGLE SHEETS
    let topicSaved = false;
    const currentUser = getCurrentUserForCompletion();

    try {
        const payload = {
            action: "complete",
            email: userKey,
            name: currentUser.name || "Learner",
            category: category,
            topic: subcategory,
            completed: true,
            completedAt: completedAt
        };

        /* log removed */;

        const response = await fetch(QUIZ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        /* log removed */;

        topicSaved = Boolean(result && result.success === true);

        if (!topicSaved) {
            console.warn("Google Sheets completion failed:", result);
        }

    } catch (error) {
        console.error("Google Sheets completion error:", error);
    }

    // CREATE/UPDATE CERTIFICATE ACTIVITY
    // Backend issues a certificate only when ALL topics
    // belonging to this category are completed.
    // This does not mark the certificate as downloaded.
    if (topicSaved) {
        try {
            const certificatePayload = {
                action: "certificateComplete",
                email: userKey,
                name: currentUser.name || "Learner",
                category: category,
                certificate: category + " Certificate"
            };

            /* log removed */;

            const certificateResponse = await fetch(QUIZ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(certificatePayload)
            });

            const certificateResult = await certificateResponse.json();

            if (
                certificateResult &&
                certificateResult.success === true
            ) {
                /* log removed */;
            } else {
                // The category may still have incomplete topics.
                /* log removed */;
            }

        } catch (error) {
            console.warn(
                "Certificate activity request failed:",
                error
            );
        }
    }

    // LOG
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;
    /* log removed */;

    return true;
}

// UNIVERSAL TOPIC KEY GENERATOR
function getTopicCompletionKeys(topicName, userKey) {

    const topic = normalizeText(topicName);

    const words = topic
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const snakeCase = words.join("_");
    const kebabCase = words.join("-");
    const camelCase = words
        .map(function (word, index) {
            return index === 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");

    const compact = words.join("");

    const variants = [
        snakeCase,
        kebabCase,
        camelCase,
        compact
    ];

    return [...new Set(variants)].map(function (key) {
        return "learn2live_" + key + "_completed_" + userKey;
    });
}


/* =========================================================
   CURRENT USER FOR COMPLETION
========================================================= */

function getCurrentUserForCompletion() {

    const possibleKeys = [

        "currentUser",

        "learn2liveUser",

        "user"

    ];


    for (
        const key of possibleKeys
    ) {

        try {

            const value =
                localStorage.getItem(
                    key
                );


            if (!value) {

                continue;

            }


            try {

                const parsed =
                    JSON.parse(
                        value
                    );


                if (
                    parsed &&
                    typeof parsed === "object"
                ) {

                    return parsed;

                }

            } catch {

                return {

                    email:
                        value

                };

            }

        } catch (error) {

            console.warn(
                "User read error:",
                error
            );

        }

    }


    return {

        name:
            "Learner",

        email:
            getUserKey()

    };

}

/* =========================================================
   CHECK RESUME STATE
========================================================= */

function checkResumeState() {

    const key =
        getQuizStorageKey();


    const saved =
        localStorage.getItem(
            key
        );


    savedQuizState =
        null;


    if (!saved) {

        if (resumeCard) {

            resumeCard.hidden =
                true;

        }

        return;

    }


    try {

        const parsed =
            JSON.parse(
                saved
            );


        if (
            !parsed ||
            parsed.status !==
            "incomplete"
        ) {

            if (resumeCard) {

                resumeCard.hidden =
                    true;

            }

            return;

        }


        const savedIDs =
            Array.isArray(
                parsed.questionIDs
            )
                ? parsed.questionIDs
                : [];


        const currentIDs =
            quizQuestions.map(
                function (q) {

                    return q.QuestionID;

                }
            );


        const sameSet =
            savedIDs.length ===
                currentIDs.length &&

            savedIDs.every(
                function (id) {

                    return currentIDs.includes(
                        id
                    );

                }
            );


        if (!sameSet) {

            localStorage.removeItem(
                key
            );


            if (resumeCard) {

                resumeCard.hidden =
                    true;

            }

            return;

        }


        savedQuizState =
            parsed;


        if (resumeCard) {

            resumeCard.hidden =
                false;

        }


        const resumeText =
            document.getElementById(
                "resumeText"
            );


        if (resumeText) {

            const answered =
                Object.keys(
                    parsed.answers || {}
                ).length;


            resumeText.textContent =
                "You answered " +
                answered +
                " of " +
                quizQuestions.length +
                " questions. Continue where you stopped.";

        }

    } catch (error) {

        console.error(
            "Resume state error:",
            error
        );


        localStorage.removeItem(
            key
        );


        if (resumeCard) {

            resumeCard.hidden =
                true;

        }

    }

}


/* =========================================================
   SAVE QUIZ STATE
========================================================= */

function saveQuizState() {

    if (
        !quizStarted ||
        quizCompleted ||
        !quizQuestions.length
    ) {

        return;

    }


    const state = {

        version:
            1,

        status:
            "incomplete",

        category:
            getQuizCategory(),

        subcategory:
            getQuizSubcategory(),

        questionIDs:
            quizQuestions.map(
                function (question) {

                    return question.QuestionID;

                }
            ),

        currentIndex:
            currentQuestionIndex,

        answers:
            userAnswers,

        total:
            quizQuestions.length,

        savedAt:
            new Date().toISOString()

    };


    try {

        localStorage.setItem(
            getQuizStorageKey(),
            JSON.stringify(
                state
            )
        );

    } catch (error) {

        console.error(
            "Save quiz state error:",
            error
        );

    }

}


/* =========================================================
   CLEAR SAVED STATE
========================================================= */

function clearSavedQuizState() {

    try {

        localStorage.removeItem(
            getQuizStorageKey()
        );

    } catch (error) {

        console.error(
            error
        );

    }


    savedQuizState =
        null;


    if (resumeCard) {

        resumeCard.hidden =
            true;

    }

}


/* =========================================================
   QUIZ STORAGE KEY
   UNIQUE PER CATEGORY + SUBCATEGORY + USER
========================================================= */

function getQuizStorageKey() {

    return (
        "learn2live_quiz_" +

        normalizeKey(
            getQuizCategory()
        ) +

        "_" +

        normalizeKey(
            getQuizSubcategory()
        ) +

        "_" +

        normalizeKey(
            getUserKey()
        )
    );

}


/* =========================================================
   USER KEY
   SAME USER IDENTIFIER FOR ALL PAGES
========================================================= */

function getUserKey() {

    try {

        /* -----------------------------------------
           PRIMARY LOGIN KEY
        ----------------------------------------- */

        const loggedInEmail =
            localStorage.getItem(
                "loggedInEmail"
            );


        if (
            loggedInEmail &&
            loggedInEmail.trim()
        ) {

            return loggedInEmail
                .trim()
                .toLowerCase();

        }

    } catch (error) {

        console.warn(
            "loggedInEmail error:",
            error
        );

    }


    /* -----------------------------------------
       FALLBACK CURRENT USER
    ----------------------------------------- */

    try {

        if (
            typeof getCurrentUser ===
            "function"
        ) {

            const user =
                getCurrentUser();


            if (user) {

                if (
                    typeof user ===
                    "string"
                ) {

                    return user
                        .trim()
                        .toLowerCase();

                }


                const value =
                    user.email ||
                    user.id ||
                    user.userId ||
                    user.username ||
                    "";


                if (value) {

                    return String(
                        value
                    )
                        .trim()
                        .toLowerCase();

                }

            }

        }

    } catch (error) {

        console.warn(
            "getCurrentUser error:",
            error
        );

    }


    /* -----------------------------------------
       CURRENT USER ID
    ----------------------------------------- */

    try {

        const currentUserId =
            localStorage.getItem(
                "currentUserId"
            );


        if (
            currentUserId &&
            currentUserId.trim()
        ) {

            return currentUserId
                .trim()
                .toLowerCase();

        }

    } catch (error) {

        console.warn(
            "currentUserId error:",
            error
        );

    }


    /* -----------------------------------------
       CURRENT USER OBJECT
    ----------------------------------------- */

    try {

        const currentUser =
            localStorage.getItem(
                "currentUser"
            );


        if (
            currentUser &&
            currentUser.trim()
        ) {

            try {

                const parsed =
                    JSON.parse(
                        currentUser
                    );


                const value =
                    parsed.email ||
                    parsed.id ||
                    parsed.userId ||
                    parsed.username ||
                    "";


                if (value) {

                    return String(
                        value
                    )
                        .trim()
                        .toLowerCase();

                }

            } catch {

                return currentUser
                    .trim()
                    .toLowerCase();

            }

        }

    } catch (error) {

        console.warn(
            "currentUser error:",
            error
        );

    }


    return "guest";

}


/* =========================================================
   UPDATE START SCREEN
========================================================= */

function updateStartScreen() {

    const count =
        document.getElementById(
            "questionCount"
        );


    if (count) {

        count.textContent =
            quizQuestions.length;

    }


    if (startButton) {

        startButton.innerHTML = `
            Start ${escapeHTML(
                getQuizSubcategory()
            )} Quiz
            <i class="fa-solid fa-arrow-right"></i>
        `;

    }


    const totalQuestions =
        document.getElementById(
            "totalQuestions"
        );


    if (totalQuestions) {

        totalQuestions.textContent =
            quizQuestions.length;

    }

}


/* =========================================================
   QUESTION SCREEN
========================================================= */

function showQuestionScreen() {

    hideAllScreens();


    if (questionScreen) {

        questionScreen.hidden =
            false;

        questionScreen.classList.add(
            "active"
        );

    }


    updateQuestionNavigator();

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    hideAllScreens();


    if (loadingScreen) {

        loadingScreen.hidden =
            false;

        loadingScreen.style.display =
            "flex";

    }

}


/* =========================================================
   ERROR
========================================================= */

function showError(
    message
) {

    hideAllScreens();


    if (errorScreen) {

        errorScreen.hidden =
            false;

        errorScreen.style.display =
            "flex";

    }


    const errorMessage =
        document.getElementById(
            "quizErrorMessage"
        );


    if (errorMessage) {

        errorMessage.textContent =
            message ||
            "Unable to load quiz questions.";

    }

}


/* =========================================================
   HIDE ALL SCREENS
========================================================= */

function hideAllScreens() {

    const screens = [

        startScreen,

        questionScreen,

        submitScreen,

        resultScreen,

        explanationScreen

    ];


    screens.forEach(
        function (screen) {

            if (screen) {

                screen.hidden =
                    true;

                screen.classList.remove(
                    "active"
                );

            }

        }
    );


    if (loadingScreen) {

        loadingScreen.hidden =
            true;

        loadingScreen.style.display =
            "none";

    }


    if (errorScreen) {

        errorScreen.hidden =
            true;

        errorScreen.style.display =
            "none";

    }

}


/* =========================================================
   BACK
========================================================= */

function handleBack() {

    /* -----------------------------------------
       EXPLANATION → RESULT
    ----------------------------------------- */

    if (
        explanationScreen &&
        explanationScreen.classList.contains(
            "active"
        )
    ) {

        showResultScreen();

        return;

    }


    /* -----------------------------------------
       QUESTION → EXIT
    ----------------------------------------- */

    if (
        questionScreen &&
        questionScreen.classList.contains(
            "active"
        )
    ) {

        openExit();

        return;

    }


    /* -----------------------------------------
       SUBMIT → QUESTION
    ----------------------------------------- */

    if (
        submitScreen &&
        submitScreen.classList.contains(
            "active"
        )
    ) {

        renderQuestion();

        showQuestionScreen();

        return;

    }


    /* -----------------------------------------
       RESULT
    ----------------------------------------- */

    if (
        resultScreen &&
        resultScreen.classList.contains(
            "active"
        )
    ) {

        if (
            quizCompleted &&
            quizPassed
        ) {

            finishQuiz();

            return;

        }


        return;

    }


    window.location.href =
        "dashboard.html";

}


/* =========================================================
   OPEN EXIT MODAL
========================================================= */

function openExit() {

    saveQuizState();


    if (exitModal) {

        exitModal.hidden =
            false;

    }

}


/* =========================================================
   CLOSE EXIT MODAL
========================================================= */

function closeExit() {

    if (exitModal) {

        exitModal.hidden =
            true;

    }

}


/* =========================================================
   EXIT QUIZ
========================================================= */

function exitQuiz() {

    saveQuizState();

    closeExit();

    window.location.href =
        "dashboard.html";

}


/* =========================================================
   NORMALIZE ANSWER
========================================================= */

function normalizeAnswer(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const answer =
        String(value)
            .trim()
            .toUpperCase();


    if (
        ["A", "B", "C", "D"].includes(
            answer
        )
    ) {

        return answer;

    }


    const match =
        answer.match(
            /\b([ABCD])\b/
        );


    if (match) {

        return match[1];

    }


    return answer;

}


/* =========================================================
   CLEAN VALUE
========================================================= */

function cleanValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    ).trim();

}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(value) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


/* =========================================================
   NORMALIZE KEY
========================================================= */

function normalizeKey(value) {

    return normalizeText(
        value
    )
        .replace(
            /[^a-z0-9]+/g,
            "_"
        )
        .replace(
            /^_+|_+$/g,
            ""
        );

}


function getTopicCompletionKeys(topicName, userKey) {
    const topic = normalizeText(topicName);

    const words = topic
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const snakeCase = words.join("_");
    const kebabCase = words.join("-");
    const camelCase = words
        .map(function (word, index) {
            return index === 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
    const compact = words.join("");

    const variants = [
        snakeCase,
        kebabCase,
        camelCase,
        compact
    ];

    return [...new Set(variants)].map(function (key) {
        return "learn2live_" + key + "_completed_" + userKey;
    });
}



/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }


    return array;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   END
========================================================= */