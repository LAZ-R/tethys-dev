import { APP_LOCAL_STORAGE_ID } from "../../app-properties.js";
import { CURRENT_CREW_ID, setStartingCrews } from "./crews.service.js";
import { setStartingBlackRessouces, setStartingOfficialRessouces } from "./ressources.service.js";

const STORAGE = localStorage;
const appLocalStorageId = APP_LOCAL_STORAGE_ID;

export const setStorage = () => {
  if (STORAGE.getItem(`${appLocalStorageId}FirstTime`) === null) {
    STORAGE.setItem(`${appLocalStorageId}FirstTime`, '0');
    
    let userTMP = {
      // Global
      TOTAL_BALANCE: 10000,
      CURRENT_CYCLE: 1,
      CURRENT_PHASE: 1,
      PRICES_HAVE_BEEN_UPDATED: false,
      EVENTS_HAVE_BEEN_DISTRIBUTED: false,
      CURRENT_PHASE_SPENDINGS: 0,
      CURRENT_PHASE_EARNINGS: 0,
      WAREHOUSE: [
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
      ],
      // Crews
      MY_CREWS: [],
      RECRUITABLE_CREWS: [],
      CURRENT_CREW_ID: 4,
      // Missions
      OFFICIAL_AVAILABLE_MISSIONS: [],
      OFFICIAL_CURRENT_MISSIONS: [],
      OFFICIAL_REPUTATION: 0,
      CURRENT_OFFICIAL_MISSION_ID: 1,
      BLACK_AVAILABLE_MISSIONS: [],
      BLACK_CURRENT_MISSIONS: [],
      BLACK_REPUTATION: 0,
      CURRENT_BLACK_MISSION_ID: 1,
      // Ressources
      CURRENT_OFFICIAL_RESSOURCES_MARKET: setStartingOfficialRessouces(),
      CURRENT_BLACK_RESSOURCES_MARKET: setStartingBlackRessouces(),
      // Infrastructures
      USER_INFRASTRUCTURES: [],
      CHOSEN_PATH: null, // 'OFF' ou 'BLA' ou null
      CURRENT_FLAIR: null,
      COMPLETED_MISSIONS: 0,
      // Game over
      CYCLES_BEFORE_GAME_OVER: 3,
      IS_BANKRUPTCY: false,
      UI_THEME: 'dark',

      // SETTINGS
      KEEP_SCREEN_AWAKE: true,
      PREFERED_THEME: 'dark',
    };
    STORAGE.setItem(`${appLocalStorageId}User`, JSON.stringify(userTMP));
  }
}

export function deleteStorage() {
  if (STORAGE.getItem(`${appLocalStorageId}FirstTime`) !== null) {
    STORAGE.removeItem(`${appLocalStorageId}FirstTime`);
  }
  if (STORAGE.getItem(`${appLocalStorageId}FirstTime`) !== null) {
    STORAGE.removeItem(`${appLocalStorageId}User`);
  }
}

export const getUser = () => {
  return JSON.parse(STORAGE.getItem(`${appLocalStorageId}User`));
}
export const setUser = (user) => {
  STORAGE.setItem(`${appLocalStorageId}User`, JSON.stringify(user));
}

// DATA #######################################################################
function downloadText() {
  let user = getUser();
  let date = new Date();
  let dateStr = `${date.getFullYear()}_${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}_${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}H${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}M${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}S`;
  let userStr = JSON.stringify(user);
  const contenu = userStr; // ta variable string

  // Création d’un blob avec le contenu texte
  const blob = new Blob([contenu], { type: "text/plain" });

  // Création d’un lien de téléchargement
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(blob);
  lien.download = `monocrono_savefile-${dateStr}.txt`; // nom du fichier

  // Ajout du lien au DOM et clic automatique
  document.body.appendChild(lien);
  lien.click();

  // Nettoyage
  document.body.removeChild(lien);
  URL.revokeObjectURL(lien.href);
}
window.downloadText = downloadText;

function onImportFileClick(event) {
  const input = event.target;
  if (!input.files?.length) return;

  console.log('Importing .txt file');
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = async () => {
    const text = reader.result;
    console.log(text);
    const jsonText = JSON.parse(text);
    console.log(jsonText);

    setUser(jsonText);

    input.value = ''; // Important : reset file value here, to be able to upload the same file and still trigger the onchange event

    window.location = './';
  };
  reader.readAsText(file);
}
window.onImportFileClick = onImportFileClick;

export function getStorageDom() {
  return `
      <div class="storage-option-container export">
        <h2>Exportation des données du stockage local</h2>
        <p>Génère un fichier .txt du JSON de l'utilisateur du stockage local.</p>
        <button class="lzr-button lzr-outlined lzr-primary" onclick="downloadText()">Exporter .txt</button>
      </div>
  <hr>
      <div class="storage-option-container import">
        <h2>Importation de données dans le stockage local</h2>
        <p>Importe un fichier .txt pour valoriser le JSON de l'utilisateur du stockage local.</p>
        <p class="error-bloc">Attention, il est important de n'utiliser qu'un fichier texte de sauvegarde généré par cette application et non altéré. Sinon, ça VA planter..</p>
        <p class="error-bloc">Attention, le fichier texte de sauvegarde importé va écraser le stockage actuel.</p>
        <input type="file" class="lzr-button lzr-solid lzr-error" onchange="onImportFileClick(event)" accept=".txt" />
      </div>
  `;
}