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
    'Wicked: For Good': {
      title: 'Wicked: For Good',
      badge: 'PG',
      meta: 'Fantasy/Adventure • 2hr 18m • Releasing November 2026',
      desc: 'Elphaba and Glinda navigate their complex friendship and the pressures of Oz as their destinies begin to diverge towards greatness and infamy.',
      cast: 'Cast: Cynthia Erivo, Ariana Grande, Jonathan Bailey, Ethan Slater, Jeff Goldblum',
      poster: 'images/wicked.jpeg',
      themeBg: '#132e18',
      trailerTitle: 'Wicked: For Good • Official Trailer',
      trailerDuration: '02:18'
    },
    'Moana': {
      title: 'Moana',
      badge: 'PG',
      meta: 'Animation • 1hr 55m • Releasing December 2026',
      desc: 'An adventurous teenager sails out on a daring mission to save her people, fulfilling the ancient quest of her ancestors alongside the demigod Maui.',
      cast: "Cast: Auli'i Cravalho, Dwayne Johnson, Rachel House, Temuera Morrison",
      poster: 'images/moana.jpeg',
      themeBg: '#0e2b3d',
      trailerTitle: 'Moana • Official Trailer',
      trailerDuration: '01:55'
    },
    'Spider-Man: Brand New Day': {
      title: 'Spider-Man: Brand New Day',
      badge: 'PG',
      meta: 'Action/Adventure • 2hr 55m • Releasing December 2026',
      desc: 'Peter Parker begins a whole new chapter as Spider-Man facing uncharted threats across New York City with newly forged alliances.',
      cast: 'Cast: Tom Holland, Zendaya, Jacob Batalon',
      poster: 'images/spiderman.jpeg',
      themeBg: '#341417',
      trailerTitle: 'Spider-Man: Brand New Day • Official Trailer',
      trailerDuration: '02:55'
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

    
    // Check if coming-soon mode
    var isComingSoon = getUrlParam('mode') === 'coming-soon' || (movie.meta && movie.meta.toLowerCase().indexOf('releasing') !== -1);
    var flowSection = document.getElementById('bkFlowSection');
    var trailerBtn = document.getElementById('bkOpenTrailerBtn');
    var eyebrowEl = document.querySelector('.bk-eyebrow');

    if (isComingSoon) {
      if (eyebrowEl) eyebrowEl.textContent = 'Coming Soon';
      if (flowSection) flowSection.style.display = 'none';
      if (trailerBtn) trailerBtn.style.display = 'none';

      // Insert embedded sample trailer player in place of the booking flow
      var existingTrailerSection = document.getElementById('bkComingSoonTrailerSection');
      if (!existingTrailerSection) {
        var trailerSection = document.createElement('section');
        trailerSection.id = 'bkComingSoonTrailerSection';
        trailerSection.className = 'bk-coming-soon-trailer-section';
        trailerSection.innerHTML = [
          '<div class="bk-cs-trailer-container">',
          '  <div class="bk-cs-header">',
          '    <div class="bk-cs-tag"><span class="bk-cs-dot"></span> OFFICIAL TRAILER</div>',
          '    <h2 class="bk-cs-title">' + escapeHtml(movie.trailerTitle || (movie.title + ' • Official Trailer')) + '</h2>',
          '    <p class="bk-cs-subtitle">Tickets will become available closer to the release date.</p>',
          '  </div>',
          '  <div class="bk-cs-player-card">',
          '    <div class="bk-cs-player-screen">',
          '      <button class="bk-trailer-play-circle" id="bkCsPlayBtn" type="button" aria-label="Play trailer">',
          '        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
          '      </button>',
          '      <div class="bk-trailer-bottom-bar">',
          '        <div class="bk-trailer-progress-wrap"><div class="bk-trailer-progress-bar" id="bkCsProgressBar"></div></div>',
          '        <div class="bk-trailer-meta-row">',
          '          <span class="bk-trailer-title-txt">' + escapeHtml(movie.trailerTitle || (movie.title + ' • Official Trailer')) + '</span>',
          '          <span class="bk-trailer-time-txt" id="bkCsTimeTxt">00:00 / ' + escapeHtml(movie.trailerDuration || '02:00') + '</span>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('');

        if (flowSection && flowSection.parentNode) {
          flowSection.parentNode.insertBefore(trailerSection, flowSection.nextSibling);
        }

        // Add play animation
        var playBtn = document.getElementById('bkCsPlayBtn');
        var pBar = document.getElementById('bkCsProgressBar');
        var pTime = document.getElementById('bkCsTimeTxt');
        var isPlaying = false;
        var playInterval = null;
        var currentSec = 0;

        if (playBtn) {
          playBtn.addEventListener('click', function () {
            isPlaying = !isPlaying;
            if (isPlaying) {
              playBtn.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
              playInterval = setInterval(function () {
                currentSec += 1;
                var mins = String(Math.floor(currentSec / 60)).padStart(2, '0');
                var secs = String(currentSec % 60).padStart(2, '0');
                if (pTime) pTime.textContent = mins + ':' + secs + ' / ' + (movie.trailerDuration || '02:00');
                if (pBar) pBar.style.width = Math.min(100, (currentSec / 120) * 100) + '%';
              }, 1000);
            } else {
              playBtn.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
              if (playInterval) clearInterval(playInterval);
            }
          });
        }
      }
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
    payMethod: 'card',
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
      buildSeatMap();
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

        // Dynamically update Step 2 available experiences and showtimes for this cinema
        updateStep2ForCinema(state.cinema);

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

  // Update Step 2 dynamic experiences tabs and showtimes per cinema & movie
  function updateStep2ForCinema(cinemaName, preselectedFormat, preselectedTime) {
    var cinemaKey = (typeof getCinemaKey === 'function') ? getCinemaKey(cinemaName) : 'glorietta';
    var movieKey = window._bkMovieKey || DEFAULT_MOVIE;
    var cinemaInfo = (typeof TIGERTIX_DATA !== 'undefined' && TIGERTIX_DATA.cinemas) ? TIGERTIX_DATA.cinemas[cinemaKey] : null;

    if (!cinemaInfo || !cinemaInfo.movies) return;

    var movieShowtimes = cinemaInfo.movies[movieKey];
    // If this specific movie isn't in this cinema's list, fall back to first movie or default
    if (!movieShowtimes) {
      var availableMovieKeys = Object.keys(cinemaInfo.movies);
      if (availableMovieKeys.length > 0) {
        movieShowtimes = cinemaInfo.movies[availableMovieKeys[0]];
      } else {
        movieShowtimes = { 'Regular': ['11:30 AM', '2:30 PM', '5:30 PM'] };
      }
    }

    var availableFormats = Object.keys(movieShowtimes);

    // 1. Re-render experience filter track
    var track = document.querySelector('.bk-dt-format-track');
    if (track) {
      var trackHtml = ['<div class="bk-dt-fmt-glider" id="bkFmtGlider" aria-hidden="true"></div>'];
      trackHtml.push('<button type="button" class="bk-dt-fmt-btn is-active" data-format="all" role="tab" aria-selected="true">');
      trackHtml.push('  <span class="bk-dt-fmt-label">All Experience</span>');
      trackHtml.push('  <span class="bk-dt-fmt-count">' + availableFormats.length + '</span>');
      trackHtml.push('</button>');

      var allPossibleFormats = ['Regular', 'IMAX', 'ScreenX', "Director's Club"];
      allPossibleFormats.forEach(function (fmt) {
        if (movieShowtimes[fmt]) {
          var count = movieShowtimes[fmt].length;
          trackHtml.push('<button type="button" class="bk-dt-fmt-btn" data-format="' + escapeHtml(fmt) + '" role="tab" aria-selected="false">');
          trackHtml.push('  <span class="bk-dt-fmt-label">' + escapeHtml(fmt) + '</span>');
          trackHtml.push('  <span class="bk-dt-fmt-count">' + count + '</span>');
          trackHtml.push('</button>');
        }
      });

      track.innerHTML = trackHtml.join('');

      // Re-attach listeners to new filter buttons
      var newFmtBtns = track.querySelectorAll('.bk-dt-fmt-btn');
      newFmtBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          newFmtBtns.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
          updateFormatGlider(btn);

          var selectedFormat = btn.getAttribute('data-format') || 'all';
          var showtimeGroups = document.querySelectorAll('.bk-dt-showtime-group');
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
      setTimeout(function () { updateFormatGlider(); }, 40);
    }

    // 2. Re-render showtimes container
    var container = document.getElementById('bkTimeSlotsContainer');
    if (container) {
      var groupsHtml = [];
      var targetFormat = preselectedFormat || state.format;
      var targetTime = preselectedTime || state.time;

      // Determine initial selection
      var firstFormat = availableFormats[0] || 'Regular';
      var firstTimes = movieShowtimes[firstFormat] || ['11:30 AM'];
      var chosenFormat = (targetFormat && movieShowtimes[targetFormat]) ? targetFormat : firstFormat;
      var chosenTimes = movieShowtimes[chosenFormat] || firstTimes;
      var chosenTime = (targetTime && chosenTimes.indexOf(targetTime) !== -1) ? targetTime : chosenTimes[0];

      state.format = chosenFormat;
      state.time = chosenTime;

      var movieObj = window._bkMovie || {};
      if (state.format === "Director's Club") {
        state.ticketPrice = movieObj.priceDirectors || 600;
      } else if (state.format === 'IMAX') {
        state.ticketPrice = movieObj.priceIMAX || 500;
      } else if (state.format === 'ScreenX') {
        state.ticketPrice = movieObj.priceScreenX || 450;
      } else {
        state.ticketPrice = movieObj.priceRegular || 350;
      }

      availableFormats.forEach(function (fmt, idx) {
        var times = movieShowtimes[fmt] || [];
        var marginTop = idx > 0 ? ' style="margin-top: 1.4rem;"' : '';

        groupsHtml.push('<div class="bk-dt-showtime-group" data-group-format="' + escapeHtml(fmt) + '"' + marginTop + '>');
        groupsHtml.push('  <div class="bk-dt-cat-header">');
        groupsHtml.push('    <span class="bk-dt-cat-name">' + escapeHtml(fmt) + '</span>');
        groupsHtml.push('    <span class="bk-dt-cat-count">' + times.length + ' showtime' + (times.length === 1 ? '' : 's') + '</span>');
        groupsHtml.push('  </div>');
        groupsHtml.push('  <div class="bk-dt-time-row">');

        times.forEach(function (t) {
          var isAct = (fmt === chosenFormat && t === chosenTime) ? ' is-active' : '';
          groupsHtml.push('    <button type="button" class="bk-dt-time-btn' + isAct + '" data-format="' + escapeHtml(fmt) + '" data-time="' + escapeHtml(t) + '">');
          groupsHtml.push('      <svg class="bk-time-check-ico" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">');
          groupsHtml.push('        <polyline points="20 6 9 17 4 12"></polyline>');
          groupsHtml.push('      </svg>');
          groupsHtml.push('      ' + escapeHtml(t));
          groupsHtml.push('    </button>');
        });

        groupsHtml.push('  </div>');
        groupsHtml.push('</div>');
      });

      container.innerHTML = groupsHtml.join('');

      // Wire time buttons
      var newTimeBtns = container.querySelectorAll('.bk-dt-time-btn');
      newTimeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          newTimeBtns.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          state.format = btn.getAttribute('data-format') || 'Regular';
          state.time = btn.getAttribute('data-time') || btn.textContent.trim();

          var movie = window._bkMovie || {};
          if (state.format === "Director's Club") {
            state.ticketPrice = movie.priceDirectors || 600;
          } else if (state.format === 'IMAX') {
            state.ticketPrice = movie.priceIMAX || 500;
          } else if (state.format === 'ScreenX') {
            state.ticketPrice = movie.priceScreenX || 450;
          } else {
            state.ticketPrice = movie.priceRegular || 350;
          }

          updateBottomBar();
        });
      });
    }

    updateBottomBar();
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
        } else if (state.format === 'IMAX') {
          state.ticketPrice = movie.priceIMAX || 500;
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
  // Fallback reserved seats
  var DEFAULT_RESERVED = [
    'A3',
    'B5', 'B6',
    'D1', 'D2',
    'F4'
  ];

  function getReservedSeatsForMovie(movieTitle) {
    var title = movieTitle || window._bkMovieKey || DEFAULT_MOVIE;
    if (window.TIGERTIX_DATA && window.TIGERTIX_DATA.movies && window.TIGERTIX_DATA.movies[title] && window.TIGERTIX_DATA.movies[title].reservedSeats) {
      return window.TIGERTIX_DATA.movies[title].reservedSeats;
    }
    // Per-movie distinct fallback maps if not in TIGERTIX_DATA
    if (title === 'The Odyssey') {
      return ['C3', 'C4', 'C5', 'D5', 'D6', 'E7', 'E8', 'F9', 'F10'];
    } else if (title === 'Toy Story 5') {
      return ['A1', 'A2', 'B3', 'B4', 'C7', 'C8', 'D4', 'E2', 'E3', 'F5'];
    } else if (title === 'Wicked: For Good') {
      return ['A5', 'A6', 'B1', 'B2', 'C9', 'C10', 'D7', 'D8'];
    } else if (title === 'Moana') {
      return ['B7', 'B8', 'C1', 'C2', 'D9', 'D10', 'E4', 'E5'];
    } else if (title === 'Spider-Man: Brand New Day') {
      return ['A7', 'A8', 'B9', 'B10', 'C5', 'C6', 'D3', 'D4', 'F1', 'F2'];
    }
    return DEFAULT_RESERVED;
  }

  function buildSeatMap() {
    var map = document.getElementById('bkSeatMap');
    if (!map) return;
    map.innerHTML = '';

    var reservedList = getReservedSeatsForMovie(window._bkMovieKey || DEFAULT_MOVIE);

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
        leftGroup.appendChild(makeSeatBtn(row, c, reservedList));
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
        rightGroup.appendChild(makeSeatBtn(row, c, reservedList));
      }
      rowEl.appendChild(rightGroup);

      map.appendChild(rowEl);
    });
  }

  function makeSeatBtn(row, col, reservedList) {
    var seatId = row + col;
    var btn = document.createElement('button');
    btn.className = 'bk-seat';
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-seat', seatId);
    btn.setAttribute('aria-label', 'Seat ' + seatId);
    btn.textContent = col;

    var list = reservedList || DEFAULT_RESERVED;
    if (list.indexOf(seatId) > -1) {
      btn.classList.add('reserved');
      btn.setAttribute('aria-disabled', 'true');
      btn.addEventListener('click', function () {
        showSeatAlertModal(seatId);
      });
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

    // Card Input Auto-formatting & constraints
    var cardNumInput = document.getElementById('cardNum');
    var cardExpInput = document.getElementById('cardExp');
    var cardCvcInput = document.getElementById('cardCvc');

    if (cardNumInput) {
      cardNumInput.addEventListener('input', function () {
        var rawVal = cardNumInput.value.replace(/\D/g, '').substring(0, 16);
        var parts = rawVal.match(/.{1,4}/g);
        cardNumInput.value = parts ? parts.join(' ') : rawVal;
        clearFieldErr(cardNumInput, 'cardNumError');
      });
    }

    if (cardExpInput) {
      cardExpInput.addEventListener('input', function (e) {
        var rawVal = cardExpInput.value.replace(/\D/g, '').substring(0, 4);
        if (rawVal.length >= 3) {
          cardExpInput.value = rawVal.substring(0, 2) + '/' + rawVal.substring(2, 4);
        } else if (rawVal.length === 2 && e.inputType !== 'deleteContentBackward') {
          cardExpInput.value = rawVal + '/';
        } else {
          cardExpInput.value = rawVal;
        }
        clearFieldErr(cardExpInput, 'cardExpError');
      });

      cardExpInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && cardExpInput.value.length === 3 && cardExpInput.value.endsWith('/')) {
          cardExpInput.value = cardExpInput.value.substring(0, 2);
        }
      });
    }

    if (cardCvcInput) {
      cardCvcInput.addEventListener('input', function () {
        cardCvcInput.value = cardCvcInput.value.replace(/\D/g, '').substring(0, 3);
        clearFieldErr(cardCvcInput, 'cardCvcError');
      });
    }

    var cardNameInput = document.getElementById('cardName');
    if (cardNameInput) {
      cardNameInput.addEventListener('input', function () {
        clearFieldErr(cardNameInput, 'cardNameError');
      });
    }

    var payEmailInput = document.getElementById('payEmail');
    if (payEmailInput) {
      payEmailInput.addEventListener('input', function () {
        clearFieldErr(payEmailInput, 'payEmailError');
      });
    }
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

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function showFieldErr(input, errId, message) {
    if (input) input.classList.add('is-invalid');
    var errEl = document.getElementById(errId);
    if (!errEl && input) {
      errEl = input.parentElement ? input.parentElement.querySelector('.bk-field-error') : null;
    }
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add('is-visible');
    }
  }

  function clearFieldErr(input, errId) {
    if (input) input.classList.remove('is-invalid');
    var errEl = document.getElementById(errId);
    if (!errEl && input) {
      errEl = input.parentElement ? input.parentElement.querySelector('.bk-field-error') : null;
    }
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.remove('is-visible');
    }
  }

  /* =========================================================
     STEP 4 — Validation
     ========================================================= */
  function validateStep4() {
    var payMethod = state.payMethod || 'card';

    if (payMethod === 'card') {
      var numInput = document.getElementById('cardNum');
      var expInput = document.getElementById('cardExp');
      var cvcInput = document.getElementById('cardCvc');
      var nameInput = document.getElementById('cardName');
      var emailInput = document.getElementById('payEmail');

      var numVal = numInput ? numInput.value.replace(/\D/g, '') : '';
      var expVal = expInput ? expInput.value.trim() : '';
      var cvcVal = cvcInput ? cvcInput.value.trim() : '';
      var nameVal = nameInput ? nameInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';

      clearFieldErr(numInput, 'cardNumError');
      clearFieldErr(expInput, 'cardExpError');
      clearFieldErr(cvcInput, 'cardCvcError');
      clearFieldErr(nameInput, 'cardNameError');
      clearFieldErr(emailInput, 'payEmailError');

      var firstErrorInput = null;

      if (!numVal) {
        showFieldErr(numInput, 'cardNumError', 'Card number is required.');
        if (!firstErrorInput) firstErrorInput = numInput;
      } else if (numVal.length !== 16) {
        showFieldErr(numInput, 'cardNumError', 'Please enter a valid 16-digit card number.');
        if (!firstErrorInput) firstErrorInput = numInput;
      }

      if (!expVal) {
        showFieldErr(expInput, 'cardExpError', 'Expiration date is required.');
        if (!firstErrorInput) firstErrorInput = expInput;
      } else if (!/^\d{2}\/\d{2}$/.test(expVal)) {
        showFieldErr(expInput, 'cardExpError', 'Enter expiration date in MM/YY format.');
        if (!firstErrorInput) firstErrorInput = expInput;
      }

      if (!cvcVal) {
        showFieldErr(cvcInput, 'cardCvcError', 'CVV/CVC is required.');
        if (!firstErrorInput) firstErrorInput = cvcInput;
      } else if (cvcVal.length !== 3) {
        showFieldErr(cvcInput, 'cardCvcError', 'CVV/CVC must be 3 digits.');
        if (!firstErrorInput) firstErrorInput = cvcInput;
      }

      if (!nameVal) {
        showFieldErr(nameInput, 'cardNameError', 'Name on card is required.');
        if (!firstErrorInput) firstErrorInput = nameInput;
      }

      if (!emailVal) {
        showFieldErr(emailInput, 'payEmailError', 'Email address is required.');
        if (!firstErrorInput) firstErrorInput = emailInput;
      } else if (!isValidEmail(emailVal)) {
        showFieldErr(emailInput, 'payEmailError', 'Please enter a valid email address (e.g., user@example.com).');
        if (!firstErrorInput) firstErrorInput = emailInput;
      }

      if (firstErrorInput) {
        firstErrorInput.focus();
        return false;
      }

      state.name = nameVal;
      state.email = emailVal;
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
    var movieObj = MOVIES[key] || MOVIES[DEFAULT_MOVIE] || {};

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

    // Save this confirmed ticket to user bookings in localStorage
    try {
      var existing = [];
      var stored = localStorage.getItem('tigertix_user_bookings');
      if (stored) {
        existing = JSON.parse(stored);
      }
      var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var now = new Date();
      var purchaseDateStr = monthNames[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

      var newBooking = {
        id: ref.replace(/\s+/g, ''),
        movie: key,
        cinema: state.cinema || 'Glorietta 4',
        format: (state.format || 'Regular') + ' 2D',
        showtime: month + ' ' + day + ', 2026 \u2022 ' + time,
        purchaseDate: purchaseDateStr,
        seats: seatsText,
        total: formatCurrency(total),
        reference: ref,
        poster: movieObj.poster || 'images/toystory-5.jpg',
        status: 'upcoming',
        btnText: 'View e-ticket',
        btnAction: 'ticket'
      };
      existing.unshift(newBooking);
      localStorage.setItem('tigertix_user_bookings', JSON.stringify(existing));
    } catch (e) {}
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
          // Check if user is logged in before proceeding to final ticket
          var user = window.TigerAuth && window.TigerAuth.getUser ? window.TigerAuth.getUser() : null;
          if (!user) {
            try {
              var raw = localStorage.getItem('tigertix_user');
              if (raw) user = JSON.parse(raw);
            } catch (e) {}
          }

          if (!user) {
            // Show custom "Log in to continue" modal matching reference photo
            var movieKey = window._bkMovieKey || DEFAULT_MOVIE;
            var cinemaName = state.cinema || 'Cinema';
            var experienceName = state.format || 'Regular';
            var dayName = state.dayName || 'Sun';
            var day = state.day || '29';
            var month = state.month || 'Nov';
            var time = state.time || '7:30 PM';
            var seatsText = state.seats && state.seats.length > 0 ? state.seats.slice().sort().join(', ') : 'Seats';

            var detailsSummary = movieKey + ' \u2022 ' + cinemaName + ' \u2022 ' + experienceName + ' \u2022 ' + dayName + ', ' + month + ' ' + day + ' \u2022 ' + time + ' \u2022 ' + seatsText;

            var loginModal = document.getElementById('bkLoginModal');
            var loginDesc = document.getElementById('bkLoginModalDesc');
            if (loginDesc) {
              loginDesc.textContent = 'Your selection is saved: ' + detailsSummary + '. Log in or create an account to pay and receive your e-ticket.';
            }

            if (loginModal) {
              loginModal.classList.add('is-active');
              loginModal.setAttribute('aria-hidden', 'false');
            } else {
              if (window.TigerAuth && typeof window.TigerAuth.open === 'function') {
                window.TigerAuth.open('login');
              }
            }
            return;
          }

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

    // Login modal button actions
    var loginModal = document.getElementById('bkLoginModal');
    var modalLoginBtn = document.getElementById('bkLoginModalLoginBtn');
    var modalSignupBtn = document.getElementById('bkLoginModalSignupBtn');

    function hideLoginModal() {
      if (loginModal) {
        loginModal.classList.remove('is-active');
        loginModal.setAttribute('aria-hidden', 'true');
      }
    }

    if (modalLoginBtn) {
      modalLoginBtn.addEventListener('click', function () {
        hideLoginModal();
        if (window.TigerAuth && typeof window.TigerAuth.open === 'function') {
          window.TigerAuth.open('login');
        }
      });
    }

    if (modalSignupBtn) {
      modalSignupBtn.addEventListener('click', function () {
        hideLoginModal();
        if (window.TigerAuth && typeof window.TigerAuth.open === 'function') {
          window.TigerAuth.open('signup');
        }
      });
    }

    if (loginModal) {
      loginModal.addEventListener('click', function (e) {
        if (e.target === loginModal) {
          hideLoginModal();
        }
      });
    }

    // Seat Alert Modal Wireup
    var seatAlertModal = document.getElementById('bkSeatAlertModal');
    var seatAlertChooseBtn = document.getElementById('bkSeatAlertChooseBtn');
    var seatAlertChangeTimeBtn = document.getElementById('bkSeatAlertChangeTimeBtn');

    if (seatAlertChooseBtn) {
      seatAlertChooseBtn.addEventListener('click', function () {
        hideSeatAlertModal();
        var mapCard = document.querySelector('.bk-seats-card') || document.getElementById('bkSeatMap');
        if (mapCard) {
          mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (seatAlertChangeTimeBtn) {
      seatAlertChangeTimeBtn.addEventListener('click', function () {
        hideSeatAlertModal();
        goToStep(2);
      });
    }

    if (seatAlertModal) {
      seatAlertModal.addEventListener('click', function (e) {
        if (e.target === seatAlertModal) {
          hideSeatAlertModal();
        }
      });
    }
  }

  function showSeatAlertModal(seatName) {
    var modal = document.getElementById('bkSeatAlertModal');
    var titleEl = document.getElementById('bkSeatAlertTitle');
    var descEl = document.getElementById('bkSeatAlertDesc');
    var chooseBtn = document.getElementById('bkSeatAlertChooseBtn');

    if (seatName) {
      if (titleEl) titleEl.textContent = 'Seat ' + seatName + ' was just taken';
      if (descEl) descEl.textContent = 'Another customer booked it a moment ago. Your showtime is unchanged — choose different seats to continue.';
      if (chooseBtn) chooseBtn.textContent = 'Choose new seats';
    } else {
      if (titleEl) titleEl.textContent = 'No seats selected';
      if (descEl) descEl.textContent = 'Another customer booked it a moment ago. Your showtime is unchanged — choose different seats to continue.';
      if (chooseBtn) chooseBtn.textContent = 'Choose new seats';
    }

    if (modal) {
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function hideSeatAlertModal() {
    var modal = document.getElementById('bkSeatAlertModal');
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
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
        showSeatAlertModal();
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
    initPasswordToggles();
    initStep1();
    initStep2();
    buildSeatMap();
    initStep3();
    initStep4();
    initChangeBanner();
    initTrailerModal();
    initTicketCopyAndPrint();
    initNavigation();

    // Check if directly viewing an existing ticket from account bookings or jumping from cinema showtimes
    var viewParam = getUrlParam('view');
    var refParam = getUrlParam('ref');
    var stepParam = parseInt(getUrlParam('step'), 10);
    var cinemaParam = getUrlParam('cinema');
    var formatParam = getUrlParam('format');
    var timeParam = getUrlParam('time');
    var dateParam = getUrlParam('date');

    if (cinemaParam) {
      // Find matching cinema card in Step 1
      var cinemaCards = document.querySelectorAll('.bk-cinema-card');
      cinemaCards.forEach(function (card) {
        var cardCinema = card.getAttribute('data-cinema') || '';
        if (cardCinema.toLowerCase() === cinemaParam.toLowerCase() || 
            cardCinema.toLowerCase().indexOf(cinemaParam.toLowerCase()) !== -1 ||
            cinemaParam.toLowerCase().indexOf(cardCinema.toLowerCase()) !== -1) {
          cinemaCards.forEach(function (c) { c.classList.remove('is-selected'); });
          card.classList.add('is-selected');
          var radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
          state.cinema = card.getAttribute('data-cinema') || cinemaParam;
          state.cinemaAddr = card.getAttribute('data-addr') || '';
        }
      });
      if (!state.cinema) {
        state.cinema = cinemaParam;
      }
      var s2info = document.getElementById('bkStep2Cinema');
      if (s2info) s2info.textContent = 'Cinema: ' + state.cinema;
    }

    // Initialize or update Step 2 showtimes and experiences for current cinema and pre-selected format/time
    updateStep2ForCinema(state.cinema, formatParam, timeParam);

    if (formatParam) {
      state.format = formatParam;
    }

    if (timeParam) {
      state.time = timeParam;
      // Pre-select matching time button in Step 2
      var tBtns = document.querySelectorAll('.bk-dt-time-btn');
      tBtns.forEach(function (tb) {
        if (tb.getAttribute('data-time') === timeParam) {
          tBtns.forEach(function (b) { b.classList.remove('is-active'); });
          tb.classList.add('is-active');
        }
      });
    }

    if (dateParam) {
      // e.g. "Today 29", "Dec 1", "Tomorrow 30"
      var dtCards = document.querySelectorAll('.bk-dt-date-card');
      var matchedDate = false;
      dtCards.forEach(function (dc) {
        var dcDay = dc.getAttribute('data-day') || '';
        var dcDate = dc.getAttribute('data-date') || '';
        if (dateParam.indexOf(dcDay) !== -1 || dateParam.toLowerCase().indexOf(dcDate.toLowerCase()) !== -1) {
          dtCards.forEach(function (c) { c.classList.remove('is-active'); });
          dc.classList.add('is-active');
          state.date = dc.getAttribute('data-date') || '';
          state.day = dc.getAttribute('data-day') || '';
          state.month = dc.getAttribute('data-month') || 'Nov';
          state.dayName = dc.getAttribute('data-day-name') || '';
          matchedDate = true;
        }
      });
    }

    updateBottomBar();

    if (viewParam === 'ticket') {
      var key = window._bkMovieKey || DEFAULT_MOVIE;
      var el = function (id) { return document.getElementById(id); };
      if (el('eTicketRef') && refParam) el('eTicketRef').textContent = refParam;
      if (el('etTitle')) el('etTitle').textContent = key;
      goToStep(5);
    } else if (stepParam && stepParam >= 1 && stepParam <= TOTAL_STEPS) {
      goToStep(stepParam);
    } else {
      goToStep(1);
    }
  });

})();
