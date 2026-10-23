// The Terms page: the links to the new Terms of Use and Privacy Policy, from config.js.
import { LEGAL } from './config.js';

document.getElementById('termsLink')?.setAttribute('href', LEGAL.terms);
document.getElementById('privacyLink')?.setAttribute('href', LEGAL.privacy);
