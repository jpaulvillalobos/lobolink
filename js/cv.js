/* ==========================================================================\
   LoboLink Career Studio - Motor de Renderizado Completo (Planes, Reseñas y FAQ)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Ruta hacia la base de datos de tus planes de currículum
    const JSON_CV_URL = 'data/curriculum_base.json';
    
    // Elementos del DOM en curriculum.html
    const planesContainer = document.getElementById('cv-planes-container');
    const reviewsContainer = document.getElementById('cv-reviews-container');
    const faqContainer = document.getElementById('cv-faq-container');
    const statusText = document.getElementById('cv-api-status');

    /**
     * Inicializa la carga asíncrona de todos los módulos desde curriculum_base.json
     */
    async function loadCareerEcosystem() {
        try {
            const response = await fetch(JSON_CV_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - No se pudo conectar a la base de datos.`);
            }
            
            const data = await response.json();
            
            // 1. Renderizar Planes de Negocio
            if (data.planes && planesContainer) {
                renderCareerPlanes(data.planes);
            }
            
            // 2. Renderizar Ejemplos y Reseñas con Códigos QR
            if (data.ejemplos_reseñas && reviewsContainer) {
                renderCareerReviews(data.ejemplos_reseñas);
            }

            // 3. Renderizar Preguntas Frecuentes (FAQ)
            if (data.preguntas_frecuentes && faqContainer) {
                renderCareerFAQ(data.preguntas_frecuentes);
            }
            
            // Actualizar estado unificado en el footer indicando éxito global
            if (statusText) {
                const totalPlanes = data.planes ? data.planes.length : 0;
                const totalReviews = data.ejemplos_reseñas ? data.ejemplos_reseñas.length : 0;
                statusText.innerHTML = `<span class=\"status-icon-orange pulse-orange\"></span> Datos Sincronizados (${totalPlanes} Planes / ${totalReviews} Casos)`;
            }
            
        } catch (error) {
            console.error("Error crítico en la sincronización de LoboLink Career Studio:", error);
            if (statusText) {
                statusText.innerHTML = `<span class="status-icon-orange" style="background-color: #ff3333;"></span> Fallo de Red en Infraestructura JSON`;
            }
        }
    }

    /**
     * Renderiza el catálogo original de planes comerciales
     */
    function renderCareerPlanes(planesList) {
        planesContainer.innerHTML = ''; // Limpiar loader animado
        
        planesList.forEach(plan => {
            const periodTag = plan.periodTag || "Entrega Única";
            
            let featuresHTML = '';
            if (plan.features && plan.features.length > 0) {
                plan.features.forEach(feat => {
                    featuresHTML += `
                        <li style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; font-family: var(--font-sans);">
                            <i class="fa-solid fa-check" style="color: var(--accent-orange); margin-top: 3px; font-size: 0.8rem;"></i>
                            <span>${feat}</span>
                        </li>
                    `;
                });
            } else {
                featuresHTML = `<li style="color: var(--text-secondary); font-size:0.85rem;">Características personalizadas según cotización técnica.</li>`;
            }

            const cardHTML = `
                <div class="service-card" style="display: flex; flex-direction: column; height: 100%; min-height: 480px; justify-content: space-between;">
                    <div>
                        <span class="service-badge-card" style="background-color: rgba(255,102,0,0.1); color: var(--accent-orange); border: 1px solid rgba(255,102,0,0.25); padding: 4px 10px; font-size: 0.7rem; font-weight: 700; border-radius: 50px; text-transform: uppercase; display: inline-block; margin-bottom: 16px; font-family: var(--font-mono);">
                            ${plan.badge}
                        </span>
                        <h3 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 12px; font-family: var(--font-sans); line-height: 1.3;">
                            ${plan.title}
                        </h3>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; font-family: var(--font-sans);">
                            ${plan.description}
                        </p>
                    </div>
                    
                    <div>
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

                        <a href="${plan.link}" target="_blank" rel="noopener noreferrer" class="btn-services-primary" style="text-align: center; margin-top: auto; padding: 12px; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; width: 100%; border-radius: 6px; text-decoration: none; font-weight: 600;">
                            <i class="fa-brands fa-whatsapp" style="margin-right: 8px; font-size: 1.1rem;"></i> Adquirir Plan
                        </a>
                    </div>
                </div>
            `;
            planesContainer.innerHTML += cardHTML;
        });
    }

    /**
     * Renderiza las Reseñas y Códigos QR de ejemplos
     */
    function renderCareerReviews(reviewsList) {
        reviewsContainer.innerHTML = ''; // Limpiar loader animado

        reviewsList.forEach(item => {
            // Generar estrellas dinámicas en HTML según la calificación del JSON
            let starsHTML = '';
            for (let i = 0; i < item.estrellas; i++) {
                starsHTML += '<i class="fa-solid fa-star" style="color: #ffb700; font-size: 0.85rem; margin-right: 2px;"></i>';
            }

            const reviewHTML = `
                <div class="service-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 3px solid var(--accent-orange);">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                            <div>
                                <h3 style="font-size: 1.15rem; font-weight: 700; color: #ffffff; font-family: var(--font-sans); margin: 0;">
                                    ${item.nombre} ${item.apellido}
                                </h3>
                                <span style="font-size: 0.7rem; color: var(--text-secondary); font-family: var(--font-mono); text-transform: uppercase; display: block; margin-top: 2px;">
                                    ${item.badge}
                                </span>
                            </div>
                            <div style="display: flex;">
                                ${starsHTML}
                            </div>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; font-family: var(--font-sans); font-style: italic; margin-bottom: 20px;">
                            "${item.reseña}"
                        </p>
                    </div>

                    <div style="display: flex; align-items: center; gap: 16px; background-color: rgba(255,255,255,0.01); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,102,0,0.15);">
                        <img src="${item.imagen_qr}" alt="QR Portafolio ${item.nombre}" style="width: 65px; height: 65px; background: #fff; padding: 3px; border-radius: 4px; object-fit: contain;" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(item.link)}'">
                        <div style="flex: 1;">
                            <span style="display: block; font-size: 0.7rem; color: var(--text-secondary); font-family: var(--font-mono);">Demo en línea</span>
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-orange); text-decoration: none; font-size: 0.85rem; font-weight: 600; font-family: var(--font-sans); display: inline-flex; align-items: center; gap: 4px; transition: var(--transition-smooth);">
                                Explorar Sitio <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            reviewsContainer.innerHTML += reviewHTML;
        });
    }

    /**
     * Renderiza las Preguntas Frecuentes (FAQ) con interactividad de acordeón
     */
    function renderCareerFAQ(faqList) {
        faqContainer.innerHTML = ''; // Limpiar loader animado

        faqList.forEach((faq, index) => {
            const faqHTML = `
                <div class="faq-item" style="background-color: var(--bg-surface-it); border: 1px solid rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 12px; overflow: hidden; transition: var(--transition-smooth);">
                    <button class="faq-toggle" style="width: 100%; background: none; border: none; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; text-align: left; color: #ffffff; outline: none;">
                        <span style="font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; padding-right: 15px;">${faq.pregunta}</span>
                        <i class="fa-solid fa-chevron-down" style="color: var(--text-secondary); font-size: 0.85rem; transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);"></i>
                    </button>
                    <div class="faq-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); background-color: rgba(0,0,0,0.15);">
                        <p style="padding: 0 24px 20px 24px; margin: 0; font-family: var(--font-sans); font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
                            ${faq.respuesta}
                        </p>
                    </div>
                </div>
            `;
            faqContainer.innerHTML += faqHTML;
        });

        // Configurar el sistema interactivo de clics (Acordeón)
        const faqToggles = faqContainer.querySelectorAll('.faq-toggle');
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const item = toggle.parentElement;
                const content = item.querySelector('.faq-content');
                const icon = toggle.querySelector('i');
                const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

                // Cerrar todos los demás elementos abiertos (Efecto acordeón puro)
                faqContainer.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = '0px');
                faqContainer.querySelectorAll('.faq-toggle i').forEach(i => i.style.transform = 'rotate(0deg)');
                faqContainer.querySelectorAll('.faq-item').forEach(fa => fa.style.borderColor = 'rgba(255,255,255,0.03)');

                // Alternar estado del elemento actual
                if (!isOpen) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.style.transform = 'rotate(180deg)';
                    item.style.borderColor = 'rgba(255,102,0,0.3)'; // Destacar el activo con el naranja corporativo
                }
            });
        });
    }

    // Ejecutar el motor de carga al iniciar la aplicación web
    loadCareerEcosystem();
});