// Création de la fonction de gestion 
async function gestion() {
    const editButtons = document.querySelectorAll(".edit");
    const editMode = document.querySelector(".edit-mode");
    const filters = document.querySelector(".filters");

    if (localStorage.getItem("token")) {

        // Disparition des filtres
        filters.style.display = "none";

        // Affichage des boutons de modifications
        editButtons.forEach(button => {
            button.style.display = "flex";
        })

        // Affichage de la barre d'édition
        editMode.style.display = "flex";
    }
}

// les fonctions sont exécutées lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", function () {
    gestion();
});