// Main JavaScript for Sheger Delights website
document.addEventListener('DOMContentLoaded', function() {
    // ====================
    // ORDERING SYSTEM
    // ====================
    
    // Quantity buttons functionality
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item');
            const input = document.getElementById(itemId);
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus')) {
                input.value = value > 0 ? value - 1 : 0;
            } else {
                input.value = value + 1;
            }
            
            updateOrderSummary();
        });
    });
    
    // Manual quantity input
    const quantityInputs = document.querySelectorAll('.item-quantity input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            this.value = this.value < 0 ? 0 : this.value;
            updateOrderSummary();
        });
    });
    
    // Update order summary
    function updateOrderSummary() {
        let subtotal = 0;
        
        // Current prices (would normally come from database)
        const prices = {
            'lentil-sambusa': 15,
            'meat-sambusa': 20,
            'veg-sambusa': 15,
            'plain-qoqr': 10,
            'spiced-qoqr': 12,
            'plain-ertib': 12,
            'honey-ertib': 15,
            'breakfast-combo': 60,
            'snack-combo': 100
        };
        
        // Calculate subtotal
        for (const item in prices) {
            const quantity = parseInt(document.getElementById(item).value) || 0;
            subtotal += quantity * prices[item];
        }
        
        // Delivery fee (could vary based on location)
        const deliveryFee = calculateDeliveryFee(); // New function
        const total = subtotal + deliveryFee;
        
        // Update display
        document.getElementById('subtotal').textContent = subtotal;
        document.getElementById('delivery-fee').textContent = deliveryFee;
        document.getElementById('total').textContent = total;
    }
    
    // Calculate delivery fee based on location
    function calculateDeliveryFee() {
        // In a full implementation, this would check address
        return 10; // Default fee
    }
    
    // ====================
    // ORDER SUBMISSION
    // ====================
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: formatPhone(document.getElementById('phone').value.trim()),
                address: document.getElementById('address').value.trim(),
                deliveryTime: document.getElementById('delivery-time').value,
                notes: document.getElementById('notes').value.trim(),
                referral: document.getElementById('referral').value.trim(),
                items: {},
                total: document.getElementById('total').textContent
            };
            
            // Validate phone number
            if (!isValidEthiopianPhone(formData.phone)) {
                alert('Please enter a valid Ethiopian phone number (e.g., 0916843454 or +251916843454)');
                return;
            }
            
            // Collect items
            const itemInputs = document.querySelectorAll('.item-quantity input');
            itemInputs.forEach(input => {
                const quantity = parseInt(input.value);
                if (quantity > 0) {
                    formData.items[input.name] = quantity;
                }
            });
            
            // Check if any items selected
            if (Object.keys(formData.items).length === 0) {
                alert('Please select at least one item');
                return;
            }
            
            // Process referral code if any
            if (formData.referral) {
                trackReferral(formData.referral, formData.total);
            }
            
            // Send order via WhatsApp
            sendOrderViaWhatsApp(formData);
            
            // Show confirmation
            showPaymentOptions(formData.total);
            
            // Reset form
            orderForm.reset();
            itemInputs.forEach(input => input.value = 0);
            updateOrderSummary();
        });
    }
    
    // Format phone number for Ethiopia
    function formatPhone(phone) {
        // Remove all non-digit characters
        phone = phone.replace(/\D/g, '');
        
        // Handle international format
        if (phone.length === 12 && phone.startsWith('251')) {
            return phone;
        }
        
        // Handle local 0-prefixed numbers
        if (phone.length === 10 && phone.startsWith('0')) {
            return '251' + phone.substring(1);
        }
        
        // Handle 9-digit numbers (no prefix)
        if (phone.length === 9) {
            return '251' + phone;
        }
        
        return phone;
    }
    
    // Validate Ethiopian phone number
    function isValidEthiopianPhone(phone) {
        phone = phone.replace(/\D/g, '');
        return (phone.length === 12 && phone.startsWith('251')) || 
               (phone.length === 10 && phone.startsWith('0')) ||
               (phone.length === 9);
    }
    
    // ====================
    // WHATSAPP ORDER INTEGRATION
    // ====================
    
    function sendOrderViaWhatsApp(orderData) {
        // Format items list
        let itemsList = '';
        for (const [item, quantity] of Object.entries(orderData.items)) {
            itemsList += `\n- ${quantity} × ${formatItemName(item)}`;
        }
        
        // Create message
        const message = `*NEW ORDER* 🚀
        
Name: ${orderData.name}
Phone: ${orderData.phone}
Delivery Address: ${orderData.address}
Delivery Time: ${getDeliveryTimeText(orderData.deliveryTime)}

*Items:* ${itemsList}

*Total:* ${orderData.total} ETB
${orderData.notes ? `Notes: ${orderData.notes}` : ''}
${orderData.referral ? `Referral Code: ${orderData.referral}` : ''}`;

        // Encode for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/251916843454?text=${encodedMessage}`, '_blank');
    }
    
    function formatItemName(itemId) {
        const names = {
            'lentil-sambusa': 'Lentil Sambusa',
            'meat-sambusa': 'Meat Sambusa',
            'veg-sambusa': 'Vegetable Sambusa',
            'plain-qoqr': 'Plain Qoqr',
            'spiced-qoqr': 'Spiced Qoqr',
            'plain-ertib': 'Plain Ertib',
            'honey-ertib': 'Honey Ertib',
            'breakfast-combo': 'Breakfast Combo',
            'snack-combo': 'Snack Combo'
        };
        return names[itemId] || itemId;
    }
    
    function getDeliveryTimeText(timeCode) {
        const times = {
            'asap': 'As soon as possible',
            'morning': 'Morning (8AM-12PM)',
            'afternoon': 'Afternoon (12PM-4PM)',
            'evening': 'Evening (4PM-8PM)'
        };
        return times[timeCode] || timeCode;
    }
    
    // ====================
    // PAYMENT OPTIONS
    // ====================
    
    function showPaymentOptions(total) {
        const paymentMessage = `*PAYMENT INSTRUCTIONS* 💰
        
Total Amount: ${total} ETB

1. *CBE Birr*: 
   - Send to 0916 843 454
   - Include your name as reference

2. *HelloCash*:
   - Send to 0916 843 454
   - Include "ShegerDelights" as reference

3. *Cash on Delivery*:
   - Pay when your order arrives

After payment, please send screenshot to this number for confirmation.`;

        alert(paymentMessage);
        
        // You could also show this in a modal:
        // document.getElementById('paymentModal').style.display = 'block';
    }
    
    // ====================
    // REFERRAL SYSTEM
    // ====================
    
    function trackReferral(code, amount) {
        // In a real app, this would send to your backend
        console.log(`Tracking referral: Code=${code}, Amount=${amount}`);
        
        // For now, store in localStorage
        const referrals = JSON.parse(localStorage.getItem('referrals') || [];
        referrals.push({
            code,
            amount,
            date: new Date().toISOString()
        });
        localStorage.setItem('referrals', JSON.stringify(referrals));
    }
    
    // Initialize referral stats on refer.html
    if (window.location.pathname.includes('refer.html')) {
        updateReferralStats();
    }
    
    function updateReferralStats() {
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        const referralCount = referrals.length;
        const earnings = referrals.reduce((sum, ref) => sum + (parseInt(ref.amount) * 0.1), 0); // 10% commission
        
        document.getElementById('referral-count').textContent = referralCount;
        document.getElementById('earnings').textContent = `${earnings.toFixed(2)} ETB`;
        
        // Generate referral link
        const userId = localStorage.getItem('userId') || generateUserId();
        document.getElementById('referral-link').value = 
            `${window.location.origin}/order.html?ref=${userId}`;
    }
    
    function generateUserId() {
        const id = 'user-' + Math.random().toString(36).substr(2, 8);
        localStorage.setItem('userId', id);
        return id;
    }
    
    // Copy referral link
    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const referralLink = document.getElementById('referral-link');
            referralLink.select();
            document.execCommand('copy');
            
            // Show copied message
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    }
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const referralLink = document.getElementById('referral-link').value;
            let shareUrl = '';
            let message = `Order delicious Sambusa, Qoqr and Ertib from Sheger Delights! Use my link for your first order and I'll get commission 😊 ${referralLink}`;
            
            if (this.classList.contains('telegram')) {
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
            } else if (this.classList.contains('whatsapp')) {
                shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            } else if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(message)}`;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
    
    // Initialize order summary
    if (orderForm) {
        updateOrderSummary();
    }
    
    // ====================
    // UTILITY FUNCTIONS
    // ====================
    
    // Auto-format phone number as user types
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let phone = this.value.replace(/\D/g, '');
            
            // Format based on length
            if (phone.length > 9) {
                phone = phone.substring(0, 9);
            }
            
            // Format as 0916-843-454
            if (phone.length > 3) {
                phone = phone.substring(0, 4) + '-' + phone.substring(4);
            }
            if (phone.length > 8) {
                phone = phone.substring(0, 8) + '-' + phone.substring(8);
            }
            
            this.value = phone;
        });
    }
});