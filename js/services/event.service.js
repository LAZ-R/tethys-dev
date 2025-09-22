import { COME_BACK_LINE, EVENTS } from "../data/events.data.js";
import { getRandomIntegerBetween } from "../utils/math.utils.js";
import { getCrewByCrewId } from "./crews.service.js";
import { BLACK_CURRENT_MISSIONS, OFFICIAL_CURRENT_MISSIONS } from "./missions.service.js";


export function setEventForCurrentMission(currentMission) {
  let bag = [];
  for (let event of EVENTS) {
    for (let index = 0; index < event.weight; index++) {
      bag.push(event);
    }
  }
  let randomEvent = bag[getRandomIntegerBetween(0, bag.length - 1)];
  let randomDesc = randomEvent.desc[getRandomIntegerBetween(0, randomEvent.desc.length - 1)];

  let percentage = getRandomIntegerBetween(0, 100);

  if (percentage < 40) {
    currentMission.event = {eventId: randomEvent.id, eventDesc: randomDesc};
  }
}

export function getEventDom(mission) {
  let eventGameplayStr = '';
  switch (mission.event.eventId) {
    // NEGATIF ------------------------------------------------------------------------------------
    case 'loseOneSlot':
      eventGameplayStr = '<span class="spaced-text negative"><span>Slots</span><span>-1</span></span>';
      break;
    case 'loseAllSlots':
      eventGameplayStr = '<span class="spaced-text negative"><span>Slots</span><span>Perte totale</span></span>';
      break;
    case 'addOneCycle':
      eventGameplayStr = '<span class="spaced-text negative"><span>Cycle</span><span>+1</span></span>';
      break;
    case 'restNow':
      eventGameplayStr = '<span class="spaced-text negative"><span>Missions avant repos:</span><span>0</span></span>';
      break;
    // POSITIF ------------------------------------------------------------------------------------
    case 'upgradeOneSlot':
      eventGameplayStr = '<span class="spaced-text positive"><span>Slot upgrade</span><span>1</span></span>';
      break;
    case 'addOneUntilRest':
        eventGameplayStr = '<span class="spaced-text positive"><span>Missions avant repos:</span><span>+1</span></span>';
        break;
    case 'upgradeAllSlots':
      eventGameplayStr = '<span class="spaced-text positive"><span>Slot upgrade</span><span>Tous</span></span>';
      break;
    default:
      break;
    }
  let crew = getCrewByCrewId(mission.assigned_crew_id);
  return `
  <div class="event-bloc">
    <span style="color: ${crew.spaceship.main_color};">${crew.spaceship.name}</span>
    <span class="spaced-text">
      <span>Mission:</span>
      <span>${mission.mission_type.category} <span class="rarity-text ${mission.mission_type.rarity}">${mission.mission_type.rarity}</span></span>
    </span>
    <hr>
    <span>Nouveau message:</span>
    <span class="crt">
      ${mission.event.eventDesc}
      ${mission.event.eventId == 'addOneCycle' ? '' : `
      <br>
      ${COME_BACK_LINE[getRandomIntegerBetween(0, COME_BACK_LINE.length - 1)]}
      `}
      <hr>
      ${eventGameplayStr}
    </span>
  </div>
  `;
}

export function getNonEventDom(mission, isReturning = false) {
  let crew = getCrewByCrewId(mission.assigned_crew_id);
  return `
  <div class="event-bloc">
    <span style="color: ${crew.spaceship.main_color};">${crew.spaceship.name}</span>
    <span class="spaced-text">
      <span>Mission:</span>
      <span>${mission.mission_type.category} <span class="rarity-text ${mission.mission_type.rarity}">${mission.mission_type.rarity}</span></span>
    </span>
    <hr>
    <span>Nouveau message:</span>
    <span class="crt">
      R.A.S.${isReturning ? `<br>${COME_BACK_LINE[getRandomIntegerBetween(0, COME_BACK_LINE.length - 1)]}` : ''}
    </span>
  </div>
  `;
}

export function getEventsDom() {
  let str = ``;
  for (let mission of OFFICIAL_CURRENT_MISSIONS) {
    if (mission.mission_type.cycles == 1 && mission.event != null) {
      str += `${getEventDom(mission)}`;
    } else if (mission.mission_type.cycles == 1 && mission.event == null) {
      str += `${getNonEventDom(mission, true)}`;
    } else {
      str += `${getNonEventDom(mission)}`;
    }
  }
  for (let mission of BLACK_CURRENT_MISSIONS) {
    if (mission.mission_type.cycles == 1 && mission.event != null) {
      str += `${getEventDom(mission)}`;
    } else if (mission.mission_type.cycles == 1 && mission.event == null) {
      str += `${getNonEventDom(mission, true)}`;
    } else {
      str += `${getNonEventDom(mission)}`;
    }
  }
  if (str == '') {
    str = `<span>Aucun équipage déployé</span>`;
  }
  return str;
}