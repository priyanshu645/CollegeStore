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

    // Product inventory management
    // Clear existing inventory to ensure we start fresh
    localStorage.removeItem('productInventory');
    let productInventory = {};
    
    // Initialize inventory with exactly 1 item for each product
    document.querySelectorAll('.product-card').forEach(card => {
        const productName = card.querySelector('h3').textContent;
        // Set quantity to exactly 1 for each product (limited stock)
        productInventory[productName] = 1;
    });
    localStorage.setItem('productInventory', JSON.stringify(productInventory));
    
    // Update product availability display
    function updateProductAvailability() {
        document.querySelectorAll('.product-card').forEach(card => {
            const productName = card.querySelector('h3').textContent;
            const quantity = productInventory[productName] || 0;
            
            // Create or update availability element
            let availabilityElement = card.querySelector('.product-availability');
            if (!availabilityElement) {
                availabilityElement = document.createElement('div');
                availabilityElement.className = 'product-availability';
                card.querySelector('.product-content').insertBefore(
                    availabilityElement, 
                    card.querySelector('.product-footer')
                );
            }
            
            // Update availability text and style
            if (quantity <= 0) {
                availabilityElement.textContent = 'Out of stock';
                availabilityElement.style.color = 'red';
                card.querySelector('.add-to-cart').disabled = true;
                card.querySelector('.add-to-cart').style.opacity = '0.5';
            } else {
                // Always show "Only 1 left in stock!" since we're limiting to 1 per product
                availabilityElement.textContent = 'Only 1 left in stock!';
                availabilityElement.style.color = 'orange';
                card.querySelector('.add-to-cart').disabled = false;
                card.querySelector('.add-to-cart').style.opacity = '1';
            }
        });
    }

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
            // Check inventory
            if (productInventory[productName] <= 0) {
                alert('Sorry, this item is out of stock.');
                return;
            }
            
            // Parse price (remove $ sign and convert to number)
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            
            if (isNaN(price)) {
                console.error('Invalid price format:', priceText);
                return;
            }

            const existingItem = cart.items.find(item => item.name === productName);
            
            if (existingItem) {
                // User can only add 1 of each item
                alert('You can only add 1 of each item to your cart.');
                return;
            } else {
                cart.items.push({
                    name: productName,
                    price: price,  // Store as number
                    quantity: 1
                });
            }
            
            // Decrease inventory
            productInventory[productName]--;
            localStorage.setItem('productInventory', JSON.stringify(productInventory));
            
            cart.totalCount++;
            updateCartBadge();
            saveCart();
            updateProductAvailability();
            updateCartButtons();
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
            
            // Increase inventory
            productInventory[productName]++;
            localStorage.setItem('productInventory', JSON.stringify(productInventory));
            
            cart.totalCount--;
            updateCartBadge();
            saveCart();
            updateProductAvailability();
            updateCartButtons();
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

    // Update cart buttons to show quantity and delete option
    function updateCartButtons() {
        document.querySelectorAll('.product-card').forEach(card => {
            const productName = card.querySelector('h3').textContent;
            const existingItem = cart.items.find(item => item.name === productName);
            const cartButtonContainer = card.querySelector('.cart-button-container');
            
            // Create cart button container if it doesn't exist
            if (!cartButtonContainer) {
                const newCartButtonContainer = document.createElement('div');
                newCartButtonContainer.className = 'cart-button-container';
                card.querySelector('.product-footer').appendChild(newCartButtonContainer);
                
                // Move the add to cart button to the container
                const addToCartBtn = card.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    newCartButtonContainer.appendChild(addToCartBtn);
                }
            }
            
            // Get the container (either existing or newly created)
            const container = card.querySelector('.cart-button-container') || 
                              card.querySelector('.product-footer');
            
            // Update or create quantity display
            let quantityDisplay = card.querySelector('.cart-quantity');
            if (existingItem) {
                if (!quantityDisplay) {
                    quantityDisplay = document.createElement('div');
                    quantityDisplay.className = 'cart-quantity';
                    container.appendChild(quantityDisplay);
                }
                quantityDisplay.textContent = `In cart: ${existingItem.quantity}`;
                quantityDisplay.style.display = 'block';
                
                // Add remove button if it doesn't exist
                let removeButton = card.querySelector('.remove-from-cart');
                if (!removeButton) {
                    removeButton = document.createElement('button');
                    removeButton.className = 'remove-from-cart';
                    removeButton.textContent = 'Remove';
                    removeButton.addEventListener('click', function() {
                        removeFromCart(productName);
                    });
                    container.appendChild(removeButton);
                }
            } else {
                // Hide quantity display and remove button if item is not in cart
                if (quantityDisplay) {
                    quantityDisplay.style.display = 'none';
                }
                
                const removeButton = card.querySelector('.remove-from-cart');
                if (removeButton) {
                    removeButton.style.display = 'none';
                }
            }
        });
    }

    // Initialize cart buttons
    function initializeCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            // Remove any existing click handlers to prevent duplicates
            button.removeEventListener('click', handleAddToCart);
            // Add new click handler
            button.addEventListener('click', handleAddToCart);
        });
        
        // Update cart buttons to show quantity and delete option
        updateCartButtons();
    }

    function handleAddToCart() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        addToCart(productName, price);
    }

    // Initialize product availability and buttons when page loads
    updateProductAvailability();
    initializeCartButtons();

    // Also initialize when products are filtered
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            // Get the category to filter by
            const filterCategory = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            document.querySelectorAll('.product-card').forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterCategory === 'all' || filterCategory === cardCategory) {
                    // Show products that match the filter
                    card.style.display = 'flex';
                } else {
                    // Hide products that don't match
                    card.style.display = 'none';
                }
            });
            
            // Update product availability and cart buttons after filtering
            setTimeout(() => {
                updateProductAvailability();
                initializeCartButtons();
            }, 50);
        });
    });
    
    // Initialize search functionality if search bar exists
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            document.querySelectorAll('.product-card').forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                const productDesc = card.querySelector('p').textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});