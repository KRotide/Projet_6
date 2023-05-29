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
            modalContainer.classList.toggle("active")
        }
    }
}

// les fonctions sont exécutées lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", function () {
    gestion();
});