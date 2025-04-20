document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons and products
    const filterButtons = document.querySelectorAll('.filter-button');
    const productCards = document.querySelectorAll('.product-card');
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the category to filter by
            const filterCategory = this.getAttribute('data-category');
            
            // Filter products
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterCategory === 'all' || filterCategory === cardCategory) {
                    // Show products that match the filter
                    card.classList.remove('hidden');
                } else {
                    // Hide products that don't match
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Cart functionality
    let cart = {
        items: [],
        totalCount: 0
    };
    function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    
    if (cartBadge) {
        cartBadge.textContent = cart.totalCount;
        
        // Make the badge visible if there are items
        if (cart.totalCount > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('collegeStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }

    // Add to cart function
    function addToCart(productName, priceText) {
        try {
            // Parse price (remove $ sign and convert to number)
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            if (isNaN(price)) {
                console.error('Invalid price format:', priceText);
                return;
            }

            const existingItem = cart.items.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.items.push({
                    name: productName,
                    price: price,  // Store as number
                    quantity: 1
                });
            }
            
            cart.totalCount++;
            updateCartBadge();
            saveCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    // Remove from cart function
    function removeFromCart(productName) {
        const itemIndex = cart.items.findIndex(item => item.name === productName);
        
        if (itemIndex !== -1) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity--;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            cart.totalCount--;
            updateCartBadge();
            saveCart();
        }
    }

    // Update cart badge
    function updateCartBadge() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            cartBadge.textContent = cart.totalCount;
            cartBadge.style.display = cart.totalCount > 0 ? 'block' : 'none';
        }
    }

    // Save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem('collegeStoreCart', JSON.stringify({
                items: cart.items,
                totalCount: cart.totalCount
            }));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Initialize cart buttons
    function initializeCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            // Remove any existing click handlers to prevent duplicates
            button.removeEventListener('click', handleAddToCart);
            // Add new click handler
            button.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        addToCart(productName, price);
        
        // Visual feedback
        this.textContent = 'Added!';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
        }, 1000);
    }

    // Initialize buttons when page loads
    initializeCartButtons();

    // Also initialize when products are filtered
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(initializeCartButtons, 50);
        });
    });
});