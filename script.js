/**
 * TigerTix Movie Reservation System - Search & Interactivity
 *
 * Implements an expanding search pill with smooth glide animation to the right,
 * curved pill styling matching the Sign In button, live dropdown results,
 * in-grid card filtering, tab switching, and card pulse highlights.
 */

document.addEventListener('DOMContentLoaded', function () {
  var searchWidget = document.getElementById('searchWidget');
  var searchPill = document.getElementById('searchPill');
  var searchBtn = document.getElementById('searchBtn');
  var searchInput = document.getElementById('searchInput');
  var searchClear = document.getElementById('searchClear');
  var searchDropdown = document.getElementById('searchDropdown');
  var searchResultsList = document.getElementById('searchResultsList');
  var searchCountBadge = document.getElementById('searchCountBadge');
  var tabNow = document.getElementById('tab-now');
  var tabSoon = document.getElementById('tab-soon');
  var panelNow = document.querySelector('.panel-now');
  var panelSoon = document.querySelector('.panel-soon');

  if (!searchWidget || !searchBtn || !searchInput) return;

  // 1. DYNAMICALLY INDEX MOVIES FROM THE DOM
  var movies = [];

  function indexMovies() {
    movies = [];

    // Helper to extract data from a card
    function extractCard(card, tabType, tabId) {
      var titleEl = card.querySelector('.movie-title');
      var metaEl = card.querySelector('.movie-meta');
      var badgeEl = card.querySelector('.badge');
      var imgEl = card.querySelector('img');
      var actionEl = card.querySelector('.btn');

      var fullTitle = titleEl ? titleEl.textContent : '';
      var badgeText = badgeEl ? badgeEl.textContent.trim() : '';
      // Strip badge text from title
      var cleanTitle = fullTitle;
      if (badgeText) {
        cleanTitle = cleanTitle.replace(badgeText, '').trim();
      }

      var metaText = metaEl ? metaEl.textContent.trim() : '';
      var posterSrc = imgEl ? imgEl.getAttribute('src') : null;
      var actionText = actionEl ? actionEl.textContent.trim() : (tabType === 'now' ? 'Book Now' : 'Remind Me');

      return {
        id: 'movie-' + movies.length,
        title: cleanTitle,
        badge: badgeText,
        meta: metaText,
        tabType: tabType,
        tabId: tabId,
        card: card,
        posterSrc: posterSrc,
        actionText: actionText
      };
    }

    if (panelNow) {
      var nowCards = panelNow.querySelectorAll('.movie-card');
      nowCards.forEach(function (card) {
        movies.push(extractCard(card, 'now', 'tab-now'));
      });
    }

    if (panelSoon) {
      var soonCards = panelSoon.querySelectorAll('.movie-card');
      soonCards.forEach(function (card) {
        movies.push(extractCard(card, 'soon', 'tab-soon'));
      });
    }

    // Index cinema page movie items if present
    var cinemaList = document.querySelector('.cinema-movies-list');
    if (cinemaList) {
      var cinemaItems = cinemaList.querySelectorAll('.cinema-movie-item');
      cinemaItems.forEach(function (item) {
        var titleEl = item.querySelector('.cinema-movie-title');
        var metaEl = item.querySelector('.cinema-movie-meta');
        var badgeEl = item.querySelector('.badge');
        var imgEl = item.querySelector('img');

        var fullTitle = titleEl ? titleEl.textContent : '';
        var badgeText = badgeEl ? badgeEl.textContent.trim() : '';
        var cleanTitle = fullTitle;
        if (badgeText) {
          cleanTitle = cleanTitle.replace(badgeText, '').trim();
        }

        var metaText = metaEl ? metaEl.textContent.trim() : '';
        var posterSrc = imgEl ? imgEl.getAttribute('src') : null;

        movies.push({
          id: 'movie-' + movies.length,
          title: cleanTitle,
          badge: badgeText,
          meta: metaText,
          tabType: 'cinema',
          tabId: null,
          card: item,
          posterSrc: posterSrc,
          actionText: 'View Showtimes'
        });
      });
    }
  }

  indexMovies();

  // 2. SEARCH PILL EXPAND / COLLAPSE (GLIDE TO RIGHT)
  function openSearch() {
    searchWidget.classList.add('is-open');
    searchBtn.setAttribute('aria-expanded', 'true');
    searchInput.focus();

    var query = searchInput.value.trim();
    if (query.length > 0) {
      performSearch(query);
    }
  }

  function closeSearch() {
    searchWidget.classList.remove('is-open');
    searchBtn.setAttribute('aria-expanded', 'false');
    closeDropdown();
    if (searchInput.value.trim() === '') {
      resetGridFilters();
      searchClear.classList.remove('is-visible');
    }
  }

  function toggleSearch() {
    var isOpen = searchWidget.classList.contains('is-open');
    if (!isOpen) {
      openSearch();
    } else {
      if (searchInput.value.trim() === '') {
        closeSearch();
      } else {
        searchInput.focus();
        var query = searchInput.value.trim();
        if (query) performSearch(query);
      }
    }
  }

  searchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleSearch();
  });

  // Keep search pill open when clicking inside it
  searchPill.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // 3. CLEAR SEARCH BUTTON
  searchClear.addEventListener('click', function (e) {
    e.stopPropagation();
    searchInput.value = '';
    searchClear.classList.remove('is-visible');
    closeDropdown();
    resetGridFilters();
    searchInput.focus();
  });

  // 4. ESCAPE & CLICK OUTSIDE TO CLOSE
  document.addEventListener('click', function (e) {
    if (!searchWidget.contains(e.target)) {
      closeDropdown();
      if (searchInput.value.trim() === '') {
        closeSearch();
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!searchDropdown.hasAttribute('hidden')) {
        closeDropdown();
      } else if (searchWidget.classList.contains('is-open')) {
        searchInput.value = '';
        searchClear.classList.remove('is-visible');
        resetGridFilters();
        closeSearch();
      }
    }
  });

  // 5. SEARCH LOGIC & LIVE RESULTS
  function highlightMatches(text, query) {
    if (!query) return escapeHtml(text);
    var q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + q + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function closeDropdown() {
    searchDropdown.setAttribute('hidden', '');
  }

  function openDropdown() {
    searchDropdown.removeAttribute('hidden');
  }

  function performSearch(query) {
    var q = query.toLowerCase().trim();
    if (!q) {
      closeDropdown();
      searchClear.classList.remove('is-visible');
      resetGridFilters();
      return;
    }

    searchClear.classList.add('is-visible');

    // Filter movies
    var matched = movies.filter(function (m) {
      return m.title.toLowerCase().indexOf(q) !== -1 ||
             m.meta.toLowerCase().indexOf(q) !== -1;
    });

    // Sort: exact or prefix title match first
    matched.sort(function (a, b) {
      var aTitle = a.title.toLowerCase();
      var bTitle = b.title.toLowerCase();
      var aStarts = aTitle.indexOf(q) === 0;
      var bStarts = bTitle.indexOf(q) === 0;
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    // Update count badge
    if (searchCountBadge) {
      searchCountBadge.textContent = matched.length + (matched.length === 1 ? ' movie' : ' movies');
    }

    // Render dropdown list
    if (matched.length === 0) {
      searchResultsList.innerHTML = [
        '<div class="search-empty">',
        '  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
        '    <circle cx="11" cy="11" r="7"></circle>',
        '    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
        '    <line x1="8" y1="11" x2="14" y2="11"></line>',
        '  </svg>',
        '  <p class="search-empty-text">No movies found</p>',
        '  <p class="search-empty-sub">No results for "' + escapeHtml(query) + '"</p>',
        '</div>'
      ].join('');
    } else {
      var html = '';
      matched.forEach(function (m) {
        var highlightedTitle = highlightMatches(m.title, query);
        var highlightedMeta = highlightMatches(m.meta, query);
        var tagClass = m.tabType === 'now' ? 'search-item-tag--now' : 'search-item-tag--soon';
        var tagLabel = m.tabType === 'now' ? 'Now Showing' : 'Coming Soon';

        var thumbContent = m.posterSrc
          ? '<img src="' + escapeHtml(m.posterSrc) + '" alt="' + escapeHtml(m.title) + '">'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18"></rect><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path></svg>';

        html += [
          '<div class="search-item" data-tab-id="' + m.tabId + '" data-movie-id="' + m.id + '" role="option" tabindex="0">',
          '  <div class="search-item-thumb">' + thumbContent + '</div>',
          '  <div class="search-item-body">',
          '    <div class="search-item-title">',
          '      <span>' + highlightedTitle + '</span>',
          m.badge ? '      <span class="badge">' + escapeHtml(m.badge) + '</span>' : '',
          '    </div>',
          '    <div class="search-item-meta">' + highlightedMeta + '</div>',
          '    <span class="search-item-tag ' + tagClass + '">' + tagLabel + '</span>',
          '  </div>',
          '  <button class="search-item-action" type="button">' + escapeHtml(m.actionText) + '</button>',
          '</div>'
        ].join('');
      });
      searchResultsList.innerHTML = html;

      // Attach click handlers to results
      var items = searchResultsList.querySelectorAll('.search-item');
      items.forEach(function (el) {
        function activate() {
          var movieId = el.getAttribute('data-movie-id');
          var targetMovie = movies.find(function (item) { return item.id === movieId; });
          if (targetMovie) {
            selectMovie(targetMovie);
          }
        }

        el.addEventListener('click', activate);
        el.addEventListener('keydown', function (evt) {
          if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            activate();
          }
        });
      });
    }

    openDropdown();

    // Live filter movie cards in the page grids
    filterGridCards(q);
  }

  // 6. FILTER CARDS IN PAGE GRIDS
  function filterGridCards(q) {
    var nowMatches = 0;
    var soonMatches = 0;

    movies.forEach(function (m) {
      var matches = m.title.toLowerCase().indexOf(q) !== -1 ||
                    m.meta.toLowerCase().indexOf(q) !== -1;

      if (matches) {
        m.card.classList.remove('is-search-hidden');
        if (m.tabType === 'now') nowMatches++;
        else soonMatches++;
      } else {
        m.card.classList.add('is-search-hidden');
      }
    });

    updateGridEmptyState(panelNow, nowMatches, q, 'Now Showing', 'tab-soon', 'Coming Soon', soonMatches);
    updateGridEmptyState(panelSoon, soonMatches, q, 'Coming Soon', 'tab-now', 'Now Showing', nowMatches);
  }

  function resetGridFilters() {
    movies.forEach(function (m) {
      m.card.classList.remove('is-search-hidden');
    });

    var existingNowEmpty = panelNow ? panelNow.querySelector('.grid-search-empty') : null;
    if (existingNowEmpty) existingNowEmpty.remove();

    var existingSoonEmpty = panelSoon ? panelSoon.querySelector('.grid-search-empty') : null;
    if (existingSoonEmpty) existingSoonEmpty.remove();
  }

  function updateGridEmptyState(panel, matchCount, query, currentTabName, otherTabId, otherTabName, otherCount) {
    if (!panel) return;
    var existing = panel.querySelector('.grid-search-empty');

    if (matchCount === 0 && query) {
      if (!existing) {
        existing = document.createElement('div');
        existing.className = 'grid-search-empty';
        panel.appendChild(existing);
      }

      var switchButtonHtml = otherCount > 0
        ? '<button type="button" class="btn btn-outline btn-xs btn-switch-tab" data-tab="' + otherTabId + '">View in ' + otherTabName + ' (' + otherCount + ')</button>'
        : '';

      existing.innerHTML = [
        '<h4>No movies found</h4>',
        '<p>No titles or genres matching "' + escapeHtml(query) + '" in ' + currentTabName + '.</p>',
        switchButtonHtml
      ].join('');

      var switchBtn = existing.querySelector('.btn-switch-tab');
      if (switchBtn) {
        switchBtn.addEventListener('click', function () {
          var targetTab = document.getElementById(otherTabId);
          if (targetTab) targetTab.checked = true;
        });
      }
    } else {
      if (existing) existing.remove();
    }
  }

  // 7. SELECT MOVIE (SCROLL & PULSE HIGHLIGHT)
  function selectMovie(movie) {
    // Switch to corresponding tab
    var tabRadio = document.getElementById(movie.tabId);
    if (tabRadio) {
      tabRadio.checked = true;
    }

    closeDropdown();

    // Ensure the card is visible
    movie.card.classList.remove('is-search-hidden');

    // Smooth scroll into view
    setTimeout(function () {
      movie.card.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Trigger gold pulse highlight animation
      movie.card.classList.remove('search-highlighted');
      // Trigger reflow
      void movie.card.offsetWidth;
      movie.card.classList.add('search-highlighted');

      setTimeout(function () {
        movie.card.classList.remove('search-highlighted');
      }, 2500);
    }, 120);
  }

  // 8. INPUT EVENT LISTENERS & ENTER KEY
  searchInput.addEventListener('input', function () {
    performSearch(searchInput.value);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var q = searchInput.value.trim().toLowerCase();
      if (!q) return;

      var match = movies.find(function (m) {
        return m.title.toLowerCase().indexOf(q) !== -1 ||
               m.meta.toLowerCase().indexOf(q) !== -1;
      });

      if (match) {
        selectMovie(match);
      }
    } else if (e.key === 'ArrowDown') {
      // Focus first dropdown item
      var firstItem = searchResultsList.querySelector('.search-item');
      if (firstItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }
  });

  // Keyboard navigation within dropdown
  searchResultsList.addEventListener('keydown', function (e) {
    var currentItem = document.activeElement;
    if (!currentItem || !currentItem.classList.contains('search-item')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      var next = currentItem.nextElementSibling;
      if (next && next.classList.contains('search-item')) {
        next.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      var prev = currentItem.previousElementSibling;
      if (prev && prev.classList.contains('search-item')) {
        prev.focus();
      } else {
        searchInput.focus();
      }
    }
  });

  // ================= CINEMA PAGE LOGIC =================
  var dateCards = document.querySelectorAll('.date-card');
  var cinemaFmtBtns = document.querySelectorAll('.cinema-fmt-btn');
  var timeBtns = document.querySelectorAll('.time-btn');
  var cinemaMovieItems = document.querySelectorAll('.cinema-movie-item');

  // Complete metadata for all 6 cinemas
  var CINEMA_DATA = {
    // 1. GLORIETTA 4
    glorietta: {
      title: 'Glorietta 4',
      location: '5th Level Glorietta 4<br>Ayala Center, Makati City',
      desc: 'Glorietta Cinemas in Makati offers a modern moviegoing experience with stylish interiors and advanced technology. Its spacious lobby features one of the largest immersive LED screens in the country, creating an exciting atmosphere as soon as you enter. Inside the theaters, Dolby Atmos sound and laser projection provide stunning visuals and clear audio, while the A-Luxe cinemas feature comfortable motorized recliners for a more luxurious viewing experience.',
      bg: "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%), url('images/glorietta-4-cinema.avif')",
      pos: 'center 55%'
    },

    // 2. SM MALL OF ASIA
    moa: {
      title: 'SM Mall of Asia',
      location: 'Entertainment Mall, SM Mall of Asia<br>Pasay City',
      desc: 'SM Mall of Asia Cinemas is home to one of the largest IMAX laser projection screens in Southeast Asia. Boasting cutting-edge stadium seating, crystal clear digital audio, and comfortable spacious lounges, it is the premier destination for massive Hollywood blockbusters.',
      bg: "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%), url('images/moa-cinema.png')",
      pos: 'center 50%'
    },

    // 3. ROBINSONS GALLERIA
    galleria: {
      title: 'Robinsons Galleria',
      location: "Level 3, Robinsons Galleria<br>Ortigas Avenue, Quezon City",
      desc: "Robinsons Galleria Cinemas in Ortigas provides a premium cinematic haven in the heart of Quezon City. Featuring plush comfortable seating, state-of-the-art Christie Laser Projection, and multi-channel surround sound, moviegoers can experience Hollywood blockbusters and local favorites in maximum fidelity and comfort.",
      bg: "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%), url('images/robinsons-cinema.jpeg')",
      pos: 'center 50%'
    },

    // 4. NEWPORT MALL
    newport: {
      title: 'Newport Mall',
      location: '4th Level Newport Mall, Newport World Resorts<br>Newport Blvd, Pasay City',
      desc: 'Newport Mall Cinemas at Newport World Resorts offers an upscale entertainment experience with stadium-configured theaters, luxurious VIP Director’s Club recliners, and precision Dolby Atmos sound.',
      bg: "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%), url('images/newport-cinema.png')",
      pos: 'center 50%'
    },

    // 5. UPTOWN MALL
    uptown: {
      title: 'Uptown Mall',
      location: '3rd Floor, Uptown Mall<br>9th Ave, Taguig City',
      desc: 'Uptown Mall Cinemas at Bonifacio Global City delivers an ultra-luxurious movie entertainment destination. Boasting VIP Cinema lounges with motorized leather recliners, gourmet snack delivery directly to your seat, and Dolby Atmos audio systems for true acoustic perfection.',
      bg: "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%), url('images/uptown-cinema.png')",
      pos: 'center 50%'
    },

    // 6. SM CITY NORTH EDSA
    'north-edsa': {
      title: 'SM City North Edsa',
      location: '4th Floor, The Block, SM City North Edsa<br>North Avenue, Quezon City',
      desc: 'SM City North EDSA Cinema is one of the busiest and most iconic cinema complexes in Metro Manila, offering IMAX with Laser, regular digital cinemas, and top-tier stadium seating.',
      bg: "linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.7) 40%, transparent 80%), url('images/sm-north-cinema.png')",
      pos: 'center 50%'
    }
  };

  var currentSelectedCinema = 'glorietta';

  // DIRECTORY VIEW ELEMENTS
  var directoryView = document.getElementById('cinemaDirectoryView');
  var detailView = document.getElementById('cinemaDetailView');
  var backToDirectoryBtn = document.getElementById('cinemaBackBtn');
  var cinemaCards = document.querySelectorAll('.cinema-card');
  var viewShowtimesBtns = document.querySelectorAll('.cinema-view-showtimes-btn');

  var locationSearchInput = document.getElementById('cinemaLocationSearch');
  var searchClearBtn = document.getElementById('cinemaSearchClear');
  var cityPills = document.querySelectorAll('#cityFilterPills .cinema-pill');
  var expPills = document.querySelectorAll('#expFilterPills .cinema-pill');
  var countTextEl = document.getElementById('cinemaCountText');
  var emptyStateEl = document.getElementById('cinemaEmptyState');
  var resetFiltersBtn = document.getElementById('cinemaResetFiltersBtn');

  var activeCityFilter = 'all';
  var activeExpFilter = 'all';

  // Open Cinema Detail View
  function openCinemaDetail(cinemaId) {
    var data = CINEMA_DATA[cinemaId];
    if (!data) return;

    currentSelectedCinema = cinemaId;

    var titleEl = document.getElementById('cinemaTitle');
    var locEl = document.getElementById('cinemaLocation');
    var descEl = document.getElementById('cinemaDesc');
    var heroEl = document.getElementById('cinemaHero');

    if (titleEl) titleEl.textContent = data.title;
    if (locEl) locEl.innerHTML = data.location;
    if (descEl) descEl.textContent = data.desc;
    if (heroEl && data.bg) {
      heroEl.style.backgroundImage = data.bg;
      heroEl.style.backgroundPosition = data.pos || 'center 50%';
    }

    if (directoryView) directoryView.hidden = true;
    if (detailView) {
      detailView.hidden = false;
      renderCinemaDetailShowtimes(cinemaId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Render dynamic showtimes for selected cinema
  function renderCinemaDetailShowtimes(cinemaId) {
    var moviesContainer = document.getElementById('cinemaMoviesList');
    var formatTrack = document.getElementById('cinemaFormatTrack');
    if (!moviesContainer) return;

    var cinemaKey = (typeof getCinemaKey === 'function') ? getCinemaKey(cinemaId) : cinemaId;
    var cinemaInfo = (typeof TIGERTIX_DATA !== 'undefined' && TIGERTIX_DATA.cinemas) ? TIGERTIX_DATA.cinemas[cinemaKey] : null;

    if (!cinemaInfo || !cinemaInfo.movies) {
      moviesContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No showtimes available for this location.</p>';
      return;
    }

    // Determine all unique formats available in this cinema across its movies
    var cinemaFormatsSet = {};
    var moviesData = cinemaInfo.movies;

    Object.keys(moviesData).forEach(function (movieTitle) {
      var fmts = moviesData[movieTitle];
      Object.keys(fmts).forEach(function (f) {
        cinemaFormatsSet[f] = true;
      });
    });

    // Update Format Capsule Track if present
    if (formatTrack) {
      var trackHtml = [];
      trackHtml.push('<button type="button" class="cinema-fmt-btn is-active" data-format="all" role="tab" aria-selected="true">');
      trackHtml.push('  <span class="cinema-fmt-txt">Experience</span>');
      trackHtml.push('  <span class="cinema-fmt-count">' + Object.keys(cinemaFormatsSet).length + '</span>');
      trackHtml.push('</button>');

      var formatOrder = ['Regular', 'IMAX', 'ScreenX', "Director's Club"];
      formatOrder.forEach(function (f) {
        if (cinemaFormatsSet[f]) {
          var fSlug = f.toLowerCase().replace(/['\s]/g, '-');
          if (fSlug === "director-s-club") fSlug = "directors-club";
          trackHtml.push('<button type="button" class="cinema-fmt-btn" data-format="' + fSlug + '" role="tab" aria-selected="false">');
          trackHtml.push('  <span class="cinema-fmt-txt">' + escapeHtml(f) + '</span>');
          trackHtml.push('</button>');
        }
      });
      formatTrack.innerHTML = trackHtml.join('');

      // Wire format buttons
      var newFmtBtns = formatTrack.querySelectorAll('.cinema-fmt-btn');
      newFmtBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          newFmtBtns.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');

          var selFormat = btn.getAttribute('data-format'); // 'all', 'regular', etc.
          var mItems = moviesContainer.querySelectorAll('.cinema-movie-item');

          mItems.forEach(function (movieItem) {
            var rows = movieItem.querySelectorAll('.showtime-row');
            var visibleRowsCount = 0;

            rows.forEach(function (row) {
              var rowFormat = row.getAttribute('data-format');
              if (selFormat === 'all' || rowFormat === selFormat) {
                row.classList.remove('is-hidden');
                visibleRowsCount++;
              } else {
                row.classList.add('is-hidden');
              }
            });

            if (visibleRowsCount === 0) {
              movieItem.style.opacity = '0.35';
            } else {
              movieItem.style.opacity = '1';
            }
          });
        });
      });
    }

    // Render Movie Items
    var movieCardsHtml = [];

    Object.keys(moviesData).forEach(function (movieTitle) {
      var movieMeta = (TIGERTIX_DATA.movies && TIGERTIX_DATA.movies[movieTitle]) ? TIGERTIX_DATA.movies[movieTitle] : {
        title: movieTitle,
        badge: 'PG',
        meta: 'Now Showing',
        cast: '',
        poster: 'images/2-valid-ids.jpeg'
      };

      var fmtsObj = moviesData[movieTitle];

      movieCardsHtml.push('<article class="cinema-movie-item" data-movie="' + escapeHtml(movieTitle) + '">');
      movieCardsHtml.push('  <div class="cinema-movie-poster">');
      movieCardsHtml.push('    <img src="' + escapeHtml(movieMeta.poster) + '" alt="' + escapeHtml(movieTitle) + ' poster">');
      movieCardsHtml.push('  </div>');
      movieCardsHtml.push('  <div class="cinema-movie-info">');
      movieCardsHtml.push('    <h3 class="cinema-movie-title">');
      movieCardsHtml.push('      ' + escapeHtml(movieTitle));
      movieCardsHtml.push('      <span class="badge badge-pg">' + escapeHtml(movieMeta.badge || 'PG') + '</span>');
      movieCardsHtml.push('    </h3>');
      movieCardsHtml.push('    <p class="cinema-movie-meta">' + escapeHtml(movieMeta.meta) + '</p>');
      if (movieMeta.cast) {
        movieCardsHtml.push('    <p class="cinema-movie-cast">' + escapeHtml(movieMeta.cast) + '</p>');
      }
      movieCardsHtml.push('    <div class="showtime-rows">');

      Object.keys(fmtsObj).forEach(function (fmt) {
        var fSlug = fmt.toLowerCase().replace(/['\s]/g, '-');
        if (fSlug === "director-s-club") fSlug = "directors-club";

        var labelClass = 'format-label--' + fSlug;
        var times = fmtsObj[fmt] || [];

        movieCardsHtml.push('      <div class="showtime-row" data-format="' + fSlug + '">');
        movieCardsHtml.push('        <span class="format-label ' + labelClass + '">' + escapeHtml(fmt.toUpperCase()) + '</span>');
        movieCardsHtml.push('        <div class="time-slots">');

        times.forEach(function (t) {
          movieCardsHtml.push('          <button type="button" class="time-btn" data-movie="' + escapeHtml(movieTitle) + '" data-format="' + escapeHtml(fmt) + '" data-time="' + escapeHtml(t) + '">' + escapeHtml(t) + '</button>');
        });

        movieCardsHtml.push('        </div>');
        movieCardsHtml.push('      </div>');
      });

      movieCardsHtml.push('    </div>');
      movieCardsHtml.push('  </div>');
      movieCardsHtml.push('</article>');
    });

    moviesContainer.innerHTML = movieCardsHtml.join('');

    // Wire newly rendered time buttons
    var newTimeBtns = moviesContainer.querySelectorAll('.time-btn');
    newTimeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var movie = btn.getAttribute('data-movie') || 'Movie';
        var format = btn.getAttribute('data-format') || 'Regular';
        var time = btn.getAttribute('data-time') || btn.textContent.trim();
        showBookingToast(movie, format, time);
      });
    });
  }

  // Back to Cinema Directory View
  if (backToDirectoryBtn) {
    backToDirectoryBtn.addEventListener('click', function () {
      if (detailView) detailView.hidden = true;
      if (directoryView) {
        directoryView.hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Click handler for "View Showtimes" on each Cinema Card
  if (viewShowtimesBtns.length > 0) {
    viewShowtimesBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var cinemaId = btn.getAttribute('data-cinema');
        openCinemaDetail(cinemaId);
      });
    });
  }

  // Also make clicking the whole cinema card open its details
  if (cinemaCards.length > 0) {
    cinemaCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var cinemaId = card.getAttribute('data-id');
        openCinemaDetail(cinemaId);
      });
    });
  }

  // Filter logic for Cinema Directory
  function filterCinemas() {
    var query = locationSearchInput ? locationSearchInput.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    cinemaCards.forEach(function (card) {
      var name = (card.querySelector('.cinema-card-name')?.textContent || '').toLowerCase();
      var addr = (card.querySelector('.cinema-card-address')?.textContent || '').toLowerCase();
      var city = (card.getAttribute('data-city') || '').toLowerCase();
      var formats = (card.getAttribute('data-formats') || '').toLowerCase();

      var matchesQuery = !query || name.includes(query) || addr.includes(query) || city.includes(query);
      var matchesCity = activeCityFilter === 'all' || city === activeCityFilter.toLowerCase();
      var matchesExp = activeExpFilter === 'all' || formats.includes(activeExpFilter.toLowerCase());

      if (matchesQuery && matchesCity && matchesExp) {
        card.classList.remove('is-filtered-out');
        visibleCount++;
      } else {
        card.classList.add('is-filtered-out');
      }
    });

    if (countTextEl) {
      countTextEl.textContent = 'Showing ' + visibleCount + ' cinema' + (visibleCount === 1 ? '' : 's');
    }

    if (emptyStateEl) {
      emptyStateEl.hidden = visibleCount > 0;
    }
  }

  // Search input listeners
  if (locationSearchInput) {
    locationSearchInput.addEventListener('input', function () {
      if (searchClearBtn) searchClearBtn.hidden = !locationSearchInput.value;
      filterCinemas();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', function () {
      locationSearchInput.value = '';
      searchClearBtn.hidden = true;
      locationSearchInput.focus();
      filterCinemas();
    });
  }

  // City Pills Listener
  if (cityPills.length > 0) {
    cityPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        cityPills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        activeCityFilter = pill.getAttribute('data-city');
        filterCinemas();
      });
    });
  }

  // Experience Pills Listener
  if (expPills.length > 0) {
    expPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        expPills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        activeExpFilter = pill.getAttribute('data-exp');
        filterCinemas();
      });
    });
  }

  // Reset Filters Button
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function () {
      if (locationSearchInput) locationSearchInput.value = '';
      if (searchClearBtn) searchClearBtn.hidden = true;
      activeCityFilter = 'all';
      activeExpFilter = 'all';

      cityPills.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-city') === 'all');
      });
      expPills.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-exp') === 'all');
      });

      filterCinemas();
    });
  }

  // Check URL params for experience filter (e.g. cinema.html?exp=imax)
  (function initUrlExpFilter() {
    try {
      var params = new URLSearchParams(window.location.search);
      var expParam = params.get('exp');
      if (expParam) {
        expParam = expParam.toLowerCase().trim();
        if (expParam === "director's club" || expParam === "directors club" || expParam === "director-s-club") {
          expParam = "directors-club";
        }

        var matchedPill = null;
        expPills.forEach(function (p) {
          var pillExp = (p.getAttribute('data-exp') || '').toLowerCase();
          if (pillExp === expParam) {
            matchedPill = p;
          }
        });

        if (matchedPill) {
          expPills.forEach(function (p) { p.classList.remove('is-active'); });
          matchedPill.classList.add('is-active');
          activeExpFilter = matchedPill.getAttribute('data-exp');
          filterCinemas();

          // Smooth scroll to the cinema cards grid
          var gridSec = document.querySelector('.cinema-grid-section');
          if (gridSec) {
            setTimeout(function () {
              gridSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
      }
    } catch (e) {}
  })();

  // 1. Date selection
  if (dateCards.length > 0) {
    dateCards.forEach(function (card) {
      card.addEventListener('click', function () {
        dateCards.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-selected', 'false');
        });
        card.classList.add('is-active');
        card.setAttribute('aria-selected', 'true');
      });
    });
  }

  // 2. Format filtering inside Showtimes
  if (cinemaFmtBtns.length > 0) {
    cinemaFmtBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        cinemaFmtBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var selectedFormat = btn.getAttribute('data-format'); // 'all', 'regular', 'screenx', 'directors-club'

        cinemaMovieItems.forEach(function (movieItem) {
          var rows = movieItem.querySelectorAll('.showtime-row');
          var visibleRowsCount = 0;

          rows.forEach(function (row) {
            var rowFormat = row.getAttribute('data-format');
            if (selectedFormat === 'all' || rowFormat === selectedFormat) {
              row.classList.remove('is-hidden');
              visibleRowsCount++;
            } else {
              row.classList.add('is-hidden');
            }
          });

          // Dim or show movie item depending on whether it has matching formats
          if (visibleRowsCount === 0) {
            movieItem.style.opacity = '0.35';
          } else {
            movieItem.style.opacity = '1';
          }
        });
      });
    });
  }

  // 4. Time slot selection & Interactive Booking Toast
  var activeToastTimer = null;

  function showBookingToast(movieTitle, formatName, showTime) {
    var existingToast = document.querySelector('.booking-toast');
    if (existingToast) existingToast.remove();
    if (activeToastTimer) clearTimeout(activeToastTimer);

    var mallTitle = CINEMA_DATA[currentSelectedCinema] ? CINEMA_DATA[currentSelectedCinema].title : 'Glorietta 4';

    // Get currently selected date from the date selector
    var activeDateCard = document.querySelector('.date-card.is-active');
    var selectedDateText = activeDateCard ? (activeDateCard.getAttribute('data-date') || '') : 'Today 29';

    var toast = document.createElement('div');
    toast.className = 'booking-toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = [
      '<div class="booking-toast-info">',
      '  <h4>' + escapeHtml(movieTitle) + '</h4>',
      '  <p><span>' + escapeHtml(formatName) + '</span> &bull; ' + escapeHtml(showTime) + ' &bull; ' + escapeHtml(mallTitle) + '</p>',
      '</div>',
      '<button type="button" class="booking-toast-btn">Select Seats</button>',
      '<button type="button" class="booking-toast-close" aria-label="Close notification">&times;</button>'
    ].join('');

    document.body.appendChild(toast);

    var closeBtn = toast.querySelector('.booking-toast-close');
    closeBtn.addEventListener('click', function () {
      toast.remove();
    });

    var selectSeatsBtn = toast.querySelector('.booking-toast-btn');
    selectSeatsBtn.addEventListener('click', function () {
      selectSeatsBtn.textContent = 'Redirecting...';
      selectSeatsBtn.style.opacity = '0.8';
      setTimeout(function () {
        // Navigate directly to booking.html with step=3 (Select Seats) and pre-filled cinema, date, format, and time
        var movieEncoded = encodeURIComponent(movieTitle);
        var cinemaEncoded = encodeURIComponent(mallTitle);
        var formatEncoded = encodeURIComponent(formatName);
        var timeEncoded = encodeURIComponent(showTime);
        var dateEncoded = encodeURIComponent(selectedDateText);

        window.location.href = 'booking.html?movie=' + movieEncoded + 
          '&cinema=' + cinemaEncoded + 
          '&format=' + formatEncoded + 
          '&time=' + timeEncoded + 
          '&date=' + dateEncoded + 
          '&step=3';
        toast.remove();
      }, 300);
    });

    activeToastTimer = setTimeout(function () {
      if (toast && toast.parentNode) {
        toast.remove();
      }
    }, 7000);
  }

  if (timeBtns.length > 0) {
    timeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var movie = btn.getAttribute('data-movie') || 'Movie';
        var format = btn.getAttribute('data-format') || 'Regular';
        var time = btn.getAttribute('data-time') || btn.textContent.trim();

        showBookingToast(movie, format, time);
      });
    });
  }

  // Make entire movie container for Now Showing and Coming Soon clickable
  var movieCards = document.querySelectorAll('.movie-grid .movie-card');
  movieCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // If user directly clicked the action button/link, let default link action occur
      if (e.target.closest('a') || e.target.closest('button')) return;

      var link = card.querySelector('a.btn');
      if (link && link.href) {
        link.click();
      }
    });
  });
});
