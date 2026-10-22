
/* =====================================================
   LEARN2LIVE - LOGIN JS
   SECURE SERVER-SIDE AUTHENTICATION
   EACH EMAIL = SEPARATE ACCOUNT
===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";

    /* =================================================
       ELEMENTS
    ================================================= */

    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const loadingOverlay = document.getElementById("loadingOverlay");

    let toastTimer;

    /* =================================================
       TOAST MESSAGE
    ================================================= */

    function showToast(message, type = "success") {
        clearTimeout(toastTimer);

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        if (!toast) return;

        const icon = toast.querySelector("i");

        if (icon) {
            if (type === "error") {
                icon.className = "fa-solid fa-circle-exclamation";
                icon.style.color = "#ef4444";
            } else if (type === "warning") {
                icon.className = "fa-solid fa-triangle-exclamation";
                icon.style.color = "#f59e0b";
            } else {
                icon.className = "fa-solid fa-circle-check";
                icon.style.color = "#22c55e";
            }
        }

        toast.classList.add("show");

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    /* =================================================
       LOADING
    ================================================= */

    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add("show");
        }
    }

    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.remove("show");
        }
    }

    /* =================================================
       NORMALIZE EMAIL
    ================================================= */

    function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    /* =================================================
       EMAIL VALIDATION
    ================================================= */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    /* =================================================
       CLEAR ERRORS
    ================================================= */

    function clearErrors() {
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";

        if (loginEmail) loginEmail.style.borderColor = "";
        if (loginPassword) loginPassword.style.borderColor = "";
    }

    /* =================================================
       CLEAR ACTIVE SESSION ONLY
       USER-SPECIFIC DATA IS NOT DELETED
    ================================================= */

    function clearActiveSession() {
        const sessionKeys = [
            "loggedInEmail",
            "currentUser",
            "learn2liveUser",
            "user",
            "currentUserId",
            "currentLearn2LiveUser",
            "learn2liveLoggedIn",
            "learn2liveActive"
        ];

        sessionKeys.forEach(function (key) {
            localStorage.removeItem(key);
        });
    }

    /* =================================================
       USER-SPECIFIC STORAGE PREFIX
    ================================================= */

    function getUserStoragePrefix(email) {
        const safeEmail = normalizeEmail(email)
            .replace(/[^a-z0-9]/g, "_");

        return "learn2live_user_" + safeEmail;
    }

    /* =================================================
       SET CURRENT USER
       NEVER STORE PASSWORD OR PASSWORD HASH
    ================================================= */

    function setCurrentUser(user) {
        const email = normalizeEmail(user.email);

        if (!email) {
            throw new Error("Invalid account email.");
        }

        const cleanUser = {
            id: user.userId || user.id || "",
            name: user.name || "",
            email: email,
            username: user.username || "",
            createdAt: user.createdAt || "",
            lastLogin: user.lastLogin || ""
        };

        clearActiveSession();

        localStorage.setItem("loggedInEmail", email);
        localStorage.setItem("currentUser", JSON.stringify(cleanUser));
        localStorage.setItem("learn2liveUser", JSON.stringify(cleanUser));
        localStorage.setItem("user", JSON.stringify(cleanUser));
        localStorage.setItem("currentUserId", String(cleanUser.id));

        localStorage.setItem("learn2liveLoggedIn", "true");
        localStorage.setItem("learn2liveActive", "true");

        localStorage.setItem(
            "currentLearn2LiveUser",
            JSON.stringify({
                id: cleanUser.id,
                name: cleanUser.name,
                email: cleanUser.email
            })
        );

        const prefix = getUserStoragePrefix(email);

        localStorage.setItem(prefix + "_active", "true");
        localStorage.setItem(
            prefix + "_account",
            JSON.stringify(cleanUser)
        );
    }

    /* =================================================
       SHOW / HIDE PASSWORD
    ================================================= */

    if (togglePassword && loginPassword) {
        togglePassword.addEventListener("click", function () {
            const showPassword = loginPassword.type === "password";

            loginPassword.type = showPassword ? "text" : "password";

            togglePassword.innerHTML = showPassword
                ? '<i class="fa-solid fa-eye-slash"></i>'
                : '<i class="fa-solid fa-eye"></i>';

            togglePassword.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    }

    /* =================================================
       LOGIN FORM
    ================================================= */

    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        clearErrors();

        const email = normalizeEmail(
            loginEmail ? loginEmail.value : ""
        );

        const password = loginPassword
            ? loginPassword.value
            : "";

        /* EMAIL EMPTY */

        if (!email) {
            if (emailError) {
                emailError.textContent =
                    "Please enter your email address.";
            }

            if (loginEmail) {
                loginEmail.style.borderColor = "#ef4444";
                loginEmail.focus();
            }

            showToast("Please enter your email address.", "error");
            return;
        }

        /* INVALID EMAIL */

        if (!isValidEmail(email)) {
            if (emailError) {
                emailError.textContent =
                    "Please enter a valid email address.";
            }

            if (loginEmail) {
                loginEmail.style.borderColor = "#ef4444";
                loginEmail.focus();
            }

            showToast("Please enter a valid email address.", "error");
            return;
        }

        /* PASSWORD EMPTY */

        if (!password) {
            if (passwordError) {
                passwordError.textContent =
                    "Please enter your password.";
            }

            if (loginPassword) {
                loginPassword.style.borderColor = "#ef4444";
                loginPassword.focus();
            }

            showToast("Please enter your password.", "error");
            return;
        }

        showLoading();

        try {
            /*
             * IMPORTANT:
             * The server verifies the password hash against
             * the PasswordHash stored in Google Sheets.
             *
             * Do not fetch the public users list to authenticate.
             * Do not compare hashes in the browser.
             * Do not use localStorage as a password fallback.
             */

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    action: "authenticate",
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error(
                    "Unable to connect to the login server. Please try again."
                );
            }

            const result = await response.json();

            /* LOGIN FAILED */

            if (
                !result ||
                result.success !== true ||
                !result.user
            ) {
                const message =
                    result && result.error
                        ? result.error
                        : "Invalid email or password.";

                hideLoading();

                if (passwordError) {
                    passwordError.textContent = message;
                }

                if (loginPassword) {
                    loginPassword.style.borderColor = "#ef4444";
                    loginPassword.focus();
                }

                showToast(message, "error");
                return;
            }

            /* LOGIN SUCCESS */

            const user = {
                userId: result.user.userId || "",
                name: result.user.name || "",
                email: normalizeEmail(result.user.email || email),
                username: result.user.username || "",
                createdAt: result.user.createdAt || "",
                lastLogin: result.user.lastLogin || ""
            };

            /*
             * Save only non-secret account details.
             * Password and passwordHash are never stored.
             */

            setCurrentUser(user);

            if (
                window.L2L_Auth &&
                typeof window.L2L_Auth.setSession === "function"
            ) {
                window.L2L_Auth.setSession(user);
            }

            hideLoading();

            showToast(
                "Login successful! Welcome back.",
                "success"
            );

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 900);

        } catch (error) {
            console.error("Login error:", error);

            hideLoading();

            showToast(
                error.message ||
                "Unable to login. Please try again.",
                "error"
            );
        }
    });

    /* =================================================
       CLEAR FIELD ERRORS WHILE TYPING
    ================================================= */

    if (loginEmail) {
        loginEmail.addEventListener("input", function () {
            if (emailError) emailError.textContent = "";
            loginEmail.style.borderColor = "";
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener("input", function () {
            if (passwordError) passwordError.textContent = "";
            loginPassword.style.borderColor = "";
        });
    }

});
