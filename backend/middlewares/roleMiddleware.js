/**
 * Middleware de gestion des rôles
 * Vérifie que l'utilisateur a le rôle requis pour accéder à une ressource.
 */

/*
Pseudo-code / Algorithme :
- Récupérer le rôle de l'utilisateur depuis le token ou la session
- Comparer avec le(s) rôle(s) requis pour la route
- Si autorisé, passer à la suite (next)
- Sinon, retourner une erreur 403 Forbidden
*/ 