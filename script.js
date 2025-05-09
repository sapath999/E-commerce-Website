document.addEventListener('DOMContentLoaded', function() {
    // Get all sections
    const sections = document.querySelectorAll('section');
    const hero = document.querySelector('.hero');
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.navbar nav a');
    
    // Function to reset scroll position
    function resetScroll() {
        window.scrollTo(0, 0);
    }
    
    // Update the navigation click handler
    navLinks.forEach(link => {
        // Remove the cloning part as it's causing hover issues
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Handle home link
            if(this.getAttribute('href') === '#home') {
                hero.style.display = 'flex';
                resetScroll();
            } else {
                hero.style.display = 'none';
                
                // Show the selected section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if(targetSection) {
                    targetSection.style.display = 'block';
                    resetScroll();
                }
            }
        });
    });

    // Initialize the active state based on current URL
    const currentLocation = window.location.hash || '#home';
    navLinks.forEach(link => {
        if(link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // Search functionality with error handling
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const products = document.querySelectorAll('.product');

    if (searchInput && searchButton && products.length > 0) {
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            products.forEach(product => {
                const productName = product.querySelector('h3')?.textContent.toLowerCase() || '';
                const productPrice = product.querySelector('p')?.textContent.toLowerCase() || '';
                const searchString = productName + ' ' + productPrice;
                
                if (searchString.includes(searchTerm) || searchTerm === '') {
                    product.style.display = 'block';
                    product.style.opacity = '1';
                } else {
                    product.style.display = 'none';
                    product.style.opacity = '0';
                }
            });

            // Show "No results found" message if no products are visible
            const visibleProducts = document.querySelectorAll('.product[style="display: block"]');
            const noResultsMsg = document.getElementById('noResultsMessage');
            
            if (visibleProducts.length === 0 && searchTerm !== '') {
                if (!noResultsMsg) {
                    const message = document.createElement('div');
                    message.id = 'noResultsMessage';
                    message.className = 'no-results';
                    message.textContent = 'No products found matching your search.';
                    document.querySelector('.products')?.appendChild(message);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        // Search event listeners
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
            performSearch();
        });
    }

    document.querySelector('a[href="#products"]').addEventListener('click', function(e) {
        e.preventDefault();
        
        const ball = document.querySelector('.basketball-animation');
        const productsSection = document.querySelector('#products');
        const hero = document.querySelector('.hero');
        
        // Hide hero section
        hero.classList.add('hidden');
        
        // Show and animate the ball
        if (ball) {
            ball.style.display = 'block';
            
            // Reset animation
            ball.style.animation = 'none';
            ball.offsetHeight;
            ball.style.animation = 'roll 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // After animation, show products section
            setTimeout(() => {
                ball.style.display = 'none';
                hero.style.display = 'none';
                productsSection.style.display = 'block';
                setTimeout(() => {
                    productsSection.classList.add('visible');
                }, 50);
            }, 2300); // Adjusted timing to match animation
        }
    });

    // Add Home link click handler
    document.querySelector('a[href="#home"]').addEventListener('click', function(e) {
        e.preventDefault();
        
        const productsSection = document.querySelector('#products');
        const hero = document.querySelector('.hero');
        
        // Hide products section
        productsSection.classList.remove('visible');
        
        // Show hero section
        hero.style.display = 'block';
        setTimeout(() => {
            hero.classList.remove('hidden');
            productsSection.style.display = 'none';
        }, 50);
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate sending message
            setTimeout(() => {
                // Create popup message
                const popup = document.createElement('div');
                popup.className = 'message-success-popup';
                popup.innerHTML = `
                    <div class="popup-content">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you for contacting us. We'll get back to you soon.</p>
                        <button class="close-popup">OK</button>
                    </div>
                `;
                document.body.appendChild(popup);

                // Reset form and button
                this.reset();
                submitBtn.innerHTML = 'Send Message';
                submitBtn.disabled = false;

                // Remove popup after delay
                setTimeout(() => {
                    popup.classList.add('fade-out');
                    setTimeout(() => popup.remove(), 500);
                }, 3000);
            }, 1500);
        });
    }

    // Shopping Cart functionality
    let cart = [];
    let cartTotal = 0;

    // Create cart UI
    const cartUI = document.createElement('div');
    cartUI.className = 'cart-container';
    cartUI.innerHTML = `
        <div class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        </div>
        <div class="cart-dropdown">
            <div class="cart-items"></div>
            <div class="cart-total">Total: Rs. <span>0</span></div>
            <button class="checkout-btn">Checkout</button>
        </div>
    `;
    document.querySelector('.navbar').appendChild(cartUI);

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product details
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseInt(this.dataset.price),
                quantity: 1
            };

            // Check if product already in cart
            const existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push(product);
            }

            // Show animation
            showAddedAnimation(this);
            
            // Update cart
            updateCart();
        });
    });

    function updateCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        cartItems.innerHTML = '';
        cartTotal = 0;

        cart.forEach(item => {
            cartTotal += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>Rs. ${item.price * item.quantity}</span>
                    <button class="remove-item" data-id="${item.id}">×</button>
                </div>
            `;
        });

        document.querySelector('.cart-total span').textContent = cartTotal;
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function showAddedAnimation(button) {
        // Add the animation class
        button.classList.add('added');
        button.textContent = 'Added!';
        
        // Animate cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.classList.add('bump');
        
        // Remove animation classes after completion
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            cartIcon.classList.remove('bump');
        }, 1500);
    }

    // Remove item from cart
    document.querySelector('.cart-items').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    });

    // Toggle cart dropdown
    document.querySelector('.cart-icon').addEventListener('click', function() {
        document.querySelector('.cart-dropdown').classList.toggle('show');
    });

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            // Show payment modal
            const modal = document.getElementById('paymentModal');
            const modalAmount = document.getElementById('modalAmount');
            modalAmount.textContent = cartTotal.toFixed(2);
            modal.style.display = 'block';
        } else {
            alert('Your cart is empty!');
        }
    });

    // Close modal when clicking the X
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('paymentModal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('paymentModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle payment submission
    document.querySelector('.pay-button').addEventListener('click', function() {
        const modal = document.getElementById('paymentModal');
        const paymentForm = document.querySelector('.payment-form');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing Payment...</p>
        `;

        // Hide form and show loading
        paymentForm.style.display = 'none';
        modal.querySelector('.payment-body').appendChild(loadingDiv);
        loadingDiv.style.display = 'block';

        // Simulate payment processing
        setTimeout(() => {
            loadingDiv.remove();
            
            // Show success message
            const successDiv = showPaymentSuccess(modal, cartTotal);
            
            // Handle Done button click
            successDiv.querySelector('.done-btn').addEventListener('click', () => {
                modal.style.display = 'none';
                cart = [];
                updateCart();
                // Reset form
                paymentForm.style.display = 'flex';
                successDiv.remove();
            });
        }, 2000);
    });

    // Payment success message with correct HTML
    function showPaymentSuccess(modal, cartTotal) {
        const successDiv = document.createElement('div');
        successDiv.className = 'payment-success';
        successDiv.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h2>Payment Successful!</h2>
            <p class="transaction-id">Transaction ID: ${Date.now()}</p>
            <p class="amount">Amount Paid: Rs. ${cartTotal.toFixed(2)}</p>
            <button class="done-btn">Done</button>
        `;
        
        modal.querySelector('.payment-body')?.appendChild(successDiv);
        return successDiv;
    }

    // Learn More button click handler
    const learnMoreBtn = document.querySelector('.cta-btn.secondary');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            const modal = document.getElementById('learnMoreModal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    // Close learn more modal
    document.querySelector('.close-learn-more').addEventListener('click', function() {
        document.getElementById('learnMoreModal').style.display = 'none';
    });

    // Close on outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('learnMoreModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add staggered animation for products on page load
    products.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
        setTimeout(() => {
            product.style.transition = 'all 0.5s ease';
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Get Started button click handler
    document.querySelector('.cta-btn.primary').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Hide all sections first
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Hide hero section
        const hero = document.querySelector('.hero');
        hero.style.display = 'none';
        
        // Show About section
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.style.display = 'block';
            
            // Smooth scroll to about section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update active state in navigation
            const navLinks = document.querySelectorAll('.navbar nav a');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#about') {
                    link.classList.add('active');
                }
            });
        }
        
        // Close mobile menu if open
        const navbar = document.querySelector('.navbar');
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            document.querySelector('.menu-toggle').innerHTML = '☰';
        }
    });
});

