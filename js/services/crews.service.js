import { ADJECTIVES, FONTS, NOUNS, SYLLABES, TEXT_All } from "../data/crews.data.js";
import { BLACK_RESSOURCES, OFFICIAL_RESSOURCES } from "../data/ressources.data.js";
import { CURRENT_PHASE_SPENDINGS, onCloseGhostPageButtonClick, TOTAL_BALANCE, updateCurrentPhaseSpendings, updateCurrentPhaseSpendingsDom, updateTotalBalance, updateTotalBalanceDom } from "../main.js";
import { getFilterStringForHslString } from "../utils/factory/filter.js";
import { getCommaFormatedString, getRandomIntegerBetween } from "../utils/math.utils.js";
import { BLACK_REPUTATION_FOR_LEGENDARY, BLACK_REPUTATION_FOR_RARE, BLACK_REPUTATION_FOR_UNCOMMON, IDLE_PRICE_BY_SLOT, MISSION_PRICE_BY_SLOT, OFFICIAL_REPUTATION_FOR_LEGENDARY, OFFICIAL_REPUTATION_FOR_RARE, OFFICIAL_REPUTATION_FOR_UNCOMMON } from "./global.service.js";
import { BLACK_AVAILABLE_MISSIONS, BLACK_REPUTATION, OFFICIAL_AVAILABLE_MISSIONS, OFFICIAL_CURRENT_MISSIONS, OFFICIAL_REPUTATION, selectedMission, updateAvailableBlackMissionsDom, updateAvailableOfficialMissionsDom, updateBlackAvailableMissions, updateOfficialAvailableMissions } from "./missions.service.js";
import { getRessourceObjById } from "./ressources.service.js";
import { getUser, setUser } from "./storage.service..js";

export let MY_CREWS = [];
export const updateMyCrews = (newCrews) => {
  let user = getUser();
  MY_CREWS = newCrews;
  user.MY_CREWS = MY_CREWS;
  setUser(user);
}
export let RECRUITABLE_CREWS = [];
export const updateRecruitableCrews = (newCrews) => {
  let user = getUser();
  RECRUITABLE_CREWS = newCrews;
  user.RECRUITABLE_CREWS = RECRUITABLE_CREWS;
  setUser(user);
}
export let CURRENT_CREW_ID = 1;
export const updateCrewId = (newId) => {
  let user = getUser();
  CURRENT_CREW_ID = newId;
  user.CURRENT_CREW_ID = CURRENT_CREW_ID;
  setUser(user);
}

// SPACESHIP //////////////////////////////////////////////////////////////////
export const getRandomSpaceshipName = () => {
  const adjective = ADJECTIVES[getRandomIntegerBetween(0, ADJECTIVES.length - 1)];
  const noun = NOUNS[getRandomIntegerBetween(0, NOUNS.length - 1)];
  return `${adjective} ${noun}`;
}

export const getRandomSpaceship = (slotsCount = 2) => {
  const img2Slots = ['01', '02', '03', '04', '05', '06', '07', '08'];
  const img3Slots = ['01', '02', '03', '04', '05', '06', '07', '08'];
  const img4Slots = ['01', '02', '03', '04', '05', '06'];
  const img5Slots = ['01', '02', '03', '04'];
  const img6Slots = ['01', '02', '03'];

  let imgFolder = '';
  let imgId = '';

  switch (slotsCount) {
    case 2:
      imgId = img2Slots[getRandomIntegerBetween(0, img2Slots.length - 1)];
      imgFolder = 'small';
      break;
    case 3:
      imgId = img3Slots[getRandomIntegerBetween(0, img3Slots.length - 1)];
      imgFolder = 'medium';
      break;
    case 4:
      imgId = img4Slots[getRandomIntegerBetween(0, img4Slots.length - 1)];
      imgFolder = 'big';
      break;
    case 5:
      imgId = img5Slots[getRandomIntegerBetween(0, img5Slots.length - 1)];
      imgFolder = 'huge';
      break;
    case 6:
      imgId = img6Slots[getRandomIntegerBetween(0, img6Slots.length - 1)];
      imgFolder = 'giant';
      break;
    default:
      break;
  }

  const slots = [];
  for (let index = 0; index < slotsCount; index++) {
    const element = { ressource_id: null, };
    slots.push(element);
  }

  return {
    name: getRandomSpaceshipName(),
    imgId: imgId,
    imgFolder: imgFolder,
    font: FONTS[getRandomIntegerBetween(0, FONTS.length - 1)],
    main_color: `hsl(${getRandomIntegerBetween(0, 360)}deg, ${getRandomIntegerBetween(20, 80)}%, 66%)`,
    slots_count: slotsCount,
    slots: slots,
  }
}

// CREW ///////////////////////////////////////////////////////////////////////

export const getRandomFirstName = () => {
  const nameLength = getRandomIntegerBetween(2, 3);
  let str = '';
  for (let index = 0; index < nameLength; index++) {
    if (index == 0 || index == nameLength - 1) {
      str += SYLLABES[getRandomIntegerBetween(0, SYLLABES.length - 1)];
    } else {
      str += TEXT_All[getRandomIntegerBetween(0, TEXT_All.length - 1)];
    }
  }
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

export function getCrewRecruitingCost(crew) {

    let bonusObj = getRessourceObjById(crew.bonus);
    let malusObj = getRessourceObjById(crew.malus);
  
    let multiplicator = 1;
    if (malusObj != null) {
      switch (malusObj.rarity) {
        case 'Commun': multiplicator -= .2; break;
        case 'Inhabituek': multiplicator -= .4; break;
        case 'Rare': multiplicator -= .6; break;
        case 'Légendaire': multiplicator -= .8; break;
        default: break;
      }
    }
    if (bonusObj != null) {
      switch (bonusObj.rarity) {
        case 'Commun': multiplicator += .2; break;
        case 'Inhabituek': multiplicator += .4; break;
        case 'Rare': multiplicator += .6; break;
        case 'Légendaire': multiplicator += .8; break;
        default: break;
      }
    }
    const cost = 1000 * Math.pow(crew.spaceship.slots_count, 2) * Math.pow(multiplicator, 2);
    return cost;
  }

export const getRandomCrew = (crewCount = 3) => {
  const slotCounts = crewCount + 1;

  const captain = {
    name: getRandomFirstName(),
    img: '',
  }

  const otherMembers = [];
  for (let index = 0; index < crewCount - 1; index++) {
    const crewMember = {
      name: getRandomFirstName(),
      img: '',
    };
    otherMembers.push(crewMember);
  }

  // Bonus / malus

  // Bonus
  let idOnlyArray = [];
  for (const ressource of OFFICIAL_RESSOURCES) {
    if (OFFICIAL_REPUTATION < OFFICIAL_REPUTATION_FOR_UNCOMMON) {
      if (ressource.id == 'OFF_A1' 
        || ressource.id == 'OFF_B1'
        || ressource.id == 'OFF_C1') {
        idOnlyArray.push(ressource.id);
      }
    } else if (OFFICIAL_REPUTATION < OFFICIAL_REPUTATION_FOR_RARE) {
      if (ressource.id == 'OFF_A1' 
        || ressource.id == 'OFF_A2' 
        || ressource.id == 'OFF_B1' 
        || ressource.id == 'OFF_B2' 
        || ressource.id == 'OFF_C1'
        || ressource.id == 'OFF_C2') {
        idOnlyArray.push(ressource.id);
      }
    } else if (OFFICIAL_REPUTATION < OFFICIAL_REPUTATION_FOR_LEGENDARY) {
      if (ressource.id != 'OFF_A1' 
        && ressource.id != 'OFF_A4' 
        && ressource.id != 'OFF_B1' 
        && ressource.id != 'OFF_B4' 
        && ressource.id != 'OFF_C1' 
        && ressource.id != 'OFF_C4') {
        idOnlyArray.push(ressource.id);
      }
    } else {
        if (ressource.id != 'OFF_A1' 
        && ressource.id != 'OFF_A2' 
        && ressource.id != 'OFF_B1' 
        && ressource.id != 'OFF_B2' 
        && ressource.id != 'OFF_C1' 
        && ressource.id != 'OFF_C2') {
        idOnlyArray.push(ressource.id);
      }
    }
  }

  for (const ressource of BLACK_RESSOURCES) {
    if (BLACK_REPUTATION < BLACK_REPUTATION_FOR_UNCOMMON) {
      if (ressource.id == 'BLA_A1' 
        || ressource.id == 'BLA_B1'
        || ressource.id == 'BLA_C1') {
        idOnlyArray.push(ressource.id);
      }
    } else if (BLACK_REPUTATION < BLACK_REPUTATION_FOR_RARE) {
      if (ressource.id == 'BLA_A1' 
        || ressource.id == 'BLA_A2' 
        || ressource.id == 'BLA_B1' 
        || ressource.id == 'BLA_B2' 
        || ressource.id == 'BLA_C1'
        || ressource.id == 'BLA_C2') {
        idOnlyArray.push(ressource.id);
      }
    } else if (BLACK_REPUTATION < BLACK_REPUTATION_FOR_LEGENDARY) {
      if (ressource.id != 'BLA_A1' 
        && ressource.id != 'BLA_A4' 
        && ressource.id != 'BLA_B1' 
        && ressource.id != 'BLA_B4' 
        && ressource.id != 'BLA_C1' 
        && ressource.id != 'BLA_C4') {
        idOnlyArray.push(ressource.id);
      }
    } else {
        if (ressource.id != 'BLA_A1' 
        && ressource.id != 'BLA_A2' 
        && ressource.id != 'BLA_B1' 
        && ressource.id != 'BLA_B2' 
        && ressource.id != 'BLA_C1' 
        && ressource.id != 'BLA_C2') {
        idOnlyArray.push(ressource.id);
      }
    }
  }

  let rndBonusId = idOnlyArray[getRandomIntegerBetween(0, idOnlyArray.length - 1)];
  idOnlyArray.splice(idOnlyArray.indexOf(rndBonusId), 1);
  // malus
  let rndMalusId = idOnlyArray[getRandomIntegerBetween(0, idOnlyArray.length - 1)];

  let crewObject = {
    id: `crew${CURRENT_CREW_ID}`,
    crew_count: crewCount,
    captain: captain,
    other_members: otherMembers,
    bonus: getRandomIntegerBetween(0, 100) <= 75 ? rndBonusId : null,
    malus:  getRandomIntegerBetween(0, 100) <= 33 ? rndMalusId : null,
    spaceship: getRandomSpaceship(slotCounts),
    recruiting_cost: 5000,
    assigned: null,
    hasBeenGivenLoot: false,
    missions_before_rest: slotCounts + 1,
    is_resting: false,
  }

  crewObject.recruiting_cost = getCrewRecruitingCost(crewObject);

  CURRENT_CREW_ID += 1;
  updateCrewId(CURRENT_CREW_ID);

  return crewObject;
}

// MY CREWS

export function onRecruitebleCrewClick(crewId) {
  const crew = getRecruitableCrewByCrewId(crewId);
  
  let popUp = document.getElementById('popUp');
  document.getElementById('popUpRessourceTitle').innerHTML = `Recrutement`;
  document.getElementById('popUpRessourceName').innerHTML = `<span>${crew.spaceship.name}</span>`;
  document.getElementById('popUpRessourceAsk').innerHTML = `<span>Slots:</span><span class="txt-primary">${crew.spaceship.slots_count}</span>`;
  document.getElementById('popUpBody').innerHTML = `
    ${getCrewBlocDom(crew)}
    <button class="lzr-button lzr-solid lzr-primary" style="margin-top: auto;" onclick="onRecruitClick('${crewId}')">Recruter pour<br>${getCommaFormatedString(crew.recruiting_cost)} CRD</button>
  `;

  popUp.classList.remove('hidden');
}
window.onRecruitebleCrewClick = onRecruitebleCrewClick;

export function onRecruitClick(crewId) {
  const crew = getRecruitableCrewByCrewId(crewId);

  updateTotalBalance('sub', crew.recruiting_cost);
  updateTotalBalanceDom();

  MY_CREWS.push(crew);
  updateMyCrews(MY_CREWS);
  updateMyCrewDom();

  const index = RECRUITABLE_CREWS.indexOf(crew);
  RECRUITABLE_CREWS.splice(index, 1);
  if (RECRUITABLE_CREWS.length == 0) {
    RECRUITABLE_CREWS.push('empty');
  }
  updateRecruitableCrews(RECRUITABLE_CREWS);
  if (RECRUITABLE_CREWS[0] !== 'empty') {
    document.getElementById('recruitableCrewsContainer').innerHTML = getCrewBlocsDom(RECRUITABLE_CREWS, 'recruit');
  } else {
    document.getElementById('recruitableCrewsContainer').innerHTML = `<span>Aucun équipage recrutable ce cycle</span>`;
  }



  let popUp = document.getElementById('popUp');
  popUp.classList.add('hidden');
}
window.onRecruitClick = onRecruitClick;

export function onSellableCrewClick(crewId) {
  const crew = getCrewByCrewId(crewId);
  
  let popUp = document.getElementById('popUp');
  document.getElementById('popUpRessourceTitle').innerHTML = `Résilier contrat`;
  document.getElementById('popUpRessourceName').innerHTML = `<span>${crew.spaceship.name}</span>`;
  document.getElementById('popUpRessourceAsk').innerHTML = `<span>Slots:</span><span class="txt-primary">${crew.spaceship.slots_count}</span>`;
  document.getElementById('popUpBody').innerHTML = `
    ${getCrewBlocDom(crew)}
    <button class="lzr-button lzr-solid lzr-primary" style="margin-top: auto;" onclick="onSellClick('${crewId}')">Rompre le contrat pour<br>${getCommaFormatedString(crew.recruiting_cost)} CRD</button>
  `;

  popUp.classList.remove('hidden');
}
window.onSellableCrewClick = onSellableCrewClick;

export function onSellClick(crewId) {
  const crew = getCrewByCrewId(crewId);

  updateTotalBalance('sub', crew.recruiting_cost);
  updateTotalBalanceDom();

  MY_CREWS.splice(MY_CREWS.indexOf(crew), 1);
  updateMyCrews(MY_CREWS);
  updateMyCrewDom();


  let popUp = document.getElementById('popUp');
  popUp.classList.add('hidden');
}
window.onSellClick = onSellClick;

export const getCrewBlocDom = (crew, action = '') => {
  let bonusObj = getRessourceObjById(crew.bonus);
  let malusObj = getRessourceObjById(crew.malus);

  let isSellable = !crew.is_resting && crew.assigned == null;

  let isTooExpensive = crew.recruiting_cost > TOTAL_BALANCE;

  let str = `
    <div 
      id="${crew.id}" 
      style="border: 1px ${action == 'recruit' ? 'dashed' : 'solid'} ${crew.spaceship.main_color};" 
      class="crew-bloc ${crew.assigned != null ? 'assigned' : ''} ${crew.is_resting == true ? 'rest' : ''} ${action == 'recruit' && isTooExpensive ? `unafordable` : ''}" 
      ${action == 'recruit' && !isTooExpensive ? `onclick="onRecruitebleCrewClick('${crew.id}')"` : ''}>
  `;
  let crewMembersStr = '';
  /* crewMembersStr += `<ul>
    <li><span class="badge capt">Capt.</span>${crew.captain.name}</li>`; */
  /* let index = 1;
  for (const member of crew.other_members) {
    index ++;
    crewMembersStr += `<li><span class="badge">n°${index}</span>${member.name}</li>`;
  } */
  crewMembersStr += `</ul>`;

  let cargoStr = '<div class="available-slots-container">';
  for (let slot of crew.spaceship.slots) {
    let ressource = getRessourceObjById(slot.ressource_id) ;
    cargoStr += `
      <span class="${ressource == null ? 'available-slot-icon' : `full-slot-icon ${ressource.rarity}`}">
        ${ressource == null ? `${crew.spaceship.slots.indexOf(slot) + 1}` : `<div class="ressource-image ${ressource.category} ${ressource.rarity}" style="--size: 90%;"></div>`}
      </span>
    `;
  }
  cargoStr += '</div>';
  
  str += `
  <div class="spaceship-sub-bloc">
    <span 
      style="margin: 0 auto 0 auto; 
      color: ${crew.spaceship.main_color}; 
      line-height: 16px; 
      font-family: '${'consolas'/* crew.spaceship.font */}'; 
      text-transform: uppercase;
      ${crew.spaceship.font === "nhl" ? 'text-transform: uppercase;' : ''}">
      ${crew.spaceship.name}
    </span>
    <div class="spaceship-img-container" style="filter: ${getFilterStringForHslString(crew.spaceship.main_color)}; background-image: url('./medias/images/${crew.spaceship.imgFolder}/${crew.spaceship.imgFolder}${crew.spaceship.imgId}.png');"></div>
    <span class="slots-label">Slots</span>
    ${cargoStr}
    <hr>
    <!-- ${crewMembersStr} -->
    <span class="spaced-text">
      <span>Bonus:</span>
      <span>${crew.bonus == null ? 'Aucun' : `${bonusObj.category} <span class="rarity-text ${bonusObj.rarity}">${bonusObj.rarity}</span>`}</span>
    </span>
    <span class="spaced-text">
      <span>Malus:</span>
      <span>${crew.malus == null ? 'Aucun' : `${malusObj.category} <span class="rarity-text ${malusObj.rarity}">${malusObj.rarity}</span>`}</span>
    </span>
    <hr>
    <span class="spaced-text">
      <span>Coût par mission par cycle:</span>
      <span>${MISSION_PRICE_BY_SLOT * crew.spaceship.slots_count} CRD</span>
    </span>
    <span class="spaced-text">
      <span>Coût d'amarrage par cycle:</span>
      <span>${IDLE_PRICE_BY_SLOT * crew.spaceship.slots_count} CRD</span>
    </span>
    <!-- <span class="spaced-text">
      <span>Assigné:</span>
      <span>${crew.assigned == null ? 'non' : 'oui'}</span>
    </span> -->
    ${action == 'recruit' ? `
      <hr>
      <span class="spaced-text">
        <span>Coût de recrutement:</span>
        <span>${getCommaFormatedString(crew.recruiting_cost)} CRD</span>
      </span>
      ` : `
      <hr>
      <span class="spaced-text">
        <span>Missions avant repos:</span>
        <span>${crew.missions_before_rest}</span>
      </span>
      ${isSellable && action == 'sell' ? `<hr><button onclick="onSellableCrewClick('${crew.id}')" class="lzr-button lzr-outlined" style="margin: 0 auto;">Résilier le contrat</button>` : ''}
      `
    }
  </div>`;
  
  str += '</div>';

  return str;
}

export const getCrewBlocsDom = (crewBlocs, action) => {
  let str = '<div class="crew-bloc-container">';
  for (const crew of crewBlocs) {
    str += `${getCrewBlocDom(crew, action)}`;
  }
  str += '</div>';

  return str;
}

export const updateMyCrewDom = () => {
  let user = getUser();
  document.getElementById('myCrewsDisplay').innerHTML = getCrewBlocsDom(MY_CREWS, 'sell');
  document.getElementById('restingShipsContainer').innerHTML = `${user.MY_CREWS.filter((crew) => crew.is_resting).length}/${user.MY_CREWS.length}`;
  document.getElementById('assignedShipsContainer').innerHTML = `${user.MY_CREWS.filter((crew) => crew.assigned != null).length}/${user.MY_CREWS.length}`;
  document.getElementById('crewsCountCard').innerHTML = `${user.MY_CREWS.length} équipages`;
}

// AVAILABLE (PHASE 1)

export const getAvailableCrewBlocDom = (crew) => {
  let bonusObj = getRessourceObjById(crew.bonus);
  let malusObj = getRessourceObjById(crew.malus);
  let str = `<div
    id="${crew.id}"
    style="border: 1px dashed ${crew.spaceship.main_color};"
    class="crew-bloc ${crew.assigned != null ? 'assigned' : ''} ${crew.is_resting == true ? 'rest' : ''} ${crew.assigned == selectedMission ? 'current' : ''}" 
    ${crew.is_resting == false ? `onclick="onAvailableCrewBlocClick('${crew.id}')"` : ''}>`;
  let crewMembersStr = '';
  /* crewMembersStr += `<ul>
    <li><span class="badge capt">Capt.</span>${crew.captain.name}</li>`;
  let index = 1;
  for (const member of crew.other_members) {
    index ++;
    crewMembersStr += `<li><span class="badge">n°${index}</span>${member.name}</li>`;
  }
  crewMembersStr += `</ul>`; */

  let cargoStr = '<div class="available-slots-container">';
  for (let index = 0; index < crew.spaceship.slots.length; index++) {
    let slot = crew.spaceship.slots[index];
    let ressource = slot.ressource;
    cargoStr += `
    <span class="${ressource == null ? 'available-slot-icon' : `full-slot-icon ${ressource.rarity}`}">
      ${ressource == null ? `${crew.spaceship.slots.indexOf(slot) + 1}` : `<div class="ressource-image ${ressource.category} ${ressource.rarity}" style="--size: 90%;"></div>`}
    </span>
    `;
  }
  cargoStr += '</div>';
  
  str += `
  <div class="spaceship-sub-bloc">
    <div class="mini-header">
      <div class="spaceship-img-container" style="filter: ${getFilterStringForHslString(crew.spaceship.main_color)}; background-image: url('./medias/images/${crew.spaceship.imgFolder}/${crew.spaceship.imgFolder}${crew.spaceship.imgId}.png');"></div>
      <span 
        style="color: ${crew.spaceship.main_color}; 
        line-height: 16px; 
        font-family: '${'consolas'/* crew.spaceship.font */}'; 
        ${crew.spaceship.font === "nhl" ? 'text-transform: uppercase;' : ''}">
        ${crew.spaceship.name}
      </span>
    </div>
    <hr>
    <span class="slots-label">Slots</span>
    ${cargoStr}
    <hr>
    <!-- ${crewMembersStr} -->
    <span class="spaced-text">
      <span>Bonus:</span>
      <span>${crew.bonus == null ? 'Aucun' : `${bonusObj.category} <span class="rarity-text ${bonusObj.rarity}">${bonusObj.rarity}</span>`}</span>
    </span>
    <span class="spaced-text">
      <span>Malus:</span>
      <span>${crew.malus == null ? 'Aucun' : `${malusObj.category} <span class="rarity-text ${malusObj.rarity}">${malusObj.rarity}</span>`}</span>
    </span>
    <hr>
    <span class="spaced-text">
      <span>Coût par mission par cycle:</span>
      <span>${MISSION_PRICE_BY_SLOT * crew.spaceship.slots_count} CRD</span>
    </span>
    <span class="spaced-text">
      <span>Coût d'amarrage par cycle:</span>
      <span>${IDLE_PRICE_BY_SLOT * crew.spaceship.slots_count} CRD</span>
    </span>
    <!-- <hr>
    <span class="spaced-text">
      <span>Assigné:</span>
      <span>${crew.assigned == null ? 'non' : 'oui'}</span>
    </span> -->
    <hr>
    <span class="spaced-text">
      <span>Missions avant repos:</span>
      <span>${crew.missions_before_rest}</span>
    </span>
  </div>`;
  str += '</div>';

  return str;
}

export const getAvailableCrewBlocsDom = () => {
  let str = '<div class="crew-bloc-container">';
  for (const crew of MY_CREWS) {
    str += `${getAvailableCrewBlocDom(crew)}`;
  }
  str += '</div>';

  return str;
}

function onAvailableCrewBlocClick(crewId) {
  //console.log(crewId);
  //console.log(selectedMission);
  let crew = MY_CREWS.find((crew) => { return crew.id == crewId });

  if (crew.assigned == null || crew.assigned == selectedMission) {
    let mission = OFFICIAL_AVAILABLE_MISSIONS.find((mission) => { return mission.id == selectedMission });
    if (mission == undefined) {
      mission = BLACK_AVAILABLE_MISSIONS.find((mission) => { return mission.id == selectedMission });
    }
    if (mission.assigned_crew_id != null) {
      if (mission.assigned_crew_id == crewId) {
        // Retirer assignation
        crew.assigned = null;
        mission.assigned_crew_id = null;
        updateCurrentPhaseSpendings('sub', (MISSION_PRICE_BY_SLOT * crew.spaceship.slots_count * mission.mission_type.cycles));
        updateCurrentPhaseSpendings('add', (IDLE_PRICE_BY_SLOT * crew.spaceship.slots_count));
      } else {
        // Changer assignation
        let previousCrew = MY_CREWS.find((crew) => { return crew.id == mission.assigned_crew_id });
        previousCrew.assigned = null;
        updateCurrentPhaseSpendings('sub', (MISSION_PRICE_BY_SLOT * previousCrew.spaceship.slots_count * mission.mission_type.cycles));
        updateCurrentPhaseSpendings('add', (IDLE_PRICE_BY_SLOT * previousCrew.spaceship.slots_count));
        mission.assigned_crew_id = crewId;
        crew.assigned = mission.id;
        updateCurrentPhaseSpendings('add', (MISSION_PRICE_BY_SLOT * crew.spaceship.slots_count * mission.mission_type.cycles));
        updateCurrentPhaseSpendings('sub', (IDLE_PRICE_BY_SLOT * crew.spaceship.slots_count));
      }
    } else {
      // Ajouter assignation
      mission.assigned_crew_id = crewId;
      crew.assigned = mission.id;
      updateCurrentPhaseSpendings('add', (MISSION_PRICE_BY_SLOT * crew.spaceship.slots_count * mission.mission_type.cycles));
      updateCurrentPhaseSpendings('sub', (IDLE_PRICE_BY_SLOT * crew.spaceship.slots_count));
    }
    updateMyCrews(MY_CREWS);
    updateMyCrewDom();
    updateAvailableCrewDom();
    updateOfficialAvailableMissions(OFFICIAL_AVAILABLE_MISSIONS);
    updateAvailableOfficialMissionsDom();
    updateBlackAvailableMissions(BLACK_AVAILABLE_MISSIONS);
    updateAvailableBlackMissionsDom();
    onCloseGhostPageButtonClick('availableCrewsContainer');
    updateCurrentPhaseSpendingsDom();
  }
}
window.onAvailableCrewBlocClick = onAvailableCrewBlocClick;

export const updateAvailableCrewDom = () => {
  document.getElementById('availableCrewsDisplay').innerHTML = getAvailableCrewBlocsDom();
}

export const setStartingCrews = () => {
  let crew1obj = {
    id: `crew1`,
    crew_count: 1,
    bonus: 'OFF_C1',
    malus:  null,
    spaceship: {
      name: "Patience", // 'Endurance' - Interstellar
      imgId: "02",
      imgFolder: "small",
      main_color: `hsl(${getRandomIntegerBetween(105, 150)}deg, ${getRandomIntegerBetween(20, 80)}%, 66%)`,
      slots_count: 2,
      slots: [{ressource_id: null}, {ressource_id: null}],
    },
    recruiting_cost: 5000,
    assigned: null,
    hasBeenGivenLoot: false,
    missions_before_rest: 3,
    is_resting: false,
  }
  crew1obj.recruiting_cost = getCrewRecruitingCost(crew1obj);
  MY_CREWS.push(crew1obj);

  let crew2obj = {
    id: `crew2`,
    crew_count: 1,
    bonus: 'BLA_C1',
    malus:  null,
    spaceship: {
      name: "Undetectable Hand", // 'Invisible hand' - Star Wars Episode III
      imgId: "01",
      imgFolder: "small",
      main_color: `hsl(${getRandomIntegerBetween(180, 240)}deg, ${getRandomIntegerBetween(20, 80)}%, 66%)`,
      slots_count: 2,
      slots: [{ressource_id: null}, {ressource_id: null}],
    },
    recruiting_cost: 5000,
    assigned: null,
    hasBeenGivenLoot: false,
    missions_before_rest: 3,
    is_resting: false,
  }
  crew2obj.recruiting_cost = getCrewRecruitingCost(crew2obj);
  MY_CREWS.push(crew2obj);

  let crew3obj = {
    id: `crew3`,
    crew_count: 2,
    bonus: null,
    malus:  null,
    spaceship: {
      name: "Postulate", // 'Axiom' - Wall-e
      imgId: "05",
      imgFolder: "medium",
      main_color: `hsl(${getRandomIntegerBetween(270, 320)}deg, ${getRandomIntegerBetween(20, 80)}%, 66%)`,
      slots_count: 3,
      slots: [{ressource_id: null}, {ressource_id: null}, {ressource_id: null}],
    },
    recruiting_cost: 5000,
    assigned: null,
    hasBeenGivenLoot: false,
    missions_before_rest: 4,
    is_resting: false,
  }
  crew3obj.recruiting_cost = getCrewRecruitingCost(crew3obj);
  MY_CREWS.push(crew3obj);
  return MY_CREWS;
}

export function getCrewByCrewId(crewId) {
  if (crewId == null) return null;
  for (let crew of MY_CREWS) {
    if (crew.id == crewId) {
      return crew;
    }
  }
  return null;
}

export function getRecruitableCrewByCrewId(crewId) {
  if (crewId == null) return null;
  for (let crew of RECRUITABLE_CREWS) {
    if (crew.id == crewId) {
      return crew;
    }
  }
  return null;
}

export function setLootForCrew(crew, mission) {
  let missionType = mission.mission_type;

  // multiplicateurs fixes
  const BONUS_MULT = 1.2;
  const MALUS_MULT = 0.8;

  // tirage pondéré simple (sur tableau de poids)
  function weightedPickIndex(weights){
    let total = 0; for (const w of weights) total += w || 0;
    if (total <= 0) return -1;
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++){
      r -= (weights[i] || 0);
      if (r <= 0) return i;
    }
    return weights.length - 1;
  }

  /**
   * Tire un id de ressource selon les probas du mission_type,
   * en appliquant le bonus/malus du crew (ids alignés).
   */
  function drawResourceId(missionType, crew){
    // 1) récupérer les paires {id, p}
    const pairs = [];
    for (const [k, v] of Object.entries(missionType)){
      if (!k.endsWith('_loot_percentage')) continue;
      const id = k.slice(0, -'_loot_percentage'.length); // ex: "OFF_A1"
      const p  = Number(v) || 0;
      if (p > 0) pairs.push({ id, p });
    }
    if (pairs.length === 0) return missionType.id ?? null;

    // 2) bonus/malus multiplicatifs fixes
    const b = crew?.bonus || null;
    const m = crew?.malus || null;
    for (const x of pairs){
      if (b && x.id === b) x.p *= BONUS_MULT;
      if (m && x.id === m) x.p *= MALUS_MULT;
    }

    // 3) tirage pondéré (normalisation implicite)
    const weights = pairs.map(x => x.p);
    const idx = weightedPickIndex(weights);
    return idx >= 0 ? pairs[idx].id : (missionType.id ?? null);
  }

  let hasLootedBonus = false;
  for (let slot of crew.spaceship.slots) {
    slot.ressource_id = drawResourceId(missionType, crew);
    if (slot.ressource_id == crew.bonus) {
      hasLootedBonus = true;
    }
    if (slot.ressource_id == crew.malus) {
      let percentage = getRandomIntegerBetween(0, 100);
      if (percentage < 25) {
        slot.ressource_id = null;
      }
    }
  }

  if (hasLootedBonus == false && crew.bonus !== null) {
    let bonusRessource = getRessourceObjById(crew.bonus);
    if (missionType.category == bonusRessource.category) {
      if (missionType.rarity == bonusRessource.rarity) {
        crew.spaceship.slots[getRandomIntegerBetween(0, crew.spaceship.slots.length - 1)].ressource_id = crew.bonus;
      } else {
        let percentage = getRandomIntegerBetween(0, 100);
        if (percentage <= 75) {
          crew.spaceship.slots[getRandomIntegerBetween(0, crew.spaceship.slots.length - 1)].ressource_id = crew.bonus;
        }
      }
    }
  }

  // GESTION EVENT
  if (mission.event !== null) {
    let rarityIndex = 5;
    let baseRessource = mission.mission_type.id;
    let upgradedRessource = '';
    switch (mission.mission_type.id[rarityIndex]) {
      case '1': upgradedRessource = baseRessource.substring(0, rarityIndex) + '2' + baseRessource.substring(rarityIndex + 1); break;
      case '2': upgradedRessource = baseRessource.substring(0, rarityIndex) + '3' + baseRessource.substring(rarityIndex + 1); break;
      case '3': upgradedRessource = baseRessource.substring(0, rarityIndex) + '4' + baseRessource.substring(rarityIndex + 1); break;
      default: break;
    }

    switch (mission.event.eventId) {
      // NEGATIF ----------------------------------------------------------------------------------
      case 'loseOneSlot':
        crew.spaceship.slots[getRandomIntegerBetween(0, crew.spaceship.slots.length - 1)].ressource_id = null;
        break;
      case 'loseAllSlots':
        for (let slot of crew.spaceship.slots) {
          slot.ressource_id = null;
        }
        break;
      case 'addOneCycle':
        mission.mission_type.cycles += 1;
        break;
      case 'restNow':
        crew.missions_before_rest = 1;
        break;
      // POSITIF ----------------------------------------------------------------------------------
      case 'upgradeOneSlot':
        crew.spaceship.slots[getRandomIntegerBetween(0, crew.spaceship.slots.length - 1)].ressource_id = upgradedRessource;
        break;
      case 'addOneUntilRest':
        crew.missions_before_rest += 1;
        break;
      case 'upgradeAllSlots':
        for (let slot of crew.spaceship.slots) {
          slot.ressource_id = upgradedRessource;
        }
        break;
      default:
        break;
    }
    mission.event = null;
  }

}