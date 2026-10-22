/* =========================================================
   LEARN2LIVE - PROFILE.JS
   COMPLETE PROFILE + PROGRESS SYSTEM
========================================================= */

"use strict";


/* =========================================================
   SKILL CONFIGURATION
========================================================= */

const SKILLS = [

    {
        key: "firstaid",
        name: "First Aid",
        topics: [
            "cpr",
            "bleeding",
            "burns",
            "choking",
            "bites"
        ]
    },

    {
        key: "banking",
        name: "Banking",
        topics: [
            "banking"
        ]
    },

    {
        key: "tax",
        name: "Tax Basics",
        topics: [
            "tax"
        ]
    },

    {
        key: "digital-safety",
        name: "Digital Safety",
        topics: [
            "digital-safety"
        ]
    },

    {
        key: "legal",
        name: "Legal Rights",
        topics: [
            "legal"
        ]
    },

    {
        key: "interview",
        name: "Interview Skills",
        topics: [
            "interview"
        ]
    }

];


/* =========================================================
   LOCAL STORAGE HELPERS
========================================================= */

function getJSON(key, fallback = null) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        return fallback;

    }

}


function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    const possibleKeys = [

        "currentUser",
        "learn2liveCurrentUser",
        "loggedInUser",
        "user"

    ];


    for (const key of possibleKeys) {

        const data = getJSON(key);

        if (data && typeof data === "object") {
            return data;
        }

    }


    return {};

}


/* =========================================================
   USER NAME
========================================================= */

function getUserName() {

    const user = getCurrentUser();

    return (
        user.name ||
        user.fullName ||
        user.username ||
        "User"
    );

}


/* =========================================================
   USERNAME
========================================================= */

function getUsername() {

    const user = getCurrentUser();

    return (
        user.username ||
        user.userName ||
        ""
    );

}


/* =========================================================
   USER PHOTO
========================================================= */

function getUserPhoto() {

    const user = getCurrentUser();

    return (
        user.photo ||
        user.profilePhoto ||
        user.image ||
        ""
    );

}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {
        return "U";
    }


    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   UPDATE IMAGE + INITIALS
========================================================= */

function updateAvatar(imageId, initialsId, photo, initials) {

    const image =
        document.getElementById(imageId);

    const initialsElement =
        document.getElementById(initialsId);


    if (!image) {
        return;
    }


    if (photo) {

        image.src = photo;

        image.style.display = "block";


        if (initialsElement) {
            initialsElement.style.display = "none";
        }

    } else {

        image.removeAttribute("src");

        image.style.display = "none";


        if (initialsElement) {

            initialsElement.textContent =
                initials;

            initialsElement.style.display =
                "flex";

        }

    }

}


/* =========================================================
   UPDATE ALL USER INFORMATION
========================================================= */

function updateUserUI() {

    const user =
        getCurrentUser();


    const name =
        getUserName();


    const username =
        getUsername();


    const photo =
        getUserPhoto();


    const initials =
        getInitials(name);


    /* HEADER */

    setText(
        "headerUserName",
        name
    );


    updateAvatar(
        "headerAvatarImage",
        "headerInitials",
        photo,
        initials
    );


    /* MAIN PROFILE */

    setText(
        "profileName",
        name
    );


    setText(
        "profileUsername",
        username
            ? "@" + username
            : "@learner"
    );


    setText(
        "profileBio",
        user.bio ||
        "Keep learning. Keep growing."
    );


    updateAvatar(
        "profileAvatar",
        "profileInitials",
        photo,
        initials
    );


    /* EDIT MODAL */

    setText(
        "modalInitials",
        initials
    );


    updateAvatar(
        "modalAvatar",
        "modalInitials",
        photo,
        initials
    );


    const editName =
        document.getElementById("editName");

    const editUsername =
        document.getElementById("editUsername");

    const editBio =
        document.getElementById("editBio");


    if (editName) {
        editName.value = name;
    }


    if (editUsername) {
        editUsername.value = username;
    }


    if (editBio) {
        editBio.value =
            user.bio || "";
    }

}


/* =========================================================
   STORAGE SEARCH
   Finds completion information even if quiz.js
   used slightly different key names.
========================================================= */

function storageContainsCompletion(skillKey, topicKey = "") {

    const keys = Object.keys(localStorage);


    const possibleWords = [

        skillKey,

        skillKey.replace("-", ""),

        skillKey.replace("-", "_"),

        topicKey,

        topicKey.replace("-", ""),

        topicKey.replace("-", "_")

    ].filter(Boolean);


    for (const key of keys) {

        /* ONLY the active user's keys - never another account's progress */
        const _email =
            String(localStorage.getItem("loggedInEmail") || "")
                .trim()
                .toLowerCase();
        const _kl = key.toLowerCase();
        if (
            !_email ||
            !(
                _kl.includes(_email) ||
                _kl.includes(_email.replace(/[^a-z0-9]/g, "_")) ||
                _kl.includes(encodeURIComponent(_email).toLowerCase())
            )
        ) {
            continue;
        }

        const lowerKey =
            key.toLowerCase();


        if (
            !possibleWords.some(
                word =>
                    lowerKey.includes(
                        word.toLowerCase()
                    )
            )
        ) {
            continue;
        }


        const raw =
            localStorage.getItem(key);


        if (!raw) {
            continue;
        }


        const lowerValue =
            raw.toLowerCase();


        if (
            lowerValue === "true" ||
            lowerValue === "completed" ||
            lowerValue === "complete" ||
            lowerValue === "passed" ||
            lowerValue === "pass" ||
            lowerValue.includes('"completed":true') ||
            lowerValue.includes('"complete":true') ||
            lowerValue.includes('"passed":true') ||
            lowerValue.includes('"completed": true') ||
            lowerValue.includes('"passed": true')
        ) {

            return true;

        }

    }


    return false;

}


/* =========================================================
   CHECK TOPIC COMPLETION
========================================================= */

function isTopicCompleted(skillKey, topicKey) {

    const directKeys = [

        `${skillKey}_${topicKey}_completed`,

        `${skillKey}-${topicKey}-completed`,

        `${skillKey}_${topicKey}_complete`,

        `${skillKey}-${topicKey}-complete`,

        `${topicKey}_completed`,

        `${topicKey}-completed`,

        `${topicKey}_complete`,

        `${topicKey}-complete`,

        `quiz_${topicKey}_completed`,

        `quiz_${topicKey}_complete`,

        `completed_${topicKey}`,

        `complete_${topicKey}`

    ];


    for (const key of directKeys) {

        const value =
            localStorage.getItem(key);


        if (!value) {
            continue;
        }


        const lower =
            value.toLowerCase();


        if (
            lower === "true" ||
            lower === "completed" ||
            lower === "complete" ||
            lower === "passed" ||
            lower === "pass"
        ) {

            return true;

        }


        try {

            const parsed =
                JSON.parse(value);


            if (
                parsed === true ||
                parsed.completed === true ||
                parsed.complete === true ||
                parsed.passed === true
            ) {

                return true;

            }

        } catch (error) {}

    }


    return storageContainsCompletion(
        skillKey,
        topicKey
    );

}


/* =========================================================
   CATEGORY COMPLETION
========================================================= */

function isCategoryCompleted(skill) {

    const categoryKeys = [

        `${skill.key}_completed`,

        `${skill.key}-completed`,

        `${skill.key}_complete`,

        `${skill.key}-complete`,

        `completed_${skill.key}`,

        `complete_${skill.key}`,

        `quiz_${skill.key}_completed`,

        `quiz_${skill.key}_complete`

    ];


    for (const key of categoryKeys) {

        const value =
            localStorage.getItem(key);


        if (!value) {
            continue;
        }


        const lower =
            value.toLowerCase();


        if (
            lower === "true" ||
            lower === "completed" ||
            lower === "complete" ||
            lower === "passed" ||
            lower === "pass"
        ) {

            return true;

        }


        try {

            const parsed =
                JSON.parse(value);


            if (
                parsed === true ||
                parsed.completed === true ||
                parsed.complete === true ||
                parsed.passed === true
            ) {

                return true;

            }

        } catch (error) {}

    }


    /* fallback:
       every topic completed */

    if (skill.topics.length > 0) {

        return skill.topics.every(
            topic =>
                isTopicCompleted(
                    skill.key,
                    topic
                )
        );

    }


    return false;

}


/* =========================================================
   GET SKILL PROGRESS
========================================================= */

function getSkillProgress(skill) {

    const total =
        skill.topics.length;


    let completed = 0;


    skill.topics.forEach(topic => {

        if (
            isTopicCompleted(
                skill.key,
                topic
            )
        ) {

            completed++;

        }

    });


    const completedAll =
        isCategoryCompleted(skill);


    if (completedAll) {

        completed = total;

    }


    const percent =
        total > 0
            ? Math.round(
                (completed / total) * 100
            )
            : 0;


    return {

        completed,
        total,
        percent,
        completedAll

    };

}


/* =========================================================
   OVERALL QUIZ STATS
========================================================= */

function getQuizStats() {

    let completedTopics = 0;
    let totalTopics = 0;
    let completedCategories = 0;


    SKILLS.forEach(skill => {

        const progress =
            getSkillProgress(skill);


        completedTopics +=
            progress.completed;


        totalTopics +=
            progress.total;


        if (progress.completedAll) {

            completedCategories++;

        }

    });


    const progress =
        totalTopics > 0
            ? Math.round(
                (completedTopics / totalTopics) * 100
            )
            : 0;


    return {

        completedTopics,

        totalTopics,

        progress,

        completedCategories,

        totalCategories:
            SKILLS.length

    };

}


/* =========================================================
   CATEGORY PROGRESS UI
========================================================= */

function updateCategoryProgress() {

    const mapping = {

        firstaid: {

            text: "firstAidProgressText",
            bar: "firstAidProgress"

        },

        banking: {

            text: "bankingProgressText",
            bar: "bankingProgress"

        },

        tax: {

            text: "taxProgressText",
            bar: "taxProgress"

        },

        "digital-safety": {

            text: "digitalProgressText",
            bar: "digitalProgress"

        },

        legal: {

            text: "legalProgressText",
            bar: "legalProgress"

        },

        interview: {

            text: "interviewProgressText",
            bar: "interviewProgress"

        }

    };


    SKILLS.forEach(skill => {

        const progress =
            getSkillProgress(skill);


        const ids =
            mapping[skill.key];


        if (!ids) {
            return;
        }


        setText(
            ids.text,
            progress.percent + "%"
        );


        const bar =
            document.getElementById(ids.bar);


        if (bar) {

            bar.style.width =
                progress.percent + "%";

        }

    });

}


/* =========================================================
   LEARN POINTS
========================================================= */

function getLearnPoints() {

    const stats =
        getQuizStats();


    /*
       10 points for every completed topic
       25 bonus points for every completed category
       100 bonus points after all categories
    */

    let points =
        stats.completedTopics * 10;


    points +=
        stats.completedCategories * 25;


    if (
        stats.completedCategories ===
        stats.totalCategories
    ) {

        points += 100;

    }


    return points;

}


/* =========================================================
   LEARNING LEVEL
========================================================= */

function getLearningLevel(completedCategories) {

    if (completedCategories >= 6) {
        return "Life Ready";
    }

    if (completedCategories >= 4) {
        return "Knowledge Seeker";
    }

    if (completedCategories >= 3) {
        return "Skill Builder";
    }

    if (completedCategories >= 2) {
        return "Explorer";
    }

    return "Beginner";

}


/* =========================================================
   JOURNEY PROGRESS
========================================================= */

function updateJourney() {

    const stats =
        getQuizStats();


    const completed =
        stats.completedCategories;


    const level =
        getLearningLevel(
            completed
        );


    setText(
        "journeyStage",
        level
    );


    /*
       0 categories = 0%
       1 = 25%
       2 = 50%
       3 = 60%
       4 = 75%
       5 = 90%
       6 = 100%
    */

    const journeyPercentMap = {

        0: 0,
        1: 20,
        2: 40,
        3: 60,
        4: 75,
        5: 90,
        6: 100

    };


    const percentage =
        journeyPercentMap[completed] ?? 0;


    const progress =
        document.getElementById(
            "journeyProgress"
        );


    if (progress) {

        progress.style.width =
            percentage + "%";

    }


    /* JOURNEY STEP STATES */

    const steps =
        document.querySelectorAll(
            ".journey-step"
        );


    steps.forEach(
        (step, index) => {

            step.classList.remove(
                "active",
                "completed"
            );


            /*
               0 -> Beginner
               1-2 -> Explorer
               3 -> Skill Builder
               4 -> Knowledge Seeker
               5-6 -> Life Ready
            */

            let stepCompleted =
                false;


            if (index === 0) {

                stepCompleted =
                    completed >= 1;

            }

            if (index === 1) {

                stepCompleted =
                    completed >= 2;

            }

            if (index === 2) {

                stepCompleted =
                    completed >= 3;

            }

            if (index === 3) {

                stepCompleted =
                    completed >= 4;

            }

            if (index === 4) {

                stepCompleted =
                    completed >= 6;

            }


            if (stepCompleted) {

                step.classList.add(
                    "completed"
                );

            }

        }
    );


    /*
       Current stage highlight
    */

    let activeIndex = 0;


    if (completed >= 6) {

        activeIndex = 4;

    } else if (completed >= 4) {

        activeIndex = 3;

    } else if (completed >= 3) {

        activeIndex = 2;

    } else if (completed >= 2) {

        activeIndex = 1;

    } else {

        activeIndex = 0;

    }


    if (steps[activeIndex]) {

        steps[activeIndex]
            .classList.add("active");

    }

}


/* =========================================================
   CERTIFICATE COUNT
========================================================= */

function getCertificateCount() {

    let completedCategories = 0;

    SKILLS.forEach(skill => {

        if (
            getSkillProgress(skill).completedAll
        ) {
            completedCategories++;
        }

    });

    return completedCategories;
}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    const stats =
        getQuizStats();


    setText(
        "quizCompletedCount",
        stats.completedTopics
    );


    setText(
        "quizPassedCount",
        `${stats.completedCategories} / ${stats.totalCategories}`
    );


    setText(
        "averageScore",
        stats.progress + "%"
    );


    setText(
        "certificateCount",
        getCertificateCount()
    );


    setText(
        "learnPoints",
        getLearnPoints()
    );


    setText(
        "learningLevel",
        getLearningLevel(
            stats.completedCategories
        )
    );

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function updateAchievements() {

    const achievementElements =
        document.querySelectorAll(
            ".achievement-item"
        );


    const completedMap = {};


    SKILLS.forEach(skill => {

        completedMap[skill.key] =
            getSkillProgress(skill)
                .completedAll;

    });


    const allCompleted =
        SKILLS.every(
            skill =>
                completedMap[skill.key]
        );


    achievementElements.forEach(item => {

        const key =
            item.dataset.achievement;


        let unlocked = false;


        if (key === "all") {

            unlocked =
                allCompleted;

        } else {

            unlocked =
                !!completedMap[key];

        }


        item.classList.toggle(
            "locked",
            !unlocked
        );


        item.classList.toggle(
            "unlocked",
            unlocked
        );


        item.setAttribute(
            "aria-disabled",
            unlocked
                ? "false"
                : "true"
        );


        /* lock icon */

        let lock =
            item.querySelector(
                ".achievement-lock"
            );


        if (!lock) {

            lock =
                document.createElement(
                    "span"
                );

            lock.className =
                "achievement-lock";

            lock.innerHTML =
                '<i class="fa-solid fa-lock"></i>';

            item.appendChild(lock);

        }


        lock.innerHTML =
            unlocked
                ? '<i class="fa-solid fa-check"></i>'
                : '<i class="fa-solid fa-lock"></i>';

    });

}


/* =========================================================
   DAILY MISSION
========================================================= */

function updateDailyMission() {

    const stats =
        getQuizStats();


    const completed =
        stats.completedTopics > 0;


    const bar =
        document.getElementById(
            "missionProgressBar"
        );


    if (bar) {

        bar.style.width =
            completed
                ? "100%"
                : "0%";

    }


    setText(
        "missionProgressText",
        completed
            ? "1 / 1 completed"
            : "0 / 1 completed"
    );

}


/* =========================================================
   PROFILE PHOTO UPLOAD
========================================================= */

let selectedPhoto = null;


function handlePhotoSelect(event) {

    const file =
        event.target.files?.[0];


    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function () {

        selectedPhoto =
            reader.result;


        updateSelectedPhotoPreview();

    };


    reader.readAsDataURL(file);

}


/* =========================================================
   PHOTO PREVIEW
========================================================= */

function updateSelectedPhotoPreview() {

    if (!selectedPhoto) {
        return;
    }


    const user =
        getCurrentUser();


    const name =
        user.name ||
        user.fullName ||
        user.username ||
        "User";


    const initials =
        getInitials(name);


    updateAvatar(
        "profileAvatar",
        "profileInitials",
        selectedPhoto,
        initials
    );


    updateAvatar(
        "headerAvatarImage",
        "headerInitials",
        selectedPhoto,
        initials
    );


    updateAvatar(
        "modalAvatar",
        "modalInitials",
        selectedPhoto,
        initials
    );

}


/* =========================================================
   SAVE USER DATA
========================================================= */

function saveCurrentUser(user) {

    /*
       Keep the same currentUser object
       so other Learn2Live pages can read it.
    */

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    /*
       Update additional common keys if
       they already exist.
    */

    if (
        localStorage.getItem(
            "learn2liveCurrentUser"
        )
    ) {

        localStorage.setItem(
            "learn2liveCurrentUser",
            JSON.stringify(user)
        );

    }


    if (
        localStorage.getItem(
            "loggedInUser"
        )
    ) {

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );

    }

}


/* =========================================================
   EDIT PROFILE
========================================================= */

function openEditProfile() {

    const overlay =
        document.getElementById(
            "editProfileOverlay"
        );


    if (!overlay) {
        return;
    }


    selectedPhoto = null;


    updateUserUI();


    overlay.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function closeEditProfile() {

    const overlay =
        document.getElementById(
            "editProfileOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );


    selectedPhoto = null;

}


/* =========================================================
   SAVE PROFILE FORM
========================================================= */

function saveProfile(event) {

    event.preventDefault();


    const user =
        getCurrentUser();


    const name =
        document
            .getElementById("editName")
            ?.value
            .trim();


    const username =
        document
            .getElementById("editUsername")
            ?.value
            .trim();


    const bio =
        document
            .getElementById("editBio")
            ?.value
            .trim();


    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    user.name =
        name;


    user.fullName =
        name;


    user.username =
        username || user.username || "";


    user.bio =
        bio || "";


    if (selectedPhoto) {

        user.photo =
            selectedPhoto;

        user.profilePhoto =
            selectedPhoto;

    }


    saveCurrentUser(user);


    updateUserUI();


    closeEditProfile();

}


/* =========================================================
   LOGOUT
========================================================= */

function openLogoutModal(event) {

    if (event) {
        event.preventDefault();
    }


    const overlay =
        document.getElementById(
            "logoutOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.style.display =
        "flex";

}


function closeLogoutModal() {

    const overlay =
        document.getElementById(
            "logoutOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.style.display =
        "none";

}


function logoutUser() {
    /* Full session logout (progress & profile of the user stay saved) */
    if (window.L2L_Auth) {
        window.L2L_Auth.logout();
        return;
    }
    ["loggedInEmail","currentUser","learn2liveUser","user","currentUserId",
     "currentLearn2LiveUser","learn2liveLoggedIn","learn2liveActive",
     "learn2liveCurrentUser","loggedInUser","userSession"]
        .forEach(function (k) { localStorage.removeItem(k); });
    window.location.replace("login.html");

}


/* =========================================================
   ACHIEVEMENT CLICK
========================================================= */

function handleAchievementClick(event) {

    const item =
        event.currentTarget;


    if (
        item.classList.contains(
            "locked"
        )
    ) {

        return;

    }


    const key =
        item.dataset.achievement;


    const messages = {

        firstaid:
            "🎉 First Responder unlocked! You completed First Aid.",

        banking:
            "🎉 Smart Banker unlocked! You completed Banking.",

        tax:
            "🎉 Tax Smart unlocked! You completed Tax Basics.",

        "digital-safety":
            "🎉 Digital Guardian unlocked! You completed Digital Safety.",

        legal:
            "🎉 Rights Aware unlocked! You completed Legal Rights.",

        interview:
            "🎉 Career Ready unlocked! You completed Interview Skills.",

        all:
            "🏆 Life Learner unlocked! You completed all 6 categories."

    };


    if (messages[key]) {

        alert(
            messages[key]
        );

    }

}


/* =========================================================
   NOTIFICATION DOT
========================================================= */

function updateNotificationDot() {

    const dot =
        document.getElementById(
            "notificationDot"
        );


    if (!dot) {
        return;
    }


    const notifications =
        getJSON(
            "notifications",
            []
        );


    if (
        Array.isArray(notifications) &&
        notifications.some(
            item =>
                !item.read
        )
    ) {

        dot.style.display =
            "block";

    } else {

        dot.style.display =
            "none";

    }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function openSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    sidebar?.classList.add(
        "open"
    );

    overlay?.classList.add(
        "show"
    );

}


function closeSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    sidebar?.classList.remove(
        "open"
    );

    overlay?.classList.remove(
        "show"
    );

}


/* =========================================================
   REFRESH EVERYTHING
========================================================= */

function refreshProfile() {

    updateUserUI();

    updateStats();

    updateCategoryProgress();

    updateJourney();

    updateAchievements();

    updateDailyMission();

    updateNotificationDot();

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* INITIAL LOAD */

        refreshProfile();


        /* EDIT PROFILE */

        document
            .getElementById(
                "editProfileBtn"
            )
            ?.addEventListener(
                "click",
                openEditProfile
            );


        document
            .getElementById(
                "closeEditProfile"
            )
            ?.addEventListener(
                "click",
                closeEditProfile
            );


        document
            .getElementById(
                "cancelEditProfile"
            )
            ?.addEventListener(
                "click",
                closeEditProfile
            );


        document
            .getElementById(
                "profileForm"
            )
            ?.addEventListener(
                "submit",
                saveProfile
            );


        /* PHOTO */

        document
            .getElementById(
                "changePhotoBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    document
                        .getElementById(
                            "profilePhotoInput"
                        )
                        ?.click();

                }
            );


        document
            .getElementById(
                "modalChangePhotoBtn"
            )
            ?.addEventListener(
                "click",
                function () {

                    document
                        .getElementById(
                            "profilePhotoInput"
                        )
                        ?.click();

                }
            );


        document
            .getElementById(
                "profilePhotoInput"
            )
            ?.addEventListener(
                "change",
                handlePhotoSelect
            );


        /* LOGOUT */

        document
            .getElementById(
                "logoutBtn"
            )
            ?.addEventListener(
                "click",
                openLogoutModal
            );


        document
            .getElementById(
                "cancelLogout"
            )
            ?.addEventListener(
                "click",
                closeLogoutModal
            );


        document
            .getElementById(
                "confirmLogout"
            )
            ?.addEventListener(
                "click",
                logoutUser
            );


        /* CLOSE MODALS BY OUTSIDE CLICK */

        document
            .getElementById(
                "editProfileOverlay"
            )
            ?.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === this
                    ) {

                        closeEditProfile();

                    }

                }
            );


        document
            .getElementById(
                "logoutOverlay"
            )
            ?.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === this
                    ) {

                        closeLogoutModal();

                    }

                }
            );


        /* ACHIEVEMENTS */

        document
            .querySelectorAll(
                ".achievement-item"
            )
            .forEach(item => {

                item.addEventListener(
                    "click",
                    handleAchievementClick
                );

                item.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            handleAchievementClick({
                                currentTarget: item
                            });

                        }

                    }
                );

            });


        /* MOBILE MENU */

        document
            .getElementById(
                "mobileMenuBtn"
            )
            ?.addEventListener(
                "click",
                openSidebar
            );


        document
            .getElementById(
                "sidebarOverlay"
            )
            ?.addEventListener(
                "click",
                closeSidebar
            );


        /* CLOSE SIDEBAR WHEN NAVIGATING */

        document
            .querySelectorAll(
                ".sidebar .nav-item"
            )
            .forEach(link => {

                link.addEventListener(
                    "click",
                    function () {

                        closeSidebar();

                    }
                );

            });


        /* ESCAPE KEY */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                closeEditProfile();

                closeLogoutModal();

                closeSidebar();

            }
        );

    }
);


/* =========================================================
   AUTO REFRESH
   Useful when quiz completion happened in another page
========================================================= */

window.addEventListener(
    "storage",
    function () {

        refreshProfile();

    }
);


/* =========================================================
   REFRESH WHEN PAGE BECOMES VISIBLE
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshProfile();

        }

    }
);


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.refreshLearn2LiveProfile =
    refreshProfile;