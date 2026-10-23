const slides = document.querySelectorAll('.slide');
  const tabs = document.querySelectorAll('.plan-tab');
  const stage = document.getElementById('stage');
  const blobLayer = document.getElementById('blobLayer');

  const themes = [
    { bg: 'linear-gradient(135deg,#3E6B4F,#1F3D2E)', blobs:['rgba(255,255,255,0.25)','rgba(201,161,90,0.2)'] },
    { bg: 'linear-gradient(135deg,#C9A15A,#8A6B3B)', blobs:['rgba(255,255,255,0.25)','rgba(31,61,46,0.2)'] },
    { bg: 'linear-gradient(135deg,#8FB89C,#527C63)', blobs:['rgba(255,255,255,0.3)','rgba(255,255,255,0.15)'] },
    { bg: 'linear-gradient(135deg,#E8A54B,#C9713A)', blobs:['rgba(255,255,255,0.3)','rgba(255,255,255,0.15)'] }
  ];

  let current = 0;

  function renderBlobs(theme){
    blobLayer.innerHTML = `
      <div class="stage-blob" style="width:340px;height:340px;background:radial-gradient(circle, ${theme.blobs[0]}, transparent 70%); top:-80px; left:-80px;"></div>
      <div class="stage-blob" style="width:280px;height:280px;background:radial-gradient(circle, ${theme.blobs[1]}, transparent 70%); bottom:-60px; right:-60px; animation-delay:3s;"></div>
    `;
  }

  function goToSlide(i){
    current = i;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    tabs.forEach((t, idx) => t.classList.toggle('active', idx === i));
    stage.style.background = themes[i].bg;
    renderBlobs(themes[i]);
  }

  function changeSlide(dir){
    let next = current + dir;
    if(next < 0) next = slides.length - 1;
    if(next >= slides.length) next = 0;
    goToSlide(next);
  }

  goToSlide(0);

  // API-backed prices take precedence over the design mock prices.
  function livePlanPrice(d, fallbackPrice, fallbackDay) {
    if (d && Number.isFinite(d.__apiPrice)) {
      const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(d.__apiPrice);
      const day = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(d.__apiPrice / 26);
      return { price: `${price} <span>/${d.__apiCycle || '26d'}</span>`, day: `${day} / day` };
    }
    if (window.__SBX_CATALOG_READY) return { price: 'Price unavailable', day: 'See app for pricing' };
    return { price: `${fallbackPrice} <span>/month</span>`, day: fallbackDay };
  }

  // ---------------- DAILY NUTRITION BOXES DATA ----------------
  const boxData = window.__SBX_BOX_DATA = {
    kids:     { veg:{ name:'Kids Veg Box', visual:'<img src="./Image/kid-veg-box.png" alt="Kids Veg Box">', headline:'Healthy Habits<br>Start Young.', desc:'Nutritious, colourful and kid-friendly fruits packed for growing children.', protein:'15–20g Protein', weight:'250–300g', price:'₹2,299', day:'₹88 / day', highlights:['2 Fruits','1 Vegetable','Seeds, Nuts, Sprouts'] },
              nonveg:{ name:'Kids Non-Veg Box', visual:'<img src="./Image/kid box.png" alt="Kids Non-Veg Box">', headline:'Healthy Habits<br>Start Young.', desc:'Nutritious, colourful and kid-friendly fruits with added egg protein for growing children.', protein:'15–20g Protein', weight:'250–300g', price:'₹2,299', day:'₹88 / day', highlights:['2 Fruits','1 Vegetable','1 Egg','Seeds, Nuts, Sprouts'] } },
    standard: { veg:{ name:'Standard Veg Box', visual:'<img src="./Image/standard-veg-box.png" alt="Standard Veg Box">', headline:'Balanced Nutrition.<br>Every Day.', desc:'Perfect daily nutrition for professionals and families.', protein:'20–25g Protein', weight:'300–350g', price:'₹2,829', day:'₹109 / day', highlights:['3 Fruits','1 Vegetable','Seeds, Nuts, Sprouts'] },
              nonveg:{ name:'Standard Non-Veg Box', visual:'<img src="./Image/standard-box.png" alt="Standard Non-Veg Box">', headline:'Balanced Nutrition.<br>Every Day.', desc:'Perfect daily nutrition for professionals and families, with added egg protein.', protein:'20–25g Protein', weight:'300–350g', price:'₹2,829', day:'₹109 / day', highlights:['3 Fruits','1 Vegetable','1 Egg','Seeds, Nuts, Sprouts'] } },
    premium:  { veg:{ name:'Premium Veg Box', visual:'<img src="./Image/premium-veg-box.png" alt="Premium Veg Box">', headline:'Maximum Nutrition.<br>Maximum Performance.', desc:'Designed for active lifestyles with the highest protein, fruits, nuts, sprouts and legumes.', protein:'27–33g Protein', weight:'400–450g', price:'₹3,499', day:'₹134 / day', highlights:['4 Fruits','1 Vegetable','Seeds, Nuts, Sprouts'] },
              nonveg:{ name:'Premium Non-Veg Box', visual:'<img src="./Image/premium-box.png" alt="Premium Non-Veg Box">', headline:'Maximum Nutrition.<br>Maximum Performance.', desc:'Designed for active lifestyles with the highest protein, fruits, nuts, sprouts, legumes and egg.', protein:'27–33g Protein', weight:'400–450g', price:'₹3,499', day:'₹134 / day', highlights:['4 Fruits','1 Vegetable','1 Egg','Seeds, Nuts, Sprouts'] } }
  };
  let boxTier = 'kids', boxNonVeg = false;

  function renderBox(){
    const slide = document.querySelector('.slide[data-index="0"]');
    const d = boxData[boxTier][boxNonVeg ? 'nonveg' : 'veg'];
    slide.querySelector('[data-field="visual"]').innerHTML = d.visual;
    slide.querySelector('[data-field="protein"]').textContent = d.protein;
    slide.querySelector('[data-field="weight"]').textContent = d.weight;
    slide.querySelector('[data-field="headline"]').innerHTML = d.headline;
    slide.querySelector('[data-field="desc"]').textContent = d.desc;
    const live = livePlanPrice(d, d.price, d.day);
    slide.querySelector('[data-field="price"]').innerHTML = live.price;
    slide.querySelector('[data-field="day"]').textContent = live.day;
    slide.querySelector('[data-field="highlights"]').innerHTML = d.highlights.map(h=>`<span class="highlight-chip">${h}</span>`).join('');
    slide.querySelector('[data-field="btn"]').textContent = 'Choose ' + d.name;
  }
  window.__SBX_RENDER_BOX = renderBox;
  function setBoxTier(tier, btn){ boxTier = tier; btn.parentElement.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderBox(); }
  function setBoxVeg(nv, btn){ boxNonVeg = nv; btn.parentElement.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderBox(); }

  function exploreBoxPlan(){
    const productPages = {
      kids:     { veg: './Kid%20veg.html', nonveg: './Kid.html' },
      standard: { veg: './Standard%20veg.html', nonveg: './Standard.html' },
      premium:  { veg: './Premium%20veg.html', nonveg: './product.html' }
    };
    window.location.href = productPages[boxTier][boxNonVeg ? 'nonveg' : 'veg'];
  }

  // ---------------- SANDWICH COLLECTION DATA ----------------
  const sandData = window.__SBX_SAND_DATA = {
    kids:     { veg:{ name:'Kids Veg Sandwich', visual:'<img src="./Image/kids-veg-sandwich.png" alt="Kids Veg Sandwich">', protein:'20–25g Protein', weight:'400–450g', price:'₹2,899', day:'₹111 / day', highlights:['1 Sandwich','1 Seasonal Fruit','1 Fresh Vegetable','1 Nut','1 Seed','2 Legumes / Sprouts'] },
              nonveg:{ name:'Kids Non-Veg Sandwich', visual:'<img src="./Image/kids-non-veg-sandwich.png" alt="Kids Non-Veg Sandwich">', protein:'20–25g Protein', weight:'400–450g', price:'₹3,549', day:'₹136 / day', highlights:['1 Sandwich','1 Seasonal Fruit','1 Fresh Vegetable','1 Nut','1 Seed','1 Egg','1 Legume / Sprout'] } },
    standard: { veg:{ name:'Standard Veg Sandwich', visual:'<img src="./Image/standard-veg-sandwich.png" alt="Standard Veg Sandwich">', protein:'25–30g Protein', weight:'500–550g', price:'₹3,730', day:'₹143 / day', highlights:['1 Sandwich','2 Seasonal Fruits','1 Fresh Vegetable','1 Nut','1 Seed','2 Legumes / Sprouts'] },
              nonveg:{ name:'Standard Non-Veg Sandwich', visual:'<img src="./Image/standard-non-veg-sandwich.png" alt="Standard Non-Veg Sandwich">', protein:'25–30g Protein', weight:'500–550g', price:'₹4,069', day:'₹156 / day', highlights:['1 Sandwich','2 Seasonal Fruits','1 Fresh Vegetable','1 Nut','1 Seed','1 Egg','1 Legume / Sprout'] } },
    premium:  { veg:{ name:'Premium Veg Sandwich', visual:'<img src="./Image/preium-veg-sandwich.png" alt="Premium Veg Sandwich">', protein:'30–35g Protein', weight:'600–650g', price:'₹4,589', day:'₹176 / day', highlights:['1 Sandwich','3 Seasonal Fruits','1 Fresh Vegetable','1 Nut','1 Seed','2 Legumes / Sprouts'] },
              nonveg:{ name:'Premium Non-Veg Sandwich', visual:'<img src="./Image/Premium-non-veg-sandwich.png" alt="Premium Non-Veg Sandwich">', protein:'30–35g Protein', weight:'600–650g', price:'₹4,849', day:'₹186 / day', highlights:['1 Sandwich','3 Seasonal Fruits','1 Fresh Vegetable','1 Nut','1 Seed','1 Egg','1 Legume / Sprout'] } }
  };
  let sandTier = 'kids', sandNonVeg = false;

  function renderSand(){
    const slide = document.querySelector('.slide[data-index="1"]');
    const d = sandData[sandTier][sandNonVeg ? 'nonveg' : 'veg'];
    slide.querySelector('[data-field="visual"]').innerHTML = d.visual;
    slide.querySelector('[data-field="protein"]').textContent = d.protein;
    slide.querySelector('[data-field="weight"]').textContent = d.weight;
    const live = livePlanPrice(d, d.price, d.day);
    slide.querySelector('[data-field="price"]').innerHTML = live.price;
    slide.querySelector('[data-field="day"]').textContent = live.day;
    slide.querySelector('[data-field="highlights"]').innerHTML = d.highlights.map(h=>`<span class="highlight-chip">${h}</span>`).join('');
    slide.querySelector('[data-field="btn"]').textContent = 'Choose ' + d.name;
  }
  window.__SBX_RENDER_SAND = renderSand;
  function setSandTier(tier, btn){ sandTier = tier; btn.parentElement.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderSand(); }
  function setSandVeg(nv, btn){ sandNonVeg = nv; btn.parentElement.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderSand(); }
  function exploreSandwichPlan(){
    const sandwichPages = {
      kids: { veg: './Kid%20veg%20sandwhich.html', nonveg: './Kid%20Non%20veg%20sandwhich.html' },
      standard: { veg: './Standard%20veg%20sandwhich.html', nonveg: './Standard%20Non%20veg%20sandwhich.html' },
      premium: { veg: './Premium%20veg%20sandwhich.html', nonveg: './Premium%20Non%20veg%20sandwhich.html' }
    };
    window.location.href = sandwichPages[sandTier][sandNonVeg ? 'nonveg' : 'veg'];
  }

  // ---------------- FRESH BOWLS DATA ----------------
  const bowlData = window.__SBX_BOWL_DATA = {
    essential:{ visual:'<img src="./Image/Essential Bowl.png" alt="Essential Bowl">', headline:'Simple.<br>Fresh.<br>Everyday.', desc:'Daily fruit bowl made for healthy routines.', weight:'200–240g', price:'₹1,199', day:'₹46 / day', highlights:['4 Fruits','1 Vegetable'] },
    elite:{ visual:'<img src="./Image/Elite Bowl.png" alt="Elite Bowl">', headline:'Premium Fresh Bowl.', desc:'Exotic fruits with carefully selected vegetables for complete freshness.', weight:'200–240g', price:'₹1,699', day:'₹65 / day', highlights:['5 Fruits','1 Vegetable'] }
  };

  function renderBowl(tier){
    const slide = document.querySelector('.slide[data-index="2"]');
    const d = bowlData[tier];
    slide.querySelector('[data-field="visual"]').innerHTML = d.visual;
    slide.querySelector('[data-field="weight"]').textContent = d.weight;
    slide.querySelector('[data-field="headline"]').innerHTML = d.headline;
    slide.querySelector('[data-field="desc"]').textContent = d.desc;
    const live = livePlanPrice(d, d.price, d.day);
    slide.querySelector('[data-field="price"]').innerHTML = live.price;
    slide.querySelector('[data-field="day"]').textContent = live.day;
    slide.querySelector('[data-field="highlights"]').innerHTML = d.highlights.map(h=>`<span class="highlight-chip">${h}</span>`).join('');
    slide.querySelector('[data-field="btn"]').textContent = 'Choose ' + (tier === 'essential' ? 'Essential Bowl' : 'Elite Bowl');
  }
  window.__SBX_RENDER_BOWL = renderBowl;
  function setBowlTier(tier, btn){ btn.parentElement.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderBowl(tier); }

  function exploreBowlPlan(){
    const bowlPages = {
      essential: './Essential%20Bowl.html',
      elite: './Elite%20Bowl.html'
    };
    const selectedTier = document.querySelector('.slide[data-index="2"] .toggle-btn.active')?.textContent?.trim().toLowerCase() || 'essential';
    const page = bowlPages[selectedTier === 'elite' ? 'elite' : 'essential'];
    window.location.href = page;
  }

/* All base content is visible via pure CSS by default (see .reveal / stat-num
   defaults). Everything below is a small progressive enhancement — if it
   never runs, the page still looks complete. */

// ripple on primary CTA
document.getElementById('primaryBtn').addEventListener('click', function(e){
  const btn = this;
  const circle = document.createElement('span');
  const d = Math.max(btn.clientWidth, btn.clientHeight);
  circle.className = 'ripple';
  circle.style.width = circle.style.height = d + 'px';
  circle.style.left = (e.clientX - btn.getBoundingClientRect().left - d/2) + 'px';
  circle.style.top = (e.clientY - btn.getBoundingClientRect().top - d/2) + 'px';
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
});


document.documentElement.classList.add('js-enabled');

const appPanes = document.querySelectorAll('.pane');
const appTabs = document.querySelectorAll('.tab-icon');
const appFeatures = document.querySelectorAll('.app-feature');

function setAppActive(name){
  appPanes.forEach(p => p.classList.toggle('active', p.dataset.pane === name));
  appTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  appFeatures.forEach(f => f.classList.toggle('active', f.dataset.feature === name));
}

appTabs.forEach(t => t.addEventListener('click', ()=> setAppActive(t.dataset.tab)));
appFeatures.forEach(f => f.addEventListener('click', ()=> setAppActive(f.dataset.feature)));

let appAuto = ['menu','wallet','calendar'];
let appIdx = 0;
let appAutoTimer = setInterval(()=>{
  appIdx = (appIdx + 1) % appAuto.length;
  setAppActive(appAuto[appIdx]);
}, 3800);
[...appTabs, ...appFeatures].forEach(el => el.addEventListener('click', ()=> clearInterval(appAutoTimer)));

(function buildCalendar(){
  const grid = document.getElementById('calGrid');
  if(!grid) return;
  const totalDays = 30;
  const today = 14;
  const skipped = [18, 19];
  for(let d=1; d<=totalDays; d++){
    const el = document.createElement('div');
    el.className = 'cal-day';
    if(d === today) el.classList.add('today');
    if(skipped.includes(d)) el.classList.add('skip');
    el.textContent = d;
    grid.appendChild(el);
  }
})();

if('IntersectionObserver' in window){
  const revealItems = document.querySelectorAll('.reveal-io');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry, index)=>{
      if(entry.isIntersecting){
        setTimeout(()=> entry.target.classList.add('visible'), index * 70);

        if(entry.target.classList.contains('step')){
          const next = entry.target.nextElementSibling;
          if(next && next.classList.contains('connector')){
            setTimeout(()=> next.classList.add('filled'), 250);
          }
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  revealItems.forEach(el => revealObserver.observe(el));

  const nums = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(target * eased) + suffix;
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    });
  }, {threshold:0.4});
  nums.forEach(el => io.observe(el));
}else{
  document.documentElement.classList.remove('js-enabled');
}

document.addEventListener("DOMContentLoaded", () => {
  const navItem = document.querySelector("#nav-profile-section a");
  const confirmModal = document.getElementById("logoutConfirmModal");
  const modalTitle = document.getElementById("logoutConfirmLabel");
  const modalBody = document.getElementById("confirmModalBody");
  const confirmButton = document.getElementById("logoutConfirmBtn");
  const cancelButton = document.getElementById("logoutCancelBtn");
  const closeButton = document.getElementById("confirmModalCloseBtn");
  if (!navItem) return;

  let modalAction = null;
  let backdrop = null;
  let previousFocus = null;

  const closeConfirmModal = () => {
    if (!confirmModal.classList.contains("show")) return;
    confirmModal.classList.remove("show");
    confirmModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    backdrop?.remove();
    backdrop = null;
    modalAction = null;
    previousFocus?.focus();
    window.setTimeout(() => {
      if (!confirmModal.classList.contains("show")) confirmModal.style.display = "none";
    }, 150);
  };

  const openConfirmModal = ({ title, message, confirmText, onConfirm }) => {
    modalTitle.textContent = title;
    modalBody.textContent = message;
    confirmButton.textContent = confirmText;
    modalAction = onConfirm;
    previousFocus = document.activeElement;
    confirmModal.style.display = "block";
    confirmModal.classList.add("show");
    confirmModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    backdrop.addEventListener("click", closeConfirmModal);
    document.body.append(backdrop);
    confirmButton.focus();
  };

  const renderNavItem = () => {
    const userName = localStorage.getItem("staarbox_user_name")?.trim();
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.setAttribute("fill", "currentColor");
    icon.setAttribute("viewBox", "0 0 16 16");
    icon.style.marginRight = "8px";

    const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z");
    const body = document.createElementNS("http://www.w3.org/2000/svg", "path");
    body.setAttribute("fill-rule", "evenodd");
    body.setAttribute("d", "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z");
    icon.append(head, body);

    navItem.replaceChildren(icon, document.createTextNode(userName || "Login"));
    navItem.dataset.loggedIn = userName ? "true" : "false";
    navItem.setAttribute("aria-label", userName ? `Profile: ${userName}` : "Login");
  };

  renderNavItem();
  navItem.addEventListener("click", (event) => {
    event.preventDefault();

    if (navItem.dataset.loggedIn !== "true") {
      openConfirmModal({
        title: "Confirm Login",
        message: "Do you want to log in?",
        confirmText: "Yes, log in",
        onConfirm: () => { window.location.href = navItem.href; },
      });
      return;
    }

    openConfirmModal({
      title: "Confirm Logout",
      message: "Do you want to logout?",
      confirmText: "Yes, logout",
      onConfirm: () => {
        [
          "staarbox_user_name",
          "accessToken",
          "refreshToken",
          "CustomerId",
          "customerIds",
          "newCustomerEnrolled",
        ].forEach((key) => localStorage.removeItem(key));
        sessionStorage.removeItem("staarbox.session");
        renderNavItem();
      },
    });
  });

  cancelButton.addEventListener("click", closeConfirmModal);
  closeButton.addEventListener("click", closeConfirmModal);
  confirmButton.addEventListener("click", () => {
    const action = modalAction;
    closeConfirmModal();
    action?.();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeConfirmModal();
  });
});

function handleSubscriptionClick() {
  const token = localStorage.getItem('accessToken');
  const customerId = localStorage.getItem('CustomerId');
  const customerIds = JSON.parse(localStorage.getItem('customerIds') || '[]');

  if (customerIds.length > 0 || localStorage.getItem('newCustomerEnrolled') === 'true') {
    window.location.href = './checkout/';
    return;
  }

  if (customerId && token) {
    window.location.href = './Menu/';
    return;
  }

  if (token && !customerId) {
    window.location.href = './Form/';
    return;
  }

  window.location.href = './login/';
}

document.getElementById('primaryBtn').addEventListener('click', handleSubscriptionClick);

const stickyBtn = document.getElementById('stickyCtaBtn');
if(stickyBtn) {
    stickyBtn.addEventListener('click', handleSubscriptionClick);
}

const planButtons = document.querySelectorAll('.btn-plan-primary');
planButtons.forEach(btn => {
    btn.addEventListener('click', handleSubscriptionClick);
});

const footerButtons = document.querySelectorAll('.sb-footer-button.primary');
footerButtons.forEach(btn => {
    btn.addEventListener('click', handleSubscriptionClick);
});
