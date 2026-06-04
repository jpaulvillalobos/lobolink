/* ==========================================================================
   LoboLink Services - Lógica de Renderizado de Infraestructura y Soporte
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Ruta hacia tu base de datos local de servicios
    const JSON_SERVICES_URL = 'data/services_base.json';
    
    // Elementos del DOM
    const servicesContainer = document.getElementById('services-catalogue');
    const statusText = document.getElementById('services-api-status');
    
    /**
     * Inicializa la carga asíncrona del catálogo de servicios
     */
    async function loadLoboLinkServices() {
        try {
            const response = await fetch(JSON_SERVICES_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - No se pudo leer el catálogo IT.`);
            }
            
            const data = await response.json();
            const servicesList = data.services;
            
            // Actualizar estado del servidor IT en el footer
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-orange pulse-orange"></span> Servidor Sincronizado (${servicesList.length} Soluciones)`;
            }
            
            // Inyectar las tarjetas en el contenedor
            renderServices(servicesList);
            
        } catch (error) {
            console.error('Error en el despliegue de LoboLink Services:', error);
            
            // Respuesta visual ante fallas de infraestructura local
            if (servicesContainer) {
                servicesContainer.innerHTML = `
                    <div class="services-loading" style="grid-column: 1/-1; color: #ff6600;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>[SISTEMA] Error al conectar con services_base.json. Verifica la consola del servidor.</p>
                    </div>
                `;
            }
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-orange" style="background-color: #ff3333; box-shadow: 0 0 6px #ff3333;"></span> ERROR_CONNECTION`;
            }
        }
    }

    /**
     * Construye dinámicamente el HTML de las tarjetas de servicios técnicos
     * @param {Array} list - Arreglo de objetos de servicios obtenidos del JSON
     */
    function renderServices(list) {
        // Limpiar el esqueleto de carga inicial
        servicesContainer.innerHTML = '';
        
        if (list.length === 0) {
            servicesContainer.innerHTML = `
                <div class="services-loading" style="grid-column: 1/-1;">
                    <i class="fa-solid fa-server"></i>
                    <p>No hay servicios activos en el catálogo en este momento.</p>
                </div>
            `;
            return;
        }

        // Iterar y plasmar cada solución en la grilla del DOM
        list.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('solution-it-card');
            
            card.innerHTML = `
                <div class="solution-it-icon-wrapper">
                    <i class="${item.iconClass}"></i>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(255, 255, 255, 0.03); padding-top: 16px;">
                    <div>
                        <span style="display: block; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; font-family: var(--font-mono);">Modalidad</span>
                        <span class="solution-tag-tech">${item.price}</span>
                    </div>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn-services-secondary" style="padding: 8px 16px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; border-color: rgba(255, 102, 0, 0.3); color: #ffffff;">
                        Cotizar <i class="fa-brands fa-whatsapp" style="color: #25d366;"></i>
                    </a>
                </div>
            `;
            
            servicesContainer.appendChild(card);
        });
    }

    // Ejecutar el motor de carga al iniciar la interfaz
    loadLoboLinkServices();
});