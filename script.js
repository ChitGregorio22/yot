// Romantic Diary Navigation
class LoveDiary {
    constructor() {
        this.currentPage = 0;
        this.pages = document.querySelectorAll('.page');
        this.totalPages = this.pages.length;
        this.init();
    }

    init() {
        this.startMusic();
        this.bindEvents();
        this.updatePageIndicator();
        this.startTypewriter();
        this.createFloatingHearts();
        this.pageFlipEffect();
    }

    startMusic() {
        const music = document.getElementById('bgMusic');
        // Comment out for autoplay policy
        // music.volume = 0.1;
        // music.play().catch(() => console.log('Music autoplay blocked'));
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.nextPage();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.prevPage();
        });

        // Touch/swipe support
        let startX = 0;
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextPage();
                else this.prevPage();
            }
        });
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.transitionPage('next');
        }
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.transitionPage('prev');
        }
    }

    transitionPage(direction) {
        const currentPage = this.pages[this.currentPage];
        currentPage.classList.remove('active');
        
        if (direction === 'next') {
            this.currentPage++;
        } else {
            this.currentPage--;
        }
        
        const nextPage = this.pages[this.currentPage];
        nextPage.classList.add('active');
        
        this.updatePageIndicator();
        this.heartExplosion();
        this.pageFlipSound();
    }

    updatePageIndicator() {
        document.getElementById('pageIndicator').textContent = 
            `${this.currentPage + 1} / ${this.totalPages}`;
    }

    startTypewriter() {
        const typewriters = document.querySelectorAll('.typewriter');
        typewriters.forEach(element => {
            const text = element.getAttribute('data-text');
            let i = 0;
            const timer = setInterval(() => {
                element.textContent = text.slice(0, i);
                i++;
                if (i > text.length) {
                    clearInterval(timer);
                    element.innerHTML = text + '<span class="cursor">|</span>';
                }
            }, 100);
        });
    }

    createFloatingHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            heart.className = 'floating-heart';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            heart.style.fontSize = (Math.random() * 0.5 + 0.8) + 'rem';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 5000);
        }, 3000);
    }

    heartExplosion() {
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            heart.className = 'explosion-heart';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateX(${Math.random() * 200 - 100}px) translateY(${Math.random() * 200 - 100}px)`;
            heart.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 1500);
        }
    }

    pageFlipSound() {
        // Create subtle page flip sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    pageFlipEffect() {
        document.querySelectorAll('.page').forEach((page, index) => {
            page.addEventListener('transitionend', () => {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('prev'));
                if (this.currentPage > 0) {
                    this.pages[this.currentPage - 1].classList.add('prev');
                }
            });
        });
    }
}

// Initialize Diary
const diary = new LoveDiary();

// Global functions for HTML onclick
function nextPage() {
    diary.nextPage();
}

function prevPage() {
    diary.prevPage();
}

function restartDiary() {
    diary.currentPage = 0;
    document.querySelectorAll('.page').forEach((page, index) => {
        page.classList.remove('active', 'prev');
        if (index === 0) page.classList.add('active');
    });
    diary.updatePageIndicator();
}

// Add floating hearts CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .floating-heart {
        position: fixed;
        top: 100vh;
        color: #ff4d6d;
        opacity: 0.6;
        pointer-events: none;
        z-index: 50;
        animation: floatUp 5s linear forwards;
    }
    
    .explosion-heart {
        position: fixed;
        color: #ff8fab;
        opacity: 0.8;
        pointer-events: none;
        z-index: 100;
        font-size: 1rem;
        animation: explode 1.5s ease-out forwards;
    }
    
    @keyframes floatUp {
        to {
            top: -10vh;
            opacity: 0;
        }
    }
    
    @keyframes explode {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
    }
`;
document.head.appendChild(style);