document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('Particles.js loaded successfully');
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-switch');
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonStyles(newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') themeToggle.checked = true;
    updateButtonStyles(savedTheme);

    // Terminal functionality
    const terminal = document.getElementById('terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.querySelector('.terminal-content');
    let terminalVisible = false;

    const terminalToggle = document.createElement('div');
    terminalToggle.className = 'terminal-toggle';
    terminalToggle.innerHTML = '<i class="fas fa-terminal"></i>';
    document.body.appendChild(terminalToggle);

    terminalToggle.addEventListener('click', function() {
        terminalVisible = !terminalVisible;
        terminal.classList.toggle('active', terminalVisible);
        if (terminalVisible) {
            terminalInput.focus();
        }
    });

    // Terminal commands
    const commands = {
        help: () => {
            addTerminalLine('Available commands:');
            addTerminalLine('• help - Show this help message');
            addTerminalLine('• about - Show about information');
            addTerminalLine('• projects - List my projects');
            addTerminalLine('• clear - Clear the terminal');
            addTerminalLine('• theme [light/dark] - Change theme');
        },
        about: () => {
            addTerminalLine('WangYi / 王毅');
            addTerminalLine('Location: Vietnam 越南');
            addTerminalLine('Status: NEET / 在家蹲');
            addTerminalLine('Languages: Vietnamese, English, 中文');
        },
        projects: () => {
            addTerminalLine('My Projects:');
            addTerminalLine('• Discord Bot - Multi-purpose bot with music and moderation');
            addTerminalLine('• Game Scripts - Automation scripts for various games');
            addTerminalLine('• Cyberpunk UI - Custom UI components');
        },
        clear: () => {
            const lines = document.querySelectorAll('.terminal-line:not(.terminal-input-line)');
            lines.forEach(line => {
                line.style.opacity = '0';
                setTimeout(() => line.remove(), 300);
            });
        },
        theme: (arg) => {
            if (arg === 'light' || arg === 'dark') {
                document.documentElement.setAttribute('data-theme', arg);
                localStorage.setItem('theme', arg);
                themeToggle.checked = arg === 'light';
                addTerminalLine(`Theme set to ${arg} mode`);
                updateButtonStyles(arg);
            } else {
                addTerminalLine('Usage: theme [light/dark]');
            }
        }
    };

    function addTerminalLine(text, isInput = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        if (isInput) line.style.color = 'var(--neon-pink)';
        terminalContent.insertBefore(line, terminalInput.parentNode);
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const input = this.value.trim();
            if (input) {
                addTerminalLine(`> ${input}`, true);
                const [command, ...args] = input.split(' ');
                if (commands[command]) {
                    commands[command](...args);
                } else {
                    addTerminalLine(`Command not found: ${input}`);
                }
            }
            this.value = '';
        }
    });

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const offset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        });
    });

    // Update button styles based on theme
    function updateButtonStyles(theme) {
        const buttons = document.querySelectorAll('.cyberpunk-btn');
        const baseColor = theme === 'light' ? 'var(--neon-blue)' : 'var(--neon-pink)';
        
        buttons.forEach(btn => {
            btn.style.background = `linear-gradient(90deg, ${baseColor}, var(--neon-purple))`;
            btn.style.boxShadow = `0 0 15px ${baseColor}`;
        });
    }

    // Initialize components
    initScrollTop();
    initMusicPlayer();
    initTiltEffects();

    // Handle resize
    window.addEventListener('resize', function() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS.particles.reload();
        }
    });

    function initScrollTop() {
        const scrollTop = document.querySelector('.scroll-top');
        if (!scrollTop) return;

        window.addEventListener('scroll', () => {
            scrollTop.classList.toggle('visible', window.scrollY > 300);
        });

        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function initMusicPlayer() {
        const playBtn = document.querySelector('.play-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const albumCovers = document.querySelectorAll('.album-cover');
        if (!playBtn) return;

        let currentTrack = 0;
        const tracks = [
            { title: "Cyberpunk Dreams", artist: "WangYi", duration: "3:42" },
            { title: "Neon Nights", artist: "WangYi", duration: "4:15" },
            { title: "Synthwave Sunset", artist: "WangYi", duration: "3:58" },
            { title: "Digital Love", artist: "WangYi", duration: "4:30" }
        ];

        playBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.replace('fa-play', 'fa-pause');
                simulateMusicProgress();
            } else {
                icon.classList.replace('fa-pause', 'fa-play');
                clearInterval(window.musicProgressInterval);
            }
        });

        prevBtn.addEventListener('click', function() {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            updateTrackInfo();
        });

        nextBtn.addEventListener('click', function() {
            currentTrack = (currentTrack + 1) % tracks.length;
            updateTrackInfo();
        });

        function updateTrackInfo() {
            const track = tracks[currentTrack];
            document.querySelector('.track-title').textContent = track.title;
            document.querySelector('.track-artist').textContent = track.artist;
            document.querySelector('.total-time').textContent = track.duration;
            
            // Update album cover
            albumCovers.forEach((cover, index) => {
                cover.classList.toggle('active', index === currentTrack);
            });
            
            // If music is playing, restart progress
            if (playBtn.querySelector('i').classList.contains('fa-pause')) {
                clearInterval(window.musicProgressInterval);
                simulateMusicProgress();
            }
        }

        function simulateMusicProgress() {
            const progressFill = document.querySelector('.player-progress .progress-fill');
            const currentTime = document.querySelector('.current-time');
            let progress = 0;
            const duration = tracks[currentTrack].duration.split(':');
            const totalSeconds = parseInt(duration[0]) * 60 + parseInt(duration[1]);
            const progressStep = 100 / totalSeconds * 0.5;

            clearInterval(window.musicProgressInterval);
            window.musicProgressInterval = setInterval(() => {
                if (progress >= 100) {
                    clearInterval(window.musicProgressInterval);
                    playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
                    progressFill.style.width = '0%';
                    currentTime.textContent = '0:00';
                    // Auto play next track
                    nextBtn.click();
                    if (playBtn.querySelector('i').classList.contains('fa-pause')) {
                        simulateMusicProgress();
                    }
                    return;
                }

                progress += progressStep;
                progressFill.style.width = `${progress}%`;
                const elapsedSeconds = Math.floor(totalSeconds * (progress / 100));
                const minutes = Math.floor(elapsedSeconds / 60);
                const seconds = elapsedSeconds % 60;
                currentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }, 500);
        }
    }

    function initTiltEffects() {
        if (window.innerWidth > 768 && typeof VanillaTilt !== 'undefined') {
            const tiltElements = document.querySelectorAll('.tilt');
            tiltElements.forEach(element => {
                VanillaTilt.init(element, {
                    max: element.dataset.tiltMax || 15,
                    speed: element.dataset.tiltSpeed || 400,
                    perspective: element.dataset.tiltPerspective || 1000,
                    glare: true,
                    "max-glare": 0.2,
                    scale: 1.05
                });
            });
        }
    }

    // Mobile tap effect for sections
    if ('ontouchstart' in window) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.addEventListener('touchstart', function() {
                this.classList.add('mobile-tap');
            }, { passive: true });

            section.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('mobile-tap');
                }, 300);
            }, { passive: true });
        });
    }
});