/**
 * BreeMotor - HQ Portal Logic
 * Manage portfolio entries via Netlify Functions + Blobs.
 */

const ADMIN_PASSWORD = "BREE_SERVICE_2024"; // Simple gate for initial migration

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initAdmin();
});

function checkAuth() {
    const session = sessionStorage.getItem("bree_admin_authorized");
    if (session) {
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("adminDashboard").classList.remove("hidden");
        return;
    }

    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");

    loginBtn.onclick = () => {
        if (passwordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem("bree_admin_authorized", "true");
            location.reload();
        } else {
            alert("INCORRECT PIN. ACCESS DENIED.");
        }
    };
}

async function initAdmin() {
    const itemList = document.getElementById("itemList");
    const addForm = document.getElementById("addPortfolioForm");

    if (!itemList) return;

    // Fetch and render existing items
    loadItems();

    // Handle Form Submission
    addForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(addForm);
        const newItem = {
            Car_Model: formData.get("Car_Model"),
            Service_Type: formData.get("Service_Type"),
            Work_Image: formData.get("Work_Image"),
            Featured: formData.get("Featured") === "on"
        };

        const submitBtn = addForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerText = "POSTING...";

        try {
            const res = await fetch("/.netlify/functions/portfolio", {
                method: "POST",
                body: JSON.stringify(newItem)
            });

            if (res.ok) {
                addForm.reset();
                loadItems();
            } else {
                throw new Error("Failed to post");
            }
        } catch (error) {
            alert("ERROR SAVING ITEM");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "POST TO PORTFOLIO";
        }
    };
}

async function loadItems() {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = '<p class="text-on-surface-variant animate-pulse">FETCHING DATA...</p>';

    try {
        const response = await fetch("/.netlify/functions/portfolio");
        const data = await response.json();
        
        itemList.innerHTML = "";
        if (data.length === 0) {
            itemList.innerHTML = '<p class="text-on-surface-variant">NO RECORDS FOUND. START AFRESH.</p>';
            return;
        }

        data.forEach(item => {
            const row = document.createElement("div");
            row.className = "flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-white/5 mb-3 group";
            row.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="${item.Work_Image}" class="w-12 h-12 object-cover rounded-md border border-white/10">
                    <div>
                        <h4 class="text-white font-bold text-sm uppercase">${item.Car_Model}</h4>
                        <p class="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">${item.Service_Type}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    ${item.Featured ? '<span class="text-[10px] text-primary-container font-black">FEATURED</span>' : ''}
                    <button onclick="deleteItem('${item.id}')" class="text-on-surface-variant hover:text-red-500 transition-colors">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            `;
            itemList.appendChild(row);
        });
    } catch (error) {
        itemList.innerHTML = '<p class="text-red-500">DATA FETCH ERROR</p>';
    }
}

async function deleteItem(id) {
    if (!confirm("DELETE VEHICLE ENTRY?")) return;

    try {
        const res = await fetch("/.netlify/functions/portfolio", {
            method: "DELETE",
            body: JSON.stringify({ id })
        });

        if (res.ok) {
            loadItems();
        }
    } catch (error) {
        alert("DELETE FAILED");
    }
}

// Global functions for inline event handlers
window.deleteItem = deleteItem;
