# Portfolio Elias Elloumi — plan en jalons

> Remettre elias-elloumi.com à jour avec tout ce qui s'est fait depuis septembre, le rendre plus pro et plus
> original, et en faire une porte d'entrée vers 3geeks.fr, la vitrine du studio.

## Jalons

État : la nuit du 03/11, Elias a demandé de tout faire jusqu'au déploiement sans attendre son feu vert. Tout est
en ligne sur elias-elloumi.com depuis le 03/11 (J5 fait). J1 à J4 restent « à vérifier » : relecture d'Elias,
plus les vérifications listées sous chaque jalon. Les points laissés à son arbitrage sont sous J3 et dans
« À trancher » en fin de fichier.
Constat de départ : le dernier
commit date du 13/09 ; la fiche « 3geeks » décrit encore un « générateur de sites par intention » alors que
3geeks.fr vend aujourd'hui des sites à partir de 300 €, des applications et de l'IA pour les entreprises ; les
projets de septembre à novembre manquent (Souvenia, Shams, Workspace, Geeks Code, 17 OCTOBRE, le site du Cabinet
Dr Amel Elloumi Jellouli, Radar appels d'offres) ; aucun encart ne renvoie vers 3geeks.fr.

**Ordre de passage** : J0 → J1 → J2 → J3 → J4 → J5 → J6

### J0 — Audit et inventaire
- État : fait
- Objectif : savoir précisément ce qui est périmé, ce qui manque et ce qui marche déjà, avant de toucher au design.
- Contenu :
  - audit design de la page actuelle (méthode du skill `design-taste-frontend`) : ce qu'on garde (portrait 3D,
    pile de cartes, assistant), ce qu'on retire (tics « IA » : tirets cadratins dans les textes, sur-étiquetage,
    sections qui se ressemblent) ;
  - inventaire des projets 3Geeks depuis Workspace, avec pour chacun un statut vérifié (en ligne, bêta, interne) et
    le droit de le nommer ou non (règle : client privé = architecture seulement) ;
  - état SEO de départ : titre, description, JSON-LD, sitemap, carte de partage, version FR indexable ou non ;
  - trafic : sources et pages vues (Vercel Analytics, accès d'équipe à autoriser).
- Fini quand : la liste « garder / retirer / ajouter » est écrite dans ce fichier ; la liste des projets est validée
  par Elias ; les mesures de départ (poids de page, LCP, Lighthouse SEO) sont notées.
- *Fait le 03/11*, mesuré sur le site en ligne avec Playwright (Chromium, sans bridage réseau) :
  - **Poids** : 3,4 Mo transférés, sur mobile comme sur ordinateur. Le modèle 3D `head.glb` pèse 1,45 Mo
    (le README annonce 568 Ko : c'est faux depuis le commit d0c678f) ; environ 1,2 Mo de JavaScript.
  - **LCP** : 0,58 s sur ordinateur, 3,4 s en émulation mobile (l'élément est l'affiche du portrait). À creuser en J3.
  - **SEO** : `<html lang="en">` côté serveur ; la version FR n'existe qu'après le chargement (choix de langue
    dans le navigateur), donc Google ne voit que l'anglais. Pas de `hreflang`. JSON-LD Person présent, sans lien
    vers l'Organization 3Geeks. Le sitemap liste l'accueil et les 6 études de cas. Toutes les images ont un `alt`.
    Lighthouse n'est pas installé : score SEO non mesuré, à prendre au début de J4.
  - **Trafic** : non lu, l'API Vercel Analytics renvoie 403 (le connecteur n'a pas accès à l'équipe
    elias-projects).
  - `scripts/verify.mjs` teste encore la section `#story`, supprimée depuis : le script est périmé.
  - `public/3d/avatar-raw.glb` (118 Mo) est ignoré par git et répond 404 en prod : aucun risque.
- **Garder** : le portrait 3D et son affiche, le thème sombre, la pile de cartes projet, l'assistant, la carte du
  monde, les recommandations vérifiées, les études de cas.
- **Retirer ou corriger** :
  - 86 tirets cadratins « — » dans les textes visibles (`lib/` et `components/v2/`) ;
  - 33 petits libellés en capitales espacées au-dessus des titres (les « eyebrows ») : trop de sections se
    ressemblent ;
  - le hero sur ordinateur : un grand vide entre le nom et le portrait, et l'accroche en capitales, avec un
    tiret cadratin ;
  - « Ask my portfolio » reste en anglais sur la version FR ;
  - la page fait près de 15 000 px de haut : trop long pour un premier passage.
- **Ajouter** : Workspace et Geeks Code, présentés comme outils internes (pas de lien, pas d'accès) ; le site du
  Cabinet Dr Amel Elloumi Jellouli (en ligne : www.amel-jellouli-elloumi.com, fil Facebook synchronisé
  automatiquement, 126 publications) ; la fiche 3geeks réécrite en studio (sites à partir de 300 €,
  applications, IA pour les entreprises) ; le lien vers 3geeks.fr.
- **À confirmer par Elias** : le poste actuel (le site dit « alternant chez Cleva Solutions (ClevAI) »).

### J1 — Contenu à jour
- État : à vérifier
- Objectif : que chaque phrase du site soit vraie aujourd'hui.
- Contenu : nouvelles fiches projet ; fiche 3geeks réécrite (studio : sites, applis, IA) ; chiffres revérifiés ;
  textes FR et EN relus ; l'assistant (`/api/ask`) nourri avec le même contenu.
- Fini quand : aucun projet de l'inventaire validé ne manque ; aucun chiffre n'est inventé ; l'assistant répond
  juste sur les nouveaux projets.
- *Codé le 03/11* :
  - grandes cartes Workspace et Geeks Code dans la section 3geeks, sans lien (outils internes) ;
  - le site du Cabinet Dr Amel Elloumi Jellouli dans la liste compacte, avec un lien vers le site ;
  - la fiche « 3geeks » réécrite en studio (sites à partir de 300 €, applications, IA, paiement à satisfaction,
    repris de 3geeks.fr) ;
  - l'infra : 13 → 14 apps (comptées dans Coolify le 03/11 : 14 applications qui tournent, plus le SSO, la forge
    et les sauvegardes), avec la mention du SSO et de la forge Git ;
  - l'assistant peut décrire Workspace et Geeks Code (sans lien et sans rien dire de leur usage chez Cleva), et
    nommer le Cabinet.
  Vérifié : `npm run build` passe ; les trois ajouts s'affichent en local (captures). **Pas vérifié** : les
  réponses de l'assistant (le modèle local ne tourne pas sur ce PC). Le chiffre « 1,000 tests » de Workspace vient
  du journal Workspace du 28/10, à confirmer par Noam.
- À reprendre en J3 : la grille compacte laisse une case vide en fin de liste ; les tableaux des cartes restent
  en anglais sur la version FR ; la mise en surbrillance des cartes par l'assistant ne marche plus (aucune carte
  ne porte `data-project-slug`) ; l'erreur ESLint dans `lib/i18n.tsx` existait déjà avant J1.

### J2 — Passerelle vers 3geeks.fr
- État : à vérifier
- Objectif : un visiteur qui cherche un prestataire part vers 3geeks.fr, sans que le portfolio devienne une pub.
- Contenu : un encart sobre « Un projet ? Passez par le studio » vers 3geeks.fr (avec suivi `utm_source=portfolio`),
  la même chose dans le contact et dans les réponses de l'assistant.
- Fini quand : le lien est visible sans chercher sur mobile et sur ordinateur ; les clics apparaissent dans les
  statistiques de 3geeks.fr.
- *Codé le 03/11* : nouvelle section « Studio » avant le contact (`components/v2/Studio.tsx`) : logo, titre
  « Un projet à construire ? Ça passe par le studio. », les trois offres et leurs prix repris de 3geeks.fr, un seul
  bouton « Aller sur 3geeks.fr » ; entrée « Studio » dans le menu ; lien du pied de page ; fin de chaque étude de
  cas (« Have a project like this one? » avec 3geeks.fr et le contact, à la place de l'ancien renvoi vers la
  section histoire supprimée) ; l'assistant renvoie vers 3geeks.fr pour toute demande de site, d'appli ou d'IA.
  Tous les liens portent `utm_source=elias-elloumi.com&utm_medium=referral&utm_campaign=portfolio`
  (`contact.studioHref` dans `lib/people.ts`). Vérifié en local : visible sur ordinateur et à 400 px.
  **Reste à vérifier** : que les visites arrivent bien dans les statistiques de 3geeks.fr, et la réponse réelle de
  l'assistant (modèle local non lancé sur ce PC). Les offres sont recopiées à la main : à resynchroniser si
  3geeks.fr change ses prix.

### J3 — Refonte visuelle ciblée
- État : à vérifier
- Objectif : un rendu plus pro et plus marquant, en gardant ce qui fait l'identité du site.
- Contenu : typographie, rythme et couleur d'abord ; puis deux ou trois moments originaux motivés (à proposer
  après J0, par exemple une vitrine des produits du studio en grille irrégulière avec de vraies captures) ;
  thème sombre conservé.
- Fini quand : la checklist finale du skill `design-taste-frontend` passe ; le poids de page ne dépasse pas celui
  mesuré en J0 ; rendu vérifié sur téléphone (400 px) et ordinateur.
- *Codé le 03/11* :
  - tirets cadratins retirés de tous les textes visibles (accueil, études de cas, titres, métadonnées), phrases
    relues une par une ; les deux citations de recommandations LinkedIn sont gardées telles quelles ;
  - « Ask my portfolio » traduit (« Interroger mon portfolio ») ; tableaux des cartes Workspace et Geeks Code
    traduits (le type `rows.v` accepte maintenant `L`) ;
  - grille des autres projets : la dernière carte s'étire, plus de case vide ;
  - portrait du hero un peu plus grand sur ordinateur (56vh → 60vh) pour réduire le vide sous le nom ;
  - surbrillance des cartes par l'assistant réparée : un seul slug par projet (`projectSlug` dans
    `lib/work.ts`), porté par les cartes et utilisé par l'assistant ;
  - études de cas : fin de page vers le studio, « 8+ live apps » → 14, la description du générateur présentée
    comme l'origine du studio ;
  - README et commentaire de `Head3D` corrigés : le modèle pèse 1,45 Mo (textures 2048), pas 568 Ko.
  Vérifié : build, `tsc`, captures à 1440 px et 400 px, pas de défilement horizontal à 400 px.
- **Laissé de côté, à trancher par Elias** :
  - repasser les textures du modèle 3D en 1024 px (~-900 Ko par visite sur bonne connexion) : le passage à 2048
    était un choix de netteté (commit 59bc6a2), je n'y ai pas touché ;
  - les 33 petits titres en capitales espacées et les numéros 01, 02… des sections : c'est l'identité actuelle
    du site, à revoir ensemble plutôt qu'en pleine nuit ;
  - le vide entre le nom et le portrait reste visible sur les grands écrans : le vrai remède est de recomposer
    le hero, ce qui sort d'une « évolution ciblée ».

### J4 — SEO et partage
- État : à vérifier
- Objectif : être trouvé sur « Elias Elloumi », « 3Geeks » et les noms des projets, et avoir un bel aperçu au partage.
- Contenu : titre et description à jour, JSON-LD Person relié à l'Organization 3Geeks, sitemap complété, version
  française indexable (`hreflang`), cartes de partage des études de cas, `@vercel/analytics` pour enfin
  compter les visites et les clics vers 3geeks.fr.
- Fini quand : Lighthouse SEO ≥ 95 ; les données structurées passent le test Google ; le sitemap liste toutes les
  pages.
- *Codé le 03/11* :
  - page `/fr` rendue en français dès le serveur (`app/fr/page.tsx`), avec son titre, sa description, sa carte
    de partage et `og:locale fr_FR` ; `hreflang` en / fr / x-default sur les deux pages ;
  - `LocaleProvider` prend une langue initiale ; il n'est plus dans le layout global mais dans chaque page
    d'accueil. Changer de langue met l'adresse à jour (`/` ↔ `/fr`), et un visiteur francophone qui arrive
    sur `/` bascule toujours en français (et l'adresse passe à `/fr`) ;
  - description du site à jour (studio 3geeks) ; JSON-LD Person avec `worksFor` Cleva Solutions et 3geeks ;
  - sitemap : `/fr` ajouté, avec ses alternates de langue ;
  - `@vercel/analytics` 2.0.1 ajouté dans le layout ;
  - `scripts/verify.mjs` réécrit en vrai contrôle (14 vérifications sur `/` et `/fr`) : tout passe en local.
- *Vérifié le 03/11 en production* : Lighthouse sur `/fr` : **SEO 100**, bonnes pratiques 100, accessibilité 96
  (seul échec : `color-contrast`, des textes gris trop pâles, déjà là avant). Web Analytics activé sur le projet
  Vercel, script servi (200). **Pas vérifié** : le test des résultats enrichis de Google sur le JSON-LD, et
  l'indexation réelle de `/fr` (à suivre dans Search Console d'ici quelques jours).

### J5 — Mise en ligne et vérification
- État : fait
- Objectif : la nouvelle version en production, vérifiée.
- Contenu : `npm run verify`, `npm run build`, déploiement Vercel, contrôle sur le vrai domaine.
- Fini quand : elias-elloumi.com sert la nouvelle version ; LCP mobile < 2,5 s ; liens externes tous vérifiés.
- *Fait le 03/11* : commit a836594 poussé sur `main` (via la branche `portfolio-refresh-nov`, fusionnée en
  avance rapide), déployé par `vercel --prod` : elias-elloumi-42bulgr9b, Ready, alias elias-elloumi.com.
  - Premier essai refusé : la CLI envoyait `public/3d/avatar-raw.glb` (118 Mo > limite de 100 Mo). Ajout d'un
    `.vercelignore` qui reprend le `.gitignore` (le rapport PDF et l'export Meshy de la racine ne partent plus
    chez Vercel non plus).
  - `VERIFY_URL=https://elias-elloumi.com npm run verify` : 14/14. Toutes les pages et les liens externes
    (3geeks.fr avec UTM, site du Cabinet) répondent 200 ; `avatar-raw.glb` répond 404 en prod.
  - Mesures en prod (Playwright) : LCP 0,2 s sur mobile, 0,5 s sur ordinateur ; **2,16 s en 4G lente avec un
    processeur bridé ×4**. Les 3,4 s de J0 venaient de l'image de l'affiche pas encore en cache chez Vercel.
    Poids transféré : 2,4 à 2,7 Mo selon la page et l'écran, dont 1,45 Mo de modèle 3D chargé après la page.

### J6 — Geeks Code et Geeko sur l'accueil
- État : à vérifier
- Objectif (Elias, 03/11) : qu'on comprenne vraiment ce qu'est Geeks Code en lisant l'accueil, et qu'on voie Geeko
  à côté, pour donner au site l'ADN 3Geeks.
- Contenu : une section Geeks Code après la pile de projets, Geeko animé avec le vrai moteur, la grande carte Geeks
  Code retirée (pour ne pas le dire deux fois) ; au passage, le nouveau logo 3geeks.
- Fini quand : la section se lit seule sur ordinateur et à 400 px ; Geeko rejoue une session de Claude sans
  recommencer ni déborder ; le poids de la page d'arrivée ne bouge pas ; Elias valide l'esprit.
- *Codé le 03/11* :
  - **Logo** : l'ancien PNG remplacé par le wordmark de la charte (`logo-wordmark.png` du dépôt WebGen, en WebP
    600 px, 17 Ko) dans la section Studio et la carte 3geeks du parcours ; les touches 3geeks passent de l'ambre au
    lime de la charte (#c2fb04). Option `crop` (rustine de l'ancien logo) supprimée. Déployé et vérifié en prod.
  - **Section `components/v2/GeeksCode.tsx`** : ce qu'est Geeks Code et trois groupes de fonctionnalités, tous
    marqués « fait » dans le PLAN.md de Geeks Code (SSO et configuration automatique J4-J5, Claude, mode agent et
    salle des agents J14-J25, projet résumé, Jalons, Infra, Skills J10-J13), plus la mention « interne, pas de
    téléchargement public ». À droite, Geeko rejoue une session : réfléchit → modifie les fichiers → lance les
    commandes → c'est livré, avec une légende de l'étape en cours.
  - **Moteur** : `lib/geeko/geeko.ts`, copie de `branding/geeko/geeko.ts` (source unique dans le dépôt Geeks
    Code, à recopier quand il change). Chargé seulement à l'arrivée sur la section, arrêté quand elle sort de
    l'écran ; avec « réduire les animations », le portrait fixe (`public/geeko/portrait.svg`) reste. Ses bulles
    (écrites pour l'équipe, en tutoiement) sont coupées : la légende parle à sa place.
  - **Bug corrigé dans `FadeIn`** (`Primitives.tsx`) : `motion.create(as)` recréait un composant à chaque rendu
    et démontait tout son contenu (Geeko repartait à zéro à chaque étape). Remplacé par `motion[as]` ; deux
    erreurs ESLint en moins.
  Vérifié en local : la boucle des 4 scènes sur 26 s, rien ne dépasse du cadre (ordinateur et 400 px),
  `npm run verify` 14/14. **Pas vérifié** : le rendu sur un vrai téléphone, et l'avis d'Elias sur l'esprit.

## Décisions

- *03/11* : on ajoute Workspace, Geeks Code et le site du Cabinet Dr Amel Elloumi Jellouli (nommé, puisqu'il
  figure déjà sur 3geeks.fr). Souvenia, Shams, 17 OCTOBRE et Radar appels d'offres restent hors du portfolio pour
  l'instant.
- *03/11* : J3 sera une évolution ciblée, pas une refonte complète : on garde le portrait 3D, le thème sombre et
  la pile de cartes.

## Contraintes permanentes

- Le poids de page est une exigence : chaque nouvel élément est budgété, différé ou sauté sur connexion lente.
- Client privé = architecture seulement, ni marque ni secteur. Un client qui figure déjà publiquement sur
  3geeks.fr peut être nommé, après validation d'Elias.

## À trancher (03/11)

- **Sécurité, urgent** : dans Coolify, l'application `job-aggregator` a un jeton Forgejo écrit en clair dans
  l'adresse de son dépôt Git. Le révoquer dans Forgejo et passer par une clé de déploiement. Rien n'a été touché.
- Textures du modèle 3D en 1024 px ou on garde 2048 (voir J3).
- Petits titres en capitales et numéros de section : on garde l'identité actuelle ou on allège (voir J3).
- Contraste : quelques textes gris trop pâles (Lighthouse `color-contrast`).
- Le chiffre « 1,000 tests » de Workspace, à confirmer par Noam.
- Projet Workspace : il n'y a pas de projet « Portfolio » dans workspace.3geeks.fr ; à créer si on veut y suivre
  ce site.
