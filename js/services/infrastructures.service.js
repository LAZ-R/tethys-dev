import { INFRASTRUCTURES } from "../data/infrastructures.data.js";
import { TOTAL_BALANCE, updateTotalBalance, updateTotalBalanceDom } from "../main.js";
import { getCommaFormatedString } from "../utils/math.utils.js";
import { MY_CREWS } from "./crews.service.js";
import { BLACK_REPUTATION, OFFICIAL_REPUTATION } from "./missions.service.js";
import { getUser, setUser } from "./storage.service..js";

export let USER_INFRASTRUCTURES = [];
export function updateUserInfrastructures(infrastructures) {
  USER_INFRASTRUCTURES = infrastructures;
  let user = getUser();
  user.USER_INFRASTRUCTURES = USER_INFRASTRUCTURES;
  setUser(user);
}

export function isInfrastructureAvailable(infraId) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  let isBalanceOK = TOTAL_BALANCE >= baseInfra.cost;
  let crewLengthIsOK = MY_CREWS.length >= baseInfra.min_crew;
  let reputationIsOK = false;

  if (baseInfra.id.includes('TC')) {
    reputationIsOK = OFFICIAL_REPUTATION + BLACK_REPUTATION >= baseInfra.min_off_rep;
  } else if (baseInfra.id.includes('OFF')) {
    reputationIsOK = OFFICIAL_REPUTATION >= baseInfra.min_off_rep;
  } else if (baseInfra.id.includes('BLA')) {
    reputationIsOK = BLACK_REPUTATION >= baseInfra.min_bla_rep;
  }

  return {
    isBalanceOK,
    crewLengthIsOK,
    reputationIsOK,
  };
}

export function isInfrastructureUpdatable(infraId) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  return TOTAL_BALANCE >= baseInfra.cost / 2;
}

export function isInfrastructureHidden(infraId) {
  if (infraId == 'AS_TC_01') {
    return false;
  }
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  let user = getUser();
  if (user.USER_INFRASTRUCTURES.find((userInfra) => userInfra.id == baseInfra.require) != null) {
    return false;
  }
  return true;
}

export function getInfrastructureDom(infraId, isPassive = false) {
  let isInfraBought = false;
  let infra = USER_INFRASTRUCTURES.find((infra) => infra.id == infraId);
  if (infra != null) {
    isInfraBought = true;
  } else {
    infra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  }

  if (isInfraBought) {
    return getBoughtInfrastructureDom(infra, isPassive);
  } else {
    return getUnboughtInfrastructureDom(infra, isPassive);
  }
}

export function getUnboughtInfrastructureDom(infrastructure) {
  let user = getUser();
  let investPath = '';
  if (infrastructure.id.includes('TC')) {
    investPath = 'TC';
  } else if (infrastructure.id.includes('OFF')) {
    investPath = 'OFF';
  } else if (infrastructure.id.includes('BLA')) {
    investPath = 'BLA';
  }

  let isAvailable = isInfrastructureAvailable(infrastructure.id);
  let isHidden = isInfrastructureHidden(infrastructure.id);

  return `
  <div class="infra-bloc ${isAvailable.isBalanceOK ? '' : 'unavailable too-expensive'} ${isAvailable.crewLengthIsOK ? '' : 'unavailable no-crew'} ${isAvailable.reputationIsOK ? '' : 'unavailable no-rep'} ${isHidden ? 'hidden' : ''}">
    <span class="txt-primary label">${infrastructure.label}</span>
    <span>${infrastructure.desc}</span>
    <hr>
    <span class="category-label">Prérequis</span>
    <span class="spaced-text">
      <span>Équipages requis</span>
      <span class="txt-primary crew-txt">${MY_CREWS.length}/${infrastructure.min_crew}</span>
    </span>
    <span class="spaced-text">
      <span>Réputation ${investPath == 'TC' ? '(totale)' : investPath == 'OFF' ? 'officielle' : 'noire'} requise</span>
      <span class="txt-primary rep-txt">${investPath == 'TC' ? OFFICIAL_REPUTATION + BLACK_REPUTATION : investPath == 'OFF' ? OFFICIAL_REPUTATION : BLACK_REPUTATION}/${investPath == 'TC' ? infrastructure.min_off_rep : investPath == 'OFF' ? infrastructure.min_off_rep : infrastructure.min_bla_rep}</span>
    </span>
    <hr>
    <span class="category-label">Récompenses</span>
    <span class="spaced-text">
      <span>Revenu passif</span>
      <span class="txt-primary">${getCommaFormatedString(infrastructure.passive_revenu)} CRD</span>
    </span>

    ${infrastructure.flair == null ? `
      <span>+ Amélioration possible</span>
      ` : `
      <span>+ Titre honorifique cosmétique</span>
    `}
    <hr>
    <span class="spaced-text">
      <span>Cout</span>
      <span class="txt-primary cost-txt">${getCommaFormatedString(infrastructure.cost)} CRD</span>
    </span>

    ${isAvailable.isBalanceOK && isAvailable.crewLengthIsOK && isAvailable.reputationIsOK ? `<button onclick="onInvestableInfrastructureClick('${infrastructure.id}')" class="lzr-button lzr-outlined lzr-primary">Investir</button>` : ''}
  </div>
  `;
}

export function onInvestableInfrastructureClick(infraId) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  let investPath = '';
  if (baseInfra.id.includes('TC')) {
    investPath = 'TC';
  } else if (baseInfra.id.includes('OFF')) {
    investPath = 'OFF';
  } else if (baseInfra.id.includes('BLA')) {
    investPath = 'BLA';
  }

  let popUp = document.getElementById('popUp');
  document.getElementById('popUpRessourceTitle').innerHTML = `Investir`;
  document.getElementById('popUpRessourceName').innerHTML = ``;
  document.getElementById('popUpRessourceAsk').innerHTML = ``;
  document.getElementById('popUpBody').innerHTML = `
    <div class="infra-bloc">
      <span class="txt-primary label">${baseInfra.label}</span>
      <span>${baseInfra.desc}</span>
      <hr>
      <span class="category-label">Prérequis</span>
      <span class="spaced-text">
        <span>Équipages requis</span>
        <span class="txt-primary">${baseInfra.min_crew}</span>
      </span>
      <span class="spaced-text">
        <span>Réputation ${investPath == 'TC' ? '(indifférent)' : investPath == 'OFF' ? 'Officielle' : 'Noire'} requise</span>
        <span class="txt-primary">${baseInfra.id.includes('4') ? '' : '≥ '}${investPath == 'TC' ? baseInfra.min_off_rep : investPath == 'OFF' ? baseInfra.min_off_rep : baseInfra.min_bla_rep}</span>
      </span>

      <hr>
      <span class="category-label">Récompenses</span>
      <span class="spaced-text">
        <span>Revenu passif</span>
        <span class="txt-primary">${getCommaFormatedString(baseInfra.passive_revenu)} CRD</span>
      </span>

      ${baseInfra.flair == null ? `
        <span>+ Amélioration possible</span>
        ` : `
        <span>+ Titre honorifique cosmétique</span>
      `}

    </div>

    <button 
      class="lzr-button lzr-solid lzr-primary" 
      style="margin-top: auto;" 
      onclick="onInvestClick('${infraId}')">Investir pour<br>${getCommaFormatedString(baseInfra.cost)} CRD</button>
  `;

  popUp.classList.remove('hidden');
}
window.onInvestableInfrastructureClick = onInvestableInfrastructureClick;

export function onInvestClick(infraId) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  if (baseInfra.flair != null) {
    let user = getUser();
    user.CURRENT_FLAIR = baseInfra.flair;
    setUser(user);
  }
  let obj = getStorageInfrastructureObjById(infraId);
  USER_INFRASTRUCTURES.push(obj);
  updateUserInfrastructures(USER_INFRASTRUCTURES);
  document.getElementById('investmentsContainer').innerHTML = getInvestmentsDom();
  updateTotalBalance('sub', baseInfra.cost);
  updateTotalBalanceDom();
  updatePassiveRevenuDom();
  updateFlairDom();
  
  let popUp = document.getElementById('popUp');
  popUp.classList.add('hidden');
}
window.onInvestClick = onInvestClick;

// BOUGHT

export function getBoughtInfrastructureDom(infrastructure, isPassive = false) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infrastructure.id);
  console.log(baseInfra);
  let investPath = '';
  if (infrastructure.id.includes('TC')) {
    investPath = 'TC';
  } else if (infrastructure.id.includes('OFF')) {
    investPath = 'OFF';
  } else if (infrastructure.id.includes('BLA')) {
    investPath = 'BLA';
  }
  return `
  <div class="infra-bloc bought ${infrastructure.is_updated ? 'updated' : ''}">
    <span class="txt-primary label">${baseInfra.label}</span>
    <!-- <span>${baseInfra.desc}</span> -->
    <span class="spaced-text">
      <span>Revenu passif</span>
      <span class="txt-primary">${getCommaFormatedString(infrastructure.passive_revenu)} CRD</span>
    </span>

    ${!infrastructure.is_updated && !isPassive ? `
      <span class="spaced-text">
        <span>Amélioration</span>
        <span class="txt-primary ${isInfrastructureUpdatable(infrastructure.id) ? '' : 'txt-error'}">${getCommaFormatedString(infrastructure.update_cost)} CRD</span>
      </span>
      ${isInfrastructureUpdatable(infrastructure.id)
        ? `
          <button ${isInfrastructureUpdatable(infrastructure.id) ? `onclick="onUpdatableInfrastructureClick('${infrastructure.id}')"` : ''} class="lzr-button lzr-outlined ${isInfrastructureUpdatable(infrastructure.id) ? `lzr-primary` : 'lzr-error'}">Améliorer</button>
        `
        : ''
      }
    ` : ''}
  </div>
  `;
}

export function onUpdatableInfrastructureClick(infraId) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  let investPath = '';
  if (baseInfra.id.includes('TC')) {
    investPath = 'TC';
  } else if (baseInfra.id.includes('OFF')) {
    investPath = 'OFF';
  } else if (baseInfra.id.includes('BLA')) {
    investPath = 'BLA';
  }

  let popUp = document.getElementById('popUp');
  document.getElementById('popUpRessourceTitle').innerHTML = `Investir`;
  document.getElementById('popUpRessourceName').innerHTML = ``;
  document.getElementById('popUpRessourceAsk').innerHTML = ``;
  document.getElementById('popUpBody').innerHTML = `
    <div class="infra-bloc">
      <span class="txt-primary label">${baseInfra.label}</span>
      <hr>
      <span class="spaced-text">
        <span>Nouveaux revenu passif</span>
        <span class="txt-primary">${getCommaFormatedString(baseInfra.passive_revenu * 2)} CRD</span>
      </span>
    </div>

    <button 
      class="lzr-button lzr-solid lzr-primary" 
      style="margin-top: auto;" 
      onclick="onUpdateClick('${infraId}')">Améliorer pour<br>${getCommaFormatedString(baseInfra.cost / 2)} CRD</button>
  `;

  popUp.classList.remove('hidden');
}
window.onUpdatableInfrastructureClick = onUpdatableInfrastructureClick;

export function onUpdateClick(infraId) {
  console.log(infraId);
  let infra = USER_INFRASTRUCTURES.find((infra) => infra.id == infraId);
  infra.is_updated = true;
  infra.passive_revenu = infra.passive_revenu * 2;
  updateUserInfrastructures(USER_INFRASTRUCTURES);
  document.getElementById('investmentsContainer').innerHTML = getInvestmentsDom();
  updateTotalBalance('sub', infra.update_cost);
  updateTotalBalanceDom();
  updatePassiveRevenuDom();
  updateFlairDom();
  
  let popUp = document.getElementById('popUp');
  popUp.classList.add('hidden');
}
window.onUpdateClick = onUpdateClick;



export function onChoosePathButtonClick(chosenPath) {
  
  let popUp = document.getElementById('popUp');
  document.getElementById('popUpRessourceTitle').innerHTML = `Voie d'investissement`;
  document.getElementById('popUpRessourceName').innerHTML = ``;
  document.getElementById('popUpRessourceAsk').innerHTML = ``;
  document.getElementById('popUpBody').innerHTML = `
    

    <button 
      class="lzr-button lzr-solid lzr-primary" 
      style="margin-top: auto;" 
      onclick="onChoosePathClick('${chosenPath}')">Choisir la<br>voie ${chosenPath == 'OFF' ? 'officielle' : 'noire'}</button>
  `;

  popUp.classList.remove('hidden');
}
window.onChoosePathButtonClick = onChoosePathButtonClick;

export function onChoosePathClick(chosenPath) {
  let user = getUser();
  user.CHOSEN_PATH = chosenPath;
  setUser(user);
  document.getElementById('investmentsContainer').innerHTML = getInvestmentsDom();
  
  let popUp = document.getElementById('popUp');
  popUp.classList.add('hidden');
}
window.onChoosePathClick = onChoosePathClick;

export function getStorageInfrastructureObjById(infraId) {
  const baseInfra = INFRASTRUCTURES.find((infra) => infra.id == infraId);
  return {
    id: baseInfra.id,
    is_updated: baseInfra.flair == null ? false : true,
    update_cost: baseInfra.cost / 2,
    passive_revenu: baseInfra.passive_revenu,
  }
}

export function getInvestmentsDom() {
  let str = '<div class="infra-path-bloc">';
  for (let rawInfra of INFRASTRUCTURES) {
    if (rawInfra.id.includes('TC')) {
      str += getInfrastructureDom(rawInfra.id);
    }
  }
  str += '</div>';
  let userPath = getUser().CHOSEN_PATH;
  if (getUser().USER_INFRASTRUCTURES.find((infra) => infra.id == 'AS_TC_03') == null) {
    // 3ème pas encore acquis
  } else {
    if (userPath == null) {
      str += `
      <span>Désormais pour vos investissements, il vous faudra choisir entre une progression dans la voie officielle, ou dans la voie noire</span>
      <div class="spaced-text" style="gap: 16px;">
        <button class="lzr-button lzr-outlined lzr-primary" style="width: 100%;" onclick="onChoosePathButtonClick('OFF')">voie<br>officielle</button>
        <button class="lzr-button lzr-outlined lzr-primary" style="width: 100%;" onclick="onChoosePathButtonClick('BLA')">voie<br>noire</button>
      </div>
      `;
    } else {
      str += '<div class="infra-path-bloc">';
      for (let rawInfra of INFRASTRUCTURES) {
        if (rawInfra.id.includes(userPath)) {
          str += getInfrastructureDom(rawInfra.id);
        }
      }
      str += '</div>';
    }
  }
  return str;
}

export function getPassiveInfrasDom() {
  let str = '<div class="infra-path-bloc">';
  for (let rawInfra of USER_INFRASTRUCTURES) {
    if (rawInfra.id.includes('TC')) {
      str += getInfrastructureDom(rawInfra.id, true);
    }
  }
  str += '</div>';
  let userPath = getUser().CHOSEN_PATH;
  if (getUser().USER_INFRASTRUCTURES.find((infra) => infra.id == 'AS_TC_03') == null) {
    // 3ème pas encore acquis
    str += '';
  } else {
    if (userPath == null) {
      str += ``;
    } else {
      str += '<div class="infra-path-bloc">';
      for (let rawInfra of USER_INFRASTRUCTURES) {
        if (rawInfra.id.includes(userPath)) {
          str += getInfrastructureDom(rawInfra.id, true);
        }
      }
      str += '</div>';
    }
  }
  return str;
}


export function updatePassiveRevenuDom() {
  let total = 0;
  for (let userInfra of USER_INFRASTRUCTURES) {
    total += userInfra.passive_revenu;
  }
  document.getElementById('passiveRevenuValueCard').innerHTML = `${getCommaFormatedString(total)} CRD`;
}

export function updateFlairDom() {
  let user = getUser();
  if (user.CURRENT_FLAIR != null) {
    document.getElementById('flairContainer').innerHTML = `<span class="flair crt ${user.CURRENT_FLAIR.id}"><span>${user.CURRENT_FLAIR.label}</span></span>`;
  } else {
    document.getElementById('flairContainer').innerHTML = ``;
  }
}

