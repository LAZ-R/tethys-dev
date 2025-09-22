import { BLACK_RESSOURCES, OFFICIAL_RESSOURCES } from "../data/ressources.data.js";
import { CURRENT_PHASE } from "../main.js";
import { clamp, getCommaFormatedString, getRandomFloatBetween, getRandomIntegerBetween, getRoundedPercentage } from "../utils/math.utils.js";
import { COMMON_BID, GLOBAL_BID, LEGENDARY_BID, RARE_BID, RESSOURCES_BASE_WEIGHT, RESSOURCES_WEIGHT_ALPHA, RESSOURCES_WEIGHT_FLOOR, UNCOMMON_BID } from "./global.service.js";
import { getUser, setUser } from "./storage.service..js";

export let CURRENT_OFFICIAL_RESSOURCES_MARKET = [];
export const updateOfficialRessourcesMarket = (newRessources) => {
  let user = getUser();
  CURRENT_OFFICIAL_RESSOURCES_MARKET = newRessources;
  user.CURRENT_OFFICIAL_RESSOURCES_MARKET = CURRENT_OFFICIAL_RESSOURCES_MARKET;
  setUser(user);
}

export let CURRENT_BLACK_RESSOURCES_MARKET = [];
export const updateBlackRessourcesMarket = (newRessources) => {
  let user = getUser();
  CURRENT_BLACK_RESSOURCES_MARKET = newRessources;
  user.CURRENT_BLACK_RESSOURCES_MARKET = CURRENT_BLACK_RESSOURCES_MARKET;
  setUser(user);
}

export const addRessourceIdToBagByWeight = (ressource, bag) => {
  let nb = Math.round(ressource.weight * 100);
  if (nb == 0) { nb = 1; }
  for (let index = 0; index < nb; index++) {
    bag.push(ressource.id);
  }
}

export function updateMarketDom() {
  document.getElementById('officialPricesContainer').innerHTML = getRessourcesPricesDom(CURRENT_OFFICIAL_RESSOURCES_MARKET);
  document.getElementById('blackPricesContainer').innerHTML = getRessourcesPricesDom(CURRENT_BLACK_RESSOURCES_MARKET, true);
  if (CURRENT_PHASE == 8) {
    document.getElementById('officialUpdatedPricesContainer').innerHTML = getRessourcesPricesDom(CURRENT_OFFICIAL_RESSOURCES_MARKET);
    document.getElementById('blackUpdatedPricesContainer').innerHTML = getRessourcesPricesDom(CURRENT_BLACK_RESSOURCES_MARKET, true);
  }
}

// OFFICIAL ============================================================================

export const updateOfficialRessourceASK = (ressource) => {
  // Garde-fou
  const ask = Number(ressource.ask) > 0 ? ressource.ask : ressource.p0;

  // Impact immédiat des ventes sur le prix.
  // Plus tu vends d’unités par rapport à la profondeur du marché (depth),
  // plus le prix baisse (car l’offre augmente).
  // ressource.k règle la sensibilité : grand k = chute plus forte.
  const impact = -ressource.k * (ressource.current_cycle_sold_units / ressource.depth);

  // Effet de "réversion vers la moyenne".
  // Le marché tend à revenir doucement vers son prix d’équilibre p0.
  // Si ask < p0 → valeur positive → hausse progressive du prix.
  // Si ask > p0 → valeur négative → baisse progressive du prix.
  const reversion = ressource.lambda * ((ressource.p0 - ask) / ask);

  // Bruit aléatoire
  let delta = impact + reversion + ressource.noise;
  // On limite la variation maximale par cycle.
  // Exemple : cap = 0.05 → pas plus de ±5% de variation.
  delta = clamp(delta, -ressource.cap, +ressource.cap);

  // On applique la variation au prix actuel.
  // Multiplication par (1 + delta) → variation proportionnelle.
  // On impose un plancher de 1 pour éviter les prix négatifs ou 0.
  ressource.ask = Math.max(1, ask * (1 + delta));
  // MAJ BID
  switch (ressource.rarity) {
    case 'Commun': ressource.bid = COMMON_BID * ressource.ask; break;
    case 'Inhabituel': ressource.bid = UNCOMMON_BID * ressource.ask; break;
    case 'Rare': ressource.bid = RARE_BID * ressource.ask; break;
    case 'Légendaire': ressource.bid = LEGENDARY_BID * ressource.ask; break;
    default: ressource.bid = GLOBAL_BID * ressource.ask;  break;
  }
}

export const updateOfficialRessourceWeight = (ressource) => {
  // si ressource.ask > ressource.p0 => le marché en veut plus => poids ↑
  // si ressource.ask < ressource.p0 => le marché en veut moins => poids ↓ (mais jamais < RESSOURCES_WEIGHT_FLOOR)
  // garde-fous
  const p0  = Number(ressource.p0)  > 0 ? ressource.p0  : 1;
  const ask = Number(ressource.ask) > 0 ? ressource.ask : p0;
  // ratio de tension du marché
  const ratio = ask / p0;
  // poids = max(plancher, base * ratio^alpha)
  const raw = RESSOURCES_BASE_WEIGHT * Math.pow(ratio, RESSOURCES_WEIGHT_ALPHA);
  const rawWeight = Math.max(RESSOURCES_WEIGHT_FLOOR, raw);
  ressource.weight = rawWeight * (0.98 + Math.random() * 0.04);
}

export const updateOfficialRessourceValues = (ressource) => {
  updateOfficialRessourceASK(ressource);
  updateOfficialRessourceWeight(ressource);
  ressource.current_cycle_sold_units = 0;
}

export const updateOfficialRessourcesValues = () => {
  for (let ressource of CURRENT_OFFICIAL_RESSOURCES_MARKET) {
    const previousAsk = ressource.ask * 1;
    //console.log(`updating ${ressource.id}`);
    //console.log(`    previous ASK: ${previousAsk}`);
    updateOfficialRessourceValues(ressource);
    const newAsk = ressource.ask * 1;
    //console.log(`    new ASK     : ${newAsk}`);
    if (newAsk > previousAsk * 1.001) {
      ressource.tendency = 'up';
    } else if (newAsk < previousAsk * .999) {
      ressource.tendency = 'down';
    } else {
      ressource.tendency = 'equal';
    }
    console.log(`${ressource.id} - ${ressource.tendency} ${(getRoundedPercentage(newAsk, previousAsk, 2) - 100).toFixed(2)}%`);
  }
  updateOfficialRessourcesMarket(CURRENT_OFFICIAL_RESSOURCES_MARKET);
}

// BLACK ============================================================================

export const updateBlackRessourceASK = (ressource) => {
  // Garde-fou
  const ask = Number(ressource.ask) > 0 ? ressource.ask : ressource.p0;

  // Impact immédiat des ventes sur le prix.
  // Plus tu vends d’unités par rapport à la profondeur du marché (depth),
  // plus le prix baisse (car l’offre augmente).
  // ressource.k règle la sensibilité : grand k = chute plus forte.
  const impact = -ressource.k * (ressource.current_cycle_sold_units / ressource.depth);

  // Effet de "réversion vers la moyenne".
  // Le marché tend à revenir doucement vers son prix d’équilibre p0.
  // Si ask < p0 → valeur positive → hausse progressive du prix.
  // Si ask > p0 → valeur négative → baisse progressive du prix.
  const reversion = ressource.lambda * ((ressource.p0 - ask) / ask);

  // Bruit aléatoire
  let delta = impact + reversion + ressource.noise;
  // On limite la variation maximale par cycle.
  // Exemple : cap = 0.05 → pas plus de ±5% de variation.
  delta = clamp(delta, -ressource.cap, +ressource.cap);

  // On applique la variation au prix actuel.
  // Multiplication par (1 + delta) → variation proportionnelle.
  // On impose un plancher de 1 pour éviter les prix négatifs ou 0.
  ressource.ask = Math.max(1, ask * (1 + delta));
  // MAJ BID
  switch (ressource.rarity) {
    case 'Commun': ressource.bid = COMMON_BID * ressource.ask; break;
    case 'Inhabituel': ressource.bid = UNCOMMON_BID * ressource.ask; break;
    case 'Rare': ressource.bid = RARE_BID * ressource.ask; break;
    case 'Légendaire': ressource.bid = LEGENDARY_BID * ressource.ask; break;
    default: ressource.bid = GLOBAL_BID * ressource.ask;  break;
  }
}

export const updateBlackRessourceWeight = (ressource) => {
  // si ressource.ask > ressource.p0 => le marché en veut plus => poids ↑
  // si ressource.ask < ressource.p0 => le marché en veut moins => poids ↓ (mais jamais < RESSOURCES_WEIGHT_FLOOR)
  // garde-fous
  const p0  = Number(ressource.p0)  > 0 ? ressource.p0  : 1;
  const ask = Number(ressource.ask) > 0 ? ressource.ask : p0;
  // ratio de tension du marché
  const ratio = ask / p0;
  // poids = max(plancher, base * ratio^alpha)
  const raw = RESSOURCES_BASE_WEIGHT * Math.pow(ratio, RESSOURCES_WEIGHT_ALPHA);
  const rawWeight = Math.max(RESSOURCES_WEIGHT_FLOOR, raw);
  ressource.weight = rawWeight * (0.98 + Math.random() * 0.04);
}

export const updateBlackRessourceValues = (ressource) => {
  updateBlackRessourceASK(ressource);
  updateBlackRessourceWeight(ressource);
  ressource.current_cycle_sold_units = 0;
}

export const updateBlackRessourcesValues = (isSellPhase = false) => {
  for (let ressource of CURRENT_BLACK_RESSOURCES_MARKET) {
    const previousAsk = ressource.ask * 1;
    let newAsk = ressource.ask * 1;
    //console.log(`updating ${ressource.id}`);
    //console.log(`    previous ASK: ${previousAsk}`);
    if (isSellPhase) {
      let rnd1 = getRandomIntegerBetween(0, 100);
      let rnd2 = 0;
      switch (ressource.tendency) {
        case 'up':
          rnd2 = getRandomFloatBetween(1.1, 2);
          break;
        case 'down':
          rnd2 = getRandomFloatBetween(.33, .9);
          break;
        case 'equal':
          rnd2 = getRandomFloatBetween(.75, 1.25);
          break;
        default:
          rnd2 = getRandomFloatBetween(.75, 1.25);
          break;
      }
      if (rnd1 <= 66) { newAsk = ressource.ask * rnd2; }
      ressource.ask = newAsk;
    } else {
      updateBlackRessourceValues(ressource);
      newAsk = ressource.ask * 1;
    }
    if (newAsk > previousAsk * 1.001) {
      ressource.tendency = 'up';
    } else if (newAsk < previousAsk * .999) {
      ressource.tendency = 'down';
    } else {
      ressource.tendency = 'equal';
    }
    console.log(`${ressource.id} - ${ressource.tendency} ${(getRoundedPercentage(newAsk, previousAsk, 2) - 100).toFixed(2)}%`);
  }
  updateBlackRessourcesMarket(CURRENT_BLACK_RESSOURCES_MARKET);
}

export const getRessourcePriceDom = (ressource, isBlack = false) => {
  return `
  <tr>
    ${ressource.rarity == 'Commun' ? `<td rowspan="4" style="text-align: center;"><div class="ressource-image ${ressource.category} default" style="--size: 48px; margin: 0 auto;"></div>${ressource.category}</td>` : ''}
    <td>
      <span class="rarity-text ${ressource.rarity}">${ressource.rarity}</span>
    </td>
    <td class="price-cell">
    ${isBlack && (CURRENT_PHASE !== 4 || CURRENT_PHASE == 7)
      ? `********** CRD <span class="${ressource.tendency}">${ressource.tendency == 'up' ? '▲' : ressource.tendency == 'down' ? '▼' : ressource.tendency == 'equal' ? '⬤' : '-'}</span>` : 
      `${getCommaFormatedString(ressource.ask.toFixed(2))} CRD <span class="${ressource.tendency}">${ressource.tendency == 'up' ? '▲' : ressource.tendency == 'down' ? '▼' : ressource.tendency == 'equal' ? '⬤' : '-'}</span>`
    }
    </td>
    
    <!-- <td class="price-cell">${ressource.bid == null ? '' : getCommaFormatedString(ressource.bid.toFixed(2))} CRD</td> -->
  </tr>
  `;
}

export const getRessourcesPricesDom = (ressources, isBlack = false) => {
  let str = `
  <table class="ressources-prices-table">
    <thead>
      <tr>
        <th>Catégorie</th>
        <th>Rareté</th>
        <th>ASK</th>
        <!-- <th>BID</th> -->
      </tr>
    </thead>
    <tbody>
  `;
  for (let ressource of ressources) {
    str += getRessourcePriceDom(ressource, isBlack);
  }
  str += `
    </tbody>
  </table>
  `;
  return str;
}

export const setStartingOfficialRessouces = () => {
  for (let ressource of OFFICIAL_RESSOURCES) {
    // MAJ BID
    switch (ressource.rarity) {
      case 'Commun': ressource.bid = COMMON_BID * ressource.ask; break;
      case 'Inhabituel': ressource.bid = UNCOMMON_BID * ressource.ask; break;
      case 'Rare': ressource.bid = RARE_BID * ressource.ask; break;
      case 'Légendaire': ressource.bid = LEGENDARY_BID * ressource.ask; break;
      default: ressource.bid = GLOBAL_BID * ressource.ask;  break;
    }
  }
  return OFFICIAL_RESSOURCES;
}

export const setStartingBlackRessouces = () => {
  for (let ressource of BLACK_RESSOURCES) {
    // MAJ BID
    switch (ressource.rarity) {
      case 'Commun': ressource.bid = COMMON_BID * ressource.ask; break;
      case 'Inhabituel': ressource.bid = UNCOMMON_BID * ressource.ask; break;
      case 'Rare': ressource.bid = RARE_BID * ressource.ask; break;
      case 'Légendaire': ressource.bid = LEGENDARY_BID * ressource.ask; break;
      default: ressource.bid = GLOBAL_BID * ressource.ask;  break;
    }
  }
  return BLACK_RESSOURCES;
}

export function getRessourceObjById(ressourceId) {
  if (ressourceId == null) return null;
  for (const ressource of CURRENT_OFFICIAL_RESSOURCES_MARKET) {
    if (ressource.id == ressourceId) {
      return ressource;
    }
  }
  for (const ressource of CURRENT_BLACK_RESSOURCES_MARKET) {
    if (ressource.id == ressourceId) {
      return ressource;
    }
  }
  return null;
}