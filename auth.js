/* =====================================================
   LEARN2LIVE - SHARED AUTH / SESSION MODULE (auth.js)
   - Single source of truth for "who is logged in"
   - Full logout (clears EVERY session key, never progress)
   - Page guard (redirects to login if not logged in)
   - Handles browser Back button + multi-tab changes
===================================================== */
(function () {
    "use strict";

    /* =====================================================
       PER-USER STORAGE LAYER  (fixes data leaking between users)
       These keys used to be GLOBAL (same for every account on a
       browser). They are now transparently stored as
       "<key>::<email>", so each user only ever sees his own data.
       No other file needs to change.
    ===================================================== */
    var _get = Storage.prototype.getItem;
    var _set = Storage.prototype.setItem;
    var _rem = Storage.prototype.removeItem;

    var USER_SCOPED_KEYS = {
        "profilePhoto": 1, "userPhoto": 1, "photo": 1, "avatar": 1,
        "profile_image": 1,
        "learn2liveCompleted": 1, "learn2liveCompletions": 1,
        "learn2liveCategoriesCompleted": 1,
        "quizCompletions": 1, "completedTopics": 1,
        "selectedCertificate": 1
    };

    function rawEmail() {
        try { return String(_get.call(localStorage, "loggedInEmail") || "").trim().toLowerCase(); }
        catch (e) { return ""; }
    }
    function scoped(k) {
        var e = rawEmail();
        return e ? k + "::" + e : null;
    }

    Storage.prototype.getItem = function (k) {
        if (this === localStorage && USER_SCOPED_KEYS[k] === 1) {
            var nk = scoped(k);
            return nk ? _get.call(this, nk) : null;
        }
        return _get.call(this, k);
    };
    Storage.prototype.setItem = function (k, v) {
        if (this === localStorage && USER_SCOPED_KEYS[k] === 1) {
            var nk = scoped(k);
            if (nk) _set.call(this, nk, v);
            return;
        }
        _set.call(this, k, v);
        if (this === localStorage && (k === "currentUser" || k === "learn2liveUser" || k === "user")) {
            try { persistProfile(JSON.parse(v)); } catch (e) {}
        }
    };
    Storage.prototype.removeItem = function (k) {
        if (this === localStorage && USER_SCOPED_KEYS[k] === 1) {
            var nk = scoped(k);
            if (nk) _rem.call(this, nk);
            return;
        }
        _rem.call(this, k);
    };

    /* one-time clean up of the OLD shared (leaky) keys */
    (function purgeLegacyGlobals() {
        try {
            Object.keys(USER_SCOPED_KEYS).forEach(function (k) {
                if (_get.call(localStorage, k) !== null) _rem.call(localStorage, k);
            });
        } catch (e) {}
    })();

    /* =====================================================
       PER-USER PROFILE  (name / photo / bio / username)
       Saved under "l2l_profile_<email>" so the photo and details
       a user uploads come back when HE logs in again - and are
       never shown to anybody else.
    ===================================================== */
    var PROFILE_FIELDS = ["name", "fullName", "username", "bio", "photo", "profilePhoto"];

    function profileKey(email) { return "l2l_profile_" + String(email || "").trim().toLowerCase(); }

    function loadProfile(email) {
        try { return JSON.parse(_get.call(localStorage, profileKey(email)) || "{}") || {}; }
        catch (e) { return {}; }
    }

    function persistProfile(user) {
        if (!user || typeof user !== "object" || !user.email) return;
        var email = String(user.email).trim().toLowerCase();
        if (!email || email !== rawEmail()) return;          /* only the ACTIVE user */
        var saved = loadProfile(email);
        PROFILE_FIELDS.forEach(function (f) {
            if (user[f] !== undefined && user[f] !== null && String(user[f]) !== "") saved[f] = user[f];
        });
        try { _set.call(localStorage, profileKey(email), JSON.stringify(saved)); } catch (e) {}
    }

    function applyProfile(obj, email) {
        var saved = loadProfile(email);
        PROFILE_FIELDS.forEach(function (f) {
            if (saved[f] !== undefined && saved[f] !== "") obj[f] = saved[f];
        });
        return obj;
    }


    var PUBLIC_PAGES = ["index.html", "home.html", "login.html", "register.html", "about.html", "contact.html", "forgot-password.html", ""];
    var SKIP_GUARD = [];
    /* ADMIN PAGE PROTECTION: put the admin email(s) here, e.g. ["you@gmail.com"].
       If the list is empty, any logged-in user can open admin.html (so fill it!). */
    var ADMIN_PAGES = ["admin.html"];
    var ADMIN_EMAILS = [];
    var LOGIN_PAGE = "login.html";

    /* every key that identifies the ACTIVE user (never progress data) */
    var SESSION_KEYS = [
        "loggedInEmail", "currentUser", "learn2liveUser", "user",
        "currentUserId", "currentLearn2LiveUser",
        "learn2liveLoggedIn", "learn2liveActive",
        "loggedInUser", "learn2liveCurrentUser", "userSession"
    ];

    function pageName() {
        var p = decodeURIComponent(location.pathname.split("/").pop() || "");
        return p;
    }

    function norm(v) { return String(v || "").trim().toLowerCase(); }

    function getEmail() {
        try { return norm(localStorage.getItem("loggedInEmail")); }
        catch (e) { return ""; }
    }

    function isLoggedIn() { return getEmail() !== ""; }

    /* remove ONLY session keys - progress (per-email) is kept */
    function clearSession() {
        try {
            SESSION_KEYS.forEach(function (k) { localStorage.removeItem(k); });
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);
                if (key && /^learn2live_user_.+_active$/.test(key)) {
                    localStorage.removeItem(key);
                }
            }
        } catch (e) {}
        try { sessionStorage.clear(); } catch (e) {}
    }

    /* call after successful login / register */
    function setSession(user) {
        var email = norm(user && user.email);
        if (!email) throw new Error("Invalid account email.");
        clearSession();
        var clean = {
            id: (user.id || user.userId || ""),
            name: user.name || "",
            email: email,
            username: user.username || "",
            createdAt: user.createdAt || "",
            lastLogin: new Date().toISOString()
        };
        /* bring back THIS user's saved photo / bio / edited name (if any) */
        applyProfile(clean, email);
        _set.call(localStorage, "loggedInEmail", email);
        localStorage.setItem("currentUser", JSON.stringify(clean));
        localStorage.setItem("learn2liveUser", JSON.stringify(clean));
        localStorage.setItem("user", JSON.stringify(clean));
        localStorage.setItem("currentUserId", String(clean.id));
        localStorage.setItem("learn2liveLoggedIn", "true");
        localStorage.setItem("learn2liveActive", "true");
        localStorage.setItem("currentLearn2LiveUser", JSON.stringify({
            id: clean.id, name: clean.name, email: clean.email
        }));
    }

    function logout() {
        clearSession();
        location.replace(LOGIN_PAGE);   /* replace => Back button can't return */
    }

    /* session must be consistent: currentUser email == loggedInEmail */
    function sessionConsistent() {
        try {
            var raw = localStorage.getItem("currentUser");
            if (!raw) return true;
            var u = JSON.parse(raw);
            return !u || !u.email || norm(u.email) === getEmail();
        } catch (e) { return true; }
    }

    function guard() {
        var page = pageName();
        if (PUBLIC_PAGES.indexOf(page) !== -1) return;
        if (SKIP_GUARD.indexOf(page) !== -1) return;
        if (ADMIN_PAGES.indexOf(page) !== -1 && ADMIN_EMAILS.length &&
            ADMIN_EMAILS.map(norm).indexOf(getEmail()) === -1) {
            location.replace(LOGIN_PAGE);
            return;
        }
        if (!isLoggedIn() || !sessionConsistent()) {
            clearSession();
            location.replace(LOGIN_PAGE);
        }
    }

    /* hide page until verified so no previous user's data flashes */
    var page0 = pageName();
    if (PUBLIC_PAGES.indexOf(page0) === -1 && SKIP_GUARD.indexOf(page0) === -1) {
        if (!isLoggedIn()) {
            document.documentElement.style.visibility = "hidden";
        }
    }
    guard();

    /* make sure the active user's saved photo/details are in the session objects */
    (function restoreProfile() {
        try {
            var e = rawEmail();
            if (!e) return;
            ["currentUser", "learn2liveUser", "user"].forEach(function (k) {
                var raw = _get.call(localStorage, k);
                if (!raw) return;
                var u = JSON.parse(raw);
                if (u && String(u.email || "").toLowerCase() === e) {
                    var before = JSON.stringify(u);
                    applyProfile(u, e);
                    if (JSON.stringify(u) !== before) _set.call(localStorage, k, JSON.stringify(u));
                }
            });
        } catch (err) {}
    })();

    /* Back/forward cache: page restored from memory after logout */
    window.addEventListener("pageshow", function (e) {
        if (e.persisted) {
            guard();
            if (isLoggedIn()) { location.reload(); }
        }
    });

    /* another tab logged in as someone else / logged out */
    var startEmail = getEmail();
    window.addEventListener("storage", function (e) {
        if (e.key === "loggedInEmail" || e.key === null) {
            if (getEmail() !== startEmail) {
                if (PUBLIC_PAGES.indexOf(pageName()) !== -1) return;
                if (isLoggedIn()) { location.reload(); } else { guard(); }
            }
        }
    });

    /* ANY "confirm logout" button on ANY page does the full logout.
       Capture phase => runs before page-specific partial handlers. */
    document.addEventListener("click", function (e) {
        var t = e.target && e.target.closest
            ? e.target.closest("#confirmLogout") : null;
        if (t) {
            e.preventDefault();
            e.stopImmediatePropagation();
            logout();
        }
    }, true);

    window.L2L_Auth = {
        getProfile: function () { return loadProfile(rawEmail()); },
        getEmail: getEmail,
        isLoggedIn: isLoggedIn,
        setSession: setSession,
        clearSession: clearSession,
        logout: logout
    };
})();
