/**
 * TigerTix — auth-modal.js
 * Sign In / Sign Up modal logic
 */
(function () {
  'use strict';

  var HOLE_COUNT = 16;

  /* ---- Build filmstrip holes ---- */
  function buildHoles(el) {
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < HOLE_COUNT; i++) {
      var d = document.createElement('div');
      d.className = 'auth-film-hole';
      el.appendChild(d);
    }
  }

  /* ---- Reset all form inputs + checklist ---- */
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

  /* ---- Switch between Sign Up and Log In views ---- */
  function switchTab(tab) {
    var tabSignup  = document.getElementById('authTabSignup');
    var tabLogin   = document.getElementById('authTabLogin');
    var viewSignup = document.getElementById('authViewSignup');
    var viewLogin  = document.getElementById('authViewLogin');

    if (!tabSignup || !tabLogin || !viewSignup || !viewLogin) return;

    resetForms();

    if (tab === 'signup') {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      viewSignup.classList.add('active');
      viewLogin.classList.remove('active');
    } else {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      viewLogin.classList.add('active');
      viewSignup.classList.remove('active');
    }
  }

  /* ---- Open / Close ---- */
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

  /* ---- Live password validation ---- */
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

  /* ---- Wire events ---- */
  function setup() {
    var overlay    = document.getElementById('authOverlay');
    var closeBtn   = document.getElementById('authCloseBtn');
    var tabSignup  = document.getElementById('authTabSignup');
    var tabLogin   = document.getElementById('authTabLogin');
    var toLogin    = document.getElementById('authToLogin');
    var toSignup   = document.getElementById('authToSignup');
    var pwdInput   = document.getElementById('authSignupPwd');
    var formSignup = document.getElementById('authFormSignup');
    var formLogin  = document.getElementById('authFormLogin');

    if (!overlay) return;

    /* Build filmstrip holes */
    buildHoles(document.getElementById('authFilmLeft'));
    buildHoles(document.getElementById('authFilmRight'));

    /* Sign In button(s) in nav — open login tab */
    document.querySelectorAll('.btn-outline').forEach(function (btn) {
      if (btn.textContent.trim() === 'Sign In') {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          openModal('login');
        });
      }
    });

    /* Close via button, backdrop, Escape */
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    /* Tab switches */
    if (tabSignup) tabSignup.addEventListener('click', function () { switchTab('signup'); });
    if (tabLogin)  tabLogin.addEventListener('click',  function () { switchTab('login'); });
    if (toLogin)   toLogin.addEventListener('click',   function () { switchTab('login'); });
    if (toSignup)  toSignup.addEventListener('click',  function () { switchTab('signup'); });

    /* Live password rules */
    if (pwdInput) {
      pwdInput.addEventListener('input', function () {
        validatePwd(pwdInput.value);
      });
    }

    /* Form submissions (front-end only) */
    if (formSignup) {
      formSignup.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('authSignupName').value || '').trim() || 'User';
        alert('Account created! Welcome to TigerTix, ' + name + '.');
        closeModal();
      });
    }

    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('authLoginEmail').value || '').trim() || 'user@email.com';
        alert('Welcome back! Signed in as ' + email + '.');
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
