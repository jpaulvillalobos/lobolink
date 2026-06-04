/* ==========================================================================
   LoboLink Shop - Lógica de Renderizado Dinámico y Filtros (Hotmart)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Ruta hacia tu archivo de base de datos local
    const JSON_URL = 'data/shop_base.json';
    
    // Elementos del DOM
    const productsContainer = document.getElementById('products-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statusText = document.getElementById('shop-api-status');
    
    // Estado de la aplicación en memoria
    let allProducts = [];

    /**
     * Inicializa la carga de datos desde el JSON
     */
    async function loadShopProducts() {
        try {
            const response = await fetch(JSON_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - No se pudo leer el catálogo.`);
            }
            
            const data = await response.json();
            allProducts = data.products;
            
            // Actualizar el estado visual en el footer indicando éxito
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-cyan pulse-cyan"></span> Catálogo Sincronizado (${allProducts.length} Productos)`;
            }
            
            // Renderizar todos los productos por defecto
            renderProducts(allProducts);
            
        } catch (error) {
            console.error('Error al sincronizar LoboLink Shop:', error);
            
            // Manejo visual de errores en la interfaz
            if (productsContainer) {
                productsContainer.innerHTML = `
                    <div class="shop-loading" style="grid-column: 1/-1; color: #ff4a4a;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>Error al sincronizar con el catálogo de Hotmart. Por favor, intenta más tarde.</p>
                    </div>
                `;
            }
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-cyan" style="background-color: #ff4a4a; box-shadow: 0 0 6px #ff4a4a;"></span> Error de conexión`;
            }
        }
    }

    /**
     * Renderiza las tarjetas de los productos en el contenedor HTML
     * @param {Array} productsList - Lista filtrada u original de productos
     */
    function renderProducts(productsList) {
        // Limpiar el contenedor (quita el mensaje de cargando)
        productsContainer.innerHTML = '';
        
        if (productsList.length === 0) {
            productsContainer.innerHTML = `
                <div class="shop-loading" style="grid-column: 1/-1;">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>No se encontraron productos en esta categoría momentáneamente.</p>
                </div>
            `;
            return;
        }

        // Construir y añadir cada tarjeta al DOM
        productsList.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.setAttribute('data-id', product.id);
            
            // Estructura HTML dinámica usando las variables del JSON
            card.innerHTML = `
                <div class="product-thumbnail-wrapper">
                    <!-- Contenedor visual estético con el icono representativo del infoproducto -->
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(145deg, #0c121a, #020406); font-size: 3.5rem; color: rgba(0, 191, 255, 0.4);">
                        <i class="${product.iconClass}"></i>
                    </div>
                    <span class="product-type-tag">${product.badge}</span>
                </div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="product-meta-price">
                        <div class="product-price">
                            <span style="font-size: 0.8rem; color: var(--accent-cyan); display: block; font-weight: 400; font-family: var(--font-sans);">COP</span>
                            $${product.price}
                        </div>
                        <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="btn-hotmart">
                            Ver en Hotmart <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: 4px;"></i>
                        </a>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(card);
        });
    }

    /**
     * Maneja la lógica de filtrado al hacer clic en los botones
     */
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remover estado activo de todos los botones y ponérselo al actual
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const selectedCategory = e.currentTarget.getAttribute('data-category');
            
            // Filtrar el array en memoria
            if (selectedCategory === 'all') {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(product => product.category === selectedCategory);
                renderProducts(filtered);
            }
        });
    });

    // Ejecutar la carga inicial del catálogo
    loadShopProducts();
});