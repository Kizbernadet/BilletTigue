# Rapport de nettoyage du projet BilletTigue

## web/
- Les fichiers de test et documentation (`TEST_USER_MENU.md`, `RESPONSIVE_IMPROVEMENTS.md`, `RESPONSIVE_TEST.md`, `TEST_BURGER_MENU.md`, `TEST_PROFILE.md`, `API_README.md`, `test-api.html`) ont été archivés dans `web/docs/`.
- Les doublons ou fichiers inutilisés dans `public/assets/css` et `src/css` ont été vérifiés et nettoyés.
- Les images inutilisées dans `public/images/backgrounds` ont été archivées ou supprimées si non référencées.
- Nettoyage des styles inline et commentaires inutiles en cours dans les fichiers HTML/CSS/JS.
- Vérifier les fichiers de configuration (package.json, tailwind, etc.) pour enlever les dépendances inutilisées.
- Vérifier les assets/images non utilisés dans `public/images`.

## mobile/
- Supprimer les dossiers/fichiers générés automatiquement qui ne sont pas nécessaires au versionnement (`build/`, `.dart_tool/`, `.idea/`, etc.).
- Nettoyer les fichiers de documentation obsolètes.
- Vérifier et supprimer les assets/images non utilisés.

## backend/
- Supprimer les scripts, seeders, ou tests obsolètes.
- Nettoyer les fichiers de configuration et les dépendances inutilisées dans `package.json`.
- Vérifier et supprimer les fichiers de log ou de documentation qui ne sont plus pertinents.

## template/
- Supprimer les fichiers de build ou de test inutiles.
- Garder uniquement les fichiers de base ou de référence nécessaires au projet.
- Vérifier les assets (fonts, images, js) pour supprimer les doublons ou fichiers non utilisés.

## web_frame/
- Vérifier le contenu, supprimer les fichiers de test ou de travail temporaire.

## wireframe/
- Garder uniquement les fichiers de référence utiles à la conception.
- Supprimer les images ou fichiers de wireframe non utilisés ou obsolètes.

---

**Recommandations générales :**
- Faire une sauvegarde avant tout nettoyage massif.
- Utiliser un outil de recherche pour repérer les fichiers non référencés dans le code.
- Documenter chaque suppression importante dans ce rapport ou dans le README du dossier concerné.
- Mettre à jour le `.gitignore` si besoin après nettoyage.

_Ajoute ici toute remarque ou action de nettoyage supplémentaire au fil du projet._ 