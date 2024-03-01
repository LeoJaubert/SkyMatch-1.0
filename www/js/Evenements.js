// Fonction pour convertir une adresse en latitude et longitude
function convertirLieuEnCoordonnees(lieu) 
{
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(lieu)}`;
    return fetch(url)
    .then(response => response.json())
    .then(data => 
    {
        if (data.features && data.features.length > 0) 
        {
            const latitude = data.features[0].geometry.coordinates[1];
            const longitude = data.features[0].geometry.coordinates[0];
            return { latitude, longitude };
        }
        else
        {
            console.error('Aucune coordonnée trouvée pour le lieu spécifié.');
            return null;
        }
    })
    .catch(error => 
    {
        console.error('Une erreur s\'est produite lors de la conversion du lieu:', error);
        return null;
    });
}
  
// Fonction pour afficher les détails d'un événement sur la page HTML
function afficherDetailsEvenement(evenement, latitudesoi, longitudesoi) 
{
    const { id, titre, lieu, description, heure_debut, heure_fin, date_debut, date_fin, type_evenement_id } = evenement;
    const ulElement = document.getElementById('evenements-list');
    const liElement = document.createElement('li');
    liElement.innerHTML = 
    `<p><h2>${titre}</h2></p>
    <p><h3>${description || "Information non renseignée"}</h3></p>
    <h4><p>Dates: Du ${date_debut ? moment(date_debut).locale("fr").format("D MMMM YYYY") : "??"} au ${date_fin ? moment(date_fin).locale("fr").format("D MMMM YYYY") : "??"} </p>
    <p>Horaires: De ${heure_debut ? heure_debut.substring(0, 5) : "??"} à ${heure_fin ? heure_fin.substring(0, 5) : "??"}<p>
    <p>Lieu: ${lieu}</p>
    <p id="distance-${id}"></p></h4>`;
    ulElement.appendChild(liElement);
  
    // Calcule la distance jusqu'à l'évènement
    convertirLieuEnCoordonnees(lieu)
    .then(coord => 
    {
        if (coord) 
        {
            const distance = calculerDistance(latitudesoi, longitudesoi, coord.latitude, coord.longitude);
            const distanceElement = document.getElementById(`distance-${id}`);
            // Affiche la distance avec 1 chiffre significatif
            distanceElement.textContent = `Distance jusqu'à l'évènement: ${distance.toFixed(1)} kilomètres`;
        }
    })
}
  
// Fonction pour calculer la distance entre deux points géographiques
function calculerDistance(latitudesoi, longitudesoi, latitude, longitude) 
{
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = toRadians(latitude - latitudesoi);
    const dLon = toRadians(longitude - longitudesoi);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(latitudesoi)) * Math.cos(toRadians(latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
  
// Fonction pour convertir degrés en radians
function toRadians(degrees) 
{
    return degrees * (Math.PI / 180);
}
  
// Récupérer les événements via Fetch
fetch('http://10.222.1.204:3000/evenements')
.then(response => response.json())
.then(data => 
{
    const evenements = data;
    const ulElement = document.getElementById('evenements-list');
    const liElement = document.createElement('li');
    liElement.innerHTML = `<p>Nombre d'évènements: ${evenements.length}</p>`;
    ulElement.appendChild(liElement);

    // Obtenir la position actuelle
    navigator.geolocation.getCurrentPosition(position => 
    {
        const latitudesoi = position.coords.latitude;
        const longitudesoi = position.coords.longitude;
        console.log('Latitude:', latitudesoi);
        console.log('Longitude:', longitudesoi);

        // Afficher les détails de chaque événement
        evenements.forEach(evenement => 
        {
            afficherDetailsEvenement(evenement, latitudesoi, longitudesoi);
        })
    })
})

//------------------------------Boutons de redirection----------------------------->
function redirectionajout()
{
    window.open("Ajout_evenements.html", "_blank");
}

function redirectionaccueil()
{
    window.open("Accueil.html", "_blank");
}