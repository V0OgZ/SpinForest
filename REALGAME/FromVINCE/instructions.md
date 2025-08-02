A PRENDRE AVEC DES PINCETTES CE SONT DES CONSEIL VOUS ETES LES IMGENIEURS
---

# 📜 **Instruction de Travail pour l’équipe — Mode Carte**

## 🎮 STRUCTURE DES MODES DE JEU

Heroes of Time est structuré en **3 modes** fondamentaux :

---

### 🌀 **1. Mode Méta / Surcarte** *(Référence : Image 1)*

![Image 1](attachment:/mnt/data/132519f2-18f5-4615-8ace-1c859dbc4d03.png)

> **But : choisir son nom, sa timeline, et la carte à explorer.**

* Vue en **2D iso ou top-down légère**, très lisible.
* Le joueur est incarné par un **avatar mobile**.
* Certains éléments sont **phasés** ou **opaques** : ce sont des timelines **non encore activées**.
* Le **brouillard de guerre** = causalité non résolue.
* Certains éléments sont en **transparence** = passés potentiels ou timelines mortes.
* Un **portail** permet d'entrer dans la vraie carte jouable.

→ Ce mode permet de **choisir son monde**, son **ligne temporelle**, ou d'**observer d'autres timelines** (alternatives, mortes, ou en superposition).

---

### ⚔️ **2. Mode Carte Principale ISO 2D Jouable** *(Référence : Image 2)*

![Image 2](attachment:/mnt/data/eff8897a-b833-41d8-8bb2-c1307b233ac2.png)

> **But : explorer, recruter, interagir avec la carte.**

* Carte en **2D isométrique**.
* Le héros est **mobile sur les plateformes**.
* Chaque **plateforme flottante** = mini-map, scénario ou événement.
* Des **portails ou vortex** relient les zones (changements de timeline, de monde, d’instance).
* Les **épées**, **châteaux**, **arènes** sont des objets / triggers / zones d’action.
* Les **phares cosmiques** autour = métaphore visuelle des timelines ou nœuds temporels.
* Il y a une logique de **transparence, phasage** ou de **brume** à intégrer dans l’UI.

→ C’est le cœur du gameplay d’exploration, de navigation entre timelines, et de déblocage progressif du monde.

---

### 🔥 **3. Mode Combat** *(Pas encore implémenté)*

> **À venir.** C’est un **mode à part entière**, déclenché dans certaines zones (plateformes ou donjons).
> Système de combat asynchrone avec logique quantique activée.

---

## 📂 INSTRUCTIONS TECHNIQUES POUR L'ÉQUIPE

1. 🔍 **Docs à retrouver** :

   * `spec_fog_of_war.md` (ancien doc de Wallace ou Vince)
   * `phasage_causalité.md` ou équivalent
   * `map_control_layer.md` : définit la logique de transparence + collision

2. 📁 **Répertoires à vérifier** :

   * `/REA/FONTAINE/`
   * `/MAPS/iso_maps/`
   * `/docs/visuals/brouillard/`
   * `/scripts/interstice/mécanismes/`

3. 🔧 **Ce qu’on attend de chacun** :

| Rôle        | Tâche                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Groeken** | Intégrer la stack magique dans les plateformes de la carte (activation de portail, phasage, lecture du temps).                        |
| **Dév 1**   | Rendre la carte **navigable en 2D ISO**, avec coordonnées, héros, affichage dynamique des tuiles, collisions de fog.                  |
| **Dév 2**   | Gérer le **brouillard de causalité** et les **timelines parallèles** (zones transparentes, choix narratif, retour temporel possible). |
| **Tous**    | Vérifier s’il existe déjà un composant `MapLayerController`, ou en créer un modulaire pour phasage/collapse/portail.                  |

---

## 🧩 Objectif Semaine

* 🎯 Afficher la **map ISO 2D jouable**, avec phasage partiel.
* 🎯 Le joueur peut se déplacer librement là où **la causalité n’est pas encore collapsée**.
* 🎯 Les portails apparaissent mais ne sont **activables que via sort / stack de Groeken**.
* ⚠️ Si une timeline est **morte**, elle est visible en **grisé / semi-transparente**, mais **non accessible**.

---

💬 S’il manque un doc, un composant, un vieux JSON de map : vous le demandez ou vous cherchez dans le dépôt `ARCHIVES/HOMM-LIKE/` ou `BACKLOG/FOGENGINE/`.

**Pas d’impro non canon. On suit la vision de Vince.**

---

Tu veux que je te sorte ça en `README_map_modes.md` avec les deux images incluses ou en `Notion`/Git ?


REFERENCE A REGARDER 

Map like heroes map.png
Multiverse MAP.png

 I want somethhing pretty if i need to frawe stuff put prompts in that fodler i will do thenm 