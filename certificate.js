/* =========================================================
   LEARN2LIVE — CERTIFICATE JS
   6 CATEGORIES ONLY
   CERTIFICATE AFTER 5 TOPICS COMPLETED
========================================================= */

"use strict";

/* =========================================================
   GOOGLE APPS SCRIPT API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";

/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = {
    firstaid: {
        name: "First Aid",
        topics: ["cpr", "bleeding", "burns", "choking", "bites"]
    },

    tax: {
        name: "Tax Basics",
        topics: [
            "tax-fundamentals",
            "income-tax",
            "taxable-income",
            "tax-deductions",
            "tax-filing"
        ]
    },

    banking: {
        name: "Banking",
        topics: [
            "bank-accounts",
            "atm",
            "online-banking",
            "loans",
            "banking-security"
        ]
    },

    "digital-safety": {
        name: "Digital Safety",
        topics: [
            "password-security",
            "online-scams",
            "privacy-protection",
            "social-media-safety",
            "safe-online-payments"
        ]
    },

    legal: {
        name: "Legal Rights",
        topics: [
            "basic-legal-rights",
            "consumer-rights",
            "cyber-rights",
            "child-rights",
            "legal-help"
        ]
    },

    interview: {
        name: "Interview Skills",
        topics: [
            "cv",
            "communication-skills",
            "interview-preparation",
            "common-interview-questions",
            "professional-etiquette"
        ]
    }
};

/* =========================================================
   JSON HELPER
========================================================= */

function getJSON(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

/* =========================================================
   LOGGED-IN EMAIL
========================================================= */

function getLoggedInEmail() {
    const email = localStorage.getItem("loggedInEmail");

    return email ? email.trim().toLowerCase() : "";
}

/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {
    const currentUser = getJSON("currentUser", null);

    if (currentUser && typeof currentUser === "object") {
        return currentUser;
    }

    const email = getLoggedInEmail();

    if (!email) {
        return null;
    }

    const userKeys = [
        "users",
        "learn2liveUsers",
        "eligifyUsers"
    ];

    for (const key of userKeys) {
        const users = getJSON(key, []);

        if (!Array.isArray(users)) {
            continue;
        }

        const found = users.find(user => {
            if (!user) {
                return false;
            }

            const userEmail = String(
                user.email || user.userEmail || ""
            ).trim().toLowerCase();

            return userEmail === email;
        });

        if (found) {
            return found;
        }
    }

    return null;
}

/* =========================================================
   STUDENT NAME
========================================================= */

function getStudentName() {
    const pick = obj => {
        if (!obj || typeof obj !== "object") {
            return "";
        }

        const name =
            obj.name ||
            obj.studentName ||
            obj.fullName ||
            obj.full_name ||
            obj.displayName ||
            obj.userName ||
            obj.username ||
            "";

        const text = String(name).trim();

        return text.includes("@") ? "" : text;
    };

    let name = pick(getCurrentUser());

    if (name) {
        return name;
    }

    try {
        if (
            window.L2L_Auth &&
            window.L2L_Auth.getProfile
        ) {
            name = pick(window.L2L_Auth.getProfile());

            if (name) {
                return name;
            }
        }
    } catch (error) {
        // Ignore profile errors.
    }

    name = pick(getJSON("selectedCertificate", null));

    if (name) {
        return name;
    }

    const email = getLoggedInEmail();

    for (const key of ["learn2liveUsers", "users"]) {
        const list = getJSON(key, []);

        if (Array.isArray(list)) {
            const found = list.find(user =>
                user &&
                String(user.email || "")
                    .trim()
                    .toLowerCase() === email
            );

            name = pick(found);

            if (name) {
                return name;
            }
        }
    }

    if (email) {
        return email.split("@")[0];
    }

    return "Student Name";
}

/* =========================================================
   NORMALIZE KEY
========================================================= */

function normalizeKey(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* =========================================================
   EMAIL SAFE KEY
========================================================= */

function emailSafeKey(email) {
    return String(email || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");
}

/* =========================================================
   CHECK TOPIC COMPLETION
========================================================= */

function isTopicCompleted(categoryKey, topicKey) {
    const email = getLoggedInEmail();

    if (!email) {
        return false;
    }

    const topic = normalizeKey(topicKey);

    const categoryName = CATEGORIES[categoryKey]
        ? normalizeKey(CATEGORIES[categoryKey].name)
        : normalizeKey(categoryKey);

    /* 1. DIRECT LOCAL STORAGE KEYS */

    const directKeys = [
        `learn2live_${topic}_completed_${email}`,
        `learn2live_${categoryName}_${topic}_completed_${email}`,
        `learn2live_${normalizeKey(categoryKey)}_${topic}_completed_${email}`,
        `learn2live_${topic}_completed_${emailSafeKey(email)}`,
        `learn2live_${topic}_completed_${encodeURIComponent(email)}`
    ];

    for (const key of directKeys) {
        const value = localStorage.getItem(key);

        if (
            value === "true" ||
            value === "1" ||
            value === "completed"
        ) {
            return true;
        }
    }

    /* 2. JSON COMPLETION LISTS */

    const stores = [
        "learn2liveCompleted",
        "learn2liveCompletions",
        "quizCompletions",
        "completedTopics"
    ];

    for (const storeKey of stores) {
        const data = getJSON(storeKey, null);

        if (!data) {
            continue;
        }

        if (Array.isArray(data)) {
            const found = data.some(item => {
                if (typeof item === "string") {
                    return normalizeKey(item) === topic;
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

                const done =
                    item.completed === undefined ||
                    item.completed === true ||
                    item.completed === "true" ||
                    item.status === "completed" ||
                    item.isCompleted === true;

                return (
                    itemTopic === topic &&
                    done &&
                    (!itemEmail || itemEmail === email)
                );
            });

            if (found) {
                return true;
            }
        } else if (typeof data === "object") {
            const emailData =
                data[email] ||
                data[emailSafeKey(email)];

            if (Array.isArray(emailData)) {
                const found = emailData.some(item => {
                    const topicValue =
                        typeof item === "string"
                            ? item
                            : item && (
                                item.topic ||
                                item.topicKey ||
                                item.subcategory
                            );

                    return normalizeKey(topicValue) === topic;
                });

                if (found) {
                    return true;
                }
            } else if (
                emailData &&
                typeof emailData === "object"
            ) {
                if (
                    emailData[topic] === true ||
                    emailData[topic] === "completed"
                ) {
                    return true;
                }
            }

            if (
                data[topic] === true ||
                data[topic] === "completed"
            ) {
                return true;
            }
        }
    }

    return false;
}

/* =========================================================
   CHECK COMPLETE CATEGORY
========================================================= */

function isCategoryCompleted(categoryKey) {
    const category = CATEGORIES[categoryKey];

    if (!category) {
        return false;
    }

    return category.topics.every(topic =>
        isTopicCompleted(categoryKey, topic)
    );
}

/* =========================================================
   FIND COMPLETED CATEGORY
========================================================= */

function getCompletedCategory() {
    const selected = getJSON("selectedCertificate", null);

    if (selected && typeof selected === "object") {
        const selectedKey = normalizeKey(
            selected.skillKey ||
            selected.categoryKey ||
            selected.courseKey ||
            ""
        );

        if (
            CATEGORIES[selectedKey] &&
            isCategoryCompleted(selectedKey)
        ) {
            return selectedKey;
        }

        const selectedName = normalizeKey(
            selected.skillName ||
            selected.category ||
            selected.courseName ||
            ""
        );

        for (const key of Object.keys(CATEGORIES)) {
            if (
                normalizeKey(CATEGORIES[key].name) === selectedName &&
                isCategoryCompleted(key)
            ) {
                return key;
            }
        }
    }

    for (const key of Object.keys(CATEGORIES)) {
        if (isCategoryCompleted(key)) {
            return key;
        }
    }

    return null;
}

/* =========================================================
   CATEGORY NAME
========================================================= */

function getCategoryName(categoryKey) {
    return CATEGORIES[categoryKey]
        ? CATEGORIES[categoryKey].name
        : "";
}

/* =========================================================
   CERTIFICATE NUMBER
========================================================= */

function generateCertificateNumber(categoryKey) {
    const email = getLoggedInEmail();
    const year = new Date().getFullYear();

    const storageKey =
        "learn2liveCertificate_" +
        categoryKey +
        "_" +
        emailSafeKey(email);

    const existing = localStorage.getItem(storageKey);

    if (existing) {
        return existing;
    }

    let hash = 0;

    const hashSource =
        email + "|" + normalizeKey(categoryKey);

    for (let i = 0; i < hashSource.length; i++) {
        hash = (
            hash * 31 +
            hashSource.charCodeAt(i)
        ) >>> 0;
    }

    const number = (hash % 999999) + 1;

    const certificateNumber =
        "L2L-" +
        year +
        "-" +
        String(number).padStart(6, "0");

    localStorage.setItem(storageKey, certificateNumber);

    return certificateNumber;
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

/* =========================================================
   GET ISSUE DATE
========================================================= */

function getIssueDate() {
    const selected = getJSON("selectedCertificate", null);

    if (selected && typeof selected === "object") {
        const storedDate =
            selected.completedDate ||
            selected.completionDate ||
            selected.issueDate ||
            selected.dateCompleted ||
            "";

        if (storedDate) {
            const date = new Date(storedDate);

            if (!Number.isNaN(date.getTime())) {
                return formatDate(date);
            }
        }
    }

    return formatDate(new Date());
}

/* =========================================================
   SET TEXT
========================================================= */

function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent = value;
}

/* =========================================================
   SEND TRACKING REQUEST
   No no-cors: check the server response.
========================================================= */

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
            "Tracking request failed. HTTP status: " +
            response.status
        );
    }

    const result = await response.json();

    if (!result || result.success !== true) {
        throw new Error(
            result && result.message
                ? result.message
                : "Apps Script did not confirm the update."
        );
    }

    return result;
}

/* =========================================================
   RECORD CERTIFICATE COMPLETION
   Called after all 5 topics are completed.
========================================================= */

async function recordCertificateCompletion(categoryKey) {
    const email = getLoggedInEmail();

    if (!email || !isCategoryCompleted(categoryKey)) {
        return false;
    }

    const categoryName = getCategoryName(categoryKey);

    try {
        await sendCertificateTracking({
            action: "certificateComplete",
            email: email,
            name: getStudentName(),
            category: categoryName,
            certificate: generateCertificateNumber(categoryKey),
            downloaded: "No"
        });

        return true;
    } catch (error) {
        console.warn(
            "Certificate completion tracking failed:",
            error
        );

        return false;
    }
}

/* =========================================================
   LOAD CERTIFICATE
========================================================= */

function loadCertificate() {
    const categoryKey = getCompletedCategory();

    if (!categoryKey) {
        console.warn(
            "No completed Learn2Live category found."
        );
        return;
    }

    /* Sync completed certificate to Google Sheets */

    void recordCertificateCompletion(categoryKey);

    const categoryName = getCategoryName(categoryKey);

    /* STUDENT NAME */

    setText("studentName", getStudentName());

    /* CATEGORY */

    setText("category", categoryName);

    /* CERTIFICATE NUMBER */

    const certificateNumber =
        generateCertificateNumber(categoryKey);

    setText("certificateId", certificateNumber);

    /* DETAILS UNDER SEAL */

    const sealDetails = document.querySelector(".seal-details");

    if (sealDetails) {
        const details = sealDetails.querySelectorAll(
            ".small-detail strong"
        );

        if (details[0]) {
            details[0].textContent = certificateNumber;
        }

        if (details[1]) {
            details[1].textContent = getIssueDate();
        }
    }

    /* PAGE TITLE */

    document.title =
        categoryName + " Certificate | Learn2Live";
}

/* =========================================================
   RECORD CERTIFICATE DOWNLOAD
   Update the existing row in Google Sheets.
========================================================= */

async function recordCertificateDownload(categoryKey) {
    const email = getLoggedInEmail();

    if (!email) {
        console.error(
            "Certificate download tracking failed: logged-in email not found."
        );

        return false;
    }

    if (!CATEGORIES[categoryKey]) {
        console.error(
            "Certificate download tracking failed: invalid category."
        );

        return false;
    }

    if (!isCategoryCompleted(categoryKey)) {
        console.warn(
            "Certificate download tracking skipped: category incomplete."
        );

        return false;
    }

    try {
        const result = await sendCertificateTracking({
            action: "certificateDownload",
            email: email,
            name: getStudentName(),
            category: getCategoryName(categoryKey),
            certificate: generateCertificateNumber(categoryKey),
            downloaded: "Yes"
        });

        console.log(
            "Certificate download tracking confirmed:",
            result
        );

        return true;
    } catch (error) {
        console.error(
            "Certificate downloaded, but Google Sheets tracking could not be confirmed:",
            error
        );

        return false;
    }
}

/* =========================================================
   DOWNLOAD PDF
========================================================= */

async function downloadPDF() {
    const certificate = document.getElementById("certificate");
    const button = document.querySelector(".download-btn");

    if (!certificate) {
        alert("Certificate element not found.");
        return;
    }

    if (typeof window.html2canvas !== "function") {
        alert(
            "html2canvas library is missing. Check your certificate.html script links."
        );

        console.error("html2canvas is not loaded.");
        return;
    }

    const jsPDF = window.jspdf?.jsPDF || window.jsPDF;

    if (typeof jsPDF !== "function") {
        alert(
            "jsPDF library is missing. Check your certificate.html script links."
        );

        console.error("jsPDF is not loaded.");
        return;
    }

    const categoryKey = getCompletedCategory();

    if (!categoryKey) {
        alert(
            "Please complete all 5 topics of a course before downloading your certificate."
        );
        return;
    }

    const originalHTML = button?.innerHTML || "";
    const originalDisabled = button?.disabled || false;

    document.getElementById("certificatePdfRender")?.remove();

    const renderArea = document.createElement("div");
    renderArea.id = "certificatePdfRender";

    Object.assign(renderArea.style, {
        position: "fixed",
        left: "-12000px",
        top: "0",
        width: "1123px",
        minWidth: "1123px",
        height: "794px",
        overflow: "hidden",
        background: "#ffffff",
        zIndex: "-1",
        pointerEvents: "none"
    });

    document.body.appendChild(renderArea);

    try {
        if (button) {
            button.disabled = true;
            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';
        }

        const clone = certificate.cloneNode(true);

        renderArea.appendChild(clone);

        Object.assign(clone.style, {
            width: "1123px",
            minWidth: "1123px",
            height: "794px",
            minHeight: "794px",
            maxWidth: "none",
            maxHeight: "none",
            margin: "0",
            transform: "none",
            boxSizing: "border-box",
            overflow: "hidden",
            backgroundColor: "#ffffff"
        });

        /* Preserve student-name styling */

        const originalName =
            certificate.querySelector("#studentName, .student-name");

        const clonedName =
            clone.querySelector("#studentName, .student-name");

        if (originalName && clonedName) {
            clonedName.classList.add("student-name");

            const computed = window.getComputedStyle(originalName);

            clonedName.style.fontFamily = computed.fontFamily;
            clonedName.style.fontSize = computed.fontSize;
            clonedName.style.fontWeight = computed.fontWeight;
            clonedName.style.fontStyle = computed.fontStyle;
            clonedName.style.letterSpacing = computed.letterSpacing;
            clonedName.style.textTransform = computed.textTransform;
            clonedName.style.color = computed.color;
        }

        /* Wait for web fonts */

        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        /* Wait for images */

        const images = Array.from(clone.querySelectorAll("img"));

        await Promise.all(images.map(async image => {
            if (!image.complete) {
                await new Promise(resolve => {
                    image.addEventListener("load", resolve, {
                        once: true
                    });

                    image.addEventListener("error", resolve, {
                        once: true
                    });
                });
            }

            if (!image.naturalWidth || !image.naturalHeight) {
                image.style.display = "none";
            }
        }));

        /* Allow layout to settle */

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const canvas = await window.html2canvas(clone, {
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
                const safeStyle =
                    clonedDocument.createElement("style");

                safeStyle.textContent = `
                    #certificatePdfRender,
                    #certificatePdfRender *,
                    #certificatePdfRender *::before,
                    #certificatePdfRender *::after {
                        background-image: none !important;
                        animation: none !important;
                        transition: none !important;
                        caret-color: transparent !important;
                    }

                    #certificatePdfRender #studentName,
                    #certificatePdfRender .student-name {
                        font-family: inherit;
                    }
                `;

                clonedDocument.head.appendChild(safeStyle);

                const pdfCertificate =
                    clonedDocument.querySelector(
                        "#certificatePdfRender #certificate"
                    );

                if (pdfCertificate) {
                    pdfCertificate.style.transform = "none";
                }

                clonedDocument
                    .querySelectorAll("#certificatePdfRender canvas")
                    .forEach(item => {
                        if (!item.width || !item.height) {
                            item.remove();
                        }
                    });
            }
        });

        if (!canvas.width || !canvas.height) {
            throw new Error(
                "Generated canvas has zero dimensions."
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

        const ratio = Math.min(
            pageWidth / canvas.width,
            pageHeight / canvas.height
        );

        const pdfWidth = canvas.width * ratio;
        const pdfHeight = canvas.height * ratio;

        const x = (pageWidth - pdfWidth) / 2;
        const y = (pageHeight - pdfHeight) / 2;

        const imageData = canvas.toDataURL(
            "image/jpeg",
            0.96
        );

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

        const categoryName = getCategoryName(categoryKey)
            .replace(/[^a-z0-9]+/gi, "_");

        const studentName = getStudentName()
            .replace(/[^a-z0-9]+/gi, "_");

        /* Trigger PDF download */

        pdf.save(
            `Learn2Live_${categoryName}_${studentName}_Certificate.pdf`
        );

        /*
         * IMPORTANT:
         * Send certificateDownload to Apps Script.
         * Backend must find the existing row using
         * normalized email + category and update
         * Downloaded = Yes on that same row.
         */

        const tracked = await recordCertificateDownload(categoryKey);

        if (!tracked) {
            console.error(
                "The PDF download was triggered, but the Google Sheets update was not confirmed."
            );
        }

    } catch (error) {
        console.error(
            "Certificate PDF download failed:",
            error
        );

        alert(
            "Certificate download failed. Open the browser console (F12) to check the error."
        );
    } finally {
        renderArea.remove();

        if (button) {
            button.disabled = originalDisabled;
            button.innerHTML = originalHTML;
        }
    }
}

/* =========================================================
   REFRESH
========================================================= */

function refreshCertificate() {
    loadCertificate();
}

/* =========================================================
   STORAGE CHANGE
========================================================= */

window.addEventListener("storage", function () {
    refreshCertificate();
});

/* =========================================================
   VISIBILITY CHANGE
========================================================= */

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
        refreshCertificate();
    }
});

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    loadCertificate();
});