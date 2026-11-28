/**
 * TigerTix — auth-modal.js
 * Sign In / Sign Up modal logic + navbar auth-state management (localStorage)
 *
 * HOW TO CONNECT TO A REAL BACKEND LATER:
 *  1. Replace the `TigerAuth.login(name, email)` call in the form-submit handlers
 *     with your real API call; call TigerAuth.login() on success.
 *  2. Replace `TigerAuth.logout()` with an API sign-out request, then call it.
 *  3. The localStorage key is 'tigertix_user' (JSON: { name, email }).
 *     Swap localStorage for a secure token / session cookie as needed.
 */
(function () {
  'use strict';

  /* =====================================================================
     AUTH STATE — localStorage façade
     ===================================================================== */
  var TigerAuth = {
    KEY: 'tigertix_user',

    /** Returns the stored user object { name, email } or null */
    getUser: function () {
      try {
        var raw = localStorage.getItem(this.KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },

    /** Persist a signed-in user and refresh the navbar */
    login: function (name, email) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify({ name: name, email: email }));
      } catch (e) {}
      updateNavbar();
    },

    /** Clear the stored user and refresh the navbar */
    logout: function () {
      try { localStorage.removeItem(this.KEY); } catch (e) {}
      updateNavbar();
    }
  };

  /* Expose globally so other pages and scripts can check auth and trigger modal */
  TigerAuth.open = openModal;
  TigerAuth.close = closeModal;
  window.TigerAuth = TigerAuth;

  /* =====================================================================
     NAVBAR — toggle between guest (Sign In btn) and signed-in (profile pill)
     ===================================================================== */
  function updateNavbar() {
    var user = TigerAuth.getUser();

    /* Every page has: id="navSignInBtn"  (guest)  and  id="navUserArea" (signed-in) */
    var signInBtn  = document.getElementById('navSignInBtn');
    var userArea   = document.getElementById('navUserArea');
    var greetEl    = document.getElementById('navGreeting');

    if (!signInBtn || !userArea) return;

    if (user) {
      /* Show user pill, hide Sign In */
      var firstName = (user.name || 'User').split(' ')[0];
      if (greetEl) greetEl.textContent = 'Hi, ' + firstName + '!';
      signInBtn.style.display = 'none';
      userArea.style.display  = 'flex';
    } else {
      /* Show Sign In, hide user pill */
      signInBtn.style.display = '';
      userArea.style.display  = 'none';
    }
  }

  /* =====================================================================
     PROFILE DROPDOWN toggle
     ===================================================================== */
  function setupDropdown() {
    var trigger  = document.getElementById('navUserArea');
    var dropdown = document.getElementById('navDropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function () {
      dropdown.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });

    dropdown.addEventListener('click', function (e) { e.stopPropagation(); });

    /* Sign-Out link inside the dropdown */
    var signOutLink = document.getElementById('navSignOut');
    if (signOutLink) {
      signOutLink.addEventListener('click', function (e) {
        e.preventDefault();
        TigerAuth.logout();
        dropdown.classList.remove('is-open');
      });
    }
  }

  /* =====================================================================
     MODAL HELPERS
     ===================================================================== */
  var HOLE_COUNT = 16;

  function buildHoles(el) {
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < HOLE_COUNT; i++) {
      var d = document.createElement('div');
      d.className = 'auth-film-hole';
      el.appendChild(d);
    }
  }

  function resetForms() {
    var ids = [
      'authSignupName', 'authSignupEmail', 'authSignupPwd', 'authSignupConfirm',
      'authLoginEmail', 'authLoginPwd', 'authLoginRemember'
    ];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.type === 'checkbox') { el.checked = true; }
      else { el.value = ''; }
    });
    ['authRuleLen', 'authRuleUpper', 'authRuleNum', 'authRuleSpecial'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('met');
    });
  }

  function switchTab(tab) {
    var tabSignup  = document.getElementById('authTabSignup');
    var tabLogin   = document.getElementById('authTabLogin');
    var viewSignup = document.getElementById('authViewSignup');
    var viewLogin  = document.getElementById('authViewLogin');
    if (!tabSignup || !tabLogin || !viewSignup || !viewLogin) return;
    resetForms();
    if (tab === 'signup') {
      tabSignup.classList.add('active');    tabLogin.classList.remove('active');
      viewSignup.classList.add('active');   viewLogin.classList.remove('active');
    } else {
      tabLogin.classList.add('active');     tabSignup.classList.remove('active');
      viewLogin.classList.add('active');    viewSignup.classList.remove('active');
    }
  }

  function openModal(tab) {
    var overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    resetForms();
    switchTab(tab || 'signup');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetForms();
  }

  /* Live password validation */
  function validatePwd(val) {
    var rules = {
      authRuleLen:     val.length >= 8,
      authRuleUpper:   /[A-Z]/.test(val),
      authRuleNum:     /[0-9]/.test(val),
      authRuleSpecial: /[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|`~]/.test(val)
    };
    Object.keys(rules).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('met', rules[id]);
    });
  }

  /* =====================================================================
     WIRE EVERYTHING
     ===================================================================== */
  
  // Show / Hide toggle for password & CVC fields (Event Delegation for reliability)
  function initPasswordToggles() {
    if (window._pwTogglesDelegated) return;
    window._pwTogglesDelegated = true;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.pw-toggle-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      var wrap = btn.closest('.pw-field-wrap');
      if (!wrap) return;

      var input = wrap.querySelector('input');
      if (!input) return;

      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      var eyeOn = btn.querySelector('.eye-icon');
      var eyeOff = btn.querySelector('.eye-off-icon');

      if (eyeOn && eyeOff) {
        eyeOn.style.display = isPassword ? 'none' : '';
        eyeOff.style.display = isPassword ? '' : 'none';
      }
    });
  }

  function setup() {
    initPasswordToggles();
    var overlay    = document.getElementById('authOverlay');
    var closeBtn   = document.getElementById('authCloseBtn');
    var tabSignup  = document.getElementById('authTabSignup');
    var tabLogin   = document.getElementById('authTabLogin');
    var toLogin    = document.getElementById('authToLogin');
    var toSignup   = document.getElementById('authToSignup');
    var pwdInput   = document.getElementById('authSignupPwd');
    var formSignup = document.getElementById('authFormSignup');
    var formLogin  = document.getElementById('authFormLogin');
    var signInBtn  = document.getElementById('navSignInBtn');

    /* ---- Apply stored auth state immediately ---- */
    updateNavbar();
    setupDropdown();

    /* ---- Sign In button in navbar ---- */
    if (signInBtn) {
      signInBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('login');
      });
    }

    if (!overlay) return;

    buildHoles(document.getElementById('authFilmLeft'));
    buildHoles(document.getElementById('authFilmRight'));

    /* Legacy: catch any inline Sign In buttons (e.g. hero slides) */
    document.querySelectorAll('.btn-outline').forEach(function (btn) {
      if (btn.id === 'navSignInBtn') return; /* already wired above */
      if (btn.textContent.trim() === 'Sign In') {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          openModal('login');
        });
      }
    });

    /* Close via button, backdrop, Escape */
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    /* Tab switches */
    if (tabSignup) tabSignup.addEventListener('click', function () { switchTab('signup'); });
    if (tabLogin)  tabLogin.addEventListener('click',  function () { switchTab('login');  });
    if (toLogin)   toLogin.addEventListener('click',   function () { switchTab('login');  });
    if (toSignup)  toSignup.addEventListener('click',  function () { switchTab('signup'); });

    /* Live password rules */
    if (pwdInput) pwdInput.addEventListener('input', function () { validatePwd(pwdInput.value); });

    /* ---- Sign Up form submit ---- */
    if (formSignup) {
      formSignup.addEventListener('submit', function (e) {
        e.preventDefault();
        var name  = (document.getElementById('authSignupName').value  || '').trim() || 'User';
        var email = (document.getElementById('authSignupEmail').value || '').trim() || 'user@email.com';
        /* ↑ Replace with real API call. On success → TigerAuth.login(name, email) */
        TigerAuth.login(name, email);
        closeModal();
      });
    }

    /* ---- Log In form submit ---- */
    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('authLoginEmail').value || '').trim() || 'user@email.com';
        /* ↑ Replace with real API call. On success → TigerAuth.login(name, email) */
        /* Derive a display name from email prefix until backend is ready */
        var name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        TigerAuth.login(name, email);
        closeModal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
