// Aguarda o documento HTML carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // --- INICIALIZAÇÃO DO CARROSSEL SWIPER ---
    const swiper = new Swiper('.swiper', {
        // Ativa o loop para as ofertas girarem infinitamente
        loop: true,

        // ESSA É A CORREÇÃO: Faz a altura do carrossel se adaptar a cada slide
        autoHeight: true,

        // Adiciona as setas de navegação
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Adiciona a paginação (bolinhas)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // --- LÓGICA PARA ABRIR E FECHAR O MODAL ---
    const modal = document.getElementById('promo-modal');
    const fab = document.getElementById('promo-fab');
    const closeButton = document.querySelector('.close-button');

    // Função para mostrar o modal
    function showModal() {
        modal.style.display = 'flex';
    }

    // Função para esconder o modal
    function hideModal() {
        modal.style.display = 'none';
    }

    // Quando o usuário clicar no botão flutuante, mostra o modal
    fab.onclick = showModal;

    // Quando o usuário clicar no 'X', esconde o modal
    closeButton.onclick = hideModal;

    // Quando o usuário clicar fora da janela (no fundo escuro), esconde o modal
    window.onclick = function(event) {
        if (event.target == modal) {
            hideModal();
        }
    };

    // Quando o usuário apertar a tecla 'Escape', esconde o modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideModal();
        }
    });
});