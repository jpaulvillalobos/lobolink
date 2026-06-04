/**
 * LoboLink Agency - Scripts Core
 * Controlador principal para la inyección dinámica de datos desde JSON
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias a los contenedores del DOM
    const servicesContainer = document.getElementById('services-container');
    const pricingContainer = document.getElementById('pricing-container');
    const apiStatus = document.getElementById('api-status');

    // 2. Función principal para cargar los datos
    const loadAgencyData = async () => {
        try {
            // Simulamos la llamada a una API consumiendo el archivo local
            const response = await fetch('data/base.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 3. Renderizar las secciones con los datos obtenidos
            renderServices(data.services);
            renderPlans(data.plans);
            
            // 4. Actualizar el estado en el footer (Conexión Exitosa)
            updateStatus(true, `Conectado: ${data.agency_info.name} DB`);
            
        } catch (error) {
            console.error('Error al cargar la base de datos de LoboLink:', error);
            
            // Mostrar mensajes de error en la interfaz
            servicesContainer.innerHTML = `<div class="loading-spinner" style="color: #ff3333;">Error al cargar servicios. Verifica la ruta de base.json.</div>`;
            pricingContainer.innerHTML = `<div class="loading-spinner" style="color: #ff3333;">Error al sincronizar tarifas.</div>`;
            
            // Actualizar el estado en el footer (Fallo)
            updateStatus(false, 'Error de conexión con la base de datos');
        }
    };

    // --- FUNCIONES DE RENDERIZADO ---

    // Función para pintar los Servicios
    const renderServices = (services) => {
        // Limpiamos el contenedor (quitamos el mensaje de carga)
        servicesContainer.innerHTML = '';
        
        let htmlContent = '';
        
        services.forEach(service => {
            htmlContent += `
                <div class="service-card" id="${service.id}">
                    <i class="${service.icon} service-icon"></i>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `;
        });
        
        servicesContainer.innerHTML = htmlContent;
    };

    // Función para pintar los Planes de Suscripción
    const renderPlans = (plans) => {
        pricingContainer.innerHTML = '';
        
        let htmlContent = '';
        
        plans.forEach(plan => {
            // Verificamos si el plan es destacado (Lobo Growth)
            const isFeatured = plan.featured ? 'featured' : '';
            const badgeHtml = plan.featured ? `<div class="card-badge">${plan.badge_text}</div>` : '';
            
            // Construimos la lista de características (li)
            let featuresHtml = '';
            plan.features.forEach(feature => {
                featuresHtml += `<li><i class="fa-solid fa-check"></i> ${feature}</li>`;
            });

            htmlContent += `
                <div class="pricing-card ${isFeatured}" id="${plan.id}">
                    ${badgeHtml}
                    <h3>${plan.name}</h3>
                    <p>${plan.description}</p>
                    <div class="price">
                        $${plan.price} <span>COP / ${plan.period}</span>
                    </div>
                    <ul class="pricing-features">
                        ${featuresHtml}
                    </ul>
                    <a href="#contacto" class="btn-pricing">${plan.cta_text}</a>
                </div>
            `;
        });
        
        pricingContainer.innerHTML = htmlContent;
    };

    // Función auxiliar para actualizar el estado del footer
    const updateStatus = (isSuccess, message) => {
        if (isSuccess) {
            apiStatus.innerHTML = `<span class="status-icon pulse"></span> ${message}`;
        } else {
            apiStatus.innerHTML = `<span class="status-icon" style="background-color: #ff3333; box-shadow: 0 0 8px #ff3333;"></span> ${message}`;
        }
    };

    // 5. Ejecutar la carga inicial de datos
    loadAgencyData();
});