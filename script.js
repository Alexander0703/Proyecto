let cart = [];
let currentUser = null;
let currentCategory = 'all';
let searchTerm = '';
let products = [];
let purchaseHistory = [];
let usuarios = [];

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const searchInput = document.querySelector('.search-input');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleFormLink = document.getElementById('toggle-form-link');
const formTitle = document.getElementById('form-title');
const formFooterText = document.getElementById('form-footer-text');
const overlay = document.getElementById('overlay');

// Mostrar mensajes modales
function showMessage(title, message, type = 'info', showCancel = false) {
    return new Promise((resolve) => {
        const messageOverlay = document.createElement('div');
        messageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        let primaryColor = 'var(--accent-color)';
        let secondaryColor = 'var(--secondary-color)';
        
        switch(type) {
            case 'success':
                primaryColor = '#00cc66';
                secondaryColor = '#00994d';
                break;
            case 'warning':
                primaryColor = '#ff9900';
                secondaryColor = '#cc7a00';
                break;
            case 'error':
                primaryColor = '#ff3333';
                secondaryColor = '#cc0000';
                break;
        }
        
        const messageContainer = document.createElement('div');
        messageContainer.style.cssText = `
            background: linear-gradient(145deg, var(--primary-color) 0%, #330000 100%);
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
            border: 2px solid ${primaryColor};
            box-shadow: 0 15px 35px rgba(179, 0, 0, 0.6);
        `;
        
        let icon = 'ℹ️';
        switch(type) {
            case 'success': icon = '✅'; break;
            case 'warning': icon = '⚠️'; break;
            case 'error': icon = '❌'; break;
        }
        
        messageContainer.innerHTML = `
            <div style="position: relative;">
                <div style="height: 4px; background: linear-gradient(90deg, ${secondaryColor} 0%, ${primaryColor} 100%);"></div>
                <div style="padding: 2rem;">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
                        <h2 style="color: var(--text-light); text-shadow: 0 0 10px rgba(255, 51, 51, 0.3); margin-bottom: 1rem;">${title}</h2>
                        <p style="color: var(--text-muted); line-height: 1.5; white-space: pre-line;">${message}</p>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;">
                        ${showCancel ? `
                            <button id="message-cancel-btn" style="
                                background: transparent;
                                border: 1px solid var(--text-muted);
                                color: var(--text-light);
                                padding: 0.8rem 2rem;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                transition: all 0.3s ease;
                            ">Cancelar</button>
                        ` : ''}
                        <button id="message-ok-btn" style="
                            background: linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%);
                            color: white;
                            border: none;
                            padding: 0.8rem 2rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        ">Aceptar</button>
                    </div>
                </div>
            </div>
        `;
        
        function closeMessage(result) {
            document.body.removeChild(messageOverlay);
            resolve(result);
        }
        
        const okButton = messageContainer.querySelector('#message-ok-btn');
        okButton.addEventListener('click', () => closeMessage(true));
        
        if (showCancel) {
            const cancelButton = messageContainer.querySelector('#message-cancel-btn');
            cancelButton.addEventListener('click', () => closeMessage(false));
        }
        
        messageOverlay.addEventListener('click', function(e) {
            if (e.target === messageOverlay) {
                closeMessage(false);
            }
        });
        
        messageOverlay.appendChild(messageContainer);
        document.body.appendChild(messageOverlay);
    });
}

function showEmptyHistoryMessage() {
    showMessage(
        'Historial Vacío',
        'No tienes compras registradas. ¡Realiza tu primera compra para comenzar tu historial!',
        'info',
        false
    ).then(() => {
        const historyOverlay = document.querySelector('div[style*="z-index: 1999"]');
        if (historyOverlay) {
            document.body.removeChild(historyOverlay);
        }
    });
}

function showPurchaseConfirmationWithCancel(total) {
    return new Promise((resolve) => {
        const messageOverlay = document.createElement('div');
        messageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const messageContainer = document.createElement('div');
        messageContainer.style.cssText = `
            background: linear-gradient(145deg, var(--primary-color) 0%, #330000 100%);
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
            border: 2px solid var(--accent-color);
            box-shadow: 0 15px 35px rgba(179, 0, 0, 0.6);
        `;
        
        messageContainer.innerHTML = `
            <div style="position: relative;">
                <div style="height: 4px; background: linear-gradient(90deg, var(--secondary-color) 0%, var(--accent-color) 100%);"></div>
                <div style="padding: 2rem;">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">💳</div>
                        <h2 style="color: var(--text-light); text-shadow: 0 0 10px rgba(255, 51, 51, 0.3); margin-bottom: 1rem;">Confirmar Compra</h2>
                        <p style="color: var(--text-light); margin-bottom: 0.5rem;">¿Estás seguro de que deseas proceder con la compra?</p>
                        <div style="background: var(--dark-bg); padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid var(--secondary-color);">
                            <p style="color: var(--text-muted); margin-bottom: 0.5rem;">Resumen de la compra:</p>
                            <p style="color: var(--accent-color); font-size: 1.5rem; font-weight: bold;">
                                Total: $${total.toFixed(2)}
                            </p>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">
                                ${cart.reduce((sum, item) => sum + item.quantity, 0)} productos
                            </p>
                        </div>
                        <p style="color: var(--text-muted); line-height: 1.5; font-size: 0.9rem;">
                            Esta acción procesará tu pedido y vaciará el carrito.
                        </p>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;">
                        <button id="message-cancel-btn" style="
                            background: transparent;
                            border: 1px solid var(--text-muted);
                            color: var(--text-light);
                            padding: 0.8rem 2rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        ">Cancelar Compra</button>
                        <button id="message-confirm-btn" style="
                            background: linear-gradient(135deg, var(--success-color) 0%, #00994d 100%);
                            color: white;
                            border: none;
                            padding: 0.8rem 2rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        ">Confirmar Pago</button>
                    </div>
                </div>
            </div>
        `;
        
        function closeMessage(result) {
            document.body.removeChild(messageOverlay);
            resolve(result);
        }
        
        const cancelButton = messageContainer.querySelector('#message-cancel-btn');
        const confirmButton = messageContainer.querySelector('#message-confirm-btn');
        cancelButton.addEventListener('click', () => closeMessage(false));
        confirmButton.addEventListener('click', () => closeMessage(true));
        
        messageOverlay.addEventListener('click', function(e) {
            if (e.target === messageOverlay) {
                closeMessage(false);
            }
        });
        
        messageOverlay.appendChild(messageContainer);
        document.body.appendChild(messageOverlay);
    });
}

function showLogoutConfirmation() {
    return showMessage(
        'Cerrar Sesión',
        '¿Estás seguro de que quieres cerrar sesión?\n\nPodrás volver a iniciar sesión en cualquier momento.',
        'warning',
        true
    );
}

function showClearDataConfirmation() {
    return showMessage(
        'Eliminar Todos los Datos',
        '¿Estás seguro de querer eliminar TODOS los datos?\n\nEsto borrará:\n• Tu carrito actual\n• Tu historial de compras\n• Tu sesión de usuario\n• Todos los usuarios registrados',
        'error',
        true
    );
}

function showLoginRequiredMessage() {
    showMessage(
        'Inicio de Sesión Requerido',
        'Debes iniciar sesión para realizar esta acción.\n\n¿Deseas iniciar sesión ahora?',
        'info',
        true
    ).then((result) => {
        if (result) {
            showLoginModal();
        }
    });
}

// Almacenamiento
async function saveUsersToJSON() {
    try {
        const data = { usuarios: usuarios };
        localStorage.setItem('usuarios_demo', JSON.stringify(data));
    } catch (error) {
        console.error('Error guardando usuarios:', error);
    }
}

async function loadUsersFromJSON() {
    try {
        const savedUsers = localStorage.getItem('usuarios_demo');
        if (savedUsers) {
            const data = JSON.parse(savedUsers);
            usuarios = data.usuarios || [];
        } else {
            usuarios = [];
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        usuarios = [];
    }
}

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
}

function loadFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        const savedUser = localStorage.getItem('currentUser');
        const savedHistory = localStorage.getItem('purchaseHistory');
        
        if (savedCart) cart = JSON.parse(savedCart);
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            userAvatar.textContent = currentUser.avatar;
            userName.textContent = currentUser.name;
            showLogoutButton();
        }
        if (savedHistory) purchaseHistory = JSON.parse(savedHistory);
        updateCart();
    } catch (error) {
        console.error('Error cargando localStorage:', error);
    }
}

// Cargar productos
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        products = data.products;
        renderProducts();
    } catch (error) {
        console.error('Error cargando productos:', error);
        products = [
            {
                "id": 1,
                "name": "Laptop Gamer ROG Strix G16 (2025) G614",
                "price": 35999.99,
                "category": "tecnologia",
                "image": "imagenes/laptop.jpg"
            },
            {
                "id": 2,
                "name": "Red magic 10 pro",
                "price": 18999.99,
                "category": "celulares",
                "image": "imagenes/Red_magic.jpg"
            },
            {
                "id": 3,
                "name": "Playera Básica",
                "price": 249.99,
                "category": "ropa",
                "image": "imagenes/playera.jpg"
            },
            {
                "id": 4,
                "name": "REDMAGIC Astra Gaming Tablet 12G+256G Eclipse (EU)",
                "price": 11999.99,
                "category": "tecnologia",
                "image": "imagenes/tablet_red_magic.jpg"
            }
        ];
        renderProducts();
    }
}

// Inicializar aplicación
async function init() {
    await loadUsersFromJSON();
    loadFromLocalStorage();
    await loadProducts();
    setupEventListeners();
}

function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', checkout);
    
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    const cancelSidebarBtn = document.getElementById('cancel-sidebar-btn');
    if (emptyCartBtn) emptyCartBtn.addEventListener('click', emptyCart);
    if (cancelSidebarBtn) cancelSidebarBtn.addEventListener('click', cancelAndCloseCart);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', handleCategoryChange);
    });
    
    searchInput.addEventListener('input', handleSearch);
    userAvatar.addEventListener('click', showLoginModal);
    userName.addEventListener('click', showLoginModal);
    
    const loginFormElement = document.getElementById('login-form');
    if (loginFormElement) loginFormElement.addEventListener('submit', handleLogin);
    
    const registerFormElement = document.getElementById('register-form');
    if (registerFormElement) registerFormElement.addEventListener('submit', handleRegister);
    
    if (toggleFormLink) toggleFormLink.addEventListener('click', toggleForm);
    overlay.addEventListener('click', closeModals);
}

function toggleForm(e) {
    if (e) e.preventDefault();
    
    const isLoginForm = loginForm.classList.contains('active-form');
    
    if (isLoginForm) {
        loginForm.classList.remove('active-form');
        loginForm.classList.add('hidden-form');
        registerForm.classList.remove('hidden-form');
        registerForm.classList.add('active-form');
        formTitle.textContent = 'Registrarse';
        formFooterText.innerHTML = '¿Ya tienes cuenta? <span class="form-link" id="toggle-form-link">Inicia sesión aquí</span>';
    } else {
        registerForm.classList.remove('active-form');
        registerForm.classList.add('hidden-form');
        loginForm.classList.remove('hidden-form');
        loginForm.classList.add('active-form');
        formTitle.textContent = 'Iniciar Sesión';
        formFooterText.innerHTML = '¿No tienes cuenta? <span class="form-link" id="toggle-form-link">Regístrate aquí</span>';
    }
    
    const newToggleLink = document.getElementById('toggle-form-link');
    if (newToggleLink) newToggleLink.addEventListener('click', toggleForm);
}

// Renderizar productos
function renderProducts() {
    productsGrid.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; color: var(--text-muted);">🔍</div>
                <h3 style="color: var(--text-light); margin-bottom: 0.5rem;">No se encontraron productos</h3>
                <p style="color: var(--text-muted);">Intenta con otra categoría o término de búsqueda</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const placeholderSVG = encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="210" viewBox="0 0 300 210">
                <rect width="100%" height="100%" fill="#1a1a1a"/>
                <rect x="20" y="20" width="260" height="140" fill="#333" rx="8"/>
                <text x="50%" y="100" font-family="Arial, sans-serif" font-size="14" fill="#b3b3b3" text-anchor="middle" dy=".3em">${product.name.substring(0, 25)}${product.name.length > 25 ? '...' : ''}</text>
                <text x="50%" y="130" font-family="Arial, sans-serif" font-size="16" fill="#ff3333" text-anchor="middle" font-weight="bold">$${product.price.toFixed(2)}</text>
                <text x="50%" y="170" font-family="Arial, sans-serif" font-size="12" fill="#666" text-anchor="middle">Imagen no disponible</text>
            </svg>
        `);
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <div class="product-image-loading"></div>
                <img src="${product.image}" 
                     alt="${product.name}"
                     class="product-image"
                     loading="lazy"
                     onload="this.style.opacity='1'; this.previousElementSibling.style.display='none'"
                     onerror="this.onerror=null; 
                              this.src='data:image/svg+xml;utf8,${placeholderSVG}';
                              this.previousElementSibling.style.display='none';
                              this.style.objectFit='cover'">
            </div>
            <div class="product-info">
                <h3 class="product-name" title="${product.name}">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Agregar al carrito</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function handleCategoryChange(e) {
    categoryButtons.forEach(button => button.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.getAttribute('data-category');
    renderProducts();
}

function handleSearch(e) {
    searchTerm = e.target.value;
    renderProducts();
}

// Funciones del carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    saveToLocalStorage();
    showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveToLocalStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveToLocalStorage();
        }
    }
}

function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">🛒</div>
                <h4>Tu carrito está vacío</h4>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">Agrega algunos productos</p>
            </div>
        `;
        cartSubtotal.textContent = '$0.00';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
                 onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"><rect width=\"100%\" height=\"100%\" fill=\"%231a1a1a\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"10\" fill=\"%23b3b3b3\" text-anchor=\"middle\" dy=\".3em\">${item.name.substring(0, 15)}</text></svg>'">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Quitar</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function emptyCart() {
    if (cart.length === 0) {
        showMessage('Carrito Vacío', 'El carrito ya está vacío.', 'info', false);
        return;
    }
    
    showMessage(
        'Vaciar Carrito',
        '¿Estás seguro de que quieres vaciar todo el carrito?\n\nSe eliminarán todos los productos agregados.',
        'warning',
        true
    ).then((confirmed) => {
        if (confirmed) {
            cart = [];
            updateCart();
            saveToLocalStorage();
            showNotification('Carrito vaciado correctamente', 'info');
        }
    });
}

function cancelAndCloseCart() {
    if (cart.length > 0) {
        showMessage(
            'Cerrar Carrito',
            '¿Estás seguro de que quieres cerrar el carrito?\n\nTus productos se mantendrán guardados para la próxima vez.',
            'info',
            true
        ).then((confirmed) => {
            if (confirmed) {
                toggleCart();
            }
        });
    } else {
        toggleCart();
    }
}

// Checkout con confirmación
async function checkout() {
    if (cart.length === 0) {
        showMessage(
            'Carrito Vacío',
            'Tu carrito está vacío. Agrega algunos productos antes de proceder al pago.',
            'warning',
            false
        );
        return;
    }
    
    if (!currentUser) {
        showLoginRequiredMessage();
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const confirm = await showPurchaseConfirmationWithCancel(subtotal);
    
    if (!confirm) {
        showMessage(
            'Compra Cancelada',
            'La compra ha sido cancelada. Tus productos siguen en el carrito.',
            'info',
            false
        );
        return;
    }
    
    const purchase = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: subtotal,
        user: currentUser.username
    };
    
    purchaseHistory.push(purchase);
    
    await showMessage(
        '¡Compra Exitosa!',
        `Gracias por tu compra, ${currentUser.name}.\n\nTotal: $${subtotal.toFixed(2)}\n\nTu pedido ha sido procesado correctamente.`,
        'success',
        false
    );
    
    saveToLocalStorage();
    cart = [];
    updateCart();
    toggleCart();
}

// Funciones de usuario
function showLoginModal() {
    loginModal.classList.add('active');
    overlay.classList.add('active');
    loginForm.classList.remove('hidden-form');
    loginForm.classList.add('active-form');
    if (registerForm) {
        registerForm.classList.remove('active-form');
        registerForm.classList.add('hidden-form');
    }
    formTitle.textContent = 'Iniciar Sesión';
    formFooterText.innerHTML = '¿No tienes cuenta? <span class="form-link" id="toggle-form-link">Regístrate aquí</span>';
    
    const newToggleLink = document.getElementById('toggle-form-link');
    if (newToggleLink) newToggleLink.addEventListener('click', toggleForm);
}

function closeModals() {
    loginModal.classList.remove('active');
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    let username, password;
    
    const usernameInput = document.getElementById('login-username') || document.getElementById('username');
    const passwordInput = document.getElementById('login-password') || document.getElementById('password');
    
    if (usernameInput && passwordInput) {
        username = usernameInput.value;
        password = passwordInput.value;
    } else {
        const inputs = e.target.querySelectorAll('input[type="text"], input[type="password"]');
        if (inputs.length >= 2) {
            username = inputs[0].value;
            password = inputs[1].value;
        }
    }
    
    if (!username || !password) {
        showMessage(
            'Campos Requeridos',
            'Por favor, ingresa usuario y contraseña para continuar.',
            'warning',
            false
        );
        return;
    }
    
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    
    if (usuario) {
        currentUser = {
            username: usuario.username,
            name: usuario.name,
            email: usuario.email,
            avatar: usuario.name.charAt(0).toUpperCase(),
            fechaRegistro: usuario.fechaRegistro
        };
        
        userAvatar.textContent = currentUser.avatar;
        userName.textContent = currentUser.name;
        saveToLocalStorage();
        showLogoutButton();
        closeModals();
        showNotification(`¡Bienvenido de nuevo, ${currentUser.name}!`);
        e.target.reset();
    } else {
        const nuevoUsuario = {
            id: Date.now(),
            username: username,
            email: `${username}@demo.com`,
            name: username,
            password: password,
            fechaRegistro: new Date().toISOString(),
            compras: []
        };
        
        usuarios.push(nuevoUsuario);
        await saveUsersToJSON();
        
        currentUser = {
            username: nuevoUsuario.username,
            name: nuevoUsuario.name,
            email: nuevoUsuario.email,
            avatar: nuevoUsuario.name.charAt(0).toUpperCase(),
            fechaRegistro: nuevoUsuario.fechaRegistro
        };
        
        userAvatar.textContent = currentUser.avatar;
        userName.textContent = currentUser.name;
        saveToLocalStorage();
        showLogoutButton();
        closeModals();
        
        await showMessage(
            '¡Cuenta Creada!',
            `¡Bienvenido ${currentUser.name}! Tu cuenta ha sido creada automáticamente en modo demo.`,
            'success',
            false
        );
        
        e.target.reset();
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username')?.value;
    const email = document.getElementById('reg-email')?.value;
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('reg-confirm-password')?.value;
    
    if (!username || !email || !password || !confirmPassword) {
        showMessage(
            'Campos Incompletos',
            'Todos los campos son obligatorios. Por favor, completa todos los campos.',
            'warning',
            false
        );
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage(
            'Contraseñas No Coinciden',
            'Las contraseñas ingresadas no coinciden. Por favor, verifica e inténtalo de nuevo.',
            'error',
            false
        );
        return;
    }
    
    if (password.length < 3) {
        showMessage(
            'Contraseña Muy Corta',
            'La contraseña debe tener al menos 3 caracteres para mayor seguridad.',
            'warning',
            false
        );
        return;
    }
    
    const usuarioExistente = usuarios.find(u => u.username === username || u.email === email);
    if (usuarioExistente) {
        if (usuarioExistente.username === username) {
            showMessage(
                'Usuario Existente',
                'El nombre de usuario ya está registrado. Por favor, elige otro nombre de usuario.',
                'error',
                false
            );
        } else {
            showMessage(
                'Email Existente',
                'El email ya está registrado. Por favor, utiliza otro email o inicia sesión.',
                'error',
                false
            );
        }
        return;
    }
    
    const nuevoUsuario = {
        id: Date.now(),
        username: username,
        email: email,
        name: username,
        password: password,
        fechaRegistro: new Date().toISOString(),
        compras: []
    };
    
    usuarios.push(nuevoUsuario);
    await saveUsersToJSON();
    
    currentUser = {
        username: nuevoUsuario.username,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        avatar: nuevoUsuario.name.charAt(0).toUpperCase(),
        fechaRegistro: nuevoUsuario.fechaRegistro
    };
    
    userAvatar.textContent = currentUser.avatar;
    userName.textContent = currentUser.name;
    saveToLocalStorage();
    showLogoutButton();
    closeModals();
    
    await showMessage(
        '¡Registro Exitoso!',
        `¡Cuenta creada exitosamente! Bienvenido ${currentUser.name}.`,
        'success',
        false
    );
    
    e.target.reset();
    toggleForm();
}

// Mostrar botón de cerrar sesión
function showLogoutButton() {
    if (currentUser) {
        userName.innerHTML = `
            <span>${currentUser.name}</span>
            <span style="font-size: 0.8rem; color: var(--accent-color); cursor: pointer; margin-left: 0.5rem;" onclick="logout()">
                (Cerrar sesión)
            </span>
        `;
        
        const userInfo = document.querySelector('.user-info');
        if (userInfo && !userInfo.querySelector('.history-btn')) {
            const historyButton = document.createElement('button');
            historyButton.textContent = '📋 Historial';
            historyButton.className = 'history-btn';
            historyButton.style.cssText = `
                background: transparent;
                border: 1px solid var(--accent-color);
                color: var(--text-light);
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                cursor: pointer;
                margin-left: 1rem;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            `;
            historyButton.onmouseenter = function() {
                this.style.background = 'var(--accent-color)';
                this.style.boxShadow = '0 0 10px rgba(255, 51, 51, 0.5)';
            };
            historyButton.onmouseleave = function() {
                this.style.background = 'transparent';
                this.style.boxShadow = 'none';
            };
            historyButton.onclick = showPurchaseHistory;
            userInfo.appendChild(historyButton);
        }
    }
}

// Cerrar sesión
async function logout() {
    const confirmed = await showLogoutConfirmation();
    if (confirmed) {
        currentUser = null;
        userAvatar.textContent = '?';
        userName.textContent = 'Iniciar Sesión';
        userName.innerHTML = 'Iniciar Sesión';
        const historyBtn = document.querySelector('.history-btn');
        if (historyBtn) historyBtn.remove();
        localStorage.removeItem('currentUser');
        showNotification('Sesión cerrada correctamente');
    }
}

// Mostrar historial de compras
function showPurchaseHistory() {
    if (!currentUser) {
        showLoginRequiredMessage();
        return;
    }
    
    const userPurchases = purchaseHistory.filter(p => p.user === currentUser.username);
    if (userPurchases.length === 0) {
        showEmptyHistoryMessage();
        return;
    }
    
    let historyHTML = '<div style="max-width: 500px; margin: 0 auto;">';
    historyHTML += '<h3 style="color: var(--accent-color); margin-bottom: 1rem; text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);">Historial de Compras</h3>';
    
    userPurchases.forEach(purchase => {
        const date = new Date(purchase.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        historyHTML += `
            <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid var(--secondary-color); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);">
                <p><strong>Compra #${purchase.id.toString().slice(-6)}</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${date}</p>
                <p><strong>Total:</strong> $${purchase.total.toFixed(2)}</p>
                <p><strong>Productos:</strong> ${purchase.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                <button onclick="showPurchaseDetails(${purchase.id})" style="background: linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; margin-top: 0.5rem; cursor: pointer; transition: all 0.3s ease;">
                    Ver detalles
                </button>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: relative;
        z-index: 2000;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
    `;
    
    modal.innerHTML = `
        <div class="login-form" style="max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 class="form-title">Mis Compras</h2>
                <button id="close-history-modal" style="background: none; border: none; color: var(--text-light); font-size: 1.8rem; cursor: pointer; padding: 0; line-height: 1;">×</button>
            </div>
            ${historyHTML}
        </div>
    `;
    
    function closeHistoryModal() {
        document.body.removeChild(modalOverlay);
    }
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeHistoryModal();
        }
    });
    
    const closeButton = modal.querySelector('#close-history-modal');
    if (closeButton) closeButton.addEventListener('click', closeHistoryModal);
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
}

// Mostrar detalles de compra
function showPurchaseDetails(purchaseId) {
    const purchase = purchaseHistory.find(p => p.id === purchaseId);
    if (!purchase) return;
    
    const date = new Date(purchase.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let detailsHTML = '<div style="max-width: 500px; margin: 0 auto;">';
    detailsHTML += `<h3 style="color: var(--accent-color); margin-bottom: 1rem; text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);">Detalles de la compra #${purchase.id.toString().slice(-6)}</h3>`;
    detailsHTML += `<p style="color: var(--text-muted); margin-bottom: 1rem;">${date}</p>`;
    detailsHTML += '<div style="background: var(--dark-bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--secondary-color);">';
    
    purchase.items.forEach(item => {
        detailsHTML += `
            <div style="display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid rgba(255, 51, 51, 0.2);">
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color: var(--text-muted);">$${item.price.toFixed(2)} c/u × ${item.quantity}</small>
                </div>
                <div style="font-weight: bold; color: var(--accent-color);">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    });
    
    detailsHTML += `
        <div style="display: flex; justify-content: space-between; padding: 1rem 0; font-weight: bold; font-size: 1.2rem; border-top: 2px solid var(--secondary-color); margin-top: 0.5rem;">
            <span>TOTAL:</span>
            <span style="color: var(--accent-color); text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);">$${purchase.total.toFixed(2)}</span>
        </div>
    </div>`;
    
    detailsHTML += '</div>';
    
    const modal = document.createElement('div');
    modal.id = 'details-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2100;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        background: linear-gradient(145deg, var(--primary-color) 0%, #330000 100%);
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(179, 0, 0, 0.8);
        border: 2px solid var(--accent-color);
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; max-height: 70vh; overflow-y: auto; padding-top: 0.5rem;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--secondary-color) 0%, var(--accent-color) 100%); border-radius: 15px 15px 0 0;"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: var(--text-light); text-shadow: 0 0 10px rgba(255, 51, 51, 0.3); margin: 0;">Detalles de Compra</h2>
                <button id="close-details-modal" style="background: none; border: none; color: var(--text-light); font-size: 1.8rem; cursor: pointer; padding: 0; line-height: 1;">×</button>
            </div>
            ${detailsHTML}
            <div style="margin-top: 1.5rem; text-align: center;">
                <button id="ok-details-btn" style="background: linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%); color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; width: 100%;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    function closeDetailsModal() {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }
    
    const closeButton = modal.querySelector('#close-details-modal');
    if (closeButton) closeButton.addEventListener('click', closeDetailsModal);
    
    const okButton = modal.querySelector('#ok-details-btn');
    if (okButton) okButton.addEventListener('click', closeDetailsModal);
    
    document.body.appendChild(modal);
}

// Utilidades
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    let bgColor = 'linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%)';
    if (type === 'error') {
        bgColor = 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)';
    } else if (type === 'info') {
        bgColor = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
    }
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(179, 0, 0, 0.4);
        z-index: 3000;
        transition: all 0.3s ease;
        border: 1px solid var(--accent-color);
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Limpiar todos los datos
async function clearAllData() {
    const confirmed = await showClearDataConfirmation();
    
    if (confirmed) {
        localStorage.clear();
        cart = [];
        currentUser = null;
        purchaseHistory = [];
        usuarios = [];
        updateCart();
        userAvatar.textContent = '?';
        userName.textContent = 'Iniciar Sesión';
        userName.innerHTML = 'Iniciar Sesión';
        
        const historyBtn = document.querySelector('.history-btn');
        if (historyBtn) historyBtn.remove();
        
        localStorage.removeItem('usuarios_demo');
        
        showMessage(
            'Datos Eliminados',
            'Todos los datos han sido eliminados correctamente.',
            'success',
            false
        );
    }
}

// Ver todos los usuarios (para desarrollo)
function viewAllUsers() {
    let usersList = 'Usuarios registrados:\n\n';
    usuarios.forEach(user => {
        usersList += `• ${user.username} (${user.email})\n`;
    });
    
    showMessage(
        'Usuarios Registrados',
        usersList || 'No hay usuarios registrados.',
        'info',
        false
    );
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', init);