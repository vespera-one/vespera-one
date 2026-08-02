/**
 * ================================================================
 * VESPERA-ONE - INTERACTIVE LANDING PAGE
 * ================================================================
 * Animations fluides, interactions, gestion du formulaire & modales
 */

// ================================================================
// 1. CONFIGURATION GLOBALE
// ================================================================

const CONFIG = {
    navbarFixed: true,
    smoothScroll: true,
    animationsEnabled: true,
    formEnabled: true,
    modalEnabled: true
};

// ================================================================
// 2. CLASSE POUR LA NAVIGATION
// ================================================================

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Toggle menu
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
        
        // Fermer le menu au clic sur un lien
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
    
    onScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
}

// ================================================================
// 3. INTERSECTION OBSERVER POUR ANIMATIONS AU SCROLL
// ================================================================

class ScrollAnimations {
    constructor() {
        this.initObserver();
    }
    
    initObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observer tous les éléments avec data-aos
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }
}

// ================================================================
// 4. CLASSE POUR LA GESTION DU FORMULAIRE
// ================================================================

class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.toast = document.getElementById('toast');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Ajouter des listeners pour l'animation du label
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.onInputFocus(e));
            input.addEventListener('blur', (e) => this.onInputBlur(e));
        });
    }
    
    onInputFocus(e) {
        e.target.style.borderColor = 'var(--accent)';
    }
    
    onInputBlur(e) {
        if (!e.target.value.trim()) {
            e.target.style.borderColor = 'var(--border)';
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Récupérer les données
        const name = this.form.querySelector('#name').value;
        const email = this.form.querySelector('#email').value;
        const company = this.form.querySelector('#company').value;
        const message = this.form.querySelector('#message').value;
        
        // Validation simple
        if (!name || !email || !company || !message) {
            this.showToast('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Validation email
        if (!this.isValidEmail(email)) {
            this.showToast('Email invalide', 'error');
            return;
        }
        
        // Simuler l'envoi
        const submitBtn = this.form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Envoyer via WhatsApp
            const message_text = `Bonjour, je m'appelle ${name}. Mon email: ${email}. Mon entreprise: ${company}. Message: ${message}`;
            const encoded_message = encodeURIComponent(message_text);
            window.open(`https://wa.me/33774306147?text=${encoded_message}`, '_blank');
            
            // Reset formulaire
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.showToast('✓ Message envoyé avec succès! Nous vous contacterons bientôt.', 'success');
        }, 1500);
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.style.background = type === 'success' 
            ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))' 
            : 'linear-gradient(135deg, var(--error), #d14747)';
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// ================================================================
// 5. CLASSE POUR LA GESTION DES MODALES
// ================================================================

class ModalManager {
    constructor() {
        this.modalTriggers = document.querySelectorAll('.modal-trigger');
        this.modals = document.querySelectorAll('.modal');
        this.overlay = document.getElementById('modalOverlay');
        
        this.init();
    }
    
    init() {
        // Ouvrir les modales
        this.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });
        
        // Fermer les modales
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });
        
        // Fermer overlay
        this.overlay?.addEventListener('click', () => this.closeAllModals());
        
        // Fermer à la touche Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            this.overlay.classList.add('active');
        }
    }
    
    closeAllModals() {
        this.modals.forEach(modal => {
            modal.classList.remove('active');
        });
        this.overlay.classList.remove('active');
    }
}

// ================================================================
// 6. CLASSE POUR LES ANIMATIONS DE NOMBRES
// ================================================================

class CounterAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });
        
        this.stats.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d+/g, '');
        const duration = 2000;
        const start = Date.now();
        
        const animate = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const value = Math.floor(number * progress);
            element.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// ================================================================
// 7. CLASSE POUR LES BOUTONS INTERACTIFS
// ================================================================

class ButtonInteractions {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e));
        });
    }
    
    createRipple(e) {
        const btn = e.target;
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.position = 'absolute';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        // Ajouter l'animation CSS
        if (!document.querySelector('style[data-ripple]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple', '');
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ================================================================
// 8. SMOOTH SCROLL
// ================================================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ================================================================
// 9. CLASSE POUR OPTIMISATION PERFORMANCE
// ================================================================

class PerformanceOptimizer {
    static initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ================================================================
// 10. APPLICATION PRINCIPALE
// ================================================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Vérifier que le DOM est chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🚀 Vespera-One App Initializing...');
        
        // Initialiser les modules
        new Navigation();
        
        if (CONFIG.animationsEnabled) {
            new ScrollAnimations();
            new CounterAnimation();
        }
        
        if (CONFIG.formEnabled) {
            new FormHandler();
        }
        
        if (CONFIG.modalEnabled) {
            new ModalManager();
        }
        
        new ButtonInteractions();
        new SmoothScroll();
        
        // Optimisations
        PerformanceOptimizer.initLazyLoading();
        
        // CTA Principal
        const ctaBtn = document.getElementById('ctaBtn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        console.log('✅ Vespera-One Ready!');
    }
}

// ================================================================
// 11. LANCER L'APPLICATION
// ================================================================

const app = new App();

// ================================================================
// 12. UTILITAIRES GLOBAUX
// ================================================================

// Ajouter les événements de scroll pour les animations
window.addEventListener('scroll', () => {
    // Animations supplémentaires si nécessaire
}, { passive: true });

// Gérer le redimensionnement
window.addEventListener('resize', PerformanceOptimizer.debounce(() => {
    // Gestion responsive
}, 250), { passive: true });