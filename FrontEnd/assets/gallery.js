// Création d'un Set pour stocker les catégories uniques
const categoriesSet = new Set();

let projets = [];

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

function genererCategories(categories){
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
}; 

categories();

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
};

function genererProjets(projets){
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
};

works();

// Création de la fonction de gestion 
async function gestion() {
    const editButtons = document.querySelectorAll(".edit");
    const editMode = document.querySelector(".edit-mode");
    const filters = document.querySelector(".filters");
    const modalContainer = document.querySelector(".modal-container");
    const modalTriggers = document.querySelectorAll(".modal-trigger");

    if (localStorage.getItem("token")) {

        // Disparition des filtres
        filters.style.display = "none";

        // Affichage des boutons de modifications
        editButtons.forEach(button => {
            button.style.display = "flex";
        });

        // Affichage de la barre d'édition
        editMode.style.display = "flex";

        // Affichage ou disparition de la fenêtre modale 
        modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

        function toggleModal() {
            modalContainer.classList.toggle("active");
            if (modalContainer.classList.contains("active")) {
                genererProjetsModale(projets);
            }
        }
    }
}

function genererProjetsModale(projets){
    // Récupération de l'élément du DOM qui accueillera les projets
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

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = "éditer";
        titleElement.classList.add("modal-figcaption");

        // On rattache les balises à leur parent
        divGalerieModale.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(titleElement);
    }
};

// les fonctions sont exécutées lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", function () {
    gestion();
});