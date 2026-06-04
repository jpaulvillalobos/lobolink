/* ==========================================================================
   LoboLink Career Studio - Motor de Renderizado de Planes de Hojas de Vida
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Ruta hacia la base de datos de tus planes de currículum
    const JSON_CV_URL = 'data/curriculum_base.json';
    
    // Elementos del DOM en curriculum.html
    const planesContainer = document.getElementById('cv-planes-container');
    const statusText = document.getElementById('cv-api-status');

    /**
     * Inicializa la carga asíncrona de los planes de negocio para HVs
     */
    async function loadCareerPlanes() {
        try {
            const response = await fetch(JSON_CV_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - No se pudo conectar al catálogo de HVs.`);
            }
            
            const data = await response.json();
            const planesList = data.planes;
            
            // Actualizar estado en el footer indicando éxito en la sincronización
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-orange pulse-orange"></span> Modelos de Negocio Activos (${planesList.length} Planes)`;
            }
            
            // Renderizar la tabla de planes comerciales
            renderCareerPlanes(planesList);
            
        } catch (error) {
            console.error('Error al desplegar los planes de LoboLink Career Studio:', error);
            
            // Renderizado en caso de fallo en la lectura de datos
            if (planesContainer) {
                planesContainer.innerHTML = `
                    <div class="services-loading" style="grid-column: 1/-1; color: var(--accent-orange);">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>[CAREER STUDIO] Error de sincronización de datos de precios. Reintenta recargando la página.</p>
                    </div>
                `;
            }
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-orange" style="background-color: #ff3333; box-shadow: 0 0 6px #ff3333;"></span> ERROR_DATA_SOURCE`;
            }
        }
    }

    /**
     * Construye las tarjetas de precios inyectando la lista de características dinámicamente
     * @param {Array} list - Lista de planes comerciales mapeados desde el archivo JSON
     */
    function renderCareerPlanes(list) {
        // Limpiar el esqueleto de carga
        planesContainer.innerHTML = '';
        
        list.forEach(plan => {
            const card = document.createElement('div');
            card.classList.add('solution-it-card');
            
            // Resaltar visualmente si es el plan más vendido
            if (plan.badge === "El Más Vendido" || plan.badge === "Recomendado") {
                card.style.borderColor = 'var(--accent-orange)';
                card.style.boxShadow = '0 8px 20px rgba(255, 102, 0, 0.1)';
            }

            // Mapear el array interno de características a elementos HTML de lista <li>
            const featuresHTML = plan.features.map(feature => `
                <li style="display: flex; align-items: start; gap: 10px; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px;">
                    <i class="fa-solid fa-circle-check" style="color: var(--accent-orange); font-size: 0.85rem; margin-top: 4px;"></i>
                    <span>${feature}</span>
                </li>
            `).join('');

            // Determinar la etiqueta del periodo basada en el tipo de plan
            // Los planes con hosting (IDs del 1 al 3 según tu nueva idea) aplican por 3 meses
            const periodTag = (plan.id === 1) ? "Por Evaluación" : "Acceso e Infraestructura";

            // Inyección de la estructura de tarjeta premium modificada
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span class="services-badge" style="margin-bottom: 0; font-size: 0.7rem;">${plan.badge}</span>
                    <span style="font-family: var(--font-mono); font-size: 0.8rem; color: rgba(255,102,0,0.6);">ID-0${plan.id}</span>
                </div>
                
                <h3 style="font-size: 1.4rem; margin-bottom: 10px; color: #ffffff;">${plan.title}</h3>
                <p style="font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; color: var(--text-secondary); min-height: 70px;">
                    ${plan.description}
                </p>
                
                <div style="background-color: rgba(255,255,255,0.02); padding: 14px; border-radius: 6px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.02);">
                    <span style="display: block; font-size: 0.7rem; color: var(--text-secondary); font-family: var(--font-mono); text-transform: uppercase;">${periodTag}</span>
                    <span style="font-size: 1.6rem; font-weight: 700; color: var(--accent-orange); font-family: var(--font-sans);">${plan.price}</span>
                </div>

                <div style="margin-bottom: 24px;">
                    <span style="display: block; font-size: 0.75rem; color: #ffffff; font-weight: 600; margin-bottom: 12px; font-family: var(--font-mono);">¿Qué incluye este plan?</span>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${featuresHTML}
                    </ul>
                </div>

                <a href="${plan.link}" target="_blank" rel="noopener noreferrer" class="btn-services-primary" style="text-align: center; margin-top: auto; padding: 12px; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fa-brands fa-whatsapp"></i> Adquirir Plan
                </a>
            `;
            
            planesContainer.appendChild(card);
        });
    }

    // Arrancar el motor lógico al cargar la UI
    loadCareerPlanes();
});