// Code de base à ne pas toucher
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() 
{
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}
//------------------------------------------------Début du code---------------------->
//------------------------------Script Genre----------------------------------->
function controlegenre() 
{
  var radios = document.getElementsByName('genre');
  // Par défaut, le genre n'est pas complété
  var genrecomplete = false;

  for (var i = 0; i < radios.length; i++) 
  {
    if (radios[i].checked) 
    {
      genrecomplete = true;
    }
  }

  if (genrecomplete) 
  {
    document.getElementById('erreurgenre').innerHTML = "";
    return true;
  }
  else
  {
    document.getElementById('erreurgenre').innerHTML = "Le genre n'a pas été renseigné.";
    return false;
  }
}

//-----------------------------Script Nom et prénom----------------------------->
function controlenom() 
{
  var nom = document.getElementById("nom").value;
  // Vérifie si le nom est valide en utilisant une expression régulière
  if (nom.match(/[a-zA-Z]/) &&
    nom.length >= 2 &&
    nom.length <= 20) 
  {
    // Enlève le message d'erreur
    document.getElementById('erreurnom').innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur
    document.getElementById('erreurnom').innerHTML = "Le nom n'est pas valide.";
    return false;
  }
}

function controleprenom() 
{
  var prenom = document.getElementById("prenom").value;
  // Vérifie si le prénom est valide en utilisant une expression régulière
  if (prenom.match(/[a-zA-Z]/) &&
    prenom.length >= 2 &&
    prenom.length <= 20)
  {
    // Enlève le message d'erreur
    document.getElementById('erreurprenom').innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur
    document.getElementById('erreurprenom').innerHTML = "Le prénom n'est pas valide.";
    return false;
  }
}
//-----------------------------------Script Mail------------------------------------>
function controlemail() 
{
  var email = document.getElementById("email").value;
  // Vérifie si l'adresse e-mail est valide en utilisant une expression régulière
  if (email.match(/^[a-zA-Z0-9.]+@[a-zA-Z]+(?:\.[a-zA-Z]+)*$/)) 
  {
    // Enlève le message d'erreur
    document.getElementById('erreurmail').innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur
    document.getElementById('erreurmail').innerHTML = "L'adresse e-mail est invalide.";
    return false;
  }
}
//----------------------------Script téléphone--------------------------------------->
function controlenumtel() 
{
  var num = document.getElementById("num").value;
  // Vérifie si il y a bien 10 chiffres et que le premier chiffre est un 0
  if (num.match[0-9] && num.length == 10 && /^0/.test(num))
  {
    // Enlève le message d'erreur
    document.getElementById('erreurnum').innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur
    document.getElementById('erreurnum').innerHTML = "Le numéro de téléphone est invalide.";
    return false;
  }
}
//------------------------------ Script Mot de passe--------------------------------->
function checkPassword() 
{
  var str = document.getElementById("mdp").value;
  // Vérifie si les conditions demandées sont réunies (1 chiffre minimum, 1 majuscule minimum, 1 minuscule minimum et entre 8 et 30 caractères)
  if (str.match(/[0-9]/g) &&
    str.match(/[A-Z]/g) &&
    str.match(/[a-z]/g) &&
    str.length >= 8 &&
    str.length <= 30)
  {
    // Enlève le message d'erreur
    document.getElementById('erreurmdp').innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur
    document.getElementById('erreurmdp').innerHTML = "Le mot de passe ne respecte pas les conditions: entre 8 et 30 caractères, minimum 1 majuscule, 1 minuscule, 1 chiffre.";
    return false;
  }
}

function checksamePassword() 
{
  // Récupérer les valeurs des mots de passe
  var password1 = document.getElementById('mdp').value;
  var password2 = document.getElementById('samemdp').value;

  // Vérifie si les mdp sont égaux et qu'ils respectent les conditions données au-dessus
  if (password1 === password2 &&
    password1.match(/[0-9]/g) &&
    password1.match(/[A-Z]/g) &&
    password1.match(/[a-z]/g) &&
    password1.length >= 8 &&
    password1.length <= 30)
  {
    // Enlève le message d'erreur
    document.getElementById('erreursamemdp').innerHTML = "";
    return true;
  }
  else
  {
    // Ajoute un message d'erreur
    document.getElementById('erreursamemdp').innerHTML = "Les 2 mots de passe que vous avez renseignés sont différents ou le mot de passe ne remplit pas les conditions demandées ci-dessus.";
    return false;
  }
}

//---------------------------------------------Script Bouton------------------------>
function boutoncolorenouvellefenetre() 
{
  var genreValide = controlegenre();
  var nomValide = controlenom();
  var prenomValide = controleprenom();
  var passwordValide = checkPassword();
  var samePasswordValide = checksamePassword();
  var emailValide = controlemail();
  var numtelValide = controlenumtel();

  if (genreValide &&
    nomValide &&
    prenomValide &&
    passwordValide &&
    samePasswordValide &&
    (emailValide || numtelValide))
  {
    //Si tout est valide, nom email et mot de passe vont dans la BDD
    var nom = document.getElementById('nom').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('mdp').value;

    var data =
    {
      nom: nom,
      email: email,
      mot_de_passe: password
    };

    fetch('http://10.222.1.204:3000/utilisateurs',
    {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response =>
    {
      if (response.ok)
      {
        window.location.href = 'Evenements.html';
      }
      else
      {
        console.log('Erreur lors de l\'envoi des données.');
        console.log(response);
      }
    })
    .catch(error =>
    {
      console.log('Erreur :', error);
    });
  }
}

//----------------------------------------Easter Egg------------------------>
/*
function Curseur() 
{
  document.body.style.cursor = 'url(img/curseur1.png), auto';
}*/