/* =====================================================
   LEARN2LIVE - REGISTER JS
   GOOGLE APPS SCRIPT USER REGISTRATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       GOOGLE APPS SCRIPT API
    ================================================= */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbyJaMe9F-x_54uTZanA1t9YFwffsqzELTax5JXzhYVYjFXNC-TKbfHf6el3ITwKvMkbCg/exec";


    /* =================================================
       ELEMENTS
    ================================================= */

    const registerForm =
        document.getElementById("registerForm");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms =
        document.getElementById("terms");

    const togglePassword =
        document.getElementById("togglePassword");

    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    const strengthFill =
        document.getElementById("strengthFill");

    const strengthText =
        document.getElementById("strengthText");

    const passwordMatch =
        document.getElementById("passwordMatch");

    const ruleLength =
        document.getElementById("ruleLength");

    const ruleUpper =
        document.getElementById("ruleUpper");

    const ruleNumber =
        document.getElementById("ruleNumber");

    const ruleSpecial =
        document.getElementById("ruleSpecial");

    const nameError =
        document.getElementById("nameError");

    const emailError =
        document.getElementById("emailError");

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    const loadingOverlay =
        document.getElementById("loadingOverlay");


    /* =================================================
       TOAST
    ================================================= */

    let toastTimer;

    function showToast(
        message,
        type = "success"
    ) {

        clearTimeout(toastTimer);

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        if (toast) {

            const icon =
                toast.querySelector("i");

            if (icon) {

                if (type === "error") {

                    icon.className =
                        "fa-solid fa-circle-exclamation";

                    icon.style.color =
                        "#ef4444";

                }

                else if (type === "warning") {

                    icon.className =
                        "fa-solid fa-triangle-exclamation";

                    icon.style.color =
                        "#f59e0b";

                }

                else {

                    icon.className =
                        "fa-solid fa-circle-check";

                    icon.style.color =
                        "#22c55e";

                }

            }

            toast.classList.add("show");

            toastTimer =
                setTimeout(function () {

                    toast.classList.remove("show");

                }, 3000);

        }

    }


    /* =================================================
       CLEAR ERRORS
    ================================================= */

    function clearErrors() {

        if (nameError) {
            nameError.textContent = "";
        }

        if (emailError) {
            emailError.textContent = "";
        }

        fullName.style.borderColor = "";
        email.style.borderColor = "";

    }


    /* =================================================
       PASSWORD SHOW / HIDE
    ================================================= */

    function setupPasswordToggle(
        button,
        input
    ) {

        if (!button || !input) {
            return;
        }

        button.addEventListener(
            "click",
            function () {

                if (
                    input.type ===
                    "password"
                ) {

                    input.type = "text";

                    button.innerHTML =
                        '<i class="fa-solid fa-eye-slash"></i>';

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                }

                else {

                    input.type =
                        "password";

                    button.innerHTML =
                        '<i class="fa-solid fa-eye"></i>';

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    setupPasswordToggle(
        togglePassword,
        password
    );

    setupPasswordToggle(
        toggleConfirmPassword,
        confirmPassword
    );


    /* =================================================
       PASSWORD RULE CHECK
    ================================================= */

    function updateRule(
        element,
        valid
    ) {

        if (!element) {
            return;
        }

        const icon =
            element.querySelector("i");

        if (valid) {

            element.classList.add(
                "valid"
            );

            if (icon) {

                icon.className =
                    "fa-solid fa-circle-check";

            }

        }

        else {

            element.classList.remove(
                "valid"
            );

            if (icon) {

                icon.className =
                    "fa-solid fa-circle";

            }

        }

    }


    function checkPasswordRules() {

        const value =
            password.value;


        const lengthValid =
            value.length >= 8;

        const upperValid =
            /[A-Z]/.test(value);

        const numberValid =
            /[0-9]/.test(value);

        const specialValid =
            /[^A-Za-z0-9]/.test(value);


        updateRule(
            ruleLength,
            lengthValid
        );

        updateRule(
            ruleUpper,
            upperValid
        );

        updateRule(
            ruleNumber,
            numberValid
        );

        updateRule(
            ruleSpecial,
            specialValid
        );


        return {

            lengthValid,
            upperValid,
            numberValid,
            specialValid

        };

    }


    /* =================================================
       PASSWORD STRENGTH
    ================================================= */

    function updatePasswordStrength() {

        const value =
            password.value;


        strengthFill.className =
            "strength-fill";


        if (!value) {

            strengthFill.style.width =
                "0%";

            strengthText.textContent =
                "Enter a password";

            strengthText.style.color =
                "#999";

            return;

        }


        const rules =
            checkPasswordRules();


        let score = 0;


        if (rules.lengthValid) {
            score++;
        }

        if (rules.upperValid) {
            score++;
        }

        if (rules.numberValid) {
            score++;
        }

        if (rules.specialValid) {
            score++;
        }


        if (score <= 1) {

            strengthFill.classList.add(
                "weak"
            );

            strengthText.textContent =
                "Weak";

            strengthText.style.color =
                "#ef4444";

        }

        else if (score === 2) {

            strengthFill.classList.add(
                "medium"
            );

            strengthText.textContent =
                "Medium";

            strengthText.style.color =
                "#f59e0b";

        }

        else if (score === 3) {

            strengthFill.classList.add(
                "strong"
            );

            strengthText.textContent =
                "Strong";

            strengthText.style.color =
                "#22c55e";

        }

        else {

            strengthFill.classList.add(
                "very-strong"
            );

            strengthText.textContent =
                "Very Strong";

            strengthText.style.color =
                "#16a34a";

        }

    }


    password.addEventListener(
        "input",
        updatePasswordStrength
    );


    /* =================================================
       PASSWORD MATCH
    ================================================= */

    function checkPasswordMatch() {

        const pass =
            password.value;

        const confirm =
            confirmPassword.value;


        if (!confirm) {

            passwordMatch.textContent =
                "";

            passwordMatch.className =
                "password-match";

            return false;

        }


        if (pass === confirm) {

            passwordMatch.textContent =
                "Passwords match";

            passwordMatch.className =
                "password-match match";

            return true;

        }

        else {

            passwordMatch.textContent =
                "Passwords do not match";

            passwordMatch.className =
                "password-match no-match";

            return false;

        }

    }


    confirmPassword.addEventListener(
        "input",
        checkPasswordMatch
    );


    password.addEventListener(
        "input",
        function () {

            if (
                confirmPassword.value
            ) {

                checkPasswordMatch();

            }

        }
    );


    /* =================================================
       EMAIL VALIDATION
    ================================================= */

    function isValidEmail(
        value
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
            .test(
                value.trim()
            );

    }


    /* =================================================
       NAME VALIDATION
    ================================================= */

    function isValidName(
        value
    ) {

        return /^[A-Za-z\s.'-]{2,50}$/
            .test(
                value.trim()
            );

    }


    /* =================================================
       LOCAL STORAGE
    ================================================= */

    function getUsers() {

        try {

            const users =
                localStorage.getItem(
                    "learn2liveUsers"
                );

            return users
                ? JSON.parse(users)
                : [];

        }

        catch (error) {

            return [];

        }

    }


    function saveUsers(
        users
    ) {

        localStorage.setItem(
            "learn2liveUsers",
            JSON.stringify(users)
        );

    }


    /* =================================================
       PASSWORD HASH
       SHA-256
    ================================================= */

    async function hashPassword(
        passwordValue
    ) {

        const encoder =
            new TextEncoder();

        const data =
            encoder.encode(
                passwordValue
            );

        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-256",
                data
            );

        const hashArray =
            Array.from(
                new Uint8Array(
                    hashBuffer
                )
            );

        return hashArray
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("");

    }


    /* =================================================
       GENERATE USER ID
    ================================================= */

    function generateUserId() {

        return (
            "L2L-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()
        );

    }


    /* =================================================
       CHECK EMAIL IN GOOGLE SHEET
    ================================================= */

    async function checkEmailExists(
        emailValue
    ) {

        try {

            const response =
                await fetch(
                    API_URL +
                    "?type=users&_=" +
                    Date.now(),
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {
                return false;
            }


            const result =
                await response.json();


            const users =
                Array.isArray(
                    result
                )
                    ? result
                    : (
                        result.users ||
                        []
                    );


            return users.some(
                function (user) {

                    return (
                        String(
                            user.email ||
                            user.Email ||
                            user["Email Address"] ||
                            ""
                        )
                            .trim()
                            .toLowerCase() ===
                        emailValue
                    );

                }
            );

        }

        catch (error) {

            console.error(
                "Email check failed:",
                error
            );

            return false;

        }

    }


    /* =================================================
       SAVE USER TO GOOGLE SHEET
    ================================================= */

    async function saveUserToServer(
        user
    ) {

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
                        JSON.stringify({

                            action: "login",

                            userId:
                                user.id,

                            name:
                                user.name,

                            email:
                                user.email,

                            username:
                                user.username,

                            passwordHash:
                                user.passwordHash

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server connection failed."
            );

        }


        const result =
            await response.json();


        if (
            result &&
            result.success === false
        ) {

            throw new Error(
                result.error ||
                "Unable to save account."
            );

        }


        return result;

    }


    /* =================================================
       SET CURRENT USER
    ================================================= */

    function setCurrentUser(
        user
    ) {

        const cleanUser = {

            id:
                user.id,

            name:
                user.name,

            email:
                user.email,

            username:
                user.username,

            passwordHash:
                user.passwordHash,

            createdAt:
                user.createdAt

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(
                cleanUser
            )
        );


        localStorage.setItem(
            "learn2liveUser",
            JSON.stringify(
                cleanUser
            )
        );


        localStorage.setItem(
            "user",
            JSON.stringify(
                cleanUser
            )
        );


        localStorage.setItem(
            "currentUserId",
            String(
                user.id
            )
        );


        localStorage.setItem(
            "learn2liveActive",
            "true"
        );

    }


    /* =================================================
       RESET FORM UI
    ================================================= */

    function resetFormUI() {

        registerForm.reset();


        strengthFill.className =
            "strength-fill";

        strengthFill.style.width =
            "0%";


        strengthText.textContent =
            "Enter a password";

        strengthText.style.color =
            "#999";


        passwordMatch.textContent =
            "";

        passwordMatch.className =
            "password-match";


        ruleLength.classList.remove(
            "valid"
        );

        ruleUpper.classList.remove(
            "valid"
        );

        ruleNumber.classList.remove(
            "valid"
        );

        ruleSpecial.classList.remove(
            "valid"
        );

    }


    /* =================================================
       FORM SUBMIT
    ================================================= */

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearErrors();


            const name =
                fullName.value.trim();

            const emailValue =
                email.value
                    .trim()
                    .toLowerCase();

            const passwordValue =
                password.value;

            const confirmValue =
                confirmPassword.value;


            /* -----------------------------------------
               NAME
            ----------------------------------------- */

            if (!name) {

                nameError.textContent =
                    "Please enter your name.";

                fullName.style.borderColor =
                    "#ef4444";

                showToast(
                    "Please enter your name.",
                    "error"
                );

                fullName.focus();

                return;

            }


            if (!isValidName(name)) {

                nameError.textContent =
                    "Please enter a valid name.";

                fullName.style.borderColor =
                    "#ef4444";

                showToast(
                    "Please enter a valid name.",
                    "error"
                );

                fullName.focus();

                return;

            }


            /* -----------------------------------------
               EMAIL
            ----------------------------------------- */

            if (!emailValue) {

                emailError.textContent =
                    "Please enter your email address.";

                email.style.borderColor =
                    "#ef4444";

                showToast(
                    "Please enter your email address.",
                    "error"
                );

                email.focus();

                return;

            }


            if (!isValidEmail(emailValue)) {

                emailError.textContent =
                    "Please enter a valid email address.";

                email.style.borderColor =
                    "#ef4444";

                showToast(
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return;

            }


            /* -----------------------------------------
               PASSWORD
            ----------------------------------------- */

            const rules =
                checkPasswordRules();


            const passwordValid =
                rules.lengthValid &&
                rules.upperValid &&
                rules.numberValid &&
                rules.specialValid;


            if (!passwordValue) {

                showToast(
                    "Please create a password.",
                    "error"
                );

                password.focus();

                return;

            }


            if (!passwordValid) {

                showToast(
                    "Please complete all password requirements.",
                    "error"
                );

                password.focus();

                return;

            }


            /* -----------------------------------------
               CONFIRM PASSWORD
            ----------------------------------------- */

            if (!confirmValue) {

                showToast(
                    "Please confirm your password.",
                    "error"
                );

                confirmPassword.focus();

                return;

            }


            if (
                passwordValue !==
                confirmValue
            ) {

                showToast(
                    "Passwords do not match.",
                    "error"
                );

                confirmPassword.focus();

                return;

            }


            /* -----------------------------------------
               TERMS
            ----------------------------------------- */

            if (!terms.checked) {

                showToast(
                    "Please agree to the Terms & Conditions and Privacy Policy.",
                    "warning"
                );

                return;

            }


            /* -----------------------------------------
               LOADING
            ----------------------------------------- */

            if (loadingOverlay) {
                loadingOverlay.classList.add(
                    "show"
                );
            }


            try {

                /* =====================================
                   CHECK GOOGLE SHEET
                ===================================== */

                const serverExists =
                    await checkEmailExists(
                        emailValue
                    );


                if (serverExists) {

                    if (loadingOverlay) {
                        loadingOverlay.classList.remove(
                            "show"
                        );
                    }

                    emailError.textContent =
                        "An account with this email already exists.";

                    email.style.borderColor =
                        "#ef4444";

                    showToast(
                        "An account with this email already exists.",
                        "error"
                    );

                    email.focus();

                    return;

                }


                /* =====================================
                   CHECK LOCAL USERS
                ===================================== */

                const users =
                    getUsers();


                const localExists =
                    users.some(
                        function (user) {

                            return (
                                user.email &&
                                user.email
                                    .toLowerCase() ===
                                emailValue
                            );

                        }
                    );


                if (localExists) {

                    if (loadingOverlay) {
                        loadingOverlay.classList.remove(
                            "show"
                        );
                    }

                    emailError.textContent =
                        "An account with this email already exists.";

                    email.style.borderColor =
                        "#ef4444";

                    showToast(
                        "An account with this email already exists.",
                        "error"
                    );

                    email.focus();

                    return;

                }


                /* =====================================
                   HASH PASSWORD
                ===================================== */

                const passwordHash =
                    await hashPassword(
                        passwordValue
                    );


                /* =====================================
                   CREATE USER
                ===================================== */

                const createdAt =
                    new Date().toISOString();


                const newUser = {

                    id:
                        generateUserId(),

                    name:
                        name,

                    email:
                        emailValue,

                    username:
                        emailValue,

                    passwordHash:
                        passwordHash,

                    createdAt:
                        createdAt

                };


                /* =====================================
                   SAVE TO GOOGLE SHEET
                ===================================== */

                await saveUserToServer(
                    newUser
                );


                /* =====================================
                   SAVE LOCAL USER
                ===================================== */

                users.push(
                    newUser
                );

                saveUsers(
                    users
                );


                /* =====================================
                   LOGIN IMMEDIATELY
                ===================================== */

                setCurrentUser(
                    newUser
                );

                if (window.L2L_Auth) {
                    window.L2L_Auth.setSession(newUser);
                }


                /* =====================================
                   SUCCESS
                ===================================== */

                if (loadingOverlay) {

                    loadingOverlay.classList.remove(
                        "show"
                    );

                }


                showToast(
                    "Account created successfully!",
                    "success"
                );


                resetFormUI();


                /* =====================================
                   GO DIRECTLY TO DASHBOARD
                ===================================== */

                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    900
                );

            }

            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                if (loadingOverlay) {

                    loadingOverlay.classList.remove(
                        "show"
                    );

                }


                showToast(
                    error.message ||
                    "Unable to create account. Please try again.",
                    "error"
                );

            }

        }
    );


    /* =================================================
       REMOVE ERROR WHILE TYPING
    ================================================= */

    fullName.addEventListener(
        "input",
        function () {

            nameError.textContent =
                "";

            fullName.style.borderColor =
                "";

        }
    );


    email.addEventListener(
        "input",
        function () {

            emailError.textContent =
                "";

            email.style.borderColor =
                "";

        }
    );

});