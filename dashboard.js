/* =========================================================
   LEARN2LIVE - DASHBOARD.JS
   REAL USER + PROFILE PHOTO + REAL PROGRESS + QUICK TIPS
   + CERTIFICATE DOWNLOAD TRACKING

   6 CATEGORIES × 5 TOPICS = 30 TOPICS
========================================================= */

"use strict";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";


/* =========================================================
   SKILLS CONFIGURATION
========================================================= */

const SKILLS = [

    /* =====================================================
       1. FIRST AID
    ===================================================== */

    {
        key: "firstaid",
        name: "First Aid",
        icon: "fa-solid fa-kit-medical",
        page: "firstaid.html",

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
       2. BANKING
    ===================================================== */

    {
        key: "banking",
        name: "Banking",
        icon: "fa-solid fa-building-columns",
        page: "banking.html",

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
       3. TAX BASICS
    ===================================================== */

    {
        key: "tax",
        name: "Tax Basics",
        icon: "fa-solid fa-file-invoice-dollar",
        page: "tax.html",

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
       4. DIGITAL SAFETY
    ===================================================== */

    {
        key: "digital-safety",
        name: "Digital Safety",
        icon: "fa-solid fa-shield-halved",
        page: "Digital Safety.html",

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
       5. LEGAL RIGHTS
    ===================================================== */

    {
        key: "legal",
        name: "Legal Rights",
        icon: "fa-solid fa-scale-balanced",
        page: "Legal.html",

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
       6. INTERVIEW SKILLS
    ===================================================== */

    {
        key: "interview",
        name: "Interview Skills",
        icon: "fa-solid fa-comments",
        page: "interview.html",

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
   QUICK TIPS
========================================================= */

const QUICK_TIPS = {

    firstaid: [

        "Stay calm during an emergency and check that the area is safe before helping.",

        "For serious bleeding, apply firm direct pressure with clean cloth or gauze.",

        "Learn the emergency number in your area and keep it easily accessible.",

        "Knowing basic first aid can help you respond calmly while professional help arrives."

    ],


    banking: [

        "Never share your OTP, PIN, CVV or banking password with anyone.",

        "Check your bank account statements regularly for unfamiliar transactions.",

        "Use official banking apps and websites instead of links received through unknown messages.",

        "Enable transaction alerts so you can notice suspicious activity quickly."

    ],


    tax: [

        "Keep important income and financial documents organized throughout the year.",

        "Always verify tax-related information through official government sources.",

        "Understand the difference between income, deductions and taxable income.",

        "Keep copies of important tax documents for your records."

    ],


    "digital-safety": [

        "Use strong, unique passwords for important accounts.",

        "Turn on two-factor authentication whenever it is available.",

        "Think before clicking links in unexpected emails or messages.",

        "Avoid sharing personal information publicly on social media."

    ],


    legal: [

        "Read important documents carefully before signing them.",

        "Keep copies of agreements, receipts and other important legal documents.",

        "Know the basic rights that apply to you in everyday situations.",

        "When a legal matter is serious, seek guidance from a qualified legal professional."

    ],


    interview: [

        "Research the organization before attending an interview.",

        "Prepare a short introduction about yourself and your skills.",

        "Listen carefully to each question before answering.",

        "Be honest about your skills and explain how you are willing to learn."

    ]

};


/* =========================================================
   LOGGED-IN EMAIL
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
   GET CURRENT LEARN2LIVE USER
========================================================= */

function getCurrentUser() {

    const email =
        getLoggedInEmail();


    /* =====================================================
       CURRENT USER
    ===================================================== */

    try {

        const raw =
            localStorage.getItem(
                "currentUser"
            );


        if (raw) {

            const currentUser =
                JSON.parse(raw);


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
                        .trim()
                        .toLowerCase() ===
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


    /* =====================================================
       LEARN2LIVE USER OBJECT
    ===================================================== */

    const singleUserKeys = [

        "learn2liveUser",

        "user"

    ];


    for (
        const storageKey of singleUserKeys
    ) {

        try {

            const raw =
                localStorage.getItem(
                    storageKey
                );


            if (!raw) {

                continue;

            }


            const user =
                JSON.parse(
                    raw
                );


            if (
                user &&
                typeof user ===
                "object"
            ) {

                if (
                    !email ||
                    !user.email ||
                    String(
                        user.email
                    )
                        .trim()
                        .toLowerCase() ===
                    email
                ) {

                    return user;

                }

            }

        } catch (error) {

            console.warn(
                storageKey +
                " error:",
                error
            );

        }

    }


    /* =====================================================
       LEARN2LIVE USER ARRAYS
    ===================================================== */

    const userStores = [

        "users",

        "learn2liveUsers"

    ];


    for (
        const storageKey of userStores
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


            const foundUser =
                users.find(
                    user =>
                        user &&
                        (
                            !email ||
                            (
                                user.email &&
                                String(
                                    user.email
                                )
                                    .trim()
                                    .toLowerCase() ===
                                email
                            )
                        )
                );


            if (foundUser) {

                return foundUser;

            }

        } catch (error) {

            console.warn(
                storageKey +
                " error:",
                error
            );

        }

    }


    return null;

}


/* =========================================================
   GET USER DISPLAY NAME
========================================================= */

function getDisplayName(user) {

    if (!user) {

        return "";

    }


    const names = [

        user.name,

        user.fullName,

        user.full_name,

        user.displayName,

        user.display_name,

        user.username

    ];


    for (
        const name of names
    ) {

        if (
            name !== undefined &&
            name !== null &&
            String(name).trim()
        ) {

            return String(
                name
            ).trim();

        }

    }


    return "";

}


/* =========================================================
   GET PROFILE PHOTO
========================================================= */

function getProfilePhoto(user) {

    if (!user) {

        return "";

    }


    const photos = [

        user.photo,

        user.profilePhoto,

        user.profile_photo,

        user.avatar,

        user.image,

        user.imageUrl,

        user.photoURL,

        user.photoUrl

    ];


    for (
        const photo of photos
    ) {

        if (
            photo !== undefined &&
            photo !== null &&
            String(photo).trim()
        ) {

            return String(
                photo
            ).trim();

        }

    }


    const directPhotoKeys = [

        "profilePhoto",

        "userPhoto",

        "photo",

        "avatar",

        "profile_image"

    ];


    for (
        const key of directPhotoKeys
    ) {

        try {

            const photo =
                localStorage.getItem(
                    key
                );


            if (
                photo &&
                photo.trim()
            ) {

                return photo.trim();

            }

        } catch (error) {

            console.warn(
                "Profile photo error:",
                error
            );

        }

    }


    return "";

}


/* =========================================================
   UPDATE HEADER USER
   NAME + PROFILE PHOTO
========================================================= */

function updateUserDetails() {

    const user =
        getCurrentUser();


    const nameElement =
        document.getElementById(
            "headerUserName"
        );


    const avatarElement =
        document.getElementById(
            "profileInitials"
        );


    if (!user) {

        if (nameElement) {

            nameElement.textContent =
                "";

        }


        if (avatarElement) {

            avatarElement.textContent =
                "";

            avatarElement.style.backgroundImage =
                "";

        }


        return;

    }


    const realName =
        getDisplayName(
            user
        );


    if (nameElement) {

        nameElement.textContent =
            realName;

    }


    const photo =
        getProfilePhoto(
            user
        );


    if (
        avatarElement &&
        photo
    ) {

        avatarElement.textContent =
            "";


        avatarElement.style.backgroundImage =
            `url("${photo.replace(/"/g, '\\"')}")`;


        avatarElement.style.backgroundSize =
            "cover";


        avatarElement.style.backgroundPosition =
            "center";


        avatarElement.style.backgroundRepeat =
            "no-repeat";


        avatarElement.setAttribute(
            "data-has-photo",
            "true"
        );


        return;

    }


    if (avatarElement) {

        avatarElement.style.backgroundImage =
            "";


        avatarElement.setAttribute(
            "data-has-photo",
            "false"
        );


        if (!realName) {

            avatarElement.textContent =
                "";

            return;

        }


        const parts =
            realName
                .split(/\s+/)
                .filter(Boolean);


        let initials = "";


        if (
            parts.length === 1
        ) {

            initials =
                parts[0]
                    .substring(
                        0,
                        2
                    );

        } else {

            initials =
                parts[0].charAt(0) +
                parts[
                    parts.length - 1
                ].charAt(0);

        }


        avatarElement.textContent =
            initials.toUpperCase();

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


    const normalizedTopic =
        normalizeKey(
            topicKey
        );


    const normalizedSkill =
        normalizeKey(
            skillKey
        );


    const possibleKeys = [

        "learn2live_" +
        normalizedTopic +
        "_completed_" +
        cleanEmail,


        "learn2live_" +
        normalizedSkill +
        "_" +
        normalizedTopic +
        "_completed_" +
        cleanEmail,


        "learn2live_" +
        normalizedTopic +
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
                error
            );

        }

    }


    const completionStorageKeys = [

        "learn2liveCompleted",

        "learn2liveCompletions",

        "quizCompletions",

        "completedTopics"

    ];


    for (
        const storageKey of
        completionStorageKeys
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
                                    normalizedTopic
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
                                        .trim()
                                        .toLowerCase();


                                const itemTopic =
                                    item.topic ||
                                    item.topicKey ||
                                    item.subcategory ||
                                    "";


                                return (

                                    itemEmail ===
                                    cleanEmail

                                    &&

                                    normalizeKey(
                                        itemTopic
                                    ) ===
                                    normalizedTopic

                                );

                            }


                            return false;

                        }
                    );


                if (found) {

                    return true;

                }

            }


            if (
                typeof data ===
                "object" &&
                !Array.isArray(data)
            ) {

                const possibleUserData =
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
                    possibleUserData &&
                    Array.isArray(
                        possibleUserData
                    )
                ) {

                    const found =
                        possibleUserData.some(
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
                                    normalizedTopic
                                );

                            }
                        );


                    if (found) {

                        return true;

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

function getSkillProgress(
    skill
) {

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
   UPDATE CATEGORY CARD
========================================================= */

function updateCategoryCard(
    skill,
    progress
) {

    const card =
        document.querySelector(
            `.category-card[data-category="${skill.key}"]`
        ) ||
        document.querySelector(
            `.category-card[data-skill="${skill.key}"]`
        );


    if (!card) {

        return;

    }


    const percentElement =
        card.querySelector(
            ".category-percent"
        );


    const progressFill =
        card.querySelector(
            ".category-progress-fill"
        );


    const titleElement =
        card.querySelector(
            ".category-title"
        );


    const iconElement =
        card.querySelector(
            ".category-icon i"
        );


    const checkElement =
        card.querySelector(
            ".category-check"
        );


    if (percentElement) {

        percentElement.textContent =
            progress.percent +
            "%";

    }


    if (progressFill) {

        progressFill.style.width =
            progress.percent +
            "%";

    }


    if (
        titleElement &&
        !titleElement.textContent.trim()
    ) {

        titleElement.textContent =
            skill.name;

    }


    if (iconElement) {

        iconElement.className =
            skill.icon;

    }


    card.classList.remove(

        "completed",

        "is-complete",

        "in-progress",

        "not-started"

    );


    if (
        progress.completedAll
    ) {

        card.classList.add(
            "completed"
        );

        card.classList.add(
            "is-complete"
        );

    }

    else if (
        progress.started
    ) {

        card.classList.add(
            "in-progress"
        );

    }

    else {

        card.classList.add(
            "not-started"
        );

    }


    if (checkElement) {

        if (
            progress.completedAll
        ) {

            checkElement.style.display =
                "flex";

            checkElement.setAttribute(
                "aria-label",
                "Completed"
            );

        }

        else {

            checkElement.style.display =
                "none";

        }

    }


    card.setAttribute(
        "data-progress",
        progress.percent
    );


    if (
        !card.dataset.navigationReady
    ) {

        card.dataset.navigationReady =
            "true";


        card.addEventListener(
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


        card.style.cursor =
            "pointer";

    }

}


/* =========================================================
   UPDATE ALL CATEGORIES
========================================================= */

function updateCategories() {

    SKILLS.forEach(
        skill => {

            const progress =
                getSkillProgress(
                    skill
                );


            updateCategoryCard(
                skill,
                progress
            );

        }
    );

}


/* =========================================================
   UPDATE DASHBOARD STATS
========================================================= */

function updateStats() {

    const totalSkills =
        SKILLS.length;


    let completedSkills =
        0;


    let inProgressSkills =
        0;


    let totalTopics =
        0;


    let completedTopics =
        0;


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


            if (
                progress.completedAll
            ) {

                completedSkills++;

            }

            else if (
                progress.started
            ) {

                inProgressSkills++;

            }

        }
    );


    const overallPercent =
        totalTopics > 0
            ? Math.round(
                (
                    completedTopics /
                    totalTopics
                ) * 100
            )
            : 0;


    const totalElement =
        document.getElementById(
            "totalSkills"
        );


    if (totalElement) {

        totalElement.textContent =
            totalSkills;

    }


    const completedElement =
        document.getElementById(
            "completedSkills"
        );


    if (completedElement) {

        completedElement.textContent =
            completedSkills;

    }


    const progressElement =
        document.getElementById(
            "inProgressSkills"
        );


    if (progressElement) {

        progressElement.textContent =
            inProgressSkills;

    }


    const overallElement =
        document.getElementById(
            "overallProgress"
        );


    if (overallElement) {

        overallElement.textContent =
            overallPercent +
            "%";

    }


    const overallBar =
        document.getElementById(
            "overallProgressBar"
        );


    if (overallBar) {

        overallBar.style.width =
            overallPercent +
            "%";

    }


    const skillsCount =
        document.getElementById(
            "skillsCount"
        );


    if (skillsCount) {

        skillsCount.textContent =
            totalSkills +
            (
                totalSkills === 1
                    ? " Skill"
                    : " Skills"
            );

    }

}


/* =========================================================
   GET RANDOM TIP
========================================================= */

function getRandomTip() {

    const allTips = [];


    SKILLS.forEach(
        skill => {

            const tips =
                QUICK_TIPS[
                    skill.key
                ] || [];


            tips.forEach(
                tip => {

                    allTips.push({

                        skillKey:
                            skill.key,

                        skillName:
                            skill.name,

                        icon:
                            skill.icon,

                        text:
                            tip

                    });

                }
            );

        }
    );


    if (
        !allTips.length
    ) {

        return null;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            allTips.length
        );


    return allTips[
        randomIndex
    ];

}


/* =========================================================
   DISPLAY QUICK TIP
========================================================= */

function updateQuickTip() {

    const tip =
        getRandomTip();


    if (!tip) {

        return;

    }


    const textElement =
        document.getElementById(
            "quickTipText"
        );


    const categoryElement =
        document.getElementById(
            "quickTipCategory"
        );


    const iconElement =
        document.getElementById(
            "quickTipIcon"
        );


    if (textElement) {

        textElement.textContent =
            tip.text;

    }


    if (categoryElement) {

        categoryElement.textContent =
            tip.skillName;

    }


    if (iconElement) {

        iconElement.className =
            tip.icon;

    }

}


/* =========================================================
   QUICK TIP AUTO REFRESH
========================================================= */

function startQuickTipRotation() {

    setInterval(
        function () {

            updateQuickTip();

        },
        20000
    );

}


/* =========================================================
   CERTIFICATE DOWNLOAD TRACKING
========================================================= */

/*
   This function sends the REAL logged-in user's:

   - Name
   - Email
   - Category
   - Certificate name

   to Google Apps Script.

   Admin dashboard can then display:
   User | Email | Category | Certificate | Downloaded | Date & Time
*/

async function recordCertificateDownload(
    category,
    certificateName
) {

    const user =
        getCurrentUser();


    const email =
        getLoggedInEmail();


    const name =
        getDisplayName(
            user
        );


    if (!email) {

        console.warn(
            "Certificate download skipped: logged-in email not found."
        );

        return false;

    }


    if (!category) {

        console.warn(
            "Certificate download skipped: category not found."
        );

        return false;

    }


    const finalCertificateName =
        certificateName &&
        String(
            certificateName
        ).trim()

            ? String(
                certificateName
            ).trim()

            : (
                String(
                    category
                ).trim() +
                " Certificate"
            );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            action:
                                "certificateDownload",

                            email:
                                email,

                            name:
                                name,

                            category:
                                String(
                                    category
                                ).trim(),

                            certificate:
                                finalCertificateName

                        })

                }
            );


        const data =
            await response.json();


        if (
            data &&
            data.success
        ) {

            /* log removed */;


            return true;

        }


        console.error(
            "Certificate download recording failed:",
            data
        );


    } catch (error) {

        console.error(
            "Certificate download API error:",
            error
        );

    }


    return false;

}


/* =========================================================
   MAKE CERTIFICATE DOWNLOAD TRACKING AVAILABLE
========================================================= */

/*
   Other certificate pages can call:

   await recordCertificateDownload(
       "First Aid",
       "First Aid Certificate"
   );

   Because this dashboard.js may be loaded on
   pages that need certificate tracking.
*/

window.recordCertificateDownload =
    recordCertificateDownload;


/* =========================================================
   NOTIFICATION SYSTEM
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
        function (event) {

            event.preventDefault();


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
                   Progress is NOT deleted.
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
   CATEGORY NAVIGATION
========================================================= */

function setupCategoryNavigation() {

    SKILLS.forEach(
        skill => {

            const card =
                document.querySelector(
                    `.category-card[data-category="${skill.key}"]`
                ) ||
                document.querySelector(
                    `.category-card[data-skill="${skill.key}"]`
                );


            if (
                !card ||
                card.dataset.navigationReady
            ) {

                return;

            }


            card.dataset.navigationReady =
                "true";


            card.addEventListener(
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

        }
    );

}


/* =========================================================
   REFRESH DASHBOARD
========================================================= */

function refreshDashboard() {

    updateUserDetails();

    updateCategories();

    updateStats();

    updateQuickTip();

}


/* =========================================================
   STORAGE EVENT
========================================================= */

window.addEventListener(
    "storage",
    function () {

        refreshDashboard();

    }
);


/* =========================================================
   PAGE FOCUS
========================================================= */

window.addEventListener(
    "focus",
    function () {

        refreshDashboard();

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

            refreshDashboard();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshDashboard();

        setupNotifications();

        setupMobileMenu();

        setupLogout();

        setupCategoryNavigation();

        startQuickTipRotation();

    }
);