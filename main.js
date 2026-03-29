/**
 * BreeMotor - Main Site Logic
 * Dedicated to high-performance automotive care.
 */

document.addEventListener("DOMContentLoaded", () => {
    initPortfolio();
    initModals();
    initLeadForm();
    initServiceCards();
});

/**
 * Portfolio Logic - Fetches from Netlify Functions + Blobs
 */
async function initPortfolio() {
    const portfolioGrid = document.getElementById("portfolioGrid");
    if (!portfolioGrid) return;

    try {
        const response = await fetch("/.netlify/functions/portfolio");
        if (!response.ok) throw new Error("Failed to fetch portfolio");
        
        const data = await response.json();
        
        // If no data yet, show placeholders or a message
        if (data.length === 0) {
            renderPlaceholders(portfolioGrid);
            return;
        }

        renderPortfolio(data, portfolioGrid);
    } catch (error) {
        console.error("Portfolio Error:", error);
        renderPlaceholders(portfolioGrid); // Fallback to placeholders
    }
}

function renderPortfolio(items, container) {
    container.innerHTML = "";
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "portfolio-item bg-surface-container-low rounded-2xl overflow-hidden relative group cursor-pointer h-80 animate-fade-in";
        card.innerHTML = `
            <img src="${item.Work_Image}" class="portfolio-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${item.Car_Model}">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                <span class="text-primary-container text-[10px] font-bold tracking-[0.3em] uppercase mb-1">${item.Service_Type}</span>
                <h3 class="font-headline text-xl font-bold text-white uppercase tracking-tight">${item.Car_Model}</h3>
                ${item.Featured ? '<span class="absolute top-4 right-4 bg-primary-container text-[10px] font-black px-2 py-1 rounded text-white shadow-lg">FEATURED</span>' : ''}
            </div>
        `;
        
        card.onclick = () => openLightbox(item.Work_Image);
        container.appendChild(card);
    });
}

function renderPlaceholders(container) {
    // Keep the existing static placeholders if fetch fails or is empty
    console.log("No live data found, showing static placeholders.");
}

/**
 * Lead Form Logic - Netlify Forms Integration
 */
function initLeadForm() {
    const leadForm = document.getElementById("leadForm");
    if (!leadForm) return;

    leadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(leadForm);
        const submitBtn = leadForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> PROCESSING...';

            // Submit to Netlify
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> SENT SUCCESSFULLY';
                submitBtn.classList.replace("bg-primary-container", "bg-green-600");
                
                // Hide modal after delay
                setTimeout(() => {
                    closeAllModals();
                    leadForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.replace("bg-green-600", "bg-primary-container");
                }, 2000);
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            console.error("Form Error:", error);
            submitBtn.innerHTML = '<span class="material-symbols-outlined">error</span> TRY AGAIN';
            submitBtn.disabled = false;
        }
    });
}

/**
 * Modal & Utility Logic
 */
function initModals() {
    const modal = document.getElementById("leadModal");
    const closeBtn = document.getElementById("closeModal");

    if (closeBtn) {
        closeBtn.onclick = () => closeAllModals();
    }

    // Close on backdrop click
    window.onclick = (event) => {
        if (event.target === modal) closeAllModals();
    };
}

/**
 * Service Card Logic - Opens Lead Modal with pre-selected service
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll(".service-card");
    const serviceSelect = document.querySelector("#leadForm select[name='service']");
    const modal = document.getElementById("leadModal");

    serviceCards.forEach(card => {
        card.addEventListener("click", () => {
            const service = card.getAttribute("data-service");
            if (service && serviceSelect) {
                serviceSelect.value = service;
            }
            
            // Show Modal
            if (modal) {
                modal.classList.remove("hidden");
                modal.classList.add("flex");
                modal.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Ensure it's visible if it's high up
            }
        });
    });
}

function closeAllModals() {
    const modal = document.getElementById("leadModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
}

function openLightbox(src) {
    const lb = document.getElementById("lightbox");
    const img = lb.querySelector("img");
    img.src = src;
    lb.classList.add("active");
    lb.onclick = () => lb.classList.remove("active");
}
