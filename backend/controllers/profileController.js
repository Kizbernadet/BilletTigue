/**
 * Contrôleur de gestion du profil
 * Reçoit les requêtes HTTP pour consulter ou modifier le profil utilisateur.
 */

/*
Pseudo-code / Algorithme :
- getProfile(req, res):
    - Appeler ProfileService.getProfile avec l'id utilisateur
    - Retourner les infos du profil

- updateProfile(req, res):
    - Appeler ProfileService.updateProfile avec l'id utilisateur et les nouvelles données
    - Retourner le profil mis à jour ou une erreur
*/ 