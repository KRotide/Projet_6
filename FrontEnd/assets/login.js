// Création de la fonction de connexion  
async function envoyerIdentifiants() {
    const formulaireIdentifiants = document.querySelector(".login-form");
    formulaireIdentifiants.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Récupération des valeurs du formulaire d'identification
        const email = document.querySelector("#email").value;
        const motDePasse = document.querySelector("#mdp").value;

        const user = {
            email: email,
            password: motDePasse
        };

        try {
            // Appel de la fonction fetch avec toutes les informations nécessaires
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });
        
            // Vérification de la réponse 
            if (response.status !== 200) {
                throw new Error("échec de la requête d'authentification.");
            }

            // Si la réponse est réussie, extraction des données en JSON
            const result = await response.json();

            // Vérification du token 
            if (result && result.token) {
                // Stockage du token dans le local store
                localStorage.setItem("token", result.token);

                // Redirection vers la page d'accueil
                window.location.href = "index.html";
            } else {
                // Message en cas d'erreur d'authentification 
                console.log("échec de l'authentification");
            }
        } catch (error) {
            // Message en cas d'arreurs de requête ou de connexion 
            console.error("Erreur lors de la requête d'authentification:", error);
        }
    });
}

// la fonction est exécutée lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", function() {
    envoyerIdentifiants();
  });