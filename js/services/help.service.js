import { getSvgIcon } from "./icons.service.js";

export function getHelpDom() {
  return `
  <p>
    Bienvenue dans <b class="txt-primary">TÉTHYS</b>, un jeu de gestion économique spatial au tour par tour.<br>
    <br>
    Vous incarnez le∙la dirigeant∙e de la guilde <b>TÉTHYS</b>, guilde commerciale dotée d'une flotte de fidèles équipages de prospecteurs, collecteurs, extracteurs et récupérateurs, 
    d'un immense entrepôt et d'une volonté d'expansion dévorante.
  </p>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Lore</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            Basée sur la station interstellaire <b>PÉLAGOS</b>, immense comptoir artificiel en orbite autour du trou noir <b>ALÈTHEIA</b> et conçue comme un relai entre les deux systèmes planétaires 
            principaux de ce coin de la galaxie, votre guilde est la seules de cette station à avoir obtenu une concession au port d'amarrage industriel.<br>
            Celà vous permet de gérer votre commerce au plus près des ressources et d'être informé au plus tôt des tendances commerciales.<br>
            <br>
            Dans le secteur, les patrouilles et les rackets rendent la vente directe par freelances trop risquée: votre existence sert de paratonnerre aux équipages.<br>
            Cependant, tout le monde ne peut pas vous vendre librement: les équipages qui souhaitent commercer avec vous doivent être affiliés à votre guilde.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Équipages</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            À chaque cycle, de nouveaux équipages voudront rejoindre votre guilde.<br>
            <br>
            Les frais de recrutement de ces équipages dépendront de la taille de leur vaisseau,
            mais aussi des éventuelles capacités spéciales de leurs membres, 
            étant pour certain capables d'être redoutablement efficaces pour la prospections de certains types de ressources, 
            et d'être particulièrement mauvais pour d'autres.<br>
            <br>
            Concrètement, seuls les équipages affiliés à TÉTHYS ont accès à ces avantages:
          </p>

          <ul>
            <li><span class="txt-primary">Accès au tableau de missions</span></li>
            <p>Les contrats officiels et les pistes du marché noirs sont sous votre concession et votre réseau d'informateurs. Sans affiliation, ils n'y ont pas accès.</p>

            <li><span class="txt-primary">Avances des frais de mission (upfront)</span></li>
            <p>Vous financez le départ (carburant, éventuels pots-de-vin, etc).</p>

            <li><span class="txt-primary">Permis & couloirs</span></li>
            <p>Vous fournissez les autorisations de sortie (officielles ou falsifiées) et les codes transpondeurs (truqués ou non).</p>

            <li><span class="txt-primary">Rachat garanti à quai en cash au retour</span></li>
            <p>Les équipages veulent du cash immédiat et éviter la gestion et les risques du marché: vous garantissez un rachat dès le débarquement.<br>
            Zéro risque de marché pour eux, c'est vous qui portez le risque spéculatif</p>
          </ul>

          <p>
            Leur profit vient de la marge entre avance de mission et rachat garanti à l'arrivée.<br>
            <br>
            En contreparti, l'équipage signe un contrat d'exclusivité avec TÉTHYS:
          </p>

          <ul>
            <li>Tout ce qu'il ramène est vendu à votre guilde. Vous êtes leur acheteur unique.</li>
            <li>Le rachat à quai sera effectué au tarif guildé.</li>
            <li>Vous gèrez les assignations aux missions de votre concession, pour maximiser les chances de réussites et optimiser vos revenus.</li>
          </ul>
          
          <p>Votre profit vient de la revente (gestion du timing) moins les coûts.</p>

          <p>En plus des éventuels frais upfront des équipages qui partent en mission, les équipages que vous laissez ammarés à quai vous coûtent quelques crédits par cycle.</p>
          <p>En outre, chaque équipage doit se reposer 1 cycle après une série de missions complètes.</p>
          <p>Enfin, il vous est possible de vous séparer d'un équipage en résiliant son contrat, les frais de résiliation étant égaux au coût de recrutement de l'équipage.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Marchés</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            Sur la station PÉLAGOS, deux économies évoluent en parallèle: le marché officiel, et le marché noir. 
            Ils ont tout les deux leurs avantages et inconvénients, mais une chose est sûre: ils ne se mélangent pas.<br>
            <br>
            À chaque cycle, de nouvelles missions plus ou moins longues de prospections de ressources plus ou moins rares apparaitront sur votre tableau de bord, 
            vous invitant à distribuer leur exécution à vos équipages.<br>
            Le nombre et la qualité des missions proposées pour chaque marché dépendra de votre réputation individuelle dans chacun d'eux.<br>
          </p>
            
          

          <h3>Marché officiel</h3>
          <p>Le marché officiel est le plus sûr et le plus stable des deux marchés.</p>
          <p>
            Les ressources du marché officiel possèdent un prix de revente officiel, appelé <b>ASK</b>, 
            qui fluctue lentement en fonction des tendances commerciales et de votre impact sur l'économie locale.
          </p>
          <p>
            Quand vos équipages rentrent de mission, vous achetez leurs ressources officielles au prix guildé appelé <b>BID</b>, 
            qui équivaut à un certain pourcentage du prix ASK de cette ressource.
          </p>

          <h3>Marché noir</h3>
          <p>Le marché noir est le plus volatile mais le plus excitant des deux marchés.</p>
          <p>Les ressources du marché noir possèdent un prix de revente ASK caché, révélé uniquement pendant la phase de vente, qui fluctue énormément et de façon erratique.</p>
          <p>
            Quand vos équipages rentrent de mission, vous achetez leurs ressources noires au prix guildé appelé <b>Appraisal</b>, 
            qui équivaut à un certain pourcentage du prix ASK caché <b>estimé</b> de cette ressource, 
            déterminé en fonction de la tendance d'évolution des prix donnée à la phase de réajustement.<br>
            Cependant, cette estimation ne reste qu'une estimation, et il est toujours possible que le marché noir change avant la phase de vente.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Réputation(s)</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            La confiance de chaque marché dans votre guilde est représentée par un compteur de réputation (0-250).<br>
            Chaque mission complétée augmente votre réputation dans le marché concerné en fonction de la rareté des ressources prospectées, et diminue votre réputation dans l'autre.<br>
            <br>
            Plus vous avez de réputation dans un marché, plus vous aurez de missions disponibles pour ce marché par cycle, et avec de meilleures raretés à prospecter.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Ressources</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            Chaque ressource que vous pouvez acheter ou vendre sur PÉLAGOS est associée à l'un ou l'autre des marchés, 
            et est identifiée par 2 critères: sa <b>catégorie</b> et sa <b>rareté</b>
          </p>
          <h3>Marché officiel</h3>
          <p>Les ressources qui s'échangent au marché officielles sont réparties en 3 catégories:</p>
          <ul>
            <li class="txt-primary">Minerai</li>
            <ul>
              <li class="txt-common">Commun</li>
              <p>Fer brut, aluminium, cuivre, matériaux de base abondants</p>
              <li class="txt-uncommon">Inhabituel</li>
              <p>Alliages spéciaux, titane, métaux conducteurs haute pureté</p>
              <li class="txt-rare">Rare</li>
              <p>Éléments lourds, terres rares, minerais radioactifs</p>
              <li class="txt-legendary">Légendaire</li>
              <p>Cristaux énergétiques, isotopes exotiques</p>
            </ul>
            <li class="txt-primary">Composants</li>
            <ul>
              <li class="txt-common">Commun</li>
              <p>Circuits imprimés standards, boulons, câblage industriel</p>
              <li class="txt-uncommon">Inhabituel</li>
              <p>Microprocesseurs spécialisés, modules mécaniques précis, capteurs optiques</p>
              <li class="txt-rare">Rare</li>
              <p>Réacteurs miniaturisés, composants quantiques, pièces de machines spécialisées</p>
              <li class="txt-legendary">Légendaire</li>
              <p>Prototypes uniques, modules industriels expérimentaux</p>
            </ul>
            <li class="txt-primary">Nanotech</li>
            <ul>
              <li class="txt-common">Commun</li>
              <p>Nanotubes de carbone, agents auto-nettoyants, revêtements industriels intelligents</p>
              <li class="txt-uncommon">Inhabituel</li>
              <p>Nanomachines médicales simples, filtres moléculaires, catalyseurs de précision</p>
              <li class="txt-rare">Rare</li>
              <p>Essaims auto-réparateurs, polymères intelligents, systèmes d'ingénierie cellulaire</p>
              <li class="txt-legendary">Légendaire</li>
              <p>Matériaux auto-conscients, matrices de reconstruction biologique</p>
            </ul>
          </ul>

          <h3>Marché noir</h3>
          <p>Les ressources qui s'échangent au marché noir sont aussi réparties en 3 catégories:</p>
          <ul>
            <li class="txt-primary">Armement</li>
            <ul>
              <li class="txt-common">Commun</li>
              <p>Armes de poing non enregistrées, munitions hors quota</p>
              <li class="txt-uncommon">Inhabituel</li>
              <p>Explosifs non répertoriés, blindages légers, drones civils hackés</p>
              <li class="txt-rare">Rare</li>
              <p>Canons énergétiques, exo-armures tactiques, charges EMP militaires</p>
              <li class="txt-legendary">Légendaire</li>
              <p>Prototypes militaires, drones orbitaux</p>
            </ul>
            <li class="txt-primary">Narcotix</li>
            <ul>
              <li class="txt-common">Commun</li>
              <p>Stimulants récréatifs populaires, inhalateurs euphorisants basiques</p>
              <li class="txt-uncommon">Inhabituel</li>
              <p>Altérants biologiques, modificateurs corporels, substances hallucinogènes de synthèse</p>
              <li class="txt-rare">Rare</li>
              <p>Catalyseurs neuronaux, nanodoping</p>
              <li class="txt-legendary">Légendaire</li>
              <p>Neuro-boosters militaires</p>
            </ul>
            <li class="txt-primary">Artefacts</li>
            <ul>
              <li class="txt-common">Commun</li>
              <p>Objets rituels mineurs, fragments de statues anciennes</p>
              <li class="txt-uncommon">Inhabituel</li>
              <p>Prismes analogiques, reliques religieuses interdites</p>
              <li class="txt-rare">Rare</li>
              <p>Matrices technologiques anciennes, cristaux aux propriétés anormales</p>
              <li class="txt-legendary">Légendaire</li>
              <p>Reliques mythiques des Anciens</p>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Détail des phases de jeu</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            <b class="txt-primary">TÉTHYS</b> se déroule en <b>Cycles</b>, eux mêmes divisés en 8 <b>Phases</b> distinctes.<br>
            <br>
            Celles ci consistent en:
          </p>
            <ul>
              <li>des opérations <b>automatiques</b></li>
              <ul>
                <li>en <b>début de phase</b></li>
                <p>Ces opérations interviennent au début de la phase, avant la partie interactive</p>
                <li>en <b>fin de phase</b></li>
                <p>Ces opérations interviennent à la fin de la phase, après le clic sur "phase suivante"</p>
              </ul>
              <li>des opérations <b>manuelles</b></li>
              <p>durant la partie interactive de chaque phase, vous serez invité à réaliser des actions manuelles</p>
            </ul>

          <h3>Phase 1: Déploiement</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Génération des missions disponibles pour ce cycle, en fonction de l'état actuel des marchés et de votre réputation dans chacun d'eux.</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Attribution (ou non) des différentes missions aux équipages disponibles.</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Paiement des frais d'équipages':</li>
            <ul>
              <li>Taxe d'amarrage pour les vaisseaux à quai</li>
              <li>Frais upfront pour les vaisseaux qui partent en mission</li>
            </ul>
          </ul>

          <h3>Phase 2: Transit</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Génération des différents évenements aléatoires pour chacun des équipages qui va revenir pendant le cycle en cours.<br>
            Ces évenements peuvent aussi bien être positifs que négatifs.</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Aucune</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Recalcul des cycles restants pour chaque mission</li>
            <li>Génération du loot pour les missions terminées, en fonction du type de mission, de l'équipage et des éventuels évènements</li>
          </ul>

          <h3>Phase 3: Rapatriement</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Retour des équipages dont la mission est terminée</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Aucune</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Achat et stockage en entrepôt des slots de ressources des vaisseaux revenus, au prix BID ou Appraisal</li>
            <li>Retrait de l'assignation des crews qui viennent de rentrer et mise à jour des cycles avant repos pour chaque crew</li>
            <li>Mise à jour de la réputation des marchés concernés par les missions terminées</li>
          </ul>

          <h3>Phase 4: Vente</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Aucune</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Pour chaque ressource, vous pouvez ici vendre (ou non) un ou la totalité des slots de votre stock.</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Aucune</li>
          </ul>

          <h3>Phase 5: Revenus passifs</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Calcul de la somme des revenus passifs pour ce cycle de toutes les infrastructures dans lesquelles vous avez investi</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Aucune</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Encaissement des revenus passifs</li>
          </ul>

          <h3>Phase 6: Recrutement</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Génération des équipages recrutables pour ce cycle</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Recrutement (ou non) d'un ou plusieurs équipages</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Aucune</li>
          </ul>

          <h3>Phase 7: Investissements</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Aucune</li>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Investissement (ou non) dans différentes infrastructures qui vont générer des revenus passifs pour la guilde</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Aucune</li>
          </ul>

          <h3>Phase 8: Réajustements</h3>
          <h4>Opérations de début de phase</h4>
          <ul>
            <li>Recalcul des prix pour le prochain cycle</li>
            <ul>
              <li>Recalcul des ASK des ressources échangées au marché officiel</li>
              <li>Recalcul des tendances pour ressources échangées au marché noir</li>
            </ul>
          </ul>
          <h4>Opérations manuelles</h4>
          <ul>
            <li>Aucune</li>
          </ul>
          <h4>Opérations de fin de phase</h4>
          <ul>
            <li>Aucune</li>
          </ul>

        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">Investissements</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            Une fois un certain niveau atteint, vous aurez la possibilité d'essayer d'étendre votre influence en investissant dans différentes infrastructures au sein de la station PÉLAGOS (et même au delà), 
            qui génèreront chacun un revenu passif régulier pour votre guilde.<br>
            Chaque infrastructure a des prérequis pour reçevoir votre mécenat, en terme de taille de flotte et de réputation.
            Certains investissements débloquent des titres honorifiques purement cosmétiques en plus de leur revenu passif, quand les autres ont la capacité d'être améliorées pour augmenter ces revenus.
            <br>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div>
        <span class="header-title">À propos</span>
      </div>
      <div class="tile-caret">
        ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <p>
            Dans la mythologie grecque, <b>Téthys</b> (en grec ancien Τηθύς / Tēthús) est la benjamine des Titanides.<br>
            Fille d'Ouranos (le Ciel) et de Gaïa (la Terre), sœur et épouse d'Okéanos (l'Océan) de qui elle eut de très nombreux fils, les dieux-fleuves et de très nombreuses filles, les Océanides (6 000 en tout), elle personnifie la fécondité marine.
            On la voit intervenir dans plusieurs mythes, où elle y joue un rôle bénéfique.
          </p>
          <p>
            En grec, <b>Pélagos</b> (πέλαγος) signifie la haute mer, le large, par opposition à la côte. Plus précisément, le domaine marin où l'on ne voit plus la terre, l'immensité maritime.
          </p>
          <p>
            Le concept d'<b>Alètheia</b> (ἀλήθεια en grec ancien), est issu de la philosophie grecque antique qui sert à opposer le domaine de la Vérité (alètheia) à celui de l'opinion, ou doxa.
          </p>
          <p>
            <b class="txt-primary">TÉTHYS</b> est un jeu développé par <a class="txt-primary" href="https://laz-r.github.io/store/" target="_blank">LAZ-R</a>, 
            volontairement basé uniquement sur des technologies front-end <i>vanilla</i> et distribué sous forme d'une PWA.
          </p>
        </div>
      </div>
    </div>
  </div>

  
  `;
}