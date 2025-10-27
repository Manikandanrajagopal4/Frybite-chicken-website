// ==========================================================
// 1. PRODUCT DATA SOURCE
// ==========================================================
// This array holds the single source of truth for all product data.
const productsData = [
    { id: 'pd1', name: 'Chicken Drumstick', price: 170, image: 'pd1.jpg' },
    { id: 'pd2', name: 'Chicken Popcorn', price: 140, image: 'pd2.jpg' },
    { id: 'pd3', name: 'Chicken Burger With Coke', price: 180, image: 'pd3.jpg' },
    { id: 'pd4', name: 'Chicken Wrap', price: 120, image: 'pd4.jpg' },
    { id: 'pd5', name: 'Chicken Loaded Fries', price: 100, image: 'pd5.jpg' },
    { id: 'pd6', name: 'Chicken Nuggets', price: 130, image: 'pd6.jpg' },
];


document.addEventListener('DOMContentLoaded', () => {
    
    // ===========================================
    // 2. MOBILE NAVIGATION TOGGLE LOGIC
    // ===========================================
    
    const navCheck = document.getElementById('nav-check');
    // Using the <label> which contains the close image/icon
    const navCloseLabel = document.querySelector('.nav-close label'); 
    const navLinks = document.querySelectorAll('.nav-links');

    const closeNav = () => {
        if (navCheck) {
            navCheck.checked = false;
        }
    };

    if (navCloseLabel) {
        navCloseLabel.addEventListener('click', closeNav);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // ===========================================
    // 3. CONTACT FORM VALIDATION LOGIC
    // ===========================================

    const contactForm = document.querySelector('.contact-form form'); 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    const displayError = (input, message) => {
        let errorSpan = input.parentNode.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error-message');
            input.parentNode.appendChild(errorSpan);
        }
        
        input.classList.add('error');
        errorSpan.textContent = message;
        errorSpan.style.display = 'block'; 
    };

    const clearError = (input) => {
        input.classList.remove('error');
        const errorSpan = input.parentNode.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            let isValid = true;
            const formControls = this.querySelectorAll('.form-control');

            formControls.forEach(input => {
                clearError(input);
                
                const inputValue = input.value.trim();
                const inputName = input.name; 

                if (inputValue === '') {
                    const label = input.parentNode.querySelector('label')?.textContent;
                    displayError(input, `${label || inputName} is required.`);
                    isValid = false;
                } 
                
                else if (input.type === 'email' && !emailRegex.test(inputValue)) {
                    displayError(input, 'Please enter a valid email address.');
                    isValid = false;
                }
            });

            if (isValid) {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset(); 
            }
        });
    }

    // ===========================================
    // 4. ORDERING AND SHOPPING CART LOGIC
    // ===========================================

    let cart = []; // Global array to hold cart items

    // Cart DOM Elements
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartButton = document.querySelector('.cart-btn');
    const closeCartButton = document.querySelector('.close-cart');
    const cartDOM = document.querySelector('.cart'); // Added to slide the cart itself
    
    const productInventory = document.querySelector('.product-inventory'); 
    
    const cartContent = document.querySelector('.cart-content');
    const cartTotal = document.querySelector('.cart-total');
    const cartItemsCount = document.querySelector('.cart-items-count');
    
    const clearCartBtn = document.querySelector('.clear-cart'); 
    const orderBtn = document.querySelector('.checkout-btn');
    
    // --- Cart Display Functions ---
    const showCart = () => { 
        // Close nav if open
        if (navCheck && navCheck.checked) {
             navCheck.checked = false;
        }
        cartOverlay.classList.add('show-cart'); 
        cartDOM.classList.add('show-cart'); // Add this if your CSS targets .cart.show-cart
    };

    const hideCart = () => { 
        cartOverlay.classList.remove('show-cart'); 
        cartDOM.classList.remove('show-cart'); // Add this if your CSS targets .cart.show-cart
    };
    
    // --- Utility Functions ---

    /**
     * Finds the quantity display element (the '0') on the product card.
     */
    const getProductQtyElement = (id) => {
        const productEl = document.querySelector(`.product[data-id="${id}"]`);
        return productEl ? productEl.querySelector('.qty-value') : null;
    };
    
    /**
     * Updates the quantity displayed on the product card itself.
     */
    const updateProductDisplayQuantity = (id, amount) => {
        const qtyEl = getProductQtyElement(id);
        if (qtyEl) {
            qtyEl.textContent = amount;
        }
    };

    // Updates the cart total and item count in the header
    const updateCartFooter = () => {
        let total = 0;
        let items = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price);
            total += price * item.amount;
            items += item.amount;
        });

        // Format total price
        cartTotal.textContent = total.toFixed(2);
        cartItemsCount.textContent = items;
    };

    /**
     * Redraws the HTML content inside the cart modal.
     */
    const renderCart = () => {
        if (cart.length === 0) {
            cartContent.innerHTML = '<p style="text-align: center; margin-top: 1rem;">Your cart is empty.</p>';
            // Reset all product card quantities when cart is cleared
            document.querySelectorAll('.qty-value').forEach(el => el.textContent = '0');
        } else {
            cartContent.innerHTML = cart.map(item => {
                // Find product for image source
                const product = productsData.find(p => p.id === item.id);
                const imageSrc = product ? `images/${product.image}` : '';
                
                return `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${imageSrc}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                        <div>
                            <h4>${item.name}</h4>
                            <p class="item-price">₹ ${parseFloat(item.price).toFixed(2)}</p>
                            <span class="remove-item">remove</span>
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-minus" data-id="${item.id}" aria-label="Decrease quantity for ${item.name}">
                                <img src="images/sub.png" alt="Minus sign">
                            </button>
                            <p class="item-amount">${item.amount}</p>
                            <button class="qty-plus" data-id="${item.id}" aria-label="Increase quantity for ${item.name}">
                                <img src="images/add.png" alt="Plus sign">
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Update product card displays to match cart state
        document.querySelectorAll('.qty-value').forEach(qtyEl => qtyEl.textContent = '0');
        cart.forEach(item => updateProductDisplayQuantity(item.id, item.amount));

        updateCartFooter();
    };

    /**
     * Central function to handle all quantity changes (+1, -1, or initial add).
     */
    const updateCartItem = (id, change) => {
        // Look up product data from the single source of truth
        const product = productsData.find(p => p.id === id);
        if (!product) return; 

        let tempItem = cart.find(item => item.id === id);

        if (tempItem) {
            tempItem.amount += change;
            if (tempItem.amount <= 0) {
                // Remove item if amount drops to 0 or less
                cart = cart.filter(item => item.id !== id);
            }
        } else if (change > 0) {
            // Add new item if not found and change is positive (amount is 1)
            const cartItem = { 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                amount: 1 
            };
            cart = [...cart, cartItem];
        }

        renderCart();
    };


    // --- Event Listeners and Logic Setup ---

    // 1. Handle Quantity Buttons on Product Cards (- 0 +)
    if (productInventory) {
        // Uses event delegation to listen for clicks on all product buttons
        productInventory.addEventListener('click', (event) => {
            let target = event.target.closest('button');
            
            // Ensure the clicked target is one of the quantity buttons
            if (!target || (!target.classList.contains('qty-plus') && !target.classList.contains('qty-minus'))) {
                return;
            }

            const id = target.dataset.id;
            let change = 0;
            
            if (target.classList.contains('qty-plus')) {
                change = 1;
            } else if (target.classList.contains('qty-minus')) {
                // Only allow decrement if the item is currently in the cart
                const currentCartItem = cart.find(item => item.id === id);
                if (currentCartItem && currentCartItem.amount > 0) {
                     change = -1;
                }
            }

            if (change !== 0) {
                updateCartItem(id, change);
                showCart(); // Open cart automatically when an item is added/modified
            }
        });
    }

    // 2. Setup Cart display buttons
    if (cartButton && closeCartButton && cartOverlay) {
        // *** THIS IS THE FIX FOR THE CART NOT OPENING ***
        // Ensure the event listeners are correctly attached to the main button elements
        cartButton.addEventListener('click', showCart);
        closeCartButton.addEventListener('click', hideCart);
        
        // Close cart when clicking the dark overlay area
        cartOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-overlay')) {
                hideCart();
            }
        });
    }

    // 3. Setup Cart Operations (Clear, Order, and Item Quantity Control inside the cart)
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                renderCart();
            }
        });
    }
    
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert(`Order placed successfully! Total: ₹ ${cartTotal.textContent}. Thank you for ordering!`);
                cart = [];
                renderCart();
                hideCart();
            } else {
                alert('Your cart is empty. Please add items before ordering.');
            }
        });
    }

    // Item Quantity Control (delegated listener inside the cart modal)
    if (cartContent) {
        cartContent.addEventListener('click', (event) => {
            let target = event.target;
            
            // Check for 'remove' link click
            if (target.classList.contains('remove-item')) {
                let id = target.closest('.cart-item').dataset.id;
                cart = cart.filter(item => item.id !== id);
                renderCart();
            } 
            
            // Check for +/- button click inside the cart
            else if (target.closest('.qty-plus') || target.closest('.qty-minus')) {
                const button = target.closest('.qty-plus') || target.closest('.qty-minus');
                const id = button.dataset.id;
                const change = button.classList.contains('qty-plus') ? 1 : -1;
                
                const cartItem = cart.find(item => item.id === id);
                
                if (cartItem) {
                    // Update cart logic using the product ID
                    updateCartItem(id, change);
                }
            }
        });
    }
    
    // Initial render when the page loads
    renderCart(); 
});