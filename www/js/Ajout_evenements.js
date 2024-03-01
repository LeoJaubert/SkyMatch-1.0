function validateForm(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    var requiredFields = ["titre", "heure_debut", "heure_fin", "lieu"];
    var formIsValid = true;

    // Vérification des champs obligatoires
    for (var i = 0; i < requiredFields.length; i++) {
        var input = document.getElementById(requiredFields[i]);

        if (input.value.trim() === "") {
            input.classList.add("required-field");
            document
                .querySelector('label[for="' + requiredFields[i] + '"]')
                .classList.add("required-field-label");
            formIsValid = false;
        } else {
            input.classList.remove("required-field");
            document
                .querySelector('label[for="' + requiredFields[i] + '"]')
                .classList.remove("required-field-label");
        }
    }

    // Vérification des cases à cocher
    var checkboxes = document.getElementsByName("meteo");
    var checked = false;
    var confirmation = false;

    for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked) {
            checked = true;

            if (confirm("Confirmez-vous cette option météo : " + checkboxes[j].value + " ?")) {
                confirmation = true;
                break;
            }
        }
    }

    // Validation finale du formulaire
    if (!checked || !confirmation) {
        alert("Veuillez sélectionner et confirmer au moins une option météo.");
        formIsValid = false;
    }

    if (formIsValid) {
        // Si le formulaire est valide, il peut être envoyé au serveur

        // Récupérer les valeurs des champs de date
        var dateDebut = document.getElementById("date_debut").value;
        var dateFin = document.getElementById("date_fin").value;

        // Récupérer les valeurs des cases à cocher sélectionnées
        var meteoSelectionnees = [];
        for (var k = 0; k < checkboxes.length; k++) {
            if (checkboxes[k].checked) {
                meteoSelectionnees.push(checkboxes[k].value);
            }
        }

        // Ajouter un nouvel événement avec les valeurs du formulaire
        const nouvelEvenement = {
            titre: document.getElementById("titre").value,
            lieu: document.getElementById("lieu").value,
            description: document.getElementById("description").value,
            heure_debut: document.getElementById("heure_debut").value,
            heure_fin: document.getElementById("heure_fin").value,
            date_debut: dateDebut,
            date_fin: dateFin,
            type_evenement_id: document.getElementById("type_evenement_id").value,
            meteo_id: meteoSelectionnees.join(","),
        };

        fetch("http://10.222.1.204:3000/evenements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nouvelEvenement),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Données ajoutées avec succès:", data);
                // Traiter les données de l'événement nouvellement ajouté

                // Réinitialiser le formulaire
                document.getElementById("formulaire-evenement").reset();
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout des données:", error);
                // Gérer l'erreur
            });
    }
}

// Ajouter un gestionnaire d'événement sur le bouton "Enregistrer"
window.onload = function() {
    var boutonEnregistrer = document.querySelector('button[type="submit"]');

    boutonEnregistrer.addEventListener("click", validateForm);
};