let products = [];
let productReviews = [];
let user = "";


document.addEventListener('DOMContentLoaded', initializeApp);


// Initialization fetches the products and reviews data and
// updates the cart nav item count and total
function initializeApp() {
    fetchAllProducts();
    fetchAllReviews().then(reviews => {
        productReviews = reviews;
    });
    updateCartUI();
}


// Fetches all product data from the database
async function fetchAllProducts() {
    try {
        const response = await fetch('api/products', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        products = await response.json();
    } catch (error) {
        console.error("There was a problem fetching the products:", error);
        displayNotification("An error occured while fetching products. Check the console for more details.");
    }
}


// Function for rendering the home page and setting the nav items style. The
// home page features a large welcome title and smaller description below. 
function renderHome() {
    if (user !== "") {
        const btnContainer = document.getElementById("btn-container");
        btnContainer.innerHTML = `
            <button id="sign-out-btn" class="btn register-sign-btn" onclick="signOut()">Sign Out</button>
        `;
        
        const nav = document.getElementById("nav");
        nav.innerHTML = `
            <button id="home-btn" class="nav-item active-nav-item" onclick="renderHome()">Home</button>
            <button id="store-btn" class="nav-item" onclick="renderStore()">Store</button>
            <button id="cart-btn" class="nav-item" onclick="renderCart()">
                <span>Cart</span>
                <div id="cart-count">0</div>
                <div id="nav-cart-total">$0.00</div>
            </button>
            <button id="orders-btn" class="nav-item" onclick="renderOrders()">Orders</button>
            <button id="account-btn" class="nav-item" onclick="renderAccount()">Account</button>
        `;
    }
    else { // User is signed in
        const btnContainer = document.getElementById("btn-container");
        btnContainer.innerHTML = `
            <button id="register-btn" class="btn register-sign-btn" onclick="renderRegistration()">Register</button>
            <button id="sign-in-btn" class="btn register-sign-btn" onclick="renderSignIn()">Sign In</button>
        `;
        
        const nav = document.getElementById("nav");
        nav.innerHTML = `
            <button id="home-btn" class="nav-item active-nav-item" onclick="renderHome()">Home</button>
            <button id="store-btn" class="nav-item" onclick="renderStore()">Store</button>
            <button id="cart-btn" class="nav-item" onclick="renderCart()">
                <span>Cart</span>
                <div id="cart-count">0</div>
                <div id="nav-cart-total">$0.00</div>
            </button>
        `;
        
        document.getElementById("register-btn").classList.remove("active-btn");
        document.getElementById("sign-in-btn").classList.remove("active-btn");
    }
    
    document.getElementById("home-btn").classList.add("active-nav-item");
    document.getElementById("store-btn").classList.remove("active-nav-item");
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    
    const content = document.getElementById("content");
    content.style.justifyContent = "center";
    
    content.innerHTML = `
        <div id="welcome">
            <p id="welcome-title">Welcome to <span class="red">Computer Nook</span>!</p>
            <p id="welcome-msg">Access the Computer Nook store and cart using the navigation menu on the left.</p>
            <p id="welcome-msg">The store features various computer components and computers with customizable configurations.</p>
        </div>
        <div id="inner-content"></div>
    `;
    
    updateCartUI();
}


// Function for rendering the store and setting the nav items style
// Also renders the computers section of the store
function renderStore() {
    if (user === "") {
        document.getElementById("register-btn").classList.remove("active-btn");
        document.getElementById("sign-in-btn").classList.remove("active-btn");
    }
    else {
        document.getElementById("orders-btn").classList.remove("active-nav-item");
        document.getElementById("account-btn").classList.remove("active-nav-item");
    }
    
    document.getElementById("home-btn").classList.remove("active-nav-item");
    document.getElementById("store-btn").classList.add("active-nav-item");
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    content.innerHTML = `
    <div id="category-container">
        <button id="computers-btn" class="category-item" onclick="renderComputers()">Computers</button>
        <button id="monitors-btn" class="category-item" onclick="renderMonitors()">Monitors</button>
        <button id="rams-btn" class="category-item" onclick="renderRams()">RAM</button>
        <button id="hds-btn" class="category-item" onclick="renderHds()">Hard Drives</button>
        <button id="cpus-btn" class="category-item" onclick="renderCpus()">CPU</button>
        <button id="gpus-btn" class="category-item" onclick="renderGpus()">GPU</button>
        <button id="oss-btn" class="category-item" onclick="renderOss()">OS</button>
        <button id="audios-btn" class="category-item" onclick="renderAudios()">Audio Cards</button>
    </div>
    <div id="inner-content"></div>
    `;
    
    renderComputers();
}


// Renders a grid of computers for sale and sets the category buttons visibility
function renderComputers() {
    const innerContent = document.getElementById("inner-content");
    innerContent.style.flexDirection = "row";
    innerContent.style.justifyContent = "center";
    document.getElementById("computers-btn").classList.add("active-nav-item");
    document.getElementById("monitors-btn").classList.remove("active-nav-item");
    document.getElementById("rams-btn").classList.remove("active-nav-item");
    document.getElementById("hds-btn").classList.remove("active-nav-item");
    document.getElementById("cpus-btn").classList.remove("active-nav-item");
    document.getElementById("gpus-btn").classList.remove("active-nav-item");
    document.getElementById("oss-btn").classList.remove("active-nav-item");
    document.getElementById("audios-btn").classList.remove("active-nav-item");
    
    const computers = products.filter(product => product.category === "Computer");
    
    const computerGrid = computers.map(computer => `
        <div class="product-card" onclick="viewComputer('${computer.productId}')">
            <img class="product-img" src="${computer.imageSrc}" alt="${computer.imageAlt}">
            <h3 class="product-info">${computer.brand} ${computer.name}</h3>
            <p class="product-description">${computer.description}</p>
            <div id="spacer-container">
                <p class="product-price">Price: $${computer.price.toFixed(2)}</p>
                <button id="buy-btn" onclick="addToCart('${computer.productId}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    innerContent.innerHTML = `
    <div class="product-grid">
        ${computerGrid}
        <div id="bottom-filler"></div>
    </div>
    `;
}


// Renders the sale page for a selected computer
// Allows the customer to customize the computer's configuration.
// Includes product reviews as well.
function viewComputer(computerId) {
    const computer = products.find(product => String(product.productId) === String(computerId)); 
    const specs = JSON.parse(computer.specs);
    const reviews = productReviews.filter(r => String(r.productId) === String(computerId));
    const innerContent = document.getElementById("inner-content");
    innerContent.style.flexDirection = "column";
    innerContent.style.justifyContent = "unset";
    
    const cpus = products.filter(product => product.category === "CPU");
    const rams = products.filter(product => product.category === "RAM");
    const gpus = products.filter(product => product.category === "GPU");
    const oss = products.filter(product => product.category === "OS");
    const audios = products.filter(product => product.category === "Audio");
    const hds = products.filter(product => product.category === "HD");
    
    innerContent.innerHTML = `
        <div class="view-product-container">
            <img class="view-product-img" src="${computer.imageSrc}" alt="${computer.imageAlt}">
            <div class="specs-container">
                <h3>${computer.brand} ${computer.name}</h3>
                <p>${computer.description}</p>
                <h4>Price: $${computer.price.toFixed(2)}</h4>
                <h3>Specifications:</h3>
                <ul>
                    <li>RAM: ${specs.ram}</li>
                    <li>HD: ${specs.hd}</li>
                    <li>CPU: ${specs.cpu}</li>
                    <li>GPU: ${specs.gpu}</li>
                    <li>OS: ${specs.os}</li>
                    <li>AUDIO: ${specs.audio}</li>
                </ul>
            </div>
        </div>
        <div id="customize-title" class="title-container"><h2>Customize Configuration</h2></div>
        <div id="customize-container">
            <div class="customize-column">
                <h4 class="customize-heading">CPU</h4>
                <select id="cpu-select" class="select">
                    <option value="default" selected">Default</option>
                    ${cpus.map(cpu => `<option value="${cpu.productId}">${cpu.brand} ${cpu.name}</option>`).join('')}
                </select>
                <h4 class="customize-heading">Ram</h4>
                <select id="ram-select" class="select">
                    <option value="default" selected">Default</option>
                    ${rams.map(ram => `<option value="${ram.productId}">${ram.brand} ${ram.name}</option>`).join('')}
                </select>
            </div>
            <div class="customize-column">
                <h4 class="customize-heading">GPU</h4>
                <select id="gpu-select" class="select">
                    <option value="default" selected">Default</option>
                    ${gpus.map(gpu => `<option value="${gpu.productId}">${gpu.brand} ${gpu.name}</option>`).join('')}
                </select>
                <h4 class="customize-heading">OS</h4>
                <select id="os-select" class="select">
                    <option value="default" selected">Default</option>
                    ${oss.map(os => `<option value="${os.productId}">${os.brand} ${os.name}</option>`).join('')}
                </select>
            </div>
            <div class="customize-column">
                <h4 class="customize-heading">Audio Card</h4>
                <select id="audio-select" class="select">
                    <option value="default" selected">Default</option>
                    ${audios.map(audio => `<option value="${audio.productId}">${audio.brand} ${audio.name}</option>`).join('')}
                </select>
                <h4 class="customize-heading">Hard Drive</h4>
                <select id="hd-select" class="select">
                    <option value="default" selected">Default</option>
                    ${hds.map(hd => `<option value="${hd.productId}">${hd.brand} ${hd.name}</option>`).join('')}
                </select>
            </div>
        </div>
        <div id="viewing-btn-container" class="flex-row-center viewing-computer-btn-container">
            <button id="buy-btn-viewing" class="btn" onclick="addComputerToCart('${computer.productId}')">Add to Cart</button>
        </div>
    
        <!-- Reviews Section -->
        <div class="title-container" id="reviews-title"><h2>Product Reviews</h2></div>
        <div id="product-reviews">
            ${reviews.length > 0 ? reviews.map(review => `
                <div class="review-row">
                    <div class="review-left">
                        <h4>Email: ${review.email}</h4>
                        <h4>Rating: ${review.rating} / 5</h4>
                        <h4>Date: ${new Date(review.reviewDate).toLocaleDateString()}</h4>
                    </div>
                    <div class="review-right">
                        ${review.reviewText}
                    </div>
                </div>`).join('') : '<p class="review-row" id="no-reviews-row">No reviews available for this product.</p>'}
            
            <!-- Post Review Section -->
            <div class="review-row">
                <div class="review-left" id="post-inp-container">
                    <div id="select-container">
                        <label for="rating-select" id="rating-label">Rating: </label>
                        <select id="rating-select">
                            <option class="rating-option" value="5" selected>5</option>
                            <option class="rating-option" value="4">4</option>
                            <option class="rating-option" value="3">3</option>
                            <option class="rating-option" value="2">2</option>
                            <option class="rating-option" value="1">1</option>
                        </select>
                    </div>
                    <button id="post-review-btn" class="btn" onclick="submitReview(${computerId})">Post</button>
                </div>
                <div class="review-right">
                    <textarea type="text" id="review-input" placeholder="Write a product review here!"></textarea>
                </div>
            </div>
        </div>
    `;
}


// Renders a grid of products for a particular product category
// Categories: Monitors, RAM, HDs, CPUs, GPUs, OS, Audio Cards
// Excluding computers
function renderProductGrid(category, buttonId) {
    const innerContent = document.getElementById("inner-content");
    innerContent.style.flexDirection = "row";
    innerContent.style.justifyContent = "center";

    // Reset all category buttons
    document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active-nav-item'));
    document.getElementById(buttonId).classList.add('active-nav-item');

    const filteredProducts = products.filter(product => product.category === category);
    const productGrid = filteredProducts.map(product => `
        <div class="product-card" onclick="viewProduct('${product.productId}')">
            <img class="product-img" src="${product.imageSrc}" alt="${product.imageAlt}">
            <h3 class="product-info">${product.brand} ${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div id="spacer-container">
                <p class="product-price">Price: $${product.price.toFixed(2)}</p>
                <button id="buy-btn" onclick="addToCart('${product.productId}')">Add to Cart</button>
            </div>
        </div>
    `).join('');

    innerContent.innerHTML = `
        <div class="product-grid">
            ${productGrid}
            <div id="bottom-filler"></div>
        </div>
    `;
}


// Functions for rendering product grids for each product category
// Excluding computers
function renderMonitors() {
  renderProductGrid("Monitor", "monitors-btn");
}

function renderRams() {
  renderProductGrid("RAM", "rams-btn");
}

function renderHds() {
  renderProductGrid("HD", "hds-btn");
}

function renderCpus() {
  renderProductGrid("CPU", "cpus-btn");
}

function renderGpus() {
  renderProductGrid("GPU", "gpus-btn");
}

function renderOss() {
  renderProductGrid("OS", "oss-btn");
}

function renderAudios() {
  renderProductGrid("Audio", "audios-btn");
}


// Renders the sale page for a selected product
// Excluding computers
function viewProduct(productId) {
    const product = products.find(product => String(product.productId) === String(productId));
    const specs = JSON.parse(product.specs);
    const reviews = productReviews.filter(r => String(r.productId) === String(productId));
    const innerContent = document.getElementById("inner-content");
    innerContent.style.flexDirection = "column";
    innerContent.style.justifyContent = "unset";
    
    const specsList = Object.entries(specs).map(([key, value]) => 
        `<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</li>`
    ).join('');
    
    innerContent.innerHTML = `
        <div class="view-product-container">
            <img class="view-product-img" src="${product.imageSrc}" alt="${product.imageAlt}">
            <div class="specs-container">
                <h3>${product.brand} ${product.name}</h3>
                <p>${product.description}</p>
                <h4>Price: $${product.price.toFixed(2)}</h4>
                <h3>Specifications:</h3>
                <ul>
                    ${specsList}
                </ul>
            </div>
        </div>
        <div class="flex-row-center" id="viewing-btn-container">
            <button id="buy-btn-viewing" class="btn" onclick="addToCart('${product.productId}')">Add to Cart</button>
        </div>
    
        <!-- Reviews Section -->
        <div class="title-container" id="reviews-title"><h2>Product Reviews</h2></div>
        <div id="product-reviews">
            ${reviews.length > 0 ? reviews.map(review => `
                <div class="review-row">
                    <div class="review-left">
                        <h4>Email: ${review.email}</h4>
                        <h4>Rating: ${review.rating} / 5</h4>
                        <h4>Date: ${new Date(review.reviewDate).toLocaleDateString()}</h4>
                    </div>
                    <div class="review-right">
                        ${review.reviewText}
                    </div>
                </div>`).join('') : '<p class="review-row" id="no-reviews-row">No reviews available for this product.</p>'}
            
            <!-- Post Review Section -->
            <div class="review-row">
                <div class="review-left" id="post-inp-container">
                    <div id="select-container">
                        <label for="rating-select" id="rating-label">Rating: </label>
                        <select id="rating-select">
                            <option class="rating-option" value="5" selected>5</option>
                            <option class="rating-option" value="4">4</option>
                            <option class="rating-option" value="3">3</option>
                            <option class="rating-option" value="2">2</option>
                            <option class="rating-option" value="1">1</option>
                        </select>
                    </div>
                    <button id="post-review-btn" class="btn" onclick="submitReview(${productId})">Post</button>
                </div>
                <div class="review-right">
                    <textarea type="text" id="review-input" placeholder="Write a product review here!"></textarea>
                </div>
            </div>
        </div>
    `;
}


// Adds a selected product to the shopping cart and
// updates the nav cart items count and total
function addToCart(productId) {
    event.stopPropagation();

    const product = products.find(p => String(p.productId) === String(productId));
    if (product) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => String(item.id) === String(productId));
        
        if (existingItem && !existingItem.customParts) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.productId,
                category: product.category,
                image: product.imageSrc,
                alt: product.imageAlt,
                brand: product.brand,
                name: product.name,
                quantity: 1,
                price: product.price
            });
        }
        
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        displayNotification("Product added to cart successfully");
    }
}


// Adds a customized computer to the shopping cart and
// updates the nav cart items count and total
function addComputerToCart(computerId) {
    event.stopPropagation();
    const product = products.find(p => String(p.productId) === String(computerId));
    const specs = JSON.parse(product.specs);
    if (product) {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const customParts = {
            cpu: document.getElementById('cpu-select').value,
            ram: document.getElementById('ram-select').value,
            gpu: document.getElementById('gpu-select').value,
            os: document.getElementById('os-select').value,
            audio: document.getElementById('audio-select').value,
            hd: document.getElementById('hd-select').value
        };
        
        const cartItem = {
            id: product.productId,
            category: product.category,
            image: product.imageSrc,
            alt: product.imageAlt,
            brand: product.brand,
            name: product.name,
            quantity: 1,
            price: product.price,
            customParts: customParts,
            specs: specs
        };
        
        // Calculate additional cost for custom parts
        Object.keys(customParts).forEach(part => {
            if (customParts[part] !== 'default') {
                const customPart = products.find(p => String(p.productId) === String(customParts[part]));
                if (customPart) {
                    cartItem.price += customPart.price;
                }
            }
        });
        
        cart.push(cartItem);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        displayNotification("Computer added to cart successfully");
    }
}


// Removes a selected item from the shopping cart
function removeFromCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => String(item.id) === String(productId));
    
    if (index !== -1) { // if product is in cart
        if (cart[index].quantity > 1) { // if quantity is > 1
            cart[index].quantity -= 1; // decrement quantity
        } else {
            cart.splice(index, 1); // remove the product from the cart
        }
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        renderCart();
    }
}


// Function for rendering the cart and setting the nav items style
function renderCart() {
    if (user === "") {
        document.getElementById("register-btn").classList.remove("active-btn");
        document.getElementById("sign-in-btn").classList.remove("active-btn");
    }
    else {
        document.getElementById("orders-btn").classList.remove("active-nav-item");
        document.getElementById("account-btn").classList.remove("active-nav-item");
    }
    document.getElementById("home-btn").classList.remove("active-nav-item");
    document.getElementById("store-btn").classList.remove("active-nav-item");
    document.getElementById("cart-btn").classList.add("active-nav-item");
    
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // If cart is empty, return the table head and an empty cart message
    if (cart.length === 0) {
        content.innerHTML = `
            <div class="title-container"><h2>Shopping Cart</h2></div>
            <div id="inner-content">
                <div id="table">
                    <div id="table-head">
                        <p id="placeholder-heading" class="table-heading"></p>
                        <p id="product-heading" class="table-heading">Product</p>
                        <p id="quantity-heading" class="table-heading">Quantity</p>
                        <p id="price-heading" class="table-heading">Price</p>
                        <p id="remove-heading" class="table-heading">Remove</p>
                    </div>
                </div>
            </div>
            <h3>Your cart is empty</h3>
        `;
        return;
    }
    
    // Otherwise, set the table with the head and shopping cart items below
    content.innerHTML = `
        <div class="title-container"><h2>Shopping Cart</h2></div>
        <div id="inner-content">
            <div id="table">
                <div id="table-head">
                    <p id="placeholder-heading" class="table-heading"></p>
                    <p id="product-heading" class="table-heading">Product</p>
                    <p id="quantity-heading" class="table-heading">Quantity</p>
                    <p id="price-heading" class="table-heading">Price</p>
                    <p id="remove-heading" class="table-heading">Remove</p>
                </div>
                <div id="table-body"></div>
                <p id="cart-total">Total: $${cartTotal.toFixed(2)}</p>
            </div>
        </div>
        <button id="checkout-btn" class="btn" onclick="renderCheckout()">Checkout</button>
    `;
    
    document.getElementById("inner-content").style.overflowY = "hidden";
    document.getElementById("inner-content").style.margin = "0";
    
    const cartItems = cart.map(item => {
        let specsHtml = '';
        if (item.category === "Computer" && item.customParts) {
            const customizedParts = Object.entries(item.customParts).filter(([part, id]) => id !== 'default');

            if (customizedParts.length > 0) {
                specsHtml = `
                    <p id="custom-specs-heading">Custom Specifications:</p>
                    <ul id="custom-specs-list">
                        ${customizedParts.map(([part, id]) => {
                            const customPart = products.find(p => String(p.productId) === String(id));
                            return `<li>${part.toUpperCase()}: ${customPart ? customPart.brand + ' ' + customPart.name : 'Unknown'}</li>`;
                        }).join('')}
                    </ul>
                `;
            } else {
                specsHtml = '';
            }
        }
        
        return `
        <div class="cart-item">
            <div class="cart-img-container">
                <img class="cart-img" src="${item.image}" alt="${item.name}" width="90">
            </div>
            <span class="product-cell">
                ${item.brand} ${item.name}
                ${specsHtml}
            </span>
            <span class="quantity-cell">${item.quantity}</span>
            <span class="price-cell">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">X</button>
        </div>
        `;
    }).join('');
    
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = cartItems;
}


// Updates the cart nav menu item with total quantity of items and total cost
function updateCartUI() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart icon or display
    document.getElementById('cart-count').textContent = cartCount;
    document.getElementById('nav-cart-total').textContent = `$${cartTotal.toFixed(2)}`;
}


// checkout function renders the checkout page where the customer can input their info
function renderCheckout() {
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    content.innerHTML = `
        <div class="title-container" id="checkout-title"><h2>Checkout</h2></div>
        <form id="checkout-form">
            <div id="forms-container">
                <div id="billing-info">
                    <h3 class="form-title">Billing Information</h3>
                    <input type="text" id="billing-name" class="checkout-input" placeholder="Full Name" required>
                    <input type="email" id="billing-email" class="checkout-input" placeholder="Email" required>
                    <input type="text" id="billing-address" class="checkout-input" placeholder="Address" required>
                    <input type="text" id="billing-city" class="checkout-input" placeholder="City" required>
                    <input type="text" id="billing-province" class="checkout-input" placeholder="Province" required>
                    <input type="text" id="billing-postal" class="checkout-input" placeholder="Postal Code" required>
                    <input type="number" id="billing-card-number" class="checkout-input" placeholder="Card Number" required>
                    <input type="text" id="billing-expiry" class="checkout-input" placeholder="Expiry Date" required>
                    <input type="text" id="billing-cvv" class="checkout-input" placeholder="CVV" required>
                </div>
                <div id="shipping-info">
                    <h3 class="form-title">Shipping Information</h3>
                    <input type="text" id="shipping-name" class="checkout-input" placeholder="Full Name" required>
                    <input type="text" id="shipping-address" class="checkout-input" placeholder="Address" required>
                    <input type="text" id="shipping-city" class="checkout-input" placeholder="City" required>
                    <input type="text" id="shipping-province" class="checkout-input" placeholder="Province" required>
                    <input type="text" id="shipping-postal" class="checkout-input" placeholder="Postal Code" required>
                    <h3 id="checkout-cart-total">Total: $${cartTotal.toFixed(2)}</h3>
                </div>
            </div>
            <div class="flex-row-center">
                <button type="submit" id="submit-order-btn" class="btn">Submit Order</button>
            </div>
        </form>
    `;
    
    // Add event listener to the form
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitCheckoutForm();
    });
}


// Submits an order and stores it in a cookie on the client
// or in the database if the user is logged in.
function submitCheckoutForm() {
    const customerInfo = {
        billingName: document.getElementById('billing-name').value,
        billingEmail: document.getElementById('billing-email').value,
        billingAddress: document.getElementById('billing-address').value,
        billingCity: document.getElementById('billing-city').value,
        billingProvince: document.getElementById('billing-province').value,
        billingPostal: document.getElementById('billing-postal').value,
        billingCardNumber: document.getElementById('billing-card-number').value,
        billingExpiry: document.getElementById('billing-expiry').value,
        billingCVV: document.getElementById('billing-cvv').value,
        shippingName: document.getElementById('shipping-name').value,
        shippingAddress: document.getElementById('shipping-address').value,
        shippingCity: document.getElementById('shipping-city').value,
        shippingProvince: document.getElementById('shipping-province').value,
        shippingPostal: document.getElementById('shipping-postal').value
    };

    const cartItems = JSON.parse(sessionStorage.getItem('cart'));
    
    const newOrder = {
        customerInfo: JSON.stringify(customerInfo),
        orderItems: JSON.stringify(cartItems),
        userEmail: user
    };

    if (user !== "") {
        // Send POST request to server
        fetch('api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order successfully submitted:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            displayNotification("There was an error submitting the order. Please check the console for more details.");
            return;
        });
    }
    else {
         // Get existing orders from the cookie
        let orders = [];
        const existingOrdersCookie = getCookie('orders');
        if (existingOrdersCookie) {
            orders = JSON.parse(decodeURIComponent(existingOrdersCookie));
        }

        // Add the new order to the array
        orders.push(newOrder);

        // Store the updated orders array in the cookie
        const ordersString = JSON.stringify(orders);
        document.cookie = `orders=${encodeURIComponent(ordersString)}; path=/; max-age=7776000`; // Expires in 3 months
        console.log('Order data saved in cookie');
    }
    
    sessionStorage.removeItem('cart');
    updateCartUI();
    renderConfirmation();
}


// Retrieves a named cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Renders the order confirmation screen after submitting an order
function renderConfirmation() {
    const content = document.getElementById("content");
    content.style.justifyContent = "center";
    
    content.innerHTML = `
        <h2 id="confirmation-text">Your order has been submitted!</h2>
    `;
    
    displayNotification("Order placed successfully");
}


// Renders the user registration UI
function renderRegistration() {
    document.getElementById("home-btn").classList.remove("active-nav-item");
    document.getElementById("store-btn").classList.remove("active-nav-item");
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    document.getElementById("register-btn").classList.add("active-btn");
    document.getElementById("sign-in-btn").classList.remove("active-btn");
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    content.innerHTML = `
        <div class="title-container" id="registration-title"><h2>User Registration</h2></div>
        <div class="form-container">
            <form class="register-sign-form" id="register-form">
                <div class="label-input-container">
                    <label for="name-input" class="register-sign-label">Name: </label>
                    <input type="text" id="name-input" class="register-sign-input" required>
                </div>
                <div class="label-input-container">
                    <label for="email-input" class="register-sign-label">Email: </label>
                    <input type="text" id="email-input" class="register-sign-input" required>
                </div>
                <div class="label-input-container">
                    <label for="password-input" class="register-sign-label">Password: </label>
                    <input type="password" id="password-input" class="register-sign-input" required>
                </div>
                <input type="submit" id="register-submit" class="btn submit">
            </form>
        </div>
    `;
    
    // Add event listener to the form
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
}


// Renders the user sign in form
function renderSignIn() {
    document.getElementById("home-btn").classList.remove("active-nav-item");
    document.getElementById("store-btn").classList.remove("active-nav-item");
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    document.getElementById("sign-in-btn").classList.add("active-btn");
    document.getElementById("register-btn").classList.remove("active-btn");
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    content.innerHTML = `
        <div class="title-container" id="sign-in-title"><h2>Sign In</h2></div>
        <div class="form-container">
            <form class="register-sign-form" id="sign-in-form">
                <div class="label-input-container">
                    <label for="email-input" class="register-sign-label">Email: </label>
                    <input type="text" id="email-input" class="register-sign-input" required>
                </div>
                <div class="label-input-container">
                    <label for="password-input" class="register-sign-label">Password: </label>
                    <input type="password" id="password-input" class="register-sign-input" required>
                </div>
                <input type="submit" id="register-submit" class="btn submit">
            </form>
        </div>
    `;
    
    // Add event listener to the form
    document.getElementById('sign-in-form').addEventListener('submit', function(e) {
        e.preventDefault();
        signIn();
    });
}


// Submits the user's information for registration
function register() {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const userData = {
        name: name,
        email: email,
        password: password
    };
    
    fetch('api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        renderSignIn();
        displayNotification('User registered successfully');
    })
    .catch((error) => {
        console.error(error);
        displayNotification("There was a registration error. Check the console for more details.");
    });
}


// Submits the user's information for sign in and updates the UI
function signIn() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const userData = {
        email: email,
        password: password
    };
    
    fetch('api/users/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Sign-in failed');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        user = email;
        renderHome();
        displayNotification("Hello " + user + ". Signed in successfully.");
    })
    .catch(error => {
        console.error(error);
        displayNotification("There was a sign in error. Check the console for more details.");
    });
}


// Signs the user out and updates the UI
function signOut() {
    user = "";
    renderHome();
    displayNotification("Signed out successfully");
}


// Retrieves the reviews for a specified product
function fetchAllReviews() {
    return fetch('api/reviews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => reviewsXmlToJson(text))
        .catch(error => {
            console.error('Error fetching reviews:', error);
            displayNotification("An error occured while fetching reviews. Check the console for more details.");
            return []; // Return an empty array in case of an error
        });
}


// Function to convert reviews XML string to JSON
function reviewsXmlToJson(xml) {
    // Create a DOM parser
    const parser = new DOMParser();
    // Parse the XML string into a Document
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    // Extract relevant data
    const reviews = xmlDoc.getElementsByTagName('reviews');
    
    // Initialize an array to hold all review objects
    const jsonOutput = [];

    // Loop through each review and construct JSON object
    for (let i = 0; i < reviews.length; i++) {
        jsonOutput.push({
            productId: parseInt(reviews[i].getElementsByTagName('productId')[0].getElementsByTagName('productId')[0].textContent),
            email: reviews[i].getElementsByTagName('userEmail')[0].getElementsByTagName('email')[0].textContent,
            rating: parseInt(reviews[i].getElementsByTagName('rating')[0].textContent),
            reviewDate: reviews[i].getElementsByTagName('reviewDate')[0].textContent,
            reviewText: reviews[i].getElementsByTagName('reviewText')[0].textContent
        });
    }

    return jsonOutput;
}


// Function to convert orders XML string to json
function ordersXmlToJson(xml) {
    // Create a DOM parser
    const parser = new DOMParser();
    // Parse the XML string into a Document
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    // Extract all order elements
    const orders = xmlDoc.getElementsByTagName('orders');

    // Initialize an array to hold all order objects
    const jsonOutput = [];

    // Loop through each order and construct JSON object
    for (let i = 0; i < orders.length; i++) {
        const orderId = parseInt(orders[i].getElementsByTagName('orderId')[0].textContent);
        const orderItemsJson = JSON.parse(orders[i].getElementsByTagName('orderItems')[0].textContent);
        
        // Calculate total items and total price
        const totalItems = orderItemsJson.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = orderItemsJson.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        
        const orderDate = orders[i].getElementsByTagName('orderDate')[0].textContent;

        jsonOutput.push({
            orderId: orderId,
            totalItems: totalItems,
            totalPrice: parseFloat(totalPrice),
            date: orderDate
        });
    }

    return jsonOutput;
}


// Renders the orders UI. Only accessible if the user is signed in.
// Contains a table of the customer's orders
function renderOrders() {
    document.getElementById("home-btn").classList.remove("active-nav-item");
    document.getElementById("store-btn").classList.remove("active-nav-item");
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    document.getElementById("orders-btn").classList.add("active-nav-item");
    document.getElementById("account-btn").classList.remove("active-nav-item");
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    content.innerHTML = `
        <div class="title-container"><h2>Order History</h2></div>
        <div id="inner-content">
            <div id="table">
                <div id="table-head">
                    <p id="order-id-heading" class="table-heading">Order ID</p>
                    <p id="item-quantity-heading" class="table-heading">Items</p>
                    <p id="total-heading" class="table-heading">Total</p>
                    <p id="date-heading" class="table-heading">Date</p>
                </div>
                <div id="table-body"></div>
            </div>
        </div>
    `;
    
    let orders = [];
    const tableBody = document.getElementById("table-body");
    
    // fetch orders by email which is stored in user variable
    fetch(`api/orders/user/${encodeURI(user)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response not ok: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                orders = ordersXmlToJson(text);
                
                if (orders.length !== 0) {
                    const orderElements = orders.map(order => {
                        const date = new Date(order.date);

                        // Format the date
                        const formattedDate = date.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });

                        return `
                        <div class="order-element">
                            <span class="order-id-cell">
                                ${order.orderId}
                            </span>
                            <span class="item-quantity-cell">${order.totalItems}</span>
                            <span class="total-cell">$${order.totalPrice}</span>
                            <span class="date-cell">${formattedDate}</span>
                        </div>
                        `;
                    }).join('');
                    
                    tableBody.innerHTML = orderElements;
                }
                else {
                    tableBody.innerHTML = `
                        <h3 id="no-orders-text">You do not have any order history</h3>
                    `;
                }
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                displayNotification("An error occured while fetching orders. Check the console for more details.");
            });
}


// Renders the Account UI
// containg options for changing password
function renderAccount() {
    document.getElementById("home-btn").classList.remove("active-nav-item");
    document.getElementById("store-btn").classList.remove("active-nav-item");
    document.getElementById("cart-btn").classList.remove("active-nav-item");
    document.getElementById("orders-btn").classList.remove("active-nav-item");
    document.getElementById("account-btn").classList.add("active-nav-item");
    const content = document.getElementById("content");
    content.style.justifyContent = "unset";
    
    content.innerHTML = `
        <div class="title-container" id="account-title"><h2>Acount Management</h2></div>
        <div class="form-container">
            <form class="register-sign-form" id="pw-change-form">
                <div class="label-input-container">
                    <label for="existing-pw-input" class="register-sign-label">Existing Password: </label>
                    <input type="password" id="existing-pw-input" class="register-sign-input" required>
                </div>
                <div class="label-input-container">
                    <label for="new-pw-input" class="register-sign-label">New Password: </label>
                    <input type="password" id="new-pw-input" class="register-sign-input" required>
                </div>
                <div class="label-input-container">
                    <label for="confirm-pw-input" class="register-sign-label">Confirm Password: </label>
                    <input type="password" id="confirm-pw-input" class="register-sign-input" required>
                </div>
                <input type="submit" id="pw-change-submit" class="btn submit">
            </form>
        </div>
    `;
    
    // Add event listener to the form
    document.getElementById('pw-change-form').addEventListener('submit', function(e) {
        e.preventDefault();
        changePassword();
    });
}


// Displays a notification in the bottom right corner that fades-out after 5 seconds
function displayNotification(msg) {
  const content = document.getElementById("content");

  const notification = document.createElement("div");
  notification.textContent = msg;
  notification.classList.add("notification");

  content.appendChild(notification);

  // Remove the notification after 5 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      if (content.contains(notification)) {
        content.removeChild(notification);
      }
    }, 500); // Wait for fade-out animation to complete
  }, 5000);
}


// Submits a request to change user password
function changePassword() {
    const existingPassword = document.getElementById('existing-pw-input').value;
    const newPassword = document.getElementById('new-pw-input').value;
    const confirmPassword = document.getElementById('confirm-pw-input').value;
    
    const pwData = {
        email: user,
        existingPassword: existingPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };
    
    fetch('api/users/account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pwData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Password change failed');
        }
        return response.json();
    })
    .then(data => {
        renderAccount();
        console.log(data);
        displayNotification("Password changed successfully.");
    })
    .catch(error => {
        console.error(error);
        displayNotification("An error occured while changing password. Check the console for more details.");
    });
}


// Submits a product review to the database and to be rendered
function submitReview(productId) {
    if (user === "") {
        displayNotification("You must be signed in to post a review.");
    }
    else {
        const rating = document.getElementById('rating-select').value;
        const reviewText = document.getElementById('review-input').value;

        const reviewData = {
            email: user,
            productId: parseInt(productId),
            rating: parseInt(rating),
            reviewText: reviewText
        };

        fetch('api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit review.');
            }
            return response.json();
        })
        .then(data => {
            fetchAllReviews().then(reviews => {
                productReviews = reviews;
                viewProduct(productId);
                console.log(data);
                displayNotification("Review posted successfully.");
            });
        })
        .catch(error => {
            console.error(error);
            displayNotification("An error occured while posting review. Check the console for more details.");
        });
    }
}