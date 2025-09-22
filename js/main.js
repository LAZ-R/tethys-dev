import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { getSvgIcon } from "./services/icons.service.js";
import { setHTMLTitle, logAppInfos } from "./utils/UTILS.js";
import { clamp, getCommaFormatedString, getRandomIntegerBetween } from "./utils/math.utils.js";
import { OFFICIAL_MISSIONS_TYPES } from "./data/missionTypes.data.js";
import { addRessourceIdToBagByWeight, CURRENT_BLACK_RESSOURCES_MARKET, CURRENT_OFFICIAL_RESSOURCES_MARKET, getRessourceObjById, getRessourcesPricesDom, updateBlackRessourcesMarket, updateBlackRessourcesValues, updateMarketDom, updateOfficialRessourcesMarket, updateOfficialRessourcesValues, updateOfficialRessourceValues } from "./services/ressources.service.js";
import { getCrewBlocsDom, getCrewByCrewId, getRandomCrew, MY_CREWS, RECRUITABLE_CREWS, setLootForCrew, setStartingCrews, updateCrewId, updateMyCrewDom, updateMyCrews, updateRecruitableCrews } from "./services/crews.service.js";
import { BLACK_AVAILABLE_MISSIONS, BLACK_CURRENT_MISSIONS, BLACK_REPUTATION, distributeBlackMissionsEvents, distributeOfficialMissionsEvents, generateCurrentCycleBlackAvailableMissions, generateCurrentCycleOfficialAvailableMissions, getAvailableOfficialMissionsBlocsDom, getReturnedBlackMissionsBlocsDom, getReturnedOfficialMissionsBlocsDom, OFFICIAL_AVAILABLE_MISSIONS, OFFICIAL_CURRENT_MISSIONS, OFFICIAL_REPUTATION, setNewBlackCurrentMissions, setNewOfficialCurrentMissions, updateAvailableBlackMissionsDom, updateAvailableOfficialMissionsDom, updateBlackAvailableMissions, updateBlackCurrentMissions, updateBlackMissionId, updateBlackReputation, updateBlackReputationDom, updateCompletedMissions, updateCompletedMissionsDom, updateOfficialAvailableMissions, updateOfficialCurrentMissions, updateOfficialMissionId, updateOfficialReputation, updateReputationDom } from "./services/missions.service.js";
import { IDLE_PRICE_BY_SLOT } from "./services/global.service.js";
import { deleteStorage, getStorageDom, getUser, setStorage, setUser } from "./services/storage.service..js";
import { getHelpDom } from "./services/help.service.js";
import { BLACK_RESSOURCES_DESCRIPTIONS, OFFICIAL_RESSOURCES_DESCRIPTIONS } from "./data/ressources.data.js";
import { getEventsDom } from "./services/event.service.js";
import { getSystemDom } from "./services/system.service.js";
import { getInvestmentsDom, getPassiveInfrasDom, updateFlairDom, updatePassiveRevenuDom, updateUserInfrastructures, USER_INFRASTRUCTURES } from "./services/infrastructures.service.js";
// DOM VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');

// GLOBAL

// Current cycle
export let CURRENT_CYCLE = 1;
export let CURRENT_PHASE = 1;
export let CYCLES_BEFORE_GAME_OVER = 3;
export let IS_BANKRUPTCY = false;
export let CURRENT_PHASE_SPENDINGS = 0;

export const updateCurrentPhaseDom = () => {
  document.getElementById('currentPhaseDisplay').innerHTML = `${CURRENT_CYCLE}`;
  document.getElementById('currentCycleCard').innerHTML = `${CURRENT_CYCLE}`;
}

export const updateCurrentPhaseSpendings = (type, amount) => {
  let user = getUser();
  switch (type) {
    case 'add':
      CURRENT_PHASE_SPENDINGS += amount;
      break;
    case 'sub':
      CURRENT_PHASE_SPENDINGS -= amount;
      break;
    default:
      break;
  }
  user.CURRENT_PHASE_SPENDINGS = CURRENT_PHASE_SPENDINGS;
  setUser(user);
}
export const updateCurrentPhaseSpendingsDom = () => {
  document.getElementById('currentPhaseSpendings').innerHTML = `${getCommaFormatedString(CURRENT_PHASE_SPENDINGS)} CRD`;
}

export let CURRENT_PHASE_EARNINGS = 0;
export const updateCurrentPhaseEarnings = (type, amount) => {
  let user = getUser();
  switch (type) {
    case 'add':
      CURRENT_PHASE_EARNINGS += amount;
      break;
    case 'sub':
      CURRENT_PHASE_EARNINGS -= amount;
      break;
    default:
      break;
  }
  user.CURRENT_PHASE_EARNINGS = CURRENT_PHASE_EARNINGS;
  setUser(user);
}
export const updateCurrentPhaseEarningsDom = () => {
  document.getElementById('currentPhaseEarnings').innerHTML = `${getCommaFormatedString(CURRENT_PHASE_EARNINGS)} CRD`;
}

// Total balance
export let TOTAL_BALANCE = 10000;
export const updateTotalBalance = (type, amount) => {
  let user = getUser();
  switch (type) {
    case 'add':
      TOTAL_BALANCE += amount;
      break;
    case 'sub':
      TOTAL_BALANCE -= amount;
      break;
    default:
      break;
  }
  user.TOTAL_BALANCE = TOTAL_BALANCE;
  setUser(user);
}
export const updateTotalBalanceDom = () => {
  const headerElement = document.getElementById('totalBalance');
  const cardElement = document.getElementById('totalBalanceCard');
  headerElement.innerHTML = `${getCommaFormatedString(TOTAL_BALANCE)} CRD`;
  cardElement.innerHTML = `${getCommaFormatedString(TOTAL_BALANCE)} CRD`;

  if (TOTAL_BALANCE < 0) {
    if (!headerElement.classList.contains('txt-error')) {
      headerElement.classList.replace('txt-primary', 'txt-error');
      cardElement.classList.replace('txt-primary', 'txt-error');
    }
  } else {
    if (!headerElement.classList.contains('txt-primary')) {
      headerElement.classList.replace('txt-error', 'txt-primary');
      cardElement.classList.replace('txt-error', 'txt-primary');
    }
  }
}

export let WAREHOUSE = [
  { id: 'OFF_A1', qty: 0, },
  { id: 'OFF_A2', qty: 0, },
  { id: 'OFF_A3', qty: 0, },
  { id: 'OFF_A4', qty: 0, },
  
  { id: 'OFF_B1', qty: 0, },
  { id: 'OFF_B2', qty: 0, },
  { id: 'OFF_B3', qty: 0, },
  { id: 'OFF_B4', qty: 0, },
  
  { id: 'OFF_C1', qty: 0, },
  { id: 'OFF_C2', qty: 0, },
  { id: 'OFF_C3', qty: 0, },
  { id: 'OFF_C4', qty: 0, },

  { id: 'BLA_A1', qty: 0, },
  { id: 'BLA_A2', qty: 0, },
  { id: 'BLA_A3', qty: 0, },
  { id: 'BLA_A4', qty: 0, },
  
  { id: 'BLA_B1', qty: 0, },
  { id: 'BLA_B2', qty: 0, },
  { id: 'BLA_B3', qty: 0, },
  { id: 'BLA_B4', qty: 0, },
  
  { id: 'BLA_C1', qty: 0, },
  { id: 'BLA_C2', qty: 0, },
  { id: 'BLA_C3', qty: 0, },
  { id: 'BLA_C4', qty: 0, },
];
export const updateWarehouse = (warehouse) => {
  let user = getUser();
  WAREHOUSE = warehouse;
  user.WAREHOUSE = WAREHOUSE;
  setUser(user);
}

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

// PHASES #####################################################################

// 1. Phase de planification ==============================
function renderPhase1() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">1. Déploiement</h1>
  <div class="spaced-text">Coût en fin de phase: <span id="currentPhaseSpendings" class="txt-primary">${CURRENT_PHASE_SPENDINGS} CRD</span></div>
  <hr>
  <h2>Missions disponibles</h2>
  
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Marché officiel</span>
      </div>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox" checked>
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div id="availableOfficialMissionsContainer"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Marché noir</span>
      </div>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox" checked>
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div id="availableBlackMissionsContainer"></div>
        </div>
      </div>
    </div>
  </div>
  
  
  `;
  // Calcul des coûts portuaires si tout le monde est ammaré
  if (CURRENT_PHASE_SPENDINGS == 0) {
    for (const crew of MY_CREWS) {
      if (crew.assigned == null) {
        updateCurrentPhaseSpendings('add', (IDLE_PRICE_BY_SLOT * crew.spaceship.slots_count));
      }
    }
  }
  updateCurrentPhaseSpendingsDom();

  // Génération des missions officielles
  if (CURRENT_PHASE == 1 && OFFICIAL_AVAILABLE_MISSIONS.length == 0) {
    generateCurrentCycleOfficialAvailableMissions();
  }
  updateAvailableOfficialMissionsDom();

  // Génération des missions noires
  if (CURRENT_PHASE == 1 && BLACK_AVAILABLE_MISSIONS.length == 0) {
    generateCurrentCycleBlackAvailableMissions();
  }
  updateAvailableBlackMissionsDom();

  // attribution des missions aux équipages (manuel)
  
  MAIN.scrollTo(0, 0);

  if (CURRENT_CYCLE == 1 && CURRENT_PHASE == 1) {
    const startGameContainer = document.getElementById('startGameContainer');
      startGameContainer.innerHTML = `
        <span class="txt-primary">Administration portuaire de PÉLAGOS</span>
        <span class="txt-primary">Décret d'attribution</span>
        <div class="crt">
          <p>
            Après examen de votre dossier et validation par le Conseil de régulation, 
            il est confirmé que la Guilde TÉTHYS obtient la concession exclusive
            du port d'amarrage industriel de la station PÉLAGOS.<br><br>
            Cette autorisation vous confère le droit d'exploiter les quais, 
            de gérer les équipages affiliés et d'assurer la revente des cargaisons 
            issues des missions de prospection intersystèmes.<br><br>
            Vous êtes désormais responsable de la régularité des flux, 
            du paiement des droits et du maintien de la réputation de votre guilde.<br><br>
            <span class="positive">La concession prend effet immédiatement.</span>
          </p>
        </div>
        <button class="lzr-button lzr-solid lzr-primary" style="margin-top: auto;" onclick="onStartGameClick()">COMMENCER</button>
        `;
    startGameContainer.classList.remove('hidden');
    onOpenGhostPageButtonClick('helpContainer');
  }

  if (IS_BANKRUPTCY) {
    if (CYCLES_BEFORE_GAME_OVER != -1) {
      let popUp = document.getElementById('popUp');
      document.getElementById('popUpRessourceTitle').innerHTML = `<span class="txt-error">Faillite</span>`;
      document.getElementById('popUpRessourceName').innerHTML = `<span>[Avis de l'Administration portuaire]</span>`;
      document.getElementById('popUpRessourceAsk').innerHTML = `<span></span><span class="txt-primary"></span>`;
      document.getElementById('popUpBody').innerHTML = `
        <div class="crt">
          <p>
            ${CYCLES_BEFORE_GAME_OVER == 3 ? `
              Votre balance comptable a été constatée négative à la clôture du dernier cycle.<br><br>
              En conséquence, la Guilde TÉTHYS est placée sous le régime de faillite technique.<br><br>
              Un délai de 3 cycles vous est accordé afin de rétablir vos comptes. 
              Passé ce délai, vos droits de concession et votre licence commerciale seront révoqués sans appel.
            ` : ''}
            ${CYCLES_BEFORE_GAME_OVER == 2 ? `
              Votre balance demeure négative à l'issue du dernier cycle.<br><br>
              Vous êtes tenu·e de procéder à une régularisation rapide. 
              À défaut, vos licences commerciales et vos privilèges portuaires seront révoqués définitivement.
            ` : ''}
            ${CYCLES_BEFORE_GAME_OVER == 1 ? `
              Votre situation financière reste déficitaire.<br><br>
              Conformément aux statuts de la station, il vous est imposé de rétablir une balance positive avant la clôture du prochain cycle.<br><br>
              Faute de régularisation, l'ensemble de vos actifs sera saisi et votre licence annulée.
            ` : ''}
            ${CYCLES_BEFORE_GAME_OVER == 0 ? `
              Vos registres sont en défaut de paiement.<br><br>
              La situation est jugée critique par le Conseil de régulation économique.
              Dernier avertissement: vous devez solder vos comptes avant la fin du cycle en cours.<br><br>
              À défaut de régularisation immédiate, la Guilde TÉTHYS sera déclarée en banqueroute définitive et radiée du registre des concessions.
            ` : ''}
          </p>
        </div>
        <button class="lzr-button lzr-solid lzr-primary" style="margin-top: auto;" onclick="onClosePopUpButtonClick()">OK</button>
      `;
    
      popUp.classList.remove('hidden');
    } else {
      const gameOverContainer = document.getElementById('gameOverContainer');
      gameOverContainer.innerHTML = `
        <span class="txt-error">Décision définitive de l'Administration portuaire</span>
        <div class="crt">
          <p>
            Malgré les délais accordés, vos comptes n'ont pas été régularisés.<br><br>
            La Guilde TÉTHYS est déclarée en banqueroute totale. 
            Votre licence commerciale est révoquée, vos concessions portuaires saisies 
            et l'ensemble de vos privilèges annulés sans appel.<br><br>
            Vous n'avez désormais plus aucune autorisation d'opérer sur la station NAME.<br><br>
            <span class="negative">GAME OVER</span>
          </p>
        </div>
        <button class="lzr-button lzr-solid lzr-error" style="margin-top: auto;" onclick="onNewGameClick()">NOUVELLE PARTIE</button>
        `;
      gameOverContainer.classList.remove('hidden');
    }
  }
}

export function onStartGameClick() {
  document.getElementById('startGameContainer').classList.add('hidden');
}
window.onStartGameClick = onStartGameClick;

export function onNewGameClick() {
  deleteStorage();
  window.location = './';
}
window.onNewGameClick = onNewGameClick;

// 2. Phase d’événements (Automatique) ====================
function renderPhase2() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">2. Transit</h1>
  <!-- <h2>Phase d'événements (Automatique)</h2> -->
  <div id="eventsContainer"></div>
  `;

  let user = getUser();
  if (user.EVENTS_HAVE_BEEN_DISTRIBUTED == false) {
    distributeOfficialMissionsEvents();
    distributeBlackMissionsEvents();
    // save
    updateOfficialCurrentMissions(OFFICIAL_CURRENT_MISSIONS);
    updateBlackCurrentMissions(BLACK_CURRENT_MISSIONS);
    let user2 = getUser();
    user2.EVENTS_HAVE_BEEN_DISTRIBUTED = true;
    setUser(user2);
  }

  document.getElementById('eventsContainer').innerHTML = getEventsDom();
  MAIN.scrollTo(0, 0);
}

// 3. Phase de résolution (Automatique) ===================
function renderPhase3() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">3. Rapatriement</h1>
  <div class="spaced-text">Coût en fin de phase: <span id="currentPhaseSpendings" class="txt-primary">${CURRENT_PHASE_SPENDINGS} CRD</span></div>
  <hr>
  <h2>Missions officielles</h2>
  <div id="returnedOfficialMissions"></div>
  <hr>
  <h2>Marché noir</h2>
  <div id="returnedBlackMissions"></div>
  `;
  // A. Révélation des "Appraisal" du marché noir

  // B. Retours de missions et achat automatique des ressources
  if (CURRENT_PHASE_SPENDINGS == 0) {
    let currentSpendings = 0;
    let filteredOfficialArray = OFFICIAL_CURRENT_MISSIONS.filter((mission) => mission.status == 'finished');
    for (const mission of filteredOfficialArray) {
      const spaceshipSlots = MY_CREWS.find((crew) => mission.assigned_crew_id == crew.id).spaceship.slots;
      //console.log(spaceshipSlots);
      for (const slot of spaceshipSlots) {
        if (slot.ressource_id !== null) {
          let ressource = getRessourceObjById(slot.ressource_id)
          currentSpendings += ressource.bid;
        }
      }
    }
    let filteredBlackArray = BLACK_CURRENT_MISSIONS.filter((mission) => mission.status == 'finished');
    for (const mission of filteredBlackArray) {
      const spaceshipSlots = MY_CREWS.find((crew) => mission.assigned_crew_id == crew.id).spaceship.slots;
      //console.log(spaceshipSlots);
      for (const slot of spaceshipSlots) {
        if (slot.ressource_id !== null) {
          let ressource = getRessourceObjById(slot.ressource_id)
          currentSpendings += ressource.bid;
        }
      }
    }
    //updateOfficialRessourcesMarket(CURRENT_OFFICIAL_RESSOURCES_MARKET);
    updateCurrentPhaseSpendings('add', Number(currentSpendings.toFixed(2)));
  }
  updateCurrentPhaseSpendingsDom();



  document.getElementById('returnedOfficialMissions').innerHTML = getReturnedOfficialMissionsBlocsDom();
  document.getElementById('returnedBlackMissions').innerHTML = getReturnedBlackMissionsBlocsDom();
  
  MAIN.scrollTo(0, 0);
}

// 4. Phase de vente ======================================
function renderPhase4() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">4. Vente</h1>
  <span class="spaced-text">
    <span>Total items entrepôt</span>
    <span id="warehouseCount2" class="txt-primary">0</span>
  </span>
  <span class="spaced-text">
    <span>Valeur totale</span>
    <span id="totalWarehouseValue2" class="txt-primary">0</span>
  </span>
  <hr>
  <h2>Marché officiel</h2>
  <div id="officialSellableList"></div>
  <hr>
  <h2>Marché noir</h2>
  <div id="blackSellableList"></div>
  `;
  // Révélation des "Prix de revente" du marché noir
  let user = getUser();
  if (user.PRICES_HAVE_BEEN_UPDATED != true) {
    user.PRICES_HAVE_BEEN_UPDATED = true;
    setUser(user);
    
    // Recalcul des prix noirs pour la prochaine phase
    updateBlackRessourcesValues(true);
    for (let ressource of CURRENT_BLACK_RESSOURCES_MARKET) {
      ressource.current_cycle_sold_units = 0;
    }
    updateBlackRessourcesMarket(CURRENT_BLACK_RESSOURCES_MARKET);
    updateWarehouseDom();
  }
  updateMarketDom();
  
  // Pour chaque ressource en stock, on peut choisir de vendre (ou pas)
  const container = document.getElementById('officialSellableList');
  container.innerHTML = `${getWarehouseOfficialSlotsListDom(true)}`;
  const container2 = document.getElementById('blackSellableList');
  container2.innerHTML = `${getWarehouseBlackSlotsListDom(true)}`;
  MAIN.scrollTo(0, 0);
  updateWarehouseDom();
}

// 5. Phase de revenus passifs ============================
function renderPhase5() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">5. Revenus passifs</h1>
  <div class="spaced-text">Gains en fin de phase: <span id="currentPhaseEarnings" class="txt-primary">${CURRENT_PHASE_EARNINGS} CRD</span></div>
  <hr>
  <div id="passiveInfrasContainer"></div>
  `;
  if (CURRENT_PHASE_EARNINGS == 0) {
    let currentEarnings = 0;
    for (let userInfra of USER_INFRASTRUCTURES) {
      currentEarnings += userInfra.passive_revenu;
    }
    updateCurrentPhaseEarnings('add', Number(currentEarnings.toFixed(2)));
  }
  updateCurrentPhaseEarningsDom();
  document.getElementById('passiveInfrasContainer').innerHTML = getPassiveInfrasDom();
  MAIN.scrollTo(0, 0);
}

// 6. Phase de recrutement ================================
function renderPhase6() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">6. Recrutement</h1>
  <h2>Équipages recrutables</h2>
  <div id="recruitableCrewsContainer"></div>
  `;
  // Manuel :
  // - Recrutement - Chaque équipage recruté = Prime de signature – payé 1 fois, à l’embauche
  // Génération des équipages recrutables
  let user = getUser();
  if (user.RECRUITABLE_CREWS.length == 0) {
    let randomCrews = [];
    for (let index = 0; index < 5; index++) {
      const randomCrew = getRandomCrew(index + 1);
      randomCrews.push(randomCrew);
    }
    randomCrews.sort((a, b) => {return a.spaceship.slots_count - b.spaceship.slots_count})
    updateRecruitableCrews(randomCrews);
    document.getElementById('recruitableCrewsContainer').innerHTML = getCrewBlocsDom(randomCrews, 'recruit');
  } else {
    if (user.RECRUITABLE_CREWS[0] !== 'empty') {
      document.getElementById('recruitableCrewsContainer').innerHTML = getCrewBlocsDom(user.RECRUITABLE_CREWS, 'recruit');
    } else {
      document.getElementById('recruitableCrewsContainer').innerHTML = `<span>Aucun équipage recrutable ce cycle</span>`;
    }
  }
  // - Upgrade taille entrepôt
  MAIN.scrollTo(0, 0);
}

// 7. Investissements =====================================
function renderPhase7() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">7. Investissements</h1>
  <div id="investmentsContainer"></div>
  `;

  document.getElementById('investmentsContainer').innerHTML = getInvestmentsDom();

  
  MAIN.scrollTo(0, 0);
}

// 8. MAJ des variables (Automatique) =====================
function renderPhase8() {
  MAIN.innerHTML = `
  <h1 id="pageTitle">8. Réajustements</h1>
  <h2>Marché officiel</h2>
  <div id="officialUpdatedPricesContainer"></div>
  <h2>Marché noir</h2>
  <div id="blackUpdatedPricesContainer"></div>
  `;

  let user = getUser();
  if (user.PRICES_HAVE_BEEN_UPDATED != true) {
    user.PRICES_HAVE_BEEN_UPDATED = true;
    setUser(user);
    
    // Recalcul des prix officiels pour la prochaine phase
    updateOfficialRessourcesValues();
    for (let ressource of CURRENT_OFFICIAL_RESSOURCES_MARKET) {
      ressource.current_cycle_sold_units = 0;
    }
    updateOfficialRessourcesMarket(CURRENT_OFFICIAL_RESSOURCES_MARKET);
    
    // Recalcul des prix noirs pour la prochaine phase
    updateBlackRessourcesValues();
    for (let ressource of CURRENT_BLACK_RESSOURCES_MARKET) {
      ressource.current_cycle_sold_units = 0;
    }
    updateBlackRessourcesMarket(CURRENT_BLACK_RESSOURCES_MARKET);
    updateWarehouseDom();
  }
  updateMarketDom();

  

  // Génération des nouvelles variables pour le marché noir
  // Prix de revente noir (masqués)
  // Appraisal (masqués)
  // Génération des tendances du marché noir (visibles)
  MAIN.scrollTo(0, 0);
}

function renderPhase(phaseNumber = 1) {
  switch (phaseNumber) {
    // 1. Phase de planification ##############################################
    case 1: renderPhase1(); break;

    // 2. Phase d’événements (Automatique) ####################################
    case 2: renderPhase2(); break;

    // 3. Phase de résolution (Automatique) ###################################
    case 3: renderPhase3(); break;

    // 4. Phase de vente ######################################################
    case 4: renderPhase4(); break;

    // 5. Phase de revenus passifs ######################################################
    case 5: renderPhase5(); break;

    // 6. Phase de recrutement #######################################################
    case 6: renderPhase6(); break;

    // 7. Phase d'investissement ###########################################################
    case 7: renderPhase7(); break;

    // 8. MAJ des variables (Automatique) #####################################
    case 8: renderPhase8(); break;

    default: 
    break;
  }
}

const onNextPhaseButtonClick = () => {
  switch (CURRENT_PHASE) {
    // 1. Phase de planification ==========================
    case 1:
      // Ajout des missions sélectionnées aux "current missions"
      setNewOfficialCurrentMissions()
      updateOfficialCurrentMissions(OFFICIAL_CURRENT_MISSIONS);
      // Suppression des "available missions"
      updateOfficialAvailableMissions([]);

      // Ajout des missions sélectionnées aux "current missions"
      setNewBlackCurrentMissions()
      updateBlackCurrentMissions(BLACK_CURRENT_MISSIONS);
      // Suppression des "available missions"
      updateBlackAvailableMissions([]);

      // MAJ du repos des crews
      for (let crew of MY_CREWS) {
        if (crew.missions_before_rest == 0 && crew.is_resting == true) {
          crew.is_resting = false;
          crew.missions_before_rest = crew.spaceship.slots_count + 1;
        }
      }
      updateMyCrews(MY_CREWS);
      updateMyCrewDom();
      // Paiement des frais de missions et frais d'ammarage
      updateTotalBalance('sub', CURRENT_PHASE_SPENDINGS);
      updateTotalBalanceDom();
      break;

    // 2. Phase d’événements (Automatique) ================
    case 2:
      // Recalcul des cycles restants
      for (let mission of OFFICIAL_CURRENT_MISSIONS) {
        mission.mission_type.cycles -= 1;

        if (mission.mission_type.cycles <= 0) {
          mission.mission_type.cycles = 0;
          let crew = getCrewByCrewId(mission.assigned_crew_id);
          setLootForCrew(crew, mission);
          if (mission.mission_type.cycles == 0) {
            mission.status = 'finished';
          }
        }
      }
      // Recalcul des cycles restants
      for (let mission of BLACK_CURRENT_MISSIONS) {
        mission.mission_type.cycles -= 1;

        if (mission.mission_type.cycles <= 0) {
          mission.mission_type.cycles = 0;
          let crew = getCrewByCrewId(mission.assigned_crew_id);
          setLootForCrew(crew, mission);
          if (mission.mission_type.cycles == 0) {
            mission.status = 'finished';
          }
        }
      }
      updateOfficialCurrentMissions(OFFICIAL_CURRENT_MISSIONS);
      updateBlackCurrentMissions(BLACK_CURRENT_MISSIONS);
      updateMyCrews(MY_CREWS);
      updateMyCrewDom();
      let user2 = getUser();
      user2.EVENTS_HAVE_BEEN_DISTRIBUTED = false;
      setUser(user2);
      break;

    // 3. Phase de résolution (Automatique) ===============
    case 3:
      // Dépense des thunes
      updateTotalBalance('sub', CURRENT_PHASE_SPENDINGS);
      updateTotalBalanceDom();
      // Libération des crews 
      let finishedOfficialMissionsArray = OFFICIAL_CURRENT_MISSIONS.filter((mission) => mission.mission_type.cycles == 0);
      for (let finishedMission of finishedOfficialMissionsArray) {
          let repValuePlus = 0;
          let repValueMinus = 0;
          switch (finishedMission.mission_type.rarity) {
            case 'Commun': repValuePlus = .5; repValueMinus = .25; break;
            case 'Inhabituel': repValuePlus = 1; repValueMinus = .5; break;
            case 'Rare': repValuePlus = 1.5; repValueMinus = .75; break;
            default: break;
          }
          updateOfficialReputation(Number((OFFICIAL_REPUTATION + repValuePlus).toFixed(2)));
          updateBlackReputation(Number((BLACK_REPUTATION - repValueMinus).toFixed(2)));
          updateCompletedMissions(getUser().COMPLETED_MISSIONS + 1);
          updateCompletedMissionsDom();
        
        for (let crew of MY_CREWS) {
          if (finishedMission.assigned_crew_id == crew.id) {
            crew.assigned = null;
            for (let slot of crew.spaceship.slots) {
              if (slot.ressource_id != null) {
                //console.log(WAREHOUSE)
                let warehouseSlot = WAREHOUSE.find((warehouseSlot) => warehouseSlot.id == slot.ressource_id);
                warehouseSlot.qty += 1;
                slot.ressource_id = null;
              }
            }
            crew.missions_before_rest -= 1;
            if (crew.missions_before_rest <= 0) {
              crew.missions_before_rest = 0;
              crew.is_resting = true;
            }
          }
        }
      }
      let finishedBlackMissionsArray = BLACK_CURRENT_MISSIONS.filter((mission) => mission.mission_type.cycles == 0);
      for (let finishedMission of finishedBlackMissionsArray) {
        
          let repValuePlus2 = 0;
          let repValueMinus2 = 0;
          switch (finishedMission.mission_type.rarity) {
            case 'Commun': repValuePlus2 = .5; repValueMinus2 = .25; break;
            case 'Inhabituel': repValuePlus2 = 1; repValueMinus2 = .5; break;
            case 'Rare': repValuePlus2 = 1.5; repValueMinus2 = .75; break;
            default: break;
          }
          updateBlackReputation(Number((BLACK_REPUTATION + repValuePlus2).toFixed(2)));
          updateOfficialReputation(Number((OFFICIAL_REPUTATION - repValueMinus2).toFixed(2)));
          updateCompletedMissions(getUser().COMPLETED_MISSIONS + 1);
          updateCompletedMissionsDom();
        for (let crew of MY_CREWS) {
          if (finishedMission.assigned_crew_id == crew.id) {
            crew.assigned = null;
            for (let slot of crew.spaceship.slots) {
              if (slot.ressource_id != null) {
                //console.log(WAREHOUSE)
                let warehouseSlot = WAREHOUSE.find((warehouseSlot) => warehouseSlot.id == slot.ressource_id);
                warehouseSlot.qty += 1;
                slot.ressource_id = null;
              }
            }
            crew.missions_before_rest -= 1;
            if (crew.missions_before_rest <= 0) {
              crew.missions_before_rest = 0;
              crew.is_resting = true;
            }
          }
        }
      }
      updateOfficialReputation(OFFICIAL_REPUTATION);
      updateBlackReputation(BLACK_REPUTATION);
      updateReputationDom();
      updateMyCrews(MY_CREWS);
      updateMyCrewDom();
      updateWarehouse(WAREHOUSE);
      updateWarehouseDom();
      // Suppression des missions revenues
      let stillGoingOfficialMissionsArray = OFFICIAL_CURRENT_MISSIONS.filter((mission) => mission.mission_type.cycles != 0);
      updateOfficialCurrentMissions(stillGoingOfficialMissionsArray);
      let stillGoingBlackMissionsArray = BLACK_CURRENT_MISSIONS.filter((mission) => mission.mission_type.cycles != 0);
      updateBlackCurrentMissions(stillGoingBlackMissionsArray);
      break;

    // 4. Phase de vente ==================================
    case 4:
      let user3 = getUser();
      user3.PRICES_HAVE_BEEN_UPDATED = false;
      setUser(user3);
      updateWarehouseDom();
      break;

    // 5. Phase de revenus passifs ========================
    case 5:
      // 
      updateTotalBalance('add', CURRENT_PHASE_EARNINGS);
      updateTotalBalanceDom();
      break;
    
    // 6. Phase de recrutement ============================
    case 6:
      updateRecruitableCrews([]);
      break;

    // 7. Investissements =================================
    case 7:
      break;
    
    // 8. MAJ des variables (Automatique) =================
    case 8:
      let user = getUser();
      user.PRICES_HAVE_BEEN_UPDATED = false;
      if (TOTAL_BALANCE < 0) {
        if (user.IS_BANKRUPTCY == false) {
          user.IS_BANKRUPTCY = true;
          IS_BANKRUPTCY = true;
          user.UI_THEME = 'bankruptcy';
          document.getElementsByClassName('lzr')[0].style = "--theme: 'bankruptcy';";
        } else {
          user.CYCLES_BEFORE_GAME_OVER -= 1;
          CYCLES_BEFORE_GAME_OVER = user.CYCLES_BEFORE_GAME_OVER;
        }
      } else {
        if (user.IS_BANKRUPTCY == true) {
          user.IS_BANKRUPTCY = false;
          IS_BANKRUPTCY = false;
          user.CYCLES_BEFORE_GAME_OVER = 3;
          user.UI_THEME = user.PREFERED_THEME;
          document.getElementsByClassName('lzr')[0].style = `--theme: '${user.PREFERED_THEME}';`;
        }
      }
      setUser(user);
      break;

    default:
      break;
  }

  CURRENT_PHASE_SPENDINGS = 0;
  updateCurrentPhaseSpendings(CURRENT_PHASE_SPENDINGS);
  CURRENT_PHASE_EARNINGS = 0;
  updateCurrentPhaseEarnings(CURRENT_PHASE_EARNINGS);

  if (CURRENT_PHASE != 8) {
    CURRENT_PHASE += 1;
  } else {
    CURRENT_PHASE = 1;
    CURRENT_CYCLE += 1;
  }
  let user = getUser();
  user.CURRENT_PHASE = CURRENT_PHASE;
  user.CURRENT_CYCLE = CURRENT_CYCLE;
  setUser(user);
  updateCurrentPhaseDom();

  renderPhase(CURRENT_PHASE);
};
window.onNextPhaseButtonClick = onNextPhaseButtonClick;

// Ghost page
export const onOpenGhostPageButtonClick = (ghostPageId) => {
  const display = document.getElementById(ghostPageId);
  if (display.classList.contains('hidden')) {
    display.classList.remove('hidden');
  }
};
window.onOpenGhostPageButtonClick = onOpenGhostPageButtonClick;

export const onCloseGhostPageButtonClick = (ghostPageId) => {
  const display = document.getElementById(ghostPageId);
  if (!display.classList.contains('hidden')) {
    display.classList.add('hidden');
  }
};
window.onCloseGhostPageButtonClick = onCloseGhostPageButtonClick;

export const onClosePopUpButtonClick = () => {
  const display = document.getElementById('popUp');
  if (!display.classList.contains('hidden')) {
    display.classList.add('hidden');
  }
};
window.onClosePopUpButtonClick = onClosePopUpButtonClick;

// WAREHOUSE

export const getWarehouseSlotBlocDom = (warehouseSlot, isSellable = false, isBlack = false) => {

  let ressource = getRessourceObjById(warehouseSlot.id);

  let str = `<div ${isSellable ? `onclick="onWarehouseSlotBlocClick('${ressource.id}')"` : ''} class="warehouse-slot-bloc ${ressource.rarity}">`;
  str += `
    <div class="ressource-image ${ressource.category} ${ressource.rarity}"></div>
    <!-- <span>${ressource.category}</span> -->
    <span class="rarity-text ${ressource.rarity}">${ressource.rarity}</span>
    <span class="qty spaced-text" style="margin-top: auto;"><span>Quantité:</span><b>${warehouseSlot.qty}</b></span>
    <span class="ask spaced-text"><span>ASK:</span> <span class="txt-primary">${isBlack && CURRENT_PHASE !== 4 ? '********** CRD' : `${getCommaFormatedString(ressource.ask)} CRD`}</span></span>
  `;
  str += '</div>';

  return str;
}

export const getWarehouseOfficialSlotsListDom = (isSellable = false) => {
  let str = '';
  // MINERAI
  let mineraiBlocsStr = '';
  let mineraiQty = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  }
  let mineraiCategoryTotal = 0;
  for (const warehouseSlot of WAREHOUSE) {
    if (warehouseSlot.qty != 0 && 
      (warehouseSlot.id == 'OFF_A1' 
      || warehouseSlot.id == 'OFF_A2' 
      || warehouseSlot.id == 'OFF_A3' 
      || warehouseSlot.id == 'OFF_A4')) {
      switch (warehouseSlot.id) {
        case 'OFF_A1': mineraiQty.common    = warehouseSlot.qty; break;
        case 'OFF_A2': mineraiQty.uncommon  = warehouseSlot.qty; break;
        case 'OFF_A3': mineraiQty.rare      = warehouseSlot.qty; break;
        case 'OFF_A4': mineraiQty.legendary = warehouseSlot.qty; break;
        default:
          break;
      }
      mineraiCategoryTotal += getRessourceObjById(warehouseSlot.id).ask * warehouseSlot.qty; 
      mineraiBlocsStr += `${getWarehouseSlotBlocDom(warehouseSlot, isSellable)}`;
    }
  }

  let mineraiQtyStr = '';
  if (mineraiQty.common != 0) { mineraiQtyStr += `<span class="qty-bloc common">${mineraiQty.common}</span>`; }
  if (mineraiQty.uncommon != 0) { mineraiQtyStr += `<span class="qty-bloc uncommon">${mineraiQty.uncommon}</span>`; }
  if (mineraiQty.rare != 0) { mineraiQtyStr += `<span class="qty-bloc rare">${mineraiQty.rare}</span>`; }
  if (mineraiQty.legendary != 0) { mineraiQtyStr += `<span class="qty-bloc legendary">${mineraiQty.legendary}</span>`; }

  str += `
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Minerai</span>
        ${mineraiQtyStr == '' ? '' : `<div class="qty-line">${mineraiQtyStr}</div>`}
       </div>
      <span class="spaced-text">
        <span> </span>
        <span class="txt-primary">${getCommaFormatedString(mineraiCategoryTotal)} CRD</span>
      </span>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div class="warehouse-list">
            ${mineraiBlocsStr}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // COMPOSANTS
  let composantsBlocsStr = '';
  let composantsQty = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  }
  let composantsCategoryTotal = 0;
  for (const warehouseSlot of WAREHOUSE) {
    if (warehouseSlot.qty != 0 && 
      (warehouseSlot.id == 'OFF_B1' 
      || warehouseSlot.id == 'OFF_B2' 
      || warehouseSlot.id == 'OFF_B3' 
      || warehouseSlot.id == 'OFF_B4')) {
      switch (warehouseSlot.id) {
        case 'OFF_B1': composantsQty.common    = warehouseSlot.qty; break;
        case 'OFF_B2': composantsQty.uncommon  = warehouseSlot.qty; break;
        case 'OFF_B3': composantsQty.rare      = warehouseSlot.qty; break;
        case 'OFF_B4': composantsQty.legendary = warehouseSlot.qty; break;
        default:
          break;
      }
      composantsCategoryTotal += getRessourceObjById(warehouseSlot.id).ask * warehouseSlot.qty; 
      composantsBlocsStr += `${getWarehouseSlotBlocDom(warehouseSlot, isSellable)}`;
    }
  }

  let composantsQtyStr = '';
  if (composantsQty.common != 0) { composantsQtyStr += `<span class="qty-bloc common">${composantsQty.common}</span>`; }
  if (composantsQty.uncommon != 0) { composantsQtyStr += `<span class="qty-bloc uncommon">${composantsQty.uncommon}</span>`; }
  if (composantsQty.rare != 0) { composantsQtyStr += `<span class="qty-bloc rare">${composantsQty.rare}</span>`; }
  if (composantsQty.legendary != 0) { composantsQtyStr += `<span class="qty-bloc legendary">${composantsQty.legendary}</span>`; }

  str += `
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Composants</span>
        ${composantsQtyStr == '' ? '' : `<div class="qty-line">${composantsQtyStr}</div>`}
      </div>
      <span class="spaced-text">
        <span> </span>
        <span class="txt-primary">${getCommaFormatedString(composantsCategoryTotal)} CRD</span>
      </span>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div class="warehouse-list">
            ${composantsBlocsStr}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // NANOTECH
  let nanotechBlocsStr = '';
  let nanotechQty = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  }
  let nanotechCategoryTotal = 0;
  for (const warehouseSlot of WAREHOUSE) {
    if (warehouseSlot.qty != 0 && 
      (warehouseSlot.id == 'OFF_C1' 
      || warehouseSlot.id == 'OFF_C2' 
      || warehouseSlot.id == 'OFF_C3' 
      || warehouseSlot.id == 'OFF_C4')) {
      switch (warehouseSlot.id) {
        case 'OFF_C1': nanotechQty.common    = warehouseSlot.qty; break;
        case 'OFF_C2': nanotechQty.uncommon  = warehouseSlot.qty; break;
        case 'OFF_C3': nanotechQty.rare      = warehouseSlot.qty; break;
        case 'OFF_C4': nanotechQty.legendary = warehouseSlot.qty; break;
        default:
          break;
      }
      nanotechCategoryTotal += getRessourceObjById(warehouseSlot.id).ask * warehouseSlot.qty; 
      nanotechBlocsStr += `${getWarehouseSlotBlocDom(warehouseSlot, isSellable)}`;
    }
  }

  let nanotechQtyStr = '';
  if (nanotechQty.common != 0) { nanotechQtyStr += `<span class="qty-bloc common">${nanotechQty.common}</span>`; }
  if (nanotechQty.uncommon != 0) { nanotechQtyStr += `<span class="qty-bloc uncommon">${nanotechQty.uncommon}</span>`; }
  if (nanotechQty.rare != 0) { nanotechQtyStr += `<span class="qty-bloc rare">${nanotechQty.rare}</span>`; }
  if (nanotechQty.legendary != 0) { nanotechQtyStr += `<span class="qty-bloc legendary">${nanotechQty.legendary}</span>`; }

  str += `
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Nanotech</span>
        ${nanotechQtyStr == '' ? '' : `<div class="qty-line">${nanotechQtyStr}</div>`}
      </div>
      <span class="spaced-text">
        <span> </span>
        <span class="txt-primary">${getCommaFormatedString(nanotechCategoryTotal)} CRD</span>
      </span>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div class="warehouse-list">
            ${nanotechBlocsStr}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  return str;
}

export const getWarehouseBlackSlotsListDom = (isSellable = false) => {
  let str = '';
  // ARMEMENT
  let armementBlocsStr = '';
  let armementQty = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  }
  let armementCategoryTotal = 0;
  for (const warehouseSlot of WAREHOUSE) {
    if (warehouseSlot.qty != 0 && 
      (warehouseSlot.id == 'BLA_A1' 
      || warehouseSlot.id == 'BLA_A2' 
      || warehouseSlot.id == 'BLA_A3' 
      || warehouseSlot.id == 'BLA_A4')) {
      switch (warehouseSlot.id) {
        case 'BLA_A1': armementQty.common    = warehouseSlot.qty; break;
        case 'BLA_A2': armementQty.uncommon  = warehouseSlot.qty; break;
        case 'BLA_A3': armementQty.rare      = warehouseSlot.qty; break;
        case 'BLA_A4': armementQty.legendary = warehouseSlot.qty; break;
        default:
          break;
      }
      armementCategoryTotal += getRessourceObjById(warehouseSlot.id).ask * warehouseSlot.qty; 
      armementBlocsStr += `${getWarehouseSlotBlocDom(warehouseSlot, isSellable, true)}`;
    }
  }

  let armementQtyStr = '';
  if (armementQty.common != 0) { armementQtyStr += `<span class="qty-bloc common">${armementQty.common}</span>`; }
  if (armementQty.uncommon != 0) { armementQtyStr += `<span class="qty-bloc uncommon">${armementQty.uncommon}</span>`; }
  if (armementQty.rare != 0) { armementQtyStr += `<span class="qty-bloc rare">${armementQty.rare}</span>`; }
  if (armementQty.legendary != 0) { armementQtyStr += `<span class="qty-bloc legendary">${armementQty.legendary}</span>`; }

  str += `
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Armement</span>
        ${armementQtyStr == '' ? '' : `<div class="qty-line">${armementQtyStr}</div>`}
       </div>
      <span class="spaced-text">
        <span> </span>
        <span class="txt-primary">${CURRENT_PHASE !== 4 ? '********** CRD' : `${getCommaFormatedString(armementCategoryTotal)} CRD`}</span>
      </span>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div class="warehouse-list">
            ${armementBlocsStr}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // NARCOTIX
  let narcotixBlocsStr = '';
  let narcotixQty = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  }
  let narcotixCategoryTotal = 0;
  for (const warehouseSlot of WAREHOUSE) {
    if (warehouseSlot.qty != 0 && 
      (warehouseSlot.id == 'BLA_B1' 
      || warehouseSlot.id == 'BLA_B2' 
      || warehouseSlot.id == 'BLA_B3' 
      || warehouseSlot.id == 'BLA_B4')) {
      switch (warehouseSlot.id) {
        case 'BLA_B1': narcotixQty.common    = warehouseSlot.qty; break;
        case 'BLA_B2': narcotixQty.uncommon  = warehouseSlot.qty; break;
        case 'BLA_B3': narcotixQty.rare      = warehouseSlot.qty; break;
        case 'BLA_B4': narcotixQty.legendary = warehouseSlot.qty; break;
        default:
          break;
      }
      narcotixCategoryTotal += getRessourceObjById(warehouseSlot.id).ask * warehouseSlot.qty; 
      narcotixBlocsStr += `${getWarehouseSlotBlocDom(warehouseSlot, isSellable, true)}`;
    }
  }

  let narcotixQtyStr = '';
  if (narcotixQty.common != 0) { narcotixQtyStr += `<span class="qty-bloc common">${narcotixQty.common}</span>`; }
  if (narcotixQty.uncommon != 0) { narcotixQtyStr += `<span class="qty-bloc uncommon">${narcotixQty.uncommon}</span>`; }
  if (narcotixQty.rare != 0) { narcotixQtyStr += `<span class="qty-bloc rare">${narcotixQty.rare}</span>`; }
  if (narcotixQty.legendary != 0) { narcotixQtyStr += `<span class="qty-bloc legendary">${narcotixQty.legendary}</span>`; }

  str += `
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Narcotix</span>
        ${narcotixQtyStr == '' ? '' : `<div class="qty-line">${narcotixQtyStr}</div>`}
      </div>
      <span class="spaced-text">
        <span> </span>
        <span class="txt-primary">${CURRENT_PHASE !== 4 ? '********** CRD' : `${getCommaFormatedString(narcotixCategoryTotal)} CRD`}</span>
      </span>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div class="warehouse-list">
            ${narcotixBlocsStr}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // ARTEFACTS
  let artefactBlocsStr = '';
  let artefactQty = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  }
  let artefactCategoryTotal = 0;
  for (const warehouseSlot of WAREHOUSE) {
    if (warehouseSlot.qty != 0 && 
      (warehouseSlot.id == 'BLA_C1' 
      || warehouseSlot.id == 'BLA_C2' 
      || warehouseSlot.id == 'BLA_C3' 
      || warehouseSlot.id == 'BLA_C4')) {
      switch (warehouseSlot.id) {
        case 'BLA_C1': artefactQty.common    = warehouseSlot.qty; break;
        case 'BLA_C2': artefactQty.uncommon  = warehouseSlot.qty; break;
        case 'BLA_C3': artefactQty.rare      = warehouseSlot.qty; break;
        case 'BLA_C4': artefactQty.legendary = warehouseSlot.qty; break;
        default:
          break;
      }
      artefactCategoryTotal += getRessourceObjById(warehouseSlot.id).ask * warehouseSlot.qty; 
      artefactBlocsStr += `${getWarehouseSlotBlocDom(warehouseSlot, isSellable, true)}`;
    }
  }

  let artefactQtyStr = '';
  if (artefactQty.common != 0) { artefactQtyStr += `<span class="qty-bloc common">${artefactQty.common}</span>`; }
  if (artefactQty.uncommon != 0) { artefactQtyStr += `<span class="qty-bloc uncommon">${artefactQty.uncommon}</span>`; }
  if (artefactQty.rare != 0) { artefactQtyStr += `<span class="qty-bloc rare">${artefactQty.rare}</span>`; }
  if (artefactQty.legendary != 0) { artefactQtyStr += `<span class="qty-bloc legendary">${artefactQty.legendary}</span>`; }

  str += `
  <div class="lzr-drawer lzr-solid lzr-margin-bottom">
    <div class="tile-header">
      <div class="title-bloc">
        <span class="header-title">Artefacts</span>
        ${artefactQtyStr == '' ? '' : `<div class="qty-line">${artefactQtyStr}</div>`}
      </div>
      <span class="spaced-text">
        <span> </span>
        <span class="txt-primary">${CURRENT_PHASE !== 4 ? '********** CRD' : `${getCommaFormatedString(artefactCategoryTotal)} CRD`}</span>
      </span>
      <div class="tile-caret">
      ${getSvgIcon('chevron-right', 'm', null)}
      </div>
      <input type="checkbox">
    </div>
    <div class="expandable-wrapper">
      <div class="expandable-inner">
        <div class="inner-body">
          <div class="warehouse-list">
            ${artefactBlocsStr}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  return str;
}

function onWarehouseSlotBlocClick(ressourceId) {
  //console.log(ressourceId);
  let ressource = getRessourceObjById(ressourceId);
  let ressourceDesc = '';
  let ressourceTemp = OFFICIAL_RESSOURCES_DESCRIPTIONS.find((descObj) => descObj.id == ressourceId);
  if (ressourceTemp != null) {
    ressourceDesc = ressourceTemp.desc
  } else {
    ressourceDesc = BLACK_RESSOURCES_DESCRIPTIONS.find((descObj) => descObj.id == ressourceId).desc;
  }
  let warehouseSlot = WAREHOUSE.find((slot) => slot.id == ressourceId);

  let descStr = `<ul>`;
  for (let descListItem of ressourceDesc) {
    descStr += `<li>${descListItem}</li>`
  }
  descStr += `</ul>`;

  let popUp = document.getElementById('popUp');
  document.getElementById('popUpRessourceTitle').innerHTML = `Vente`;
  document.getElementById('popUpRessourceName').innerHTML = `<span>${ressource.category} <span class="rarity-text ${ressource.rarity}">${ressource.rarity}</span>`;
  document.getElementById('popUpRessourceAsk').innerHTML = `<span>ASK:</span><span class="txt-primary">${getCommaFormatedString(ressource.ask)} CRD</span>`;
  document.getElementById('popUpBody').innerHTML = `
    <div class="ressource-image ${ressource.category} ${ressource.rarity}"></div>
    <p>${descStr}</p>
    <button id="popUpRessourceDisplay" class="lzr-button lzr-solid lzr-primary" style="margin-top: auto;" onclick="onSellRessourceClick('${ressource.id}', 'one')">Vendre 1 pour<br>${getCommaFormatedString(ressource.ask)} CRD</button>
    ${warehouseSlot.qty != 1 ? `<button id="popUpRessourceDisplay" class="lzr-button lzr-solid lzr-primary" onclick="onSellRessourceClick('${ressource.id}', 'all')">Vendre tout pour<br>${getCommaFormatedString(ressource.ask * warehouseSlot.qty)} CRD</button>` : ''}
  `;

  popUp.classList.remove('hidden');
}
window.onWarehouseSlotBlocClick = onWarehouseSlotBlocClick;

function onSellRessourceClick(ressourceId, type) {
  let ressource = getRessourceObjById(ressourceId);
  let warehouseSlot = WAREHOUSE.find((slot) => slot.id == ressourceId);

  let amount = 0;
  let soldQty = 0;

  switch (type) {
    case 'one':
      amount = ressource.ask;
      soldQty = 1;
      warehouseSlot.qty -= 1;
      break;
  case 'all':
      amount = Number((ressource.ask * warehouseSlot.qty));
      soldQty = warehouseSlot.qty;
      warehouseSlot.qty = 0;
      break;
    default:
      break;
  }
  ressource.current_cycle_sold_units = soldQty;

  updateOfficialRessourcesMarket(CURRENT_OFFICIAL_RESSOURCES_MARKET);
  const container = document.getElementById('officialSellableList');
  container.innerHTML = `${getWarehouseOfficialSlotsListDom(true)}`;

  updateBlackRessourcesMarket(CURRENT_BLACK_RESSOURCES_MARKET);
  const container2 = document.getElementById('blackSellableList');
  container2.innerHTML = `${getWarehouseBlackSlotsListDom(true)}`;

  updateWarehouse(WAREHOUSE);
  updateWarehouseDom();

  updateTotalBalance('add', amount);
  updateTotalBalanceDom();

  let popUp = document.getElementById('popUp');
  popUp.classList.add('hidden');
}
window.onSellRessourceClick = onSellRessourceClick;

export const updateWarehouseDom = () => {
  const officialContainer = document.getElementById('officialWarehouseList');
  officialContainer.innerHTML = `${getWarehouseOfficialSlotsListDom()}`;
  const blackContainer = document.getElementById('blackWarehouseList');
  blackContainer.innerHTML = `${getWarehouseBlackSlotsListDom()}`;

  let totalValue = 0;
  let totalItems = 0;
  for (let slot of WAREHOUSE) {
    let ressource = getRessourceObjById(slot.id);
    //console.log(ressource);
    totalValue += ressource.ask * slot.qty;
    totalItems += 1 * slot.qty;
  }
  document.getElementById('warehouseCount').innerHTML = `${totalItems}`;
  document.getElementById('totalWarehouseValue').innerHTML = `${getCommaFormatedString(totalValue)} CRD`;
  //document.getElementById('warehouseCountCard').innerHTML = `${totalItems}`;
  document.getElementById('totalWarehouseValueCard').innerHTML = `${getCommaFormatedString(totalValue)} CRD`;

  if (document.getElementById('warehouseCount2') != null) {
    document.getElementById('warehouseCount2').innerHTML = `${totalItems}`;
    document.getElementById('totalWarehouseValue2').innerHTML = `${getCommaFormatedString(totalValue)} CRD`;
  }
}



// INITIALIZATION /////////////////////////////////////////////////////////////////////////////////

logAppInfos(APP_NAME, APP_VERSION);
setHTMLTitle(APP_NAME);
setStorage();

function setGlobalValuesFromStorage() {
  let user = getUser();
  // Current cycle
  CURRENT_CYCLE = user.CURRENT_CYCLE;
  CURRENT_PHASE = user.CURRENT_PHASE;
  CYCLES_BEFORE_GAME_OVER = user.CYCLES_BEFORE_GAME_OVER;
  IS_BANKRUPTCY = user.IS_BANKRUPTCY;
  CURRENT_PHASE_SPENDINGS = user.CURRENT_PHASE_SPENDINGS;
  CURRENT_PHASE_EARNINGS = user.CURRENT_PHASE_EARNINGS;
  WAREHOUSE = user.WAREHOUSE;
  // Total balance
  TOTAL_BALANCE = user.TOTAL_BALANCE;
  // Crews
  updateMyCrews(user.MY_CREWS);
  updateRecruitableCrews(user.RECRUITABLE_CREWS);
  updateCrewId(user.CURRENT_CREW_ID);
  // Missions
  updateOfficialAvailableMissions(user.OFFICIAL_AVAILABLE_MISSIONS);
  updateOfficialCurrentMissions(user.OFFICIAL_CURRENT_MISSIONS);
  updateOfficialReputation(user.OFFICIAL_REPUTATION);
  updateOfficialMissionId(user.CURRENT_OFFICIAL_MISSION_ID);
  
  updateBlackAvailableMissions(user.BLACK_AVAILABLE_MISSIONS);
  updateBlackCurrentMissions(user.BLACK_CURRENT_MISSIONS);
  updateBlackReputation(user.BLACK_REPUTATION);
  updateBlackMissionId(user.CURRENT_BLACK_MISSION_ID);
  // Ressouces
  updateOfficialRessourcesMarket(user.CURRENT_OFFICIAL_RESSOURCES_MARKET);
  updateBlackRessourcesMarket(user.CURRENT_BLACK_RESSOURCES_MARKET);
  // Infrastructures
  updateUserInfrastructures(user.USER_INFRASTRUCTURES);

  document.getElementsByClassName('lzr')[0].style = `--theme: '${user.UI_THEME}';`;
}

// EXECUTION //////////////////////////////////////////////////////////////////////////////////////
setGlobalValuesFromStorage();

// BEFORE START
HEADER.innerHTML = `
  <div class="menu">
    <button class="lzr-button lzr-outlined" onclick="onOpenGhostPageButtonClick('myCrewsContainer')">Équipages</button>
    <button class="lzr-button lzr-outlined" onclick="onOpenGhostPageButtonClick('warehouseContainer')">Entrepôt</button>
    <button class="lzr-button lzr-outlined" onclick="onOpenGhostPageButtonClick('pricesCentralContainer')">Marchés</button>
    <button class="lzr-button lzr-solid lzr-primary" onclick="onOpenGhostPageButtonClick('systemContainer')">Système</button>
  </div>
  <div class="infos">
    <span >Cycle <span id="currentPhaseDisplay">${CURRENT_CYCLE}</span></span>
    <span class="spaced-text">
      <span>Balance totale</span>
      <span id="totalBalance" class="txt-primary">${getCommaFormatedString(TOTAL_BALANCE)} CRD</span>
    </span>
  </div>
`;
MAIN.innerHTML += `
  <h1 id="pageTitle">coucou</h1>
  <div id="mainContainer"></div>
`;
FOOTER.innerHTML = `
  <button class="next-phase-button lzr-button lzr-solid lzr-primary" onclick="onNextPhaseButtonClick()">Phase suivante</button>
`;

document.getElementById('systemDisplay').innerHTML = getSystemDom();
document.getElementById('helpDisplay').innerHTML = getHelpDom();
document.getElementById('storageDisplay').innerHTML = getStorageDom();



let user = getUser();
if (user.MY_CREWS.length == 0) {
  user.MY_CREWS = setStartingCrews();
  setUser(user);
}

renderPhase(CURRENT_PHASE);
updateAllDom();

function updateAllDom() {
  updateMyCrewDom();
  updateWarehouseDom();
  updateReputationDom();
  updateCurrentPhaseDom();
  updateMarketDom();
  updateTotalBalanceDom();
  updatePassiveRevenuDom();
  updateFlairDom();
  updateCompletedMissionsDom();
}