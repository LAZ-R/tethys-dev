// GLOBAL VARIABLES ///////////////////////////////////////////////////////////
export const GLOBAL_BID            = 0.80; // prix d'achat ressource.rarity == '' à quai (% du ASK)

export const COMMON_BID            = 0.75; // prix d'achat ressource.rarity == 'Commun' à quai (% du ASK)
export const UNCOMMON_BID          = 0.84; // prix d'achat ressource.rarity == 'Inhabituel' à quai (% du ASK)
export const RARE_BID              = 0.88; // prix d'achat ressource.rarity == 'Rare' à quai (% du ASK)
export const LEGENDARY_BID         = 0.90; // prix d'achat ressource.rarity == 'Legendary' à quai (% du ASK)

export const MISSION_PRICE_BY_SLOT = 120; // coût d'un vaisseau en mission (par slot par cycle)
export const IDLE_PRICE_BY_SLOT    = 20; // coût d'un vaisseau amarré (par slot par cycle)

// RESOURCES
export const RESSOURCES_BASE_WEIGHT  = 1;    // poids de base des ressources
export const RESSOURCES_WEIGHT_FLOOR = 0.05; // poids minimum possible
export const RESSOURCES_WEIGHT_ALPHA = 1.5;  // sensibilité (1.2 à 1.8 conseillé)

// REPUTATION
export const REPUTATION_CAP = 250;

export const OFFICIAL_REPUTATION_FOR_UNCOMMON = 10;
export const OFFICIAL_REPUTATION_FOR_RARE = 30;
export const OFFICIAL_REPUTATION_FOR_LEGENDARY = 60;

export const BLACK_REPUTATION_FOR_UNCOMMON = 10;
export const BLACK_REPUTATION_FOR_RARE = 30;
export const BLACK_REPUTATION_FOR_LEGENDARY = 60;