// Script principal do TudoJogos

document.addEventListener('DOMContentLoaded', function() {
    // Modal de pesquisa
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('search-input');
    
    // Abrir modal de pesquisa
    searchBtn.addEventListener('click', function() {
        searchModal.style.display = 'block';
        searchInput.focus();
    });
    
    // Fechar modal de pesquisa
    closeSearch.addEventListener('click', function() {
        searchModal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora do conteúdo
    window.addEventListener('click', function(event) {
        if (event.target === searchModal) {
            searchModal.style.display = 'none';
        }
    });
    
    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && searchModal.style.display === 'block') {
            searchModal.style.display = 'none';
        }
    });

    // Sistema de tema claro/escuro
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Verifica se há uma preferência de tema salva
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Aplica o tema salvo ao carregar a página
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Alterna entre os temas claro e escuro
    themeToggleBtn.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            // Mudar para tema claro
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            // Mudar para tema escuro
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // Menu mobile toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const menu = document.querySelector('.menu');
    
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', function() {
            menu.classList.toggle('active');
            // Alterna entre ícones de menu e fechar
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Adiciona estilo ao menu mobile quando ativo
    if (menu) {
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @media (max-width: 768px) {
                    .menu.active {
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        top: 70px;
                        left: 0;
                        right: 0;
                        background-color: var(--dark-color);
                        padding: 20px;
                        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                        z-index: 1000;
                    }
                    
                    .menu.active li {
                        margin: 10px 0;
                    }
                }
            </style>
        `);
    }

    // Botão de carregar mais notícias
    const loadMoreBtn = document.querySelector('.load-more .btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulação de carregamento de mais notícias
            this.textContent = 'Carregando...';
            
            // Simula um atraso de rede
            setTimeout(() => {
                const newsList = document.querySelector('.news-list');
                
                // Conteúdo de exemplo para novas notícias
                const newsItems = [
                    {
                        category: 'PC',
                        title: 'Novo MMO promete revolucionar o gênero com gráficos impressionantes',
                        content: 'Desenvolvedores independentes anunciam jogo com tecnologia de ponta e jogabilidade inovadora.',
                        date: '05/12/2023',
                        author: 'Por: Ana Costa'
                    },
                    {
                        category: 'Console',
                        title: 'Nintendo anuncia novidades para o Switch 2',
                        content: 'Empresa japonesa revela detalhes sobre o sucessor de seu console híbrido de sucesso.',
                        date: '03/12/2023',
                        author: 'Por: Pedro Santos'
                    },
                    {
                        category: 'eSports',
                        title: 'Brasil se destaca em campeonato mundial de League of Legends',
                        content: 'Equipe brasileira surpreende e chega às semifinais do torneio mais importante do MOBA.',
                        date: '01/12/2023',
                        author: 'Por: Marcos Oliveira'
                    }
                ];
                
                // Adiciona as novas notícias ao DOM
                newsItems.forEach(item => {
                    const article = document.createElement('article');
                    article.className = 'news-item';
                    article.innerHTML = `
                        <div class="news-img">
                            <img src="https://via.placeholder.com/300x200" alt="Notícia recente">
                        </div>
                        <div class="news-content">
                            <span class="category">${item.category}</span>
                            <h3>${item.title}</h3>
                            <p>${item.content}</p>
                            <div class="news-meta">
                                <span class="date">${item.date}</span>
                                <span class="author">${item.author}</span>
                            </div>
                            <a href="#" class="read-more">Ler mais</a>
                        </div>
                    `;
                    newsList.appendChild(article);
                    
                    // Adiciona animação de fade-in
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    article.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translateY(0)';
                    }, 100);
                });
                
                // Restaura o texto do botão
                this.textContent = 'Carregar mais notícias';
            }, 1500);
        });
    }

    // Formulário de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulação de envio bem-sucedido
                this.innerHTML = '<p class="success-message">Obrigado por se inscrever! Em breve você receberá nossas novidades.</p>';
                
                // Estilo para a mensagem de sucesso
                document.head.insertAdjacentHTML('beforeend', `
                    <style>
                        .success-message {
                            background-color: var(--success-color);
                            color: white;
                            padding: 15px;
                            border-radius: 5px;
                            font-weight: 600;
                            animation: fadeIn 0.5s ease;
                        }
                        
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    </style>
                `);
            }
        });
    }

    // Efeito de scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignora links com apenas #
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para o header fixo
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação para elementos quando entram na viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.news-card, .news-item, .review-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Adiciona classe para elementos visíveis inicialmente
    window.addEventListener('load', animateOnScroll);
    // Verifica elementos ao rolar a página
    window.addEventListener('scroll', animateOnScroll);
    
    // Estilo para animação de entrada
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .news-card, .news-item, .review-card {
                opacity: 0.6;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .news-card.visible, .news-item.visible, .review-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
        </style>
    `);

    // Busca
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        const searchInput = searchBar.querySelector('input');
        const searchButton = searchBar.querySelector('button');
        
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Simulação de busca - em um site real, redirecionaria para página de resultados
                alert(`Buscando por: ${searchTerm}\nEm um site real, você seria redirecionado para os resultados da busca.`);
            }
        });
        
        // Permite buscar ao pressionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
});