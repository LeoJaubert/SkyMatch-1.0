//Code de base à ne pas toucher
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() 
{
  //-----------------------------Pour aller sur une page web-------------------------->
  //document.getElementById('monBouton').addEventListener('click', function()
  //{
  //var targetUrl = 'index1.html';
  //var options = 'location=yes';
  //var ref = cordova.InAppBrowser.open(targetUrl, '_blank', options);
  //})
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

const container = document.querySelector('.container');
const APIKey = 'ec05fb0a088cb70d48ba425ebbc9463e';

// Elements HTML pour afficher les éléments météo
const temperatureLabel = document.getElementById('temperatureLabel');    
const villeLabel = document.getElementById('villeLabel');
const humiditeLabel = document.getElementById('humiditeLabel');
const ventLabel = document.getElementById('ventLabel');
const paysLabel = document.getElementById('paysLabel');
const IconeMeteoElement = document.getElementById('IconeMeteo');
const timeLabel = document.getElementById('timeLabel');
const dateLabel = document.getElementById('dateLabel');
const latitudeElement = document.getElementById('latitude');
const longitudeElement = document.getElementById('longitude');
const adresseElement = document.getElementById('adresse');

function geolocationSuccess(position) {   // si la position a été trouvée, on enregistre la latitue et la longitude dans des variables
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    
   
    recevoirMeteo(latitude, longitude); // Appel à la fonction pour recevoir les informations météo
    

    // Actualisation toutes les 2 minutes
    setInterval(() => {
        recevoirMeteo(latitude, longitude);
    }, 120000);
}

function geolocationError(error) {     //la fonction s'exécute si la position n'a pas été trouvée
    console.log("Erreur lors de la récupération de la position : " + error.message);
}

function recevoirMeteo(latitude, longitude) {
    recevoirTemperature(latitude, longitude);
    setWeatherBackground(weatherCode);
}

function recevoirTemperature(latitude, longitude) {  //cette fonction effectue des requêtes vers l'API openweathermap et donne des informations sur la température, le temps, etc
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let temp = data.main.temp - 273;
            let ville = data.name;
            let humidity = data.main.humidity;
            let windSpeed = data.wind.speed;
            let pays = data.sys.country;
            let weatherCode = data.weather[0].id;

            console.log('Weather Code:', weatherCode);

            temperatureLabel.textContent = `${temp.toFixed(1)} °C`;
            villeLabel.textContent = ville;
            humiditeLabel.textContent = `Humidité: ${humidity}%`;
            ventLabel.textContent = `Vitesse du vent: ${windSpeed} m/s`;
            paysLabel.textContent = `${pays}`;

            const iconCode = data.weather[0].icon;
            let iconImage=iconCode.replace(/"/g, '');    //on enlève les guillemets
        
            let iconUrl='img/'+iconImage+'.png';  //on affiche directement les images avec le dossier img. les images sont stockées localement
            IconeMeteoElement.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;

            setWeatherBackground(weatherCode);
        })
        .catch(error => {
            console.log('Une erreur est survenue', error);
        });
}

//----------------------------------------------Fond d'écran selon le temps---------------->
function setWeatherBackground(weatherCode) {   //en fonction de la météo récupérée, on appelle la classe correspondante dans le fichier css. la météo est récupérée grâce à un nombre (weathercode)
    const weatherBackground = document.body;
    weatherBackground.className = ''; // Supprimer toutes les classes existantes

    const now = new Date();
    const currentHour = now.getHours(); //Récupérer seulement l'heure sans les minutes
    
    if (currentHour >=19 || currentHour <= 6)
    {
        //Pour la nuit
        weatherBackground.classList.add('weather-night');
    }
    else
    {
    switch (true) {
        case weatherCode >= 200 && weatherCode <= 232:
            weatherBackground.classList.add('weather-thunderstorm');
            break;
        case (weatherCode >= 300 && weatherCode <= 321) || (weatherCode >= 500 && weatherCode <= 531):
            weatherBackground.classList.add('weather-rain');
            break;
        case weatherCode >= 600 && weatherCode <= 622:
            weatherBackground.classList.add('weather-snow');
            break;
        case weatherCode >= 701 && weatherCode <= 781:
            weatherBackground.classList.add('weather-fog');
            break;
        case weatherCode === 800:
            weatherBackground.classList.add('weather-clear');
            break;
        default:
            weatherBackground.classList.add('weather-default');
            break;
    }
}
}
//----------------------------------Date et heure------------------------------------------>
function updateTime() {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const time = `${hour}:${minute}:${second}`;

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const date = `${day}/${month}/${year}`;

    timeLabel.textContent = time;
    dateLabel.textContent = date;
}

// Actualisation de l'heure toutes les secondes
setInterval(updateTime, 1000);

navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {    //permet de demander l'accès à la position d'un utilisateur
    enableHighAccuracy: true,
    maximumAge: 0
});

//------------------------------Boutons de redirection----------------------------->
function redirectionconnexion()
{
    const bouton = document.querySelector('.bouton');
    bouton.classList.add('valide');
    //Ouvre une nouvelle page
    window.open("Connexion.html", "_blank");
}

function redirectioninscription()
{
    const bouton = document.querySelector('.bouton');
    bouton.classList.add('valide');
    //Ouvre une nouvelle page
    window.open("Inscription.html", "_blank");
}