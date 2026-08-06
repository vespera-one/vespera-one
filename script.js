/**
 * ================================================================
 * VESPERA-ONE - INTERACTIVE LANDING PAGE (OPTIMIZED)
 * ================================================================
 */

const CONFIG = {
    navbarFixed: true,
    animationsEnabled: true,
    formEnabled: false,
    modalEnabled: true
};

// ================================================================
// 1. GESTION DE LA NAVIGATION & MENU BURGER
// ================================================================

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.burgerBtn = document.querySelector('.menu-burger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link, .nav-btn');
        
        this.init();
    }
    
    init() {
        // Toggle menu au clic sur le burger
        if (this.burgerBtn) {
            this.burgerBtn.addEventListener('click', () => this.toggleMenu());
        }
        
        // Fermer le menu au clic sur un lien
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Fermer le menu si clic à l'extérieur
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                const isClickInside = this.navMenu.contains(e.target) || (this.burgerBtn && this.burgerBtn.contains(e.target));
                if (!isClickInside) {
                    this.closeMenu();
                }
            }
        });
        
        // Effet de scroll sur la navbar
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
    
    toggleMenu() {
        if (this.burgerBtn) this.burgerBtn.classList.toggle('active');
        if (this.navMenu) this.navMenu.classList.toggle('active');
    }
    
    closeMenu() {
        if (this.burgerBtn) this.burgerBtn.classList.remove('active');
        if (this.navMenu) this.navMenu.classList.remove('active');
    }
    
    onScroll() {
        if (this.navbar) {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }
    }
}

// Fonction globale de secours pour le onclick="" du HTML
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const burgerBtn = document.querySelector('.menu-burger');
    if (navMenu) navMenu.classList.toggle('active');
    if (burgerBtn) burgerBtn.classList.toggle('active');
}

// ================================================================
// 2. INTERSECTION OBSERVER POUR ANIMATIONS
// ================================================================

class ScrollAnimations {
    constructor() {
        this.initObserver();
    }
    
    initObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }
}

// ================================================================
// 3. GESTION DU FORMULAIRE ET WHATSAPP
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
        
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => e.target.style.borderColor = 'var(--accent)');
            input.addEventListener('blur', (e) => {
                if (!e.target.value.trim()) {
                    e.target.style.borderColor = 'var(--border)';
                }
            });
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const name = this.form.querySelector('#name')?.value;
        const email = this.form.querySelector('#email')?.value;
        const company = this.form.querySelector('#company')?.value || 'Non précisé';
        const message = this.form.querySelector('#message')?.value;
        
        if (!name || !email || !message) {
            this.showToast('Veuillez remplir les champs obligatoires.', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showToast('Adresse email invalide.', 'error');
            return;
        }
        
        const submitBtn = this.form.querySelector('button[type="submit"]') || this.form.querySelector('.btn-primary');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
        }
        
        setTimeout(() => {
            const messageText = `Bonjour, je m'appelle ${name}.\nEmail: ${email}\nEntreprise: ${company}\nMessage: ${message}`;
            const encodedMessage = encodeURIComponent(messageText);
            window.open(`https://wa.me/33774306147?text=${encodedMessage}`, '_blank');
            
            this.form.reset();
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            this.showToast('✓ Message préparé ! Redirection vers WhatsApp...', 'success');
        }, 1000);
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showToast(message, type = 'success') {
        if (!this.toast) return;
        this.toast.textContent = message;
        this.toast.style.background = type === 'success' 
            ? 'linear-gradient(135deg, #10B981, #059669)' 
            : 'linear-gradient(135deg, #EF4444, #DC2626)';
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 4000);
    }
}

// ================================================================
// 4. GESTION DES MODALES
// ================================================================

class ModalManager {
    constructor() {
        this.modalTriggers = document.querySelectorAll('.modal-trigger');
        this.modals = document.querySelectorAll('.modal');
        this.overlay = document.getElementById('modalOverlay');
        
        this.init();
    }
    
    init() {
        this.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });
        
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeAllModals());
        });
        
        this.overlay?.addEventListener('click', () => this.closeAllModals());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            if (this.overlay) this.overlay.classList.add('active');
        }
    }
    
    closeAllModals() {
        this.modals.forEach(modal => modal.classList.remove('active'));
        if (this.overlay) this.overlay.classList.remove('active');
    }
}

// ================================================================
// 5. ANIMATION DES NOMBRES (COMPTEURS)
// ================================================================

class CounterAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        if (this.stats.length > 0) this.init();
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
// 6. DEFILEMENT FLUIDE (SMOOTH SCROLL)
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
        
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const offset = 70; // Hauteur de la navbar fixe
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
// 7. PERFORMANCE ET INITIALISATION GENERALE
// ================================================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🚀 Vespera-One App Ready!');
        
        new Navigation();
        new SmoothScroll();
        
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
    }
}

// Lancement de l'application
const app = new App();