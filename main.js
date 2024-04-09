let oiseauMystereIndex=Math.floor(Math.random()*395)
console.log(oiseauMystereIndex)
document.addEventListener("DOMContentLoaded", function() {

    const form = document.querySelector('form[action=""]');
    const suggestionsElement = document.getElementById('suggestions');
    const inputElement = document.getElementById('input_jeux1');
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêcher la soumission du formulaire par défaut
        return false; // Retourner false pour éviter toute action supplémentaire
    });
    suggestionsElement.addEventListener('change', selectionnerNomOiseau);
    suggestionsElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            selectionnerNomOiseau();
        }
    });
    inputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const premiereOption = suggestionsElement.querySelector('option');
            if (premiereOption) {
                premiereOption.selected = true;
                selectionnerNomOiseau();
            }
        }
    });
});

async function chargerNomsOiseaux() {
    const response = await fetch('oiseaux.json');
    const data = await response.json();
    console.log(data.length)
    const nomsOiseaux = data.map(oiseau => oiseau.french_name);
    return nomsOiseaux;
}

async function chargerOiseaux() {
    const response = await fetch('oiseaux.json');
    const data = await response.json();
    return data;
}

async function input_bird_keyup(event) {
    const inputElement = event.target;
    const prefixe = inputElement.value;
    if (prefixe.trim() === '') {
        document.getElementById('suggestions').style.display = 'none'; // Masquer le menu déroulant
    } else {
        document.getElementById('suggestions').style.display = 'block'; // Afficher le menu déroulant
        await afficherSuggestions(prefixe);
    }
}

async function afficherSuggestions(prefixe) {
    const nomsOiseaux = await chargerNomsOiseaux();
    const suggestions = nomsOiseaux.filter(nom => nom.toLowerCase().startsWith(prefixe.toLowerCase()));
    const selectElement = document.getElementById('suggestions');
    selectElement.innerHTML = ''; // Effacer les anciennes suggestions
    // Afficher toutes les suggestions disponibles
    selectElement.size = suggestions.length > 8 ? 8 : suggestions.length;
    suggestions.forEach(nom => {
        const option = document.createElement('option');
        option.textContent = nom;
        selectElement.appendChild(option);
    });
}
// Fonction pour gérer la sélection d'un nom dans le menu déroulant
function selectionnerNomOiseau() {
    const selectElement = document.getElementById('suggestions');
    const selectedOption = selectElement.options[selectElement.selectedIndex].textContent;
    afficherNomOiseau(selectedOption);
    const inputElement = document.getElementById('input_jeux1');
    inputElement.value = ''; // Appeler une fonction pour afficher le nom de l'oiseau
}
async function afficherNomOiseau(nomguess){
    const response = await fetch('oiseaux.json');
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        if (data[i].french_name === nomguess) {
            return comparerOiseaux(data[i],data[oiseauMystereIndex]);
        }
    }
}
function afficherWin(message) {
    const box = document.getElementById('win');
    box.textContent = message; // Remplir la boîte avec le message
    box.style.display = 'block'; // Afficher la boîte
}
// Fonction pour afficher le nom de l'oiseau à partir de la base de données ou le premier dans l'ordre alphabétique
function comparerOiseaux(oiseauGuess,oiseauMystere) {
    const outputElement = document.getElementById('output_jeux1'); // Réinitialiser le contenu de l'élément de sortie
    function mettreEnEvidence(caractereMystere, caractereGuess) {
        if (caractereGuess===caractereMystere){
            return `<div class="charactere" style="background-color: green;">${caractereGuess}</div>`;
        } else {
        let caractereHTML = '<div class="charactere">';
        for (let i = 0; i < caractereGuess.length; i++) {
            if (caractereMystere[i] === caractereGuess[i]) {
                // Si les caractères sont les mêmes à la même position, les mettre en vert
                caractereHTML += `<span style="color: green;">${caractereGuess[i]}</span>`;
            } else if (caractereGuess[i] === " ") {
                // Si les caractères sont des espaces dans les deux noms, ajouter un espace dans le HTML
                caractereHTML += '_';
            } else {
                // Sinon, les mettre en rouge
                caractereHTML += `<span style="color: #610000;">${caractereGuess[i]}</span>`;
            }
        }
        caractereHTML+='</div>';
        return caractereHTML;
    }}// Fonction pour mettre en évidence les caractéristiques similaires
    function mettreEnEvidence2(caractereMystere, caractereGuess) {
        if (caractereMystere === caractereGuess) {
            return `<div class="charactere" style="background-color: green;">${caractereGuess}</div>`;
        } else {
            return `<div class="charactere" style="background-color: rgb(168, 58, 58);">${caractereGuess}</div>`;
        }
    }
    // Comparaison des caractéristiques et génération du HTML
    const htmlOutput = `
        <div class="conteneur_characteristique">
            ${mettreEnEvidence(oiseauMystere.french_name, oiseauGuess.french_name)}
            ${mettreEnEvidence(oiseauMystere.scientific_name, oiseauGuess.scientific_name)}
            ${mettreEnEvidence2(oiseauMystere.famille, oiseauGuess.famille)}
            ${mettreEnEvidence2(oiseauMystere.ordre, oiseauGuess.ordre)}
            ${mettreEnEvidence2(oiseauMystere.color1, oiseauGuess.color1)}
            ${mettreEnEvidence2(oiseauMystere.color2, oiseauGuess.color2)}
        </div>
    `;
    outputElement.insertAdjacentHTML('beforeend', htmlOutput);
    if (oiseauMystere===oiseauGuess){
        const elementsX = document.querySelectorAll('div.conteneur_characteristique');
        const nombreGuess = elementsX.length-1;
        const message=`Bravo, tu as gagné en ${nombreGuess} essais ! L'oiseau du jour est l'/la/le ${oiseauMystere.french_name}`;
        afficherWin(message,nombreGuess);
    }
}

         