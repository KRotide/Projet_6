// Création d'un Set pour stocker les catégories uniques
const categoriesSet = new Set();

let projets = [];

let initialModal;

async function categories() {
    try {
        // Appel de l'API pour récupérer les catégories
        const response = await fetch("http://localhost:5678/api/categories");
        const categoriesData = await response.json();

        // Ajout manuel d'une nouvelle catégorie
        const nouvelleCategorie = { id: "4", name: "Tous" };
        categoriesSet.add(nouvelleCategorie);

        // Ajout des catégories de l'API dans le Set
        for (const categorie of categoriesData) {
            categoriesSet.add(categorie);
        }

        genererCategories(categoriesSet);

        return categoriesSet;
    }catch(err){
        throw new Error("Something went wrong");
    }
};

async function genererCategories(categories) {
    // Récupération de l'élément du DOM qui accueillera les catégories
    const divFiltres = document.querySelector(".filters");

    for (const categorie of categories) {
        // Création d’une balise dédiée à une catégorie
        const categorieElement = document.createElement("ul");
        categorieElement.dataset.id = categorie.id;

        // Création de la balise
        const nomElement = document.createElement("li");
        nomElement.innerHTML = categorie.name;

        // Changement d'aspect des filtres lors du clique 
        categorieElement.addEventListener("click", function() {
            const itemSelected = divFiltres.querySelector("ul.filter-selected");
            if (itemSelected) {
                itemSelected.classList.remove("filter-selected");
            }
            this.classList.add("filter-selected");

            // Au clique de la catégorie ajoutée manuellement
            if (categorie.id === "4") {
                // Réinitialiser la galerie
                const divGalerie = document.querySelector(".gallery");
                divGalerie.innerHTML = "";

                // Générer les projets non filtrés
                genererProjets(projets);
            } else {
                // Filtre des projets en fonction de leur nom 
                const categoryName = categorie.name;
                const projetsFiltres = projets.filter(function (projet) {
                    const projetName = projet.category.name;
                    return categoryName === projetName;
                });

            // Réinitialiser la galerie
            const divGalerie = document.querySelector(".gallery");
            divGalerie.innerHTML = "";

            // Générer les projets filtrés
            genererProjets(projetsFiltres);
            }
        });

        // On rattache les balises à leur parent
        divFiltres.appendChild(categorieElement);
        categorieElement.appendChild(nomElement);
    }
}

async function works() {
    try {
        // Appel de l'API pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");
        const worksData = await response.json();

        projets = worksData;

        genererProjets(projets);

        return projets;
    }catch (err){
        throw new Error("Something went wrong");
    }
}

async function genererProjets(projets) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const divGalerie = document.querySelector(".gallery");

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
        
        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("figure");
        projetElement.dataset.id = projet.id;

        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = projet.title;

        // On rattache les balises à leur parent
        divGalerie.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(titleElement);
    }
}

// Création de la fonction de gestion 
async function gestion() {
    const editButtons = document.querySelectorAll(".edit");
    const editMode = document.querySelector(".edit-mode");
    const filters = document.querySelector(".filters");
    const header = document.querySelector("header");
    const modalContainer = document.querySelector(".modal-container");
    const modal = document.querySelector(".modal");
    const openModal = document.querySelectorAll(".open-modal");
    const closeModal = document.querySelector(".close-modal");

    if (localStorage.getItem("token")) {

        // Disparition des filtres
        filters.style.display = "none";

        // Affichage des boutons de modifications
        editButtons.forEach(button => {
            button.style.display = "flex";
        });

        // Affichage de la barre d'édition
        editMode.style.display = "flex";
        header.style.margin = "97px 0";

        // Ouverture de la fenêtre modale 
        openModal.forEach((element) => 
            element.addEventListener("click", () => {
                modalContainer.style.display = "block";
                fenêtreModale();
            })
        );

        function fenêtreModale() {
            // Fermeture de la modale au clique sur la croix
            closeModal.addEventListener("click", () => {
                modalContainer.style.display = "none";
            });

            // Fermeture de la modale en dehors de celle-ci
            modalContainer.addEventListener("click", (event) => {
                if (event.target !== modalContainer && !modal.contains(event.target)) {
                    modalContainer.style.display = "none"
                }
            });   

            if (modalContainer.style.display = "block") {
                // Stockage de l'état initial de la modale 
                initialModal = modal.innerHTML;
                genererProjetsModale(projets);
            }
        }
    }
}

async function genererProjetsModale(projets) {
    // Récupération de l'élément du DOM qui accueillera les projets de la modale
    const divGalerieModale = document.querySelector(".modal-gallery");
    divGalerieModale.innerHTML = "";

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
        
        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("figure");
        projetElement.dataset.id = projet.id;

        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        imageElement.classList.add("modal-image");

        const iconeElement = document.createElement("i");
        iconeElement.classList.add("fa-regular", "fa-trash-can");

        const hoverIconeElement = document.createElement("i");
        hoverIconeElement.classList.add("fa-solid", "fa-arrows-up-down-left-right");

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = "éditer";
        titleElement.classList.add("modal-figcaption");

        // On rattache les balises à leur parent
        divGalerieModale.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(iconeElement);
        projetElement.appendChild(hoverIconeElement);
        projetElement.appendChild(titleElement);
    }
}

async function restoreInitialModal() {
    const modal = document.querySelector(".modal");
    // état initial de la modale 
    modal.innerHTML = initialModal;
    genererProjetsModale(projets);

    // Ré-initialisation de la hauteur de la fenêtre modale
    modal.style.height = "731px";
    
    // Flèche de retour masquée
    const arrowBack = document.querySelector(".fa-arrow-left-long");
    arrowBack.style.display = "none"
    
    // Ré-initialisation du titre en "Galerie photo"
    const h3 = document.querySelector("h3");
    h3.textContent = "Galerie photo";
    
    // Disparition de la modale galerie
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.style.display = "grid"

    // Disparition du cadre de la nouvelle photo à ajouter
    const modalPicture = document.querySelector(".modal-picture");
    modalPicture.style.display = "none";

    // Disparition du formulaire de la nouvelle photo à ajouter
    const modalForm = document.querySelector(".modal-form");
    modalForm.style.display = "none";

    // Ré-initialisation du bouton "Ajouter une photo"
    const validateBtn = document.querySelector(".btn-add-picture");
    validateBtn.textContent = "Ajouter une photo";
    validateBtn.style.margin = "38px auto 23px auto";
    validateBtn.style.background = "#1D6154";
    validateBtn.style.cursor = "pointer";

    // Ré-apparition du bouton de suppression de la galerie 
    const deleteGallery = document.querySelector(".btn-delete-gallery");
    deleteGallery.style.display = "block";
    
    // Ajout, de nouveau, des écouteurs d'événements 
    // Fermeture de la modale au clique sur la croix
    const modalContainer = document.querySelector(".modal-container");
    const closeModal = document.querySelector(".close-modal");
    closeModal.addEventListener("click", () => {
        modalContainer.style.display = "none";
    })
    
    ajoutPhoto();
}

async function ajoutPhoto() {
    const ajouterUnePhoto = document.querySelector(".btn-add-picture");

    ajouterUnePhoto.addEventListener("click", function() {
        // Changement de la hauteur de la fenêtre modale
        const modal = document.querySelector(".modal");
        modal.style.height = "670px";

        // Flèche de retour visible
        const arrowBack = document.querySelector(".fa-arrow-left-long");
        arrowBack.style.display = "block"
        // Au clique sur la flèche retour, la modale retrouve son état initial
        arrowBack.addEventListener("click", (event) => {
            event.stopPropagation();
            restoreInitialModal();
        })

        // Changement du titre en "Ajout photo"
        const h3 = document.querySelector("h3");
        h3.textContent = "Ajout photo";

        // Disparition de la modale galerie
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.style.display = "none";

        // Apparition du cadre de la nouvelle photo à ajouter
        const modalPicture = document.querySelector(".modal-picture");
        modalPicture.style.display = "flex";
        cadreModale();

        // Apparition du formulaire de la nouvelle photo à ajouter
        const modalForm = document.querySelector(".modal-form");
        modalForm.style.display = "flex";

        // Changement du bouton "Ajouter une photo"
        const validateBtn = document.querySelector(".btn-add-picture");
        validateBtn.textContent = "Valider";
        validateBtn.style.margin = "32px auto 23px auto";
        validateBtn.style.background = "#a7a7a7";
        validateBtn.style.cursor = "default";

        // Disparition du bouton de suppression de la galerie 
        const deleteGallery = document.querySelector(".btn-delete-gallery");
        deleteGallery.style.display = "none";
    });
}

async function cadreModale() {
    const modalPicture = document.querySelector(".modal-picture");

    const iconePictureElement = document.createElement("i");
    iconePictureElement.classList.add("fa-regular", "fa-image");

    const btnPictureElement = document.createElement("button");
    btnPictureElement.innerHTML = "+ Ajouter photo";
    btnPictureElement.classList.add("more-picture-btn");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.style.display = "none"

    btnPictureElement.addEventListener("click", () => {
        fileInput.click();
    });

    const conditionPictureElement = document.createElement("p");
    conditionPictureElement.innerHTML = "jpg, png : 4mo max";
    conditionPictureElement.classList.add("condition-picture");

    modalPicture.appendChild(iconePictureElement);
    modalPicture.appendChild(btnPictureElement);
    btnPictureElement.appendChild(fileInput);
    modalPicture.appendChild(conditionPictureElement);
}

async function indexPage() {
    await categories();
    await works();
    gestion();
    ajoutPhoto();
}

// les fonctions sont exécutées lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", indexPage);
