/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Crosshair, PaintBucket, Save, LogIn, Menu, X, ChevronRight, ChevronLeft, Sparkles, Star, RefreshCw, CheckCircle2, LayoutGrid, Backpack, XCircle, Shield, Check, Terminal, Settings, Sun, Moon, Globe, Sword, Hand, Target, Flame, Eye, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Skin {
  weapon_defindex: number;
  weapon_name: string;
  paint: number | string;
  image: string;
  paint_name: string;
  legacy_model: boolean;
}

interface Agent {
  team: number;
  image: string;
  model: string;
  agent_name: string;
}

interface StickerInstance {
  id: string;
  stickerId: string;
  name: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface CharmInstance {
  id: string;
  charmId: string;
  name: string;
  image: string;
  x: number;
  y: number;
}

interface EquippedSkin {
  skin: Skin;
  config: {
    wear: number;
    seed: number;
    stattrak: number;
    nametag: string;
    stickers?: StickerInstance[];
    charms?: CharmInstance[];
  };
  team?: 'CT' | 'T';
}

const translations = {
  en: {
    knifes: "Knifes",
    gloves: "Gloves",
    pistols: "Pistols",
    smgs: "SMGs",
    rifles: "Rifles",
    snipers: "Snipers",
    heavy: "Heavy",
    other: "Other",
    agents: "Agents",
    browse: "Browse",
    loadout: "My Loadout",
    signIn: "Sign in with Steam",
    signOut: "Sign Out",
    searchWeapons: "Search weapons...",
    searchSkins: "Search skins for",
    searchLoadout: "Search loadout...",
    searchStickers: "Search stickers...",
    favoritesOnly: "Favorites Only",
    universalPaints: "Universal Paints",
    clearLoadout: "Clear Loadout",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    dark: "Dark",
    light: "Light",
    apply: "Apply Skin",
    unequip: "Unequip Skin",
    reset: "Reset Configuration",
    stickersAndCharms: "Stickers & Charms",
    addSticker: "Add Sticker",
    addCharm: "Add Charm",
    copyCommand: "Copy Console Command",
    pattern: "Pattern",
    wear: "Wear Rating",
    nametag: "Nametag",
    kills: "Kills",
    customName: "Custom Name",
    killsCount: "Kills count...",
    equipped: "Equipped",
    noPaint: "No Paint Selected",
    chooseWeapon: "Choose a weapon from the sidebar and select a paint to configure your custom loadout.",
    news: "NEWS",
    covert: "Covert",
    classified: "Classified",
    restricted: "Restricted",
    milSpec: "Mil-Spec",
    dbSettings: "Database Settings",
    dbHost: "DB Host",
    dbUser: "DB User",
    dbPass: "DB Password",
    dbPort: "DB Port",
    dbName: "DB Name",
    appUrl: "App URL",
    save: "Save"
  },
  pt: {
    knifes: "Facas",
    gloves: "Luvas",
    pistols: "Pistolas",
    smgs: "Submetralhadoras",
    rifles: "Rifles",
    snipers: "Snipers",
    heavy: "Pesadas",
    other: "Outros",
    agents: "Agentes",
    browse: "Navegar",
    loadout: "Meu Inventário",
    signIn: "Entrar com Steam",
    signOut: "Sair",
    searchWeapons: "Buscar armas...",
    searchSkins: "Buscar skins para",
    searchLoadout: "Buscar no inventário...",
    searchStickers: "Buscar adesivos...",
    favoritesOnly: "Apenas Favoritos",
    universalPaints: "Pinturas Universais",
    clearLoadout: "Limpar Inventário",
    settings: "Configurações",
    theme: "Tema",
    language: "Idioma",
    dark: "Escuro",
    light: "Claro",
    apply: "Aplicar Skin",
    unequip: "Desequipar Skin",
    reset: "Resetar Configuração",
    stickersAndCharms: "Adesivos e Pingentes",
    addSticker: "Adicionar Adesivo",
    addCharm: "Adicionar Pingente",
    copyCommand: "Copiar Comando Console",
    pattern: "Padrão",
    wear: "Desgaste",
    nametag: "Etiqueta",
    kills: "Mortes",
    customName: "Nome Personalizado",
    killsCount: "Contagem de mortes...",
    equipped: "Equipado",
    noPaint: "Nenhuma Skin Selecionada",
    chooseWeapon: "Escolha uma arma na barra lateral e selecione uma skin para configurar seu inventário personalizado.",
    news: "NOVO",
    covert: "Oculto",
    classified: "Classificado",
    restricted: "Restrito",
    milSpec: "Militar",
    dbSettings: "Configurações do Banco de Dados",
    dbHost: "Host do DB",
    dbUser: "Usuário do DB",
    dbPass: "Senha do DB",
    dbPort: "Porta do DB",
    dbName: "Nome do DB",
    appUrl: "URL do App",
    save: "Salvar"
  },
  es: {
    knifes: "Cuchillos",
    gloves: "Guantes",
    pistols: "Pistolas",
    smgs: "Subfusiles",
    rifles: "Rifles",
    snipers: "Francotiradores",
    heavy: "Pesadas",
    other: "Otros",
    agents: "Agentes",
    browse: "Explorar",
    loadout: "Mi Equipamiento",
    signIn: "Iniciar sesión con Steam",
    signOut: "Cerrar sesión",
    searchWeapons: "Buscar armas...",
    searchSkins: "Buscar skins para",
    searchLoadout: "Buscar en equipamiento...",
    searchStickers: "Buscar pegatinas...",
    favoritesOnly: "Solo Favoritos",
    universalPaints: "Pinturas Universales",
    clearLoadout: "Limpiar Equipamiento",
    settings: "Ajustes",
    theme: "Tema",
    language: "Idioma",
    dark: "Oscuro",
    light: "Claro",
    apply: "Aplicar Skin",
    unequip: "Desequipar Skin",
    reset: "Restablecer Configuración",
    copyCommand: "Copiar Comando de Consola",
    pattern: "Patrón",
    wear: "Desgaste",
    nametag: "Etiqueta",
    kills: "Bajas",
    customName: "Nombre Personalizado",
    killsCount: "Contador de bajas...",
    equipped: "Equipado",
    noPaint: "Sin Skin Seleccionada",
    chooseWeapon: "Elige un arma de la barra lateral y selecciona una skin para configurar tu equipamiento personalizado.",
    news: "NUEVO",
    covert: "Encubierto",
    classified: "Clasificado",
    restricted: "Restringido",
    milSpec: "Grado Militar",
    dbSettings: "Ajustes de Base de Datos",
    dbHost: "Host de BD",
    dbUser: "Usuario de BD",
    dbPass: "Contraseña de BD",
    dbPort: "Puerto de BD",
    dbName: "Nombre de BD",
    appUrl: "URL de la App",
    save: "Guardar"
  },
  fr: {
    knifes: "Couteaux",
    gloves: "Gants",
    pistols: "Pistolets",
    smgs: "PM",
    rifles: "Fusils",
    snipers: "Snipers",
    heavy: "Lourdes",
    other: "Autres",
    agents: "Agents",
    browse: "Parcourir",
    loadout: "Mon Équipement",
    signIn: "Se connecter avec Steam",
    signOut: "Se déconnecter",
    searchWeapons: "Rechercher des armes...",
    searchSkins: "Rechercher des skins pour",
    searchLoadout: "Rechercher dans l'équipement...",
    searchStickers: "Rechercher des autocollants...",
    favoritesOnly: "Favoris uniquement",
    universalPaints: "Peintures Universelles",
    clearLoadout: "Effacer l'équipement",
    settings: "Paramètres",
    theme: "Thème",
    language: "Langue",
    dark: "Sombre",
    light: "Clair",
    apply: "Appliquer le Skin",
    unequip: "Déséquiper le skin",
    reset: "Réinitialiser la configuration",
    copyCommand: "Copier la commande console",
    pattern: "Modèle",
    wear: "Usure",
    nametag: "Étiquette",
    kills: "Éliminations",
    customName: "Nom Personnalisé",
    killsCount: "Compteur d'éliminations...",
    equipped: "Équipé",
    noPaint: "Aucun skin sélectionné",
    chooseWeapon: "Choisissez une arme dans la barre latérale et sélectionnez un skin pour configurer votre équipement personnalisé.",
    news: "NOUVEAU",
    covert: "Secret",
    classified: "Classifié",
    restricted: "Restreint",
    milSpec: "Qualité Militaire",
    dbSettings: "Paramètres de la Base de Données",
    dbHost: "Hôte BD",
    dbUser: "Utilisateur BD",
    dbPass: "Mot de passe BD",
    dbPort: "Port BD",
    dbName: "Nom BD",
    appUrl: "URL de l'App",
    save: "Enregistrer"
  }
};

const getWeaponCategory = (weaponName: string) => {
  const name = weaponName.toLowerCase();
  
  if (name.includes('knife') || name.includes('bayonet') || name.includes('karambit') || name.includes('shadow_daggers') || name.includes('push')) return 'Knifes';
  if (name.includes('glove') || name.includes('handwraps') || name.includes('bloodhound') || name.includes('hydra') || name.includes('brokenfang')) return 'Gloves';
  
  const pistols = ['glock', 'usp', 'hkp2000', 'p250', 'tec9', 'fiveseven', 'cz75a', 'deagle', 'revolver', 'elite'];
  if (pistols.some(p => name.includes(p))) return 'Pistols';
  
  const smgs = ['mac10', 'mp9', 'mp7', 'mp5sd', 'ump45', 'p90', 'bizon'];
  if (smgs.some(s => name.includes(s))) return 'SMGs';
  
  const snipers = ['ssg08', 'awp', 'g3sg1', 'scar20'];
  if (snipers.some(s => name.includes(s))) return 'Snipers';
  
  const rifles = ['galilar', 'famas', 'ak47', 'm4a1', 'sg556', 'aug'];
  if (rifles.some(r => name.includes(r))) return 'Rifles';
  
  const heavy = ['nova', 'xm1014', 'mag7', 'sawedoff', 'm249', 'negev'];
  if (heavy.some(h => name.includes(h))) return 'Heavy';
  
  if (name.includes('agent') || name.includes('custom_player') || name.includes('customplayer') || name.includes('tm_') || name.includes('ctm_') || name.includes('ct_sas') || name.includes('tt_phoenix')) return 'Agents';
  
  return 'Other';
};

const formatWeaponName = (weaponName: string) => {
  const name = weaponName.toLowerCase().replace('weapon_', '');
  
  const map: Record<string, string> = {
    'm4a1_silencer': 'M4A1-S',
    'm4a1': 'M4A4',
    'usp_silencer': 'USP-S',
    'hkp2000': 'P2000',
    'deagle': 'Desert Eagle',
    'elite': 'Dual Berettas',
    'mac10': 'MAC-10',
    'mp5sd': 'MP5-SD',
    'ump45': 'UMP-45',
    'bizon': 'PP-Bizon',
    'galilar': 'Galil AR',
    'sg556': 'SG 553',
    'ssg08': 'SSG 08',
    'scar20': 'SCAR-20',
    'xm1014': 'XM1014',
    'mag7': 'MAG-7',
    'sawedoff': 'Sawed-Off',
    'tec9': 'Tec-9',
    'fiveseven': 'Five-SeveN',
    'cz75a': 'CZ75-Auto',
    'revolver': 'R8 Revolver',
    'ak47': 'AK-47',
    'aug': 'AUG',
    'awp': 'AWP',
    'famas': 'FAMAS',
    'g3sg1': 'G3SG1',
    'm249': 'M249',
    'negev': 'Negev',
    'nova': 'Nova',
    'p250': 'P250',
    'p90': 'P90',
    'mp7': 'MP7',
    'mp9': 'MP9',
    'glock': 'Glock-18',
    'taser': 'Zeus x27',
    'knife_canis': 'Survival Knife',
    'knife_cord': 'Paracord Knife',
    'knife_css': 'Classic Knife',
    'knife_gypsy_jackknife': 'Navaja Knife',
    'knife_outdoor': 'Nomad Knife',
    'knife_push': 'Shadow Daggers',
    'knife_survival_bowie': 'Bowie Knife',
    'knife_tactical': 'Huntsman Knife',
    'knife_widowmaker': 'Talon Knife',
    'knife_m9_bayonet': 'M9 Bayonet',
    'knife_karambit': 'Karambit',
    'knife_butterfly': 'Butterfly Knife',
    'knife_falchion': 'Falchion Knife',
    'knife_flip': 'Flip Knife',
    'knife_gut': 'Gut Knife',
    'knife_stiletto': 'Stiletto Knife',
    'knife_ursus': 'Ursus Knife',
    'knife_kukri': 'Kukri Knife',
    'knife_skeleton': 'Skeleton Knife',
    'bayonet': 'Bayonet',
  };

  if (map[name]) return map[name];

  if (name.startsWith('knife_')) {
    return name.replace('knife_', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Knife';
  }
  if (name === 'knife' || name === 'knife_t') return 'Default Knife';

  if (name.includes('agent') || name.includes('customplayer') || name.includes('tm_') || name.includes('ctm_')) return 'Agent';

  if (name.includes('gloves') || name.includes('handwraps')) {
    return name.replace('studded_', '').replace('sporty_', 'sport_').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const getWeaponTeam = (weaponName: string): 'CT' | 'T' | 'BOTH' => {
  const name = weaponName.toLowerCase().replace('weapon_', '');
  
  const ctExclusive = [
    'usp_silencer', 'hkp2000', 'fiveseven', 'mp9', 'famas', 
    'm4a1', 'm4a1_silencer', 'aug', 'scar20', 'mag7', 'knife_ct', 'knife'
  ];
  
  const tExclusive = [
    'glock', 'tec9', 'mac10', 'galilar', 'ak47', 
    'sg556', 'g3sg1', 'sawedoff', 'knife_t'
  ];
  
  if (ctExclusive.includes(name)) return 'CT';
  if (tExclusive.includes(name)) return 'T';
  
  if (name.includes('ctm_')) return 'CT';
  if (name.includes('tm_')) return 'T';
  
  return 'BOTH';
};

const getRarityColor = (weaponName: string, paintName: string) => {
  const name = weaponName.toLowerCase();
  const paint = paintName.toLowerCase();
  
  // Knifes and Gloves are always Gold/Covert
  if (name.includes('knife') || name.includes('bayonet') || name.includes('karambit') || name.includes('shadow_daggers') || name.includes('push') || name.includes('glove') || name.includes('handwraps') || name.includes('tm_') || name.includes('ctm_')) {
    return { color: '#eb4b4b', key: 'covert', bg: 'bg-[#eb4b4b]/10', border: 'border-[#eb4b4b]/30' };
  }

  // Common high-tier skins
  const covertSkins = ['dragon lore', 'howl', 'fire serpent', 'wildfire', 'asiimov', 'printstream', 'doppler', 'fade', 'lore', 'autotronic', 'marble fade', 'crimson web', 'slaughter'];
  if (covertSkins.some(s => paint.includes(s))) {
    return { color: '#eb4b4b', key: 'covert', bg: 'bg-[#eb4b4b]/10', border: 'border-[#eb4b4b]/30' };
  }

  const classifiedSkins = ['blood in the water', 'vulcan', 'hyper beast', 'neon rider', 'kill confirmed', 'buzz kill', 'fuel injector'];
  if (classifiedSkins.some(s => paint.includes(s))) {
    return { color: '#d32ce6', key: 'classified', bg: 'bg-[#d32ce6]/10', border: 'border-[#d32ce6]/30' };
  }

  const restrictedSkins = ['redline', 'frontside misty', 'mecha industries', 'point disarray', 'desolate space'];
  if (restrictedSkins.some(s => paint.includes(s))) {
    return { color: '#8847ff', key: 'restricted', bg: 'bg-[#8847ff]/10', border: 'border-[#8847ff]/30' };
  }

  const milSpecSkins = ['blue ply', 'elite build', 'safari mesh', 'sand dune', 'slate'];
  if (milSpecSkins.some(s => paint.includes(s))) {
    return { color: '#4b69ff', key: 'milSpec', bg: 'bg-[#4b69ff]/10', border: 'border-[#4b69ff]/30' };
  }

  // Default to Mil-Spec for others if not specified
  return { color: '#4b69ff', key: 'milSpec', bg: 'bg-[#4b69ff]/10', border: 'border-[#4b69ff]/30' };
};

const CATEGORY_ICONS: Record<string, string> = {
  Knifes: "https://dashskins.gg/icons/knife.svg",
  Gloves: "https://dashskins.gg/icons/gloves.svg",
  Rifles: "https://dashskins.gg/icons/rifles.svg",
  Pistols: "https://dashskins.gg/icons/pistol.svg",
  Snipers: "https://dashskins.gg/icons/rifles.svg",
  SMGs: "https://dashskins.gg/icons/smg.svg",
  Heavy: "https://dashskins.gg/icons/heavy.svg",
  Other: "https://dashskins.gg/icons/zeus.svg",
  Agents: "https://dashskins.gg/icons/agent.svg"
};

const CHARMS_LIST = [
  { id: 'baby_karambit', name: 'Baby Karambit', image: 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/master/game/csgo/pak01_dir/resource/flash/econ/charms/baby_karambit.png' },
  { id: 'chicken', name: 'Chicken', image: 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/master/game/csgo/pak01_dir/resource/flash/econ/charms/chicken.png' },
];

export default function App() {
  const [weaponCategories, setWeaponCategories] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("Knifes");
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [allSkins, setAllSkins] = useState<Skin[]>([]);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [allStickers, setAllStickers] = useState<{id: string, name: string, image: string}[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stickerSearchQuery, setStickerSearchQuery] = useState("");
  const [isMobileConfigOpen, setIsMobileConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStickerEditorOpen, setIsStickerEditorOpen] = useState(false);
  const [currentStickers, setCurrentStickers] = useState<StickerInstance[]>([]);
  const [currentCharms, setCurrentCharms] = useState<CharmInstance[]>([]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cs2-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [equippedSkins, setEquippedSkins] = useState<Record<string, EquippedSkin>>(() => {
    const saved = localStorage.getItem('cs2-loadout');
    return saved ? JSON.parse(saved) : {};
  });
  const [viewMode, setViewMode] = useState<'browse' | 'loadout'>('browse');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showUniversalPaints, setShowUniversalPaints] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string}>({ show: false, message: "" });
  const [steamId, setSteamId] = useState<string>(() => localStorage.getItem('cs2-steamid') || "");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [language, setLanguage] = useState<keyof typeof translations>(() => (localStorage.getItem('cs2-lang') as any) || "en");
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('cs2-theme') as any) || "dark");
  const [tempSteamId, setTempSteamId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<'CT' | 'T' | null>(() => {
    const saved = localStorage.getItem('cs2-team');
    return (saved === 'CT' || saved === 'T') ? saved : null;
  });

  // DB and App URL settings
  const [dbHost, setDbHost] = useState(() => localStorage.getItem('cs2-db-host') || "");
  const [dbUser, setDbUser] = useState(() => localStorage.getItem('cs2-db-user') || "");
  const [dbPass, setDbPass] = useState(() => localStorage.getItem('cs2-db-pass') || "");
  const [dbPort, setDbPort] = useState(() => localStorage.getItem('cs2-db-port') || "");
  const [dbName, setDbName] = useState(() => localStorage.getItem('cs2-db-name') || "");
  const [appUrl, setAppUrl] = useState(() => localStorage.getItem('cs2-app-url') || "");

  const handleSaveSettings = () => {
    localStorage.setItem('cs2-db-host', dbHost);
    localStorage.setItem('cs2-db-user', dbUser);
    localStorage.setItem('cs2-db-pass', dbPass);
    localStorage.setItem('cs2-db-port', dbPort);
    localStorage.setItem('cs2-db-name', dbName);
    localStorage.setItem('cs2-app-url', appUrl);
    setToast({ show: true, message: "Settings saved successfully!" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('cs2-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cs2-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const clearLoadout = () => {
    setEquippedSkins({});
    localStorage.removeItem('cs2-loadout');
    setToast({ show: true, message: "Loadout cleared successfully!" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };


  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('cs2-team', selectedTeam);
      
      // Clear selected weapon if it's not available for the new team
      if (selectedWeapon) {
        const weaponTeam = getWeaponTeam(selectedWeapon);
        if (weaponTeam !== 'BOTH' && weaponTeam !== selectedTeam) {
          setSelectedWeapon(null);
        }
      }
    }
  }, [selectedTeam]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [seed, setSeed] = useState<number>(0);
  const [wear, setWear] = useState<number>(0.00001);
  const [stattrak, setStattrak] = useState<number>(-1);
  const [nametag, setNametag] = useState<string>("");

  const [maxPaint, setMaxPaint] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    // Fetch all weapons
    fetch("/api/weapons")
      .then((res) => res.json())
      .then((data: string[]) => {
        const grouped: Record<string, string[]> = {
          Knifes: [],
          Gloves: [],
          Pistols: [],
          SMGs: [],
          Rifles: [],
          Snipers: [],
          Heavy: [],
          Agents: [],
          Other: []
        };
        
        data.forEach(weapon => {
          const cat = getWeaponCategory(weapon);
          if (grouped[cat]) {
            grouped[cat].push(weapon);
          } else {
            grouped.Other.push(weapon);
          }
        });
        
        // Remove empty categories
        Object.keys(grouped).forEach(key => {
          if (grouped[key].length === 0) delete grouped[key];
        });
        
        setWeaponCategories(grouped);
        const cats = Object.keys(grouped);
        if (cats.length > 0) {
          if (cats.includes("Knifes")) {
            setSelectedCategory("Knifes");
          } else {
            setSelectedCategory(cats[0]);
          }
        }
      })
      .catch((err) => console.error("Error fetching weapons:", err));

    // Fetch all skins once
    fetch("/api/skins")
      .then((res) => res.json())
      .then((data: Skin[]) => {
        setAllSkins(data);
        // Find max paint index to determine what's "new"
        const max = Math.max(...data.map(s => Number(s.paint)).filter(p => !isNaN(p)));
        setMaxPaint(max);
      })
      .catch((err) => console.error("Error fetching skins:", err))
      .finally(() => setIsLoading(false));

    // Fetch all agents
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data: Agent[]) => {
        setAllAgents(data);
      })
      .catch((err) => console.error("Error fetching agents:", err));

    // Fetch all stickers
    fetch("/api/stickers")
      .then((res) => res.json())
      .then((data: any[]) => {
        setAllStickers(data);
      })
      .catch((err) => console.error("Error fetching stickers:", err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedWeapon, searchQuery, showFavoritesOnly, viewMode]);

  const filteredSkins = React.useMemo(() => {
    if (selectedCategory === "Agents") {
      return allAgents
        .filter(agent => {
          const matchesSearch = agent.agent_name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesTeam = (agent.team === 2 && selectedTeam === 'T') || (agent.team === 3 && selectedTeam === 'CT');
          return matchesSearch && matchesTeam && agent.model !== "null";
        })
        .map(agent => ({
          weapon_defindex: 5036,
          weapon_name: agent.model === "null" 
            ? (agent.team === 3 ? "ct_sas" : "tt_phoenix") 
            : agent.model,
          paint: "0",
          image: agent.image,
          paint_name: agent.agent_name,
          legacy_model: false
        } as Skin));
    }

    let filtered = allSkins.filter((skin) => {
      const category = getWeaponCategory(skin.weapon_name);
      const matchesCategory = selectedCategory ? category === selectedCategory : true;
      const matchesWeapon = selectedWeapon ? skin.weapon_name === selectedWeapon : true;
      const matchesSearch = skin.paint_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = showFavoritesOnly ? favorites.includes(`${skin.weapon_name}_${skin.paint}`) : true;
      const weaponTeam = getWeaponTeam(skin.weapon_name);
      const matchesTeam = weaponTeam === 'BOTH' || weaponTeam === selectedTeam;
      return matchesCategory && matchesWeapon && matchesSearch && matchesFavorites && matchesTeam;
    });

    if (showUniversalPaints && selectedWeapon) {
      const uniquePaints = new Map<string, Skin>();
      allSkins.forEach(skin => {
        if (skin.paint !== "0" && skin.paint !== 0) {
          if (!uniquePaints.has(String(skin.paint))) {
            uniquePaints.set(String(skin.paint), skin);
          }
        }
      });
      
      filtered = Array.from(uniquePaints.values()).filter(skin => {
        const matchesSearch = skin.paint_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFavorites = showFavoritesOnly ? favorites.includes(`${skin.weapon_name}_${skin.paint}`) : true;
        return matchesSearch && matchesFavorites;
      });
    }

    return filtered.sort((a, b) => Number(b.paint) - Number(a.paint));
  }, [allSkins, selectedCategory, selectedWeapon, searchQuery, favorites, showFavoritesOnly, selectedTeam, showUniversalPaints]);

  const weaponsInCategory = selectedCategory && weaponCategories[selectedCategory] 
    ? weaponCategories[selectedCategory]
        .filter(weaponName => {
          const weaponTeam = getWeaponTeam(weaponName);
          return weaponTeam === 'BOTH' || weaponTeam === selectedTeam;
        })
        .map(weaponName => {
          const defaultSkin = allSkins.find(s => s.weapon_name === weaponName && (Number(s.paint) === 0 || s.paint === "0")) 
            || allSkins.find(s => s.weapon_name === weaponName);
          return { name: weaponName, skin: defaultSkin };
        }).filter(w => w.skin)
    : [];

  const loadoutSkins = React.useMemo(() => {
    const filtered = (Object.values(equippedSkins) as EquippedSkin[]).filter((equipped) => {
      const matchesSearch = equipped.skin.paint_name.toLowerCase().includes(searchQuery.toLowerCase());
      const weaponTeam = getWeaponTeam(equipped.skin.weapon_name);
      const matchesTeam = equipped.team ? equipped.team === selectedTeam : (weaponTeam === 'BOTH' || weaponTeam === selectedTeam);
      return matchesSearch && matchesTeam;
    });

    return filtered.sort((a, b) => Number(b.skin.paint) - Number(a.skin.paint));
  }, [equippedSkins, searchQuery, selectedTeam]);

  const currentItems = (selectedCategory === "Agents" || selectedWeapon) && viewMode === 'browse' ? filteredSkins : (!selectedWeapon && viewMode === 'browse' ? weaponsInCategory : loadoutSkins.map(e => e.skin));
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const paginatedItems = currentItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleFavorite = (e: React.MouseEvent, skin: Skin) => {
    e.stopPropagation();
    const id = `${skin.weapon_name}_${skin.paint}`;
    setFavorites(prev => {
      const newFavs = prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('cs2-favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const fetchLoadout = async (sid: string) => {
    try {
      const res = await fetch(`/api/loadout/${sid}`);
      if (res.ok) {
        const data = await res.json();
        setEquippedSkins(data);
        localStorage.setItem('cs2-loadout', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to fetch loadout", err);
    }
  };

  useEffect(() => {
    if (steamId) {
      fetchLoadout(steamId);
    }
  }, []);

  const handleUnequip = async () => {
    if (!selectedWeapon || !selectedSkin) return;
    
    const newEquipped = { ...equippedSkins };
    delete newEquipped[`${selectedWeapon}_${selectedTeam}`];
    delete newEquipped[`${selectedWeapon}_BOTH`];
    setEquippedSkins(newEquipped);
    localStorage.setItem('cs2-loadout', JSON.stringify(newEquipped));
    
    if (steamId) {
      try {
        await fetch(`/api/loadout/${steamId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEquipped)
        });
      } catch (err) {
        console.error("Failed to save loadout to server", err);
      }
    }
    
    setToast({ show: true, message: `Unequipped ${selectedSkin.paint_name}!` });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
    setIsMobileConfigOpen(false);
  };

  const handleSave = async () => {
    if (!selectedSkin || !selectedWeapon) return;
    
    const newEquipped = { ...equippedSkins };
    
    const isKnife = selectedWeapon.startsWith('weapon_knife') || selectedWeapon === 'weapon_bayonet';
    if (isKnife) {
      Object.keys(newEquipped).forEach(key => {
        const item = newEquipped[key];
        const weaponName = item.skin.weapon_name;
        if ((weaponName.startsWith('weapon_knife') || weaponName === 'weapon_bayonet') && item.team === selectedTeam) {
          delete newEquipped[key];
        }
      });
    }
    
    const isGlove = selectedWeapon.includes('gloves') || selectedWeapon.includes('handwraps');
    if (isGlove) {
      Object.keys(newEquipped).forEach(key => {
        const item = newEquipped[key];
        const weaponName = item.skin.weapon_name;
        if ((weaponName.includes('gloves') || weaponName.includes('handwraps')) && item.team === selectedTeam) {
          delete newEquipped[key];
        }
      });
    }

    const isAgent = selectedWeapon.includes('agent') || selectedWeapon.includes('custom_player') || selectedWeapon.includes('customplayer') || selectedWeapon.includes('tm_') || selectedWeapon.includes('ctm_') || selectedWeapon.includes('ct_sas') || selectedWeapon.includes('tt_phoenix');
    if (isAgent) {
      Object.keys(newEquipped).forEach(key => {
        const item = newEquipped[key];
        const weaponName = item.skin.weapon_name;
        const isKeyAgent = weaponName.includes('agent') || weaponName.includes('custom_player') || weaponName.includes('customplayer') || weaponName.includes('tm_') || weaponName.includes('ctm_') || weaponName.includes('ct_sas') || weaponName.includes('tt_phoenix');
        if (isKeyAgent && item.team === selectedTeam) {
          delete newEquipped[key];
        }
      });
    }

    const isMusic = selectedWeapon.includes('music') || selectedWeapon.includes('musickit');
    if (isMusic) {
      Object.keys(newEquipped).forEach(key => {
        const item = newEquipped[key];
        const weaponName = item.skin.weapon_name;
        if (weaponName.includes('music') || weaponName.includes('musickit')) {
          delete newEquipped[key];
        }
      });
    }
    
    // Find the correct defindex for the selected weapon
    const targetWeaponSkin = allSkins.find(s => s.weapon_name === selectedWeapon);
    const targetDefindex = targetWeaponSkin ? targetWeaponSkin.weapon_defindex : selectedSkin.weapon_defindex;

    const skinToSave = {
      ...selectedSkin,
      weapon_name: selectedWeapon,
      weapon_defindex: targetDefindex
    };

    const finalTeam = isMusic ? undefined : (selectedTeam || undefined);

    newEquipped[`${selectedWeapon}_${finalTeam || 'BOTH'}`] = {
      skin: skinToSave,
      config: { 
        wear, 
        seed, 
        stattrak, 
        nametag,
        stickers: currentStickers,
        charms: currentCharms
      },
      team: finalTeam
    };
    
    setEquippedSkins(newEquipped);
    localStorage.setItem('cs2-loadout', JSON.stringify(newEquipped));
    
    if (steamId) {
      try {
        await fetch(`/api/loadout/${steamId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEquipped)
        });
      } catch (err) {
        console.error("Failed to save loadout to server", err);
      }
    }
    
    setToast({ show: true, message: `Successfully equipped ${selectedSkin.paint_name}!` });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleClearLoadout = async () => {
    setEquippedSkins({});
    localStorage.setItem('cs2-loadout', JSON.stringify({}));
    
    if (steamId) {
      try {
        await fetch(`/api/loadout/${steamId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
      } catch (err) {
        console.error("Failed to clear loadout on server", err);
      }
    }
    
    setToast({ show: true, message: "Loadout cleared!" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!selectedTeam) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        </div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl relative z-10"
        >
          {/* CT Side */}
          <motion.button
            variants={{
              hidden: { opacity: 0, x: -50 },
              show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTeam('CT')}
            className="group relative aspect-[4/5] bg-zinc-900/40 backdrop-blur-md border border-blue-500/20 rounded-[2rem] overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <img 
              src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nz6XRk-fO8YaVjNPndVz-Ul74hsbNoHi21kUly6mrQzNagcijBPQEnCsciTOdY4Rm6m4XvN_SiuVLIl2LQXw" 
              alt="Counter-Terrorist"
              className="w-full h-full object-cover object-top opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            
            {/* Decorative Elements */}
            <div className="absolute top-6 left-6 flex flex-col gap-1">
              <div className="w-8 h-[2px] bg-blue-500/50" />
              <div className="w-4 h-[2px] bg-blue-500/30" />
            </div>
            
            <div className="absolute bottom-10 inset-x-0 text-center transform transition-transform duration-500 group-hover:translate-y-[-10px]">
              <div className="text-[10rem] font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                CT
              </div>
            </div>
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
          </motion.button>

          {/* T Side */}
          <motion.button
            variants={{
              hidden: { opacity: 0, x: 50 },
              show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTeam('T')}
            className="group relative aspect-[4/5] bg-zinc-900/40 backdrop-blur-md border border-red-500/20 rounded-[2rem] overflow-hidden transition-all hover:border-red-500/50 hover:shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <img 
              src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3Waj-0h4LM5H3jjzR9-4zmHzIuucXOWaAEkCsR5FrFcsEG5wNGzNeng71TAy9UScc7Ksy8" 
              alt="Terrorist"
              className="w-full h-full object-cover object-top opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            
            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
              <div className="w-8 h-[2px] bg-red-500/50" />
              <div className="w-4 h-[2px] bg-red-500/30" />
            </div>
            
            <div className="absolute bottom-10 inset-x-0 text-center transform transition-transform duration-500 group-hover:translate-y-[-10px]">
              <div className="text-[10rem] font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                T
              </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-zinc-50 text-zinc-900' : 'bg-[#09090b] text-zinc-300'} bg-grid-white font-sans flex flex-col selection:bg-amber-500/30 transition-colors duration-300`}>
      {/* Navbar - Glassmorphism */}
      <nav className={`${theme === 'light' ? 'bg-white/80 border-zinc-200' : 'bg-[#09090b]/80 border-white/5'} backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20">
              <img src="https://i.imgur.com/j2ga6te.png" alt="Nhick Skins Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className={`font-bold text-xl tracking-tight ${theme === 'light' ? 'text-zinc-900' : 'text-white'} hidden sm:block`}>
              Nhick<span className="text-amber-500 font-light"> Skins</span>
            </span>
          </div>
          
          <div className={`hidden md:flex items-center ${theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-black/40 border-white/5'} border rounded-xl p-1`}>
            <button
              onClick={() => setSelectedTeam('CT')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedTeam === 'CT' 
                  ? 'bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-blue-500/30 bg-blue-500/10">
                <img 
                  src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nz6XRk-fO8YaVjNPndVz-Ul74hsbNoHi21kUly6mrQzNagcijBPQEnCsciTOdY4Rm6m4XvN_SiuVLIl2LQXw" 
                  alt="CT" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              CT
            </button>
            <button
              onClick={() => setSelectedTeam('T')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedTeam === 'T' 
                  ? 'bg-red-500/20 text-red-400 shadow-sm border border-red-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-red-500/30 bg-red-500/10">
                <img 
                  src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3Waj-0h4LM5H3jjzR9-4zmHzIuucXOWaAEkCsR5FrFcsEG5wNGzNeng71TAy9UScc7Ksy8" 
                  alt="T" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              T
            </button>
          </div>

          <div className={`w-px h-6 ${theme === 'light' ? 'bg-zinc-200' : 'bg-white/5'} mx-2 hidden md:block`} />

          <div className={`hidden md:flex items-center ${theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-black/40 border-white/5'} border rounded-xl p-1`}>
            <button
              onClick={() => setViewMode('browse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'browse' 
                  ? `${theme === 'light' ? 'bg-white text-zinc-900' : 'bg-white/10 text-white'} shadow-sm` 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              {t.browse}
            </button>
            <button
              onClick={() => setViewMode('loadout')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'loadout' 
                  ? `${theme === 'light' ? 'bg-white text-zinc-900' : 'bg-white/10 text-white'} shadow-sm` 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Backpack className="w-4 h-4" />
              {t.loadout}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`md:hidden flex items-center ${theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-black/40 border-white/5'} border rounded-xl p-1 mr-2`}>
            <button
              onClick={() => setSelectedTeam('CT')}
              className={`p-1 rounded-lg transition-all ${
                selectedTeam === 'CT' ? 'bg-blue-500/20 ring-1 ring-blue-500/30' : 'opacity-50'
              }`}
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-blue-500/20">
                <img 
                  src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fh7lk6nz6XRk-fO8YaVjNPndVz-Ul74hsbNoHi21kUly6mrQzNagcijBPQEnCsciTOdY4Rm6m4XvN_SiuVLIl2LQXw" 
                  alt="CT" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </button>
            <button
              onClick={() => setSelectedTeam('T')}
              className={`p-1 rounded-lg transition-all ${
                selectedTeam === 'T' ? 'bg-red-500/20 ring-1 ring-red-500/30' : 'opacity-50'
              }`}
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-red-500/20">
                <img 
                  src="https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3Waj-0h4LM5H3jjzR9-4zmHzIuucXOWaAEkCsR5FrFcsEG5wNGzNeng71TAy9UScc7Ksy8" 
                  alt="T" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </button>
          </div>
          <div className={`md:hidden flex items-center ${theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-black/40 border-white/5'} border rounded-xl p-1 mr-2`}>
            <button
              onClick={() => setViewMode('browse')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'browse' ? `${theme === 'light' ? 'bg-white text-zinc-900' : 'bg-white/10 text-white'}` : 'text-zinc-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('loadout')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'loadout' ? `${theme === 'light' ? 'bg-white text-zinc-900' : 'bg-white/10 text-white'}` : 'text-zinc-400'
              }`}
            >
              <Backpack className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className={`p-2.5 rounded-xl transition-all border ${theme === 'light' ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900' : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white'} shadow-sm`}
          >
            <Settings className="w-5 h-5" />
          </button>

          <button 
            onClick={() => {
              if (steamId) {
                setSteamId("");
                localStorage.removeItem('cs2-steamid');
                setEquippedSkins({});
                localStorage.removeItem('cs2-loadout');
              } else {
                setTempSteamId("");
                setIsLoginModalOpen(true);
              }
            }}
            className={`flex items-center gap-2 ${theme === 'light' ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-[#171a21]/80 hover:bg-[#171a21] text-zinc-300 hover:text-white'} px-5 py-2.5 rounded-xl transition-all text-sm font-medium border border-white/5 hover:border-white/10 shadow-sm`}
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">{steamId ? `${t.signOut} (${steamId})` : t.signIn}</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#09090b] relative">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Skin Grid */}
          <div className="flex-1 flex flex-col border-r border-white/5 min-w-0 z-10">
            <div className="p-6 border-b border-white/5 bg-[#09090b]/50 backdrop-blur-sm flex flex-col gap-6">
              {/* Category Navigation - Horizontal */}
              {viewMode === 'browse' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                  {Object.keys(weaponCategories).map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedWeapon(null);
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                          isSelected
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                            : `${theme === 'light' ? 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300' : 'bg-[#121214] text-zinc-400 border-white/5 hover:border-white/10'} hover:text-zinc-200`
                        }`}
                      >
                        <div className={`w-6 h-6 flex items-center justify-center transition-all ${isSelected ? 'opacity-100 scale-110' : 'opacity-40 group-hover:opacity-70'}`}>
                          <img 
                            src={CATEGORY_ICONS[category]} 
                            alt={category}
                            className={`w-full h-full object-contain transition-all ${
                              theme === 'dark' ? 'brightness-0 invert' : 'brightness-0'
                            } ${isSelected ? 'brightness-100' : ''}`}
                            style={isSelected ? { 
                              filter: 'sepia(100%) saturate(300%) brightness(90%) hue-rotate(10deg)' 
                            } : {}}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span>{t[category.toLowerCase() as keyof typeof t] || category}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {selectedWeapon && viewMode === 'browse' && (
                    <button 
                      onClick={() => setSelectedWeapon(null)}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white border border-white/5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                    <div className="relative flex-1 max-w-2xl">
                      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder={viewMode === 'browse' ? (selectedWeapon ? `${t.searchSkins} ${formatWeaponName(selectedWeapon)}...` : t.searchWeapons) : t.searchLoadout}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full ${theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#121214] border-white/5 text-zinc-200'} border rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600 shadow-inner`}
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                </div>
                
                {viewMode === 'browse' && (
                  <>
                    {selectedWeapon && (
                      <button
                        onClick={() => setShowUniversalPaints(!showUniversalPaints)}
                        className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${
                          showUniversalPaints 
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                            : `${theme === 'light' ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300' : 'bg-[#121214] border-white/5 text-zinc-400 hover:border-white/10'} hover:text-zinc-200`
                        }`}
                        title={t.universalPaints}
                      >
                        <Globe className={`w-4 h-4 ${showUniversalPaints ? 'text-indigo-400' : ''}`} />
                        <span className="hidden sm:inline">{t.universalPaints}</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${
                        showFavoritesOnly 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                          : `${theme === 'light' ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300' : 'bg-[#121214] border-white/5 text-zinc-400 hover:border-white/10'} hover:text-zinc-200`
                      }`}
                    >
                      <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-400' : ''}`} />
                      <span className="hidden sm:inline">{t.favoritesOnly}</span>
                    </button>
                  </>
                )}

                {viewMode === 'loadout' && (
                  <button
                    onClick={handleClearLoadout}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all border shrink-0 bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.clearLoadout}</span>
                  </button>
                )}
              </div>

              {/* Breadcrumbs / Title */}
              {viewMode === 'browse' && (
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span className={!selectedWeapon ? "text-amber-500" : ""}>{t[selectedCategory.toLowerCase() as keyof typeof t] || selectedCategory}</span>
                  {selectedWeapon && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-amber-500">{formatWeaponName(selectedWeapon)}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {isLoading && viewMode === 'browse' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : currentItems.length > 0 ? (
                <div className="flex flex-col h-full">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mb-8"
                  >
                    {paginatedItems.map((item: any) => {
                      if ('name' in item) {
                        // Render Weapons List
                        const weapon = item;
                        return (
                          <motion.div
                            variants={itemVariants}
                            key={weapon.name}
                            onClick={() => setSelectedWeapon(weapon.name)}
                            className="cursor-pointer group relative flex flex-col items-center p-4 rounded-2xl border bg-[#121214]/80 backdrop-blur-sm border-white/5 hover:border-white/10 hover:bg-[#18181b] transition-all duration-300"
                          >
                            <div className="w-full aspect-[4/3] relative mb-4 flex items-center justify-center">
                              <img
                                src={weapon.skin?.image}
                                alt={weapon.name}
                                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="w-full text-center mt-auto">
                              <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100">
                                {formatWeaponName(weapon.name)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      } else {
                        // Render Skins List
                        const skin = item;
                        const isSelected = selectedSkin?.paint === skin.paint && selectedSkin?.weapon_name === skin.weapon_name;
                        const isFavorited = favorites.includes(`${skin.weapon_name}_${skin.paint}`);
                        const isEquipped = showUniversalPaints && selectedWeapon
                          ? (equippedSkins[`${selectedWeapon}_${selectedTeam}`]?.skin.paint === skin.paint || equippedSkins[`${selectedWeapon}_BOTH`]?.skin.paint === skin.paint)
                          : (equippedSkins[`${skin.weapon_name}_${selectedTeam}`]?.skin.paint === skin.paint || equippedSkins[`${skin.weapon_name}_BOTH`]?.skin.paint === skin.paint);
                        const isNew = Number(skin.paint) > 0 && Number(skin.paint) >= maxPaint - 50;
                        
                        return (
                          <motion.div
                            variants={itemVariants}
                            key={`${skin.weapon_name}-${skin.paint}`}
                            onClick={() => {
                              setSelectedSkin(skin);
                              if (!showUniversalPaints || !selectedWeapon) {
                                setSelectedWeapon(skin.weapon_name);
                              }
                              const targetWeapon = showUniversalPaints && selectedWeapon ? selectedWeapon : skin.weapon_name;
                              const equipped = equippedSkins[`${targetWeapon}_${selectedTeam}`] || equippedSkins[`${targetWeapon}_BOTH`];
                              if (equipped && equipped.skin.paint === skin.paint) {
                                setWear(equipped.config.wear);
                                setSeed(equipped.config.seed);
                                setStattrak(equipped.config.stattrak);
                                setNametag(equipped.config.nametag);
                                setCurrentStickers(equipped.config.stickers || []);
                                setCurrentCharms(equipped.config.charms || []);
                              } else {
                                setWear(0.01);
                                setSeed(1);
                                setStattrak(-1);
                                setNametag("");
                                setCurrentStickers([]);
                                setCurrentCharms([]);
                              }
                              setIsMobileConfigOpen(true);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedSkin(skin);
                                setSelectedWeapon(skin.weapon_name);
                                setIsMobileConfigOpen(true);
                              }
                            }}
                            className={`cursor-pointer group relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${
                              isSelected
                                ? `bg-gradient-to-b ${getRarityColor(skin.weapon_name, skin.paint_name).bg} to-[#18181b] border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20`
                                : "bg-[#121214]/80 backdrop-blur-sm border-white/5 hover:border-white/10 hover:bg-[#18181b]"
                            } ${isNew ? 'ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : ''}`}
                          >
                            {isNew && (
                              <div className="absolute -top-2 -right-2 z-30 bg-gradient-to-r from-amber-400 to-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-orange-500/40 animate-bounce flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                NEWS
                              </div>
                            )}
                            
                            <button 
                              onClick={(e) => toggleFavorite(e, skin)}
                              className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/40 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110"
                            >
                              <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}`} />
                            </button>
                            {isFavorited && <Star className="w-4 h-4 fill-amber-400 text-amber-400 absolute top-4 right-4 z-10 opacity-100 group-hover:opacity-0 transition-opacity" />}
                            
                            {isEquipped && (
                              <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                <Shield className="w-3 h-3" />
                                <span>Equipped</span>
                              </div>
                            )}
                            
                            <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-white/[0.02] to-transparent rounded-t-2xl pointer-events-none" />
                            
                            <div className="w-full aspect-[4/3] relative mb-4 flex items-center justify-center">
                              <div className={`absolute inset-0 ${getRarityColor(skin.weapon_name, skin.paint_name).bg} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                              <img
                                src={skin.image}
                                alt={skin.paint_name}
                                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="w-full text-left mt-auto">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                {formatWeaponName(skin.weapon_name)}
                              </p>
                              <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-amber-400 transition-colors">
                                {skin.paint_name}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getRarityColor(skin.weapon_name, skin.paint_name).border} ${getRarityColor(skin.weapon_name, skin.paint_name).bg} text-zinc-300`}>
                                  {t[getRarityColor(skin.weapon_name, skin.paint_name).key as keyof typeof t] || getRarityColor(skin.weapon_name, skin.paint_name).key}
                                </span>
                              </div>
                            </div>

                            {/* Rarity Bar */}
                            <div className="absolute bottom-0 inset-x-0 h-1 rounded-b-2xl overflow-hidden">
                              <div className="w-full h-full" style={{ backgroundColor: getRarityColor(skin.weapon_name, skin.paint_name).color }} />
                            </div>
                          </motion.div>
                        );
                      }
                    })}
                  </motion.div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-auto pb-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          // Show only current page, first, last, and neighbors
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-xl border transition-all font-medium text-sm ${
                                  currentPage === pageNum
                                    ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                    : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPage - 2 || 
                            pageNum === currentPage + 2
                          ) {
                            return <span key={pageNum} className="text-zinc-600 px-1">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    {viewMode === 'loadout' && !searchQuery ? (
                      <Backpack className="w-8 h-8 text-zinc-600" />
                    ) : (
                      <Search className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>
                  <p className="text-sm">
                    {viewMode === 'loadout' && !searchQuery 
                      ? "Your loadout is empty. Browse and equip some skins!" 
                      : `No paints found matching "${searchQuery}"`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className={`
            fixed inset-0 z-50 bg-[#09090b] flex flex-col
            lg:relative lg:inset-auto lg:w-[400px] lg:shrink-0 lg:border-l lg:border-white/5 lg:z-20
            transition-transform duration-300
            ${isMobileConfigOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          `}>
            {selectedSkin ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedSkin.paint}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  {/* Mobile Header */}
                  <div className={`flex items-center justify-between p-4 border-b ${theme === 'light' ? 'border-zinc-200 bg-white/80' : 'border-white/5 bg-[#09090b]/80'} backdrop-blur-xl shrink-0 z-10 lg:hidden`}>
                    <h2 className={`font-bold ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{t.settings}</h2>
                    <button 
                      onClick={() => setIsMobileConfigOpen(false)}
                      className={`p-2 ${theme === 'light' ? 'hover:bg-zinc-100' : 'hover:bg-white/5'} rounded-xl transition-colors`}
                    >
                      <X className="w-5 h-5 text-zinc-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
                    {/* Showcase Area */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-transparent rounded-3xl blur-2xl" />
                      <div className={`w-full aspect-square ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-[#121214] border-white/10'} rounded-3xl border flex items-center justify-center p-8 relative overflow-hidden group`}>
                        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-${theme === 'light' ? 'white' : '[#121214]'} opacity-80`} />
                        
                        <img
                          src={selectedSkin.image}
                          alt={selectedSkin.paint_name}
                          className="max-w-[110%] max-h-[110%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] relative z-10 group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                          <h3 className={`font-bold text-2xl ${theme === 'light' ? 'text-zinc-900' : 'text-white'} tracking-tight`}>{selectedSkin.paint_name.split('|')[1]?.trim() || selectedSkin.paint_name}</h3>
                          <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1.5 font-mono">ID: {selectedSkin.paint}</p>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                      {/* Wear Slider */}
                      <div className={`space-y-3 ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-[#121214] border-white/5'} p-5 rounded-2xl border`}>
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-zinc-300">{t.wear}</label>
                          <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                            {wear.toFixed(5)}
                          </span>
                        </div>
                        <div className="pt-2 pb-1 relative">
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-[#10b981] via-[#84cc16] via-[#facc15] via-[#f97316] to-[#ef4444] opacity-60 pointer-events-none" />
                          <input
                            type="range"
                            min="0.00001"
                            max="1.0"
                            step="0.00001"
                            value={wear}
                            onChange={(e) => setWear(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-transparent rounded-full appearance-none cursor-pointer relative z-10"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          <span className={wear < 0.07 ? "text-[#10b981]" : ""}>FN</span>
                          <span className={wear >= 0.07 && wear < 0.15 ? "text-[#84cc16]" : ""}>MW</span>
                          <span className={wear >= 0.15 && wear < 0.38 ? "text-[#facc15]" : ""}>FT</span>
                          <span className={wear >= 0.38 && wear < 0.45 ? "text-[#f97316]" : ""}>WW</span>
                          <span className={wear >= 0.45 ? "text-[#ef4444]" : ""}>BS</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.pattern}</label>
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            value={seed}
                            onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                            className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-mono transition-all shadow-inner placeholder:text-zinc-600`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">StatTrak™</label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setStattrak(stattrak >= 0 ? -1 : 0)}
                              className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${
                                stattrak >= 0 
                                  ? "bg-amber-500/10 border-amber-500/50 text-amber-500" 
                                  : `${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-400' : 'bg-black/40 border-white/10 text-zinc-600'} hover:border-white/20`
                              }`}
                            >
                              {stattrak >= 0 ? <Check className="w-5 h-5" /> : <div className="w-5 h-5" />}
                            </button>
                            <div className="relative flex-1">
                              <input
                                type="number"
                                min="0"
                                placeholder={t.killsCount}
                                value={stattrak >= 0 ? stattrak : ""}
                                disabled={stattrak < 0}
                                onChange={(e) => setStattrak(parseInt(e.target.value) || 0)}
                                className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 font-mono transition-all shadow-inner placeholder:text-zinc-600 ${
                                  stattrak < 0 ? "opacity-30 cursor-not-allowed" : ""
                                }`}
                              />
                              {stattrak >= 0 && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-500/50 uppercase tracking-tighter">{t.kills}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.nametag}</label>
                        <input
                          type="text"
                          placeholder={t.customName}
                          maxLength={20}
                          value={nametag}
                          onChange={(e) => setNametag(e.target.value)}
                          className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner placeholder:text-zinc-600`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sticky Bottom Actions */}
                  <div className={`p-6 lg:p-8 border-t ${theme === 'light' ? 'border-zinc-200 bg-white/80' : 'border-white/5 bg-[#09090b]/80'} backdrop-blur-xl shrink-0`}>
                    <div className="flex gap-3">
                      {(equippedSkins[`${selectedWeapon}_${selectedTeam}`]?.skin.paint === selectedSkin.paint || equippedSkins[`${selectedWeapon}_BOTH`]?.skin.paint === selectedSkin.paint) && (
                        <button 
                          onClick={handleUnequip}
                          className="px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all flex items-center justify-center group"
                          title={t.unequip}
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      )}

                      <button 
                        onClick={() => {
                          handleSave();
                          setIsMobileConfigOpen(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transform hover:-translate-y-1"
                      >
                        <Sparkles className="w-6 h-6" />
                        {t.apply}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-6 hidden lg:flex">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme === 'light' ? 'from-zinc-100 to-white' : 'from-white/5 to-white/0'} border ${theme === 'light' ? 'border-zinc-200' : 'border-white/5'} flex items-center justify-center shadow-2xl`}>
                  <PaintBucket className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-300'}`}>{t.noPaint}</h3>
                  <p className="text-sm max-w-[250px] mx-auto">{t.chooseWeapon}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sticker Editor Modal */}
      <AnimatePresence>
        {isStickerEditorOpen && selectedSkin && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStickerEditorOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className={`relative w-full max-w-6xl h-[85vh] ${theme === 'light' ? 'bg-white' : 'bg-[#09090b]'} rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl`}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t.stickersAndCharms}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{selectedSkin.paint_name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsStickerEditorOpen(false)}
                  className="p-3 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Editor Content */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Preview Area */}
                <div className="flex-1 relative bg-[#050505] flex items-center justify-center overflow-hidden p-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
                  
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Weapon Image */}
                    <img 
                      src={selectedSkin.image} 
                      alt={selectedSkin.paint_name}
                      className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Stickers Layer */}
                    <div className="absolute inset-0">
                      {currentStickers.map((sticker) => (
                        <motion.div
                          key={sticker.id}
                          drag
                          dragMomentum={false}
                          onDragEnd={(_, info) => {
                            setCurrentStickers(prev => prev.map(s => 
                              s.id === sticker.id 
                                ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y } 
                                : s
                            ));
                          }}
                          initial={{ x: sticker.x, y: sticker.y, scale: sticker.scale, rotate: sticker.rotation }}
                          animate={{ x: sticker.x, y: sticker.y, scale: sticker.scale, rotate: sticker.rotation }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-move group"
                          style={{ width: 100, height: 100 }}
                        >
                          <div className="relative w-full h-full">
                            <img 
                              src={sticker.image} 
                              alt={sticker.name}
                              className="w-full h-full object-contain drop-shadow-lg"
                              referrerPolicy="no-referrer"
                            />
                            <button 
                              onClick={() => setCurrentStickers(prev => prev.filter(s => s.id !== sticker.id))}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            
                            {/* Controls */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                              <button 
                                onClick={() => setCurrentStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, scale: Math.max(0.5, s.scale - 0.1) } : s))}
                                className="p-1 hover:text-amber-500"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-[10px] font-bold min-w-[3ch] text-center">{Math.round(sticker.scale * 100)}%</span>
                              <button 
                                onClick={() => setCurrentStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, scale: Math.min(2, s.scale + 0.1) } : s))}
                                className="p-1 hover:text-amber-500"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Charms Layer */}
                    <div className="absolute inset-0">
                      {currentCharms.map((charm) => (
                        <motion.div
                          key={charm.id}
                          drag
                          dragMomentum={false}
                          onDragEnd={(_, info) => {
                            setCurrentCharms(prev => prev.map(c => 
                              c.id === charm.id 
                                ? { ...c, x: c.x + info.offset.x, y: c.y + info.offset.y } 
                                : c
                            ));
                          }}
                          initial={{ x: charm.x, y: charm.y }}
                          animate={{ x: charm.x, y: charm.y }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-move group"
                          style={{ width: 60, height: 60 }}
                        >
                          <div className="relative w-full h-full">
                            <img 
                              src={charm.image} 
                              alt={charm.name}
                              className="w-full h-full object-contain drop-shadow-lg"
                              referrerPolicy="no-referrer"
                            />
                            <button 
                              onClick={() => setCurrentCharms(prev => prev.filter(c => c.id !== charm.id))}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 border-l border-white/5 flex flex-col shrink-0">
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Stickers Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.addSticker}</h4>
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{currentStickers.length}/5</span>
                      </div>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder={t.searchStickers}
                          value={stickerSearchQuery}
                          onChange={(e) => setStickerSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {allStickers
                          .filter(s => s.name.toLowerCase().includes(stickerSearchQuery.toLowerCase()))
                          .slice(0, 30)
                          .map(sticker => (
                          <button
                            key={sticker.id}
                            disabled={currentStickers.length >= 5}
                            onClick={() => {
                              setCurrentStickers(prev => [...prev, {
                                id: Math.random().toString(36).substr(2, 9),
                                stickerId: sticker.id,
                                name: sticker.name,
                                image: sticker.image,
                                x: 0,
                                y: 0,
                                scale: 1,
                                rotation: 0
                              }]);
                            }}
                            className="aspect-square rounded-xl bg-white/5 border border-white/5 p-2 hover:border-amber-500/50 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            title={sticker.name}
                          >
                            <img src={sticker.image} alt={sticker.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Charms Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.addCharm}</h4>
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{currentCharms.length}/1</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {CHARMS_LIST.map(charm => (
                          <button
                            key={charm.id}
                            disabled={currentCharms.length >= 1}
                            onClick={() => {
                              setCurrentCharms(prev => [...prev, {
                                id: Math.random().toString(36).substr(2, 9),
                                charmId: charm.id,
                                name: charm.name,
                                image: charm.image,
                                x: 0,
                                y: 0
                              }]);
                            }}
                            className="aspect-square rounded-xl bg-white/5 border border-white/5 p-2 hover:border-amber-500/50 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <img src={charm.image} alt={charm.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/5">
                    <button
                      onClick={() => setIsStickerEditorOpen(false)}
                      className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-lg shadow-amber-500/20"
                    >
                      {t.save}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-[#18181b] border-white/10'} border rounded-2xl shadow-2xl overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-zinc-900' : 'text-white'} flex items-center gap-2`}>
                    <Settings className="w-5 h-5 text-amber-500" />
                    {t.settings}
                  </h3>
                  <button 
                    onClick={() => setIsSettingsModalOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-8">
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <label className={`block text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.theme}</label>
                    <div className={`grid grid-cols-2 gap-3 p-1 rounded-xl ${theme === 'light' ? 'bg-zinc-100' : 'bg-black/40'}`}>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          theme === 'dark' 
                            ? 'bg-zinc-800 text-white shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        {t.dark}
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          theme === 'light' 
                            ? 'bg-white text-zinc-900 shadow-sm' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        {t.light}
                      </button>
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-4">
                    <label className={`block text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.language}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'en', label: 'English', flag: '🇺🇸' },
                        { id: 'pt', label: 'Português', flag: '🇧🇷' },
                        { id: 'es', label: 'Español', flag: '🇪🇸' },
                        { id: 'fr', label: 'Français', flag: '🇫🇷' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setLanguage(lang.id as any)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                            language === lang.id
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                              : `${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300' : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10'}`
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Database Settings */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className={`block text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.dbSettings}</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">{t.dbHost}</label>
                          <input
                            type="text"
                            value={dbHost}
                            onChange={(e) => setDbHost(e.target.value)}
                            className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all`}
                            placeholder="localhost"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">{t.dbPort}</label>
                          <input
                            type="text"
                            value={dbPort}
                            onChange={(e) => setDbPort(e.target.value)}
                            className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all`}
                            placeholder="3306"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">{t.dbUser}</label>
                          <input
                            type="text"
                            value={dbUser}
                            onChange={(e) => setDbUser(e.target.value)}
                            className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all`}
                            placeholder="root"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">{t.dbPass}</label>
                          <input
                            type="password"
                            value={dbPass}
                            onChange={(e) => setDbPass(e.target.value)}
                            className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all`}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">{t.dbName}</label>
                        <input
                          type="text"
                          value={dbName}
                          onChange={(e) => setDbName(e.target.value)}
                          className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all`}
                          placeholder="cs2_skins"
                        />
                      </div>
                    </div>
                  </div>

                  {/* App URL */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.appUrl}</label>
                      <input
                        type="text"
                        value={appUrl}
                        onChange={(e) => setAppUrl(e.target.value)}
                        className={`w-full ${theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-black/40 border-white/10 text-zinc-200'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 transition-all`}
                        placeholder="https://your-app.com"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    {t.save}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-500" />
                    Sign in with Steam
                  </h3>
                  <button 
                    onClick={() => setIsLoginModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">SteamID64</label>
                    <input
                      type="text"
                      value={tempSteamId}
                      onChange={(e) => setTempSteamId(e.target.value)}
                      placeholder="e.g. 76561198000000000"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                      Enter your 17-digit SteamID64 to sync your loadout.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (tempSteamId.length >= 17) {
                        setSteamId(tempSteamId);
                        localStorage.setItem('cs2-steamid', tempSteamId);
                        setIsLoginModalOpen(false);
                        setToast({ show: true, message: `Signed in as ${tempSteamId}` });
                        setTimeout(() => setToast({ show: false, message: "" }), 3000);
                        // Trigger loadout fetch
                        fetchLoadout(tempSteamId);
                      }
                    }}
                    disabled={tempSteamId.length < 17}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#18181b] border border-amber-500/30 shadow-[0_10px_40px_rgba(245,158,11,0.15)] text-zinc-200 px-5 py-4 rounded-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
