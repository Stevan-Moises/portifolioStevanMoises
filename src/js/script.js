const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particles = [];
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 1.5 + 0.5
        });
    }
}
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(drawCanvas);
}
window.addEventListener('resize', initCanvas);
initCanvas(); drawCanvas();

const ponto = document.getElementById('cursor-ponto');
const anel = document.getElementById('cursor-anel');
const getRoot = () => getComputedStyle(document.documentElement);
const ringDefault = getRoot().getPropertyValue('--cursor-anel-tamanho-padrao').trim();
const ringHover = getRoot().getPropertyValue('--cursor-anel-tamanho-hover').trim();

window.addEventListener('mousemove', (e) => {
    ponto.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    setTimeout(() => {
        const w = parseInt(anel.style.width) || parseInt(ringDefault);
        anel.style.transform = `translate(${e.clientX - (w / 2)}px, ${e.clientY - (w / 2)}px)`;
    }, 50);
});

document.querySelectorAll('a, button, input, select, textarea, .card-projeto-movel, .icone-social').forEach(el => {
    el.addEventListener('mouseenter', () => {
        anel.style.width = ringHover; anel.style.height = ringHover;
        anel.style.borderColor = 'white'; anel.style.background = 'rgba(255, 255, 255, 0.05)';
        ponto.style.background = 'white';
    });
    el.addEventListener('mouseleave', () => {
        anel.style.width = ringDefault; anel.style.height = ringDefault;
        anel.style.borderColor = getRoot().getPropertyValue('--cursor-anel-borda');
        anel.style.background = 'transparent'; ponto.style.background = getRoot().getPropertyValue('--cursor-ponto-fundo');
    });
});

const modal = document.getElementById('modal-projeto');
const mTit = document.getElementById('modal-titulo');
const mDes = document.getElementById('modal-descricao');
const mGit = document.getElementById('modal-link-github');
const mSit = document.getElementById('modal-link-site');

function fecharModal() { modal.classList.remove('aberto'); document.body.style.overflow = 'auto'; }

document.querySelectorAll('.card-projeto-movel').forEach(card => {
    card.querySelector('.btn-detalhes').addEventListener('click', (e) => {
        e.stopPropagation();
        mTit.innerText = card.dataset.titulo; mDes.innerText = card.dataset.descricao;
        mGit.href = card.dataset.github; mSit.href = card.dataset.site;
        modal.classList.add('aberto'); document.body.style.overflow = 'hidden';
    });
});

const cards = document.querySelectorAll('.card-projeto-movel');
const glowColor = getRoot().getPropertyValue('--brilho-primario');
const glassColor = getRoot().getPropertyValue('--fundo-vidro');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        card.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, ${glowColor} 0%, ${glassColor} 50%)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), background 0.6s ease';
        card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        card.style.background = glassColor;
        setTimeout(() => card.style.transition = '', 600);
    });
});

const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            if (entry.target.id === 'inicio') document.getElementById('hero-actions').classList.remove('opacity-0', 'translate-y-10');
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('section, .animar-entrada').forEach(el => observador.observe(el));

window.addEventListener('scroll', () => {
    const h = document.getElementById('header');
    if (window.scrollY > 50) h.classList.add('bg-black/80', 'backdrop-blur-lg', 'py-4', 'border-b', 'border-white/5');
    else h.classList.remove('bg-black/80', 'backdrop-blur-lg', 'py-4', 'border-b', 'border-white/5');
});

const formContato = document.getElementById('form-contato');
const btnEnviar = document.getElementById('btn-enviar');
const textoBtn = document.getElementById('texto-btn-enviar');
const spinnerBtn = document.getElementById('spinner-btn-enviar');

const overlaySucesso = document.getElementById('overlay-sucesso');
const btnVoltarForm = document.getElementById('btn-voltar-form');

// Lógica do botão de voltar após o sucesso
btnVoltarForm.addEventListener('click', () => {
    overlaySucesso.classList.remove('opacity-100', 'pointer-events-auto');
    overlaySucesso.classList.add('opacity-0', 'pointer-events-none');
});

formContato.addEventListener('submit', async (e) => {
    e.preventDefault();

    // SEU LINK OFICIAL DO FORMSPREE
    const FORMSPREE_URL = "https://formspree.io/f/mjgqrkel";

    // UI - Estado de Carregamento
    btnEnviar.disabled = true;
    btnEnviar.classList.add('opacity-70', 'cursor-not-allowed');
    textoBtn.innerText = 'Enviando...';
    spinnerBtn.classList.remove('hidden');

    const formData = new FormData(formContato);

    try {
        // Envio Real direto para o Formspree. Lógica de simulação REMOVIDA.
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Erro no servidor');

        // Sucesso: Mostra a Overlay
        overlaySucesso.classList.remove('opacity-0', 'pointer-events-none');
        overlaySucesso.classList.add('opacity-100', 'pointer-events-auto');

        formContato.reset();

    } catch (error) {
        // Tratamento de Erro Elegante no próprio botão
        textoBtn.innerText = 'Erro ao Enviar';
        btnEnviar.classList.replace('bg-indigo-600', 'bg-red-600');
        btnEnviar.classList.replace('hover:bg-indigo-700', 'hover:bg-red-700');

        setTimeout(() => {
            textoBtn.innerText = 'Enviar Mensagem';
            btnEnviar.classList.replace('bg-red-600', 'bg-indigo-600');
            btnEnviar.classList.replace('hover:bg-red-700', 'hover:bg-indigo-700');
        }, 4000);
    } finally {
        // Restaura o botão original
        if (textoBtn.innerText !== 'Erro ao Enviar') {
            btnEnviar.disabled = false;
            btnEnviar.classList.remove('opacity-70', 'cursor-not-allowed');
            textoBtn.innerText = 'Enviar Mensagem';
            spinnerBtn.classList.add('hidden');
        } else {
            btnEnviar.disabled = false;
            btnEnviar.classList.remove('opacity-70', 'cursor-not-allowed');
            spinnerBtn.classList.add('hidden');
        }
    }
});