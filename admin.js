/* =========================================================
   LEARN2LIVE ADMIN.JS
   FINAL ADMIN DASHBOARD + QUESTION MANAGEMENT
   + CERTIFICATE DOWNLOAD TRACKING
========================================================= */


/* =========================================================
   API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";


/* =========================================================
   GLOBAL STATE
========================================================= */

let allQuestions = [];
let filteredQuestions = [];

let allUsers = [];
let filteredUsers = [];

let allNotifications = [];

let allCertificateDownloads = [];
let filteredCertificateDownloads = [];

let currentPage = 1;

const QUESTIONS_PER_PAGE = 10;

let deleteQuestionId = null;

let toastTimer = null;


/* =========================================================
   CATEGORY DATA
========================================================= */

const CATEGORY_DATA = {

    "First Aid": [
        "CPR",
        "Bleeding",
        "Burns",
        "Choking",
        "Bites"
    ],

    "Banking": [
        "Bank Accounts",
        "ATM",
        "Online Banking",
        "Loans",
        "Banking Security"
    ],

    "Tax Basics": [
        "Tax Fundamentals",
        "Income Tax",
        "Taxable Income",
        "Tax Deductions",
        "Tax Filing"
    ],

    "Digital Safety": [
        "Password Security",
        "Online Scams",
        "Privacy Protection",
        "Social Media Safety",
        "Safe Online Payments"
    ],

    "Legal Rights": [
        "Basic Legal Rights",
        "Consumer Rights",
        "Cyber Rights",
        "Child Rights",
        "Legal Help"
    ],

    "Interview Skills": [
        "CV",
        "Communication Skills",
        "Interview Preparation",
        "Common Interview Questions",
        "Professional Etiquette"
    ]

};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeAdmin();

});


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeAdmin() {

    setupNavigation();

    setupSidebar();

    setupModals();

    setupQuestionForm();

    setupQuestionFilters();

    setupUserSearch();

    setupCertificateSearch();

    setupNotificationForm();

    setupLogout();

    loadAdminName();

    populateCategorySelects();

    await loadAllData();

}


/* =========================================================
   LOAD ALL DATA
========================================================= */

async function loadAllData() {

    showDashboardLoading();

    try {

        await Promise.all([
            loadQuestions(),
            loadUsers(),
            loadNotifications(),
            loadCertificateDownloads()
        ]);

        renderDashboard();

    } catch (error) {

        console.error(
            "Admin data loading error:",
            error
        );

        showToast(
            "Error",
            "Unable to load admin data.",
            "error"
        );

    }

}


/* =========================================================
   GENERIC GET API
========================================================= */

async function fetchAPI(type) {

    const url =
        `${API_URL}?type=${encodeURIComponent(type)}`;

    const response = await fetch(url, {
        method: "GET",
        cache: "no-store"
    });

    if (!response.ok) {

        throw new Error(
            `HTTP error ${response.status}`
        );

    }

    const data = await response.json();

    return normalizeAPIResponse(data);

}


/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

function normalizeAPIResponse(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (!data || typeof data !== "object") {
        return [];
    }

    if (Array.isArray(data.data)) {
        return data.data;
    }

    if (Array.isArray(data.records)) {
        return data.records;
    }

    if (Array.isArray(data.questions)) {
        return data.questions;
    }

    if (Array.isArray(data.users)) {
        return data.users;
    }

    if (Array.isArray(data.notifications)) {
        return data.notifications;
    }

    if (Array.isArray(data.certificates)) {
        return data.certificates;
    }

    if (Array.isArray(data.certificateDownloads)) {
        return data.certificateDownloads;
    }

    return [];
}


/* =========================================================
   LOAD QUESTIONS
========================================================= */

async function loadQuestions() {

    try {

        const data =
            await fetchAPI("questions");

        allQuestions =
            data.map(normalizeQuestion);

        filteredQuestions =
            [...allQuestions];

        updateQuestionCount();

        renderQuestions();

        renderDashboard();

    } catch (error) {

        console.error(
            "Question loading error:",
            error
        );

        allQuestions = [];

        filteredQuestions = [];

        renderQuestionsError();

    }

}


/* =========================================================
   NORMALIZE QUESTION
========================================================= */

function normalizeQuestion(question) {

    return {

        id: cleanValue(
            question.QuestionID ??
            question.questionID ??
            question.ID ??
            question.Id ??
            question.id
        ),

        category: cleanValue(
            question.Category ??
            question.category
        ),

        subcategory: cleanValue(
            question.Subcategory ??
            question.SubCategory ??
            question.subcategory
        ),

        text: cleanValue(
            question.Question ??
            question.question ??
            question.QuestionText
        ),

        optionA: cleanValue(
            question.OptionA ??
            question["Option A"] ??
            question.A ??
            question.optionA
        ),

        optionB: cleanValue(
            question.OptionB ??
            question["Option B"] ??
            question.B ??
            question.optionB
        ),

        optionC: cleanValue(
            question.OptionC ??
            question["Option C"] ??
            question.C ??
            question.optionC
        ),

        optionD: cleanValue(
            question.OptionD ??
            question["Option D"] ??
            question.D ??
            question.optionD
        ),

        correctAnswer: cleanValue(
            question.CorrectAnswer ??
            question["Correct Answer"] ??
            question.Answer ??
            question.correctAnswer
        ),

        explanation: cleanValue(
            question.Explanation ??
            question.explanation
        ),

        createdAt: cleanValue(
            question.CreatedAt ??
            question["Created At"] ??
            question.Timestamp ??
            question.Date ??
            question.createdAt
        )

    };

}


/* =========================================================
   LOAD USERS
========================================================= */

async function loadUsers() {

    try {

        const data =
            await fetchAPI("users");

        allUsers =
            data.map(normalizeUser);

        filteredUsers =
            [...allUsers];

        updateUserCount();

        renderUsers();

        renderDashboard();

    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

        allUsers = [];

        filteredUsers = [];

        renderUsersError();

    }

}


/* =========================================================
   NORMALIZE USER
========================================================= */

function normalizeUser(user) {
    return {
        id: cleanValue(
            user.userId ??
            user.UserId ??
            user.UserID ??
            user.userID ??
            user.ID ??
            user.Id ??
            user.id
        ),

        username: cleanValue(
            user.username ??
            user.Username ??
            user.UserName
        ),

        name: cleanValue(
            user.name ??
            user.Name ??
            user.FullName ??
            user["Full Name"]
        ),

        email: cleanValue(
            user.email ??
            user.Email
        ),

        createdAt: cleanValue(
            user.createdAt ??
            user.CreatedAt ??
            user["Created At"] ??
            user.Timestamp ??
            user.Date
        ),

        lastLogin: cleanValue(
            user.lastLogin ??
            user.LastLogin ??
            user["Last Login"]
        ),

        status: cleanValue(
            user.status ??
            user.Status
        ) || "Active"
    };
}

/* =========================================================
   LOAD NOTIFICATIONS
========================================================= */

async function loadNotifications() {

    try {

        const data =
            await fetchAPI("notifications");

        allNotifications =
            data.map(normalizeNotification);

        updateNotificationCount();

        renderNotifications();

        renderDashboard();

    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );

        allNotifications = [];

        renderNotificationsError();

    }

}


/* =========================================================
   NORMALIZE NOTIFICATION
========================================================= */

function normalizeNotification(notification) {

    return {

        id: cleanValue(
            notification.NotificationID ??
            notification.notificationID ??
            notification.ID ??
            notification.Id ??
            notification.id
        ),

        title: cleanValue(
            notification.Title ??
            notification.title
        ),

        message: cleanValue(
            notification.Message ??
            notification.message
        ),

        type: cleanValue(
            notification.Type ??
            notification.type
        ) || "info",

        createdAt: cleanValue(
            notification.CreatedAt ??
            notification["Created At"] ??
            notification.Timestamp ??
            notification.Date
        )

    };

}


/* =========================================================
   LOAD CERTIFICATE DOWNLOADS
========================================================= */

async function loadCertificateDownloads() {
    const tbody = document.getElementById(
        "certificateDownloadsTableBody"
    );

    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="table-loading">
                    <i class="ri-loader-4-line"></i>
                    Loading certificate activity...
                </td>
            </tr>
        `;
    }

    try {
        const data = await fetchAPI("certificates");

        allCertificateDownloads = data.map(
            normalizeCertificateDownload
        );

        filteredCertificateDownloads = [
            ...allCertificateDownloads
        ];

        updateCertificateDownloadCount();
        renderCertificateDownloads();
        renderDashboard();

        console.log(
            "Certificate records loaded:",
            allCertificateDownloads.length,
            allCertificateDownloads
        );

    } catch (error) {
        console.error(
            "Certificate download loading error:",
            error
        );

        allCertificateDownloads = [];
        filteredCertificateDownloads = [];

        setText("certificateDownloadTotal", "0");
        setText("certificateUniqueTotal", "0");
        setText("sidebarCertificateCount", "0");

        renderCertificateDownloadsError();
    }
}


/* =========================================================
   NORMALIZE CERTIFICATE DOWNLOAD
========================================================= */

function normalizeCertificateDownload(record) {
    return {
        email: cleanValue(
            record.Email ??
            record.email
        ),

        name: cleanValue(
            record.Name ??
            record.name ??
            record.Username ??
            record.username
        ),

        category: cleanValue(
            record.Category ??
            record.category
        ),

        certificate: cleanValue(
            record.Certificate ??
            record.certificate ??
            record.CertificateID ??
            record.CertificateId ??
            record.certificateId
        ),

        downloaded: cleanValue(
            record.Downloaded ??
            record.downloaded
        ),

        downloadedAt: cleanValue(
            record.DownloadedAt ??
            record["Downloaded At"] ??
            record.Timestamp ??
            record.Date ??
            record.downloadedAt
        )
    };
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    renderDashboardStats();

    renderCategoryOverview();

    renderRecentQuestions();

    renderDashboardNotifications();

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

function renderDashboardStats() {

    const totalQuestions =
        allQuestions.length;

    const totalUsers =
        allUsers.length;

    const totalNotifications =
        allNotifications.length;

    const totalCertificates =
        allCertificateDownloads.length;

    const categories =
        new Set(
            allQuestions
                .map(q => q.category)
                .filter(Boolean)
        );

    setText(
        "dashboardTotalQuestions",
        totalQuestions
    );

    setText(
        "dashboardTotalUsers",
        totalUsers
    );

    setText(
        "dashboardTotalNotifications",
        totalNotifications
    );

    setText(
        "dashboardTotalCategories",
        categories.size
    );

    setText(
        "dashboardTotalCertificates",
        totalCertificates
    );

}


/* =========================================================
   CATEGORY OVERVIEW
========================================================= */

function renderCategoryOverview() {

    const container =
        document.getElementById(
            "categoryOverviewList"
        );

    if (!container) return;


    if (!allQuestions.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="ri-folder-open-line"></i>
                </div>

                <h3>No Questions Yet</h3>

                <p>
                    Add questions to see category distribution.
                </p>
            </div>
        `;

        return;

    }


    const categoryCounts = {};


    allQuestions.forEach(question => {

        const category =
            question.category || "Uncategorized";

        categoryCounts[category] =
            (categoryCounts[category] || 0) + 1;

    });


    const sortedCategories =
        Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1]);


    const total =
        allQuestions.length;


    container.innerHTML =
        sortedCategories
            .map(([category, count]) => {

                const percentage =
                    total
                        ? Math.round(
                            (count / total) * 100
                        )
                        : 0;

                return `

                    <div class="category-overview-item">

                        <div class="category-overview-top">

                            <div class="category-name">

                                <span class="category-dot"></span>

                                <strong>
                                    ${escapeHTML(category)}
                                </strong>

                            </div>

                            <span class="category-count">
                                ${count}
                            </span>

                        </div>


                        <div class="category-progress">

                            <span
                                style="width:${percentage}%"
                            ></span>

                        </div>


                        <small>
                            ${percentage}% of questions
                        </small>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   RECENT QUESTIONS
========================================================= */

function renderRecentQuestions() {

    const tbody =
        document.getElementById(
            "recentQuestionsTableBody"
        );

    if (!tbody) return;


    if (!allQuestions.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-empty"
                >

                    <i class="ri-question-line"></i>

                    No questions available.

                </td>

            </tr>

        `;

        return;

    }


    const recentQuestions =
        getRecentRecords(
            allQuestions,
            6
        );


    tbody.innerHTML =
        recentQuestions
            .map(question => {

                return `

                    <tr>

                        <td>
                            <span class="id-badge">
                                ${escapeHTML(
                                    question.id || "-"
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHTML(
                                question.category || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                question.subcategory || "-"
                            )}
                        </td>

                        <td>
                            <div class="question-preview">
                                ${escapeHTML(
                                    truncateText(
                                        question.text,
                                        75
                                    )
                                )}
                            </div>
                        </td>

                        <td>

                            <span class="answer-badge">
                                ${escapeHTML(
                                    question.correctAnswer || "-"
                                )}
                            </span>

                        </td>

                        <td>

                            <div class="table-actions">

                                <button
                                    type="button"
                                    class="icon-action view-action"
                                    title="View"
                                    onclick="viewQuestion('${escapeJS(
                                        question.id
                                    )}')"
                                >

                                    <i class="ri-eye-line"></i>

                                </button>

                                <button
                                    type="button"
                                    class="icon-action edit-action"
                                    title="Edit"
                                    onclick="editQuestion('${escapeJS(
                                        question.id
                                    )}')"
                                >

                                    <i class="ri-edit-line"></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            })
            .join("");

}


/* =========================================================
   RECENT NOTIFICATIONS
========================================================= */

function renderDashboardNotifications() {

    const container =
        document.getElementById(
            "dashboardNotificationList"
        );

    if (!container) return;


    if (!allNotifications.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="ri-notification-off-line"></i>
                </div>

                <h3>
                    No Notifications
                </h3>

                <p>
                    No announcements have been created yet.
                </p>

            </div>

        `;

        return;

    }


    const recent =
        getRecentRecords(
            allNotifications,
            4
        );


    container.innerHTML =
        recent
            .map(notification => {

                const type =
                    notification.type
                        .toLowerCase();


                return `

                    <div class="dashboard-notification-item">

                        <div class="dashboard-notification-icon ${escapeHTML(
                            type
                        )}">

                            <i class="${getNotificationIcon(
                                type
                            )}"></i>

                        </div>


                        <div class="dashboard-notification-content">

                            <strong>
                                ${escapeHTML(
                                    notification.title || "Notification"
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    truncateText(
                                        notification.message,
                                        100
                                    )
                                )}
                            </p>

                            <small>
                                ${formatDate(
                                    notification.createdAt
                                )}
                            </small>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   GET RECENT RECORDS
========================================================= */

function getRecentRecords(records, limit) {

    if (!records.length) {
        return [];
    }


    const hasDates =
        records.some(
            record =>
                record.createdAt &&
                !isNaN(
                    new Date(
                        record.createdAt
                    ).getTime()
                )
        );


    if (hasDates) {

        return [...records]
            .sort(
                (a, b) =>
                    getDateValue(b.createdAt) -
                    getDateValue(a.createdAt)
            )
            .slice(0, limit);

    }


    return [...records]
        .slice(-limit)
        .reverse();

}


/* =========================================================
   QUESTION FILTERS
========================================================= */

function setupQuestionFilters() {

    const search =
        document.getElementById(
            "questionSearch"
        );

    const category =
        document.getElementById(
            "questionCategoryFilter"
        );

    const subcategory =
        document.getElementById(
            "questionSubcategoryFilter"
        );

    const clear =
        document.getElementById(
            "clearQuestionFilters"
        );


    if (search) {

        search.addEventListener(
            "input",
            applyQuestionFilters
        );

    }


    if (category) {

        category.addEventListener(
            "change",
            () => {

                populateSubcategory(
                    category.value,
                    subcategory
                );

                applyQuestionFilters();

            }
        );

    }


    if (subcategory) {

        subcategory.addEventListener(
            "change",
            applyQuestionFilters
        );

    }


    if (clear) {

        clear.addEventListener(
            "click",
            clearQuestionFilters
        );

    }

}


/* =========================================================
   APPLY QUESTION FILTERS
========================================================= */

function applyQuestionFilters() {

    const search =
        getElementValue(
            "questionSearch"
        ).toLowerCase();

    const category =
        getElementValue(
            "questionCategoryFilter"
        );

    const subcategory =
        getElementValue(
            "questionSubcategoryFilter"
        );


    filteredQuestions =
        allQuestions.filter(question => {

            const searchableText = [

                question.id,

                question.category,

                question.subcategory,

                question.text,

                question.optionA,

                question.optionB,

                question.optionC,

                question.optionD,

                question.correctAnswer

            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(search);


            const matchesCategory =
                !category ||
                question.category === category;


            const matchesSubcategory =
                !subcategory ||
                question.subcategory === subcategory;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesSubcategory
            );

        });


    currentPage = 1;

    renderQuestions();

}


/* =========================================================
   CLEAR QUESTION FILTERS
========================================================= */

function clearQuestionFilters() {

    const search =
        document.getElementById(
            "questionSearch"
        );

    const category =
        document.getElementById(
            "questionCategoryFilter"
        );

    const subcategory =
        document.getElementById(
            "questionSubcategoryFilter"
        );


    if (search) {
        search.value = "";
    }


    if (category) {
        category.value = "";
    }


    if (subcategory) {

        subcategory.innerHTML = `
            <option value="">
                All Subcategories
            </option>
        `;

        subcategory.disabled = true;

    }


    filteredQuestions =
        [...allQuestions];

    currentPage = 1;

    renderQuestions();

}


/* =========================================================
   RENDER QUESTIONS
========================================================= */

function renderQuestions() {

    const tbody =
        document.getElementById(
            "questionsTableBody"
        );

    if (!tbody) return;


    updateQuestionTableTotal();


    if (!filteredQuestions.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-empty"
                >

                    <i class="ri-search-eye-line"></i>

                    No questions found.

                </td>

            </tr>

        `;

        updatePagination();

        return;

    }


    const start =
        (currentPage - 1) *
        QUESTIONS_PER_PAGE;


    const end =
        start +
        QUESTIONS_PER_PAGE;


    const pageQuestions =
        filteredQuestions.slice(
            start,
            end
        );


    tbody.innerHTML =
        pageQuestions
            .map(question => {

                return `

                    <tr>

                        <td>

                            <span class="id-badge">

                                ${escapeHTML(
                                    question.id || "-"
                                )}

                            </span>

                        </td>


                        <td>
                            ${escapeHTML(
                                question.category || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                question.subcategory || "-"
                            )}
                        </td>


                        <td>

                            <div class="question-preview">

                                ${escapeHTML(
                                    truncateText(
                                        question.text,
                                        90
                                    )
                                )}

                            </div>

                        </td>


                        <td>

                            <span class="answer-badge">

                                ${escapeHTML(
                                    question.correctAnswer || "-"
                                )}

                            </span>

                        </td>


                        <td>

                            <div class="table-actions">

                                <button
                                    type="button"
                                    class="icon-action view-action"
                                    title="View Question"
                                    onclick="viewQuestion('${escapeJS(
                                        question.id
                                    )}')"
                                >

                                    <i class="ri-eye-line"></i>

                                </button>


                                <button
                                    type="button"
                                    class="icon-action edit-action"
                                    title="Edit Question"
                                    onclick="editQuestion('${escapeJS(
                                        question.id
                                    )}')"
                                >

                                    <i class="ri-edit-line"></i>

                                </button>


                                <button
                                    type="button"
                                    class="icon-action delete-action"
                                    title="Delete Question"
                                    onclick="askDeleteQuestion('${escapeJS(
                                        question.id
                                    )}')"
                                >

                                    <i class="ri-delete-bin-line"></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            })
            .join("");


    updatePagination();

}


/* =========================================================
   QUESTION PAGINATION
========================================================= */

function updatePagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredQuestions.length /
                QUESTIONS_PER_PAGE
            )
        );


    const previous =
        document.getElementById(
            "previousPage"
        );

    const next =
        document.getElementById(
            "nextPage"
        );

    const pageInfo =
        document.getElementById(
            "pageInfo"
        );


    if (currentPage > totalPages) {
        currentPage = totalPages;
    }


    if (previous) {

        previous.disabled =
            currentPage <= 1;

    }


    if (next) {

        next.disabled =
            currentPage >= totalPages;

    }


    if (pageInfo) {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }

}


/* =========================================================
   PAGINATION EVENTS
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#previousPage"
            )
        ) {

            if (currentPage > 1) {

                currentPage--;

                renderQuestions();

            }

        }


        if (
            event.target.closest(
                "#nextPage"
            )
        ) {

            const totalPages =
                Math.ceil(
                    filteredQuestions.length /
                    QUESTIONS_PER_PAGE
                );


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderQuestions();

            }

        }

    }
);


/* =========================================================
   QUESTION COUNT
========================================================= */

function updateQuestionCount() {

    setText(
        "sidebarQuestionCount",
        allQuestions.length
    );

}


/* =========================================================
   QUESTION TABLE TOTAL
========================================================= */

function updateQuestionTableTotal() {

    const element =
        document.getElementById(
            "questionTableTotal"
        );

    if (!element) return;


    const count =
        filteredQuestions.length;


    element.textContent =
        `${count} question${count === 1 ? "" : "s"}`;

}


/* =========================================================
   VIEW QUESTION
========================================================= */

function viewQuestion(id) {

    const question =
        allQuestions.find(
            q => String(q.id) === String(id)
        );


    if (!question) {

        showToast(
            "Error",
            "Question not found.",
            "error"
        );

        return;

    }


    setText(
        "viewQuestionId",
        question.id || "-"
    );

    setText(
        "viewQuestionCategory",
        question.category || "-"
    );

    setText(
        "viewQuestionSubcategory",
        question.subcategory || "-"
    );

    setText(
        "viewQuestionText",
        question.text || "-"
    );

    setText(
        "viewOptionA",
        question.optionA || "-"
    );

    setText(
        "viewOptionB",
        question.optionB || "-"
    );

    setText(
        "viewOptionC",
        question.optionC || "-"
    );

    setText(
        "viewOptionD",
        question.optionD || "-"
    );

    setText(
        "viewCorrectAnswer",
        question.correctAnswer || "-"
    );

    setText(
        "viewExplanation",
        question.explanation || "No explanation provided."
    );


    openModal(
        "viewQuestionModal"
    );

}


/* =========================================================
   EDIT QUESTION
========================================================= */

function editQuestion(id) {

    const question =
        allQuestions.find(
            q => String(q.id) === String(id)
        );


    if (!question) {

        showToast(
            "Error",
            "Question not found.",
            "error"
        );

        return;

    }


    setText(
        "questionFormTitle",
        "Edit Question"
    );

    setText(
        "questionFormSubtitle",
        "Update this question in the Learn2Live question bank."
    );


    setInputValue(
        "questionId",
        question.id
    );

    setInputValue(
        "questionCategory",
        question.category
    );


    const subcategory =
        document.getElementById(
            "questionSubcategory"
        );


    populateSubcategory(
        question.category,
        subcategory
    );


    setInputValue(
        "questionSubcategory",
        question.subcategory
    );


    setInputValue(
        "questionText",
        question.text
    );

    setInputValue(
        "optionA",
        question.optionA
    );

    setInputValue(
        "optionB",
        question.optionB
    );

    setInputValue(
        "optionC",
        question.optionC
    );

    setInputValue(
        "optionD",
        question.optionD
    );

    setInputValue(
        "correctAnswer",
        question.correctAnswer
    );

    setInputValue(
        "explanation",
        question.explanation
    );


    setText(
        "saveQuestionButton",
        "Update Question"
    );


    showSection(
        "addQuestionSection"
    );

}


/* =========================================================
   QUESTION FORM
========================================================= */

function setupQuestionForm() {

    const form =
        document.getElementById(
            "questionForm"
        );

    const category =
        document.getElementById(
            "questionCategory"
        );

    const subcategory =
        document.getElementById(
            "questionSubcategory"
        );

    const cancel =
        document.getElementById(
            "cancelQuestionButton"
        );


    if (category) {

        category.addEventListener(
            "change",
            () => {

                populateSubcategory(
                    category.value,
                    subcategory
                );

            }
        );

    }


    if (cancel) {

        cancel.addEventListener(
            "click",
            resetQuestionForm
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            saveQuestion
        );

    }

}


/* =========================================================
   SAVE QUESTION
========================================================= */

async function saveQuestion(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "questionForm"
        );


    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    const id =
        getElementValue(
            "questionId"
        );


    const question = {

        QuestionID: id,

        Category:
            getElementValue(
                "questionCategory"
            ),

        Subcategory:
            getElementValue(
                "questionSubcategory"
            ),

        Question:
            getElementValue(
                "questionText"
            ),

        OptionA:
            getElementValue(
                "optionA"
            ),

        OptionB:
            getElementValue(
                "optionB"
            ),

        OptionC:
            getElementValue(
                "optionC"
            ),

        OptionD:
            getElementValue(
                "optionD"
            ),

        CorrectAnswer:
            getElementValue(
                "correctAnswer"
            ),

        Explanation:
            getElementValue(
                "explanation"
            )

    };


    const action =
        id
            ? "edit"
            : "add";


    const button =
        document.getElementById(
            "saveQuestionButton"
        );


    setButtonLoading(
        button,
        true,
        id
            ? "Updating..."
            : "Saving..."
    );


    try {

        await postAPI({

            action: action,

            question: question

        });


        showToast(
            "Success",
            id
                ? "Question updated successfully."
                : "Question added successfully.",
            "success"
        );


        resetQuestionForm();

        await loadQuestions();

        showSection(
            "questionsSection"
        );


    } catch (error) {

        console.error(
            "Save question error:",
            error
        );


        showToast(
            "Error",
            "Unable to save question.",
            "error"
        );

    } finally {

        setButtonLoading(
            button,
            false,
            id
                ? "Update Question"
                : "Save Question"
        );

    }

}


/* =========================================================
   DELETE QUESTION
========================================================= */

function askDeleteQuestion(id) {

    const question =
        allQuestions.find(
            q => String(q.id) === String(id)
        );


    if (!question) return;


    deleteQuestionId =
        id;


    setText(
        "deleteQuestionName",
        truncateText(
            question.text,
            120
        )
    );


    openModal(
        "deleteQuestionModal"
    );

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

async function confirmDeleteQuestion() {

    if (!deleteQuestionId) {
        return;
    }


    const button =
        document.getElementById(
            "confirmDeleteQuestion"
        );


    setButtonLoading(
        button,
        true,
        "Deleting..."
    );


    try {

        await postAPI({

            action: "delete",

            QuestionID:
                deleteQuestionId

        });


        closeModal(
            "deleteQuestionModal"
        );


        showToast(
            "Deleted",
            "Question deleted successfully.",
            "success"
        );


        deleteQuestionId =
            null;


        await loadQuestions();


    } catch (error) {

        console.error(
            "Delete question error:",
            error
        );


        showToast(
            "Error",
            "Unable to delete question.",
            "error"
        );

    } finally {

        setButtonLoading(
            button,
            false,
            "Delete"
        );

    }

}


/* =========================================================
   RESET QUESTION FORM
========================================================= */

function resetQuestionForm() {

    const form =
        document.getElementById(
            "questionForm"
        );


    if (form) {
        form.reset();
    }


    setInputValue(
        "questionId",
        ""
    );


    const subcategory =
        document.getElementById(
            "questionSubcategory"
        );


    if (subcategory) {

        subcategory.innerHTML = `
            <option value="">
                Select Category First
            </option>
        `;

        subcategory.disabled = true;

    }


    setText(
        "questionFormTitle",
        "Add Question"
    );


    setText(
        "questionFormSubtitle",
        "Create a new question in the Learn2Live question bank."
    );


    setText(
        "saveQuestionButton",
        "Save Question"
    );


    const message =
        document.getElementById(
            "questionFormMessage"
        );


    if (message) {

        message.textContent = "";

        message.className =
            "form-message";

    }

}


/* =========================================================
   USERS SEARCH
========================================================= */

function setupUserSearch() {

    const search =
        document.getElementById(
            "userSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        () => {

            const value =
                search.value
                    .trim()
                    .toLowerCase();


            filteredUsers =
                allUsers.filter(user => {

                    return [

                        user.id,

                        user.username,

                        user.name,

                        user.email,

                        user.status

                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(value);

                });


            renderUsers();

        }
    );

}


/* =========================================================
   RENDER USERS
========================================================= */

/* =========================================================
   RENDER USERS
========================================================= */

function renderUsers() {
    const tbody = document.getElementById("usersTableBody");

    if (!tbody) {
        console.error("usersTableBody element not found.");
        return;
    }

    const total = document.getElementById("userTableTotal");

    if (total) {
        total.textContent =
            `${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"}`;
    }

    if (!filteredUsers.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="table-empty">
                    <i class="ri-user-search-line"></i>
                    No users found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredUsers.map(user => {
        const rawId =
            user.UserID ?? user.userID ??
            user.ID ?? user.Id ?? user.id ?? "";

        const userId = String(rawId).trim();
        const status = escapeHTML(user.status || "Active");

        return `
            <tr>
                <td>
                    <span class="id-badge">${escapeHTML(userId || "-")}</span>
                </td>

                <td>${escapeHTML(user.username || "-")}</td>
                <td>${escapeHTML(user.name || "-")}</td>
                <td>${escapeHTML(user.email || "-")}</td>
                <td>${escapeHTML(formatDate(user.createdAt))}</td>

                <td>
                    <span class="status-badge active">${status}</span>
                </td>

                <td>
                    <button
                        type="button"
                        class="icon-action view-action"
                        title="View User"
                        data-user-id="${escapeHTML(userId)}">
                        <i class="ri-eye-line"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

/* =========================================================
   VIEW USER BUTTON CLICK EVENT
========================================================= */

document.addEventListener("click", function (event) {

    const button = event.target.closest(
        "#usersTableBody .view-action"
    );

    if (!button) return;

    event.preventDefault();

    const userId = button.getAttribute("data-user-id");

    viewUser(userId);

});


/* =========================================================
   VIEW USER DETAILS
========================================================= */

let selectedUserIdForAction = null;

function viewUser(id) {
    const user = [...allUsers, ...filteredUsers].find(item => {
        const userId =
            item.UserID ??
            item.userID ??
            item.ID ??
            item.Id ??
            item.id;

        return String(userId ?? "").trim() === String(id ?? "").trim();
    });

    if (!user) {
        showToast("Error", "User details not found.", "error");
        return;
    }

    const userId =
        user.UserID ?? user.userID ??
        user.ID ?? user.Id ?? user.id ?? "";

    selectedUserIdForAction = String(userId).trim();

    const details = [
    ["User ID", user.userId ?? user.UserId ?? user.id ?? "-"],
    ["Username", user.username ?? user.Username ?? "-"],
    ["Name", user.name ?? user.Name ?? "-"],
    ["Email", user.email ?? user.Email ?? "-"],
    ["Created At", user.createdAt ?? user.CreatedAt ?? "Not available"],
    ["Last Login", user.lastLogin ?? user.LastLogin ?? "Not available"],
    ["Status", user.status ?? user.Status ?? "Active"]
];

    document.getElementById("userDetailsContent").innerHTML =
        details.map(([label, value]) => `
            <div class="user-detail-row">
                <strong>${escapeHTML(label)}:</strong>
                ${escapeHTML(String(value ?? "-"))}
            </div>
        `).join("");

    document.getElementById("userDetailsModal").classList.add("show");
}

function closeUserDetailsModal() {
    document.getElementById("userDetailsModal").classList.remove("show");
}

function openDeleteConfirmation() {
    if (!selectedUserIdForAction) return;

    document.getElementById("confirmDeleteModal").classList.add("show");
}

function closeDeleteConfirmation() {
    document.getElementById("confirmDeleteModal").classList.remove("show");
}

window.viewUser = viewUser;
window.closeUserDetailsModal = closeUserDetailsModal;
window.openDeleteConfirmation = openDeleteConfirmation;
window.closeDeleteConfirmation = closeDeleteConfirmation;
/* =========================================================
   CERTIFICATE SEARCH
========================================================= */

function setupCertificateSearch() {

    const search =
        document.getElementById(
            "certificateSearch"
        );

    if (!search) return;


    search.addEventListener(
        "input",
        () => {

            const value =
                search.value
                    .trim()
                    .toLowerCase();


            filteredCertificateDownloads =
                allCertificateDownloads.filter(
                    record => {

                        return [

                            record.name,

                            record.email,

                            record.category,

                            record.certificate,

                            record.downloaded,

                            record.downloadedAt

                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(value);

                    }
                );


            renderCertificateDownloads();

        }
    );

}


/* =========================================================
   RENDER CERTIFICATE DOWNLOADS
========================================================= */
function renderCertificateDownloads() {
    const tbody = document.getElementById(
        "certificateDownloadsTableBody"
    );

    if (!tbody) return;

    const total = document.getElementById(
        "certificateTableTotal"
    );

    if (total) {
        total.textContent =
            `${filteredCertificateDownloads.length} record${
                filteredCertificateDownloads.length === 1
                    ? ""
                    : "s"
            }`;
    }

    if (!filteredCertificateDownloads.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="table-empty">
                    <i class="ri-award-line"></i>
                    No certificate activity records found.
                </td>
            </tr>
        `;
        return;
    }

    const records = getRecentCertificateRecords(
        filteredCertificateDownloads
    );

    tbody.innerHTML = records.map(record => {
        const status = String(
            record.downloaded ?? ""
        ).trim().toLowerCase();

        const isDownloaded = [
            "yes",
            "true",
            "1"
        ].includes(status);

        return `
            <tr>
                <td>
                    <strong>
                        ${escapeHTML(record.name || "-")}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(record.email || "-")}
                </td>

                <td>
                    <span class="category-badge">
                        ${escapeHTML(record.category || "-")}
                    </span>
                </td>

                <td>
                    <span class="certificate-name">
                        ${escapeHTML(record.certificate || "-")}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${
                        isDownloaded ? "active" : ""
                    }">
                        ${isDownloaded
                            ? "Downloaded"
                            : "Not Downloaded"}
                    </span>
                </td>

                <td>
                    ${formatDateTime(record.downloadedAt)}
                </td>
            </tr>
        `;
    }).join("");
}
/* =========================================================
   CERTIFICATE SORTING
========================================================= */

function getRecentCertificateRecords(records) {

    return [...records]
        .sort(
            (a, b) =>
                getDateValue(
                    b.downloadedAt
                ) -
                getDateValue(
                    a.downloadedAt
                )
        );

}


/* =========================================================
   CERTIFICATE COUNT
========================================================= */

function updateCertificateDownloadCount() {
    const downloadedRecords =
        allCertificateDownloads.filter(record => {
            const status = String(
                record.downloaded ?? ""
            ).trim().toLowerCase();

            return [
                "yes",
                "true",
                "1"
            ].includes(status);
        });

    // Actual successful downloads only
    setText(
        "certificateDownloadTotal",
        downloadedRecords.length
    );

    // Unique certificate types downloaded
    const uniqueCertificates = new Set(
        downloadedRecords.map(record => {
            return (
                record.category.trim().toLowerCase() ||
                record.certificate.trim().toLowerCase()
            );
        }).filter(Boolean)
    );

    setText(
        "certificateUniqueTotal",
        uniqueCertificates.size
    );

    // Sidebar count shows all certificate activity records
    setText(
        "sidebarCertificateCount",
        allCertificateDownloads.length
    );
}


/* =========================================================
   CERTIFICATE ERROR
========================================================= */

function renderCertificateDownloadsError() {

    const tbody =
        document.getElementById(
            "certificateDownloadsTableBody"
        );

    if (!tbody) return;


    tbody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="table-empty error-state"
            >

                <i class="ri-error-warning-line"></i>

                Unable to load certificate downloads.

            </td>

        </tr>

    `;

}


/* =========================================================
   NOTIFICATION COUNT
========================================================= */

function updateNotificationCount() {

    const count =
        allNotifications.length;


    setText(
        "notificationCount",
        count
    );


    const dot =
        document.getElementById(
            "headerNotificationDot"
        );


    if (dot) {

        dot.style.display =
            count > 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   SIDEBAR USER COUNT
========================================================= */

function updateUserCount() {

    setText(
        "sidebarUserCount",
        allUsers.length
    );

}


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationAdminList"
        );

    if (!container) return;


    if (!allNotifications.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="ri-notification-off-line"></i>

                </div>

                <h3>
                    No Notifications
                </h3>

                <p>
                    Create your first Learn2Live announcement.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        getRecentRecords(
            allNotifications,
            allNotifications.length
        )
            .map(notification => {

                const type =
                    notification.type
                        .toLowerCase();


                return `

                    <div
                        class="admin-notification-item"
                        data-id="${escapeHTML(
                            notification.id
                        )}"
                    >

                        <div class="notification-item-icon ${escapeHTML(
                            type
                        )}">

                            <i class="${getNotificationIcon(
                                type
                            )}"></i>

                        </div>


                        <div class="notification-item-content">

                            <div class="notification-item-top">

                                <h3>
                                    ${escapeHTML(
                                        notification.title ||
                                        "Notification"
                                    )}
                                </h3>

                                <span class="notification-type">
                                    ${escapeHTML(
                                        type
                                    )}
                                </span>

                            </div>


                            <p>
                                ${escapeHTML(
                                    notification.message ||
                                    ""
                                )}
                            </p>


                            <small>
                                ${formatDate(
                                    notification.createdAt
                                )}
                            </small>

                        </div>


                        <div class="notification-item-actions">

                            <button
                                type="button"
                                class="icon-action edit-action"
                                title="Edit"
                                onclick="editNotification('${escapeJS(
                                    notification.id
                                )}')"
                            >

                                <i class="ri-edit-line"></i>

                            </button>


                            <button
                                type="button"
                                class="icon-action delete-action"
                                title="Delete"
                                onclick="deleteNotification('${escapeJS(
                                    notification.id
                                )}')"
                            >

                                <i class="ri-delete-bin-line"></i>

                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   NOTIFICATION FORM
========================================================= */

function setupNotificationForm() {

    const addButton =
        document.getElementById(
            "addNotificationButton"
        );

    const form =
        document.getElementById(
            "notificationForm"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                resetNotificationForm();

                setText(
                    "notificationModalTitle",
                    "Add Notification"
                );

                openModal(
                    "notificationModal"
                );

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            saveNotification
        );

    }

}


/* =========================================================
   SAVE NOTIFICATION
========================================================= */

async function saveNotification(event) {

    event.preventDefault();


    const title =
        getElementValue(
            "notificationTitle"
        );

    const message =
        getElementValue(
            "notificationMessage"
        );

    const type =
        getElementValue(
            "notificationType"
        );

    const id =
        getElementValue(
            "notificationId"
        );


    if (!title || !message) {

        showFormMessage(
            "notificationFormMessage",
            "Please enter title and message.",
            "error"
        );

        return;

    }


    const action =
        id
            ? "editNotification"
            : "addNotification";


    try {

        await postAPI({

            action: action,

            notification: {

                NotificationID: id,

                Title: title,

                Message: message,

                Type: type

            }

        });


        closeModal(
            "notificationModal"
        );


        showToast(
            "Success",
            id
                ? "Notification updated."
                : "Notification added.",
            "success"
        );


        await loadNotifications();


    } catch (error) {

        console.error(
            "Notification save error:",
            error
        );


        showFormMessage(
            "notificationFormMessage",
            "Unable to save notification.",
            "error"
        );

    }

}


/* =========================================================
   EDIT NOTIFICATION
========================================================= */

function editNotification(id) {

    const notification =
        allNotifications.find(
            n =>
                String(n.id) ===
                String(id)
        );


    if (!notification) return;


    setInputValue(
        "notificationId",
        notification.id
    );

    setInputValue(
        "notificationTitle",
        notification.title
    );

    setInputValue(
        "notificationMessage",
        notification.message
    );

    setInputValue(
        "notificationType",
        notification.type
    );


    setText(
        "notificationModalTitle",
        "Edit Notification"
    );


    openModal(
        "notificationModal"
    );

}


/* =========================================================
   DELETE NOTIFICATION
========================================================= */

async function deleteNotification(id) {

    const confirmed =
        window.confirm(
            "Delete this notification?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await postAPI({

            action:
                "deleteNotification",

            NotificationID:
                id

        });


        showToast(
            "Deleted",
            "Notification deleted successfully.",
            "success"
        );


        await loadNotifications();


    } catch (error) {

        console.error(
            "Notification delete error:",
            error
        );


        showToast(
            "Error",
            "Unable to delete notification.",
            "error"
        );

    }

}


/* =========================================================
   RESET NOTIFICATION FORM
========================================================= */

function resetNotificationForm() {

    const form =
        document.getElementById(
            "notificationForm"
        );


    if (form) {
        form.reset();
    }


    setInputValue(
        "notificationId",
        ""
    );


    const message =
        document.getElementById(
            "notificationFormMessage"
        );


    if (message) {

        message.textContent = "";

        message.className =
            "form-message";

    }

}


/* =========================================================
   POST API
========================================================= */

async function postAPI(payload) {

    const response =
        await fetch(
            API_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(payload)

            }
        );


    if (!response.ok) {

        throw new Error(
            `HTTP error ${response.status}`
        );

    }


    const text =
        await response.text();


    if (!text) {
        return {};
    }


    try {

        return JSON.parse(text);

    } catch {

        return {
            success: true,
            raw: text
        };

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-section]"
                );


            if (!button) return;


            const sectionId =
                button.dataset.section;


            if (!sectionId) return;


            showSection(
                sectionId
            );

        }
    );

}


/* =========================================================
   SHOW SECTION
========================================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


    sections.forEach(section => {

        section.classList.toggle(
            "active",
            section.id === sectionId
        );

    });


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionId
        );

    });


    updatePageHeading(
        sectionId
    );


    if (
        sectionId ===
        "dashboardSection"
    ) {

        renderDashboard();

    }


    if (
        sectionId ===
        "certificatesSection"
    ) {

        renderCertificateDownloads();

    }


    closeSidebarMobile();

}


/* =========================================================
   PAGE HEADINGS
========================================================= */

function updatePageHeading(sectionId) {

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    const headings = {

        dashboardSection: {

            title: "Dashboard",

            subtitle:
                "Overview of your Learn2Live administration"

        },

        questionsSection: {

            title: "Questions",

            subtitle:
                "Manage your Learn2Live question bank"

        },

        addQuestionSection: {

            title: "Question Editor",

            subtitle:
                "Create or update a question"

        },

        usersSection: {

            title: "Users",

            subtitle:
                "View registered Learn2Live users"

        },

        certificatesSection: {

            title: "Certificate Downloads",

            subtitle:
                "Track certificate downloads by Learn2Live users"

        },

        notificationsSection: {

            title: "Notifications",

            subtitle:
                "Manage Learn2Live announcements"

        }

    };


    const data =
        headings[sectionId];


    if (!data) return;


    if (title) {
        title.textContent =
            data.title;
    }


    if (subtitle) {
        subtitle.textContent =
            data.subtitle;
    }

}


/* =========================================================
   SIDEBAR
========================================================= */

function setupSidebar() {

    const toggle =
        document.getElementById(
            "sidebarToggle"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (toggle) {

        toggle.addEventListener(
            "click",
            () => {

                const sidebar =
                    document.getElementById(
                        "adminSidebar"
                    );


                sidebar?.classList.toggle(
                    "open"
                );

                overlay?.classList.toggle(
                    "active"
                );

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebarMobile
        );

    }

}


function closeSidebarMobile() {

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    sidebar?.classList.remove(
        "open"
    );

    overlay?.classList.remove(
        "active"
    );

}


/* =========================================================
   MODALS
========================================================= */

function setupModals() {

    document.addEventListener(
        "click",
        event => {

            const closeButton =
                event.target.closest(
                    "[data-close-modal]"
                );


            if (closeButton) {

                closeModal(
                    closeButton.dataset.closeModal
                );

            }


            if (
                event.target.classList.contains(
                    "modal-overlay"
                )
            ) {

                closeModal(
                    event.target.id
                );

            }

        }
    );


    const deleteButton =
        document.getElementById(
            "confirmDeleteQuestion"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            confirmDeleteQuestion
        );

    }

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        !document.querySelector(
            ".modal-overlay.active"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logout =
        document.getElementById(
            "logoutButton"
        );

    const confirm =
        document.getElementById(
            "confirmLogout"
        );


    if (logout) {

        logout.addEventListener(
            "click",
            () => {

                openModal(
                    "logoutModal"
                );

            }
        );

    }


    if (confirm) {

        confirm.addEventListener(
            "click",
            performLogout
        );

    }

}


/* =========================================================
   PERFORM LOGOUT
========================================================= */

function performLogout() {

    localStorage.removeItem(
        "learn2liveAdmin"
    );

    localStorage.removeItem(
        "adminLoggedIn"
    );

    localStorage.removeItem(
        "currentAdmin"
    );


    window.location.href =
        "login.html";

}


/* =========================================================
   ADMIN NAME
========================================================= */

function loadAdminName() {

    const possibleKeys = [

        "learn2liveAdmin",

        "currentAdmin",

        "adminUser",

        "adminName"

    ];


    let adminName =
        "Administrator";


    for (
        const key of possibleKeys
    ) {

        const value =
            localStorage.getItem(key);


        if (!value) continue;


        try {

            const parsed =
                JSON.parse(value);


            if (
                typeof parsed ===
                "object"
            ) {

                adminName =
                    parsed.name ||
                    parsed.username ||
                    parsed.Name ||
                    parsed.Username ||
                    adminName;

            } else {

                adminName =
                    parsed;

            }

        } catch {

            adminName =
                value;

        }


        if (adminName) break;

    }


    setText(
        "adminName",
        adminName
    );

    setText(
        "headerAdminName",
        adminName
    );

}


/* =========================================================
   CATEGORY SELECTS
========================================================= */

function populateCategorySelects() {

    const formCategory =
        document.getElementById(
            "questionCategory"
        );

    const filterCategory =
        document.getElementById(
            "questionCategoryFilter"
        );


    if (
        formCategory &&
        formCategory.options.length <= 1
    ) {

        Object.keys(
            CATEGORY_DATA
        ).forEach(category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            formCategory.appendChild(
                option
            );

        });

    }


    if (
        filterCategory &&
        filterCategory.options.length <= 1
    ) {

        Object.keys(
            CATEGORY_DATA
        ).forEach(category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            filterCategory.appendChild(
                option
            );

        });

    }

}


/* =========================================================
   POPULATE SUBCATEGORY
========================================================= */

function populateSubcategory(
    category,
    select
) {

    if (!select) return;


    select.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value = "";

    defaultOption.textContent =
        category
            ? "All Subcategories"
            : "Select Category First";


    select.appendChild(
        defaultOption
    );


    if (!category) {

        select.disabled =
            true;

        return;

    }


    const items =
        CATEGORY_DATA[category] ||
        [];


    items.forEach(subcategory => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            subcategory;

        option.textContent =
            subcategory;

        select.appendChild(
            option
        );

    });


    select.disabled =
        false;

}


/* =========================================================
   LOADING STATES
========================================================= */

function showDashboardLoading() {

    const category =
        document.getElementById(
            "categoryOverviewList"
        );

    const questions =
        document.getElementById(
            "recentQuestionsTableBody"
        );

    const notifications =
        document.getElementById(
            "dashboardNotificationList"
        );

    const certificates =
        document.getElementById(
            "certificateDownloadsTableBody"
        );


    if (category) {

        category.innerHTML = `

            <div class="dashboard-loading">

                <i class="ri-loader-4-line"></i>

                Loading category data...

            </div>

        `;

    }


    if (questions) {

        questions.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-loading"
                >

                    <i class="ri-loader-4-line"></i>

                    Loading recent questions...

                </td>

            </tr>

        `;

    }


    if (notifications) {

        notifications.innerHTML = `

            <div class="dashboard-loading">

                <i class="ri-loader-4-line"></i>

                Loading notifications...

            </div>

        `;

    }


    if (certificates) {

        certificates.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-loading"
                >

                    <i class="ri-loader-4-line"></i>

                    Loading certificate downloads...

                </td>

            </tr>

        `;

    }

}


/* =========================================================
   ERROR STATES
========================================================= */

function renderQuestionsError() {

    const tbody =
        document.getElementById(
            "questionsTableBody"
        );


    if (!tbody) return;


    tbody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="table-empty error-state"
            >

                <i class="ri-error-warning-line"></i>

                Unable to load questions.

            </td>

        </tr>

    `;

}


function renderUsersError() {

    const tbody =
        document.getElementById(
            "usersTableBody"
        );


    if (!tbody) return;


    tbody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="table-empty error-state"
            >

                <i class="ri-error-warning-line"></i>

                Unable to load users.

            </td>

        </tr>

    `;

}


function renderNotificationsError() {

    const container =
        document.getElementById(
            "notificationAdminList"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="empty-state error-state">

            <div class="empty-icon">

                <i class="ri-error-warning-line"></i>

            </div>

            <h3>
                Unable to load notifications
            </h3>

            <p>
                Please check the API connection.
            </p>

        </div>

    `;

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "adminToast"
        );

    const titleElement =
        document.getElementById(
            "toastTitle"
        );

    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    if (!toast) return;


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    toast.className =
        `admin-toast ${type} show`;


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   CLOSE TOAST
========================================================= */

const closeToast =
    document.getElementById(
        "closeToast"
    );


if (closeToast) {

    closeToast.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "adminToast"
                )
                ?.classList.remove(
                    "show"
                );

        }
    );

}


/* =========================================================
   FORM MESSAGE
========================================================= */

function showFormMessage(
    id,
    message,
    type
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.textContent =
        message;


    element.className =
        `form-message ${type}`;

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading,
    text
) {

    if (!button) return;


    if (loading) {

        button.disabled =
            true;

        button.dataset.originalText =
            button.innerHTML;

        button.innerHTML = `

            <i class="ri-loader-4-line"></i>

            ${escapeHTML(text)}

        `;

    } else {

        button.disabled =
            false;

        button.innerHTML =
            button.dataset.originalText ||
            text;

    }

}


/* =========================================================
   HELPERS
========================================================= */

function cleanValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value).trim();

}


function getElementValue(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value.trim()
        : "";

}


function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";

    }

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


function truncateText(
    text,
    length
) {

    const value =
        cleanValue(text);


    if (
        value.length <= length
    ) {

        return value;

    }


    return (
        value.substring(
            0,
            length
        ) + "..."
    );

}


function escapeHTML(value) {

    return String(
        value ?? ""
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


function escapeJS(value) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        )
        .replace(
            /\r/g,
            "\\r"
        );

}


function getDateValue(date) {

    if (!date) {
        return 0;
    }


    const value =
        new Date(date).getTime();


    return isNaN(value)
        ? 0
        : value;

}


function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parsed =
        new Date(date);


    if (
        isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }


    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatDateTime(date) {

    if (!date) {
        return "-";
    }


    const parsed =
        new Date(date);


    if (
        isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }


    return parsed.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function getNotificationIcon(
    type
) {

    switch (type) {

        case "success":
            return "ri-checkbox-circle-line";

        case "warning":
            return "ri-alert-line";

        case "important":
            return "ri-error-warning-line";

        default:
            return "ri-information-line";

    }

}


/* =========================================================
   EXPOSE FUNCTIONS
========================================================= */

window.viewQuestion =
    viewQuestion;

window.editQuestion =
    editQuestion;

window.askDeleteQuestion =
    askDeleteQuestion;

window.editNotification =
    editNotification;

window.deleteNotification =
    deleteNotification;

window.showSection =
    showSection;

