import { getSvgIcon } from "./icons.service.js";

export function getSystemDom() {
  return `
  <h2 style="text-transform: uppercase; margin: 0 auto;">TÉTHYS</h2>
  <div id="cardContainer">
    <div id="flairContainer">
    </div>
    
    <span class="spaced-text">
      <span>Missions effectuées</span>
      <span id="completedMissionsCard" class="txt-primary">0</span>
    </span>
    <span class="spaced-text">
      <span>Flotte</span>
      <span id="crewsCountCard" class="txt-primary">XXX équipages</span>
    </span>
    <hr>
    <span class="spaced-text">
      <span>Balance totale</span>
      <span id="totalBalanceCard" class="txt-primary">XXX CRD</span>
    </span>
    <!-- <span class="spaced-text">
      <span>Items</span>
      <span id="warehouseCountCard" class="txt-primary">0</span>
    </span> -->
    <span class="spaced-text">
      <span>Valeur entrepôt</span>
      <span id="totalWarehouseValueCard" class="txt-primary">0</span>
    </span>
    <span class="spaced-text">
      <span>Revenu passif</span>
      <span id="passiveRevenuValueCard" class="txt-primary">0.00 CRD</span>
    </span>

    <hr>
    
      <div class="fight-container">
        <span class="txt-primary" style="margin-bottom: 16px;">Réputation</span>
        <div class="headers">
          <div class="header">
            <span class="header-label">Marché<br>officiel</span>
            <span class="txt-primary" id="officialReputationCard">210</span>
          </div>
          <div class="header">
            <span class="header-label">Marché<br>noir</span>
            <span class="txt-primary" id="blackReputationCard">120</span>
          </div>
        </div>

        <div class="bars">
          <div class="bar left">
            <span id="officialBar"></span>
          </div>
          <div class="center"></div>
          <div class="bar right">
            <span id="blackBar"></span>
          </div>
        </div>
      </div>
    
    </div>
  <button style="margin-top: auto;"class="lzr-button lzr-outlined lzr-primary" onclick="onOpenGhostPageButtonClick('helpContainer')">Aide</button>
  <button class="lzr-button lzr-outlined lzr-primary" onclick="onOpenGhostPageButtonClick('settingsContainer')">Paramètres</button>
  <button class="lzr-button lzr-outlined lzr-primary" onclick="onOpenGhostPageButtonClick('storageContainer')">Stockage</button>
  `;
}