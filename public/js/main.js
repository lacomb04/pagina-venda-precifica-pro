/**
 * =============================================
 * MAIN.JS - JavaScript Principal
 * Precificação PRO Landing Page
 * =============================================
 */

// ---- TOUR NAVIGATION ----
const stepPanels = [
  ["mock-p0"], // step 0: produto
  ["mock-p1", "mock-p3-extra"], // step 1: taxas + impostos
  ["mock-p2"], // step 2: marketing
  ["mock-p4"], // step 3: margem
  ["mock-p3"], // step 4: resultado
];

const allPanels = [
  "mock-p0",
  "mock-p1",
  "mock-p2",
  "mock-p3-extra",
  "mock-p4",
  "mock-p3",
];

/**
 * Navega para um passo específico do tour
 * @param {number} n - Índice do passo (0-4)
 */
function goStep(n, event) {
  // Previne o comportamento padrão que causa scroll
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Atualiza os steps indicators
  document.querySelectorAll(".tour-step").forEach((step, index) => {
    step.classList.toggle("active", index === n);
  });

  // Atualiza os annotation cards
  document.querySelectorAll(".annot-card").forEach((card, index) => {
    card.classList.toggle("active", index === n);
  });

  // Atualiza os painéis do mockup
  allPanels.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const isHighlighted = stepPanels[n].includes(id);
    el.classList.toggle("highlighted", isHighlighted);
    el.classList.toggle("dimmed", !isHighlighted);
    el.classList.toggle("hidden-panel", !isHighlighted);
  });

  // Não faz scroll automático - remove comportamento indesejado
}

// ---- FAQ TOGGLE ----
/**
 * Alterna a exibição da resposta do FAQ
 * @param {HTMLElement} el - Elemento da pergunta clicado
 */
function toggleFaq(el) {
  const faqItem = el.parentElement;

  // Fecha outros FAQs abertos (accordion behavior - opcional)
  // document.querySelectorAll('.faq-item.open').forEach(item => {
  //   if (item !== faqItem) item.classList.remove('open');
  // });

  faqItem.classList.toggle("open");
}

// ---- SCROLL REVEAL ----
/**
 * Observer para animar elementos ao entrarem na viewport
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Opcional: para de observar após revelar
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach((reveal) => observer.observe(reveal));
}

// ---- SMOOTH SCROLL PARA LINKS INTERNOS ----
/**
 * Adiciona scroll suave para links âncora
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Ignora links vazios
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Em telas menores, garante que o mock + explicação fiquem visíveis sem rolar manualmente
  if (window.innerWidth <= 1024) {
    const tourWrap = document.querySelector(".tour-wrap");
    if (tourWrap) {
      const navHeight = document.querySelector(".navbar")?.offsetHeight || 0;
      const top =
        tourWrap.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}

// ---- NAVBAR SCROLL EFFECT ----
/**
 * Adiciona efeito de fundo sólido na navbar ao scrollar
 */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(3, 11, 24, 0.95)";
    } else {
      navbar.style.background = "rgba(3, 11, 24, 0.85)";
    }
  });
}

// ---- TECLADO NAVEGAÇÃO DO TOUR ----
/**
 * Permite navegar no tour com as setas do teclado
 */
function initKeyboardNavigation() {
  let currentStep = 0;

  document.addEventListener("keydown", (e) => {
    // Só funciona se o tour estiver visível
    const demoSection = document.getElementById("demo");
    if (!demoSection) return;

    const rect = demoSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isVisible) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      currentStep = Math.min(currentStep + 1, 4);
      goStep(currentStep);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      currentStep = Math.max(currentStep - 1, 0);
      goStep(currentStep);
    }
  });
}

// ---- BOTÕES CTA TRACKING (exemplo) ----
/**
 * Adiciona event listeners para tracking de cliques em CTAs
 */
function initCTATracking() {
  const ctaButtons = document.querySelectorAll(".btn-primary, .price-cta");

  ctaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Aqui você pode adicionar tracking (Google Analytics, etc)
      console.log("CTA clicked:", button.textContent.trim());

      // Exemplo de evento para Google Analytics 4
      // gtag('event', 'cta_click', {
      //   'button_text': button.textContent.trim(),
      //   'page_location': window.location.href
      // });
    });
  });
}

// ---- INICIALIZAÇÃO ----
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o tour no primeiro passo
  goStep(0);

  // Duplica o conteúdo do ticker para rolagem contínua
  initTickerLoop();

  // Inicializa scroll reveal
  initScrollReveal();

  // Inicializa smooth scroll
  initSmoothScroll();

  // Inicializa efeito da navbar
  initNavbarScroll();

  // Inicializa navegação por teclado
  initKeyboardNavigation();

  // Inicializa tracking de CTAs
  initCTATracking();

  console.log("Precificação PRO - Landing Page carregada");
});

// ---- TICKER DUPLICATION ----
// Gera uma cópia do conteúdo para evitar buracos durante a animação
function initTickerLoop() {
  const ticker = document.querySelector(".ticker");
  if (!ticker) return;

  const clone = document.createDocumentFragment();
  ticker.querySelectorAll(".ticker-item").forEach((item) => {
    clone.appendChild(item.cloneNode(true));
  });

  ticker.appendChild(clone);
}

// ---- EXPORTA FUNÇÕES PARA USO GLOBAL ----
// Necessário para os onclick no HTML
window.goStep = goStep;
window.toggleFaq = toggleFaq;
