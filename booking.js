/**
 * TigerTix — booking.js
 * Handles all interactivity for the 5-step booking flow on booking.html
 */

(function () {
  'use strict';

  /* =========================================================
     MOVIE DATA  — populate page from URL ?movie=
     ========================================================= */
  var MOVIES = {
    '2 Valid IDs': {
      title: '2 Valid IDs',
      badge: 'PG',
      meta: 'Drama \u2022 1hr 33m \u2022 Released October 14 2026',
      desc: 'Sylvia, a poor farmer, needs two valid IDs to claim money sent for her husband\'s medical care. But she doesn\'t have a single one. A quietly gripping drama about faith, identity and humanity.',
      cast: 'Cast: Joey Marquez, Pokwang, Zalijan Jaranilla, Meryl Soriano, Joem Bascon',
      poster: 'images/2-valid-ids.jpeg',
      themeBg: '#2a221b',
      trailerTitle: '2 Valid IDs \u2022 Official Trailer',
      trailerDuration: '01:45',
      priceRegular: 350,
      priceDirectors: 600,
      priceScreenX: 450
    },
    'The Odyssey': {
      title: 'The Odyssey',
      badge: 'PG',
      meta: 'Action \u2022 2hrs 53m \u2022 Released July 15 2026',
      desc: 'After the Trojan War, Odysseus faces a dangerous voyage back to Ithaca, meeting creatures like the Cyclops Polyphemus, Sirens, and Calypso along the way.',
      cast: 'Cast: Tom Holland, Robert Pattinson, Matt Damon, Anne Hathaway',
      poster: 'images/the-odyssey.jpg',
      themeBg: '#102538',
      trailerTitle: 'The Odyssey \u2022 Official Trailer',
      trailerDuration: '01:20',
      priceRegular: 350,
      priceScreenX: 450,
      priceDirectors: 600
    },
    'Toy Story 5': {
      title: 'Toy Story 5',
      badge: 'PG',
      meta: 'Animation \u2022 1hr 42m \u2022 Released June 17 2026',
      desc: 'Woody, Buzz, Jessie and the rest of the gang\'s jobs are challenged when they\'re introduced to electronics, a new threat to playtime.',
      cast: 'Cast: Tom Hanks, Tim Allen, Joan Cusack',
      poster: 'images/toystory-5.jpg',
      themeBg: '#1c341e',
      trailerTitle: 'Toy Story 5 \u2022 Official Trailer',
      trailerDuration: '01:30',
      priceRegular: 350,
      priceDirectors: 600,
      priceScreenX: 450
    }
  };

  var DEFAULT_MOVIE = '2 Valid IDs';

  /* ---- Read URL param ?movie=... ---- */
  function getUrlParam(key) {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get(key) || '';
    } catch (e) {
      var match = window.location.search.match(new RegExp('[?&]' + key + '=([^&]+)'));
      return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
    }
  }

  /* ---- Populate movie hero from data ---- */
  function populateMovieHero() {
    var key = getUrlParam('movie') || DEFAULT_MOVIE;
    var movie = MOVIES[key] || MOVIES[DEFAULT_MOVIE];

    var titleEl    = document.getElementById('bkMovieTitle');
    var metaEl     = document.getElementById('bkMovieMeta');
    var descEl     = document.getElementById('bkMovieDesc');
    var castEl     = document.getElementById('bkMovieCast');
    var posterImg  = document.getElementById('bkPosterImgTag');
    var bgEl       = document.getElementById('bkMovieBg');

    if (titleEl) titleEl.innerHTML = escapeHtml(movie.title) + ' <span class="badge">' + escapeHtml(movie.badge) + '</span>';
    if (metaEl)  metaEl.textContent = movie.meta;
    if (descEl)  descEl.textContent = movie.desc;
    if (castEl)  castEl.innerHTML = '<strong>Cast:</strong> ' + escapeHtml(movie.cast.replace('Cast: ', ''));
    if (posterImg) {
      posterImg.src = movie.poster;
      posterImg.alt = movie.title + ' poster';
    }
    if (bgEl && movie.themeBg) {
      bgEl.style.backgroundColor = movie.themeBg;
    }

    // Store current movie globally for order summary
    window._bkMovie = movie;
    window._bkMovieKey = key;
  }

  /* =========================================================
     STEP MANAGER
     ========================================================= */
  var currentStep = 1;
  var TOTAL_STEPS = 5;

  // State
  var state = {
    cinema: 'Glorietta 4',
    cinemaAddr: 'Ayala Center, Makati City',
    date: 'Today',
    day: '29',
    month: 'Nov',
    dayName: 'Sun',
    format: 'Regular',
    time: '12:10 PM',
    seats: [],
    name: '',
    email: '',
    phone: '',
    payMethod: 'gcash',
    hasDiscount: false,
    ticketPrice: 350,
    refCode: ''
  };

  function goToStep(n) {
    if (n < 1 || n > TOTAL_STEPS) return;

    var prevStep = currentStep;

    // Hide all panels
    document.querySelectorAll('.bk-panel').forEach(function (p) {
      p.classList.remove('is-active');
    });

    // Update steps
    document.querySelectorAll('.bk-step').forEach(function (s) {
      var sn = parseInt(s.getAttribute('data-step'), 10);
      s.classList.remove('is-active', 'is-done');
      var numEl = s.querySelector('.bk-step-num');

      if (sn === n) {
        s.classList.add('is-active');
        if (numEl) {
          numEl.textContent = sn;
          // Apply boop/pop animation ONLY to the newly activated step
          if (prevStep !== n) {
            numEl.classList.remove('is-booping');
            void numEl.offsetWidth; // trigger reflow
            numEl.classList.add('is-booping');
          }
        }
      } else if (sn < n) {
        s.classList.add('is-done');
        if (numEl) {
          numEl.textContent = sn;
          // Previous finished steps remain static without animation
          numEl.classList.remove('is-booping');
        }
      } else {
        if (numEl) {
          numEl.textContent = sn;
          numEl.classList.remove('is-booping');
        }
      }
    });

    // Update arrows color if previous steps finished
    document.querySelectorAll('.bk-step-arrow').forEach(function (arr) {
      var afterStep = parseInt(arr.getAttribute('data-after-step'), 10);
      if (afterStep < n) {
        arr.classList.add('is-done');
      } else {
        arr.classList.remove('is-done');
      }
    });

    // Show panel
    var panel = document.getElementById('bkPanel' + n);
    if (panel) panel.classList.add('is-active');

    if (n === 2) {
      requestAnimationFrame(function () {
        updateFormatGlider();
      });
      setTimeout(function () {
        updateFormatGlider();
      }, 50);
    }

    if (n === 3) {
      var s3info = document.getElementById('bkStep3Info');
      if (s3info) {
        var dayPart = (state.dayName ? state.dayName + ' ' : '') + state.day + ' ' + (state.month || 'Nov');
        s3info.textContent = state.cinema + ' \u2022 ' + state.format + ' \u2022 ' + dayPart + ' \u2022 ' + state.time;
      }
    }

    if (n === 4) {
      updateOrderSummary();
    }

    currentStep = n;
    updateBottomBar();

    // Scroll to top of flow section
    var flowSection = document.getElementById('bkFlowSection');
    if (flowSection) {
      flowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateBottomBar() {
    var bar = document.getElementById('bkBottomBar');
    var backBtn = document.getElementById('bkBackBtn');
    var continueBtn = document.getElementById('bkContinueBtn');
    var selLabel = document.getElementById('bkSelVal');

    if (!bar) return;

    // Step 5: hide floating bar (e-ticket step has own layout)
    if (currentStep === 5) {
      bar.style.display = 'none';
      return;
    }

    // Change mode: bar is already visible with change layer showing — don't touch it
    if (changeMode) return;

    bar.style.display = 'flex';
    bar.classList.remove('is-done');

    // Back button visibility
    if (backBtn) {
      backBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    // Continue / Proceed button label
    if (continueBtn) {
      if (currentStep === 3) {
        continueBtn.innerHTML = 'Proceed to Payment <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      } else if (currentStep === 4) {
        if (state.payMethod === 'gcash') {
          continueBtn.innerHTML = 'Continue to GCash <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        } else if (state.payMethod === 'maya') {
          continueBtn.innerHTML = 'Continue to Maya <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        } else if (state.payMethod === 'grabpay') {
          continueBtn.innerHTML = 'Continue to GrabPay <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        } else {
          continueBtn.innerHTML = 'Pay ' + formatCurrency(calcTotal());
        }
      } else {
        continueBtn.innerHTML = 'Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      }
    }

    // Selection info text per step
    if (selLabel) {
      var txt = '';
      if (currentStep === 1) {
        txt = state.cinema + ' \u2022 ' + state.cinemaAddr;
      } else if (currentStep === 2) {
        var dayPart = (state.dayName ? state.dayName + ' ' : '') + state.day + ' ' + (state.month || 'Nov');
        var fmtPart = state.format || 'Regular';
        var timePart = state.time || '12:10 PM';
        txt = dayPart + ' \u2022 ' + fmtPart + ' \u2022 ' + timePart;
      } else if (currentStep === 3) {
        var seatText = state.seats.length > 0 ? (state.seats.length === 1 ? 'Seat ' + state.seats[0] : state.seats.length + ' Seats (' + state.seats.join(', ') + ')') : 'No seat selected';
        var totalText = formatCurrency(state.seats.length * state.ticketPrice);
        txt = state.cinema + ' \u2022 ' + seatText + ' \u2022 ' + totalText;
      } else if (currentStep === 4) {
        var seatsStr = state.seats.length > 0 ? state.seats.join(', ') : 'None';
        txt = state.cinema + ' \u2022 ' + seatsStr + ' \u2022 ' + formatCurrency(calcTotal());
      }
      selLabel.textContent = txt;
    }
  }

  /* =========================================================
     STEP 1 — Cinema selection
     ========================================================= */
  function initStep1() {
    var cards = document.querySelectorAll('.bk-cinema-card');
    var searchInput = document.getElementById('cinemaSearch');
    var cityPills = document.querySelectorAll('.bk-city-pill');
    var countEl = document.getElementById('cinemaCount');

    // Radio: select cinema card
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.remove('is-selected'); });
        card.classList.add('is-selected');

        var radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        state.cinema = card.getAttribute('data-cinema') || '';
        state.cinemaAddr = card.getAttribute('data-addr') || '';
        updateBottomBar();

        // Update step 2 subtitle
        var s2info = document.getElementById('bkStep2Cinema');
        if (s2info) s2info.textContent = 'Cinema: ' + state.cinema;
      });
    });

    // City pills filter
    cityPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        cityPills.forEach(function (p) {
          p.classList.remove('is-active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-selected', 'true');
        filterCinemas(pill.getAttribute('data-city'), searchInput ? searchInput.value : '');
      });
    });

    // Search filter
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var activeCity = document.querySelector('.bk-city-pill.is-active');
        var city = activeCity ? activeCity.getAttribute('data-city') : 'all';
        filterCinemas(city, searchInput.value);
      });
    }

    function filterCinemas(city, query) {
      var visible = 0;
      cards.forEach(function (card) {
        var cardCity = card.getAttribute('data-city') || '';
        var cardName = (card.getAttribute('data-cinema') || '').toLowerCase();
        var cardAddr = (card.getAttribute('data-addr') || '').toLowerCase();
        var q = (query || '').toLowerCase();

        var cityMatch = city === 'all' || cardCity === city;
        var queryMatch = !q || cardName.indexOf(q) > -1 || cardAddr.indexOf(q) > -1 || cardCity.toLowerCase().indexOf(q) > -1;

        var show = cityMatch && queryMatch;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (countEl) countEl.textContent = visible + ' cinema' + (visible !== 1 ? 's' : '');
    }
  }

  /* =========================================================
     STEP 2 — Date & Time
     ========================================================= */
  function updateFormatGlider(activeBtn) {
    var track = document.querySelector('.bk-dt-format-track');
    var glider = document.getElementById('bkFmtGlider');
    if (!track || !glider) return;

    if (!activeBtn) {
      activeBtn = track.querySelector('.bk-dt-fmt-btn.is-active') || track.querySelector('.bk-dt-fmt-btn');
    }
    if (!activeBtn) return;

    var left = activeBtn.offsetLeft;
    var width = activeBtn.offsetWidth;

    glider.style.width = width + 'px';
    glider.style.transform = 'translate3d(' + left + 'px, 0, 0)';
  }

  function initStep2() {
    var dateCards = document.querySelectorAll('.bk-dt-date-card');
    var formatBtns = document.querySelectorAll('.bk-dt-fmt-btn');
    var timeBtns  = document.querySelectorAll('.bk-dt-time-btn');
    var showtimeGroups = document.querySelectorAll('.bk-dt-showtime-group');

    // Date Cards
    dateCards.forEach(function (card) {
      card.addEventListener('click', function () {
        dateCards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        state.date = card.getAttribute('data-date') || '';
        state.day  = card.getAttribute('data-day')  || '';
        state.month = card.getAttribute('data-month') || 'Nov';
        state.dayName = card.getAttribute('data-day-name') || '';
        updateBottomBar();
      });
    });

    // Format Filter Capsule with Smooth Glider Animation
    formatBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        formatBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        // Smoothly glide moving yellow container
        updateFormatGlider(btn);

        var selectedFormat = btn.getAttribute('data-format') || 'all';

        showtimeGroups.forEach(function (group) {
          var grpFormat = group.getAttribute('data-group-format');
          if (selectedFormat === 'all' || grpFormat === selectedFormat) {
            group.classList.remove('is-hidden');
          } else {
            group.classList.add('is-hidden');
          }
        });
      });
    });

    // Initial positioning of glider and on window resize
    setTimeout(function () {
      updateFormatGlider();
    }, 50);

    window.addEventListener('resize', function () {
      updateFormatGlider();
    });

    // Showtime Buttons
    timeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        timeBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        state.format = btn.getAttribute('data-format') || 'Regular';
        state.time   = btn.getAttribute('data-time') || btn.textContent.trim();

        // Set ticket price based on format
        var movie = window._bkMovie || {};
        if (state.format === "Director's Club") {
          state.ticketPrice = movie.priceDirectors || 600;
        } else if (state.format === 'ScreenX') {
          state.ticketPrice = movie.priceScreenX || 450;
        } else {
          state.ticketPrice = movie.priceRegular || 350;
        }

        updateBottomBar();
      });
    });
  }

  /* =========================================================
     STEP 3 — Seat Map
     ========================================================= */
  var ROWS = ['A','B','C','D','E','F'];
  var COLS = 10;
  // Pre-mark unavailable seats matching the reference design
  var RESERVED = [
    'A3',
    'B5', 'B6',
    'D1', 'D2',
    'F4'
  ];

  function buildSeatMap() {
    var map = document.getElementById('bkSeatMap');
    if (!map) return;
    map.innerHTML = '';

    ROWS.forEach(function (row) {
      var rowEl = document.createElement('div');
      rowEl.className = 'bk-seat-row';

      // Row label
      var label = document.createElement('span');
      label.className = 'bk-row-label';
      label.textContent = row;
      rowEl.appendChild(label);

      // Left block (cols 1-5)
      var leftGroup = document.createElement('div');
      leftGroup.className = 'bk-seats-group';
      for (var c = 1; c <= 5; c++) {
        leftGroup.appendChild(makeSeatBtn(row, c));
      }
      rowEl.appendChild(leftGroup);

      // Aisle gap
      var aisle = document.createElement('div');
      aisle.className = 'bk-aisle';
      rowEl.appendChild(aisle);

      // Right block (cols 6-10)
      var rightGroup = document.createElement('div');
      rightGroup.className = 'bk-seats-group';
      for (var c = 6; c <= 10; c++) {
        rightGroup.appendChild(makeSeatBtn(row, c));
      }
      rowEl.appendChild(rightGroup);

      map.appendChild(rowEl);
    });
  }

  function makeSeatBtn(row, col) {
    var seatId = row + col;
    var btn = document.createElement('button');
    btn.className = 'bk-seat';
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-seat', seatId);
    btn.setAttribute('aria-label', 'Seat ' + seatId);
    btn.textContent = col;

    if (RESERVED.indexOf(seatId) > -1) {
      btn.classList.add('reserved');
      btn.setAttribute('aria-disabled', 'true');
      btn.disabled = true;
    } else {
      if (state.seats.indexOf(seatId) > -1) {
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }

      btn.addEventListener('click', function () {
        toggleSeat(seatId, btn);
      });
    }

    return btn;
  }

  function toggleSeat(seatId, btn) {
    var idx = state.seats.indexOf(seatId);
    if (idx > -1) {
      state.seats.splice(idx, 1);
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      if (state.seats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
        return;
      }
      state.seats.push(seatId);
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
    }
    updateSeatSummary();
    updateOrderSummary();
    updateBottomBar();
  }

  function updateSeatSummary() {
    var sumSeats = document.getElementById('sumSeats');
    var sumTotal = document.getElementById('sumTotal');

    if (sumSeats) {
      sumSeats.textContent = state.seats.length > 0 ? state.seats.slice().sort().join(', ') : 'None';
    }
    if (sumTotal) {
      sumTotal.textContent = formatCurrency(state.seats.length * state.ticketPrice);
    }
  }

  function initStep3() {
    updateSeatSummary();
  }

  /* =========================================================
     CHANGE MODE — navigate back from Step 4 to edit a section
     ========================================================= */
  var changeMode = false;
  var changeSectionNames = { '1': 'Cinema', '2': 'Date & Time', '3': 'Seats' };

  function enterChangeMode(targetStep, sectionName) {
    changeMode = true;

    var nameEl = document.getElementById('bkChangeSectionName');
    if (nameEl) nameEl.textContent = sectionName;

    // Swap bar layers: hide normal, show change
    var normal = document.getElementById('bkBarNormal');
    var change = document.getElementById('bkBarChange');
    if (normal) normal.style.display = 'none';
    if (change) change.style.display = 'flex';

    // Keep bottom bar visible (it now shows change-mode controls)
    var bar = document.getElementById('bkBottomBar');
    if (bar) bar.style.display = 'flex';

    goToStep(targetStep);
  }

  function exitChangeMode(returnStep) {
    changeMode = false;

    // Swap bar layers back: show normal, hide change
    var normal = document.getElementById('bkBarNormal');
    var change = document.getElementById('bkBarChange');
    if (normal) normal.style.display = 'flex';
    if (change) change.style.display = 'none';

    // Always return to Step 4
    goToStep(returnStep || 4);
  }

  function initChangeBanner() {
    var cancelBtn = document.getElementById('bkChangeCancelBtn');
    var doneBtn   = document.getElementById('bkChangeDoneBtn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        // "Back" = discard changes and return to Step 4 without saving new state
        exitChangeMode(4);
      });
    }

    if (doneBtn) {
      doneBtn.addEventListener('click', function () {
        // "Done" = keep current selections and return to Step 4
        exitChangeMode(4);
      });
    }
  }

  /* =========================================================
     STEP 4 — Payment / Details (Redesigned matching reference)
     ========================================================= */
  function initStep4() {
    var payBoxes = document.querySelectorAll('.bk-pay-box');
    var changeBtns = document.querySelectorAll('.bk-ts-change-btn');

    // Accordion / selection for payment methods
    payBoxes.forEach(function (box) {
      var header = box.querySelector('.bk-pay-header');
      if (header) {
        header.addEventListener('click', function () {
          payBoxes.forEach(function (b) {
            b.classList.remove('is-active');
            var fields = b.querySelector('.bk-pay-fields');
            if (fields) fields.style.display = 'none';
          });

          box.classList.add('is-active');
          var myFields = box.querySelector('.bk-pay-fields');
          if (myFields) myFields.style.display = 'flex';

          state.payMethod = box.getAttribute('data-method') || 'card';
          updateBottomBar();
        });
      }
    });

    // "Change" buttons inside Ticket Summary — enter change mode
    changeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepTarget = parseInt(btn.getAttribute('data-goto'), 10);
        if (stepTarget >= 1 && stepTarget <= 3) {
          var sectionName = changeSectionNames[String(stepTarget)] || 'selection';
          enterChangeMode(stepTarget, sectionName);
        }
      });
    });

    updateOrderSummary();
  }

  function updateOrderSummary() {
    var key = window._bkMovieKey || DEFAULT_MOVIE;
    var el = function (id) { return document.getElementById(id); };

    // Update Ticket Summary card in Step 4
    if (el('tsMovie')) el('tsMovie').textContent = key;
    if (el('tsCinema')) el('tsCinema').textContent = state.cinema;
    if (el('tsCinemaAddr')) el('tsCinemaAddr').textContent = state.cinemaAddr;

    var dayName = state.dayName || 'Sun';
    var day = state.day || '29';
    var month = state.month || 'Nov';
    var time = state.time || '7:30 PM';
    if (el('tsDateTime')) el('tsDateTime').textContent = dayName + ' ' + day + ' ' + month + ' \u2022 ' + time;
    if (el('tsFormat')) el('tsFormat').textContent = (state.format || 'Regular') + ' \u2022 2D';

    var seatCount = state.seats.length;
    var seatsText = state.seats.length > 0 ? state.seats.slice().sort().join(', ') : 'None selected';
    if (el('tsSeats')) el('tsSeats').textContent = seatsText;
    if (el('tsSeatCalc')) el('tsSeatCalc').textContent = seatCount + ' ticket' + (seatCount !== 1 ? 's' : '') + ' x ' + formatCurrency(state.ticketPrice);

    var total = calcTotal();
    if (el('tsTotal')) el('tsTotal').textContent = formatCurrency(total);

    // Update amounts in wallet payment boxes
    var totalStr = formatCurrency(total);
    ['gcash', 'maya', 'grabpay'].forEach(function(method) {
      if (el(method + 'AmountVal')) el(method + 'AmountVal').textContent = totalStr;
      if (el(method + 'StepAmt')) el(method + 'StepAmt').textContent = totalStr;
    });
  }

  function calcTotal() {
    var seatCount = state.seats.length;
    return seatCount * state.ticketPrice;
  }

  /* =========================================================
     STEP 4 — Validation
     ========================================================= */
  function validateStep4() {
    var payMethod = state.payMethod || 'card';

    if (payMethod === 'card') {
      var nameInput = document.getElementById('cardName');
      var emailInput = document.getElementById('payEmail');

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';

      state.name = nameVal || 'Juan dela Cruz';
      state.email = emailVal || 'juan@email.com';
    } else {
      state.name = 'Juan dela Cruz';
      state.email = 'juan@email.com';
      state.phone = '09171234567';
    }
    return true;
  }

  /* =========================================================
     STEP 5 — Populate E-Ticket
     ========================================================= */
  function populateEticket() {
    var key = window._bkMovieKey || DEFAULT_MOVIE;

    // Generate booking reference like TIX - 0001
    var refNum = Math.floor(1000 + Math.random() * 9000);
    var ref = 'TIX - ' + refNum;
    state.refCode = ref;

    var el = function (id) { return document.getElementById(id); };

    if (el('eTicketRef'))   el('eTicketRef').textContent   = ref;
    if (el('etTitle'))      el('etTitle').textContent      = key;
    if (el('etCinema'))     el('etCinema').textContent     = state.cinema;
    if (el('etAddr'))       el('etAddr').textContent       = state.cinemaAddr;

    var dayName = state.dayName || 'Sun';
    var day = state.day || '29';
    var month = state.month || 'Nov';
    var time = state.time || '7:30 PM';
    if (el('etDate'))       el('etDate').textContent       = dayName + ' ' + day + ' ' + month;
    if (el('etTime'))       el('etTime').textContent       = time;

    var seatsText = state.seats.length > 0 ? state.seats.slice().sort().join(', ') : '-';
    if (el('etSeats'))      el('etSeats').textContent      = seatsText;

    var formatText = (state.format || 'Regular') + ' \u2022 2D';
    if (el('etFormat'))     el('etFormat').textContent     = formatText;

    var total = calcTotal();
    var orderNum = Math.floor(1000 + Math.random() * 9000);
    if (el('etOrderSub'))   el('etOrderSub').textContent   = 'Order #' + orderNum + ' \u2022 ' + formatCurrency(total) + ' paid';

    if (el('confirmEmail')) el('confirmEmail').textContent = state.email || 'your email';
  }

  function initTicketCopyAndPrint() {
    var copyBtn = document.getElementById('bkCopyRefBtn');
    var copyTxt = document.getElementById('bkCopyBtnTxt');
    var printBtn = document.getElementById('bkPrintTicketBtn');

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var ref = state.refCode || 'TIX - 0001';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(ref).then(function () {
            if (copyTxt) copyTxt.textContent = 'Copied!';
            setTimeout(function () {
              if (copyTxt) copyTxt.textContent = 'Copy';
            }, 2000);
          }).catch(function () {
            if (copyTxt) copyTxt.textContent = 'Copied!';
            setTimeout(function () {
              if (copyTxt) copyTxt.textContent = 'Copy';
            }, 2000);
          });
        } else {
          if (copyTxt) copyTxt.textContent = 'Copied!';
          setTimeout(function () {
            if (copyTxt) copyTxt.textContent = 'Copy';
          }, 2000);
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  /* =========================================================
     WATCH TRAILER MODAL
     ========================================================= */
  function initTrailerModal() {
    var openBtn   = document.getElementById('bkOpenTrailerBtn');
    var modal     = document.getElementById('bkTrailerModal');
    var closeBtn  = document.getElementById('bkTrailerCloseBtn');
    var titleEl   = document.getElementById('bkTrailerModalTitle');
    var timeEl    = document.getElementById('bkTrailerModalTime');
    var playBtn   = document.getElementById('bkTrailerPlayBtn');

    if (!modal) return;

    function openModal() {
      var movie = window._bkMovie || MOVIES[DEFAULT_MOVIE];
      if (titleEl) {
        titleEl.textContent = (movie.trailerTitle || (movie.title + ' \u2022 Official Trailer'));
      }
      if (timeEl) {
        timeEl.textContent = (movie.trailerDuration || '01:20');
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (openBtn)  openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        // Subtle toggle animation feedback
        playBtn.style.transform = 'translate(-50%, -50%) scale(0.92)';
        setTimeout(function () {
          playBtn.style.transform = '';
        }, 180);
      });
    }
  }

  /* =========================================================
     CONTINUE / BACK buttons
     ========================================================= */
  function initNavigation() {
    var backBtn     = document.getElementById('bkBackBtn');
    var continueBtn = document.getElementById('bkContinueBtn');
    var scrollBtn   = document.getElementById('bkScrollToBook');

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (currentStep > 1) goToStep(currentStep - 1);
      });
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', function () {
        if (!canProceed()) return;

        if (currentStep === 4) {
          if (!validateStep4()) return;
          populateEticket();
        }

        if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
      });
    }

    if (scrollBtn) {
      scrollBtn.addEventListener('click', function () {
        var flowSection = document.getElementById('bkFlowSection');
        if (flowSection) flowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function canProceed() {
    if (currentStep === 1) {
      return !!state.cinema;
    }
    if (currentStep === 2) {
      if (!state.time) {
        alert('Please select a showtime to continue.');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (state.seats.length === 0) {
        alert('Please select at least one seat to continue.');
        return false;
      }
      return true;
    }
    return true;
  }

  /* =========================================================
     HELPERS
     ========================================================= */
  function formatCurrency(n) {
    return '\u20b1' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* =========================================================
     BOOT
     ========================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    populateMovieHero();
    initStep1();
    initStep2();
    buildSeatMap();
    initStep3();
    initStep4();
    initChangeBanner();
    initTrailerModal();
    initTicketCopyAndPrint();
    initNavigation();
    goToStep(1);
  });

})();
