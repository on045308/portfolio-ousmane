/**
 * CV Ousmane Niang - JavaScript
 * Module: Développement Web - Licence 2 Informatique
 */

// ════════════════════════════════════════════════════════════════
// FONCTION DE TÉLÉCHARGEMENT PDF (déclarée en dehors de DOMContentLoaded)
// ════════════════════════════════════════════════════════════════

function downloadPDF() {
    const element = document.getElementById('cvContent');
    const btn = document.querySelector('.download-btn');
    
    if (!element) {
        console.warn('⚠️ Élément cvContent non trouvé');
        // Afficher une alerte simple
        alert('Erreur : impossible de trouver le contenu du CV.');
        return;
    }
    
    // Désactiver le bouton pendant la génération
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Génération...';
    }
    
    // Options optimisées pour un PDF professionnel
    const opt = {
        margin:        [15, 15, 15, 15],
        filename:     'CV_Ousmane_Niang.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            letterRendering: true
        },
        jsPDF:        { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak:    { mode: 'avoid-all' }
    };
    
    // Générer le PDF
    html2pdf().set(opt).from(element).save().then(function() {
        // Réactiver le bouton
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-file-pdf" aria-hidden="true"></i> PDF';
        }
        console.log('✅ PDF téléchargé avec succès !');
    }).catch(function(err) {
        console.error('Erreur lors de la génération du PDF:', err);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-file-pdf" aria-hidden="true"></i> PDF';
        }
        alert('❌ Erreur lors de la génération du PDF. Veuillez réessayer.');
    });
}

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. MENU HAMBURGER (Navigation mobile)
    // ============================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu après un clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================================
    // 2. THÈME CLAIR / SOMBRE (avec localStorage)
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const label = themeToggle.querySelector('.theme-label');

        // Vérifier le thème sauvegardé
        let currentTheme = localStorage.getItem('cv-theme') || 'light';

        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (icon) icon.className = 'fas fa-sun';
            if (label) label.textContent = 'Thème clair';
        }

        // Événement de clic
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-theme');

            if (document.body.classList.contains('dark-theme')) {
                if (icon) icon.className = 'fas fa-sun';
                if (label) label.textContent = 'Thème clair';
                localStorage.setItem('cv-theme', 'dark');
                // Mettre à jour le QR Code si visible
                if (typeof qrVisible !== 'undefined' && qrVisible) {
                    setTimeout(updateQRColors, 50);
                }
            } else {
                if (icon) icon.className = 'fas fa-moon';
                if (label) label.textContent = 'Thème sombre';
                localStorage.setItem('cv-theme', 'light');
                // Mettre à jour le QR Code si visible
                if (typeof qrVisible !== 'undefined' && qrVisible) {
                    setTimeout(updateQRColors, 50);
                }
            }
        });
    } else {
        console.warn('⚠️ Bouton themeToggle non trouvé dans le DOM');
    }

    // ============================================================
    // 3. ANIMATION DES BARRES DE COMPÉTENCES (IntersectionObserver)
    // ============================================================
    const skillBars = document.querySelectorAll('.skill-progress');

    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 200);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ============================================================
    // 4. BOUTON RETOUR EN HAUT
    // ============================================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Afficher/masquer le bouton selon le défilement
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Remonter en haut de la page
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================================
    // 5. FORMULAIRE DE CONTACT (Validation JavaScript)
    // ============================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les champs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Récupérer les conteneurs d'erreurs
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');
            
            let isValid = true;
            
            // Validation du nom
            if (name.value.trim() === '') {
                nameError.textContent = 'Veuillez entrer votre nom';
                nameError.classList.add('visible');
                name.parentElement.classList.add('error');
                isValid = false;
            } else {
                nameError.classList.remove('visible');
                name.parentElement.classList.remove('error');
            }
            
            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                emailError.textContent = 'Veuillez entrer votre email';
                emailError.classList.add('visible');
                email.parentElement.classList.add('error');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                emailError.textContent = 'Veuillez entrer un email valide (ex: nom@domaine.com)';
                emailError.classList.add('visible');
                email.parentElement.classList.add('error');
                isValid = false;
            } else {
                emailError.classList.remove('visible');
                email.parentElement.classList.remove('error');
            }
            
            // Validation du message
            if (message.value.trim() === '') {
                messageError.textContent = 'Veuillez entrer votre message';
                messageError.classList.add('visible');
                message.parentElement.classList.add('error');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                messageError.textContent = 'Votre message doit contenir au moins 10 caractères';
                messageError.classList.add('visible');
                message.parentElement.classList.add('error');
                isValid = false;
            } else {
                messageError.classList.remove('visible');
                message.parentElement.classList.remove('error');
            }
            
            // Si tout est valide
            if (isValid) {
                showNotification('✅ Message envoyé avec succès !');
                contactForm.reset();
            }
        });
    }

    // ============================================================
    // 6. CLIC SUR LES TAGS DE COMPÉTENCES
    // ============================================================
    const skillTags = document.querySelectorAll('.badge, .tech-tag, .lang-tag, .interest-tag');

    skillTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            const text = this.textContent.trim();
            console.log(`🔍 Tag cliqué : ${text}`);
            
            this.style.transition = 'all 0.1s ease';
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
            }, 100);
        });
    });

    // ============================================================
    // 7. CLIC SUR LES PROJETS
    // ============================================================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            console.log(`📂 Projet sélectionné : ${title}`);
        });
    });

    // ============================================================
    // 8. CLIC SUR LES CONTACTS (copie dans le presse-papier)
    // ============================================================
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            console.log(`📞 Contact : ${text}`);
            
            if (this.querySelector('i').classList.contains('fa-phone')) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('📞 Numéro copié !');
                }).catch(() => {
                    showNotification('📞 Cliquez pour appeler');
                });
            } else if (this.querySelector('i').classList.contains('fa-envelope')) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('✉️ Email copié !');
                });
            }
        });
    });

    // ============================================================
    // 9. SYSTÈME DE NOTIFICATION
    // ============================================================
    function showNotification(message) {
        let notification = document.querySelector('.cv-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cv-notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
        
        clearTimeout(notification._timeout);
        notification._timeout = setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(10px)';
        }, 3000);
    }

    // ============================================================
    // 10. ANIMATION D'ENTRÉE DU CV
    // ============================================================
    const cvContainer = document.querySelector('.cv-container');
    if (cvContainer) {
        cvContainer.style.opacity = '0';
        cvContainer.style.transform = 'translateY(20px)';
        cvContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            cvContainer.style.opacity = '1';
            cvContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    // ============================================================
    // 11. QR CODE – Génération et toggle (URL CONFIGURABLE)
    // ============================================================
    const qrContainer = document.getElementById('qrcode');
    const qrWrapper = document.getElementById('qrWrapper');
    const qrToggleBtn = document.getElementById('qrToggleBtn');
    let qrVisible = false;

    // ════════════════════════════════════════════════════════════
    // 🔽🔽🔽 MODIFIEZ CETTE LIGNE AVEC VOTRE URL RÉELLE 🔽🔽🔽
    // ════════════════════════════════════════════════════════════
    const QR_CODE_URL = "http://192.168.1.10:5500"; // ⬅️ REMPLACEZ PAR VOTRE URL

    const cvUrl = QR_CODE_URL;

    if (typeof QRCode !== 'undefined' && qrContainer) {
        new QRCode(qrContainer, {
            text: cvUrl,
            width: 120,
            height: 120,
            colorDark: '#0b1a2e',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        if (qrToggleBtn) {
            qrToggleBtn.addEventListener('click', function() {
                qrVisible = !qrVisible;
                if (qrVisible) {
                    qrWrapper.classList.add('active');
                    this.classList.add('active');
                    this.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
                    updateQRColors();
                    showNotification('📱 QR Code affiché - Scannez-moi !');
                } else {
                    qrWrapper.classList.remove('active');
                    this.classList.remove('active');
                    this.innerHTML = '<i class="fas fa-qrcode" aria-hidden="true"></i>';
                }
            });
        }
    } else {
        console.warn('⚠️ QRCode.js non chargé ou conteneur manquant');
    }

    function updateQRColors() {
        if (!qrContainer) return;
        const isDark = document.body.classList.contains('dark-theme');
        const darkColor = isDark ? '#e8eef5' : '#0b1a2e';
        const lightColor = isDark ? '#1a2644' : '#ffffff';
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: cvUrl,
            width: 120,
            height: 120,
            colorDark: darkColor,
            colorLight: lightColor,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // ============================================================
    // 12. MESSAGE DE BIENVENUE DANS LA CONSOLE
    // ============================================================
    console.log('✅ CV Ousmane Niang chargé avec succès !');
    console.log('📌 Fonctionnalités disponibles :');
    console.log('   🌙 Thème clair/sombre (sauvegardé)');
    console.log('   📊 Barres de compétences animées');
    console.log('   🏷️  Tags cliquables');
    console.log('   📋 Copie des numéros de téléphone');
    console.log('   🍔 Menu hamburger mobile');
    console.log('   🔙 Bouton retour en haut');
    console.log('   📝 Formulaire de contact avec validation');
    console.log('   📱 QR Code scannable (URL : ' + cvUrl + ')');
    console.log('   📄 Téléchargement PDF (cliquez sur le bouton PDF)');
    console.log('   🎨 Design responsive et moderne');

});
