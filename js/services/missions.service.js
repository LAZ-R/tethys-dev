import { BLACK_MISSIONS_TYPES, OFFICIAL_MISSIONS_TYPES } from "../data/missionTypes.data.js";
import { onOpenGhostPageButtonClick } from "../main.js";
import { getFilterStringForHslString } from "../utils/factory/filter.js";
import { getCommaFormatedString, getRandomIntegerBetween } from "../utils/math.utils.js";
import { MY_CREWS, updateAvailableCrewDom } from "./crews.service.js";
import { setEventForCurrentMission } from "./event.service.js";
import { BLACK_REPUTATION_FOR_RARE, BLACK_REPUTATION_FOR_UNCOMMON, OFFICIAL_REPUTATION_FOR_RARE, OFFICIAL_REPUTATION_FOR_UNCOMMON, REPUTATION_CAP } from "./global.service.js";
import { addRessourceIdToBagByWeight, CURRENT_BLACK_RESSOURCES_MARKET, CURRENT_OFFICIAL_RESSOURCES_MARKET, getRessourceObjById } from "./ressources.service.js";
import { getUser, setUser } from "./storage.service..js";

export const updateCompletedMissions = (newValue) => {
  let user = getUser();
  user.COMPLETED_MISSIONS = newValue;
  setUser(user);
}
export const updateCompletedMissionsDom = () => {
  let user = getUser();
  document.getElementById('completedMissionsCard').innerHTML = `${user.COMPLETED_MISSIONS}`;
}


export let OFFICIAL_AVAILABLE_MISSIONS = [];
export const updateOfficialAvailableMissions = (newMissions) => {
  let user = getUser();
  OFFICIAL_AVAILABLE_MISSIONS = newMissions;
  user.OFFICIAL_AVAILABLE_MISSIONS = OFFICIAL_AVAILABLE_MISSIONS;
  setUser(user);
}
export let OFFICIAL_CURRENT_MISSIONS = [];
export const updateOfficialCurrentMissions = (allCurrentMissions) => {
  let user = getUser();
  OFFICIAL_CURRENT_MISSIONS = allCurrentMissions;
  user.OFFICIAL_CURRENT_MISSIONS = OFFICIAL_CURRENT_MISSIONS;
  setUser(user);
}
export const setNewOfficialCurrentMissions = () => {
  let filteredArray = OFFICIAL_AVAILABLE_MISSIONS.filter((mission) => mission.assigned_crew_id !== null);
  for (let newMission of filteredArray) {
    newMission.status = 'pending';
    OFFICIAL_CURRENT_MISSIONS.push(newMission);
  }
}

export let OFFICIAL_REPUTATION = 0;
export const updateOfficialReputation = (newValue) => {
  let user = getUser();
  if (newValue > REPUTATION_CAP) {
    newValue = REPUTATION_CAP;
  }
  if (newValue < 0) {
    newValue = 0;
  }
  OFFICIAL_REPUTATION = newValue;
  user.OFFICIAL_REPUTATION = OFFICIAL_REPUTATION;
  setUser(user);
}
export const updateOfficialReputationDom = () => {
  document.getElementById('officialReputation').innerHTML = `${OFFICIAL_REPUTATION}`;
  document.getElementById('officialReputationCard').innerHTML = `${OFFICIAL_REPUTATION}`;
  document.getElementById('officialBar').style = `--width-percentage: ${(OFFICIAL_REPUTATION / REPUTATION_CAP) * 100}%;`;
}
let CURRENT_OFFICIAL_MISSION_ID = 1;
export const updateOfficialMissionId = (newId) => {
  let user = getUser();
  CURRENT_OFFICIAL_MISSION_ID = newId;
  user.CURRENT_OFFICIAL_MISSION_ID = CURRENT_OFFICIAL_MISSION_ID;
  setUser(user);
}

// BLACK ===================================

export let BLACK_AVAILABLE_MISSIONS = [];
export const updateBlackAvailableMissions = (newMissions) => {
  let user = getUser();
  BLACK_AVAILABLE_MISSIONS = newMissions;
  user.BLACK_AVAILABLE_MISSIONS = BLACK_AVAILABLE_MISSIONS;
  setUser(user);
}
export let BLACK_CURRENT_MISSIONS = [];
export const updateBlackCurrentMissions = (allCurrentMissions) => {
  let user = getUser();
  BLACK_CURRENT_MISSIONS = allCurrentMissions;
  user.BLACK_CURRENT_MISSIONS = BLACK_CURRENT_MISSIONS;
  setUser(user);
}
export const setNewBlackCurrentMissions = () => {
  let filteredArray = BLACK_AVAILABLE_MISSIONS.filter((mission) => mission.assigned_crew_id !== null);
  for (let newMission of filteredArray) {
    newMission.status = 'pending';
    BLACK_CURRENT_MISSIONS.push(newMission);
  }
}

export let BLACK_REPUTATION = 0;
export const updateBlackReputation = (newValue) => {
  let user = getUser();
  if (newValue > REPUTATION_CAP) {
    newValue = REPUTATION_CAP;
  }
  if (newValue < 0) {
    newValue = 0;
  }
  BLACK_REPUTATION = newValue;
  user.BLACK_REPUTATION = BLACK_REPUTATION;
  setUser(user);
}
export const updateBlackReputationDom = () => {
  document.getElementById('blackReputation').innerHTML = `${BLACK_REPUTATION}`;
  document.getElementById('blackReputationCard').innerHTML = `${BLACK_REPUTATION}`;
  document.getElementById('blackBar').style = `--width-percentage: ${(BLACK_REPUTATION / REPUTATION_CAP) * 100}%;`;

}
let CURRENT_BLACK_MISSION_ID = 1;
export const updateBlackMissionId = (newId) => {
  let user = getUser();
  CURRENT_BLACK_MISSION_ID = newId;
  user.CURRENT_BLACK_MISSION_ID = CURRENT_BLACK_MISSION_ID;
  setUser(user);
}


export function updateReputationDom() {
  updateOfficialReputationDom();
  updateBlackReputationDom();
}



export let selectedMission = null;









export const getAvailableMissionBlocDom = (mission) => {
  let ressource = getRessourceObjById(mission.mission_type.id);

  let str = `<div id="${mission.id}" onclick="onAvailableMissionClick('${mission.id}')" class="mission-bloc new-mission ${mission.assigned_crew_id !== null ? 'assigned' : ''}">`;
  str += `
    <div class="mission-sub-bloc new-mission">
      <div class="ressource-image ${ressource.category} ${ressource.rarity}" style="--size: 50px;"></div>
      <div>
        <!-- <span class="title">${mission.mission_type.market}</span> -->
        <!-- <span>${mission.mission_type.id}</span> -->
        <span class="spaced-text">
          <!-- <span>Besoin:</span> -->
          <span>${mission.mission_type.category}</span>
        </span>
        <span class="rarity-text ${mission.mission_type.rarity}">${mission.mission_type.rarity}</span>
        <span class="spaced-text">
          <!-- <span>Durée:</span> -->
          <span>${mission.mission_type.cycles} cycle${mission.mission_type.cycles == 1 ? '' : 's'}</span>
        </span>
        <!-- <span class="spaced-text">
          <span>Assignée:</span>
          <span>${mission.assigned_crew_id == null ? 'non' : 'oui'}</span>
        </span> -->
      </div>
    </div>`;
  str += '</div>';

  return str;
}

export const getAvailableOfficialMissionsBlocsDom = () => {
  let str = '<div class="mission-bloc-container new-mission">';
  for (const mission of OFFICIAL_AVAILABLE_MISSIONS) {
    str += `${getAvailableMissionBlocDom(mission)}`;
  }
  str += '</div>';

  return str;
}

export const getAvailableBlackMissionsBlocsDom = () => {
  let str = '<div class="mission-bloc-container new-mission">';
  for (const mission of BLACK_AVAILABLE_MISSIONS) {
    str += `${getAvailableMissionBlocDom(mission)}`;
  }
  str += '</div>';

  return str;
}

function onAvailableMissionClick(missionId) {
  selectedMission = missionId;
  updateAvailableCrewDom();
  onOpenGhostPageButtonClick('availableCrewsContainer')
}
window.onAvailableMissionClick = onAvailableMissionClick;

export const updateAvailableOfficialMissionsDom = () => {
  const container = document.getElementById('availableOfficialMissionsContainer');
  container.innerHTML = `${getAvailableOfficialMissionsBlocsDom()}`;
}

export const updateAvailableBlackMissionsDom = () => {
  const container = document.getElementById('availableBlackMissionsContainer');
  container.innerHTML = `${getAvailableBlackMissionsBlocsDom()}`;
}

export const generateCurrentCycleOfficialAvailableMissions = () => {
  let missionIdBag = [];
  const rarities = ['Commun', 'Inhabituel', 'Rare'];

  for (let ressource of CURRENT_OFFICIAL_RESSOURCES_MARKET) {
    if (ressource.id != 'OFF_A4' && ressource.id != 'OFF_B4' && ressource.id != 'OFF_C4') { // Pas de missions légendaires
      if (OFFICIAL_REPUTATION < OFFICIAL_REPUTATION_FOR_UNCOMMON) {
        if (ressource.id == 'OFF_A1' || ressource.id == 'OFF_B1' || ressource.id == 'OFF_C1') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
      } else if (OFFICIAL_REPUTATION < OFFICIAL_REPUTATION_FOR_RARE) {
        if  (ressource.id != 'OFF_A3' && ressource.id != 'OFF_B3' && ressource.id != 'OFF_C3') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
      } else {
        if (ressource.id == 'OFF_A3' || ressource.id == 'OFF_B3' || ressource.id == 'OFF_C3') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
        if (ressource.id == 'OFF_A2' || ressource.id == 'OFF_B2' || ressource.id == 'OFF_C2') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
        addRessourceIdToBagByWeight(ressource, missionIdBag);
      }
    }
  };
  
  let officialMissionsCount = Math.round(OFFICIAL_REPUTATION * 10 / 100) + getRandomIntegerBetween(0, 2);
  if (officialMissionsCount < 3) {officialMissionsCount = 3}

  for (let index = 0; index < officialMissionsCount; index++) {
    let randomId = missionIdBag[getRandomIntegerBetween(0, missionIdBag.length - 1)];
    let missionType = OFFICIAL_MISSIONS_TYPES.find((missionType) => { return missionType.id == randomId});
    let missionObject = {
      id: `officialMission${CURRENT_OFFICIAL_MISSION_ID}`,
      status: 'available', // 'available' || 'running' || 'finished',
      mission_type : { ... missionType },
      assigned_crew_id: null,
      event: null,
    }
    OFFICIAL_AVAILABLE_MISSIONS.push(missionObject);
    CURRENT_OFFICIAL_MISSION_ID += 1;
  }
  OFFICIAL_AVAILABLE_MISSIONS.sort((a, b) => { return rarities.indexOf(b.mission_type.rarity) - rarities.indexOf(a.mission_type.rarity) });
  updateOfficialAvailableMissions(OFFICIAL_AVAILABLE_MISSIONS);
  updateOfficialMissionId(CURRENT_OFFICIAL_MISSION_ID);
}

export const generateCurrentCycleBlackAvailableMissions = () => {
  let missionIdBag = [];
  const rarities = ['Commun', 'Inhabituel', 'Rare'];

  for (let ressource of CURRENT_BLACK_RESSOURCES_MARKET) {
    if (ressource.id != 'BLA_A4' && ressource.id != 'BLA_B4' && ressource.id != 'BLA_C4') { // Pas de missions légendaires
      if (BLACK_REPUTATION < BLACK_REPUTATION_FOR_UNCOMMON) {
        if (ressource.id == 'BLA_A1' || ressource.id == 'BLA_B1' || ressource.id == 'BLA_C1') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
      } else if (BLACK_REPUTATION < BLACK_REPUTATION_FOR_RARE) {
        if  (ressource.id != 'BLA_A3' && ressource.id != 'BLA_B3' && ressource.id != 'BLA_C3') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
      } else {
        if (ressource.id == 'BLA_A3' || ressource.id == 'BLA_B3' || ressource.id == 'BLA_C3') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
        if (ressource.id == 'BLA_A2' || ressource.id == 'BLA_B2' || ressource.id == 'BLA_C2') {
          addRessourceIdToBagByWeight(ressource, missionIdBag);
        }
        addRessourceIdToBagByWeight(ressource, missionIdBag);
      }
    }
  };
  
  let blackMissionsCount = Math.round(BLACK_REPUTATION * 10 / 100) + getRandomIntegerBetween(0, 2);
  if (blackMissionsCount < 3) {blackMissionsCount = 3}

  for (let index = 0; index < blackMissionsCount; index++) {
    let randomId = missionIdBag[getRandomIntegerBetween(0, missionIdBag.length - 1)];
    let missionType = BLACK_MISSIONS_TYPES.find((missionType) => { return missionType.id == randomId});
    let missionObject = {
      id: `blackMission${CURRENT_BLACK_MISSION_ID}`,
      status: 'available', // 'available' || 'running' || 'finished',
      mission_type : { ... missionType },
      assigned_crew_id: null,
      event: null,
    }
    BLACK_AVAILABLE_MISSIONS.push(missionObject);
    CURRENT_BLACK_MISSION_ID += 1;
  }
  BLACK_AVAILABLE_MISSIONS.sort((a, b) => { return rarities.indexOf(b.mission_type.rarity) - rarities.indexOf(a.mission_type.rarity) });
  updateBlackAvailableMissions(BLACK_AVAILABLE_MISSIONS);
  updateBlackMissionId(CURRENT_BLACK_MISSION_ID);
}



export const getReturnedMissionBlocDom = (mission) => {
  let crew = MY_CREWS.find((crew) => crew.id == mission.assigned_crew_id);
  let spaceshipGains = 0;
  crew.spaceship.slots.sort((a, b) => {
    // Cas null → toujours en premier
    if (a.ressource_id === null && b.ressource_id !== null) return -1;
    if (b.ressource_id === null && a.ressource_id !== null) return 1;
    if (a.ressource_id === null && b.ressource_id === null) return 0;

    // Extraction des parties lettres et chiffres
    const [lettersA, numA] = a.ressource_id.match(/([A-Z_]+)(\d+)/).slice(1);
    const [lettersB, numB] = b.ressource_id.match(/([A-Z_]+)(\d+)/).slice(1);

    // Tri d'abord par nombre (rareté)
    const diffNum = parseInt(numA, 10) - parseInt(numB, 10);
    if (diffNum !== 0) return diffNum;

    // Puis par lettres (catégorie)
    return lettersA.localeCompare(lettersB);
  });

  let cargoStr = '<div class="available-slots-container">';
  for (const slot of crew.spaceship.slots) {
    if (slot.ressource_id !== null) {
      spaceshipGains += getRessourceObjById(slot.ressource_id).bid;
    }
    let ressource = getRessourceObjById(slot.ressource_id) ;
    cargoStr += `
      <span class="${ressource == null ? 'available-slot-icon' : `full-slot-icon ${ressource.rarity}`}">
        ${ressource == null ? `${crew.spaceship.slots.indexOf(slot) + 1}` : `<div class="ressource-image ${ressource.category} ${ressource.rarity}" style="--size: 90%;"></div>`}
      </span>
    `;
  }
  cargoStr += '</div>';

  let str = `<div id="${mission.id}" onclick="onReturnedMissionClick('${mission.id}')" class="mission-bloc returned">`;
  str += `
    <div class="mission-sub-bloc">
      <!-- <span class="title">Marché ${mission.mission_type.market}</span> -->
      <span class="spaced-text">
        <!-- <span>Besoin:</span> -->
        <span>${mission.mission_type.category} <span class="rarity-text ${mission.mission_type.rarity}">${mission.mission_type.rarity}</span></span>
      </span>

      <div class="mini-header">
        <div class="spaceship-img-container" style="filter: ${getFilterStringForHslString(crew.spaceship.main_color)}; background-image: url('./medias/images/${crew.spaceship.imgFolder}/${crew.spaceship.imgFolder}${crew.spaceship.imgId}.png');"></div>
        <span 
          style="color: ${crew.spaceship.main_color}; 
          line-height: 16px; 
          font-family: '${'consolas'/* crew.spaceship.font */}';
          text-transform: uppercase;
          ${crew.spaceship.font === "nhl" ? 'text-transform: uppercase;' : ''}">
          ${crew.spaceship.name}
        </span>
      </div>

      ${cargoStr}
      
      <span class="spaced-text">
        <span>${mission.mission_type.market == 'Officiel' ? 'BID' : mission.mission_type.market == 'Noir' ? 'Appraisal' : ''} de la cargaison:</span>
        <span class="txt-primary">${getCommaFormatedString(spaceshipGains.toFixed(2))} CRD</span>
      </span>
    </div>`;
  str += '</div>';

  return str;
}

export const getReturnedOfficialMissionsBlocsDom = () => {
  let filteredArray = OFFICIAL_CURRENT_MISSIONS.filter((mission) => mission.status == 'finished');
  let str = '<div class="mission-bloc-container">';
  for (const mission of filteredArray) {
    str += `${getReturnedMissionBlocDom(mission)}`;
  }
  str += '</div>';

  return str;
}

export const getReturnedBlackMissionsBlocsDom = () => {
  let filteredArray = BLACK_CURRENT_MISSIONS.filter((mission) => mission.status == 'finished');
  let str = '<div class="mission-bloc-container">';
  for (const mission of filteredArray) {
    str += `${getReturnedMissionBlocDom(mission)}`;
  }
  str += '</div>';

  return str;
}

function onReturnedMissionClick(missionId) {
  //selectedMission = missionId;
  //updateReturnedCrewDom();
  //onOpenGhostPageButtonClick('availableCrewsContainer')
}
window.onReturnedMissionClick = onReturnedMissionClick;

export const updateReturnedOfficialMissionsDom = () => {
  const container = document.getElementById('returnedOfficialMissions');
  container.innerHTML = `${getReturnedOfficialMissionsBlocsDom()}`;
}

export const updateReturnedBlackMissionsDom = () => {
  const container = document.getElementById('returnedBlackMissions');
  container.innerHTML = `${getReturnedBlackMissionsBlocsDom()}`;
}

export function distributeOfficialMissionsEvents() {
  // distribute
  //console.log(OFFICIAL_CURRENT_MISSIONS);
  for (let mission of OFFICIAL_CURRENT_MISSIONS) {
    //console.log(mission);
    if (mission.mission_type.cycles == 1) {
      setEventForCurrentMission(mission);
    }
  }
}

export function distributeBlackMissionsEvents() {
  // distribute
  //console.log(OFFICIAL_CURRENT_MISSIONS);
  for (let mission of BLACK_CURRENT_MISSIONS) {
    //console.log(mission);
    if (mission.mission_type.cycles == 1) {
      setEventForCurrentMission(mission);
    }
  }
}