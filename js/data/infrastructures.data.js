export const INFRASTRUCTURES = [
  {
    id: "AS_TC_01",
    label: "Quartiers de transit",
    desc: "Zones d'hébergement temporaires pour équipages, dockers et voyageurs intersystèmes.",
    cost: 100000, // 100k
    passive_revenu: 1000, // 1k
    min_crew: 5,
    min_off_rep: 15,
    min_bla_rep: 15,
    flair: null,
    require: '',
  },
  {
    id: "AS_TC_02",
    label: "Cantine ouvrière",
    desc: "Lieu de rassemblement où dockers et équipages claquent leur paye dans l'alcool et la musique.",
    cost: 250000, // 250k
    passive_revenu: 2500, // 2.5k
    min_crew: 7,
    min_off_rep: 30,
    min_bla_rep: 30,
    flair: null,
    require: 'AS_TC_01',
  },
  {
    id: "AS_TC_03",
    label: "Module d'expansion portuaire",
    desc: "Module de quais, d'aires d'amarrage et de postes de maintenance légers.",
    cost: 500000, // 500k
    passive_revenu: 5000, // 5k
    min_crew: 9,
    min_off_rep: 50,
    min_bla_rep: 50,
    require: 'AS_TC_02',
    flair: {
      id: "FL_TC_03",
      label: "Doyenne des Docks",
    },
  },

  // Voie officielle --------------------------------
  // Phase 1 : gestion du commerce
  {
    id: "AS_OFF_01",
    label: "Dôme de commerce",
    desc: "Immense hub pressurisé où transitent marchandises, délégations et contreparties diplomatiques.",
    cost: 1000000, // 1M
    passive_revenu: 10000, // 10k
    min_crew: 10,
    min_off_rep: 100,
    min_bla_rep: 0,
    require: 'AS_TC_03',
    flair: null,
  },
  {
    id: "AS_OFF_02",
    label: "Tribunal commercial",
    desc: "Institution dédiée à l'arbitrage des échanges et à la délivrance de licences commerciales.",
    cost: 5000000, // 5M
    passive_revenu: 50000, // 50k
    min_crew: 15,
    min_off_rep: 150,
    min_bla_rep: 0,
    require: 'AS_OFF_01',
    flair: {
      id: "FL_OFF_02",
      label: "Arbitre des Horizons",
    },
  },
  // Phase 2 : optimisations infrastructurelles
  {
    id: "AS_OFF_03",
    label: "Anneau orbital",
    desc: "Anneau monumental ceinturant la station, combinant habitat, zones industrielles et vitrines politiques.",
    cost: 20000000, // 20M
    passive_revenu: 200000, // 200k
    min_crew: 20,
    min_off_rep: 200,
    min_bla_rep: 0,
    require: 'AS_OFF_02',
    flair: null,
  },
  {
    id: "AS_OFF_04",
    label: "Nœuds de transit intersystèmes",
    desc: "Complexe de relais gravitationnels et portails qui fluidifie les échanges entre les deux systèmes.",
    cost: 50000000, // 50M
    passive_revenu: 500000, // 500k
    min_crew: 25,
    min_off_rep: 250,
    min_bla_rep: 0,
    require: 'AS_OFF_03',
    flair: {
      id: "FL_OFF_04",
      label: "Architecte des Mondes",
    },
  },

  // Voie marché noir --------------------------------
  // Phase 1 : gestion de la contrebande
  {
    id: "AS_BLA_01",
    label: "Marché clandestin",
    desc: "Marché informel avec place de revente, facilitant la création d'un écosystème d'acheteurs privés.",
    cost: 1000000, // 1M
    passive_revenu: 10000, // 10k
    min_crew: 10,
    min_off_rep: 0,
    min_bla_rep: 100,
    require: 'AS_TC_03',
    flair: null,
  },
  {
    id: "AS_BLA_02",
    label: "Sanctuaire des contrebandiers",
    desc: "Centre sécurisé pour opérations clandestines, combinant relais logistiques et caches profondes.",
    cost: 5000000, // 5M
    passive_revenu: 50000, // 50k
    min_crew: 15,
    min_off_rep: 0,
    min_bla_rep: 150,
    require: 'AS_BLA_01',
    flair: {
      id: "FL_BLA_02",
      label: "Régente Nocturne",
    },
  },
  // Phase 2 : optimisations infrastructurelles
  {
    id: "AS_BLA_03",
    label: "Complexes industriels cachés",
    desc: "Ateliers souterrains, lignes d'assemblage et laboratoires dissimulés pour production et reconditionnement.",
    cost: 20000000, // 20M
    passive_revenu: 200000, // 200k
    min_crew: 20,
    min_off_rep: 0,
    min_bla_rep: 200,
    require: 'AS_BLA_02',
    flair: null,
  },
  {
    id: "AS_BLA_04",
    label: "Citadelles de l'Ombre",
    desc: "Enclaves spatiales autonomes : forteresses commerciales hors juridiction, places fortes des contrebandes régionales.",
    cost: 50000000, // 50M
    passive_revenu: 500000, // 500k
    min_crew: 25,
    min_off_rep: 0,
    min_bla_rep: 250,
    require: 'AS_BLA_03',
    flair: {
      id: "FL_BLA_04",
      label: "Mère des Abîmes",
    },
  },
];

