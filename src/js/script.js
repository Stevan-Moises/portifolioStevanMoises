// Animação de scroll suave para elementos
function animarElementosNoScroll() {
    const elementos = document.querySelectorAll('.elemento-animado');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}

// Animação escalonada para cartões de projeto
function animarCartoesProjeto() {
    const cartoes = document.querySelectorAll('.cartao-projeto');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });

    cartoes.forEach(cartao => {
        observer.observe(cartao);
    });
}

// Validação do formulário de contato
function configurarValidacaoFormulario() {
    const formulario = document.getElementById('formulario-contato');
    const campos = {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        whatsapp: document.getElementById('whatsapp'),
        mensagem: document.getElementById('mensagem')
    };

    // Validação em tempo real
    Object.keys(campos).forEach(nomeCampo => {
        const campo = campos[nomeCampo];
        const mensagemErro = document.getElementById(`erro-${nomeCampo}`);

        campo.addEventListener('blur', () => {
            validarCampo(campo, mensagemErro);
        });

        campo.addEventListener('input', () => {
            // Aplicar máscara para WhatsApp
            if (nomeCampo === 'whatsapp') {
                aplicarMascaraWhatsApp(campo);
            }

            if (mensagemErro.style.display === 'block') {
                validarCampo(campo, mensagemErro);
            }
        });
    });

    // Envio do formulário
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        let formularioValido = true;
        Object.keys(campos).forEach(nomeCampo => {
            const campo = campos[nomeCampo];
            const mensagemErro = document.getElementById(`erro-${nomeCampo}`);
            if (!validarCampo(campo, mensagemErro)) {
                formularioValido = false;
            }
        });

        if (formularioValido) {
            enviarFormulario();
        }
    });
}

// Função para aplicar máscara no WhatsApp
function aplicarMascaraWhatsApp(campo) {
    let valor = campo.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (valor.length > 0) {
        if (valor.length <= 2) {
            valor = `(${valor}`;
        } else if (valor.length <= 7) {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
        } else {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
        }
    }

    campo.value = valor;
}

// Função para validar campo individual
function validarCampo(campo, mensagemErro) {
    let valido = true;

    if (campo.type === 'email') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valido = regexEmail.test(campo.value.trim());
    } else if (campo.id === 'whatsapp') {
        // Validar WhatsApp: deve ter pelo menos 10 dígitos (formato: (11) 99999-9999)
        const apenasNumeros = campo.value.replace(/\D/g, '');
        valido = apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
    } else {
        valido = campo.value.trim().length > 0;
    }

    if (valido) {
        campo.style.borderColor = 'var(--cor-neutro)';
        mensagemErro.style.display = 'none';
    } else {
        campo.style.borderColor = 'var(--cor-destaque)';
        mensagemErro.style.display = 'block';
    }

    return valido;
}

// Envio do formulário via Email
function enviarFormulario() {
    const botaoEnviar = document.getElementById('botao-enviar');
    const textoOriginal = botaoEnviar.textContent;

    // Obter dados do formulário
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Enviando...';

    // Preparar dados para envio por email
    const assunto = `Nova Solicitação de Projeto - ${nome}`;
    const corpoEmail = `Olá Stevan!

Recebi uma nova solicitação através do seu portfólio:

Nome: ${nome}
E-mail: ${email}
WhatsApp: ${whatsapp}

Mensagem:
${mensagem}

---
Enviado através do formulário de contato do portfólio.`;

    // Seu email (substitua pelo seu email real)
    const seuEmail = 'stevan.moises@email.com';

    // Criar link mailto
    const linkEmail = `mailto:${seuEmail}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;

    // Simular delay de envio
    setTimeout(() => {
        // Abrir cliente de email
        window.location.href = linkEmail;

        // Mostrar modal de confirmação
        mostrarModalConfirmacao();

        // Resetar formulário e botão
        document.getElementById('formulario-contato').reset();
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = textoOriginal;
    }, 1500);
}

// Mostrar modal de confirmação
function mostrarModalConfirmacao() {
    const modal = document.getElementById('modal-confirmacao');
    modal.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de confirmação
function fecharModalConfirmacao() {
    const modal = document.getElementById('modal-confirmacao');
    modal.classList.remove('ativo');
    document.body.style.overflow = 'auto';
}

// Navegação suave
function configurarNavegacaoSuave() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const destino = document.querySelector(link.getAttribute('href'));
            if (destino) {
                const offsetTop = destino.offsetTop - 80; // Compensar altura do cabeçalho
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Fechar menu mobile se estiver aberto
                fecharMenuMobile();
            }
        });
    });
}

// Menu Hamburger
function configurarMenuHamburger() {
    const menuHamburger = document.getElementById('menu-hamburger');
    const navegacaoMobile = document.getElementById('navegacao-mobile');
    const menuOverlay = document.getElementById('menu-overlay');
    const linksMobile = document.querySelectorAll('.navegacao-mobile a');

    // Abrir/fechar menu
    menuHamburger.addEventListener('click', () => {
        toggleMenuMobile();
    });

    // Fechar menu clicando no overlay
    menuOverlay.addEventListener('click', () => {
        fecharMenuMobile();
    });

    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navegacaoMobile.classList.contains('ativo')) {
            fecharMenuMobile();
        }
    });

    // Fechar menu ao clicar em um link
    linksMobile.forEach(link => {
        link.addEventListener('click', () => {
            fecharMenuMobile();
        });
    });

    function toggleMenuMobile() {
        menuHamburger.classList.toggle('ativo');
        navegacaoMobile.classList.toggle('ativo');
        menuOverlay.classList.toggle('ativo');

        // Prevenir scroll do body quando menu estiver aberto
        if (navegacaoMobile.classList.contains('ativo')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    function fecharMenuMobile() {
        menuHamburger.classList.remove('ativo');
        navegacaoMobile.classList.remove('ativo');
        menuOverlay.classList.remove('ativo');
        document.body.style.overflow = 'auto';
    }
}

// Controle do cursor personalizado
function configurarCursorPersonalizado() {
    const cursor = document.querySelector('.cursor-personalizado');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Elementos interativos
    const seletorElementos = 'a, button, .botao-cta, .botao-secundario, .botao-enviar, .skill-chip, .tag-tecnologia, .cartao-projeto, .link-social, .link-social-hero, .campo-entrada, .campo-textarea, .preview-projeto-link, .menu-hamburger, .navegacao-mobile a';

    document.addEventListener('mouseenter', (e) => {
        if (e.target.matches(seletorElementos)) {
            cursor.classList.add('escondido');
        }
    }, true);

    document.addEventListener('mouseleave', (e) => {
        if (e.target.matches(seletorElementos)) {
            cursor.classList.remove('escondido');
        }
    }, true);


}

// Animação de digitação para o título
function animarTituloDigitacao() {
    const elemento = document.getElementById('titulo-animado');
    const palavras = ['Desenvolvedor Web', 'Front-end'];
    let palavraAtual = 0;
    let letraAtual = 0;
    let digitando = true;
    let pausaEntrePalavras = false;

    function digitar() {
        if (pausaEntrePalavras) {
            setTimeout(() => {
                pausaEntrePalavras = false;
                digitar();
            }, 1500); // Pausa entre palavras
            return;
        }

        const palavra = palavras[palavraAtual];

        if (digitando) {
            // Digitando a palavra
            if (letraAtual < palavra.length) {
                elemento.innerHTML = palavra.substring(0, letraAtual + 1) + '<span class="texto-digitando"></span>';
                letraAtual++;
                setTimeout(digitar, 100); // Velocidade de digitação
            } else {
                // Palavra completa, aguardar antes de apagar
                setTimeout(() => {
                    digitando = false;
                    digitar();
                }, 2000); // Tempo que a palavra fica completa
            }
        } else {
            // Apagando a palavra
            if (letraAtual > 0) {
                elemento.innerHTML = palavra.substring(0, letraAtual - 1) + '<span class="texto-digitando"></span>';
                letraAtual--;
                setTimeout(digitar, 50); // Velocidade de apagar
            } else {
                // Palavra apagada, próxima palavra
                digitando = true;
                palavraAtual = (palavraAtual + 1) % palavras.length;
                pausaEntrePalavras = true;
                digitar();
            }
        }
    }

    // Iniciar animação após um pequeno delay
    setTimeout(() => {
        digitar();
    }, 1500);
}

// Dados dos projetos para o modal
const dadosProjetos = {
    calculadora: {
        titulo: 'Calculadora Interativa',
        icone: '<svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z"/></svg>',
        descricao: 'Calculadora moderna e funcional com interface elegante e intuitiva. Possui todas as operações matemáticas básicas, histórico completo de cálculos realizados, função de memória, e animações suaves para cada botão pressionado. O design responsivo garante uma experiência perfeita em qualquer dispositivo, com feedback visual imediato e tratamento de erros inteligente.',
        tecnologias: ['HTML5', 'CSS3', 'JavaScript'],
        linkProjeto: 'https://stevanmoises.github.io/calculadora-interativa',
        linkCodigo: 'https://github.com/stevanmoises/calculadora-interativa'
    },
    senhas: {
        titulo: 'Gerador de Senhas',
        icone: '<svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg>',
        descricao: 'Ferramenta essencial para criar senhas ultra-seguras de forma rápida e prática. Permite personalizar completamente os critérios: tamanho, uso de maiúsculas, minúsculas, números e símbolos especiais. Inclui medidor visual de força da senha, função de copiar com um clique, histórico das últimas senhas geradas e dicas de segurança. Interface moderna com animações que tornam a experiência agradável.',
        tecnologias: ['HTML5', 'CSS3', 'JavaScript'],
        linkProjeto: 'https://stevanmoises.github.io/gerador-senhas',
        linkCodigo: 'https://github.com/stevanmoises/gerador-senhas'
    },
    quiz: {
        titulo: 'Quiz Interativo',
        icone: '<svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,10.27 15.45,11.4 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"/></svg>',
        descricao: 'Jogo educativo de perguntas e respostas com múltiplas categorias e níveis de dificuldade. Possui cronômetro dinâmico, sistema de pontuação baseado no tempo de resposta, feedback visual imediato para respostas corretas e incorretas, ranking de melhores pontuações e estatísticas detalhadas de desempenho. Design gamificado com efeitos sonoros e animações envolventes.',
        tecnologias: ['HTML5', 'CSS3', 'JavaScript'],
        linkProjeto: 'https://stevanmoises.github.io/quiz-interativo',
        linkCodigo: 'https://github.com/stevanmoises/quiz-interativo'
    },
    landing: {
        titulo: 'Landing Page Produto',
        icone: '<svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M2.81,14.12L5.64,11.29L8.17,10.79C11.39,6.41 17.55,4.22 19.78,4.22C19.78,6.45 17.59,12.61 13.21,15.83L12.71,18.36L9.88,21.19C9.29,21.78 8.28,21.78 7.69,21.19L2.81,16.31C2.22,15.72 2.22,14.71 2.81,14.12M7.68,7.68C6.1,9.26 6.1,11.74 7.68,13.32C9.26,14.9 11.74,14.9 13.32,13.32C14.9,11.74 14.9,9.26 13.32,7.68C11.74,6.1 9.26,6.1 7.68,7.68Z"/></svg>',
        descricao: 'Página de vendas profissional e altamente otimizada para conversão, desenvolvida exclusivamente com HTML e CSS. Apresenta design moderno com gradientes elegantes, animações CSS puras que capturam a atenção, seções estrategicamente posicionadas para guiar o visitante até a ação desejada. Layout totalmente responsivo com tipografia cuidadosamente escolhida e call-to-actions que se destacam visualmente.',
        tecnologias: ['HTML5', 'CSS3'],
        linkProjeto: 'https://stevanmoises.github.io/landing-page-produto',
        linkCodigo: 'https://github.com/stevanmoises/landing-page-produto'
    },
    portfolio: {
        titulo: 'Portfólio Fotógrafo',
        icone: '<svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>',
        descricao: 'Website elegante e minimalista criado especialmente para fotógrafos profissionais. Utiliza apenas HTML e CSS para criar uma galeria impressionante em grid responsivo, com efeitos hover sofisticados que destacam cada imagem. O design clean e focado permite que as fotografias sejam as verdadeiras protagonistas, com navegação intuitiva e carregamento otimizado. Perfeito para showcases profissionais.',
        tecnologias: ['HTML5', 'CSS3'],
        linkProjeto: 'https://stevanmoises.github.io/portfolio-fotografo',
        linkCodigo: 'https://github.com/stevanmoises/portfolio-fotografo'
    },
    restaurante: {
        titulo: 'Site Restaurante',
        icone: '<svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.28,12.92 16.28,15.18 14.88,16.57C13.49,17.96 11.23,17.96 9.84,16.57L7.76,14.5L10.59,11.67L14.88,11.53M21.04,2.96L19.63,1.54L18.22,2.96L16.81,1.54L15.39,2.96L16.81,4.37L15.39,5.79L16.81,7.2L18.22,5.79L19.63,7.2L21.04,5.79L19.63,4.37L21.04,2.96M15.27,9.85L11.17,9.99L8.46,12.7L10.54,14.77C11.33,15.56 12.61,15.56 13.4,14.77C14.19,13.98 14.19,12.7 13.4,11.91L15.27,9.85Z"/></svg>',
        descricao: 'Website completo e apetitoso para restaurantes, desenvolvido com HTML e CSS puros. Apresenta design que desperta o apetite com cores quentes e imagens atrativas, menu digital interativo com categorias bem organizadas, seção de localização e contato, galeria de pratos especiais e depoimentos de clientes. Layout responsivo que funciona perfeitamente em tablets para uso no próprio restaurante.',
        tecnologias: ['HTML5', 'CSS3'],
        linkProjeto: 'https://stevanmoises.github.io/site-restaurante',
        linkCodigo: 'https://github.com/stevanmoises/site-restaurante'
    }
};



// Configurar modal de projetos
function configurarModalProjetos() {
    const modal = document.getElementById('modal-overlay');
    const modalConteudo = document.getElementById('modal-conteudo');
    const botaoFechar = document.getElementById('modal-fechar');
    const botoesDetalhes = document.querySelectorAll('.botao-detalhes');

    // Cursor já configurado globalmente, não precisa de função específica

    // Abrir modal
    botoesDetalhes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const projetoId = botao.getAttribute('data-projeto');
            abrirModal(projetoId);
        });
    });

    // Fechar modal com botão X
    botaoFechar.addEventListener('click', fecharModal);

    // Fechar modal clicando fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModal();
        }
    });

    function abrirModal(projetoId) {
        const projeto = dadosProjetos[projetoId];
        if (!projeto) return;

        // Preencher conteúdo do modal
        document.getElementById('projeto-imagem').innerHTML = projeto.icone;
        document.getElementById('modal-titulo').textContent = projeto.titulo;
        document.getElementById('modal-descricao').textContent = projeto.descricao;

        // Preencher tecnologias
        const containerTecnologias = document.getElementById('modal-tecnologias');
        containerTecnologias.innerHTML = '';
        projeto.tecnologias.forEach(tech => {
            const span = document.createElement('span');
            span.className = `tag-tecnologia ${tech.toLowerCase().replace('5', '').replace('3', '')}`;
            span.textContent = tech;
            containerTecnologias.appendChild(span);
        });

        // Configurar links
        document.getElementById('botao-codigo').href = projeto.linkCodigo;
        document.getElementById('botao-projeto').href = projeto.linkProjeto;

        // Mostrar modal
        modal.classList.add('ativo');
        document.body.style.overflow = 'hidden';


    }

    function fecharModal() {
        modal.classList.remove('ativo');
        document.body.style.overflow = 'auto';
    }
}

// Configurar modal de confirmação
function configurarModalConfirmacao() {
    const modal = document.getElementById('modal-confirmacao');
    const botaoFechar = document.getElementById('modal-confirmacao-fechar');
    const botaoOk = document.getElementById('modal-confirmacao-ok');

    // Fechar modal com botão X
    botaoFechar.addEventListener('click', fecharModalConfirmacao);

    // Fechar modal com botão OK
    botaoOk.addEventListener('click', fecharModalConfirmacao);

    // Fechar modal clicando fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModalConfirmacao();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModalConfirmacao();
        }
    });
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    animarElementosNoScroll();
    animarCartoesProjeto();
    configurarValidacaoFormulario();
    configurarNavegacaoSuave();
    configurarCursorPersonalizado();
    animarTituloDigitacao();
    configurarModalProjetos();
    configurarMenuHamburger();
    configurarModalConfirmacao();
});