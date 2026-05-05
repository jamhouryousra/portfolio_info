/* =========================================================
   Portfolio Yousra Jamhour — interactions et animations
   ========================================================= */

// ---------- Préloader ----------
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => preloader.classList.add("hidden"), 400);
  }
});

// ---------- Raccourcis DOM ----------
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const $ = (sel, ctx = document) => ctx.querySelector(sel);

const chips = $$(".chip");
const projectCards = $$(".project-card");
const modeTabs = $$(".mode-tab");
const modePanels = $$(".mode-panel");
const detailButtons = $$(".toggle-details");
const projectToggles = $$(".toggle-project");
const revealElements = $$(".reveal");
const navLinks = $$(".main-nav a");
const statNumbers = $$(".stat-number[data-count], .stat-number > [data-count]");

const loadButton = $("#load-github");
const usernameInput = $("#github-username");
const statusElement = $("#github-status");
const repoGrid = $("#github-repos");
const roleElement = $("#typed-role");
const cursorGlow = $(".cursor-glow");
const topbar = $(".topbar");
const burger = $("#burger");
const mainNav = $(".main-nav");
const themeToggle = $("#theme-toggle");
const backToTop = $("#back-to-top");
const scrollProgress = $(".scroll-progress");
const currentYear = $("#current-year");

// ---------- Année courante ----------
if (currentYear) currentYear.textContent = new Date().getFullYear();

// ---------- Thème clair / sombre ----------
const savedTheme = localStorage.getItem("yj-theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("yj-theme", next);
});

// ---------- Menu burger (mobile) ----------
burger?.addEventListener("click", () => {
  const open = mainNav?.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
});

// Fermer le menu au clic sur un lien
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("open");
    burger?.classList.remove("open");
    burger?.setAttribute("aria-expanded", "false");
  });
});

// ---------- Filtres de projets ----------
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((el) => el.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      const visible = filter === "all" || tags.includes(filter);
      card.style.display = visible ? "grid" : "none";
      if (visible) {
        card.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 320, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" }
        );
      }
    });
  });
});

// ---------- Onglets Profil ----------
modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    modeTabs.forEach((el) => {
      el.classList.remove("active");
      el.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const targetId = tab.dataset.target;
    modePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  });
});

// ---------- Toggle détails (expériences) ----------
detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const container = button.closest(".card");
    const details = container?.querySelector(".details-block");
    if (!details) return;

    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    details.hidden = expanded;
  });
});

// ---------- Toggle détails (projets) ----------
projectToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    const extra = card?.querySelector(".project-extra");
    if (!extra) return;

    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    extra.hidden = expanded;
  });
});

// ---------- Rôle rotatif avec effet typewriter ----------
const roleTexts = [
  "Data Engineer",
  "Full-Stack developer",
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
  if (!roleElement) return;
  const currentText = roleTexts[roleIndex];

  if (!isDeleting) {
    roleElement.textContent = currentText.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
    setTimeout(typeRole, 75);
  } else {
    roleElement.textContent = currentText.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roleTexts.length;
      setTimeout(typeRole, 300);
      return;
    }
    setTimeout(typeRole, 40);
  }
}

if (roleElement) {
  roleElement.textContent = "";
  setTimeout(typeRole, 600);
}

// ---------- Observer de révélation au scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        // Barres de compétence animées
        const bars = entry.target.querySelectorAll(".skill-bar");
        bars.forEach((bar) => bar.classList.add("animate"));

        // Compteurs animés
        const counters = entry.target.querySelectorAll("[data-count]");
        counters.forEach(animateCount);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ---------- Compteurs animés ----------
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (Number.isNaN(target)) return;
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased).toString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toString();
  }
  requestAnimationFrame(tick);
}

// ---------- Surlignage de la section active ----------
const sections = $$("main section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
      });
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => navObserver.observe(section));

// ---------- Effet tilt 3D sur les cartes ----------
const tiltCards = $$(".tilt-card");

tiltCards.forEach((card) => {
  let raf = null;
  card.addEventListener("pointermove", (event) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      raf = null;
    });
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

// ---------- Effet magnétique sur les boutons ----------
const magneticElements = $$(".magnetic");

magneticElements.forEach((el) => {
  el.addEventListener("pointermove", (event) => {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "translate(0, 0)";
  });
});

// ---------- Glow curseur et parallaxe légère ----------
if (cursorGlow) {
  document.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
    document.documentElement.style.setProperty("--my", `${event.clientY}px`);
  });
}

// ---------- Barre de progression et back-to-top ----------
function onScroll() {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrolled / height) * 100 : 0;

  if (scrollProgress) scrollProgress.style.width = percent + "%";
  topbar?.classList.toggle("scrolled", scrolled > 40);
  backToTop?.classList.toggle("visible", scrolled > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- GitHub — chargement des dépôts publics ----------
async function loadRepos(username) {
  if (!statusElement || !repoGrid) return;

  statusElement.textContent = "Chargement des dépôts GitHub...";
  repoGrid.innerHTML = "";

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`
    );
    if (!response.ok) throw new Error("GitHub API error");

    const repos = await response.json();
    if (!Array.isArray(repos) || !repos.length) {
      statusElement.textContent = "Aucun dépôt public trouvé pour ce compte.";
      return;
    }

    statusElement.textContent = `${repos.length} dépôt(s) public(s) chargé(s).`;

    repos.forEach((repo, idx) => {
      const card = document.createElement("article");
      card.className = "repo-card tilt-card";
      card.style.animationDelay = `${idx * 60}ms`;
      card.innerHTML = `
        <h4><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a></h4>
        <p>${escapeHtml(repo.description || "Aucune description disponible.")}</p>
        <div class="repo-meta">
          <span>Langage : ${escapeHtml(repo.language || "N/A")}</span>
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      `;
      repoGrid.appendChild(card);
    });
  } catch (error) {
    statusElement.textContent = "Impossible de charger les dépôts. Vérifiez le nom d'utilisateur.";
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

loadButton?.addEventListener("click", () => {
  const username = usernameInput?.value.trim();
  if (!username) {
    if (statusElement) statusElement.textContent = "Entrez un nom d'utilisateur GitHub.";
    return;
  }
  loadRepos(username);
});

usernameInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadButton?.click();
});

// ---------- Canvas de particules (fond animé) ----------
(function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const particles = [];
  const count = Math.min(60, Math.floor(window.innerWidth / 24));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const accent = document.documentElement.getAttribute("data-theme") === "dark"
      ? "rgba(77, 208, 203, 0.55)"
      : "rgba(24, 166, 161, 0.45)";
    ctx.fillStyle = accent;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Lignes entre particules proches
    ctx.strokeStyle = accent.replace(/[\d.]+\)$/, "0.12)");
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    draw();
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
})();

// ---------- Défilement fluide pour les ancres ----------
$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  });
});
