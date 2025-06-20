/**
 * Contrôleur de gestion des notifications
 * Reçoit les requêtes HTTP pour envoyer ou récupérer les notifications utilisateur.
 */

/*
Pseudo-code / Algorithme :
- sendNotification(req, res):
    - Appeler NotificationService.sendNotification avec l'id utilisateur et le message
    - Retourner un message de succès ou une erreur

- getNotifications(req, res):
    - Appeler NotificationService.getNotifications avec l'id utilisateur
    - Retourner la liste des notifications
*/ 