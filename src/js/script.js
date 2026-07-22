/* ==========================================================
   Script do portfólio - Stevan Moises
   Organizado em blocos: fundo de partículas, cursor customizado,
   modal de projetos, tilt 3D dos cards, scroll reveal, header
   com fundo ao rolar e envio do formulário de contato.
   ========================================================== */

/* --- Fundo animado com partículas no canvas --- */
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particles = [];

// Cria as partículas com posição e velocidade aleatórias
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

// Desenha cada partícula e a move a cada frame, invertendo a direção nas bordas
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

// Recria as partículas quando a janela muda de tamanho, e inicia a animação
window.addEventListener('resize', initCanvas);
initCanvas(); drawCanvas();

/* --- Cursor customizado (ponto + anel) --- */
const ponto = document.getElementById('cursor-ponto');
const anel = document.getElementById('cursor-anel');
const getRoot = () => getComputedStyle(document.documentElement);
const ringDefault = getRoot().getPropertyValue('--cursor-anel-tamanho-padrao').trim();
const ringHover = getRoot().getPropertyValue('--cursor-anel-tamanho-hover').trim();

// O ponto segue o mouse na hora; o anel segue com um pequeno atraso (setTimeout de 50ms), o que dá o efeito de "arrasto"
window.addEventListener('mousemove', (e) => {
    ponto.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    setTimeout(() => {
        const w = parseInt(anel.style.width) || parseInt(ringDefault);
        anel.style.transform = `translate(${e.clientX - (w / 2)}px, ${e.clientY - (w / 2)}px)`;
    }, 50);
});

// Aumenta o anel e deixa tudo branco quando o mouse passa por cima de um elemento clicável
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

/* --- Modal de detalhes do projeto --- */
const modal = document.getElementById('modal-projeto');
const mTit = document.getElementById('modal-titulo');
const mDes = document.getElementById('modal-descricao');
const mGit = document.getElementById('modal-link-github');
const mSit = document.getElementById('modal-link-site');

// Usada também no onclick do overlay e do botão "X" no HTML
function fecharModal() { modal.classList.remove('aberto'); document.body.style.overflow = 'auto'; }

// Ao clicar em "Ver Detalhes", pega os dados do card (data-titulo, data-descricao etc.) e preenche o modal
document.querySelectorAll('.card-projeto-movel').forEach(card => {
    card.querySelector('.btn-detalhes').addEventListener('click', (e) => {
        e.stopPropagation();
        mTit.innerText = card.dataset.titulo; mDes.innerText = card.dataset.descricao;
        mGit.href = card.dataset.github; mSit.href = card.dataset.site;
        modal.classList.add('aberto'); document.body.style.overflow = 'hidden';
    });
});

/* --- Efeito 3D nos cards de projeto (inclinação + brilho seguindo o mouse) --- */
const cards = document.querySelectorAll('.card-projeto-movel');
const glowColor = getRoot().getPropertyValue('--brilho-primario');
const glassColor = getRoot().getPropertyValue('--fundo-vidro');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Em celular/tablet (tela de toque) não faz sentido, então ignora
        if (window.matchMedia("(pointer: coarse)").matches) return;

        // Calcula o quanto o mouse está longe do centro do card, em X e Y
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        // Inclina o card na direção oposta ao mouse e move o brilho radial junto
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        card.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, ${glowColor} 0%, ${glassColor} 50%)`;
    });
    card.addEventListener('mouseleave', () => {
        // Ao tirar o mouse, volta suavemente para a posição original
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), background 0.6s ease';
        card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        card.style.background = glassColor;
        setTimeout(() => card.style.transition = '', 600);
    });
});

/* --- Scroll reveal: anima seções/elementos quando entram na tela --- */
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Adiciona .visivel, que dispara as animações definidas no CSS (.animar-entrada e .revelar-texto)
            entry.target.classList.add('visivel');
            // Caso especial: os botões da seção inicial (hero) entram junto com o texto
            if (entry.target.id === 'inicio') document.getElementById('hero-actions').classList.remove('opacity-0', 'translate-y-10');
        }
    });
}, { threshold: 0.15 }); // dispara quando 15% do elemento já apareceu na tela
document.querySelectorAll('section, .animar-entrada').forEach(el => observador.observe(el));

/* --- Header: ganha fundo escuro e blur ao rolar a página --- */
window.addEventListener('scroll', () => {
    const h = document.getElementById('header');
    if (window.scrollY > 50) h.classList.add('bg-black/80', 'backdrop-blur-lg', 'py-4', 'border-b', 'border-white/5');
    else h.classList.remove('bg-black/80', 'backdrop-blur-lg', 'py-4', 'border-b', 'border-white/5');
});

/* --- Formulário de contato (envio via Formspree, sem recarregar a página) --- */
const formContato = document.getElementById('form-contato');
const btnEnviar = document.getElementById('btn-enviar');
const textoBtn = document.getElementById('texto-btn-enviar');
const spinnerBtn = document.getElementById('spinner-btn-enviar');

const overlaySucesso = document.getElementById('overlay-sucesso');
const btnVoltarForm = document.getElementById('btn-voltar-form');

// Botão "voltar" da tela de sucesso: só esconde a overlay e mostra o formulário de novo
btnVoltarForm.addEventListener('click', () => {
    overlaySucesso.classList.remove('opacity-100', 'pointer-events-auto');
    overlaySucesso.classList.add('opacity-0', 'pointer-events-none');
});

formContato.addEventListener('submit', async (e) => {
    e.preventDefault(); // impede o recarregamento padrão do form

    // Endpoint do Formspree que recebe os dados e encaminha por e-mail
    const FORMSPREE_URL = "https://formspree.io/f/mjgqrkel";

    // Estado de carregamento: desabilita o botão e troca o texto pelo spinner
    btnEnviar.disabled = true;
    btnEnviar.classList.add('opacity-70', 'cursor-not-allowed');
    textoBtn.innerText = 'Enviando...';
    spinnerBtn.classList.remove('hidden');

    const formData = new FormData(formContato);

    try {
        // Envia os dados do formulário para o Formspree via fetch
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Erro no servidor');

        // Deu certo: mostra a tela de sucesso por cima do formulário
        overlaySucesso.classList.remove('opacity-0', 'pointer-events-none');
        overlaySucesso.classList.add('opacity-100', 'pointer-events-auto');

        formContato.reset();

    } catch (error) {
        // Deu erro: avisa no próprio botão, sem usar alert() ou console feio
        textoBtn.innerText = 'Erro ao Enviar';
        btnEnviar.classList.replace('bg-indigo-600', 'bg-red-600');
        btnEnviar.classList.replace('hover:bg-indigo-700', 'hover:bg-red-700');

        // Depois de alguns segundos volta o botão ao normal
        setTimeout(() => {
            textoBtn.innerText = 'Enviar Mensagem';
            btnEnviar.classList.replace('bg-red-600', 'bg-indigo-600');
            btnEnviar.classList.replace('hover:bg-red-700', 'hover:bg-indigo-700');
        }, 4000);
    } finally {
        // Reabilita o botão em qualquer caso (sucesso ou erro), menos o texto quando deu erro
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