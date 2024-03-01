//-----------------------------------Script Mail------------------------------------>
function checkMail() 
{
  var email = document.getElementById("email").value;
  // Vérifie si l'adresse e-mail est valide en utilisant une expression régulière
  if (email.match(/^[a-zA-Z0-9.]+@[a-zA-Z]+(?:\.[a-zA-Z]+)*$/)) 
  {
    // Enlève le message d'erreur
    erreur.innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur, fait un son et fait vibrer l'appareil
    erreur.innerHTML = "Le mail ou le mot de passe que vous avez renseigné est incorrect.";
    navigator.vibrate(2000);
    Son();
    return false;
  }
}
//----------------------------Script téléphone--------------------------------------->
// function controlenumtel() 
// {
//   var num = document.getElementById("num").value;
//   // Vérifie si il y a bien 10 chiffres et que le premier chiffre est un 0
//   if (num.match[0-9] &&
//     num.length == 10 &&
//     /^0/.test(num))
//   {
//     // Enlève le message d'erreur
//     document.getElementById('erreurnum').innerHTML = "";
//     return true;
//   }
//   else
//   {
//     // Affiche un message d'erreur
//     document.getElementById('erreurnum').innerHTML = "Le numéro de téléphone est invalide.";
//     return false;
//   }
// }
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
    erreur.innerHTML = "";
    return true;
  }
  else
  {
    // Affiche un message d'erreur, fait un son et fait vibrer l'appareil
    erreur.innerHTML = "Le mail ou le mot de passe que vous avez renseigné est incorrect.";
    navigator.vibrate(2000);
    Son();
    return false;
  }
}

//---------------------------------------------Script Bouton------------------------>
function bouton() 
{
  var emailValide = checkMail();
  var passwordValide = checkPassword();

  if (emailValide && passwordValide) 
  {
    var email = document.getElementById("email").value;
    var password = document.getElementById("mdp").value;

    fetch('http://10.222.1.204:3000/utilisateurs?email=' + email + '&motDePasse=' + password)
    .then(response => 
    {
      if (!response.ok) 
      {
        throw new Error('Erreur lors de la requête : ' + response.status);
      }
      return response.json();
    })
    .then(data =>
    {
      console.log(data); // Affiche les données renvoyées par le serveur dans la console

      if (data.connexionValide) 
      {
        //console.log('Connexion réussie');
        window.open("Evenements.html", "_blank");
      }
      else
      {
        //console.log('Identifiants incorrects');
        navigator.vibrate(2000);
        Son();
        erreur.innerHTML = "Le mail ou le mot de passe que vous avez renseigné est incorrect.";
      }
    })
    .catch(error =>
    {
      console.error('Erreur lors de la requête fetch :', error);
    });
  }
  else
  {
    const bouton = document.querySelector('.bouton');
    //Change le texte du bouton
    bouton.textContent = 'Revalider';
  }
}

//Bruit
function Son()
{
  var audioPath = "bruit1.mp3";
  var audio = new Audio(audioPath);
  audio.play();
}