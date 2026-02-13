export type Language = 'en' | 'ru';

export interface Translations {
  // Game title and intro
  gameTitle: string;
  missionBrief: (klingons: number, time: number) => string;
  typeHelpForHelp: string;
  
  // Difficulty levels
  difficulty: {
    title: string;
    lieutenant: string;
    commander: string;
    captain: string;
    lieutenantDesc: string;
    commanderDesc: string;
    captainDesc: string;
    prompt: string;
    options: string;
    selected: (level: string, days: number) => string;
  };
  
  // Commands
  commands: {
    nav: string;
    srs: string;
    lrs: string;
    pha: string;
    tor: string;
    she: string;
    dam: string;
    com: string;
    sta: string;
    doc: string;
    hel: string;
    xxx: string;
    lang: string;
  };
  
  // Command descriptions
  help: {
    title: string;
    nav: string;
    srs: string;
    lrs: string;
    pha: string;
    tor: string;
    she: string;
    dam: string;
    com: string;
    sta: string;
    doc: string;
    hel: string;
    xxx: string;
    lang: string;
    courses: string;
    mapSymbols: string;
    enterprise: string;
    klingon: string;
    starbase: string;
    star: string;
    emptySpace: string;
  };
  
  // Status labels
  status: {
    stardate: string;
    condition: string;
    quadrant: string;
    sector: string;
    energy: string;
    torpedoes: string;
    shields: string;
    klingons: string;
    timeRemaining: string;
    starbases: string;
  };
  
  // Conditions
  conditions: {
    green: string;
    yellow: string;
    red: string;
    docked: string;
  };
  
  // Systems
  systems: {
    warpEngines: string;
    shortRangeSensors: string;
    longRangeSensors: string;
    phaserControl: string;
    photonTubes: string;
    damageControl: string;
    shields: string;
    computer: string;
    operational: string;
    damaged: string;
  };
  
  // Messages
  messages: {
    // Errors
    noGameInProgress: string;
    gameOver: string;
    unknownCommand: string;
    insufficientEnergy: string;
    amountMustBePositive: string;
    shieldControlDamaged: string;
    cannotLeaveGalaxy: string;
    notDockedAtStarbase: string;
    
    // Combat
    phasersLocked: string;
    phasersFired: (energy: number) => string;
    klingonHit: (x: number, y: number, damage: number, shields: number) => string;
    klingonDestroyed: (x: number, y: number) => string;
    klingonMissed: string;
    phaserControlDamaged: string;
    photonTubesDamaged: string;
    torpedoFired: (course: number) => string;
    torpedoMissed: string;
    noTorpedoes: string;
    
    // Klingon attack
    klingonFires: (x: number, y: number) => string;
    hitOnEnterprise: (damage: number) => string;
    shieldsAbsorbed: (damage: number, remaining: number) => string;
    directHit: (damage: number, system: string) => string;
    systemDamaged: (system: string) => string;
    shieldsDown: string;
    enterpriseDestroyed: string;
    
    // Navigation
    warpEnginesDamaged: (maxWarp: number) => string;
    courseMustBe: string;
    warpFactorMustBe: string;
    collision: (x: number, y: number) => string;
    emergencyStop: string;
    enteringQuadrant: (x: number, y: number) => string;
    
    // Docking
    dockedAtStarbase: string;
    replenishingSupplies: string;
    allSystemsRepaired: string;
    
    // Scans
    shortRangeSensorsDamaged: string;
    longRangeSensorsDamaged: string;
    longRangeScan: string;
    lrsFormat: string;
    galaxyMap: string;
    galaxyMapLegend: string;
    statusReport: string;
    systemsStatus: string;
    
    // Shields
    shieldsNowAt: (amount: number) => string;
    shieldsUp: string;
    shieldsDown2: string;
    
    // Game end
    youResigned: string;
    timeExpired: string;
    federationConquered: string;
    missionAccomplished: string;
    congratulations: string;
    timeUsed: (time: number) => string;
    
    // Usage messages
    usageNav: string;
    usagePha: string;
    usageTor: string;
    usageShe: string;
    usageLang: string;
    
    // Language
    languageChanged: (lang: string) => string;
    availableLanguages: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    gameTitle: 'SUPER STAR TREK',
    missionBrief: (klingons, time) => `Your mission: Destroy ${klingons} Klingon warships in ${time} stardates.`,
    typeHelpForHelp: 'Type HEL for help.',
    
    difficulty: {
      title: 'Select Difficulty',
      lieutenant: 'Lieutenant',
      commander: 'Commander',
      captain: 'Captain',
      lieutenantDesc: '90 stardates - Easy',
      commanderDesc: '60 stardates - Normal',
      captainDesc: '30 stardates - Hard',
      prompt: 'Your rank?',
      options: '1 - LIEUTENANT\n2 - COMMANDER\n3 - CAPTAIN',
      selected: (level, days) => `Difficulty selected: ${level} (${days} stardates)`,
    },
    
    commands: {
      nav: 'NAV',
      srs: 'SRS',
      lrs: 'LRS',
      pha: 'PHA',
      tor: 'TOR',
      she: 'SHE',
      dam: 'DAM',
      com: 'COM',
      sta: 'STA',
      doc: 'DOC',
      hel: 'HEL',
      xxx: 'XXX',
      lang: 'LANG',
    },
    
    help: {
      title: 'COMMANDS:',
      nav: 'NAV <course> <warp>  - Navigate (course 1-9, warp 0.1-8)',
      srs: 'SRS                  - Short range sensors',
      lrs: 'LRS                  - Long range sensors',
      pha: 'PHA <energy>         - Fire phasers',
      tor: 'TOR <course>         - Fire photon torpedo',
      she: 'SHE <amount>         - Raise/lower shields',
      dam: 'DAM                  - Damage report',
      com: 'COM                  - Computer (galaxy map)',
      sta: 'STA                  - Status report',
      doc: 'DOC                  - Dock at starbase',
      hel: 'HEL                  - This help',
      xxx: 'XXX                  - Resign command',
      lang: 'LANG <en|ru>         - Change language',
      courses: 'COURSES: 1=SW, 2=S, 3=SE, 4=W, 5=STOP, 6=E, 7=NW, 8=N, 9=NE',
      mapSymbols: 'MAP SYMBOLS:',
      enterprise: 'E - Enterprise (your ship)',
      klingon: 'K - Klingon warship',
      starbase: 'B - Starbase',
      star: '* - Star',
      emptySpace: '. - Empty space',
    },
    
    status: {
      stardate: 'Stardate',
      condition: 'Condition',
      quadrant: 'Quadrant',
      sector: 'Sector',
      energy: 'Energy',
      torpedoes: 'Torpedoes',
      shields: 'Shields',
      klingons: 'Klingons',
      timeRemaining: 'Time Remaining',
      starbases: 'Starbases',
    },
    
    conditions: {
      green: 'GREEN',
      yellow: 'YELLOW',
      red: 'RED',
      docked: 'DOCKED',
    },
    
    systems: {
      warpEngines: 'Warp Engines',
      shortRangeSensors: 'Short Range Sensors',
      longRangeSensors: 'Long Range Sensors',
      phaserControl: 'Phaser Control',
      photonTubes: 'Photon Tubes',
      damageControl: 'Damage Control',
      shields: 'Shield Control',
      computer: 'Computer',
      operational: 'OPERATIONAL',
      damaged: 'DAMAGED',
    },
    
    messages: {
      noGameInProgress: 'No game in progress. Start a new game.',
      gameOver: 'Game over. Start a new game.',
      unknownCommand: 'Unknown command. Type HEL for help.',
      insufficientEnergy: 'Insufficient energy. Available',
      amountMustBePositive: 'Amount must be positive.',
      shieldControlDamaged: 'Shield control damaged.',
      cannotLeaveGalaxy: 'You cannot leave the galaxy.',
      notDockedAtStarbase: 'Not docked at a starbase.',
      
      phasersLocked: 'Phasers locked on target.',
      phasersFired: (energy) => `Phasers fired with ${energy} units.`,
      klingonHit: (x, y, damage, shields) => `Klingon at [${x},${y}] hit! ${damage} damage, shields at ${shields}`,
      klingonDestroyed: (x, y) => `*** Klingon at [${x},${y}] DESTROYED! ***`,
      klingonMissed: 'Phasers missed.',
      phaserControlDamaged: 'Phaser control damaged.',
      photonTubesDamaged: 'Photon tubes damaged.',
      torpedoFired: (course) => `Photon torpedo fired on course ${course}`,
      torpedoMissed: 'Torpedo missed.',
      noTorpedoes: 'No torpedoes remaining.',
      
      klingonFires: (x, y) => `Klingon at [${x},${y}] fires!`,
      hitOnEnterprise: (damage) => `Hit on Enterprise! ${damage} damage!`,
      shieldsAbsorbed: (damage, remaining) => `Shields absorbed ${damage} damage. Shields now at ${remaining}`,
      directHit: (damage, system) => `Direct hit! ${damage} damage to ${system}!`,
      systemDamaged: (system) => `${system} damaged!`,
      shieldsDown: '*** SHIELDS DOWN ***',
      enterpriseDestroyed: '*** ENTERPRISE DESTROYED ***',
      
      warpEnginesDamaged: (maxWarp) => `Warp engines damaged. Maximum speed: warp ${maxWarp}`,
      courseMustBe: 'Course must be between 1.0 and 9.0',
      warpFactorMustBe: 'Warp factor must be between 0.1 and 8.0',
      collision: (x, y) => `Collision detected at [${x},${y}]!`,
      emergencyStop: 'Emergency stop!',
      enteringQuadrant: (x, y) => `Entering quadrant [${x},${y}]`,
      
      dockedAtStarbase: 'Docked at starbase.',
      replenishingSupplies: 'Replenishing supplies...',
      allSystemsRepaired: 'All systems repaired.',
      
      shortRangeSensorsDamaged: 'Short range sensors damaged.',
      longRangeSensorsDamaged: 'Long range sensors damaged.',
      longRangeScan: 'Long Range Scan:',
      lrsFormat: '(Format: KBS - Klingons, Bases, Stars)',
      galaxyMap: 'Galaxy Map:',
      galaxyMapLegend: '@ = Enterprise, K = Klingons, B = Starbase, ? = Unexplored',
      statusReport: 'Status Report:',
      systemsStatus: 'Systems Status:',
      
      shieldsNowAt: (amount) => `Shields now at ${amount}`,
      shieldsUp: '(UP)',
      shieldsDown2: '(DOWN)',
      
      youResigned: 'You have resigned your command.',
      timeExpired: '*** TIME EXPIRED ***',
      federationConquered: 'The Federation has been conquered.',
      missionAccomplished: '*** MISSION ACCOMPLISHED ***',
      congratulations: 'Congratulations! All Klingons destroyed.',
      timeUsed: (time) => `Time used: ${time} stardates`,
      newGamePrompt: 'Start new game? (y/n)',
      newGameYes: 'Starting new game...',
      newGameNo: 'Thank you for playing!',
      invalidYesNo: 'Please enter y or n',
      
      usageNav: 'Usage: NAV <course> <warp>',
      usagePha: 'Usage: PHA <energy>',
      usageTor: 'Usage: TOR <course>',
      usageShe: 'Usage: SHE <amount>',
      usageLang: 'Usage: LANG <en|ru>',
      
      languageChanged: (lang) => `Language changed to ${lang === 'en' ? 'English' : 'Russian'}`,
      availableLanguages: 'Available languages: en, ru',
      stoppedInPlace: 'Stopped in place.',
    },
  },
  
  ru: {
    gameTitle: 'СУПЕР ЗВЕЗДНЫЙ ПУТЬ',
    missionBrief: (klingons, time) => `Ваша миссия: Уничтожить ${klingons} клингонских крейсеров за ${time} звездных дат.`,
    typeHelpForHelp: 'Введите HEL для справки.',
    
    difficulty: {
      title: 'Выберите сложность',
      lieutenant: 'Лейтенант',
      commander: 'Коммандер',
      captain: 'Капитан',
      lieutenantDesc: '90 звездных дат - Легко',
      commanderDesc: '60 звездных дат - Нормально',
      captainDesc: '30 звездных дат - Сложно',
      prompt: 'Ваше звание?',
      options: '1 - ЛЕЙТЕНАНТ\n2 - КОММАНДЕР\n3 - КАПИТАН',
      selected: (level, days) => `Выбрана сложность: ${level} (${days} звездных дат)`,
    },
    
    commands: {
      nav: 'NAV',
      srs: 'SRS',
      lrs: 'LRS',
      pha: 'PHA',
      tor: 'TOR',
      she: 'SHE',
      dam: 'DAM',
      com: 'COM',
      sta: 'STA',
      doc: 'DOC',
      hel: 'HEL',
      xxx: 'XXX',
      lang: 'LANG',
    },
    
    help: {
      title: 'КОМАНДЫ:',
      nav: 'NAV <курс> <варп>    - Навигация (курс 1-9, варп 0.1-8)',
      srs: 'SRS                  - Сканер ближнего радиуса',
      lrs: 'LRS                  - Сканер дальнего радиуса',
      pha: 'PHA <энергия>        - Выстрел фазерами',
      tor: 'TOR <курс>           - Выстрел фотонной торпедой',
      she: 'SHE <количество>     - Поднять/опустить щиты',
      dam: 'DAM                  - Отчет о повреждениях',
      com: 'COM                  - Компьютер (карта галактики)',
      sta: 'STA                  - Отчет о состоянии',
      doc: 'DOC                  - Пристыковаться к звездной базе',
      hel: 'HEL                  - Эта справка',
      xxx: 'XXX                  - Сдаться',
      lang: 'LANG <en|ru>         - Сменить язык',
      courses: 'КУРСЫ: 1=ЮЗ, 2=Юг, 3=ЮВ, 4=Запад, 5=СТОП, 6=Восток, 7=СЗ, 8=Север, 9=СВ',
      mapSymbols: 'СИМВОЛЫ КАРТЫ:',
      enterprise: 'E - Энтерпрайз (ваш корабль)',
      klingon: 'K - Клингонский крейсер',
      starbase: 'B - Звездная база',
      star: '* - Звезда',
      emptySpace: '. - Пустое пространство',
    },
    
    status: {
      stardate: 'Звездная дата',
      condition: 'Состояние',
      quadrant: 'Квадрант',
      sector: 'Сектор',
      energy: 'Энергия',
      torpedoes: 'Торпеды',
      shields: 'Щиты',
      klingons: 'Клингоны',
      timeRemaining: 'Осталось времени',
      starbases: 'Звездные базы',
    },
    
    conditions: {
      green: 'ЗЕЛЕНОЕ',
      yellow: 'ЖЕЛТОЕ',
      red: 'КРАСНОЕ',
      docked: 'ПРИСТЫКОВАН',
    },
    
    systems: {
      warpEngines: 'Варп-двигатели',
      shortRangeSensors: 'Сканеры ближнего радиуса',
      longRangeSensors: 'Сканеры дальнего радиуса',
      phaserControl: 'Управление фазерами',
      photonTubes: 'Фотонные установки',
      damageControl: 'Контроль повреждений',
      shields: 'Управление щитами',
      computer: 'Компьютер',
      operational: 'РАБОТАЕТ',
      damaged: 'ПОВРЕЖДЕН',
    },
    
    messages: {
      noGameInProgress: 'Нет активной игры. Начните новую игру.',
      gameOver: 'Игра окончена. Начните новую игру.',
      unknownCommand: 'Неизвестная команда. Введите HEL для справки.',
      insufficientEnergy: 'Недостаточно энергии. Доступно',
      amountMustBePositive: 'Количество должно быть положительным.',
      shieldControlDamaged: 'Управление щитами повреждено.',
      cannotLeaveGalaxy: 'Вы не можете покинуть галактику.',
      notDockedAtStarbase: 'Не пристыкован к звездной базе.',
      
      phasersLocked: 'Фазеры нацелены на цель.',
      phasersFired: (energy) => `Залп фазеров: ${energy} единиц энергии.`,
      klingonHit: (x, y, damage, shields) => `Попадание по клингону [${x},${y}]! Урон ${damage}, щиты ${shields}`,
      klingonDestroyed: (x, y) => `*** Клингон [${x},${y}] УНИЧТОЖЕН! ***`,
      klingonMissed: 'Фазеры не попали.',
      phaserControlDamaged: 'Управление фазерами повреждено.',
      photonTubesDamaged: 'Фотонные установки повреждены.',
      torpedoFired: (course) => `Фотонная торпеда выпущена, курс ${course}`,
      torpedoMissed: 'Торпеда промахнулась.',
      noTorpedoes: 'Торпеды закончились.',
      
      klingonFires: (x, y) => `Клингон [${x},${y}] открыл огонь!`,
      hitOnEnterprise: (damage) => `Попадание по Энтерпрайзу! Урон ${damage}!`,
      shieldsAbsorbed: (damage, remaining) => `Щиты поглотили ${damage} урона. Щиты: ${remaining}`,
      directHit: (damage, system) => `Прямое попадание! Урон ${damage}: ${system}!`,
      systemDamaged: (system) => `${system} повреждена!`,
      shieldsDown: '*** ЩИТЫ УПАЛИ ***',
      enterpriseDestroyed: '*** ЭНТЕРПРАЙЗ УНИЧТОЖЕН ***',
      
      warpEnginesDamaged: (maxWarp) => `Варп-двигатели повреждены. Максимальная скорость: варп ${maxWarp}`,
      courseMustBe: 'Курс должен быть от 1.0 до 9.0',
      warpFactorMustBe: 'Варп-фактор должен быть от 0.1 до 8.0',
      collision: (x, y) => `Столкновение в секторе [${x},${y}]!`,
      emergencyStop: 'Экстренная остановка!',
      enteringQuadrant: (x, y) => `Вход в квадрант [${x},${y}]`,
      
      dockedAtStarbase: 'Пристыкованы к звездной базе.',
      replenishingSupplies: 'Пополнение запасов...',
      allSystemsRepaired: 'Все системы восстановлены.',
      
      shortRangeSensorsDamaged: 'Сканеры ближнего радиуса повреждены.',
      longRangeSensorsDamaged: 'Сканеры дальнего радиуса повреждены.',
      longRangeScan: 'Сканирование дальнего радиуса:',
      lrsFormat: '(Формат: КБЗ - Клингоны, Базы, Звезды)',
      galaxyMap: 'Карта галактики:',
      galaxyMapLegend: '@ = Энтерпрайз, K = Клингоны, B = База, ? = Неизведано',
      statusReport: 'Отчет о состоянии:',
      systemsStatus: 'Состояние систем:',
      
      shieldsNowAt: (amount) => `Щиты: ${amount}`,
      shieldsUp: '(ПОДНЯТЫ)',
      shieldsDown2: '(ОПУЩЕНЫ)',
      
      youResigned: 'Вы сдались.',
      timeExpired: '*** ВРЕМЯ ИСТЕКЛО ***',
      federationConquered: 'Федерация завоевана.',
      missionAccomplished: '*** МИССИЯ ВЫПОЛНЕНА ***',
      congratulations: 'Поздравляем! Все клингоны уничтожены.',
      timeUsed: (time) => `Использовано времени: ${time} звездных дат`,
      newGamePrompt: 'Начать новую игру? (y/n)',
      newGameYes: 'Начинаем новую игру...',
      newGameNo: 'Спасибо за игру!',
      invalidYesNo: 'Введите y или n',
      
      usageNav: 'Использование: NAV <курс> <варп>',
      usagePha: 'Использование: PHA <энергия>',
      usageTor: 'Использование: TOR <курс>',
      usageShe: 'Использование: SHE <количество>',
      usageLang: 'Использование: LANG <en|ru>',
      
      languageChanged: (lang) => `Язык изменен на ${lang === 'en' ? 'английский' : 'русский'}`,
      availableLanguages: 'Доступные языки: en, ru',
      stoppedInPlace: 'Остановка на месте.',
    },
  },
};
