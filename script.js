// Aguarda o documento HTML carregar completamente
document.addEventListener('DOMContentLoaded', function() {

    // --- ELEMENTOS GLOBAIS ---
    const whatsappNumber = '5531975349310'; // Seu número de WhatsApp

    // --- LÓGICA DO MODAL DE PROMOÇÃO ---
    const swiperElement = document.querySelector('#promo-modal .swiper'); 
    if (swiperElement) {
        new Swiper(swiperElement, { loop: true, autoHeight: true, navigation: { nextEl: '#promo-modal .swiper-button-next', prevEl: '#promo-modal .swiper-button-prev' }, pagination: { el: '#promo-modal .swiper-pagination', clickable: true }, });
    }
    const promoModal = document.getElementById('promo-modal');
    const fab = document.getElementById('promo-fab');
    const promoCloseButton = document.querySelector('#promo-modal .promo-close'); 
    if (fab && promoModal) { fab.addEventListener('click', () => { promoModal.style.display = 'flex'; }); } // Adicionado if(promoModal)
    if (promoCloseButton && promoModal) { promoCloseButton.addEventListener('click', () => { promoModal.style.display = 'none'; }); } // Adicionado if(promoModal)

    // --- LÓGICA DO MODAL DE PEDIDO ---
    const orderModal = document.getElementById('order-modal');
    const orderButtons = document.querySelectorAll('.open-order-modal');
    const orderCloseButton = document.querySelector('#order-modal .order-close'); 
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemPrice = document.getElementById('modal-item-price');
    const modalTotalPrice = document.getElementById('modal-total-price'); 
    const modalWhatsAppLink = document.getElementById('modal-whatsapp-link');
    const addressStreet = document.getElementById('address-street');
    const addressNumber = document.getElementById('address-number');
    const addressNeighborhood = document.getElementById('address-neighborhood');
    const addressCep = document.getElementById('address-cep');
    const addressCity = document.getElementById('address-city');
    const addressReference = document.getElementById('address-reference');
    const extraListItems = document.querySelectorAll('#order-modal .extras-list li'); 

    let currentItemPrice = 0;
    let currentItemName = '';
    let currentSubtotal = 0; 
    
    function formatCurrency(value) {
        // Adiciona validação para evitar erros com valores não numéricos
        if (typeof value !== 'number' || isNaN(value)) {
            return 'R$ 0,00'; 
        }
        return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    // Função que atualiza o subtotal E o link do WhatsApp
    function updateOrderDetails() {
        // Garante que currentItemPrice seja um número
        let subtotal = !isNaN(currentItemPrice) ? currentItemPrice : 0;
        let extrasList = []; 

        extraListItems.forEach(item => { 
            const quantityInput = item.querySelector('.quantity-input-new');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 0; 
            const price = parseFloat(item.dataset.price);
            const name = item.dataset.name;

            if (quantity > 0 && !isNaN(price)) {
                subtotal += quantity * price; 
                extrasList.push(`- _${name}_ (x${quantity})`); 
            }
        });

        currentSubtotal = subtotal; 
        if(modalTotalPrice) modalTotalPrice.textContent = formatCurrency(currentSubtotal); 

        // --- PREPARA A MENSAGEM DO WHATSAPP ---
        let message = `Olá! 👋 Gostaria de fazer o seguinte pedido:\n\n`;
        message += `📝 *Produto:*\n`;
        message += `🥔 _${currentItemName}_\n\n`; 
        if (extrasList.length > 0) { message += `➕ *Acréscimos:*\n${extrasList.join('\n')}\n\n`; }
        message += `💰 *Subtotal (sem entrega):*\n*${formatCurrency(currentSubtotal)}*\n\n`; 
        const street = addressStreet ? addressStreet.value.trim() : '';
        const number = addressNumber ? addressNumber.value.trim() : '';
        const neighborhood = addressNeighborhood ? addressNeighborhood.value.trim() : '';
        const cep = addressCep ? addressCep.value.trim() : '';
        const city = addressCity ? addressCity.value.trim() : '';
        const reference = addressReference ? addressReference.value.trim() : '';
        message += `📍 *Endereço para Entrega:*\n`;
        if (street) message += `- Rua: ${street}\n`;
        if (number) message += `- Número: ${number}\n`;
        if (neighborhood) message += `- Bairro: ${neighborhood}\n`;
        if (cep) message += `- CEP: ${cep}\n`;
        if (city) message += `- Cidade: ${city}\n`;
        if (reference) message += `- Ref: ${reference}\n`;
        message += `\n`; 
        message += `🚚 *Importante:*\n_Por favor, aguarde o cálculo e a confirmação do valor final (*produtos + taxa de entrega*) antes de realizar o pagamento._\n\n`; 
        message += `Obrigado(a)! 😊`;
        
        if(modalWhatsAppLink) modalWhatsAppLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    function openOrderModal(event) {
        const button = event.currentTarget;
        currentItemName = button.dataset.name;
        currentItemPrice = parseFloat(button.dataset.price);
        if (isNaN(currentItemPrice)) { currentItemPrice = 0; }

        extraListItems.forEach(item => {
            const quantityInput = item.querySelector('.quantity-input-new'); 
            if (quantityInput) quantityInput.value = 0;
        });
        
        if (addressStreet) addressStreet.value = ''; /* ... (outros campos) ... */
        if (addressNumber) addressNumber.value = '';
        if (addressNeighborhood) addressNeighborhood.value = '';
        if (addressCep) addressCep.value = '';
        if (addressCity) addressCity.value = '';
        if (addressReference) addressReference.value = '';

        if(modalItemName) modalItemName.textContent = currentItemName;
        if(modalItemPrice) modalItemPrice.textContent = formatCurrency(currentItemPrice);
        
        updateOrderDetails(); 
        if(orderModal) orderModal.style.display = 'flex';
    }

    orderButtons.forEach(button => button.addEventListener('click', openOrderModal));
    if (orderCloseButton && orderModal) { orderCloseButton.addEventListener('click', () => { orderModal.style.display = 'none'; }); } // Adicionado if(orderModal)
    
    // --- EVENTOS PARA OS BOTÕES +/- ---
    extraListItems.forEach(item => {
        const decreaseBtn = item.querySelector('.decrease-qty'); 
        const increaseBtn = item.querySelector('.increase-qty'); 
        const quantityInput = item.querySelector('.quantity-input-new'); 

        if(decreaseBtn && quantityInput) {
             decreaseBtn.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 0) { quantityInput.value = currentValue - 1; updateOrderDetails(); }
            });
        }
        if(increaseBtn && quantityInput) {
            increaseBtn.addEventListener('click', () => {
                 let currentValue = parseInt(quantityInput.value);
                 const max = parseInt(quantityInput.max) || 10; 
                 if (currentValue < max) { quantityInput.value = currentValue + 1; updateOrderDetails(); }
            });
        }
    });
    
    // Atualiza o link se o endereço for alterado
    if (addressStreet) addressStreet.addEventListener('input', updateOrderDetails); 
    if (addressNumber) addressNumber.addEventListener('input', updateOrderDetails);
    if (addressNeighborhood) addressNeighborhood.addEventListener('input', updateOrderDetails);
    if (addressCep) addressCep.addEventListener('input', updateOrderDetails);
    if (addressCity) addressCity.addEventListener('input', updateOrderDetails);
    if (addressReference) addressReference.addEventListener('input', updateOrderDetails);


    // --- LÓGICA DO MODAL DE PAGAMENTO PIX ---
    const paymentModal = document.getElementById('payment-modal');
    const paymentModalClose = document.querySelector('#payment-modal .payment-close'); 
    const paymentSubtotalElement = document.getElementById('payment-subtotal'); 
    const copyPixButton = document.getElementById('copy-pix-button');
    const pixKeyInput = document.getElementById('pix-key-input');

    if (paymentModalClose && paymentModal) { // Adicionado if(paymentModal)
        paymentModalClose.addEventListener('click', () => { paymentModal.style.display = 'none'; });
    }

    // =========================================================
    // ========= CORREÇÃO NO EVENTO DO BOTÃO WHATSAPP =========
    // =========================================================
    if (modalWhatsAppLink && orderModal && paymentModal && paymentSubtotalElement) { // Garante que todos os elementos existem
        modalWhatsAppLink.addEventListener('click', function(event) {
            
            // Verifica se os campos obrigatórios do endereço foram preenchidos
            const street = addressStreet ? addressStreet.value.trim() : '';
            const number = addressNumber ? addressNumber.value.trim() : '';
            const neighborhood = addressNeighborhood ? addressNeighborhood.value.trim() : '';
            const city = addressCity ? addressCity.value.trim() : '';

            if (!street || !number || !neighborhood || !city) {
                event.preventDefault(); // Impede o envio se faltar endereço
                alert('Por favor, preencha todos os campos obrigatórios do endereço (Rua, Número, Bairro, Cidade) antes de enviar o pedido.');
                return; // Para a execução
            }

            // Se o endereço está ok:
            event.preventDefault(); // Impede o link de abrir imediatamente

            // 1. Atualiza o subtotal no modal de pagamento
            paymentSubtotalElement.textContent = formatCurrency(currentSubtotal);
            
            // 2. Esconde o modal de pedido
            orderModal.style.display = 'none';
            
            // 3. MOSTRA O MODAL DE PAGAMENTO PIX
            paymentModal.style.display = 'flex'; // << GARANTE QUE ESTA LINHA ESTÁ CORRETA
            
            // 4. Abre o WhatsApp em uma nova aba (APÓS mostrar o modal PIX)
            window.open(this.href, '_blank');
        });
    } else {
        console.error("Erro: Um ou mais elementos do modal de pedido/pagamento não foram encontrados. Verifique os IDs no HTML.");
    }

    // Lógica para o botão "Copiar Chave"
    if (copyPixButton && pixKeyInput) {
        copyPixButton.addEventListener('click', () => {
             pixKeyInput.select(); pixKeyInput.setSelectionRange(0, 99999); 
            try {
                navigator.clipboard.writeText(pixKeyInput.value).then(() => {
                    copyPixButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(() => { copyPixButton.innerHTML = '<i class="fas fa-copy"></i> Copiar'; }, 2000);
                }).catch(err => { document.execCommand('copy'); copyPixButton.innerHTML = '<i class="fas fa-check"></i> Copiado!'; setTimeout(() => { copyPixButton.innerHTML = '<i class="fas fa-copy"></i> Copiar'; }, 2000); });
            } catch (err) { document.execCommand('copy'); copyPixButton.innerHTML = '<i class="fas fa-check"></i> Copiado!'; setTimeout(() => { copyPixButton.innerHTML = '<i class="fas fa-copy"></i> Copiar'; }, 2000); }
        });
    }

    // --- LÓGICA GLOBAL PARA FECHAR MODAIS ---
    window.addEventListener('click', (event) => {
        if (promoModal && event.target == promoModal) { promoModal.style.display = 'none'; }
        if (orderModal && event.target == orderModal) { orderModal.style.display = 'none'; }
        if (paymentModal && event.target == paymentModal) { paymentModal.style.display = 'none'; }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if(promoModal) promoModal.style.display = 'none';
            if(orderModal) orderModal.style.display = 'none';
            if(paymentModal) paymentModal.style.display = 'none';
        }
    });

});