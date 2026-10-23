// The home page (8L): the live "Our Menu", the FAQ, the sliders and the
// reviews. All of it was inline before; the page now has no inline script.
import { SITE } from './config.js';
import { loadMenu, specText } from './catalog.js';
import { appPanel, el, rupees } from './ui.js';
import { W } from './words.js';

// ---- "Our Menu": the live menu, one tab per category; a card's button goes to /Menu/ ----

const TIERS = ['tier-bowls', 'tier-monthly', 'tier-premium', 'tier-jar'];
const BADGES = ['b-bowls', 'b-monthly', 'b-premium', 'b-jar'];

async function ourMenu() {
  const tabs = document.getElementById('pd-tabs');
  const grid = document.getElementById('pd-grid');
  let menu = null;
  try {
    if (SITE) menu = await loadMenu();
  } catch {
    menu = null;
  }
  if (!menu?.length) {
    // Never an empty grid and never old prices: one calm line and the app.
    tabs.replaceChildren();
    grid.replaceChildren(
      el('div', { class: 'pd-fallback' }, appPanel(`${W.menuFailed} ${W.menuFallback}`)),
    );
    return;
  }
  const show = (i) => {
    [...tabs.children].forEach((b, j) => {
      b.classList.toggle('active', i === j);
      b.setAttribute('aria-selected', String(i === j));
    });
    grid.replaceChildren(...menu[i].products.map((p) => card(p, i)));
  };
  tabs.replaceChildren(
    ...menu.map((shelf, i) =>
      el(
        'button',
        { type: 'button', class: 'pd-tab', role: 'tab', onclick: () => show(i) },
        shelf.shortName ?? shelf.name,
      ),
    ),
  );
  show(0);
}

function card(p, i) {
  const off = p.isAvailable === false;
  return el(
    'div',
    { class: `pd-card ${TIERS[i % TIERS.length]}${off ? ' pd-off' : ''}` },
    el('div', { class: 'pd-stripe' }),
    p.imageUrl
      ? el('img', { class: 'pd-img', src: p.imageUrl, alt: p.name, loading: 'lazy' })
      : null,
    el(
      'div',
      { class: 'pd-body' },
      el(
        'span',
        { class: `pd-badge ${BADGES[i % BADGES.length]}` },
        p.badge ?? p.categoryName ?? '',
      ),
      el('p', { class: 'pd-name' }, p.name),
      el(
        'div',
        { class: 'pd-price' },
        el('sup', {}, '₹'),
        rupees(p.price).slice(1),
        el('span', { class: 'pd-mo' }, `/${p.billingCycle?.shortLabel ?? '26d'}`),
      ),
      el(
        'div',
        { class: 'pd-feats' },
        (p.specifications ?? [])
          .slice(0, 4)
          .map((s) => el('div', { class: 'pd-feat' }, el('div', { class: 'pd-dot' }), specText(s))),
      ),
      off
        ? el('p', { class: 'pd-off-note' }, W.unavailable)
        : el(
            'a',
            { class: 'pd-go', href: './Menu/', 'aria-label': `${W.subscribe}: ${p.name}` },
            W.subscribe,
          ),
    ),
  );
}

void ourMenu();

// ---- The FAQ (as it was) ----

document.addEventListener('DOMContentLoaded', () => {
  const categoryTitles = document.querySelectorAll('.faq-category-title');
  const faqItems = document.querySelectorAll('.faq-item');

  // Toggle category sections (multiple allowed)
  categoryTitles.forEach((title) => {
    title.addEventListener('click', () => {
      const category = title.parentElement;
      category.classList.toggle('open');
    });
  });

  function setupFAQ() {
    if (window.innerWidth >= 1025) {
      // Desktop hover behavior
      faqItems.forEach((item) => {
        item.onclick = null;
        const mobileAnswer = item.querySelector('.answer');
        if (mobileAnswer) mobileAnswer.remove();

        item.onmouseenter = () => {
          const category = item.closest('.faq-category');
          const answerBox = category.querySelector('.faq-answer-box');
          const isLeftCategory = category.classList.contains('left-side');

          const offsetTop = item.offsetTop;
          const itemHeight = item.offsetHeight;
          const itemWidth = item.offsetWidth;

          // Positioning answer box
          answerBox.style.position = 'absolute';
          answerBox.style.top = `${offsetTop}px`;
          answerBox.style.height = `${itemHeight}px`;
          answerBox.style.width = `${itemWidth}px`;

          if (isLeftCategory) {
            answerBox.style.left = `${itemWidth + 10}px`;
            answerBox.style.right = 'auto';
          } else {
            answerBox.style.right = `${itemWidth + 10}px`;
            answerBox.style.left = 'auto';
          }

          answerBox.textContent = item.dataset.answer;
          answerBox.classList.add('active');
        };

        item.onmouseleave = () => {
          const category = item.closest('.faq-category');
          const answerBox = category.querySelector('.faq-answer-box');
          answerBox.classList.remove('active');
          answerBox.textContent = '';
          answerBox.style.cssText = '';
        };
      });
    } else {
      // Mobile & Tablet behavior: click toggles inline answer
      faqItems.forEach((item) => {
        item.onmouseenter = null;
        item.onmouseleave = null;

        if (!item.querySelector('.answer')) {
          const answerText = item.dataset.answer;
          const answerDiv = document.createElement('div');
          answerDiv.classList.add('answer');
          answerDiv.textContent = answerText;
          answerDiv.style.display = 'none';
          item.appendChild(answerDiv);
        }

        item.onclick = () => {
          const answerDiv = item.querySelector('.answer');
          const isVisible = answerDiv.style.display === 'block';
          answerDiv.style.display = isVisible ? 'none' : 'block';
          item.classList.toggle('active');
        };
      });
    }
  }

  setupFAQ();
  window.addEventListener('resize', setupFAQ);
});

// ---- The sliders (as they were) ----

// Each was its own inline script before, so one failing (the old "Why Us"
// box has no direct .swiper-wrapper) never stopped the others: keep it so.
function slider(selector, options) {
  try {
    new window.Swiper(selector, options);
  } catch {
    // as before: that slider stays still
  }
}

slider('.swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

slider('.zone-swiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 5000, // 5 seconds between slides
    disableOnInteraction: false, // keeps autoplay after manual swipe
  },
  pagination: {
    el: '.zone-swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.zone-swiper-button-next',
    prevEl: '.zone-swiper-button-prev',
  },
});

slider('.wrapper', {
  loop: true,
  spaceBetween: 30,

  // Autoplay
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  // Pagination bullets
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// ---- The reviews (as they were, drawn with textContent) ----

const REVIEWS = [
  {
    name: 'Prakashraj',
    initials: 'PR',
    color: '#e1f5ee',
    textColor: '#085041',
    stars: 5,
    text: 'Fresh fruits, neat packaging and on-time delivery every day. Really satisfied with the quality and service. Highly recommended in Madurai.',
  },
  {
    name: 'Sarrah',
    initials: 'S',
    color: '#fdf4ff',
    textColor: '#7e22ce',
    stars: 5,
    text: 'Perfect for busy mornings. Ready-to-eat healthy boxes save a lot of time and make healthy eating effortless.',
  },
  {
    name: 'Bharu Kutty',
    initials: 'BK',
    color: '#eff6ff',
    textColor: '#1d4ed8',
    stars: 5,
    text: 'One of the best healthy food services in Madurai. Consistent quality, fresh products, and professional service.',
  },
  {
    name: 'Arnikashree A',
    initials: 'AA',
    color: '#fff7ed',
    textColor: '#c2410c',
    stars: 5,
    text: 'Premium quality food and packaging was professional and impressive. Everything arrived fresh and well presented.',
  },
  {
    name: 'Saratha Kasirajan',
    initials: 'SK',
    color: '#fdf4ff',
    textColor: '#7e22ce',
    stars: 5,
    text: 'Fresh fruits and good packaging. Service was also great. Overall, it was a wonderful experience with Staarbox.',
  },
  {
    name: 'Elayavel Anitha',
    initials: 'EA',
    color: '#e1f5ee',
    textColor: '#085041',
    stars: 5,
    text: 'I started with Staarbox just to try it out, but now I cannot imagine my mornings without it. Fresh fruits arrive on time with great variety and excellent quality every day.',
  },
  {
    name: 'Mohammed Siraj',
    initials: 'MS',
    color: '#eff6ff',
    textColor: '#1d4ed8',
    stars: 5,
    text: 'Very convenient and reliable service. Great packaging, fresh products, and friendly customer support.',
  },
  {
    name: 'Mounish',
    initials: 'M',
    color: '#fff7ed',
    textColor: '#c2410c',
    stars: 5,
    text: 'The fruit variety is impressive and the freshness is noticeable. Definitely worth the subscription.',
  },
  {
    name: 'Ashwini Murugan',
    initials: 'AM',
    color: '#fdf4ff',
    textColor: '#7e22ce',
    stars: 5,
    text: 'Loved the premium fruit box. Fresh, tasty, and delivered early every morning without delay.',
  },
  {
    name: 'Inoshel Revani',
    initials: 'IR',
    color: '#e1f5ee',
    textColor: '#085041',
    stars: 5,
    text: 'Healthy breakfast made easy with Staarbox. The fruits and nuts are always fresh, delicious, and perfectly packed.',
  },
];

function stars(n) {
  return [1, 2, 3, 4, 5].map((i) =>
    el('span', { class: `rv-star ${i <= n ? 'filled' : 'empty'}` }, i <= n ? '★' : '☆'),
  );
}

function reviewCard(d) {
  const initials = el('div', { class: 'rv-initials' }, d.initials);
  initials.style.background = d.color;
  initials.style.color = d.textColor;
  return el(
    'div',
    { class: 'rv-card' },
    el(
      'div',
      { class: 'rv-top' },
      initials,
      el(
        'div',
        { class: 'rv-meta' },
        el('div', { class: 'rv-name' }, d.name),
        d.prof ? el('div', { class: 'rv-prof' }, d.prof) : null,
      ),
      el('div', { class: 'rv-stars' }, stars(d.stars)),
    ),
    el('div', { class: 'rv-quote-mark' }, '"'),
    el('p', { class: 'rv-text' }, d.text),
  );
}

// Twice over, for the endless scroll.
document.getElementById('rv-track')?.replaceChildren(...[...REVIEWS, ...REVIEWS].map(reviewCard));
