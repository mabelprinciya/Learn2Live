/* =========================================================
   LEARN2LIVE - MY LEARNING.JS
   REAL USER + REAL PROGRESS
   IN PROGRESS + COMPLETED + NOT STARTED
========================================================= */

"use strict";


/* =========================================================
   SKILLS CONFIGURATION
========================================================= */

const SKILLS = [

    /* =====================================================
       FIRST AID
    ===================================================== */

    {
        key: "firstaid",
        name: "First Aid",
        image: "firstaid.png",
        page: "firstaid.html",

        description:
            "Learn essential first aid skills for everyday emergencies.",

        topics: [
            {
                key: "cpr",
                name: "CPR"
            },
            {
                key: "bleeding",
                name: "Bleeding"
            },
            {
                key: "burns",
                name: "Burns"
            },
            {
                key: "choking",
                name: "Choking"
            },
            {
                key: "bites",
                name: "Bites & Stings"
            }
        ]
    },


    /* =====================================================
       BANKING
    ===================================================== */

    {
        key: "banking",
        name: "Banking",
        image: "banking.png",
        page: "banking.html",

        description:
            "Build practical knowledge about safe and responsible banking.",

        topics: [
            {
                key: "bank-accounts",
                name: "Bank Accounts"
            },
            {
                key: "atm",
                name: "ATM"
            },
            {
                key: "online-banking",
                name: "Online Banking"
            },
            {
                key: "loans",
                name: "Loans"
            },
            {
                key: "banking-security",
                name: "Banking Security"
            }
        ]
    },


    /* =====================================================
       TAX BASICS
    ===================================================== */

    {
        key: "tax",
        name: "Tax Basics",
        image: "tax.png",
        page: "tax.html",

        description:
            "Understand basic tax concepts and important financial documents.",

        topics: [
            {
                key: "tax-fundamentals",
                name: "Tax Fundamentals"
            },
            {
                key: "income-tax",
                name: "Income Tax"
            },
            {
                key: "taxable-income",
                name: "Taxable Income"
            },
            {
                key: "tax-deductions",
                name: "Tax Deductions"
            },
            {
                key: "tax-filing",
                name: "Tax Filing"
            }
        ]
    },


    /* =====================================================
       DIGITAL SAFETY
    ===================================================== */

    {
        key: "digital-safety",
        name: "Digital Safety",
        image: "digital.png",
        page: "Digital Safety.html",

        description:
            "Learn how to protect your accounts, devices and personal information.",

        topics: [
            {
                key: "password-security",
                name: "Password Security"
            },
            {
                key: "online-scams",
                name: "Online Scams"
            },
            {
                key: "privacy-protection",
                name: "Privacy Protection"
            },
            {
                key: "social-media-safety",
                name: "Social Media Safety"
            },
            {
                key: "safe-online-payments",
                name: "Safe Online Payments"
            }
        ]
    },


    /* =====================================================
       LEGAL RIGHTS
    ===================================================== */

    {
        key: "legal",
        name: "Legal Rights",
        image: "legal.png",
        page: "Legal.html",

        description:
            "Learn useful legal rights and everyday legal awareness.",

        topics: [
            {
                key: "basic-legal-rights",
                name: "Basic Legal Rights"
            },
            {
                key: "consumer-rights",
                name: "Consumer Rights"
            },
            {
                key: "cyber-rights",
                name: "Cyber Rights"
            },
            {
                key: "child-rights",
                name: "Child Rights"
            },
            {
                key: "legal-help",
                name: "Legal Help"
            }
        ]
    },


    /* =====================================================
       INTERVIEW SKILLS
    ===================================================== */

    {
        key: "interview",
        name: "Interview Skills",
        image: "interview.png",
        page: "interview.html",

        description:
            "Develop confidence and practical skills for interviews.",

        topics: [
            {
                key: "cv",
                name: "CV"
            },
            {
                key: "communication-skills",
                name: "Communication Skills"
            },
            {
                key: "interview-preparation",
                name: "Interview Preparation"
            },
            {
                key: "common-interview-questions",
                name: "Common Interview Questions"
            },
            {
                key: "professional-etiquette",
                name: "Professional Etiquette"
            }
        ]
    }

];


/* =========================================================
   USER EMAIL
========================================================= */

function getLoggedInEmail() {

    try {

        const email =
            localStorage.getItem(
                "loggedInEmail"
            );

        if (
            email &&
            email.trim()
        ) {

            return email
                .trim()
                .toLowerCase();

        }

    } catch (error) {

        console.error(
            "Unable to read loggedInEmail:",
            error
        );

    }

    return "";

}



/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    const email =
        getLoggedInEmail();


    try {

        const currentUserRaw =
            localStorage.getItem(
                "currentUser"
            );


        if (currentUserRaw) {

            const currentUser =
                JSON.parse(
                    currentUserRaw
                );


            if (
                currentUser &&
                typeof currentUser ===
                "object"
            ) {

                if (
                    !email ||
                    !currentUser.email ||
                    String(
                        currentUser.email
                    )
                        .toLowerCase()
                        .trim() ===
                    email
                ) {

                    return currentUser;

                }

            }

        }

    } catch (error) {

        console.error(
            "currentUser error:",
            error
        );

    }



    const possibleStores = [

        "users",
        "learn2liveUsers"

    ];


    for (
        const storageKey of possibleStores
    ) {

        try {

            const raw =
                localStorage.getItem(
                    storageKey
                );


            if (!raw) {

                continue;

            }


            const users =
                JSON.parse(
                    raw
                );


            if (
                !Array.isArray(users)
            ) {

                continue;

            }


            const found =
                users.find(
                    user =>
                        user &&
                        user.email &&
                        email &&
                        String(
                            user.email
                        )
                            .toLowerCase()
                            .trim() ===
                        email
                );


            if (found) {

                return found;

            }

        } catch (error) {

            console.warn(
                storageKey +
                " user data error:",
                error
            );

        }

    }


    return null;

}



/* =========================================================
   UPDATE HEADER USER
========================================================= */

function updateUserDetails() {

    const user =
        getCurrentUser();

    const nameElement =
        document.getElementById("headerUserName");

    const avatarElement =
        document.getElementById("profileInitials");

    const avatarImage =
        document.getElementById("headerAvatarImage");

    const avatarInitials =
        document.getElementById("headerAvatarInitials");


    /* ===============================
       USER NAME
    =============================== */

    const name =
        user?.name ||
        user?.fullName ||
        user?.full_name ||
        user?.displayName ||
        user?.username ||
        "User";


    if (nameElement) {
        nameElement.textContent =
            name;
    }


    /* ===============================
       FIND PROFILE PHOTO
    =============================== */

    const photo =
        user?.photo ||
        user?.profilePhoto ||
        user?.profile_photo ||
        user?.avatar ||
        user?.image ||
        user?.imageUrl ||
        user?.imageURL ||
        user?.photoURL ||
        user?.photoUrl ||
        user?.avatarUrl ||
        user?.profileImage ||
        user?.profile_image ||
        "";


    /* log removed */;

    /* log removed */;


    /* ===============================
       PHOTO FOUND
    =============================== */

    if (
        photo &&
        String(photo).trim()
    ) {

        if (avatarImage) {

            avatarImage.src =
                String(photo).trim();

            avatarImage.style.display =
                "block";

        }


        if (avatarInitials) {

            avatarInitials.style.display =
                "none";

        }


        if (avatarElement) {

            avatarElement.style.backgroundImage =
                "none";

        }


        return;
    }


    /* ===============================
       NO PHOTO → INITIALS
    =============================== */

    let initials = "U";


    const parts =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (parts.length >= 2) {

        initials =
            (
                parts[0][0] +
                parts[parts.length - 1][0]
            ).toUpperCase();

    } else if (parts.length === 1) {

        initials =
            parts[0]
                .substring(0, 2)
                .toUpperCase();

    }


    if (avatarImage) {

        avatarImage.src = "";

        avatarImage.style.display =
            "none";

    }


    if (avatarInitials) {

        avatarInitials.textContent =
            initials;

        avatarInitials.style.display =
            "flex";

    }

}



/* =========================================================
   NORMALIZE KEY
========================================================= */

function normalizeKey(value) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /&/g,
            "and"
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");

}



/* =========================================================
   SAFE EMAIL KEY
========================================================= */

function emailSafeKey(email) {

    return String(
        email || ""
    )
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            "_"
        );

}



/* =========================================================
   CHECK TOPIC COMPLETION
========================================================= */

function isTopicCompleted(
    skillKey,
    topicKey
) {

    const email =
        getLoggedInEmail();


    if (!email) {

        return false;

    }


    const cleanEmail =
        email.trim();


    /* -----------------------------------------------------
       DIRECT COMPLETION KEYS
    ----------------------------------------------------- */

    const possibleKeys = [

        "learn2live_" +
        normalizeKey(topicKey) +
        "_completed_" +
        cleanEmail,

        "learn2live_" +
        normalizeKey(skillKey) +
        "_" +
        normalizeKey(topicKey) +
        "_completed_" +
        cleanEmail,

        "learn2live_" +
        normalizeKey(topicKey) +
        "_completed_" +
        encodeURIComponent(
            cleanEmail
        )

    ];


    for (
        const key of possibleKeys
    ) {

        try {

            const value =
                localStorage.getItem(
                    key
                );


            if (
                value === "true" ||
                value === true
            ) {

                return true;

            }

        } catch (error) {

            console.warn(
                "Completion key error:",
                key
            );

        }

    }



    /* -----------------------------------------------------
       OTHER COMPLETION STORES
    ----------------------------------------------------- */

    const completionStores = [

        "learn2liveCompleted",
        "learn2liveCompletions",
        "quizCompletions",
        "completedTopics"

    ];


    for (
        const storageKey of completionStores
    ) {

        try {

            const raw =
                localStorage.getItem(
                    storageKey
                );


            if (!raw) {

                continue;

            }


            const data =
                JSON.parse(
                    raw
                );


            if (!data) {

                continue;

            }



            /* -------------------------------------------------
               ARRAY FORMAT
            ------------------------------------------------- */

            if (
                Array.isArray(data)
            ) {

                const found =
                    data.some(
                        item => {

                            if (
                                typeof item ===
                                "string"
                            ) {

                                return (
                                    normalizeKey(
                                        item
                                    ) ===
                                    normalizeKey(
                                        topicKey
                                    )
                                );

                            }


                            if (
                                item &&
                                typeof item ===
                                "object"
                            ) {

                                const itemEmail =
                                    String(
                                        item.email ||
                                        item.userEmail ||
                                        ""
                                    )
                                        .toLowerCase()
                                        .trim();


                                const itemTopic =
                                    item.topic ||
                                    item.topicKey ||
                                    item.subcategory ||
                                    "";


                                return (

                                    ( itemEmail === cleanEmail )

                                    &&

                                    normalizeKey(
                                        itemTopic
                                    ) ===
                                    normalizeKey(
                                        topicKey
                                    )

                                );

                            }


                            return false;

                        }
                    );


                if (found) {

                    return true;

                }

            }



            /* -------------------------------------------------
               OBJECT FORMAT
            ------------------------------------------------- */

            if (
                typeof data ===
                "object" &&
                !Array.isArray(data)
            ) {

                const userData =
                    data[
                        cleanEmail
                    ] ||
                    data[
                        cleanEmail.toLowerCase()
                    ] ||
                    data[
                        emailSafeKey(
                            cleanEmail
                        )
                    ];


                if (
                    userData
                ) {

                    if (
                        Array.isArray(
                            userData
                        )
                    ) {

                        const found =
                            userData.some(
                                item => {

                                    const topic =
                                        typeof item ===
                                        "string"
                                            ? item
                                            : (
                                                item?.topic ||
                                                item?.topicKey ||
                                                item?.subcategory ||
                                                ""
                                            );


                                    return (
                                        normalizeKey(
                                            topic
                                        ) ===
                                        normalizeKey(
                                            topicKey
                                        )
                                    );

                                }
                            );


                        if (found) {

                            return true;

                        }

                    }

                }

            }

        } catch (error) {

            console.warn(
                "Completion storage skipped:",
                storageKey
            );

        }

    }


    return false;

}



/* =========================================================
   GET SKILL PROGRESS
========================================================= */

function getSkillProgress(skill) {

    const topics =
        Array.isArray(
            skill.topics
        )
            ? skill.topics
            : [];


    const total =
        topics.length;


    if (!total) {

        return {

            completed: 0,
            total: 0,
            percent: 0,
            started: false,
            completedAll: false

        };

    }


    let completed = 0;


    topics.forEach(
        topic => {

            if (
                isTopicCompleted(
                    skill.key,
                    topic.key
                )
            ) {

                completed++;

            }

        }
    );


    const percent =
        Math.min(
            100,
            Math.round(
                (
                    completed /
                    total
                ) * 100
            )
        );


    return {

        completed,

        total,

        percent,

        started:
            completed > 0,

        completedAll:
            completed === total

    };

}



/* =========================================================
   GET COURSE STATUS
========================================================= */

function getCourseStatus(progress) {

    if (
        progress.completedAll
    ) {

        return "completed";

    }


    if (
        progress.started
    ) {

        return "in-progress";

    }


    return "not-started";

}



/* =========================================================
   CREATE COURSE CARD
========================================================= */

function createCourseCard(
    skill,
    progress,
    status
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "learning-card " +
        status;


    card.dataset.skill =
        skill.key;



    /* -----------------------------------------------------
       IMAGE AREA
    ----------------------------------------------------- */

    const imageArea =
        document.createElement(
            "div"
        );


    imageArea.className =
        "learning-image";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        skill.image;

    image.alt =
        skill.name;


    image.onerror =
        function () {

            this.style.display =
                "none";

        };


    imageArea.appendChild(
        image
    );



    /* -----------------------------------------------------
       STATUS
    ----------------------------------------------------- */

    const statusBadge =
        document.createElement(
            "span"
        );


    statusBadge.className =
        "learning-status";


    if (
        status ===
        "completed"
    ) {

        statusBadge.textContent =
            "Completed";

    } else if (
        status ===
        "in-progress"
    ) {

        statusBadge.textContent =
            "In Progress";

    } else {

        statusBadge.textContent =
            "Not Started";

    }


    imageArea.appendChild(
        statusBadge
    );



    /* -----------------------------------------------------
       COMPLETED CHECK
    ----------------------------------------------------- */

    if (
        status ===
        "completed"
    ) {

        const check =
            document.createElement(
                "div"
            );


        check.className =
            "completed-check";


        check.innerHTML =
            '<i class="fa-solid fa-check"></i>';


        imageArea.appendChild(
            check
        );

    }



    /* -----------------------------------------------------
       CONTENT
    ----------------------------------------------------- */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "learning-card-content";



    const top =
        document.createElement(
            "div"
        );


    top.className =
        "learning-card-top";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        skill.name;


    top.appendChild(
        title
    );


    content.appendChild(
        top
    );



    /* DESCRIPTION */

    const description =
        document.createElement(
            "p"
        );


    description.className =
        "learning-card-description";


    description.textContent =
        skill.description;


    content.appendChild(
        description
    );



    /* -----------------------------------------------------
       PROGRESS INFO
    ----------------------------------------------------- */

    const progressInfo =
        document.createElement(
            "div"
        );


    progressInfo.className =
        "progress-info";


    const progressText =
        document.createElement(
            "span"
        );


    progressText.textContent =
        progress.completed +
        " of " +
        progress.total +
        " topics";


    const progressPercent =
        document.createElement(
            "strong"
        );


    progressPercent.textContent =
        progress.percent +
        "%";


    progressInfo.appendChild(
        progressText
    );


    progressInfo.appendChild(
        progressPercent
    );


    content.appendChild(
        progressInfo
    );



    /* -----------------------------------------------------
       PROGRESS BAR
    ----------------------------------------------------- */

    const progressTrack =
        document.createElement(
            "div"
        );


    progressTrack.className =
        "learning-progress";


    const progressFill =
        document.createElement(
            "div"
        );


    progressFill.className =
        "learning-progress-fill";


    progressFill.style.width =
        progress.percent + "%";


    progressTrack.appendChild(
        progressFill
    );


    content.appendChild(
        progressTrack
    );



    /* -----------------------------------------------------
       TOPIC INFO
    ----------------------------------------------------- */

    const topicInfo =
        document.createElement(
            "div"
        );


    topicInfo.className =
        "topic-info";


    const topicIcon =
        document.createElement(
            "i"
        );


    topicIcon.className =
        "fa-solid fa-layer-group";


    const topicText =
        document.createElement(
            "span"
        );


    topicText.textContent =
        progress.total +
        (
            progress.total === 1
                ? " topic"
                : " topics"
        );


    topicInfo.appendChild(
        topicIcon
    );


    topicInfo.appendChild(
        topicText
    );


    content.appendChild(
        topicInfo
    );



    /* -----------------------------------------------------
       ACTION BUTTON
    ----------------------------------------------------- */

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "learning-action";


    if (
        status ===
        "completed"
    ) {

        button.innerHTML =
            `
            <span>Review Course</span>
            <i class="fa-solid fa-arrow-right"></i>
            `;

    } else if (
        status ===
        "in-progress"
    ) {

        button.innerHTML =
            `
            <span>Continue Learning</span>
            <i class="fa-solid fa-arrow-right"></i>
            `;

    } else {

        button.innerHTML =
            `
            <span>Start Learning</span>
            <i class="fa-solid fa-arrow-right"></i>
            `;

    }


    button.addEventListener(
        "click",
        function () {

            if (
                skill.page
            ) {

                window.location.href =
                    skill.page;

            }

        }
    );


    content.appendChild(
        button
    );


    /* COMPLETED COURSE => certificate shortcut */
    if (status === "completed") {

        const certButton =
            document.createElement("button");

        certButton.type = "button";

        certButton.className = "learning-action";

        certButton.style.marginTop = "10px";

        certButton.innerHTML =
            `
            <span>View Certificate</span>
            <i class="fa-solid fa-award"></i>
            `;

        certButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                try {

                    const me =
                        getCurrentUser();

                    localStorage.setItem(
                        "selectedCertificate",
                        JSON.stringify({
                            studentName:
                                (me && (me.name || me.fullName || me.username)) || "",
                            email:
                                getLoggedInEmail(),
                            skillKey:
                                skill.key,
                            skillName:
                                skill.name
                        })
                    );

                } catch (error) {

                    console.warn(error);

                }

                window.location.href =
                    "certificate.html";

            }
        );

        content.appendChild(
            certButton
        );

    }



    /* -----------------------------------------------------
       CARD CLICK
    ----------------------------------------------------- */

    card.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    ".learning-action"
                )
            ) {

                return;

            }


            if (
                skill.page
            ) {

                window.location.href =
                    skill.page;

            }

        }
    );



    /* -----------------------------------------------------
       FINAL CARD
    ----------------------------------------------------- */

    card.appendChild(
        imageArea
    );


    card.appendChild(
        content
    );


    return card;

}



/* =========================================================
   RENDER SECTION
========================================================= */

function renderSection(
    containerId,
    emptyId,
    courses
) {

    const container =
        document.getElementById(
            containerId
        );


    const empty =
        document.getElementById(
            emptyId
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";



    if (
        !courses.length
    ) {

        if (empty) {

            empty.style.display =
                "block";

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    courses.forEach(
        item => {

            const card =
                createCourseCard(
                    item.skill,
                    item.progress,
                    item.status
                );


            container.appendChild(
                card
            );

        }
    );

}



/* =========================================================
   UPDATE COUNTS
========================================================= */

function updateCounts(
    inProgress,
    completed,
    notStarted,
    overall
) {

    const inProgressCount =
        document.getElementById(
            "inProgressCount"
        );


    const completedCount =
        document.getElementById(
            "completedCount"
        );


    const notStartedCount =
        document.getElementById(
            "notStartedCount"
        );


    const overallProgress =
        document.getElementById(
            "overallLearningProgress"
        );


    if (inProgressCount) {

        inProgressCount.textContent =
            inProgress.length;

    }


    if (completedCount) {

        completedCount.textContent =
            completed.length;

    }


    if (notStartedCount) {

        notStartedCount.textContent =
            notStarted.length;

    }


    if (overallProgress) {

        overallProgress.textContent =
            overall + "%";

    }



    /* SECTION LABELS */

    const inProgressLabel =
        document.getElementById(
            "inProgressLabel"
        );


    const completedLabel =
        document.getElementById(
            "completedLabel"
        );


    const notStartedLabel =
        document.getElementById(
            "notStartedLabel"
        );


    if (inProgressLabel) {

        inProgressLabel.textContent =
            inProgress.length +
            (
                inProgress.length === 1
                    ? " course"
                    : " courses"
            );

    }


    if (completedLabel) {

        completedLabel.textContent =
            completed.length +
            (
                completed.length === 1
                    ? " course"
                    : " courses"
            );

    }


    if (notStartedLabel) {

        notStartedLabel.textContent =
            notStarted.length +
            (
                notStarted.length === 1
                    ? " course"
                    : " courses"
            );

    }

}



/* =========================================================
   RENDER LEARNING
========================================================= */

function updateLearningPage() {

    const inProgress = [];

    const completed = [];

    const notStarted = [];


    let totalTopics = 0;

    let completedTopics = 0;



    SKILLS.forEach(
        skill => {

            const progress =
                getSkillProgress(
                    skill
                );


            totalTopics +=
                progress.total;


            completedTopics +=
                progress.completed;


            const status =
                getCourseStatus(
                    progress
                );


            const course = {

                skill,

                progress,

                status

            };


            if (
                status ===
                "completed"
            ) {

                completed.push(
                    course
                );

            } else if (
                status ===
                "in-progress"
            ) {

                inProgress.push(
                    course
                );

            } else {

                notStarted.push(
                    course
                );

            }

        }
    );



    const overall =
        totalTopics > 0
            ? Math.round(
                (
                    completedTopics /
                    totalTopics
                ) * 100
            )
            : 0;



    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    renderSection(
        "inProgressContainer",
        "inProgressEmpty",
        inProgress
    );


    renderSection(
        "completedContainer",
        "completedEmpty",
        completed
    );


    renderSection(
        "notStartedContainer",
        "notStartedEmpty",
        notStarted
    );



    /* -----------------------------------------------------
       COUNTS
    ----------------------------------------------------- */

    updateCounts(
        inProgress,
        completed,
        notStarted,
        overall
    );

}



/* =========================================================
   NOTIFICATION
   GO TO notification.html
========================================================= */

function setupNotifications() {

    const button =
        document.getElementById(
            "notificationBtn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            window.location.href =
                "notification.html";

        }
    );

}



/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "mobileMenuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (
        !menuButton ||
        !sidebar ||
        !overlay
    ) {

        return;

    }


    function openMenu() {

        sidebar.classList.add(
            "open"
        );

        overlay.classList.add(
            "show"
        );

        document.body.classList.add(
            "menu-open"
        );

    }


    function closeMenu() {

        sidebar.classList.remove(
            "open"
        );

        overlay.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "menu-open"
        );

    }


    menuButton.addEventListener(
        "click",
        openMenu
    );


    overlay.addEventListener(
        "click",
        closeMenu
    );


    document
        .querySelectorAll(
            ".sidebar .nav-item"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );

}



/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    const overlay =
        document.getElementById(
            "logoutOverlay"
        );


    const cancelButton =
        document.getElementById(
            "cancelLogout"
        );


    const confirmButton =
        document.getElementById(
            "confirmLogout"
        );


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (overlay) {

                overlay.style.display =
                    "flex";

            }

        }
    );



    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                if (overlay) {

                    overlay.style.display =
                        "none";

                }

            }
        );

    }



    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function () {

                /*
                   IMPORTANT:
                   Learning completion data
                   is NOT deleted.
                */

                localStorage.removeItem(
                    "loggedInEmail"
                );

                localStorage.removeItem(
                    "currentUser"
                );

                localStorage.removeItem(
                    "currentUserId"
                );


                window.location.href =
                    "login.html";

            }
        );

    }



    if (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    overlay.style.display =
                        "none";

                }

            }
        );

    }

}



/* =========================================================
   REFRESH PAGE
========================================================= */

function refreshLearningPage() {

    updateUserDetails();

    updateLearningPage();

}



/* =========================================================
   STORAGE EVENT
========================================================= */

window.addEventListener(
    "storage",
    function () {

        refreshLearningPage();

    }
);



/* =========================================================
   PAGE FOCUS
========================================================= */

window.addEventListener(
    "focus",
    function () {

        refreshLearningPage();

    }
);



/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshLearningPage();

        }

    }
);



/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshLearningPage();

        setupNotifications();

        setupMobileMenu();

        setupLogout();

    }
);