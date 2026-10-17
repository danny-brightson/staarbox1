// The ONE file that names the API and its hosts (8L §1). It chooses by
// location.hostname; on any other host the shop stays closed.

// shopOpen is the shop switch, per host, and the safe state is the default:
// the live site stays closed until switch day's ~15:30 step flips its one line
// (switch-day.md); false is also the way back. Closed, the shop pages say
// "Ordering on the website opens soon" with the store buttons.
const LIVE = {
  api: 'https://app.staarbox.in',
  signIn: 'firebase',
  terms: 'https://app.staarbox.in/terms',
  privacy: 'https://app.staarbox.in/privacy',
  shopOpen: false,
};

// The builder's local tests: the test server serves the site and passes
// /api and /media on to the test API, so the API is this same origin.
const LOCAL = { api: '', signIn: 'dev', terms: '/terms', privacy: '/privacy', shopOpen: true };

const SITES = {
  'www.staarbox.in': LIVE,
  'staging-www.200-97-162-248.sslip.io': {
    api: 'https://staging-api.200-97-162-248.sslip.io',
    signIn: 'dev', // staging runs OTP_PROVIDER=dev: the code is in the team note
    terms: 'https://staging-www.200-97-162-248.sslip.io/terms',
    privacy: 'https://staging-www.200-97-162-248.sslip.io/privacy',
    shopOpen: true,
  },
  localhost: LOCAL,
  '127.0.0.1': LOCAL,
};

/** This host's settings, or null: an unknown host keeps the shop closed. */
export const SITE = Object.hasOwn(SITES, location.hostname) ? SITES[location.hostname] : null;

/** Whether this host's shop is open (any other host: closed). */
export const SHOP_OPEN = SITE?.shopOpen === true;

/** The Terms and Privacy links; an unknown host shows the live ones. */
export const LEGAL = { terms: (SITE ?? LIVE).terms, privacy: (SITE ?? LIVE).privacy };

export const STORES = {
  play: 'https://play.google.com/store/apps/details?id=com.staarbox.staarbox',
  apple: 'https://apps.apple.com/app/id6755515436',
};

// The public Firebase web app the old site used for phone sign-in (project
// staarbox-91945). These are public ids, not secrets.
export const FIREBASE_WEB = {
  apiKey: 'AIzaSyD78WXxyUeHl_rIlnRSQydj9WN0Ss4jqMs', // gitleaks:allow (a public Firebase web id)
  authDomain: 'staarbox-91945.firebaseapp.com',
  projectId: 'staarbox-91945',
  storageBucket: 'staarbox-91945.firebasestorage.app',
  messagingSenderId: '591533689732',
  appId: '1:591533689732:web:45f6abb7dbe9e42508ebd1',
};
