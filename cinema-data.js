/**
 * TigerTix — Shared Cinema & Movie Showtime Data
 * Aligns cinema page showtimes and booking flow experiences & showtimes.
 */
var TIGERTIX_DATA = {
  // Movie details
  movies: {
    '2 Valid IDs': {
      title: '2 Valid IDs',
      badge: 'PG',
      meta: 'Drama • 1hr 33m • Released October 14 2026',
      cast: 'Cast: Joey Marquez, Pokwang, Zaijan Jaranilla, Meryl Soriano, Joem Bascon',
      poster: 'images/2-valid-ids.jpeg',
      reservedSeats: ['A3', 'A4', 'B5', 'B6', 'D1', 'D2', 'F4']
    },
    'The Odyssey': {
      title: 'The Odyssey',
      badge: 'PG',
      meta: 'Action • 2hrs 53m • Released July 15 2026',
      cast: 'Cast: Tom Holland, Robert Pattinson, Matt Damon, Anne Hathaway',
      poster: 'images/the-odyssey.jpg',
      reservedSeats: ['C3', 'C4', 'C5', 'D5', 'D6', 'E7', 'E8', 'F9', 'F10']
    },
    'Toy Story 5': {
      title: 'Toy Story 5',
      badge: 'PG',
      meta: 'Animation • 1hr 42m • Released June 17 2026',
      cast: 'Cast: Tom Hanks, Tim Allen, Joan Cusack',
      poster: 'images/toystory-5.jpg',
      reservedSeats: ['A1', 'A2', 'B3', 'B4', 'C7', 'C8', 'D4', 'E2', 'E3', 'F5']
    },
    'Wicked: For Good': {
      title: 'Wicked: For Good',
      badge: 'PG',
      meta: 'Fantasy/Adventure • 2hr 18m • Releasing November 2026',
      cast: 'Cast: Cynthia Erivo, Ariana Grande, Jonathan Bailey, Ethan Slater, Jeff Goldblum',
      poster: 'images/wicked.jpeg',
      reservedSeats: ['A5', 'A6', 'B1', 'B2', 'C9', 'C10', 'D7', 'D8']
    },
    'Moana': {
      title: 'Moana',
      badge: 'PG',
      meta: 'Animation • 1hr 55m • Releasing December 2026',
      cast: "Cast: Auli'i Cravalho, Dwayne Johnson, Rachel House, Temuera Morrison",
      poster: 'images/moana.jpeg',
      reservedSeats: ['B7', 'B8', 'C1', 'C2', 'D9', 'D10', 'E4', 'E5']
    },
    'Spider-Man: Brand New Day': {
      title: 'Spider-Man: Brand New Day',
      badge: 'PG',
      meta: 'Action/Adventure • 2hr 55m • Releasing December 2026',
      cast: 'Cast: Tom Holland, Zendaya, Jacob Batalon',
      poster: 'images/spiderman.jpeg',
      reservedSeats: ['A7', 'A8', 'B9', 'B10', 'C5', 'C6', 'D3', 'D4', 'F1', 'F2']
    }
  },

  // Cinema to movie showtimes mapping
  // Formats per cinema:
  // glorietta: Regular, ScreenX, Director's Club
  // moa: Regular, IMAX
  // galleria: Regular
  // newport: Regular, Director's Club
  // uptown: Regular, ScreenX
  // north-edsa: Regular, IMAX
  cinemas: {
    glorietta: {
      name: 'Glorietta 4',
      addr: 'Ayala Center, Makati City',
      city: 'Makati',
      formats: ['Regular', 'ScreenX', "Director's Club"],
      movies: {
        '2 Valid IDs': {
          'Regular': ['11:30 AM', '12:10 PM', '2:35 PM', '5:00 PM'],
          "Director's Club": ['7:30 PM', '9:45 PM']
        },
        'The Odyssey': {
          'Regular': ['11:30 AM', '1:00 PM', '3:45 PM', '6:30 PM'],
          'ScreenX': ['7:30 PM', '9:45 PM']
        },
        'Toy Story 5': {
          'Regular': ['10:30 AM', '1:15 PM', '4:00 PM'],
          'ScreenX': ['6:45 PM']
        }
      }
    },
    moa: {
      name: 'SM Mall of Asia',
      addr: 'Pasay City',
      city: 'Pasay',
      formats: ['Regular', 'IMAX'],
      movies: {
        '2 Valid IDs': {
          'Regular': ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM']
        },
        'The Odyssey': {
          'Regular': ['11:00 AM', '2:30 PM', '6:00 PM'],
          'IMAX': ['1:45 PM', '6:15 PM', '9:30 PM']
        },
        'Toy Story 5': {
          'Regular': ['11:15 AM', '2:00 PM', '4:45 PM'],
          'IMAX': ['12:30 PM', '5:15 PM']
        }
      }
    },
    galleria: {
      name: "Robinsons Galleria",
      addr: 'Ortigas Avenue, Quezon City',
      city: 'Quezon',
      formats: ['Regular'],
      movies: {
        '2 Valid IDs': {
          'Regular': ['11:00 AM', '1:45 PM', '4:30 PM', '7:15 PM']
        },
        'The Odyssey': {
          'Regular': ['12:00 PM', '3:15 PM', '6:45 PM', '9:50 PM']
        },
        'Toy Story 5': {
          'Regular': ['10:45 AM', '1:30 PM', '4:15 PM']
        }
      }
    },
    newport: {
      name: 'Newport Mall',
      addr: 'Newport Blvd, Pasay City',
      city: 'Pasay',
      formats: ['Regular', "Director's Club"],
      movies: {
        '2 Valid IDs': {
          'Regular': ['11:30 AM', '2:15 PM', '5:00 PM'],
          "Director's Club": ['6:00 PM', '8:30 PM']
        },
        'The Odyssey': {
          'Regular': ['12:30 PM', '4:00 PM', '7:30 PM'],
          "Director's Club": ['1:00 PM', '5:30 PM', '9:15 PM']
        },
        'Toy Story 5': {
          'Regular': ['11:00 AM', '1:40 PM', '4:20 PM'],
          "Director's Club": ['3:30 PM', '7:00 PM']
        }
      }
    },
    uptown: {
      name: 'Uptown Mall',
      addr: '9th Ave, Taguig City',
      city: 'Taguig',
      formats: ['Regular', 'ScreenX'],
      movies: {
        '2 Valid IDs': {
          'Regular': ['10:45 AM', '1:30 PM', '4:15 PM', '7:00 PM']
        },
        'The Odyssey': {
          'Regular': ['11:15 AM', '2:45 PM', '6:15 PM'],
          'ScreenX': ['1:00 PM', '4:30 PM', '8:00 PM']
        },
        'Toy Story 5': {
          'Regular': ['12:00 PM', '2:40 PM', '5:20 PM'],
          'ScreenX': ['3:15 PM', '6:30 PM']
        }
      }
    },
    'north-edsa': {
      name: 'SM City North EDSA',
      addr: 'North Avenue, Quezon City',
      city: 'Quezon',
      formats: ['Regular', 'IMAX'],
      movies: {
        '2 Valid IDs': {
          'Regular': ['10:30 AM', '1:15 PM', '4:00 PM', '6:45 PM']
        },
        'The Odyssey': {
          'Regular': ['12:15 PM', '3:45 PM', '7:15 PM'],
          'IMAX': ['11:30 AM', '3:00 PM', '6:30 PM', '9:45 PM']
        },
        'Toy Story 5': {
          'Regular': ['11:00 AM', '1:30 PM', '4:00 PM'],
          'IMAX': ['1:00 PM', '4:30 PM']
        }
      }
    }
  }
};

// Helper: normalize cinema key
function getCinemaKey(cinemaNameOrId) {
  if (!cinemaNameOrId) return 'glorietta';
  var s = cinemaNameOrId.toLowerCase().trim();
  if (s.indexOf('glorietta') !== -1) return 'glorietta';
  if (s.indexOf('mall of asia') !== -1 || s === 'moa') return 'moa';
  if (s.indexOf('galleria') !== -1) return 'galleria';
  if (s.indexOf('newport') !== -1) return 'newport';
  if (s.indexOf('uptown') !== -1) return 'uptown';
  if (s.indexOf('north edsa') !== -1 || s.indexOf('north-edsa') !== -1) return 'north-edsa';
  return 'glorietta';
}

if (typeof window !== 'undefined') {
  window.TIGERTIX_DATA = TIGERTIX_DATA;
  window.getCinemaKey = getCinemaKey;
}
