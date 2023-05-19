async function works() {
    try {
        // Appel de l'API pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");
        const worksData = await response.json();

        genererProjets(worksData);

        return worksData;
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

        const nomElement = document.createElement("figcaption");
        nomElement.innerHTML = projet.title;

        // On rattache les balises à leur parent
        divGalerie.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(nomElement);
    }
};

works();
