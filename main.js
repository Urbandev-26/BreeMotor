/**
 * BreeMotor - Main Site Logic
 * Dedicated to high-performance automotive care.
 */

document.addEventListener("DOMContentLoaded", () => {
    initPortfolio();
    initModals();
    initLeadForm();
    initServiceCards();
    initQuoteButtons();
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
                <span class="text-[10px] text-on-surface-variant/70 font-black mt-1 uppercase tracking-widest">${item.Service_Price ? 'INVESTMENT: ZMW ' + item.Service_Price : 'COMPLETED'}</span>
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
        
        // --- CUSTOMIZE THIS NUMBER ---
        const WHATSAPP_NUMBER = "260000000000"; // Format: CountryCodeNumer (no + or spaces)
        
        const submitBtn = leadForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> REDIRECTING...';
            
            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());

            // 1. Prepare WhatsApp Message
            const message = `🛠️ *NEW SERVICE QUOTE REQUEST*\n` +
                          `----------------------------\n` +
                          `👤 *Name:* ${data.name}\n` +
                          `📱 *Phone:* ${data.phone}\n` +
                          `🚗 *Vehicle:* ${data['vehicle-specs'] || data.car}\n` +
                          `🔧 *Service:* ${data.service}\n` +
                          `📝 *Details:* ${data.description}\n` +
                          `----------------------------\n` +
                          `_Sent via Bree Motor Contact Portal_`;

            // 2. Log to Netlify in background (Optional but recommended)
            formData.append("form-name", leadForm.getAttribute("name") || "leads-form");
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            }).catch(err => console.error("Silent Netlify log failed:", err));

            // 3. Open WhatsApp Direct
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            
            // Visual success feedback
            submitBtn.innerHTML = `
                <div class="flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">chat</span>
                    OPENING WHATSAPP...
                </div>
            `;
            submitBtn.classList.remove("bg-white", "text-black");
            submitBtn.classList.add("bg-green-500", "text-white");

            // Redirect
            setTimeout(() => {
                window.open(waUrl, '_blank');
                
                // Reset UI
                leadForm.reset();
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove("bg-green-500", "text-white");
                    submitBtn.classList.add("bg-white", "text-black");
                    
                    const activeModal = document.querySelector('.modal-backdrop:not(.hidden)') || document.getElementById('leadModal');
                    if (activeModal) activeModal.classList.add('hidden');
                }, 500);
            }, 800);

        } catch (error) {
            console.error("Lead form error:", error);
            submitBtn.innerHTML = 'ERROR / TRY AGAIN';
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

/**
 * Global Quote Triggers - Handles generic "Get Quote" buttons
 */
function initQuoteButtons() {
    const triggers = document.querySelectorAll(".quote-trigger");
    const modal = document.getElementById("leadModal");

    triggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            if (modal) {
                modal.classList.remove("hidden");
                modal.classList.add("flex");
            }
        });
    });
}

function openLightbox(src) {
    const lb = document.getElementById("lightbox");
    const img = lb.querySelector("img");
    img.src = src;
    lb.classList.add("active");
    lb.onclick = () => lb.classList.remove("active");
}
