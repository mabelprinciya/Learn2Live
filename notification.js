/* =========================================================
   LEARN2LIVE - NOTIFICATION.JS
   REAL LOGGED-IN USER DETAILS
   + REAL GOOGLE APPS SCRIPT NOTIFICATIONS
========================================================= */

"use strict";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";


/* =========================================================
   GET LOGGED-IN EMAIL
   SAME LOGIC AS DASHBOARD.JS
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
   GET CURRENT USER
   SAME LOGIC AS DASHBOARD.JS
========================================================= */

function getCurrentUser() {

    const email =
        getLoggedInEmail();


    /* -----------------------------------------------------
       CURRENT USER
    ----------------------------------------------------- */

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
                typeof currentUser === "object"
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


    /* -----------------------------------------------------
       OTHER USER OBJECTS
    ----------------------------------------------------- */

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
                typeof user === "object"
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


    /* -----------------------------------------------------
       USER ARRAYS
    ----------------------------------------------------- */

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
   GET DISPLAY NAME
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
   UPDATE USER DETAILS
   HEADER NAME + PROFILE PHOTO
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


    const emailElement =
        document.getElementById(
            "headerUserEmail"
        );


    if (!user) {

        if (nameElement) {

            nameElement.textContent =
                "";

        }


        if (emailElement) {

            emailElement.textContent =
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


    const email =
        getLoggedInEmail();


    /* -----------------------------------------------------
       NAME
    ----------------------------------------------------- */

    if (nameElement) {

        nameElement.textContent =
            realName;

    }


    /* -----------------------------------------------------
       EMAIL
    ----------------------------------------------------- */

    if (emailElement) {

        emailElement.textContent =
            email;

    }


    /* -----------------------------------------------------
       PHOTO
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       INITIALS
    ----------------------------------------------------- */

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
   FETCH NOTIFICATIONS FROM GOOGLE APPS SCRIPT
========================================================= */

async function loadNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const loading =
        document.getElementById(
            "notificationLoading"
        );


    const empty =
        document.getElementById(
            "notificationEmpty"
        );


    const errorElement =
        document.getElementById(
            "notificationError"
        );


    if (loading) {

        loading.style.display =
            "block";

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    if (errorElement) {

        errorElement.style.display =
            "none";

    }


    try {

        const response =
            await fetch(
                API_URL +
                "?type=notifications"
            );


        if (!response.ok) {

            throw new Error(
                "Notification API request failed"
            );

        }


        const data =
            await response.json();


        /* log removed */;


        const notifications =
            normalizeNotifications(
                data
            );


        renderNotifications(
            notifications
        );


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );


        if (loading) {

            loading.style.display =
                "none";

        }


        if (errorElement) {

            errorElement.style.display =
                "block";

        }

    }

}


/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

function normalizeNotifications(
    data
) {

    if (
        Array.isArray(data)
    ) {

        return data;

    }


    if (
        data &&
        Array.isArray(
            data.notifications
        )
    ) {

        return data.notifications;

    }


    if (
        data &&
        Array.isArray(
            data.data
        )
    ) {

        return data.data;

    }


    if (
        data &&
        Array.isArray(
            data.records
        )
    ) {

        return data.records;

    }


    return [];

}


/* =========================================================
   NORMALIZE SINGLE NOTIFICATION
========================================================= */

function normalizeNotification(
    item
) {

    if (!item) {

        return {

            id: "",

            title: "Notification",

            message: "",

            type: "info",

            createdAt: ""

        };

    }


    return {

        id:
            item.NotificationID ||
            item.notificationID ||
            item.ID ||
            item.Id ||
            item.id ||
            "",

        title:
            item.Title ||
            item.title ||
            "Notification",

        message:
            item.Message ||
            item.message ||
            "",

        type:
            String(
                item.Type ||
                item.type ||
                "info"
            )
                .trim()
                .toLowerCase(),

        createdAt:
            item.CreatedAt ||
            item["Created At"] ||
            item.Timestamp ||
            item.Date ||
            item.date ||
            ""

    };

}


/* =========================================================
   NOTIFICATION DATE
========================================================= */

function formatNotificationDate(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleString(
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


/* =========================================================
   NOTIFICATION ICON
========================================================= */

function getNotificationIcon(
    type
) {

    switch (
        String(
            type || ""
        ).toLowerCase()
    ) {

        case "success":

            return "fa-solid fa-circle-check";


        case "warning":

            return "fa-solid fa-triangle-exclamation";


        case "important":

            return "fa-solid fa-circle-exclamation";


        default:

            return "fa-solid fa-circle-info";

    }

}


/* =========================================================
   NOTIFICATION CLASS
========================================================= */

function getNotificationClass(
    type
) {

    switch (
        String(
            type || ""
        ).toLowerCase()
    ) {

        case "success":

            return "notification-success";


        case "warning":

            return "notification-warning";


        case "important":

            return "notification-important";


        default:

            return "notification-info";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

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


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderNotifications(
    notifications
) {

    const list =
        document.getElementById(
            "notificationList"
        );


    const loading =
        document.getElementById(
            "notificationLoading"
        );


    const empty =
        document.getElementById(
            "notificationEmpty"
        );


    const errorElement =
        document.getElementById(
            "notificationError"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    if (errorElement) {

        errorElement.style.display =
            "none";

    }


    if (!list) {

        return;

    }


    list.innerHTML =
        "";


    if (
        !Array.isArray(
            notifications
        ) ||
        !notifications.length
    ) {

        if (empty) {

            empty.style.display =
                "block";

        }

        updateNotificationCount(
            0
        );

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    const normalized =
        notifications
            .map(
                normalizeNotification
            )
            .sort(
                (
                    a,
                    b
                ) => {

                    const dateA =
                        new Date(
                            a.createdAt
                        ).getTime() || 0;


                    const dateB =
                        new Date(
                            b.createdAt
                        ).getTime() || 0;


                    return (
                        dateB -
                        dateA
                    );

                }
            );


    normalized.forEach(
        notification => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "notification-card " +
                getNotificationClass(
                    notification.type
                );


            const icon =
                getNotificationIcon(
                    notification.type
                );


            const date =
                formatNotificationDate(
                    notification.createdAt
                );


            card.innerHTML = `

                <div class="notification-icon">

                    <i class="${icon}"></i>

                </div>


                <div class="notification-content">

                    <div class="notification-top">

                        <h3>
                            ${escapeHTML(
                                notification.title
                            )}
                        </h3>

                        <span class="notification-type">

                            ${escapeHTML(
                                notification.type
                            )}

                        </span>

                    </div>


                    <p>
                        ${escapeHTML(
                            notification.message
                        )}
                    </p>


                    ${
                        date
                            ? `
                                <div class="notification-date">

                                    <i class="fa-regular fa-clock"></i>

                                    ${escapeHTML(
                                        date
                                    )}

                                </div>
                            `
                            : ""
                    }

                </div>

            `;


            list.appendChild(
                card
            );

        }
    );


    updateNotificationCount(
        normalized.length
    );

}


/* =========================================================
   UPDATE NOTIFICATION COUNT
========================================================= */

function updateNotificationCount(
    count
) {

    const badge =
        document.getElementById(
            "notificationCount"
        );


    if (!badge) {

        return;

    }


    if (
        count > 0
    ) {

        badge.textContent =
            count > 99
                ? "99+"
                : String(count);

        badge.style.display =
            "flex";

    } else {

        badge.textContent =
            "";

        badge.style.display =
            "none";

    }

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

function refreshNotificationPage() {

    updateUserDetails();

    loadNotifications();

}


/* =========================================================
   STORAGE CHANGE
========================================================= */

window.addEventListener(
    "storage",
    function () {

        updateUserDetails();

    }
);


/* =========================================================
   PAGE FOCUS
========================================================= */

window.addEventListener(
    "focus",
    function () {

        refreshNotificationPage();

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

            refreshNotificationPage();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        refreshNotificationPage();

        setupMobileMenu();

        setupLogout();

    }
);


/* =========================================================
   AUTO REFRESH NOTIFICATIONS
   EVERY 30 SECONDS
========================================================= */

setInterval(
    function () {

        loadNotifications();

    },
    30000
);