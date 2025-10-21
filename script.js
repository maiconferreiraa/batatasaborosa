// Aguarda o documento HTML carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DO MODAL DE PROMOÇÃO (JÁ EXISTENTE) ---
    const swiperElement = document.querySelector('.swiper');
    if (swiperElement) {
        const swiper = new Swiper(swiperElement, {
            loop: true,
            autoHeight: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    const promoModal = document.getElementById('promo-modal');
    const fab = document.getElementById('promo-fab');
    const promoCloseButton = document.querySelector('.promo-close');

    if (fab) { fab.addEventListener('click', () => { promoModal.style.display = 'flex'; }); }
    if (promoCloseButton) { promoCloseButton.addEventListener('click', () => { promoModal.style.display = 'none'; }); }

    // --- NOVA LÓGICA DO MODAL DE PEDIDO ---
    const orderModal = document.getElementById('order-modal');
    const orderButtons = document.querySelectorAll('.open-order-modal');
    const orderCloseButton = document.querySelector('.order-close');
    
    // Elementos dentro do modal de pedido
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemPrice = document.getElementById('modal-item-price');
    const extrasCheckboxes = document.querySelectorAll('.extra-checkbox');
    const modalTotalPrice = document.getElementById('modal-total-price');
    const modalWhatsAppLink = document.getElementById('modal-whatsapp-link');

    let currentItemPrice = 0;
    let currentItemName = '';
    const whatsappNumber = '5531975349310'; // Seu número de WhatsApp

    // Função para formatar número como moeda (BRL)
    function formatCurrency(value) {
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    // Função para CALCULAR O TOTAL e ATUALIZAR O LINK
    function updateOrderTotal() {
        let total = currentItemPrice;
        let extrasList = []; // Lista de nomes dos acréscimos

        extrasCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseFloat(checkbox.dataset.price);
                extrasList.push(checkbox.dataset.name);
            }
        });

        // Atualiza o texto do total na tela
        modalTotalPrice.textContent = formatCurrency(total);

        // Constrói a mensagem do WhatsApp
        let message = `Olá! Gostaria de pedir:\n\n`;
        message += `*Produto:* ${currentItemName}\n`;
        
        if (extrasList.length > 0) {
            message += `*Acréscimos:*\n- ${extrasList.join('\n- ')}\n`;
        }
        
        message += `\n*Total:* ${formatCurrency(total)}`;

        // Atualiza o link do botão final
        modalWhatsAppLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    // Função para ABRIR O MODAL DE PEDIDO
    function openOrderModal(event) {
        const button = event.currentTarget;
        currentItemName = button.dataset.name;
        currentItemPrice = parseFloat(button.dataset.price);

        // Reseta o modal
        extrasCheckboxes.forEach(checkbox => { checkbox.checked = false; }); // Desmarca todos

        // Preenche com os dados do item clicado
        modalItemName.textContent = currentItemName;
        modalItemPrice.textContent = formatCurrency(currentItemPrice);

        // Calcula o total inicial (só o item) e mostra o modal
        updateOrderTotal();
        orderModal.style.display = 'flex';
    }

    // Adiciona os eventos
    if (orderModal) {
        // Adiciona evento de clique para todos os botões "Montar Pedido"
        orderButtons.forEach(button => {
            button.addEventListener('click', openOrderModal);
        });

        // Adiciona evento de clique para fechar o modal de pedido
        if (orderCloseButton) {
            orderCloseButton.addEventListener('click', () => { orderModal.style.display = 'none'; });
        }

        // Adiciona evento de "mudança" para todos os checkboxes
        extrasCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateOrderTotal);
        });
    }

    // --- LÓGICA GLOBAL PARA FECHAR MODAIS ---
    window.addEventListener('click', (event) => {
        if (event.target == promoModal) { promoModal.style.display = 'none'; }
        if (event.target == orderModal) { orderModal.style.display = 'none'; }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            promoModal.style.display = 'none';
            orderModal.style.display = 'none';
        }
    });

});