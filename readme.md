# 🍰 Pâtisserie Showcase – Full Stack Project

Bonjour à nouveau !

Ce projet est une **récapitulación des notions apprises pendant mes premiers mois en tant qu’apprenti développeur web Full Stack à Ada Tech School**.

## La mission ?

Simple et délicieuse :
Créer un site de pâtisserie qui affiche une variété de desserts avec leurs **descriptions et images**.


## 🛠️ Technologies utilisées

### Front-end

* HTML
* CSS
* JavaScript

### Back-end

* Express.js
* Neon (PostgreSQL)

---

## Mon pas à pas

Voici comment j’ai construit le projet, étape par étape :

### 1️⃣ Première visualisation

Création d’une structure **HTML + CSS avec des données provisoires**.
Objectif : avoir un rendu visuel pour imaginer ce que je voulais voir sur ma page.

### 2️⃣ Construction de la base de données

Une fois les données définies, création de la base de données sur **Neon**.

### 3️⃣ Mise en place du back-end

Installation d’**Express.js** dans le dossier back et connexion à la base de données Neon.

### 4️⃣ Première route GET

Création d’une route **GET** pour récupérer et afficher les données.

### 5️⃣ Connexion Front ↔ Back

Début du `script.js` pour faire interagir la page avec la base de données.
Je ne commence pas par des choses complexes :
    première mission = afficher les données dynamiquement sur la page.

### 6️⃣ Manipulation du DOM

Création dynamique d’éléments dans le DOM pour remplacer la partie statique du HTML.
Chaque pâtisserie est affichée sous forme de **carte organisée** contenant les informations nécessaires.

### 7️⃣ Boutons non interactifs (pour l’instant 👀)

Les cartes incluent des boutons, mais ils ne sont pas encore fonctionnels.

### 8️⃣ Route DELETE + Modal de confirmation

Création d’une route **DELETE** pour rendre le bouton “Effacer” opérationnel.

* Supprime la carte de la page
* Supprime l’élément de la base de données
* Ajout d’un **modal de confirmation** pour éviter les suppressions accidentelles

### 9️⃣ Route PUT

Création d’une route **PUT** pour modifier le contenu d’une carte existante.

### 🔟 Route POST

Création d’une route **POST** pour ajouter un nouvel élément à la page…
…et donc à la base de données.

---

## Ce que j’ai appris <3

* Structurer un projet full stack
* Connecter un front dynamique à une base de données
* Manipuler le DOM proprement
* Implémenter les opérations CRUD complètes (Create, Read, Update, Delete)
* Travailler étape par étape sans brûler les étapes

---

## Conclusion (!!)

Un projet simple en apparence, mais fondamental pour comprendre la logique complète d’une application Full Stack.

Et en plus… ça parle de pâtisseries 🍮