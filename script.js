let passiveOffset = 0;

function updateLava() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const glassContainer = document.querySelector('.glass-container');
    
    if (glassContainer) {
        passiveOffset += 1.2; 
        const scrollFactor = 0.6;
        const totalPos = passiveOffset + (scrollPosition * scrollFactor);
        glassContainer.style.setProperty('--lava-pos', `${totalPos}px`);
    }
    requestAnimationFrame(updateLava);
}

// Inyectar iconos de eliminación en cada card
document.querySelectorAll('.github-card').forEach(card => {
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-icon';
    deleteBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
    card.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar el vuelo de la card
        e.preventDefault();
        card.classList.add('burned');
        checkEmptyState();
    });
});

function checkEmptyState() {
    const visibleCards = document.querySelectorAll('.github-card:not(.burned)');
    const emptyState = document.getElementById('empty-state');
    const gridContainer = document.querySelector('.grid-container');
    const headerSection = document.querySelector('.header-section');
    
    if (visibleCards.length === 0) {
        // Wait for the melt animation to finish (1.5s)
        setTimeout(() => {
            // Re-verify they are still 0 (user might have clicked recover)
            if (document.querySelectorAll('.github-card:not(.burned)').length === 0) {
                emptyState.style.display = 'flex';
                gridContainer.style.display = 'none';
                headerSection.style.opacity = '0.3';
            }
        }, 1500);
    } else {
        emptyState.style.display = 'none';
        gridContainer.style.display = 'flex';
        headerSection.style.opacity = '1';
    }
}

// Botón de Modo Quemar
const burnModeBtn = document.getElementById('burn-mode-btn');
const glassContainer = document.querySelector('.glass-container');

burnModeBtn.addEventListener('click', () => {
    glassContainer.classList.toggle('burning-mode');
    
    if (glassContainer.classList.contains('burning-mode')) {
        burnModeBtn.innerHTML = '<i class="bi bi-check-lg"></i> LISTO';
        burnModeBtn.classList.replace('btn-outline-danger', 'btn-danger');
    } else {
        burnModeBtn.innerHTML = '<i class="bi bi-fire"></i> QUEMAR';
        burnModeBtn.classList.replace('btn-danger', 'btn-outline-danger');
    }
});

// Botón de Recuperar
const recoverBtn = document.getElementById('recover-btn');
recoverBtn.addEventListener('click', () => {
    document.querySelectorAll('.github-card.burned').forEach(card => {
        card.classList.remove('burned');
    });
    checkEmptyState();
});

// Lógica para el vuelo de las cards
document.querySelectorAll('.github-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Bloqueo total de links en modo quemar
        const glassContainer = document.querySelector('.glass-container');
        if (glassContainer.classList.contains('burning-mode')) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();
        const url = this.getAttribute('href');
        
        if (this.classList.contains('flying') || this.classList.contains('burned')) return;
        this.classList.add('flying');

        const rect = this.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        const translateX = viewportCenterX - cardCenterX;
        const translateY = viewportCenterY - cardCenterY;

        this.style.zIndex = "10000";
        this.style.transform = `translate(${translateX}px, ${translateY}px) scale(2)`;
        
        document.body.style.overflow = "hidden";
        document.querySelectorAll('.github-card:not(.flying)').forEach(other => {
            other.style.opacity = "0.1";
            other.style.filter = "blur(10px)";
            other.style.pointerEvents = "none";
        });

        setTimeout(() => {
            window.location.href = url;
        }, 800);
    });
});

// Iniciar el loop de animación
updateLava();
