// =========================================================
// LEARN2LIVE - MY CERTIFICATES.JS
// USER + PROGRESS + CERTIFICATES + DOWNLOAD TRACKING
// =========================================================

"use strict";

const API_URL =
    "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";

// =========================================================
// SKILLS CONFIGURATION
// =========================================================

const SKILLS = [
    {
        key: "firstaid",
        name: "First Aid",
        icon: "fa-solid fa-kit-medical",
        page: "firstaid.html",
        topics: [
            { key: "cpr", name: "CPR" },
            { key: "bleeding", name: "Bleeding" },
            { key: "burns", name: "Burns" },
            { key: "choking", name: "Choking" },
            { key: "bites-stings", name: "Bites & Stings" }
        ]
    },
    {
        key: "banking",
        name: "Banking",
        icon: "fa-solid fa-building-columns",
        page: "banking.html",
        topics: [
            { key: "bank-accounts", name: "Bank Accounts" },
            { key: "atm", name: "ATM" },
            { key: "online-banking", name: "Online Banking" },
            { key: "loans", name: "Loans" },
            { key: "banking-security", name: "Banking Security" }
        ]
    },
    {
        key: "tax",
        name: "Tax Basics",
        icon: "fa-solid fa-file-invoice-dollar",
        page: "tax.html",
        topics: [
            { key: "tax-fundamentals", name: "Tax Fundamentals" },
            { key: "income-tax", name: "Income Tax" },
            { key: "taxable-income", name: "Taxable Income" },
            { key: "tax-deductions", name: "Tax Deductions" },
            { key: "tax-filing", name: "Tax Filing" }
        ]
    },
    {
        key: "digital-safety",
        name: "Digital Safety",
        icon: "fa-solid fa-shield-halved",
        page: "Digital Safety.html",
        topics: [
            { key: "password-security", name: "Password Security" },
            { key: "online-scams", name: "Online Scams" },
            { key: "privacy-protection", name: "Privacy Protection" },
            { key: "social-media-safety", name: "Social Media Safety" },
            { key: "safe-online-payments", name: "Safe Online Payments" }
        ]
    },
    {
        key: "legal",
        name: "Legal Rights",
        icon: "fa-solid fa-scale-balanced",
        page: "Legal.html",
        topics: [
            { key: "basic-legal-rights", name: "Basic Legal Rights" },
            { key: "consumer-rights", name: "Consumer Rights" },
            { key: "cyber-rights", name: "Cyber Rights" },
            { key: "child-rights", name: "Child Rights" },
            { key: "legal-help", name: "Legal Help" }
        ]
    },
    {
        key: "interview",
        name: "Interview Skills",
        icon: "fa-solid fa-comments",
        page: "interview.html",
        topics: [
            { key: "cv", name: "CV" },
            { key: "communication-skills", name: "Communication Skills" },
            { key: "interview-preparation", name: "Interview Preparation" },
            { key: "common-interview-questions", name: "Common Interview Questions" },
            { key: "professional-etiquette", name: "Professional Etiquette" }
        ]
    }
];

// =========================================================
// USER DETAILS
// =========================================================

function getLoggedInEmail() {
    try {
        return String(
            localStorage.getItem("loggedInEmail") || ""
        ).trim().toLowerCase();
    } catch (error) {
        console.error("Unable to read login email:", error);
        return "";
    }
}

function getCurrentUser() {
    const email = getLoggedInEmail();

    const keys = [
        "currentUser",
        "learn2liveUser",
        "users",
        "learn2liveUsers",
        "eligifyUsers"
    ];

    for (const key of keys) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) continue;

            const data = JSON.parse(raw);

            if (Array.isArray(data)) {
                const found = data.find(user => {
                    if (!user) return false;

                    const userEmail = String(
                        user.email || user.userEmail || ""
                    ).trim().toLowerCase();

                    return email && userEmail === email;
                });

                if (found) return found;

                continue;
            }

            if (data && typeof data === "object") {
                const userEmail = String(
                    data.email || data.userEmail || ""
                ).trim().toLowerCase();

                if (
                    (!email || !userEmail || userEmail === email) &&
                    (
                        !email ||
                        !userEmail ||
                        userEmail === email
                    )
                ) {
                    return data;
                }
            }
        } catch (error) {
            console.warn("User storage read skipped:", key);
        }
    }

    return null;
}

function getDisplayName() {
    const user = getCurrentUser();

    if (user) {
        const possibleNames = [
            user.name,
            user.fullName,
            user.full_name,
            user.displayName,
            user.display_name,
            user.username
        ];

        for (const name of possibleNames) {
            if (name && String(name).trim()) {
                return String(name).trim();
            }
        }
    }

    for (const key of [
        "userName",
        "username",
        "fullName",
        "name"
    ]) {
        try {
            const value = localStorage.getItem(key);

            if (value && value.trim()) {
                return value.trim();
            }
        } catch (error) {
            console.warn("Name storage read error:", error);
        }
    }

    const email = getLoggedInEmail();

    return email ? email.split("@")[0] : "Learner";
}

// =========================================================
// PROFILE HEADER
// =========================================================

function updateUserDetails() {
    const user = getCurrentUser();

    const nameElement =
        document.getElementById("headerUserName");

    const avatarElement =
        document.getElementById("profileInitials");

    const avatarContainer =
        document.getElementById("profileAvatar");

    const realName = String(
        user?.name ||
        user?.fullName ||
        user?.username ||
        ""
    ).trim();

    if (nameElement) {
        nameElement.textContent = realName;
    }

    if (!user) {
        if (avatarElement) {
            avatarElement.textContent = "";
        }

        return;
    }

    const photo =
        user.photo ||
        user.profilePhoto ||
        user.profileImage ||
        "";

    if (photo && avatarContainer) {
        avatarContainer.replaceChildren();

        const image = document.createElement("img");

        image.src = photo;
        image.alt = "Profile Photo";

        image.onerror = function () {
            avatarContainer.replaceChildren();

            const span = document.createElement("span");

            span.id = "profileInitials";

            avatarContainer.appendChild(span);

            updateUserInitials(realName);
        };

        avatarContainer.appendChild(image);
    } else {
        updateUserInitials(realName);
    }
}

function updateUserInitials(realName) {
    const element =
        document.getElementById("profileInitials");

    if (!element) return;

    if (!realName) {
        element.textContent = "";
        return;
    }

    const parts = realName.split(/\s+/).filter(Boolean);

    const initials = parts.length === 1
        ? parts[0].substring(0, 2)
        : parts[0].charAt(0) +
          parts[parts.length - 1].charAt(0);

    element.textContent = initials.toUpperCase();
}

// =========================================================
// NORMALIZATION HELPERS
// =========================================================

function normalizeKey(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function emailSafeKey(email) {
    return String(email || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========================================================
// TOPIC COMPLETION CHECK
// =========================================================

function isTopicCompleted(skillKey, topicKey) {
    const email = getLoggedInEmail();

    if (!email) return false;

    const skill = SKILLS.find(
        item => item.key === skillKey
    );

    if (!skill) return false;

    const normalizedTopic = normalizeKey(topicKey);

    const topic = skill.topics.find(item => {
        return (
            normalizeKey(item.key) === normalizedTopic ||
            normalizeKey(item.name) === normalizedTopic ||
            (
                skill.key === "firstaid" &&
                ["bites", "bites-stings", "bites-and-stings"].includes(
                    normalizedTopic
                ) &&
                item.key === "bites-stings"
            )
        );
    });

    if (!topic) return false;

    const topicKeys = new Set([
        normalizeKey(topic.key),
        normalizeKey(topic.name)
    ]);

    // Compatibility with the certificate.js "bites" topic key.
    if (skill.key === "firstaid" && topic.key === "bites-stings") {
        topicKeys.add("bites");
        topicKeys.add("bites-stings");
        topicKeys.add("bites-and-stings");
    }

    const categoryKeys = new Set([
        normalizeKey(skill.key),
        normalizeKey(skill.name)
    ]);

    const directKeys = [];

    for (const topicName of topicKeys) {
        const topicUnderscore = topicName.replace(/-/g, "_");

        directKeys.push(
            `learn2live_${topicUnderscore}_completed_${email}`,
            `learn2live_${topicUnderscore}_completed_${emailSafeKey(email)}`,
            `learn2live_${topicUnderscore}_completed_${encodeURIComponent(email)}`
        );

        for (const categoryName of categoryKeys) {
            directKeys.push(
                `learn2live_${categoryName.replace(/-/g, "_")}_${topicUnderscore}_completed_${email}`,
                `learn2live_${categoryName}_${topicName}_completed_${email}`,
                `learn2live_${categoryName}_${topicUnderscore}_completed_${emailSafeKey(email)}`
            );
        }
    }

    for (const key of directKeys) {
        try {
            const value = localStorage.getItem(key);

            if (
                value === "true" ||
                value === "1" ||
                value === "completed"
            ) {
                return true;
            }
        } catch (error) {
            console.warn("Completion key check failed:", error);
        }
    }

    const storageKeys = [
        "learn2liveCompleted",
        "learn2liveCompletions",
        "quizCompletions",
        "completedTopics"
    ];

    for (const storageKey of storageKeys) {
        try {
            const raw = localStorage.getItem(storageKey);

            if (!raw) continue;

            const data = JSON.parse(raw);

            if (!data) continue;

            if (Array.isArray(data)) {
                const found = data.some(item => {
                    if (typeof item === "string") {
                        return topicKeys.has(normalizeKey(item));
                    }

                    if (!item || typeof item !== "object") {
                        return false;
                    }

                    const itemEmail = String(
                        item.email || item.userEmail || ""
                    ).trim().toLowerCase();

                    const itemTopic = normalizeKey(
                        item.topic ||
                        item.topicKey ||
                        item.subcategory ||
                        item.key ||
                        item.name ||
                        ""
                    );

                    const itemCategory = normalizeKey(
                        item.category ||
                        item.skill ||
                        item.skillKey ||
                        ""
                    );

                    const categoryMatches =
                        !itemCategory ||
                        categoryKeys.has(itemCategory);

                    const emailMatches =
                        !itemEmail || itemEmail === email;

                    const isComplete =
                        item.completed === undefined ||
                        item.completed === true ||
                        item.completed === "true" ||
                        item.status === "completed" ||
                        item.isCompleted === true;

                    return (
                        topicKeys.has(itemTopic) &&
                        categoryMatches &&
                        emailMatches &&
                        isComplete
                    );
                });

                if (found) return true;
            }

            if (typeof data === "object" && !Array.isArray(data)) {
                const userData =
                    data[email] ||
                    data[emailSafeKey(email)];

                if (Array.isArray(userData)) {
                    const found = userData.some(item => {
                        const itemTopic = normalizeKey(
                            typeof item === "string"
                                ? item
                                : item?.topic ||
                                  item?.topicKey ||
                                  item?.subcategory ||
                                  item?.key ||
                                  ""
                        );

                        return topicKeys.has(itemTopic);
                    });

                    if (found) return true;
                } else if (
                    userData &&
                    typeof userData === "object"
                ) {
                    for (const topicName of topicKeys) {
                        if (
                            userData[topicName] === true ||
                            userData[topicName] === "completed"
                        ) {
                            return true;
                        }
                    }
                }

                for (const topicName of topicKeys) {
                    if (
                        data[topicName] === true ||
                        data[topicName] === "completed"
                    ) {
                        return true;
                    }
                }
            }
        } catch (error) {
            console.warn("Completion storage skipped:", storageKey);
        }
    }

    return false;
}

// =========================================================
// SKILL PROGRESS
// =========================================================

function getSkillProgress(skill) {
    const topics = Array.isArray(skill.topics)
        ? skill.topics
        : [];

    const total = topics.length;

    let completed = 0;

    topics.forEach(topic => {
        if (isTopicCompleted(skill.key, topic.key)) {
            completed++;
        }
    });

    return {
        completed,
        total,
        percent: total > 0
            ? Math.min(100, Math.round((completed / total) * 100))
            : 0,
        completedAll: total > 0 && completed === total
    };
}

function getCompletedSkills() {
    return SKILLS.filter(
        skill => getSkillProgress(skill).completedAll
    );
}

// =========================================================
// CERTIFICATE NUMBER
// MUST MATCH certificate.js
// =========================================================

function generateCertificateNumber(skillNameOrKey) {
    const email = getLoggedInEmail();

    const skill = SKILLS.find(item =>
        normalizeKey(item.key) === normalizeKey(skillNameOrKey) ||
        normalizeKey(item.name) === normalizeKey(skillNameOrKey)
    );

    if (!email || !skill) {
        return "";
    }

    const storageKey =
        "learn2liveCertificate_" +
        skill.key +
        "_" +
        emailSafeKey(email);

    // Preserve the existing ID if one has already been issued.
    const existing = localStorage.getItem(storageKey);

    if (existing) {
        return existing;
    }

    // Keep this formula identical to certificate.js.
    const hashSource =
        email + "|" + normalizeKey(skill.key);

    let hash = 0;

    for (let i = 0; i < hashSource.length; i++) {
        hash = (
            hash * 31 +
            hashSource.charCodeAt(i)
        ) >>> 0;
    }

    const number = (hash % 999999) + 1;

    const certificateNumber =
        "L2L-" +
        new Date().getFullYear() +
        "-" +
        String(number).padStart(6, "0");

    localStorage.setItem(storageKey, certificateNumber);

    return certificateNumber;
}

function formatIssueDate() {
    return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

// =========================================================
// API REQUEST HELPER
// Does not use no-cors.
// =========================================================

async function sendCertificateTracking(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(
            "Apps Script request failed with HTTP status " +
            response.status
        );
    }

    const result = await response.json();

    if (!result || result.success !== true) {
        throw new Error(
            result?.message ||
            "Apps Script did not confirm the certificate update."
        );
    }

    return result;
}

// =========================================================
// CERTIFICATE ACTIVITY SYNC
// =========================================================

async function recordCertificateCompletion(skill) {
    const email = getLoggedInEmail();

    if (!email || !skill || !skill.name) {
        console.warn(
            "Certificate completion sync skipped: email or category missing."
        );
        return false;
    }

    if (!getSkillProgress(skill).completedAll) {
        return false;
    }

    const certificateNumber =
        generateCertificateNumber(skill.key);

    if (!certificateNumber) {
        console.error("Certificate ID could not be generated.");
        return false;
    }

    try {
        await sendCertificateTracking({
            action: "certificateComplete",
            email: email,
            name: getDisplayName(),
            category: skill.name,
            certificate: certificateNumber,
            downloaded: "No"
        });

        return true;
    } catch (error) {
        console.error(
            "Certificate completion sync failed:",
            error
        );

        return false;
    }
}

async function syncCompletedCertificates(completedSkills) {
    for (const skill of completedSkills) {
        await recordCertificateCompletion(skill);
    }
}

// =========================================================
// CERTIFICATE STATS
// =========================================================

function updateCertificateStats(completedSkills) {
    const count = completedSkills.length;

    const certificateCount =
        document.getElementById("certificateCount");

    const completedCourseCount =
        document.getElementById("completedCourseCount");

    const learningStatus =
        document.getElementById("learningStatus");

    const certificateCountLabel =
        document.getElementById("certificateCountLabel");

    if (certificateCount) {
        certificateCount.textContent = count;
    }

    if (completedCourseCount) {
        completedCourseCount.textContent = count;
    }

    if (learningStatus) {
        learningStatus.textContent =
            count > 0 ? "Active" : "Learning";
    }

    if (certificateCountLabel) {
        certificateCountLabel.textContent =
            count + (count === 1
                ? " Certificate"
                : " Certificates");
    }
}

// =========================================================
// CERTIFICATE PREVIEW
// =========================================================

function createCertificatePreview(userName, skillName, certificateData) {
    const certificateNumber =
        generateCertificateNumber(certificateData?.skillKey || skillName);

    const issueDate =
        certificateData?.issueDate || formatIssueDate();

    const escapedName = escapeHTML(userName);
    const escapedSkill = escapeHTML(skillName);
    const escapedNumber = escapeHTML(certificateNumber);
    const escapedDate = escapeHTML(issueDate);

    return `
        <div class="certificate-preview"
             style="width:100%;height:400px;overflow:hidden;background:#fff;position:relative;">
            <div class="certificate-preview-inner"
                 style="width:1123px;height:794px;transform-origin:top left;">
                <div class="certificate">
                    <div class="certificate-border">
                        <div class="certificate-inner">
                            <div class="watermark" aria-hidden="true">L2L</div>

                            <header class="certificate-header">
                                <div class="brand">
                                    <img src="logo.png" class="brand-logo"
                                         alt="Learn2Live Logo">
                                    <div class="brand-text">
                                        <h1>LEARN2LIVE</h1>
                                        <p>LEARNING • AWARENESS • LIFE SKILLS</p>
                                    </div>
                                </div>

                                <div class="certificate-reference">
                                    <span>CERTIFICATE NO.</span>
                                    <strong>${escapedNumber}</strong>
                                </div>
                            </header>

                            <section class="certificate-title">
                                <span class="title-overline">LEARN2LIVE</span>
                                <h2>CERTIFICATE</h2>
                                <h3>OF COMPLETION</h3>
                            </section>

                            <section class="presentation">
                                <p>This certificate is proudly presented to</p>
                                <h1 class="student-name">${escapedName}</h1>
                            </section>

                            <section class="certification-content">
                                <p class="main-text">
                                    In recognition of the successful completion
                                    of the Learn2Live learning program, and in
                                    appreciation of the recipient's dedicated
                                    participation, commitment to learning, and
                                    understanding of the knowledge, essential
                                    concepts, and practical skills covered
                                    throughout the course.
                                </p>

                                <p class="course-introduction">
                                    The recipient has successfully completed
                                </p>

                                <h2 class="course-name">${escapedSkill}</h2>

                                <p class="completion-text">
                                    and demonstrated satisfactory understanding
                                    of the learning objectives and key concepts
                                    presented throughout the Learn2Live program.
                                </p>
                            </section>

                            <section class="certificate-bottom">
                                <div class="seal-information">
                                    <div class="official-seal">
                                        <div class="seal-outer">
                                            <div class="seal-inner">
                                                <span>LEARN2LIVE</span>
                                                <strong>L2L</strong>
                                                <small>OFFICIAL</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="seal-details">
                                        <div class="small-detail">
                                            <span>CERTIFICATE NO.</span>
                                            <strong>${escapedNumber}</strong>
                                        </div>

                                        <div class="small-divider"></div>

                                        <div class="small-detail">
                                            <span>DATE OF ISSUE</span>
                                            <strong>${escapedDate}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="signature-section">
                                    <img src="Mabel.png" class="signature-image"
                                         alt="Authorized Signature">
                                    <div class="signature-line"></div>
                                    <strong>Authorized Signatory</strong>
                                    <span>Learn2Live</span>
                                </div>
                            </section>

                            <div class="footer-decoration">
                                <span></span>
                                <div>◆</div>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =========================================================
// LOAD CERTIFICATES
// =========================================================

function loadCertificates() {
    const grid = document.getElementById("certificatesGrid");
    const empty = document.getElementById("certificateEmpty");

    if (!grid) return;

    grid.innerHTML = "";

    const completedSkills = getCompletedSkills();

    updateCertificateStats(completedSkills);

    if (completedSkills.length === 0) {
        grid.style.display = "none";

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }

    grid.style.display = "grid";

    if (empty) {
        empty.style.display = "none";
    }

    completedSkills.forEach(skill => {
        createCertificateCard(skill);
    });

    // Creates/syncs completed certificate records.
    // Backend must enforce one row per email + category.
    void syncCompletedCertificates(completedSkills);
}

// =========================================================
// CREATE CERTIFICATE CARD
// =========================================================

function createCertificateCard(skill) {
    const grid = document.getElementById("certificatesGrid");

    if (!grid) return;

    const userName = getDisplayName();

    const certificateData = {
        studentName: userName,
        email: getLoggedInEmail(),
        skillKey: skill.key,
        skillName: skill.name,
        topics: skill.topics.map(topic => topic.name)
    };

    const card = document.createElement("article");

    card.className = "certificate-card";

    card.innerHTML = `
        ${createCertificatePreview(userName, skill.name, certificateData)}

        <div class="certificate-card-content">
            <div class="certificate-card-top">
                <h3>${escapeHTML(skill.name)}</h3>
                <span class="certificate-badge">
                    <i class="fa-solid fa-check"></i> Earned
                </span>
            </div>

            <p class="certificate-description">
                You have successfully completed all topics in
                ${escapeHTML(skill.name)}.
            </p>

            <div class="certificate-meta">
                <div class="certificate-meta-item">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Course Completed</span>
                </div>

                <div class="certificate-meta-item">
                    <i class="fa-solid fa-book-open"></i>
                    <span>${skill.topics.length} Topics</span>
                </div>
            </div>

            <div class="certificate-actions">
                <button type="button" class="certificate-view-btn">
                    <i class="fa-regular fa-eye"></i> View Certificate
                </button>

                <button type="button" class="certificate-download-btn">
                    <i class="fa-solid fa-download"></i> Download
                </button>
            </div>
        </div>
    `;

    grid.appendChild(card);

    card.querySelector(".certificate-view-btn")?.addEventListener(
        "click",
        () => viewCertificate(skill)
    );

    card.querySelector(".certificate-download-btn")?.addEventListener(
        "click",
        event => downloadCertificate(skill, event.currentTarget)
    );
}

// =========================================================
// VIEW CERTIFICATE
// =========================================================

function viewCertificate(skill) {
    const certificateData = {
        studentName: getDisplayName(),
        email: getLoggedInEmail(),
        skillKey: skill.key,
        skillName: skill.name,
        topics: skill.topics.map(topic => topic.name)
    };

    localStorage.setItem(
        "selectedCertificate",
        JSON.stringify(certificateData)
    );

    window.location.href = "certificate.html";
}

// =========================================================
// RECORD CERTIFICATE DOWNLOAD
// Updates the existing email + category row.
// =========================================================

async function recordCertificateDownload(skill) {
    const email = getLoggedInEmail();

    if (!email) {
        console.error(
            "Certificate tracking failed: login email missing."
        );

        return false;
    }

    if (!skill || !skill.key || !skill.name) {
        console.error(
            "Certificate tracking failed: category missing."
        );

        return false;
    }

    if (!getSkillProgress(skill).completedAll) {
        console.error(
            "Certificate tracking failed: all 5 topics are not completed."
        );

        return false;
    }

    const certificateNumber =
        generateCertificateNumber(skill.key);

    if (!certificateNumber) {
        console.error(
            "Certificate tracking failed: certificate ID missing."
        );

        return false;
    }

    const payload = {
        action: "certificateDownload",
        email: email,
        name: getDisplayName(),
        category: skill.name,
        certificate: certificateNumber,
        downloaded: "Yes"
    };

    try {
        const result = await sendCertificateTracking(payload);

        console.log(
            "Certificate download update confirmed:",
            {
                email,
                category: skill.name,
                certificate: certificateNumber,
                downloaded: "Yes",
                result
            }
        );

        return true;
    } catch (error) {
        console.error(
            "PDF was generated, but Google Sheets update was not confirmed:",
            error
        );

        return false;
    }
}

// =========================================================
// DOWNLOAD CERTIFICATE PDF
// =========================================================

async function downloadCertificate(skill, button = null) {
    const email = getLoggedInEmail();
    const user = getCurrentUser();

    const userName = String(
        user?.name ||
        user?.fullName ||
        user?.username ||
        getDisplayName() ||
        "Learner"
    ).trim();

    if (!email) {
        alert("Please log in again to download your certificate.");
        return;
    }

    if (!skill || !getSkillProgress(skill).completedAll) {
        alert(
            "Please complete all 5 topics before downloading your certificate."
        );
        return;
    }

    if (typeof window.html2canvas !== "function") {
        console.error("html2canvas is not loaded.");

        alert(
            "Certificate download library is unavailable. Please refresh the page."
        );

        return;
    }

    if (
        !window.jspdf ||
        typeof window.jspdf.jsPDF !== "function"
    ) {
        console.error("jsPDF is not loaded.");

        alert(
            "PDF library is unavailable. Please refresh the page."
        );

        return;
    }

    const oldButtonHTML = button?.innerHTML || "";
    const oldButtonDisabled = button?.disabled || false;

    document.getElementById(
        "temporaryCertificateDownload"
    )?.remove();

    const renderArea = document.createElement("div");

    renderArea.id = "temporaryCertificateDownload";

    Object.assign(renderArea.style, {
        position: "fixed",
        left: "-12000px",
        top: "0",
        width: "1123px",
        height: "794px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        zIndex: "-1",
        pointerEvents: "none",
        opacity: "1"
    });

    renderArea.setAttribute("aria-hidden", "true");

    document.body.appendChild(renderArea);

    try {
        if (button) {
            button.disabled = true;
            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';
        }

        const certificateNumber =
            generateCertificateNumber(skill.key);

        if (!certificateNumber) {
            throw new Error("Certificate ID could not be generated.");
        }

        renderArea.innerHTML = createCertificatePreview(
            userName,
            skill.name,
            {
                studentName: userName,
                email,
                skillKey: skill.key,
                skillName: skill.name,
                issueDate: formatIssueDate(),
                topics: skill.topics.map(topic => topic.name)
            }
        );

        const preview =
            renderArea.querySelector(".certificate-preview");

        const previewInner =
            renderArea.querySelector(".certificate-preview-inner");

        const certificate =
            renderArea.querySelector(".certificate");

        if (!certificate) {
            throw new Error("Certificate element not found.");
        }

        [preview, previewInner, certificate].forEach(element => {
            if (!element) return;

            Object.assign(element.style, {
                width: "1123px",
                height: "794px",
                minWidth: "1123px",
                minHeight: "794px",
                maxWidth: "none",
                maxHeight: "none",
                boxSizing: "border-box",
                transform: "none",
                transformOrigin: "top left",
                overflow: "hidden"
            });
        });

        if (preview) {
            preview.style.padding = "0";
            preview.style.aspectRatio = "auto";
        }

        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        const images = Array.from(
            renderArea.querySelectorAll("img")
        );

        await Promise.all(
            images.map(image => {
                if (image.complete) {
                    return Promise.resolve();
                }

                return new Promise(resolve => {
                    image.addEventListener("load", resolve, {
                        once: true
                    });

                    image.addEventListener("error", resolve, {
                        once: true
                    });
                });
            })
        );

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const { jsPDF } = window.jspdf;

        const canvas = await window.html2canvas(certificate, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: false,
            imageTimeout: 15000,
            width: 1123,
            height: 794,
            windowWidth: 1123,
            windowHeight: 794,
            scrollX: 0,
            scrollY: 0,
            foreignObjectRendering: false,

            onclone: function (clonedDocument) {
                const clonedCertificate =
                    clonedDocument.querySelector(
                        "#temporaryCertificateDownload .certificate"
                    );

                if (!clonedCertificate) return;

                const safeStyle =
                    clonedDocument.createElement("style");

                safeStyle.textContent = `
                    #temporaryCertificateDownload,
                    #temporaryCertificateDownload *,
                    #temporaryCertificateDownload *::before,
                    #temporaryCertificateDownload *::after {
                        background-image: none !important;
                        animation: none !important;
                        transition: none !important;
                        caret-color: transparent !important;
                    }

                    #temporaryCertificateDownload .certificate,
                    #temporaryCertificateDownload .certificate-border,
                    #temporaryCertificateDownload .certificate-inner {
                        transform: none !important;
                    }
                `;

                clonedDocument.head.appendChild(safeStyle);

                clonedCertificate.querySelectorAll("img").forEach(image => {
                    if (!image.complete || image.naturalWidth === 0) {
                        image.style.display = "none";
                    }
                });

                clonedCertificate.querySelectorAll("canvas").forEach(item => {
                    if (!item.width || !item.height) {
                        item.remove();
                    }
                });
            }
        });

        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            throw new Error(
                "The generated certificate canvas has invalid dimensions."
            );
        }

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
            compress: true
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imageRatio = canvas.width / canvas.height;

        let pdfWidth = pageWidth;
        let pdfHeight = pdfWidth / imageRatio;
        let x = 0;
        let y = (pageHeight - pdfHeight) / 2;

        if (pdfHeight > pageHeight) {
            pdfHeight = pageHeight;
            pdfWidth = pdfHeight * imageRatio;
            x = (pageWidth - pdfWidth) / 2;
            y = 0;
        }

        const imageData = canvas.toDataURL("image/jpeg", 0.95);

        pdf.addImage(
            imageData,
            "JPEG",
            x,
            y,
            pdfWidth,
            pdfHeight,
            undefined,
            "FAST"
        );

        const fileName =
            "Learn2Live-" +
            normalizeKey(skill.name) +
            "-Certificate.pdf";

        // Trigger PDF download.
        pdf.save(fileName);

        /*
         * Wait for the backend response.
         * No no-cors mode is used.
         */
        const tracked = await recordCertificateDownload(skill);

        if (!tracked) {
            alert(
                "PDF download was triggered, but the certificate status update could not be confirmed. Check the browser console and Apps Script CORS settings."
            );
        }

    } catch (error) {
        console.error("Certificate download failed:", error);

        alert(
            "Certificate PDF could not be generated. Please check the browser console."
        );
    } finally {
        renderArea.remove();

        if (button) {
            button.disabled = oldButtonDisabled;
            button.innerHTML = oldButtonHTML;
        }
    }
}

// =========================================================
// NOTIFICATIONS
// =========================================================

function setupNotifications() {
    const button =
        document.getElementById("notificationBtn");

    if (!button) return;

    button.addEventListener("click", function () {
        window.location.href = "notification.html";
    });
}

// =========================================================
// MOBILE SIDEBAR
// =========================================================

function setupMobileMenu() {
    const menuButton =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    if (!menuButton || !sidebar || !overlay) return;

    function openMenu() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        document.body.classList.remove("menu-open");
    }

    menuButton.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);

    document.querySelectorAll(".sidebar .nav-item").forEach(link => {
        link.addEventListener("click", closeMenu);
    });
}

// =========================================================
// LOGOUT
// =========================================================

function setupLogout() {
    const logoutButton =
        document.getElementById("logoutBtn");

    const overlay =
        document.getElementById("logoutOverlay");

    const cancelButton =
        document.getElementById("cancelLogout");

    const confirmButton =
        document.getElementById("confirmLogout");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (overlay) {
            overlay.style.display = "flex";
        }
    });

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            if (overlay) {
                overlay.style.display = "none";
            }
        });
    }

    if (confirmButton) {
        confirmButton.addEventListener("click", function () {
            // Keep learning progress when logging out.
            localStorage.removeItem("loggedInEmail");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("currentUserId");

            window.location.href = "login.html";
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                overlay.style.display = "none";
            }
        });
    }
}

// =========================================================
// REFRESH / PAGE EVENTS
// =========================================================

function refreshCertificates() {
    updateUserDetails();
    loadCertificates();
}

window.addEventListener("storage", function () {
    refreshCertificates();
});

window.addEventListener("focus", function () {
    refreshCertificates();
});

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
        refreshCertificates();
    }
});

// =========================================================
// INITIALIZE
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    updateUserDetails();
    loadCertificates();
    setupNotifications();
    setupMobileMenu();
    setupLogout();
});