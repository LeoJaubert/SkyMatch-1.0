// Initialisation
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données
const connection = mysql.createConnection(
{
    host: 'localhost',
    user: 'root',
    password: 'hRE5a7%v_:1Z',
    database: 'bdd_evenement',
    charset: 'utf8',
})

// Démarre le serveur
app.listen(3000, () => 
{
    console.log('Serveur en écoute sur le port 3000');
});

// Route pour récupérer tous les événements selon la météo
app.get('/evenements', (req, res) => 
{
    obtenirCoordonnees()
    .then(coordonnees => 
    {
        const { latitude, longitude } = coordonnees;
        return recevoirTemperature(latitude, longitude);
    })
    .then(descriptionMeteo => 
    {
        
        connection.query(/*
        `SELECT DISTINCT e.*
        FROM evenement AS e
        JOIN evenement_meteo AS em ON e.id = em.evenement_id
        JOIN meteo AS m ON em.meteo_id & (1 << (m.id - 1)) != 0
        WHERE m.temps =  '${descriptionMeteo}'
        ORDER BY titre`,*/
        `SELECT DISTINCT e.*
        FROM evenement AS e
        JOIN evenement_meteo AS em ON e.id = em.evenement_id
        JOIN meteo AS m ON em.meteo_id = m.id
        WHERE m.temps =  '${descriptionMeteo}'
        ORDER BY titre`,
        (err, results) => 
        {
            if (err) 
            {
                console.error('Erreur lors de l\'exécution de la requête :', err);
                return res.status(500).send('Erreur lors de la récupération des événements');
            }
            res.json(results);
        })
    })
    .catch(error => 
    {
        console.log('Erreur lors de la récupération des coordonnées:', error);
        return res.status(500).send('Erreur lors de la récupération des coordonnées');
    })
})

//Récupère les coordonnées de notre position
function obtenirCoordonnees() 
{
    const apiKey = 'cbbd0eae0a504948a4c1269d874c5503';
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
    return fetch(url)
    .then(response => response.json())
    .then(data => 
    {
        const latitude = data.latitude;
        const longitude = data.longitude;
        return { latitude, longitude };
    })
    .catch(error => 
    {
        throw error;
    })
}

//Prend la température selon la position détectée
function recevoirTemperature(latitude, longitude) 
{
    const APIKey = 'ec05fb0a088cb70d48ba425ebbc9463e';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;
    return fetch(url)
    .then(response => response.json())
    .then(data => 
    {
        const weatherCode = data.weather[0].id;
        return setWeatherBackground(weatherCode);
    })
    .catch(error => 
    {
        console.log('Une erreur est survenue', error);
        throw error;
    })/*return Promise.resolve("neige");*/ /*pour choisir directement la météo que l'on veut*/
}

//Utile pour chercher les évènements liés à la météo actuelle
function setWeatherBackground(weatherCode) 
{
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 19 || currentHour <= 6) 
    {
        return 'nuit';
    }
    else
    {
        switch (true) 
        {
            case weatherCode >= 200 && weatherCode <= 232:
                return 'tempête';
            case (weatherCode >= 300 && weatherCode <= 321) || (weatherCode >= 500 && weatherCode <= 531):
                return 'pluie';
            case weatherCode >= 600 && weatherCode <= 622:
                return 'neige';
            case weatherCode >= 701 && weatherCode <= 781:
                return 'brouillard';
            case weatherCode === 800:
                return 'soleil';
            default:
                return 'pluie';
        }
    }
}

//----------------------------------------BDD partie évènements--------------------->
app.post('/evenements', (req, res) => 
{
    const nouvelEvenement = req.body; // Récupérer les données du nouvel événement depuis la requête POST
    connection.beginTransaction((err) => 
    {
        if (err) 
        {
            console.error('Erreur lors du démarrage de la transaction:', err);
            return res.status(500).send('Erreur lors de l\'insertion de l\'événement');
        }
        connection.query(
            `INSERT INTO evenement (id, titre, lieu, description, heure_debut, heure_fin, date_debut, date_fin, type_evenement_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                nouvelEvenement.id,
                nouvelEvenement.titre,
                nouvelEvenement.lieu,
                nouvelEvenement.description,
                nouvelEvenement.heure_debut,
                nouvelEvenement.heure_fin,
                nouvelEvenement.date_debut,
                nouvelEvenement.date_fin,
                nouvelEvenement.type_evenement_id
            ],
            (err, result) => 
            {
                if (err) 
                {
                    console.error('Erreur lors de l\'insertion de l\'événement:', err);
                    return connection.rollback(() => 
                    {
                        res.status(500).send('Erreur lors de l\'insertion de l\'événement');
                    })
                }

                const evenementId = result.insertId;

                connection.query(
                    `INSERT INTO evenement_meteo (evenement_id, meteo_id) 
                    VALUES (?, ?);`,
                    [
                        evenementId,
                        nouvelEvenement.meteo_id
                    ],
                    (err) => 
                    {
                        if (err) 
                        {
                            console.error('Erreur lors de l\'insertion dans la table evenement_meteo:', err);
                            return connection.rollback(() => 
                            {
                                res.status(500).send('Erreur lors de l\'insertion de l\'événement');
                            })
                        }

                        connection.commit((err) => 
                        {
                            if (err) 
                            {
                                console.error('Erreur lors de la validation de la transaction:', err);
                                return connection.rollback(() => 
                                {
                                    res.status(500).send('Erreur lors de l\'insertion de l\'événement');
                                })
                            }

                            // Transaction réussie, renvoyer les données de l'événement nouvellement inséré
                            const nouvelEvenementAvecID = { ...nouvelEvenement, id: evenementId };
                            res.json(nouvelEvenementAvecID);
                        });
                    }
                );
            }
        );
    });
});

//------------------------------------BDD partie utilisateurs----------------------------------->
// Envoi des informations dans la BDD lors de l'inscription
app.post('/utilisateurs', (req, res) => 
{
    const { nom, email, mot_de_passe } = req.body;

    connection.query('INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)', [nom, email, mot_de_passe], (err, results) => 
    {
        if (err) 
        {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).send('Erreur lors de l\'ajout de l\'utilisateur');
        }
        res.sendStatus(200);
    })
})

// Compare email et mot de passe à ceux présents dans la BDD
app.get('/utilisateurs', (req, res) => 
{
    let email = req.query.email;
    let password = req.query.motDePasse;

    connection.query('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, results) => {
        if (err) 
        {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).send('Erreur lors de la vérification des informations d\'identification');
        }

        if (results.length > 0) 
        {
            let utilisateur = results[0];
            if (utilisateur.mot_de_passe.toLowerCase() === password.toLowerCase()) 
            {
                res.json({ connexionValide: true });
            }
            else
            {
                res.json({ connexionValide: false });
            }
        }
        else
        {
            res.json({ connexionValide: false });
        }
    })
})