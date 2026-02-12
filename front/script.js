const API_URL = "http://localhost:3000/patisseries";

// ICONS
const modifyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M416.9 85.2L372 130.1L509.9 268L554.8 223.1C568.4 209.6 576 191.2 576 172C576 152.8 568.4 134.4 554.8 120.9L519.1 85.2C505.6 71.6 487.2 64 468 64C448.8 64 430.4 71.6 416.9 85.2zM338.1 164L122.9 379.1C112.2 389.8 104.4 403.2 100.3 417.8L64.9 545.6C62.6 553.9 64.9 562.9 71.1 569C77.3 575.1 86.2 577.5 94.5 575.2L222.3 539.7C236.9 535.6 250.2 527.9 261 517.1L476 301.9L338.1 164z"/></svg>`;
const deleteIcon  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>`;

// VARIABLES GLOBALES
let patisserieToDelete = null; // ID de l'élément à supprimer

// FETCH POUR OBTENIR TOUTES LES PATISSERIES
async function fetchPatisseries() {
    try {
        const response = await fetch(API_URL);
        const result   = await response.json();

        if (Array.isArray(result)) {
            console.log("Liste de Patisseries bien chargée", result);
            displayPatisseries(result);
        } else {
            console.error("La réponse n'est pas un array");
            showError();
        }
    } catch (error) {
        console.error("Erreur dans l'obtention des données :", error);
        showError();
    }
}

// AFFICHER LES CARTES DANS LE DOM
function displayPatisseries(patisseries) {
    const container = document.querySelector(".card-container");
    container.innerHTML = "";
    patisseries.forEach(p => container.appendChild(createCard(p)));
}

// CRÉER UNE CARTE
function createCard(patisserie) {
    const article = document.createElement("article");
    article.className   = "card";
    article.dataset.id  = patisserie.id;

    article.innerHTML = `
    <div class="card-inner">
        <div class="card-front">
            <img src="${patisserie.img}"
                 alt="${patisserie.nom_patisserie}"
                 class="card-image">
        </div>
        <div class="card-info">
            <h3 class="card-title">${patisserie.nom_patisserie}</h3>
            <p class="card-category">${patisserie.categorie}</p>
            <p class="card-origin"><strong>Origine:</strong> ${patisserie.origine}</p>
            <p class="card-description">${patisserie.description}</p>
            <div class="card-actions">
                <button class="btn-modify"
                        aria-label="Modifier ${patisserie.nom_patisserie}"
                        data-id="${patisserie.id}">
                    <span aria-hidden="true">${modifyIcon}</span> Modifier
                </button>
                <button class="btn-delete"
                        aria-label="Supprimer ${patisserie.nom_patisserie}"
                        data-id="${patisserie.id}">
                    <span aria-hidden="true">${deleteIcon}</span> Effacer
                </button>
            </div>
        </div>
    </div>`;

    return article;
}

// MODAL SUPPRESSION (OUVRIR / FERMER)
function showDeleteModal(id, nomPatisserie) {
    patisserieToDelete = id;
    document.getElementById('modal-message').textContent =
        `Êtes-vous sûr de vouloir supprimer "${nomPatisserie}" ?`;
    document.getElementById('delete-modal').style.display = 'flex';
    document.getElementById('cancel-delete').focus();
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    patisserieToDelete = null;
}

// MODAL ÉDITION (OUVRIR / FERMER / REMPLIR)
function showEditModal(patisserie) {

    // Remplir les champs avec les valeurs actuelles
    document.getElementById('edit-id').value          = patisserie.id;
    document.getElementById('edit-nom').value         = patisserie.nom_patisserie;
    document.getElementById('edit-origine').value     = patisserie.origine;
    document.getElementById('edit-img').value         = patisserie.img;
    document.getElementById('edit-description').value = patisserie.description;

    // Sélectionner la catégorie correcte dans le <select>
    const selectCategorie = document.getElementById('edit-categorie');
    selectCategorie.value = patisserie.categorie;
    // Si la valeur n'existe pas dans les options, remettre à vide
    if (!selectCategorie.value) selectCategorie.value = "";

    document.getElementById('edit-modal').style.display = 'flex';
    document.getElementById('edit-nom').focus();
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-form').reset();
}

// DELETE (SUPPRIMER UNE PATISSERIE)
async function deletePatisserie(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const result   = await response.json();

        if (result.success) {
            console.log(`Élément ${id} supprimé`);
            fetchPatisseries(); // Recharger la liste
        } else {
            console.error(`Suppression impossible:`, result.message);
            alert(`Erreur dans la suppression : ${result.message}`);
        }
    } catch (error) {
        console.error(`Erreur:`, error);
        alert(`Erreur dans la suppression`);
    }
}

// PUT POUR MODIFIER UNE PATISSERIE
async function updatePatisserie(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            console.log(`Pâtisserie "${result.data.nom_patisserie}" mise à jour`);
            fetchPatisseries();
        } else {
            console.error(`Mise à jour impossible:`, result.message);
            alert(`Erreur dans la mise à jour : ${result.message}`);
        }
    } catch (error) {
        console.error(`Erreur:`, error);
        alert(`Erreur dans la mise à jour`);
    }
}

// POST POUR AJOUTER UNE PATISSERIE
async function postPatisserie(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            console.log(`"${result.data.nom_patisserie}" ajoutée (id: ${result.data.id})`);
            showFormFeedback(`"${result.data.nom_patisserie}" ajoutée avec succès !`, 'success');
            document.getElementById('patisserie-form').reset();
            fetchPatisseries(); // Recharger la liste
        } else {
            console.error('Ajout impossible:', result.message);
            showFormFeedback(`Erreur : ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        showFormFeedback('Impossible de contacter le serveur.', 'error');
    }
}

// FEEDBACK VISUEL DU FORMULAIRE
function showFormFeedback(message, type) {
    const feedback = document.getElementById('form-feedback');
    feedback.textContent = message;
    feedback.className   = `form-feedback form-feedback--${type}`;

    // Effacer le message après 4 secondes
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className   = 'form-feedback';
    }, 4000);
}

// EVENT LISTENER (FORMULAIRE D'AJOUT)
document.getElementById('patisserie-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        nom_patisserie: document.getElementById('nom').value.trim(),
        categorie:      document.getElementById('categorie-select').value,
        img:            document.getElementById('image-url').value.trim() || null,
        origine:        document.getElementById('origine').value.trim(),
        description:    document.getElementById('description').value.trim(),
    };

    postPatisserie(data);
});

// EVENT LISTENERS (MODAL SUPPRESSION)
document.getElementById('confirm-delete').addEventListener('click', () => {
    if (patisserieToDelete) {
        deletePatisserie(patisserieToDelete);
        closeDeleteModal();
    }
});

document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);

document.getElementById('delete-modal').addEventListener('click', (e) => {
    if (e.target.id === 'delete-modal') closeDeleteModal();
});

// EVENT LISTENERS (MODAL ÉDITION)
document.getElementById('cancel-edit-modal').addEventListener('click', closeEditModal);
document.getElementById('close-edit-modal').addEventListener('click',  closeEditModal);

document.getElementById('edit-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') closeEditModal();
});

// Soumission du formulaire d'édition
document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;

    // On ne récupère que les champs remplis (les vides ne sont pas envoyés)
    const rawData = {
        nom_patisserie: document.getElementById('edit-nom').value.trim()         || null,
        categorie:      document.getElementById('edit-categorie').value           || null,
        origine:        document.getElementById('edit-origine').value.trim()      || null,
        img:            document.getElementById('edit-img').value.trim()          || null,
        description:    document.getElementById('edit-description').value.trim()  || null,
    };

    // Supprimer les clés null pour n'envoyer que ce qui a changé
    const data = Object.fromEntries(
        Object.entries(rawData).filter(([_, v]) => v !== null)
    );

    if (Object.keys(data).length === 0) {
        alert("Aucun champ modifié.");
        return;
    }

    updatePatisserie(id, data);
    closeEditModal();
});

// ============================================
// EVENT LISTENERS — BOUTONS DES CARTES
// Délégation sur document pour les éléments
// créés dynamiquement
// ============================================
document.addEventListener('click', async (e) => {
    // --- Bouton SUPPRIMER ---
    const deleteBtn = e.target.closest('.btn-delete');
    if (deleteBtn) {
        const id  = deleteBtn.dataset.id;
        const nom = deleteBtn.getAttribute('aria-label').replace('Supprimer ', '');
        showDeleteModal(id, nom);
        return;
    }

    // --- Bouton MODIFIER ---
    const modifyBtn = e.target.closest('.btn-modify');
    if (modifyBtn) {
        const id = modifyBtn.dataset.id;

        // Récupérer les données actuelles depuis l'API
        try {
            const res    = await fetch(`${API_URL}`);
            const liste  = await res.json();
            const patisserie = liste.find(p => String(p.id) === String(id));

            if (patisserie) {
                showEditModal(patisserie);
            } else {
                alert("Pâtisserie non trouvée.");
            }
        } catch (error) {
            console.error("Impossible de charger les données:", error);
        }
    }
});

// Fermer les modals avec la touche ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDeleteModal();
        closeEditModal();
    }
});

// AFFICHER ERREUR DE CHARGEMENT
function showError() {
    const container = document.querySelector(".card-container");
    container.innerHTML = `
        <div style="color: #4b3213; text-align: center; padding: 2rem;">
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les pâtisseries. Vérifiez que le serveur est démarré.</p>
        </div>`;
}

// INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page chargée, récupération des pâtisseries...");
    fetchPatisseries();
});