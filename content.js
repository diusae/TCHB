// content.js — İzole dünyada çalışır, botun beyni
(function () {
  'use strict';
  if (window.__CRIMS_MINI_BOT__) return;
  window.__CRIMS_MINI_BOT__ = true;

  const REQ = 'CRIMS_MINI_REQ';
  const RES = 'CRIMS_MINI_RES';

  function loadFiraSans() {
    try {
      if (document.getElementById('tc-fira-sans')) return;
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      const link = document.createElement('link');
      link.id = 'tc-fira-sans';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(preconnect1);
      document.head.appendChild(preconnect2);
      document.head.appendChild(link);
    } catch (_) {}
  }
  loadFiraSans();

  const DEFAULTS = {
    enabled: false,
    autoRobbery: true,
    autoGangRobbery: false,
    autoStamina: true,
    autoAssault: true,
    autoLevelUp: false,
    autoTraining: false,
    robberyFilter: 'all',
    robberySafetyMargin: 1.0,
    gangRobberyFilter: 'all',
    gangRobberySafetyMargin: 0.9,
    gangRobberyMinHpPct: 50,
    staminaFloorPct: 20,
    staminaTargetPct: 50,
    ticketRefillTargetPoints: 100,
    ticketReserve: 0,
    maxNightclubRefillCash: 5000,
    useTicketRefill: true,
    allowUnsafeNightclubs: false,
    autoDetox: true,
    detoxAtAddiction: 20,
    autoPrisonBribe: false,
    prisonMaxCashBribe: 25000,
    autoHealing: false,
    healingId: 'none',
    healingTrigger: 'both',
    healingBelowHpPct: 50,
    autoAirport: true,
    airportAutoBuy: false,
    airportMaxCargoCash: 1000000,
    airportCashReserve: 50000,
    autoCollectHookers: true,
    hookerCollectMin: 50,
    autoFreeDice: true,
    autoBankDeposit: false,
    bankCashReserve: 50000,
    bankDepositMin: 10000,
    assaultMinHpPct: 70,
    assaultSafetyMargin: 1.0,
    activityMinGapMs: 3000,
    activityMaxGapMs: 5000,
    language: 'tr',
    minDelayMs: 2500,
    maxDelayMs: 5500,
    cycleMinMs: 6000,
    cycleMaxMs: 12000,
    // ===== University =====
    autoUniversity: false,
    universityAutoEnroll: false,
    universityPaymentMethod: 'cash',
    // ===== Factories / Laboratory =====
    autoBuildings: false,
    autoLaboratory: false,
    autoMaintain: false,
    productionQuantity: 0,
    productionDrugIds: [],
    // ===== Kurban Filtreleri =====
    victimUsernameBlacklist: [],
    victimIdBlacklist: [],
    victimCountryBlacklist: [],
    victimUsernameWhitelist: [],
    victimIdWhitelist: [],
    // ===== Karakter Bazlı Saldırı Kriterleri =====
    criteriaEnabled: false,
    assaultCriteria: {
      BUSINESSMAN: { maxLevel: 0, minRespect: 0, maxRespect: 0 },
      BROKER:      { maxLevel: 0, minRespect: 0, maxRespect: 0 },
      DEALER:      { maxLevel: 0, minRespect: 0, maxRespect: 0 },
      HITMAN:      { maxLevel: 0, minRespect: 0, maxRespect: 0 },
      PIMP:        { maxLevel: 0, minRespect: 0, maxRespect: 0 },
      ROBBER:      { maxLevel: 0, minRespect: 0, maxRespect: 0 },
      GANGSTER:    { maxLevel: 0, minRespect: 0, maxRespect: 0 },
    },
  };

  const CONFIG = JSON.parse(JSON.stringify(DEFAULTS));

  // ============ Çeviriler ============
  const TRANSLATIONS = {
    tr: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'Otomasyon', tabStrategy: 'Strateji', tabLogs: 'Loglar',
      tabCombat: 'Kazançlar', tabLanguages: 'Diller',
      btnStart: 'Başlat', btnStop: 'Durdur', btnSync: 'Sync',
      secMainRoutine: 'Ana Rutin', secTiming: 'Zamanlama (Ms/Delay)',
      secInventory: 'Envanter Otomatik Kullanım', secAirport: 'Havaalanı',
      secIncome: 'Gelirler ve Banka', secRobbery: 'Soygun',
      secStamina: 'Enerji Toplama', secCombat: 'Savaş',
      secPrison: 'Hapishane', secHospital: 'Hastane',
      statPlayer: 'Oyuncu', statLevel: 'Seviye', statStamina: 'Enerji',
      statTickets: 'Ticket', statHP: 'HP', statRobberyPower: 'Soygun Gücü',
      statAssaultPower: 'Saldırı Gücü', statCycle: 'Döngü',
      statsActions: 'Aksiyon', statsCycles: 'Döngü', statsErrors: 'Hata',
      runtimeLabel: 'Çalışma Süresi',
      autoRobbery: 'Otomatik Soygun', autoRobberyTip: 'Güvenli aralıkta olan en güçlü soygunu otomatik yapar.',
      autoGangRobbery: 'Çete Soygunu', autoGangRobberyTip: 'Aktif çete soygununa davet edildiğinde otomatik katılır ve yürütür.',
      autoStamina: 'Enerji Doldurma', autoStaminaTip: 'Enerji belirlediğin eşiğin altına düştüğünde otomatik doldurur.',
      autoAssault: 'AI Bot Savaşı', autoAssaultTip: 'Gücünün altındaki AI botlarını avlar. HP minimumun altındaysa saldırmaz.',
      autoDetox: 'Detoks', autoDetoxTip: 'Bağımlılık eşiği aşıldığında otomatik detoks yapar.',
      autoLevelUp: 'Otomatik seviye atlama', autoLevelUpTip: 'Tüm gereksinimler karşılandıktan sonra bir sonraki seviyeyi talep eder.',
      autoTraining: 'Eğitim', autoTrainingTip: "Suç seviyesi 3'ten itibaren mevcut bir antrenmanı başlatır.",
      presetRecommended: 'Önerilen', presetSlow: 'Daha yavaş',
      presetMedium: 'Orta', presetMediumSub: 'Orta Hızlı',
      presetFast: 'Hızlı', presetFastSub: 'Risk',
      timingMinDelay: 'Min. aksiyon gecikmesi (ms)', timingMinDelayTip: 'Soygun/enerji geçişleri arası minimum bekleme. Düşürürsen bot hızlanır ama risk artar.',
      timingMaxDelay: 'Maks. aksiyon gecikmesi (ms)', timingMaxDelayTip: 'Soygun/enerji geçişleri arası maksimum bekleme.',
      timingCycleMin: 'Min. döngü gecikmesi (ms)', timingCycleMinTip: 'İki ana döngü arası minimum bekleme (TaskRunner).',
      timingCycleMax: 'Maks. döngü gecikmesi (ms)', timingCycleMaxTip: 'İki ana döngü arası maksimum bekleme (TaskRunner).',
      timingActivityMin: 'Min. aktivite aralığı (ms)', timingActivityMinTip: 'Farklı tür iki aksiyon arasında minimum bekleme. Anti-ban koruması.',
      timingActivityMax: 'Maks. aktivite aralığı (ms)', timingActivityMaxTip: 'Farklı tür iki aksiyon arasında maksimum bekleme.',
      autoHealing: 'Otomatik eşya kullan', autoHealingTip: 'Seçili envanter eşyasını belirlenen tetikleyiciye göre otomatik aktive eder.',
      healingItem: 'Eşya', healingItemTip: 'Kullanılacak eşyayı seç. Sync ile güncel listeyi çekebilirsin.',
      healingTrigger: 'Ne zaman kullanılsın', healingTriggerTip: 'HP azalınca mı yoksa Soygun veya Saldırı öncesi mi kullanılacağını belirle.',
      healingTriggerLowHp: 'Belirtilen HP Azalınca', healingTriggerBeforeAction: 'Soygun veya Saldırı öncesi', healingTriggerBoth: 'Hepsi',
      healingHp: 'HP eşiği (%)', healingHpTip: 'HP bu yüzdenin altına düşünce eşya kullanılır.',
      autoAirport: 'Havaalanı', autoAirportTip: 'Ulaşan kargoları otomatik toplar.',
      airportAutoBuy: 'En ucuz kargoyu al', airportAutoBuyTip: 'Boş pistlere otomatik en ucuz kargoyu satın alır.',
      airportMaxCargo: 'Kargo başına maks. ($)', airportMaxCargoTip: 'Tek kargo için ödenecek maksimum nakit.',
      airportReserve: 'Alım sonrası rezerv ($)', airportReserveTip: 'Bu nakit rezervin altına düşmeyecek şekilde alım yapılır.',
      autoCollectHookers: 'Gelirleri topla', autoCollectHookersTip: 'Fahişelerden biriken gelirleri minimum üstüne çıkınca toplar.',
      autoFreeDice: 'Ücretsiz zar at', autoFreeDiceTip: 'Sunucunun ücretsiz sunduğu zar hakkını kullanır.',
      autoBankDeposit: 'Fazlasını bankaya yatır', autoBankDepositTip: 'Elde tutulan nakit rezervinin üstünü bankaya yatırır.',
      bankReserve: 'Elde tutulan nakit ($)', bankReserveTip: 'Bu tutar elde tutulur, üstü bankaya yatırılır.',
      bankMin: 'Min. yatırım ($)', bankMinTip: 'Bu tutarın altındaki yatırımlar yapılmaz.',
      robberyFilter: 'Soygun türü', robberyFilterTip: 'Sadece seçilen türdeki soyguna girer.',
      robberyFilterAll: 'Hepsi', robberyFilterCash: 'Sadece Nakit', robberyFilterStocks: 'Hisseler',
      robberyFilterEvents: 'Olaylar', robberyFilterCashDrugs: 'Nakit ve Uyuşturucular/Bileşenler',
      robberyMargin: 'Soygun gücünün (%) (Önerilen %100)', robberyMarginTip: 'Sadece gücünün bu yüzdesine kadar güç isteyen soyguna girer.',
      staminaFloor: 'Altına düşünce doldur (%)', staminaFloorTip: 'Enerji bu yüzdenin altına düştüğünde otomatik doldurma başlar.',
      staminaTarget: 'Hedef enerji (%)', staminaTargetTip: 'Doldurma işlemi enerjiyi bu yüzdeye kadar yükseltir.',
      ticketTarget: 'Ticket hedefi', ticketTargetTip: 'Ticket ile ulaşılacak enerji puanı. 100 enerji = 1 ticket.',
      ticketReserve: 'Minimum ticket rezervi', ticketReserveTip: 'Bu sayının altına ticket harcanmaz. 0 = sınır yok.',
      refillCash: 'Refil başına nakit limiti ($)', refillCashTip: 'Rave party girişi veya refil için harcanacak maksimum nakit.',
      useTicket: 'Ticket kullan', useTicketTip: 'Enerji doldururken ticket kullanılsın mı? Kapalıysa sadece rave party kullanılır.',
      unsafeRave: 'Korumasız halka açık ravelar', unsafeRaveTip: 'Saldırı riski var. Açıksa korumasız ravelara da girebilir.',
      assaultHp: 'Minimum HP (%)', assaultHpTip: 'HP bu yüzdenin altındaysa bot saldırmaz.',
      assaultMargin: 'Savaş güvenlik (%)', assaultMarginTip: 'Sadece gücünün bu yüzdesi kadar güçlü botlara saldırır.',
      autoPrisonBribe: 'Hapisten çık (rüşvet)', autoPrisonBribeTip: 'Hapiste yakalanırsan sunucunun belirlediği nakit rüşveti öder.',
      prisonMax: 'Maks. rüşvet ($)', prisonMaxTip: 'Bu tutarın üstündeki rüşvetler ödenmez, bot bekler.',
      detoxAddiction: 'Bağımlılık eşiği (%)', detoxAddictionTip: 'Bağımlılık bu yüzdeye ulaşınca detoks yapılır.',
      logActivity: 'Aktivite', logCombatTitle: 'Soygun & Saldırı Kazançları',
      statusReady: 'Hazır.', statusStopped: 'Durdu.', statusStarted: 'Başlatıldı.',
      statusSyncing: 'Senkronize ediliyor...', statusSynced: 'Senkronize edildi.',
      selectNone: 'Seçilmedi',
      languageInfo: 'Arayüz dilini seçin. Değişiklik anında uygulanır.',
      languageLabel: 'Dil',
      secVictimFilters: 'Kurban Filtreleri',
      victimUserBlacklist: 'Kara Liste (Kullanıcı Adı)',
      victimUserBlacklistTip: "Virgülle ayır. Bu kullanıcı adlarını içeren kurbanlara saldırmaz.",
      victimIdBlacklist: 'Kara Liste (ID)',
      victimIdBlacklistTip: "Virgülle ayır. Bu ID'lere sahip kurbanlara saldırmaz.",
      victimCountryBlacklist: 'Kara Liste (Ülke)',
      victimCountryBlacklistTip: 'Virgülle ayır (tr, us gibi). Bu ülkelerdeki kurbanlara saldırmaz.',
      victimUserWhitelist: 'Beyaz Liste (Kullanıcı Adı)',
      victimUserWhitelistTip: 'Dolu ise SADECE bu kullanıcı adlarını içeren kurbanlara saldırır.',
      victimIdWhitelist: 'Beyaz Liste (ID)',
      victimIdWhitelistTip: "Dolu ise SADECE bu ID'lere sahip kurbanlara saldırır.",
      secCharacterCriteria: 'Karakter Bazlı Kriterler',
      criteriaEnable: 'Karakter kriterlerini uygula',
      criteriaEnableTip: 'Açıksa, aşağıdaki karakter sınıfları için tanımlı seviye/saygınlık aralıkları uygulanır.',
      criteriaHint: '0 = sınır yok. Sadece doldurulan alanlar filtrelenir.',
      criteriaChar: 'Karakter',
      criteriaMaxLevel: 'Maks. Lvl',
      criteriaMinResp: 'Min. Saygınlık',
      criteriaMaxResp: 'Maks. Saygınlık',
      secInvestigation: 'Hesap Denetimi',
      investigateBtn: 'Hesabı Denetle',
      investigateHint: 'Hesabın bot kullanımı nedeniyle soruşturma altında olup olmadığını kontrol et.',
      investigateChecking: 'Hesap soruşturması kontrol ediliyor...',
      investigateClean: '✓ Hesap temiz, soruşturma yok.',
      investigateFound: '⚠️ HESAP SORUŞTURMA ALTINDA! Devam etmek riskli.',
      investigateError: 'Denetleme hatası: {msg}',
      investigateConfirm: 'Hesabınız bot kullanımı nedeniyle soruşturma altında görünüyor. Yine de devam etmek istiyor musunuz?',
      logInvestigationClean: 'Hesap soruşturma kontrolü: temiz.',
      logInvestigationFound: "Hesap soruşturma altında! Kayıtlar console'da.",
      logVictimFiltered: 'Kurban filtrelendi: {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'Üniversite',
      autoUniversity: 'Üniversite', autoUniversityTip: 'Mevcut derslere otomatik katılır, yoklama verir ve tamamlar.',
      universityAutoEnroll: 'Otomatik kayıt ol', universityAutoEnrollTip: 'Boş ders varsa otomatik kayıt olur (ücret ödenebilir).',
      universityPayment: 'Ödeme yöntemi', universityPaymentCash: 'Nakit', universityPaymentCredits: 'Kredi',
      secFactories: 'Fabrikalar ve Laboratuvar',
      autoBuildings: 'Fabrikaları topla', autoBuildingsTip: 'Üretimi hazır fabrikalardan otomatik toplar ve bakım yapar.',
      autoLaboratory: 'Laboratuvar', autoLaboratoryTip: 'Laboratuvar üretim kuyruğunu yönetir, tamamlananları toplar, boş slotlara yeni parti başlatır.',
      autoMaintain: 'Bakımı otomatik yap', autoMaintainTip: 'Bakım zamanı gelen fabrikaları tamir eder.',
      productionQty: 'Parti başına miktar (0 = maks.)', productionQtyTip: 'Bir laboratuvar partisinde kullanılacak bileşen miktarı. 0 = maksimum.',
      productionComponents: 'Laboratuvar bileşenleri',
      productionComponentsHint: 'Boş bırakılırsa mevcut tüm bileşenler kullanılır. Çoklu seçim desteklenir.',
      logUniEnroll: 'Üniversite: derse kayıt olundu → {name}',
      logUniPresence: 'Üniversite: yoklama verildi ({name})',
      logUniComplete: 'Üniversite: ders tamamlandı ({name})',
      logUniNoAction: 'Üniversite: uygun ders yok.',
      logUniError: 'Üniversite hatası: {msg}',
      logBuildingsCollect: 'Fabrikalar: {n} bina üretimi toplandı.',
      logBuildingsMaintain: 'Fabrikalar: bakım yapıldı.',
      logBuildingsNoAction: 'Fabrikalar: yapılacak işlem yok.',
      logBuildingsError: 'Fabrika hatası: {msg}',
      logLabStart: 'Laboratuvar: {qty}× bileşen #{drug} üretimi başlatıldı.',
      logLabComplete: 'Laboratuvar: parti tamamlandı → {n} toplandı.',
      logLabNoAction: 'Laboratuvar: yapılacak işlem yok.',
      logLabError: 'Laboratuvar hatası: {msg}',
      maintUniversity: 'Üniversite', maintBuildings: 'Fabrikalar', maintLaboratory: 'Laboratuvar',
      errBridgeTimeout: 'Bridge zaman aşımı', errNoToken: 'Token yakalanamadı',
      errForeignOrigin: 'Dış origin engellendi', errApiOnly: 'Sadece /api/v1/ kabul edilir',
      errNoEvents: 'Vue events bulunamadı', errNoRouter: 'Vue router bulunamadı',
      errUnknownMsg: 'Bilinmeyen mesaj tipi',
      statusDead: 'Karakter ölü. Bekleniyor.',
      statusInPrison: 'Hapiste. Rüşvet deneniyor...',
      statusInPrisonBribeOff: 'Hapiste. Rüşvet kapalı.',
      statusDetox: 'Bağımlılık %{p}. Detoks yapılıyor...',
      statusLowStamina: 'Enerji düşük (%{p}). Dolduruluyor...',
      statusRobbery: 'Soygun yapılıyor...',
      statusGangRobbery: 'Çete soygunu yapılıyor...',
      statusHuntingBot: 'AI bot aranıyor...',
      statusNoAction: 'Aktif aksiyon yok.',
      statusError: 'Hata: {msg}',
      statusBridgeNotReady: 'Bridge hazır değil. Sayfayı yenile.',
      logNav: 'Sayfa → {path}',
      logNavError: 'Navigasyon hatası: {msg}',
      logExitError: 'Çıkış hatası: {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — tekrar {i}/{max}...',
      logInventoryLoaded: 'Envanter yüklendi: {n} eşya.',
      logInventoryError: 'Envanter yükleme hatası: {msg}',
      logItemActivate: 'Eşya aktifleştiriliyor: #{id}',
      logRobbery: 'Soygun: {name} (güç {power}, enerji {energy})',
      logRobberySkipped: 'Soygun atlandı: {msg}',
      logGangNoInvite: 'Çete soygunu: davet bulunamadı ({n} davet).',
      logGangAccepting: 'Çete soygunu daveti kabul ediliyor: {name} (id {id})',
      logGangAccepted: '✓ Çete soygunu kabul edildi → {path}',
      logGangAcceptFailed: '❌ Çete soygunu kabul başarısız. Son: {msg}',
      logGangExecuting: 'Çete soygunu yürütülüyor: {name} (id {id})',
      logGangExecuted: '✓ Çete soygunu yürütüldü → {path}',
      logGangExecFailed: '❌ Çete soygunu yürütme başarısız. Son: {msg}',
      logLevelUpReady: 'Seviye atlama: tüm gereksinimler karşılandı, talep ediliyor...',
      logLevelUpSent: 'Seviye atlama isteği gönderildi.',
      logTrainingStarting: 'Eğitim başlatılıyor: {name}',
      logTrainingStarted: 'Eğitim başlatıldı.',
      logStaminaRefill: 'Enerji doldurma: mevcut={cur}, kapasite={cap}, hedef={target}, ticket={tickets}',
      logTicketRefill: 'Ticket refill: {n} ticket',
      logTicketRefillSuccess: 'Ticket refill başarılı: {before} → {after}',
      logTicketRefillFailed: "Ticket refill başarısız: {msg} → rave party'e geçiliyor.",
      logTicketReserved: 'Ticket rezervi korunuyor (mevcut: {have}, rezerv: {need}).',
      logNoRave: 'Uygun rave bulunamadı.',
      logClubOverLimit: 'Kulüp girişi ${fee}, limit ${limit} üstünde.',
      logEnteringRave: 'Rave party: {name} — giriliyor (mevcut: {before})',
      logTryingRefill: 'Enerji doldur butonu deneniyor...',
      logEnergyRefilled: 'Enerji dolduruldu: {before} → {after}',
      logRefillError: 'Enerji doldur hatası: {msg}',
      logBuyingDrug: 'İlaç alınıyor: {name}',
      logClubError: 'Kulüp recovery hatası: {msg}',
      logBotRoom: 'Porrada odası: {name} (bot gücü {power})',
      logNoBot: 'Bot gelmedi, çıkılıyor.',
      logAttacking: 'Saldırı: {name}',
      logBotError: 'Porrada hatası: {msg}',
      logDetox: 'Detoks: ${price} ödeniyor (bağımlılık {addiction}%)',
      logDetoxDone: 'Detoks yapıldı (${price}).',
      logDetoxSkipped: 'Detoks atlandı: {reason}',
      logDetoxError: 'Detoks hatası: {msg}',
      logPrisonBribe: 'Hapis rüşveti: ${price}',
      logPrisonBribed: 'Hapisten çıkıldı (${price}).',
      logBribeSkipped: 'Rüşvet atlandı: {reason}',
      logPrisonError: 'Hapis hatası: {msg}',
      logAirportCollect: 'Havaalanı: {n} kargo toplanıyor.',
      logAirportBuy: 'Havaalanı: ${price} kargo alınıyor.',
      logBankDeposit: 'Banka: ${amount} yatırılıyor.',
      logCollectEarnings: 'Gelirler: ${amount} toplanıyor.',
      logFreeDice: 'Ücretsiz zar atılıyor ({n} hak).',
      logHealLow: 'HP %{hp} < %{threshold}. Eşya kullanılıyor.',
      logHealFailed: 'Eşya kullanılamadı: {reason} {error}',
      logStatusLine: 'Durum: HP={hp}% Enerji={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'Çete soygunu atlandı: HP eşiğin altında.',
      logGangSkipped: 'Çete soygunu atlandı: {reason}',
      logCycleError: 'Döngü hatası: {msg}',
      logStartedToken: 'Bot başlatıldı. Token hazır.',
      logStartedNoToken: 'Bot başlatıldı. Token bekleniyor.',
      logBridgeError: 'Bridge hatası: {msg}',
      logStopped: 'Bot durduruldu.',
      logSynced: 'Statlar senkronize edildi.',
      logSyncError: 'Sync hatası: {msg}',
      logPanelLoaded: 'Panel yüklendi.',
      logAutoStart: 'Önceki oturumdan otomatik başlatılıyor...',
      logMaintDone: '{label}: tamamlandı.',
      logMaintError: '{label} hatası: {msg}',
      logPreset: 'Zamanlama ön ayarı → {name} (aksiyon {min}-{max}ms, döngü {cmin}-{cmax}ms)',
      logToggleOn: 'AÇIK', logToggleOff: 'KAPALI',
      logSettingChanged: '{key}: {value}',
      logItemSelected: 'Eşya seçildi: {id}',
      logTriggerChanged: 'Eşya tetikleyicisi: {v}',
      logFilterChanged: 'Soygun filtresi: {v}',
      logLangChanged: 'Dil değiştirildi: {name}',
      logTaskError: 'Görev hatası: {label} — {msg}',
      combatRobberyWin: '🎯 Soygun başarılı: {name} (güç {power}, enerji {energy}){rewards}',
      combatRobberyLose: '💥 Soygun başarısız: {name} (güç {power})',
      combatGangWin: '🎯 Çete soygunu: {name}{rewards}',
      combatGangLose: '💥 Çete soygunu başarısız: {name}',
      combatAssaultWin: '⚔️ Saldırı başarılı: {name} (güç {power}){rewards}',
      combatAssaultLose: '💀 Saldırı başarısız: {name}',
      combatHpLost: '   ↳ -{n} HP',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'Seviye Atlama', maintTraining: 'Eğitim', maintAirport: 'Havaalanı',
      maintHookers: 'Gelirler', maintDice: 'Zar', maintBank: 'Banka',
    },

    en: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'Automation', tabStrategy: 'Strategy', tabLogs: 'Logs',
      tabCombat: 'Earnings', tabLanguages: 'Languages',
      btnStart: 'Start', btnStop: 'Stop', btnSync: 'Sync',
      secMainRoutine: 'Main Routine', secTiming: 'Timing (Ms/Delay)',
      secInventory: 'Auto Inventory Use', secAirport: 'Airport',
      secIncome: 'Income & Bank', secRobbery: 'Robbery',
      secStamina: 'Stamina Recovery', secCombat: 'Combat',
      secPrison: 'Prison', secHospital: 'Hospital',
      statPlayer: 'Player', statLevel: 'Level', statStamina: 'Stamina',
      statTickets: 'Tickets', statHP: 'HP', statRobberyPower: 'Robbery Power',
      statAssaultPower: 'Assault Power', statCycle: 'Cycle',
      statsActions: 'Actions', statsCycles: 'Cycles', statsErrors: 'Errors',
      runtimeLabel: 'Runtime',
      autoRobbery: 'Auto Robbery', autoRobberyTip: 'Automatically performs the strongest robbery within the safe range.',
      autoGangRobbery: 'Gang Robbery', autoGangRobberyTip: 'Auto accepts and executes an active gang robbery invitation.',
      autoStamina: 'Stamina Refill', autoStaminaTip: 'Auto refills stamina when it drops below your threshold.',
      autoAssault: 'AI Bot Fight', autoAssaultTip: "Hunts AI bots below your power. Won't attack under minimum HP.",
      autoDetox: 'Detox', autoDetoxTip: 'Auto detox when addiction threshold is reached.',
      autoLevelUp: 'Auto Level Up', autoLevelUpTip: 'Requests the next level once all requirements are met.',
      autoTraining: 'Training', autoTrainingTip: 'Starts an available workout from crime level 3 onwards.',
      presetRecommended: 'Recommended', presetSlow: 'Slower',
      presetMedium: 'Medium', presetMediumSub: 'Medium Fast',
      presetFast: 'Fast', presetFastSub: 'Risky',
      timingMinDelay: 'Min. action delay (ms)', timingMinDelayTip: 'Minimum wait between robbery/stamina transitions. Lower = faster but riskier.',
      timingMaxDelay: 'Max. action delay (ms)', timingMaxDelayTip: 'Maximum wait between robbery/stamina transitions.',
      timingCycleMin: 'Min. cycle delay (ms)', timingCycleMinTip: 'Minimum wait between two main cycles (TaskRunner).',
      timingCycleMax: 'Max. cycle delay (ms)', timingCycleMaxTip: 'Maximum wait between two main cycles (TaskRunner).',
      timingActivityMin: 'Min. activity gap (ms)', timingActivityMinTip: 'Minimum wait between two different action types. Anti-ban protection.',
      timingActivityMax: 'Max. activity gap (ms)', timingActivityMaxTip: 'Maximum wait between two different action types.',
      autoHealing: 'Auto use item', autoHealingTip: 'Automatically activates the selected inventory item based on the trigger.',
      healingItem: 'Item', healingItemTip: 'Choose the item to use. Use Sync to refresh the list.',
      healingTrigger: 'When to use', healingTriggerTip: 'Choose whether to use on low HP, before Robbery/Assault, or both.',
      healingTriggerLowHp: 'When HP drops', healingTriggerBeforeAction: 'Before Robbery or Assault', healingTriggerBoth: 'Both',
      healingHp: 'HP threshold (%)', healingHpTip: 'The item is used when HP drops below this percentage.',
      autoAirport: 'Airport', autoAirportTip: 'Auto collects arrived cargo.',
      airportAutoBuy: 'Buy cheapest cargo', airportAutoBuyTip: 'Auto buys the cheapest cargo on empty runways.',
      airportMaxCargo: 'Max per cargo ($)', airportMaxCargoTip: 'Maximum cash to pay for a single cargo.',
      airportReserve: 'Reserve after buy ($)', airportReserveTip: "Purchases won't drop cash below this reserve.",
      autoCollectHookers: 'Collect earnings', autoCollectHookersTip: 'Collects hooker earnings once above minimum.',
      autoFreeDice: 'Roll free dice', autoFreeDiceTip: 'Uses the free dice roll offered by the server.',
      autoBankDeposit: 'Deposit excess to bank', autoBankDepositTip: 'Deposits cash above the reserved amount to bank.',
      bankReserve: 'Cash on hand ($)', bankReserveTip: 'This amount stays on hand; the rest goes to bank.',
      bankMin: 'Min deposit ($)', bankMinTip: 'Deposits below this amount are skipped.',
      robberyFilter: 'Robbery type', robberyFilterTip: 'Only performs the selected robbery type.',
      robberyFilterAll: 'All', robberyFilterCash: 'Cash only', robberyFilterStocks: 'Stocks',
      robberyFilterEvents: 'Events', robberyFilterCashDrugs: 'Cash and Drugs/Components',
      robberyMargin: 'Robbery safety (%)', robberyMarginTip: 'Only robs those whose power fits within this % of yours.',
      staminaFloor: 'Refill below (%)', staminaFloorTip: 'Auto-refill starts when stamina drops below this %.',
      staminaTarget: 'Target stamina (%)', staminaTargetTip: 'Refill raises stamina up to this %.',
      ticketTarget: 'Ticket target', ticketTargetTip: 'Stamina points to reach with tickets. 100 stamina = 1 ticket.',
      ticketReserve: 'Minimum ticket reserve', ticketReserveTip: 'Tickets below this amount are kept. 0 = no limit.',
      refillCash: 'Cash limit per refill ($)', refillCashTip: 'Maximum cash spent on rave party entry or refill.',
      useTicket: 'Use tickets', useTicketTip: 'Use tickets while refilling? If off, only rave party is used.',
      unsafeRave: 'Unsafe public raves', unsafeRaveTip: 'Attacks are possible. If on, unsafe raves can be entered.',
      assaultHp: 'Minimum HP (%)', assaultHpTip: "Won't attack if HP is below this %.",
      assaultMargin: 'Combat safety (%)', assaultMarginTip: 'Only attacks bots with power within this % of yours.',
      autoPrisonBribe: 'Bribe out of prison', autoPrisonBribeTip: 'Pays the server-set cash bribe if jailed.',
      prisonMax: 'Max bribe ($)', prisonMaxTip: 'Bribes above this amount are skipped.',
      detoxAddiction: 'Addiction threshold (%)', detoxAddictionTip: 'Detox is performed when addiction reaches this %.',
      logActivity: 'Activity', logCombatTitle: 'Robbery & Assault Rewards',
      statusReady: 'Ready.', statusStopped: 'Stopped.', statusStarted: 'Started.',
      statusSyncing: 'Syncing...', statusSynced: 'Synced.',
      selectNone: 'None',
      languageInfo: 'Choose the interface language. Changes apply instantly.',
      languageLabel: 'Language',
      secVictimFilters: 'Victim Filters',
      victimUserBlacklist: 'Blacklist (Username)',
      victimUserBlacklistTip: 'Comma separated. Skips victims containing these usernames.',
      victimIdBlacklist: 'Blacklist (ID)',
      victimIdBlacklistTip: 'Comma separated. Skips victims with these IDs.',
      victimCountryBlacklist: 'Blacklist (Country)',
      victimCountryBlacklistTip: 'Comma separated (tr, us). Skips victims from these countries.',
      victimUserWhitelist: 'Whitelist (Username)',
      victimUserWhitelistTip: 'If set, ONLY victims matching these usernames are attacked.',
      victimIdWhitelist: 'Whitelist (ID)',
      victimIdWhitelistTip: 'If set, ONLY victims with these IDs are attacked.',
      secCharacterCriteria: 'Character Criteria',
      criteriaEnable: 'Apply character criteria',
      criteriaEnableTip: 'When on, level/respect ranges below are enforced per character class.',
      criteriaHint: '0 = no limit. Only filled fields are filtered.',
      criteriaChar: 'Character',
      criteriaMaxLevel: 'Max Lvl',
      criteriaMinResp: 'Min Respect',
      criteriaMaxResp: 'Max Respect',
      secInvestigation: 'Account Investigation',
      investigateBtn: 'Check Account',
      investigateHint: 'Check if the account is under investigation for bot usage.',
      investigateChecking: 'Checking account investigation...',
      investigateClean: '✓ Account clean, no investigation.',
      investigateFound: '⚠️ ACCOUNT UNDER INVESTIGATION! Continuing is risky.',
      investigateError: 'Investigation check error: {msg}',
      investigateConfirm: 'Your account appears under investigation for bot usage. Continue anyway?',
      logInvestigationClean: 'Investigation check: clean.',
      logInvestigationFound: 'Account under investigation! Logs in console.',
      logVictimFiltered: 'Victim filtered: {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'University',
      autoUniversity: 'University', autoUniversityTip: 'Auto joins available classes, gives presence and completes them.',
      universityAutoEnroll: 'Auto enroll', universityAutoEnrollTip: 'Enrolls in the next available class (may cost money).',
      universityPayment: 'Payment method', universityPaymentCash: 'Cash', universityPaymentCredits: 'Credits',
      secFactories: 'Factories & Laboratory',
      autoBuildings: 'Collect factories', autoBuildingsTip: 'Collects finished production from factories and performs maintenance.',
      autoLaboratory: 'Laboratory', autoLaboratoryTip: 'Manages lab production queue: collects finished batches and starts new ones.',
      autoMaintain: 'Auto maintain', autoMaintainTip: 'Repairs factories that need maintenance.',
      productionQty: 'Quantity per batch (0 = max)', productionQtyTip: 'Components used per laboratory batch. 0 = maximum.',
      productionComponents: 'Laboratory components',
      productionComponentsHint: 'Leave empty to use all available components. Multi-select supported.',
      logUniEnroll: 'University: enrolled → {name}',
      logUniPresence: 'University: presence given ({name})',
      logUniComplete: 'University: class completed ({name})',
      logUniNoAction: 'University: no available class.',
      logUniError: 'University error: {msg}',
      logBuildingsCollect: 'Factories: collected {n} finished productions.',
      logBuildingsMaintain: 'Factories: maintenance performed.',
      logBuildingsNoAction: 'Factories: nothing to do.',
      logBuildingsError: 'Factory error: {msg}',
      logLabStart: 'Laboratory: started production of {qty}× component #{drug}.',
      logLabComplete: 'Laboratory: batch completed → {n} collected.',
      logLabNoAction: 'Laboratory: nothing to do.',
      logLabError: 'Laboratory error: {msg}',
      maintUniversity: 'University', maintBuildings: 'Factories', maintLaboratory: 'Laboratory',
      errBridgeTimeout: 'Bridge timeout', errNoToken: 'Token not captured',
      errForeignOrigin: 'Foreign origin blocked', errApiOnly: 'Only /api/v1/ accepted',
      errNoEvents: 'Vue events not found', errNoRouter: 'Vue router not found',
      errUnknownMsg: 'Unknown message type',
      statusDead: 'Character dead. Waiting.',
      statusInPrison: 'In prison. Trying bribe...',
      statusInPrisonBribeOff: 'In prison. Bribe off.',
      statusDetox: 'Addiction {p}%. Detox in progress...',
      statusLowStamina: 'Low stamina ({p}%). Refilling...',
      statusRobbery: 'Performing robbery...',
      statusGangRobbery: 'Performing gang robbery...',
      statusHuntingBot: 'Searching AI bot...',
      statusNoAction: 'No active action.',
      statusError: 'Error: {msg}',
      statusBridgeNotReady: 'Bridge not ready. Reload the page.',
      logNav: 'Page → {path}',
      logNavError: 'Navigation error: {msg}',
      logExitError: 'Exit error: {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — retry {i}/{max}...',
      logInventoryLoaded: 'Inventory loaded: {n} items.',
      logInventoryError: 'Inventory load error: {msg}',
      logItemActivate: 'Activating item: #{id}',
      logRobbery: 'Robbery: {name} (power {power}, energy {energy})',
      logRobberySkipped: 'Robbery skipped: {msg}',
      logGangNoInvite: 'Gang robbery: no invitation found ({n} invites).',
      logGangAccepting: 'Accepting gang robbery invite: {name} (id {id})',
      logGangAccepted: '✓ Gang robbery accepted → {path}',
      logGangAcceptFailed: '❌ Gang robbery accept failed. Last: {msg}',
      logGangExecuting: 'Executing gang robbery: {name} (id {id})',
      logGangExecuted: '✓ Gang robbery executed → {path}',
      logGangExecFailed: '❌ Gang robbery exec failed. Last: {msg}',
      logLevelUpReady: 'Level up: all requirements met, requesting...',
      logLevelUpSent: 'Level up request sent.',
      logTrainingStarting: 'Starting training: {name}',
      logTrainingStarted: 'Training started.',
      logStaminaRefill: 'Stamina refill: current={cur}, capacity={cap}, target={target}, tickets={tickets}',
      logTicketRefill: 'Ticket refill: {n} tickets',
      logTicketRefillSuccess: 'Ticket refill OK: {before} → {after}',
      logTicketRefillFailed: 'Ticket refill failed: {msg} → falling back to rave party.',
      logTicketReserved: 'Ticket reserve kept (have: {have}, reserve: {need}).',
      logNoRave: 'No suitable rave found.',
      logClubOverLimit: 'Club entry ${fee}, over limit ${limit}.',
      logEnteringRave: 'Rave party: {name} — entering (current: {before})',
      logTryingRefill: 'Trying stamina refill button...',
      logEnergyRefilled: 'Stamina refilled: {before} → {after}',
      logRefillError: 'Refill error: {msg}',
      logBuyingDrug: 'Buying drug: {name}',
      logClubError: 'Club recovery error: {msg}',
      logBotRoom: 'Hunting room: {name} (bot power {power})',
      logNoBot: 'No bot arrived, exiting.',
      logAttacking: 'Attacking: {name}',
      logBotError: 'Hunting error: {msg}',
      logDetox: 'Detox: paying ${price} (addiction {addiction}%)',
      logDetoxDone: 'Detox done (${price}).',
      logDetoxSkipped: 'Detox skipped: {reason}',
      logDetoxError: 'Detox error: {msg}',
      logPrisonBribe: 'Prison bribe: ${price}',
      logPrisonBribed: 'Bribed out of prison (${price}).',
      logBribeSkipped: 'Bribe skipped: {reason}',
      logPrisonError: 'Prison error: {msg}',
      logAirportCollect: 'Airport: collecting {n} cargo.',
      logAirportBuy: 'Airport: buying cargo for ${price}.',
      logBankDeposit: 'Bank: depositing ${amount}.',
      logCollectEarnings: 'Earnings: collecting ${amount}.',
      logFreeDice: 'Rolling free dice ({n} left).',
      logHealLow: 'HP {hp}% < {threshold}%. Using item.',
      logHealFailed: 'Item not used: {reason} {error}',
      logStatusLine: 'Status: HP={hp}% Stamina={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'Gang robbery skipped: HP below threshold.',
      logGangSkipped: 'Gang robbery skipped: {reason}',
      logCycleError: 'Cycle error: {msg}',
      logStartedToken: 'Bot started. Token ready.',
      logStartedNoToken: 'Bot started. Waiting for token.',
      logBridgeError: 'Bridge error: {msg}',
      logStopped: 'Bot stopped.',
      logSynced: 'Stats synced.',
      logSyncError: 'Sync error: {msg}',
      logPanelLoaded: 'Panel loaded.',
      logAutoStart: 'Auto-starting from previous session...',
      logMaintDone: '{label}: done.',
      logMaintError: '{label} error: {msg}',
      logPreset: 'Timing preset → {name} (action {min}-{max}ms, cycle {cmin}-{cmax}ms)',
      logToggleOn: 'ON', logToggleOff: 'OFF',
      logSettingChanged: '{key}: {value}',
      logItemSelected: 'Item selected: {id}',
      logTriggerChanged: 'Item trigger: {v}',
      logFilterChanged: 'Robbery filter: {v}',
      logLangChanged: 'Language changed: {name}',
      logTaskError: 'Task error: {label} — {msg}',
      combatRobberyWin: '🎯 Robbery success: {name} (power {power}, energy {energy}){rewards}',
      combatRobberyLose: '💥 Robbery failed: {name} (power {power})',
      combatGangWin: '🎯 Gang robbery: {name}{rewards}',
      combatGangLose: '💥 Gang robbery failed: {name}',
      combatAssaultWin: '⚔️ Assault success: {name} (power {power}){rewards}',
      combatAssaultLose: '💀 Assault failed: {name}',
      combatHpLost: '   ↳ -{n} HP',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'Level Up', maintTraining: 'Training', maintAirport: 'Airport',
      maintHookers: 'Earnings', maintDice: 'Dice', maintBank: 'Bank',
    },

    es: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'Automatización', tabStrategy: 'Estrategia', tabLogs: 'Registros',
      tabCombat: 'Ganancias', tabLanguages: 'Idiomas',
      btnStart: 'Iniciar', btnStop: 'Detener', btnSync: 'Sincronizar',
      secMainRoutine: 'Rutina principal', secTiming: 'Tiempos (ms/retardo)',
      secInventory: 'Uso automático de inventario', secAirport: 'Aeropuerto',
      secIncome: 'Ingresos y banco', secRobbery: 'Robo',
      secStamina: 'Recuperación de energía', secCombat: 'Combate',
      secPrison: 'Prisión', secHospital: 'Hospital',
      statPlayer: 'Jugador', statLevel: 'Nivel', statStamina: 'Energía',
      statTickets: 'Tickets', statHP: 'HP', statRobberyPower: 'Poder de robo',
      statAssaultPower: 'Poder de ataque', statCycle: 'Ciclo',
      statsActions: 'Acciones', statsCycles: 'Ciclos', statsErrors: 'Errores',
      runtimeLabel: 'Tiempo activo',
      autoRobbery: 'Robo automático', autoRobberyTip: 'Realiza automáticamente el robo más fuerte dentro del rango seguro.',
      autoGangRobbery: 'Robo de banda', autoGangRobberyTip: 'Acepta y ejecuta automáticamente una invitación de robo de banda.',
      autoStamina: 'Rellenar energía', autoStaminaTip: 'Rellena la energía automáticamente cuando cae por debajo del umbral.',
      autoAssault: 'Pelea con bots IA', autoAssaultTip: 'Caza bots IA por debajo de tu poder. No ataca bajo el HP mínimo.',
      autoDetox: 'Desintoxicación', autoDetoxTip: 'Se desintoxica automáticamente al alcanzar el umbral de adicción.',
      autoLevelUp: 'Subir nivel automático', autoLevelUpTip: 'Solicita el siguiente nivel cuando se cumplen los requisitos.',
      autoTraining: 'Entrenamiento', autoTrainingTip: 'Inicia un entrenamiento disponible desde el nivel de crimen 3.',
      presetRecommended: 'Recomendado', presetSlow: 'Más lento',
      presetMedium: 'Medio', presetMediumSub: 'Medio rápido',
      presetFast: 'Rápido', presetFastSub: 'Riesgo',
      timingMinDelay: 'Retardo mín. de acción (ms)', timingMinDelayTip: 'Espera mínima entre transiciones. Menor = más rápido pero arriesgado.',
      timingMaxDelay: 'Retardo máx. de acción (ms)', timingMaxDelayTip: 'Espera máxima entre transiciones.',
      timingCycleMin: 'Retardo mín. de ciclo (ms)', timingCycleMinTip: 'Espera mínima entre dos ciclos principales.',
      timingCycleMax: 'Retardo máx. de ciclo (ms)', timingCycleMaxTip: 'Espera máxima entre dos ciclos principales.',
      timingActivityMin: 'Intervalo mín. de actividad (ms)', timingActivityMinTip: 'Espera mínima entre dos tipos de acción diferentes. Protección anti-ban.',
      timingActivityMax: 'Intervalo máx. de actividad (ms)', timingActivityMaxTip: 'Espera máxima entre dos tipos de acción diferentes.',
      autoHealing: 'Uso automático de objeto', autoHealingTip: 'Activa automáticamente el objeto seleccionado según el disparador.',
      healingItem: 'Objeto', healingItemTip: 'Elige el objeto a usar. Usa Sync para actualizar la lista.',
      healingTrigger: 'Cuándo usar', healingTriggerTip: 'Elige si usar con HP bajo, antes de Robo/Ataque, o ambos.',
      healingTriggerLowHp: 'Cuando baja el HP', healingTriggerBeforeAction: 'Antes de robo o ataque', healingTriggerBoth: 'Ambos',
      healingHp: 'Umbral de HP (%)', healingHpTip: 'El objeto se usa cuando el HP cae por debajo de este porcentaje.',
      autoAirport: 'Aeropuerto', autoAirportTip: 'Recoge automáticamente la carga llegada.',
      airportAutoBuy: 'Comprar carga más barata', airportAutoBuyTip: 'Compra automáticamente la carga más barata en pistas vacías.',
      airportMaxCargo: 'Máx. por carga ($)', airportMaxCargoTip: 'Efectivo máximo por carga.',
      airportReserve: 'Reserva tras comprar ($)', airportReserveTip: 'Las compras no bajarán el efectivo por debajo de esta reserva.',
      autoCollectHookers: 'Recoger ganancias', autoCollectHookersTip: 'Recoge las ganancias de prostitutas por encima del mínimo.',
      autoFreeDice: 'Dado gratis', autoFreeDiceTip: 'Usa el lanzamiento de dado gratis del servidor.',
      autoBankDeposit: 'Depositar exceso en banco', autoBankDepositTip: 'Deposita el efectivo por encima de la reserva en el banco.',
      bankReserve: 'Efectivo en mano ($)', bankReserveTip: 'Esta cantidad permanece en mano; el resto va al banco.',
      bankMin: 'Depósito mínimo ($)', bankMinTip: 'Se omiten los depósitos por debajo de este importe.',
      robberyFilter: 'Tipo de robo', robberyFilterTip: 'Solo realiza el tipo de robo seleccionado.',
      robberyFilterAll: 'Todos', robberyFilterCash: 'Solo efectivo', robberyFilterStocks: 'Acciones',
      robberyFilterEvents: 'Eventos', robberyFilterCashDrugs: 'Efectivo y drogas/componentes',
      robberyMargin: 'Seguridad de robo (%)', robberyMarginTip: 'Solo roba a quienes encajen dentro de este % de tu poder.',
      staminaFloor: 'Rellenar bajo (%)', staminaFloorTip: 'El auto-relleno comienza cuando la energía cae bajo este %.',
      staminaTarget: 'Energía objetivo (%)', staminaTargetTip: 'El relleno sube la energía hasta este %.',
      ticketTarget: 'Objetivo de tickets', ticketTargetTip: 'Puntos de energía a alcanzar con tickets. 100 energía = 1 ticket.',
      ticketReserve: 'Reserva mínima de tickets', ticketReserveTip: 'Se conservan los tickets por debajo de esta cantidad. 0 = sin límite.',
      refillCash: 'Límite de efectivo por recarga ($)', refillCashTip: 'Efectivo máximo gastado en entrada a rave o recarga.',
      useTicket: 'Usar tickets', useTicketTip: '¿Usar tickets al rellenar? Si está apagado, solo rave party.',
      unsafeRave: 'Raves públicos inseguros', unsafeRaveTip: 'Los ataques son posibles. Si está activo, se permiten raves inseguros.',
      assaultHp: 'HP mínimo (%)', assaultHpTip: 'No atacará si el HP está por debajo de este %.',
      assaultMargin: 'Seguridad de combate (%)', assaultMarginTip: 'Solo ataca a bots con poder dentro de este % del tuyo.',
      autoPrisonBribe: 'Salir de prisión (soborno)', autoPrisonBribeTip: 'Paga el soborno en efectivo si está encarcelado.',
      prisonMax: 'Soborno máx. ($)', prisonMaxTip: 'Se omiten los sobornos por encima de este importe.',
      detoxAddiction: 'Umbral de adicción (%)', detoxAddictionTip: 'Se desintoxica cuando la adicción alcanza este %.',
      logActivity: 'Actividad', logCombatTitle: 'Recompensas de robo y ataque',
      statusReady: 'Listo.', statusStopped: 'Detenido.', statusStarted: 'Iniciado.',
      statusSyncing: 'Sincronizando...', statusSynced: 'Sincronizado.',
      selectNone: 'Ninguno',
      languageInfo: 'Elige el idioma de la interfaz. Los cambios se aplican al instante.',
      languageLabel: 'Idioma',
      secVictimFilters: 'Filtros de víctimas',
      victimUserBlacklist: 'Lista negra (usuario)',
      victimUserBlacklistTip: 'Separados por comas. Omite víctimas que contengan estos usuarios.',
      victimIdBlacklist: 'Lista negra (ID)',
      victimIdBlacklistTip: 'Separados por comas. Omite víctimas con estos IDs.',
      victimCountryBlacklist: 'Lista negra (país)',
      victimCountryBlacklistTip: 'Separados por comas (tr, us). Omite víctimas de estos países.',
      victimUserWhitelist: 'Lista blanca (usuario)',
      victimUserWhitelistTip: 'Si se define, SOLO ataca víctimas que coincidan con estos usuarios.',
      victimIdWhitelist: 'Lista blanca (ID)',
      victimIdWhitelistTip: 'Si se define, SOLO ataca víctimas con estos IDs.',
      secCharacterCriteria: 'Criterios por personaje',
      criteriaEnable: 'Aplicar criterios por personaje',
      criteriaEnableTip: 'Cuando está activo, se aplican los rangos de nivel/respeto por clase de personaje.',
      criteriaHint: '0 = sin límite. Solo se filtran los campos rellenados.',
      criteriaChar: 'Personaje',
      criteriaMaxLevel: 'Niv. máx.',
      criteriaMinResp: 'Respeto mín.',
      criteriaMaxResp: 'Respeto máx.',
      secInvestigation: 'Investigación de cuenta',
      investigateBtn: 'Comprobar cuenta',
      investigateHint: 'Comprueba si la cuenta está bajo investigación por uso de bot.',
      investigateChecking: 'Comprobando investigación de la cuenta...',
      investigateClean: '✓ Cuenta limpia, sin investigación.',
      investigateFound: '⚠️ ¡CUENTA BAJO INVESTIGACIÓN! Continuar es arriesgado.',
      investigateError: 'Error de investigación: {msg}',
      investigateConfirm: 'Tu cuenta parece estar bajo investigación por uso de bot. ¿Continuar de todas formas?',
      logInvestigationClean: 'Comprobación de investigación: limpia.',
      logInvestigationFound: '¡Cuenta bajo investigación! Registros en consola.',
      logVictimFiltered: 'Víctima filtrada: {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'Universidad',
      autoUniversity: 'Universidad', autoUniversityTip: 'Se une automáticamente a las clases disponibles, da presencia y las completa.',
      universityAutoEnroll: 'Inscripción automática', universityAutoEnrollTip: 'Se inscribe en la siguiente clase disponible (puede costar dinero).',
      universityPayment: 'Método de pago', universityPaymentCash: 'Efectivo', universityPaymentCredits: 'Créditos',
      secFactories: 'Fábricas y laboratorio',
      autoBuildings: 'Recoger fábricas', autoBuildingsTip: 'Recoge la producción terminada de las fábricas y realiza mantenimiento.',
      autoLaboratory: 'Laboratorio', autoLaboratoryTip: 'Gestiona la cola de producción del laboratorio: recoge lotes y comienza nuevos.',
      autoMaintain: 'Mantenimiento automático', autoMaintainTip: 'Repara fábricas que necesitan mantenimiento.',
      productionQty: 'Cantidad por lote (0 = máx.)', productionQtyTip: 'Componentes usados por lote del laboratorio. 0 = máximo.',
      productionComponents: 'Componentes del laboratorio',
      productionComponentsHint: 'Déjalo vacío para usar todos los componentes disponibles. Selección múltiple.',
      logUniEnroll: 'Universidad: inscrito → {name}',
      logUniPresence: 'Universidad: presencia dada ({name})',
      logUniComplete: 'Universidad: clase completada ({name})',
      logUniNoAction: 'Universidad: no hay clase disponible.',
      logUniError: 'Error de universidad: {msg}',
      logBuildingsCollect: 'Fábricas: {n} producciones terminadas recogidas.',
      logBuildingsMaintain: 'Fábricas: mantenimiento realizado.',
      logBuildingsNoAction: 'Fábricas: nada que hacer.',
      logBuildingsError: 'Error de fábrica: {msg}',
      logLabStart: 'Laboratorio: producción iniciada de {qty}× componente #{drug}.',
      logLabComplete: 'Laboratorio: lote completado → {n} recogidos.',
      logLabNoAction: 'Laboratorio: nada que hacer.',
      logLabError: 'Error de laboratorio: {msg}',
      maintUniversity: 'Universidad', maintBuildings: 'Fábricas', maintLaboratory: 'Laboratorio',
      errBridgeTimeout: 'Tiempo de espera del bridge', errNoToken: 'Token no capturado',
      errForeignOrigin: 'Origen externo bloqueado', errApiOnly: 'Solo se acepta /api/v1/',
      errNoEvents: 'Eventos de Vue no encontrados', errNoRouter: 'Router de Vue no encontrado',
      errUnknownMsg: 'Tipo de mensaje desconocido',
      statusDead: 'Personaje muerto. Esperando.',
      statusInPrison: 'En prisión. Probando soborno...',
      statusInPrisonBribeOff: 'En prisión. Soborno apagado.',
      statusDetox: 'Adicción {p}%. Desintoxicación en curso...',
      statusLowStamina: 'Energía baja ({p}%). Rellenando...',
      statusRobbery: 'Realizando robo...',
      statusGangRobbery: 'Realizando robo de banda...',
      statusHuntingBot: 'Buscando bot IA...',
      statusNoAction: 'Sin acción activa.',
      statusError: 'Error: {msg}',
      statusBridgeNotReady: 'Bridge no listo. Recarga la página.',
      logNav: 'Página → {path}',
      logNavError: 'Error de navegación: {msg}',
      logExitError: 'Error al salir: {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — reintento {i}/{max}...',
      logInventoryLoaded: 'Inventario cargado: {n} objetos.',
      logInventoryError: 'Error al cargar inventario: {msg}',
      logItemActivate: 'Activando objeto: #{id}',
      logRobbery: 'Robo: {name} (poder {power}, energía {energy})',
      logRobberySkipped: 'Robo omitido: {msg}',
      logGangNoInvite: 'Robo de banda: sin invitación ({n}).',
      logGangAccepting: 'Aceptando invitación: {name} (id {id})',
      logGangAccepted: '✓ Robo de banda aceptado → {path}',
      logGangAcceptFailed: '❌ Falló la aceptación. Último: {msg}',
      logGangExecuting: 'Ejecutando robo de banda: {name} (id {id})',
      logGangExecuted: '✓ Robo de banda ejecutado → {path}',
      logGangExecFailed: '❌ Falló la ejecución. Último: {msg}',
      logLevelUpReady: 'Subir nivel: requisitos cumplidos, solicitando...',
      logLevelUpSent: 'Solicitud de subir nivel enviada.',
      logTrainingStarting: 'Iniciando entrenamiento: {name}',
      logTrainingStarted: 'Entrenamiento iniciado.',
      logStaminaRefill: 'Relleno: actual={cur}, capacidad={cap}, objetivo={target}, tickets={tickets}',
      logTicketRefill: 'Recarga con tickets: {n} tickets',
      logTicketRefillSuccess: 'Recarga OK: {before} → {after}',
      logTicketRefillFailed: 'Recarga fallida: {msg} → usando rave party.',
      logTicketReserved: 'Reserva de tickets conservada (tiene: {have}, reserva: {need}).',
      logNoRave: 'No se encontró rave adecuado.',
      logClubOverLimit: 'Entrada ${fee}, sobre límite ${limit}.',
      logEnteringRave: 'Rave party: {name} — entrando (actual: {before})',
      logTryingRefill: 'Probando botón de rellenar...',
      logEnergyRefilled: 'Energía rellenada: {before} → {after}',
      logRefillError: 'Error de relleno: {msg}',
      logBuyingDrug: 'Comprando droga: {name}',
      logClubError: 'Error de recuperación en club: {msg}',
      logBotRoom: 'Sala de caza: {name} (poder bot {power})',
      logNoBot: 'No llegó bot, saliendo.',
      logAttacking: 'Atacando: {name}',
      logBotError: 'Error de caza: {msg}',
      logDetox: 'Desintoxicación: pagando ${price} (adicción {addiction}%)',
      logDetoxDone: 'Desintoxicación hecha (${price}).',
      logDetoxSkipped: 'Desintoxicación omitida: {reason}',
      logDetoxError: 'Error de desintoxicación: {msg}',
      logPrisonBribe: 'Soborno de prisión: ${price}',
      logPrisonBribed: 'Salida de prisión (${price}).',
      logBribeSkipped: 'Soborno omitido: {reason}',
      logPrisonError: 'Error de prisión: {msg}',
      logAirportCollect: 'Aeropuerto: recogiendo {n} cargas.',
      logAirportBuy: 'Aeropuerto: comprando carga por ${price}.',
      logBankDeposit: 'Banco: depositando ${amount}.',
      logCollectEarnings: 'Ganancias: recogiendo ${amount}.',
      logFreeDice: 'Tirando dado gratis ({n} restantes).',
      logHealLow: 'HP {hp}% < {threshold}%. Usando objeto.',
      logHealFailed: 'Objeto no usado: {reason} {error}',
      logStatusLine: 'Estado: HP={hp}% Energía={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'Robo de banda omitido: HP bajo el umbral.',
      logGangSkipped: 'Robo de banda omitido: {reason}',
      logCycleError: 'Error de ciclo: {msg}',
      logStartedToken: 'Bot iniciado. Token listo.',
      logStartedNoToken: 'Bot iniciado. Esperando token.',
      logBridgeError: 'Error del bridge: {msg}',
      logStopped: 'Bot detenido.',
      logSynced: 'Estadísticas sincronizadas.',
      logSyncError: 'Error de sincronización: {msg}',
      logPanelLoaded: 'Panel cargado.',
      logAutoStart: 'Auto-iniciando desde la sesión anterior...',
      logMaintDone: '{label}: hecho.',
      logMaintError: 'Error de {label}: {msg}',
      logPreset: 'Preset de tiempos → {name} (acción {min}-{max}ms, ciclo {cmin}-{cmax}ms)',
      logToggleOn: 'ACTIVADO', logToggleOff: 'DESACTIVADO',
      logSettingChanged: '{key}: {value}',
      logItemSelected: 'Objeto seleccionado: {id}',
      logTriggerChanged: 'Disparador del objeto: {v}',
      logFilterChanged: 'Filtro de robo: {v}',
      logLangChanged: 'Idioma cambiado: {name}',
      logTaskError: 'Error de tarea: {label} — {msg}',
      combatRobberyWin: '🎯 Robo exitoso: {name} (poder {power}, energía {energy}){rewards}',
      combatRobberyLose: '💥 Robo fallido: {name} (poder {power})',
      combatGangWin: '🎯 Robo de banda: {name}{rewards}',
      combatGangLose: '💥 Robo de banda fallido: {name}',
      combatAssaultWin: '⚔️ Ataque exitoso: {name} (poder {power}){rewards}',
      combatAssaultLose: '💀 Ataque fallido: {name}',
      combatHpLost: '   ↳ -{n} HP',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'Subir nivel', maintTraining: 'Entrenamiento', maintAirport: 'Aeropuerto',
      maintHookers: 'Ganancias', maintDice: 'Dado', maintBank: 'Banco',
    },

    fr: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'Automatisation', tabStrategy: 'Stratégie', tabLogs: 'Journaux',
      tabCombat: 'Gains', tabLanguages: 'Langues',
      btnStart: 'Démarrer', btnStop: 'Arrêter', btnSync: 'Synchroniser',
      secMainRoutine: 'Routine principale', secTiming: 'Timing (ms/délai)',
      secInventory: "Utilisation automatique de l'inventaire", secAirport: 'Aéroport',
      secIncome: 'Revenus et banque', secRobbery: 'Vol',
      secStamina: "Récupération d'endurance", secCombat: 'Combat',
      secPrison: 'Prison', secHospital: 'Hôpital',
      statPlayer: 'Joueur', statLevel: 'Niveau', statStamina: 'Endurance',
      statTickets: 'Tickets', statHP: 'PV', statRobberyPower: 'Puissance de vol',
      statAssaultPower: "Puissance d'attaque", statCycle: 'Cycle',
      statsActions: 'Actions', statsCycles: 'Cycles', statsErrors: 'Erreurs',
      runtimeLabel: 'Durée active',
      autoRobbery: 'Vol automatique', autoRobberyTip: 'Effectue automatiquement le vol le plus fort dans la plage sûre.',
      autoGangRobbery: 'Vol de gang', autoGangRobberyTip: "Accepte et exécute automatiquement une invitation de vol de gang.",
      autoStamina: 'Recharge endurance', autoStaminaTip: "Recharge automatiquement l'endurance sous le seuil.",
      autoAssault: 'Combat bots IA', autoAssaultTip: "Chasse les bots IA sous votre puissance. N'attaque pas sous les PV minimaux.",
      autoDetox: 'Désintoxication', autoDetoxTip: "Désintoxication automatique au seuil d'addiction.",
      autoLevelUp: 'Montée de niveau auto', autoLevelUpTip: 'Demande le niveau suivant quand les conditions sont remplies.',
      autoTraining: 'Entraînement', autoTrainingTip: 'Démarre un entraînement disponible à partir du niveau de crime 3.',
      presetRecommended: 'Recommandé', presetSlow: 'Plus lent',
      presetMedium: 'Moyen', presetMediumSub: 'Moyen rapide',
      presetFast: 'Rapide', presetFastSub: 'Risque',
      timingMinDelay: "Délai min. d'action (ms)", timingMinDelayTip: 'Attente minimale entre les transitions. Plus bas = plus rapide mais risqué.',
      timingMaxDelay: "Délai max. d'action (ms)", timingMaxDelayTip: 'Attente maximale entre les transitions.',
      timingCycleMin: 'Délai min. de cycle (ms)', timingCycleMinTip: 'Attente minimale entre deux cycles principaux.',
      timingCycleMax: 'Délai max. de cycle (ms)', timingCycleMaxTip: 'Attente maximale entre deux cycles principaux.',
      timingActivityMin: "Intervalle min. d'activité (ms)", timingActivityMinTip: "Attente minimale entre deux types d'action. Protection anti-ban.",
      timingActivityMax: "Intervalle max. d'activité (ms)", timingActivityMaxTip: "Attente maximale entre deux types d'action.",
      autoHealing: "Utilisation auto d'objet", autoHealingTip: "Active automatiquement l'objet sélectionné selon le déclencheur.",
      healingItem: 'Objet', healingItemTip: "Choisissez l'objet à utiliser. Utilisez Sync pour actualiser.",
      healingTrigger: 'Quand utiliser', healingTriggerTip: 'Choisissez bas PV, avant Vol/Attaque, ou les deux.',
      healingTriggerLowHp: 'Quand les PV baissent', healingTriggerBeforeAction: 'Avant vol ou attaque', healingTriggerBoth: 'Les deux',
      healingHp: 'Seuil de PV (%)', healingHpTip: "L'objet est utilisé quand les PV passent sous ce pourcentage.",
      autoAirport: 'Aéroport', autoAirportTip: 'Collecte automatiquement la cargaison arrivée.',
      airportAutoBuy: 'Acheter la cargaison la moins chère', airportAutoBuyTip: 'Achète automatiquement la cargaison la moins chère sur piste libre.',
      airportMaxCargo: 'Max par cargaison ($)', airportMaxCargoTip: 'Montant maximum par cargaison.',
      airportReserve: 'Réserve après achat ($)', airportReserveTip: 'Les achats ne descendront pas sous cette réserve.',
      autoCollectHookers: 'Collecter les revenus', autoCollectHookersTip: 'Collecte les revenus des prostituées au-dessus du minimum.',
      autoFreeDice: 'Lancer de dé gratuit', autoFreeDiceTip: 'Utilise le lancer de dé gratuit du serveur.',
      autoBankDeposit: "Déposer l'excédent à la banque", autoBankDepositTip: 'Dépose les espèces au-dessus de la réserve à la banque.',
      bankReserve: 'Espèces en main ($)', bankReserveTip: 'Ce montant reste en main ; le reste va à la banque.',
      bankMin: 'Dépôt minimum ($)', bankMinTip: 'Les dépôts sous ce montant sont ignorés.',
      robberyFilter: 'Type de vol', robberyFilterTip: "N'effectue que le type de vol sélectionné.",
      robberyFilterAll: 'Tous', robberyFilterCash: 'Espèces uniquement', robberyFilterStocks: 'Actions',
      robberyFilterEvents: 'Événements', robberyFilterCashDrugs: 'Espèces et drogues/composants',
      robberyMargin: 'Sécurité de vol (%)', robberyMarginTip: 'Ne vole que ceux dont la puissance entre dans ce % de la vôtre.',
      staminaFloor: 'Recharger sous (%)', staminaFloorTip: 'La recharge auto démarre sous ce %.',
      staminaTarget: 'Endurance cible (%)', staminaTargetTip: "La recharge monte l'endurance jusqu'à ce %.",
      ticketTarget: 'Objectif tickets', ticketTargetTip: "Points d'endurance à atteindre avec les tickets. 100 = 1 ticket.",
      ticketReserve: 'Réserve minimum de tickets', ticketReserveTip: 'Les tickets sous ce montant sont conservés. 0 = illimité.',
      refillCash: 'Limite espèces par recharge ($)', refillCashTip: 'Espèces max dépensées pour entrer en rave ou recharger.',
      useTicket: 'Utiliser les tickets', useTicketTip: 'Utiliser les tickets en rechargeant ? Sinon rave uniquement.',
      unsafeRave: 'Raves publics non sécurisés', unsafeRaveTip: 'Des attaques sont possibles. Si actif, raves non sûrs autorisés.',
      assaultHp: 'PV minimum (%)', assaultHpTip: "N'attaquera pas sous ce % de PV.",
      assaultMargin: 'Sécurité de combat (%)', assaultMarginTip: "N'attaque que les bots dont la puissance entre dans ce % de la vôtre.",
      autoPrisonBribe: 'Sortir de prison (pot-de-vin)', autoPrisonBribeTip: 'Paie le pot-de-vin en espèces si incarcéré.',
      prisonMax: 'Pot-de-vin max ($)', prisonMaxTip: 'Les pots-de-vin au-dessus sont ignorés.',
      detoxAddiction: "Seuil d'addiction (%)", detoxAddictionTip: 'Désintoxication effectuée au seuil atteint.',
      logActivity: 'Activité', logCombatTitle: "Récompenses de vol et d'attaque",
      statusReady: 'Prêt.', statusStopped: 'Arrêté.', statusStarted: 'Démarré.',
      statusSyncing: 'Synchronisation...', statusSynced: 'Synchronisé.',
      selectNone: 'Aucun',
      languageInfo: "Choisissez la langue de l'interface. Les changements sont instantanés.",
      languageLabel: 'Langue',
      secVictimFilters: 'Filtres de victimes',
      victimUserBlacklist: 'Liste noire (pseudo)',
      victimUserBlacklistTip: 'Séparés par virgule. Ignore les victimes contenant ces pseudos.',
      victimIdBlacklist: 'Liste noire (ID)',
      victimIdBlacklistTip: 'Séparés par virgule. Ignore les victimes avec ces IDs.',
      victimCountryBlacklist: 'Liste noire (pays)',
      victimCountryBlacklistTip: 'Séparés par virgule (tr, us). Ignore les victimes de ces pays.',
      victimUserWhitelist: 'Liste blanche (pseudo)',
      victimUserWhitelistTip: 'Si défini, attaque UNIQUEMENT les victimes correspondant à ces pseudos.',
      victimIdWhitelist: 'Liste blanche (ID)',
      victimIdWhitelistTip: 'Si défini, attaque UNIQUEMENT les victimes avec ces IDs.',
      secCharacterCriteria: 'Critères par personnage',
      criteriaEnable: 'Appliquer les critères par personnage',
      criteriaEnableTip: 'Si activé, les plages niveau/respect ci-dessous sont appliquées par classe.',
      criteriaHint: '0 = pas de limite. Seuls les champs remplis sont filtrés.',
      criteriaChar: 'Personnage',
      criteriaMaxLevel: 'Niv. max',
      criteriaMinResp: 'Respect min.',
      criteriaMaxResp: 'Respect max.',
      secInvestigation: 'Enquête sur le compte',
      investigateBtn: 'Vérifier le compte',
      investigateHint: "Vérifie si le compte est sous enquête pour utilisation de bot.",
      investigateChecking: 'Vérification de l\'enquête...',
      investigateClean: '✓ Compte propre, aucune enquête.',
      investigateFound: '⚠️ COMPTE SOUS ENQUÊTE ! Continuer est risqué.',
      investigateError: "Erreur de vérification : {msg}",
      investigateConfirm: "Votre compte semble sous enquête pour utilisation de bot. Continuer quand même ?",
      logInvestigationClean: 'Vérification enquête : propre.',
      logInvestigationFound: 'Compte sous enquête ! Journaux dans la console.',
      logVictimFiltered: 'Victime filtrée : {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'Université',
      autoUniversity: 'Université', autoUniversityTip: 'Rejoint automatiquement les cours disponibles, donne la présence et les termine.',
      universityAutoEnroll: 'Inscription auto', universityAutoEnrollTip: "S'inscrit au prochain cours disponible (peut coûter de l'argent).",
      universityPayment: 'Mode de paiement', universityPaymentCash: 'Espèces', universityPaymentCredits: 'Crédits',
      secFactories: 'Usines et laboratoire',
      autoBuildings: 'Collecter les usines', autoBuildingsTip: 'Collecte la production terminée des usines et effectue la maintenance.',
      autoLaboratory: 'Laboratoire', autoLaboratoryTip: 'Gère la file de production du labo : collecte les lots et en démarre de nouveaux.',
      autoMaintain: 'Maintenance auto', autoMaintainTip: 'Répare les usines qui ont besoin de maintenance.',
      productionQty: 'Quantité par lot (0 = max)', productionQtyTip: 'Composants utilisés par lot du labo. 0 = maximum.',
      productionComponents: 'Composants du laboratoire',
      productionComponentsHint: 'Laissez vide pour utiliser tous les composants disponibles. Sélection multiple.',
      logUniEnroll: 'Université : inscrit → {name}',
      logUniPresence: 'Université : présence donnée ({name})',
      logUniComplete: 'Université : cours terminé ({name})',
      logUniNoAction: 'Université : aucun cours disponible.',
      logUniError: 'Erreur université : {msg}',
      logBuildingsCollect: 'Usines : {n} productions terminées collectées.',
      logBuildingsMaintain: 'Usines : maintenance effectuée.',
      logBuildingsNoAction: 'Usines : rien à faire.',
      logBuildingsError: 'Erreur usine : {msg}',
      logLabStart: 'Laboratoire : production de {qty}× composant #{drug} démarrée.',
      logLabComplete: 'Laboratoire : lot terminé → {n} collectés.',
      logLabNoAction: 'Laboratoire : rien à faire.',
      logLabError: 'Erreur laboratoire : {msg}',
      maintUniversity: 'Université', maintBuildings: 'Usines', maintLaboratory: 'Laboratoire',
      errBridgeTimeout: 'Délai du bridge dépassé', errNoToken: 'Token non capturé',
      errForeignOrigin: 'Origine externe bloquée', errApiOnly: 'Seul /api/v1/ est accepté',
      errNoEvents: 'Événements Vue introuvables', errNoRouter: 'Router Vue introuvable',
      errUnknownMsg: 'Type de message inconnu',
      statusDead: 'Personnage mort. En attente.',
      statusInPrison: 'En prison. Pot-de-vin en cours...',
      statusInPrisonBribeOff: 'En prison. Pot-de-vin désactivé.',
      statusDetox: 'Addiction {p}%. Désintoxication...',
      statusLowStamina: 'Endurance basse ({p}%). Recharge...',
      statusRobbery: 'Vol en cours...',
      statusGangRobbery: 'Vol de gang en cours...',
      statusHuntingBot: "Recherche d'un bot IA...",
      statusNoAction: 'Aucune action active.',
      statusError: 'Erreur : {msg}',
      statusBridgeNotReady: 'Bridge non prêt. Rechargez la page.',
      logNav: 'Page → {path}',
      logNavError: 'Erreur de navigation : {msg}',
      logExitError: 'Erreur de sortie : {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — réessai {i}/{max}...',
      logInventoryLoaded: 'Inventaire chargé : {n} objets.',
      logInventoryError: "Erreur de chargement d'inventaire : {msg}",
      logItemActivate: "Activation de l'objet : #{id}",
      logRobbery: 'Vol : {name} (puissance {power}, endurance {energy})',
      logRobberySkipped: 'Vol ignoré : {msg}',
      logGangNoInvite: 'Vol de gang : aucune invitation ({n}).',
      logGangAccepting: "Acceptation de l'invitation : {name} (id {id})",
      logGangAccepted: '✓ Vol de gang accepté → {path}',
      logGangAcceptFailed: "❌ Échec d'acceptation. Dernier : {msg}",
      logGangExecuting: 'Exécution du vol de gang : {name} (id {id})',
      logGangExecuted: '✓ Vol de gang exécuté → {path}',
      logGangExecFailed: "❌ Échec d'exécution. Dernier : {msg}",
      logLevelUpReady: 'Montée de niveau : conditions remplies, demande...',
      logLevelUpSent: 'Demande de montée de niveau envoyée.',
      logTrainingStarting: 'Démarrage entraînement : {name}',
      logTrainingStarted: 'Entraînement démarré.',
      logStaminaRefill: 'Recharge : actuel={cur}, capacité={cap}, cible={target}, tickets={tickets}',
      logTicketRefill: 'Recharge tickets : {n} tickets',
      logTicketRefillSuccess: 'Recharge OK : {before} → {after}',
      logTicketRefillFailed: 'Recharge échouée : {msg} → passage au rave party.',
      logTicketReserved: 'Réserve de tickets conservée (dispo : {have}, réserve : {need}).',
      logNoRave: 'Aucun rave approprié trouvé.',
      logClubOverLimit: 'Entrée ${fee}, au-dessus de la limite ${limit}.',
      logEnteringRave: 'Rave party : {name} — entrée (actuel : {before})',
      logTryingRefill: 'Essai du bouton de recharge...',
      logEnergyRefilled: 'Endurance rechargée : {before} → {after}',
      logRefillError: 'Erreur de recharge : {msg}',
      logBuyingDrug: 'Achat de drogue : {name}',
      logClubError: 'Erreur de récupération en club : {msg}',
      logBotRoom: 'Salle de chasse : {name} (puissance bot {power})',
      logNoBot: 'Aucun bot, sortie.',
      logAttacking: 'Attaque : {name}',
      logBotError: 'Erreur de chasse : {msg}',
      logDetox: 'Désintoxication : paiement ${price} (addiction {addiction}%)',
      logDetoxDone: 'Désintoxication effectuée (${price}).',
      logDetoxSkipped: 'Désintoxication ignorée : {reason}',
      logDetoxError: 'Erreur de désintoxication : {msg}',
      logPrisonBribe: 'Pot-de-vin prison : ${price}',
      logPrisonBribed: 'Sortie de prison (${price}).',
      logBribeSkipped: 'Pot-de-vin ignoré : {reason}',
      logPrisonError: 'Erreur de prison : {msg}',
      logAirportCollect: 'Aéroport : collecte de {n} cargaisons.',
      logAirportBuy: 'Aéroport : achat de cargaison pour ${price}.',
      logBankDeposit: 'Banque : dépôt de ${amount}.',
      logCollectEarnings: 'Revenus : collecte de ${amount}.',
      logFreeDice: 'Lancer de dé gratuit ({n} restants).',
      logHealLow: "PV {hp}% < {threshold}%. Utilisation d'objet.",
      logHealFailed: 'Objet non utilisé : {reason} {error}',
      logStatusLine: 'Statut : PV={hp}% Endurance={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'Vol de gang ignoré : PV sous le seuil.',
      logGangSkipped: 'Vol de gang ignoré : {reason}',
      logCycleError: 'Erreur de cycle : {msg}',
      logStartedToken: 'Bot démarré. Token prêt.',
      logStartedNoToken: 'Bot démarré. En attente du token.',
      logBridgeError: 'Erreur du bridge : {msg}',
      logStopped: 'Bot arrêté.',
      logSynced: 'Stats synchronisées.',
      logSyncError: 'Erreur de synchronisation : {msg}',
      logPanelLoaded: 'Panneau chargé.',
      logAutoStart: 'Démarrage auto depuis la session précédente...',
      logMaintDone: '{label} : terminé.',
      logMaintError: 'Erreur de {label} : {msg}',
      logPreset: 'Préréglage de timing → {name} (action {min}-{max}ms, cycle {cmin}-{cmax}ms)',
      logToggleOn: 'ACTIVÉ', logToggleOff: 'DÉSACTIVÉ',
      logSettingChanged: '{key} : {value}',
      logItemSelected: 'Objet sélectionné : {id}',
      logTriggerChanged: "Déclencheur d'objet : {v}",
      logFilterChanged: 'Filtre de vol : {v}',
      logLangChanged: 'Langue changée : {name}',
      logTaskError: 'Erreur de tâche : {label} — {msg}',
      combatRobberyWin: '🎯 Vol réussi : {name} (puissance {power}, endurance {energy}){rewards}',
      combatRobberyLose: '💥 Vol échoué : {name} (puissance {power})',
      combatGangWin: '🎯 Vol de gang : {name}{rewards}',
      combatGangLose: '💥 Vol de gang échoué : {name}',
      combatAssaultWin: '⚔️ Attaque réussie : {name} (puissance {power}){rewards}',
      combatAssaultLose: '💀 Attaque échouée : {name}',
      combatHpLost: '   ↳ -{n} PV',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'Montée niveau', maintTraining: 'Entraînement', maintAirport: 'Aéroport',
      maintHookers: 'Revenus', maintDice: 'Dé', maintBank: 'Banque',
    },

    pt: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'Automação', tabStrategy: 'Estratégia', tabLogs: 'Logs',
      tabCombat: 'Ganhos', tabLanguages: 'Idiomas',
      btnStart: 'Iniciar', btnStop: 'Parar', btnSync: 'Sincronizar',
      secMainRoutine: 'Rotina principal', secTiming: 'Tempo (ms/atraso)',
      secInventory: 'Uso automático de inventário', secAirport: 'Aeroporto',
      secIncome: 'Renda e banco', secRobbery: 'Roubo',
      secStamina: 'Recuperação de estamina', secCombat: 'Combate',
      secPrison: 'Prisão', secHospital: 'Hospital',
      statPlayer: 'Jogador', statLevel: 'Nível', statStamina: 'Estamina',
      statTickets: 'Tickets', statHP: 'HP', statRobberyPower: 'Poder de roubo',
      statAssaultPower: 'Poder de ataque', statCycle: 'Ciclo',
      statsActions: 'Ações', statsCycles: 'Ciclos', statsErrors: 'Erros',
      runtimeLabel: 'Tempo ativo',
      autoRobbery: 'Roubo automático', autoRobberyTip: 'Realiza automaticamente o roubo mais forte dentro do intervalo seguro.',
      autoGangRobbery: 'Roubo de gangue', autoGangRobberyTip: 'Aceita e executa automaticamente um convite de roubo de gangue.',
      autoStamina: 'Recarregar estamina', autoStaminaTip: 'Recarrega estamina automaticamente quando cai abaixo do limite.',
      autoAssault: 'Luta contra bots IA', autoAssaultTip: 'Caça bots IA abaixo do seu poder. Não ataca abaixo do HP mínimo.',
      autoDetox: 'Desintoxicação', autoDetoxTip: 'Desintoxicação automática quando o limite de vício é alcançado.',
      autoLevelUp: 'Subir de nível automático', autoLevelUpTip: 'Solicita o próximo nível quando os requisitos são atendidos.',
      autoTraining: 'Treinamento', autoTrainingTip: 'Inicia um treino disponível a partir do nível de crime 3.',
      presetRecommended: 'Recomendado', presetSlow: 'Mais lento',
      presetMedium: 'Médio', presetMediumSub: 'Médio rápido',
      presetFast: 'Rápido', presetFastSub: 'Risco',
      timingMinDelay: 'Atraso mín. de ação (ms)', timingMinDelayTip: 'Espera mínima entre transições. Menor = mais rápido mas arriscado.',
      timingMaxDelay: 'Atraso máx. de ação (ms)', timingMaxDelayTip: 'Espera máxima entre transições.',
      timingCycleMin: 'Atraso mín. de ciclo (ms)', timingCycleMinTip: 'Espera mínima entre dois ciclos principais.',
      timingCycleMax: 'Atraso máx. de ciclo (ms)', timingCycleMaxTip: 'Espera máxima entre dois ciclos principais.',
      timingActivityMin: 'Intervalo mín. de atividade (ms)', timingActivityMinTip: 'Espera mínima entre dois tipos de ação diferentes. Proteção anti-ban.',
      timingActivityMax: 'Intervalo máx. de atividade (ms)', timingActivityMaxTip: 'Espera máxima entre dois tipos de ação diferentes.',
      autoHealing: 'Uso automático de item', autoHealingTip: 'Ativa automaticamente o item selecionado com base no gatilho.',
      healingItem: 'Item', healingItemTip: 'Escolha o item a usar. Use Sync para atualizar a lista.',
      healingTrigger: 'Quando usar', healingTriggerTip: 'Escolha usar com HP baixo, antes de Roubo/Ataque, ou ambos.',
      healingTriggerLowHp: 'Quando o HP cair', healingTriggerBeforeAction: 'Antes de roubo ou ataque', healingTriggerBoth: 'Ambos',
      healingHp: 'Limite de HP (%)', healingHpTip: 'O item é usado quando o HP cai abaixo dessa porcentagem.',
      autoAirport: 'Aeroporto', autoAirportTip: 'Coleta automaticamente a carga que chegou.',
      airportAutoBuy: 'Comprar carga mais barata', airportAutoBuyTip: 'Compra automaticamente a carga mais barata em pistas vazias.',
      airportMaxCargo: 'Máx. por carga ($)', airportMaxCargoTip: 'Dinheiro máximo por carga.',
      airportReserve: 'Reserva após compra ($)', airportReserveTip: 'As compras não deixarão o dinheiro abaixo dessa reserva.',
      autoCollectHookers: 'Coletar ganhos', autoCollectHookersTip: 'Coleta ganhos das prostitutas acima do mínimo.',
      autoFreeDice: 'Dado grátis', autoFreeDiceTip: 'Usa o lançamento grátis de dado do servidor.',
      autoBankDeposit: 'Depositar excesso no banco', autoBankDepositTip: 'Deposita dinheiro acima da reserva no banco.',
      bankReserve: 'Dinheiro em mãos ($)', bankReserveTip: 'Este valor fica em mãos; o resto vai para o banco.',
      bankMin: 'Depósito mínimo ($)', bankMinTip: 'Depósitos abaixo desse valor são ignorados.',
      robberyFilter: 'Tipo de roubo', robberyFilterTip: 'Executa apenas o tipo de roubo selecionado.',
      robberyFilterAll: 'Todos', robberyFilterCash: 'Só dinheiro', robberyFilterStocks: 'Ações',
      robberyFilterEvents: 'Eventos', robberyFilterCashDrugs: 'Dinheiro e drogas/componentes',
      robberyMargin: 'Segurança de roubo (%)', robberyMarginTip: 'Só rouba quem estiver dentro desse % do seu poder.',
      staminaFloor: 'Recarregar abaixo (%)', staminaFloorTip: 'Recarga automática começa abaixo desse %.',
      staminaTarget: 'Estamina alvo (%)', staminaTargetTip: 'A recarga eleva a estamina até esse %.',
      ticketTarget: 'Meta de tickets', ticketTargetTip: 'Pontos de estamina a atingir com tickets. 100 = 1 ticket.',
      ticketReserve: 'Reserva mínima de tickets', ticketReserveTip: 'Tickets abaixo desse valor são mantidos. 0 = sem limite.',
      refillCash: 'Limite de dinheiro por recarga ($)', refillCashTip: 'Dinheiro máximo gasto em entrada de rave ou recarga.',
      useTicket: 'Usar tickets', useTicketTip: 'Usar tickets ao recarregar? Se desligado, apenas rave.',
      unsafeRave: 'Raves públicos inseguros', unsafeRaveTip: 'Ataques são possíveis. Se ativo, raves inseguros são permitidos.',
      assaultHp: 'HP mínimo (%)', assaultHpTip: 'Não ataca se o HP estiver abaixo desse %.',
      assaultMargin: 'Segurança de combate (%)', assaultMarginTip: 'Só ataca bots com poder dentro desse % do seu.',
      autoPrisonBribe: 'Sair da prisão (suborno)', autoPrisonBribeTip: 'Paga o suborno em dinheiro se preso.',
      prisonMax: 'Suborno máx. ($)', prisonMaxTip: 'Subornos acima disso são ignorados.',
      detoxAddiction: 'Limite de vício (%)', detoxAddictionTip: 'Desintoxicação é feita quando o vício atinge esse %.',
      logActivity: 'Atividade', logCombatTitle: 'Recompensas de roubo e ataque',
      statusReady: 'Pronto.', statusStopped: 'Parado.', statusStarted: 'Iniciado.',
      statusSyncing: 'Sincronizando...', statusSynced: 'Sincronizado.',
      selectNone: 'Nenhum',
      languageInfo: 'Escolha o idioma da interface. As alterações são instantâneas.',
      languageLabel: 'Idioma',
      secVictimFilters: 'Filtros de vítimas',
      victimUserBlacklist: 'Lista negra (usuário)',
      victimUserBlacklistTip: 'Separados por vírgula. Ignora vítimas contendo esses usuários.',
      victimIdBlacklist: 'Lista negra (ID)',
      victimIdBlacklistTip: 'Separados por vírgula. Ignora vítimas com esses IDs.',
      victimCountryBlacklist: 'Lista negra (país)',
      victimCountryBlacklistTip: 'Separados por vírgula (tr, us). Ignora vítimas desses países.',
      victimUserWhitelist: 'Lista branca (usuário)',
      victimUserWhitelistTip: 'Se definido, ataca SOMENTE vítimas correspondentes a esses usuários.',
      victimIdWhitelist: 'Lista branca (ID)',
      victimIdWhitelistTip: 'Se definido, ataca SOMENTE vítimas com esses IDs.',
      secCharacterCriteria: 'Critérios por personagem',
      criteriaEnable: 'Aplicar critérios por personagem',
      criteriaEnableTip: 'Quando ativo, os intervalos de nível/respeito abaixo são aplicados por classe.',
      criteriaHint: '0 = sem limite. Apenas campos preenchidos são filtrados.',
      criteriaChar: 'Personagem',
      criteriaMaxLevel: 'Nív. máx.',
      criteriaMinResp: 'Respeito mín.',
      criteriaMaxResp: 'Respeito máx.',
      secInvestigation: 'Investigação da conta',
      investigateBtn: 'Verificar conta',
      investigateHint: 'Verifica se a conta está sob investigação por uso de bot.',
      investigateChecking: 'Verificando investigação da conta...',
      investigateClean: '✓ Conta limpa, sem investigação.',
      investigateFound: '⚠️ CONTA SOB INVESTIGAÇÃO! Continuar é arriscado.',
      investigateError: 'Erro de investigação: {msg}',
      investigateConfirm: 'Sua conta parece sob investigação por uso de bot. Continuar mesmo assim?',
      logInvestigationClean: 'Verificação de investigação: limpa.',
      logInvestigationFound: 'Conta sob investigação! Logs no console.',
      logVictimFiltered: 'Vítima filtrada: {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'Universidade',
      autoUniversity: 'Universidade', autoUniversityTip: 'Entra automaticamente nas aulas disponíveis, dá presença e completa.',
      universityAutoEnroll: 'Inscrição automática', universityAutoEnrollTip: 'Inscreve na próxima aula disponível (pode custar dinheiro).',
      universityPayment: 'Método de pagamento', universityPaymentCash: 'Dinheiro', universityPaymentCredits: 'Créditos',
      secFactories: 'Fábricas e laboratório',
      autoBuildings: 'Coletar fábricas', autoBuildingsTip: 'Coleta produção terminada das fábricas e realiza manutenção.',
      autoLaboratory: 'Laboratório', autoLaboratoryTip: 'Gerencia a fila de produção do laboratório: coleta lotes e inicia novos.',
      autoMaintain: 'Manutenção automática', autoMaintainTip: 'Repara fábricas que precisam de manutenção.',
      productionQty: 'Quantidade por lote (0 = máx.)', productionQtyTip: 'Componentes usados por lote do laboratório. 0 = máximo.',
      productionComponents: 'Componentes do laboratório',
      productionComponentsHint: 'Deixe vazio para usar todos os componentes disponíveis. Seleção múltipla.',
      logUniEnroll: 'Universidade: inscrito → {name}',
      logUniPresence: 'Universidade: presença dada ({name})',
      logUniComplete: 'Universidade: aula concluída ({name})',
      logUniNoAction: 'Universidade: nenhuma aula disponível.',
      logUniError: 'Erro da universidade: {msg}',
      logBuildingsCollect: 'Fábricas: {n} produções terminadas coletadas.',
      logBuildingsMaintain: 'Fábricas: manutenção realizada.',
      logBuildingsNoAction: 'Fábricas: nada para fazer.',
      logBuildingsError: 'Erro da fábrica: {msg}',
      logLabStart: 'Laboratório: produção iniciada de {qty}× componente #{drug}.',
      logLabComplete: 'Laboratório: lote concluído → {n} coletados.',
      logLabNoAction: 'Laboratório: nada para fazer.',
      logLabError: 'Erro do laboratório: {msg}',
      maintUniversity: 'Universidade', maintBuildings: 'Fábricas', maintLaboratory: 'Laboratório',
      errBridgeTimeout: 'Tempo esgotado do bridge', errNoToken: 'Token não capturado',
      errForeignOrigin: 'Origem externa bloqueada', errApiOnly: 'Apenas /api/v1/ aceito',
      errNoEvents: 'Eventos Vue não encontrados', errNoRouter: 'Router Vue não encontrado',
      errUnknownMsg: 'Tipo de mensagem desconhecido',
      statusDead: 'Personagem morto. Aguardando.',
      statusInPrison: 'Na prisão. Tentando suborno...',
      statusInPrisonBribeOff: 'Na prisão. Suborno desligado.',
      statusDetox: 'Vício {p}%. Desintoxicando...',
      statusLowStamina: 'Estamina baixa ({p}%). Recarregando...',
      statusRobbery: 'Realizando roubo...',
      statusGangRobbery: 'Realizando roubo de gangue...',
      statusHuntingBot: 'Procurando bot IA...',
      statusNoAction: 'Sem ação ativa.',
      statusError: 'Erro: {msg}',
      statusBridgeNotReady: 'Bridge não está pronto. Recarregue a página.',
      logNav: 'Página → {path}',
      logNavError: 'Erro de navegação: {msg}',
      logExitError: 'Erro ao sair: {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — tentativa {i}/{max}...',
      logInventoryLoaded: 'Inventário carregado: {n} itens.',
      logInventoryError: 'Erro ao carregar inventário: {msg}',
      logItemActivate: 'Ativando item: #{id}',
      logRobbery: 'Roubo: {name} (poder {power}, estamina {energy})',
      logRobberySkipped: 'Roubo ignorado: {msg}',
      logGangNoInvite: 'Roubo de gangue: sem convite ({n}).',
      logGangAccepting: 'Aceitando convite: {name} (id {id})',
      logGangAccepted: '✓ Roubo de gangue aceito → {path}',
      logGangAcceptFailed: '❌ Falha ao aceitar. Último: {msg}',
      logGangExecuting: 'Executando roubo de gangue: {name} (id {id})',
      logGangExecuted: '✓ Roubo de gangue executado → {path}',
      logGangExecFailed: '❌ Falha ao executar. Último: {msg}',
      logLevelUpReady: 'Subir nível: requisitos atendidos, solicitando...',
      logLevelUpSent: 'Solicitação de subir nível enviada.',
      logTrainingStarting: 'Iniciando treino: {name}',
      logTrainingStarted: 'Treino iniciado.',
      logStaminaRefill: 'Recarga: atual={cur}, capacidade={cap}, meta={target}, tickets={tickets}',
      logTicketRefill: 'Recarga com tickets: {n} tickets',
      logTicketRefillSuccess: 'Recarga OK: {before} → {after}',
      logTicketRefillFailed: 'Recarga falhou: {msg} → usando rave party.',
      logTicketReserved: 'Reserva de tickets mantida (tem: {have}, reserva: {need}).',
      logNoRave: 'Nenhum rave adequado encontrado.',
      logClubOverLimit: 'Entrada ${fee}, acima do limite ${limit}.',
      logEnteringRave: 'Rave party: {name} — entrando (atual: {before})',
      logTryingRefill: 'Tentando botão de recarregar...',
      logEnergyRefilled: 'Estamina recarregada: {before} → {after}',
      logRefillError: 'Erro de recarga: {msg}',
      logBuyingDrug: 'Comprando droga: {name}',
      logClubError: 'Erro de recuperação no clube: {msg}',
      logBotRoom: 'Sala de caça: {name} (poder bot {power})',
      logNoBot: 'Nenhum bot chegou, saindo.',
      logAttacking: 'Atacando: {name}',
      logBotError: 'Erro de caça: {msg}',
      logDetox: 'Desintoxicação: pagando ${price} (vício {addiction}%)',
      logDetoxDone: 'Desintoxicação feita (${price}).',
      logDetoxSkipped: 'Desintoxicação ignorada: {reason}',
      logDetoxError: 'Erro de desintoxicação: {msg}',
      logPrisonBribe: 'Suborno de prisão: ${price}',
      logPrisonBribed: 'Saída da prisão (${price}).',
      logBribeSkipped: 'Suborno ignorado: {reason}',
      logPrisonError: 'Erro de prisão: {msg}',
      logAirportCollect: 'Aeroporto: coletando {n} cargas.',
      logAirportBuy: 'Aeroporto: comprando carga por ${price}.',
      logBankDeposit: 'Banco: depositando ${amount}.',
      logCollectEarnings: 'Ganhos: coletando ${amount}.',
      logFreeDice: 'Rolando dado grátis ({n} restantes).',
      logHealLow: 'HP {hp}% < {threshold}%. Usando item.',
      logHealFailed: 'Item não usado: {reason} {error}',
      logStatusLine: 'Status: HP={hp}% Estamina={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'Roubo de gangue ignorado: HP abaixo do limite.',
      logGangSkipped: 'Roubo de gangue ignorado: {reason}',
      logCycleError: 'Erro de ciclo: {msg}',
      logStartedToken: 'Bot iniciado. Token pronto.',
      logStartedNoToken: 'Bot iniciado. Aguardando token.',
      logBridgeError: 'Erro do bridge: {msg}',
      logStopped: 'Bot parado.',
      logSynced: 'Stats sincronizadas.',
      logSyncError: 'Erro de sincronização: {msg}',
      logPanelLoaded: 'Painel carregado.',
      logAutoStart: 'Auto-iniciando da sessão anterior...',
      logMaintDone: '{label}: concluído.',
      logMaintError: 'Erro de {label}: {msg}',
      logPreset: 'Preset de tempo → {name} (ação {min}-{max}ms, ciclo {cmin}-{cmax}ms)',
      logToggleOn: 'ATIVADO', logToggleOff: 'DESATIVADO',
      logSettingChanged: '{key}: {value}',
      logItemSelected: 'Item selecionado: {id}',
      logTriggerChanged: 'Gatilho do item: {v}',
      logFilterChanged: 'Filtro de roubo: {v}',
      logLangChanged: 'Idioma alterado: {name}',
      logTaskError: 'Erro de tarefa: {label} — {msg}',
      combatRobberyWin: '🎯 Roubo bem-sucedido: {name} (poder {power}, estamina {energy}){rewards}',
      combatRobberyLose: '💥 Roubo falhou: {name} (poder {power})',
      combatGangWin: '🎯 Roubo de gangue: {name}{rewards}',
      combatGangLose: '💥 Roubo de gangue falhou: {name}',
      combatAssaultWin: '⚔️ Ataque bem-sucedido: {name} (poder {power}){rewards}',
      combatAssaultLose: '💀 Ataque falhou: {name}',
      combatHpLost: '   ↳ -{n} HP',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'Subir nível', maintTraining: 'Treino', maintAirport: 'Aeroporto',
      maintHookers: 'Ganhos', maintDice: 'Dado', maintBank: 'Banco',
    },

    pl: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'Automatyzacja', tabStrategy: 'Strategia', tabLogs: 'Logi',
      tabCombat: 'Zarobki', tabLanguages: 'Języki',
      btnStart: 'Rozpocznij', btnStop: 'Zatrzymaj', btnSync: 'Synchronizuj',
      secMainRoutine: 'Główna rutyna', secTiming: 'Czas (ms/opóźnienie)',
      secInventory: 'Auto użycie ekwipunku', secAirport: 'Lotnisko',
      secIncome: 'Dochód i bank', secRobbery: 'Kradzież',
      secStamina: 'Regeneracja wytrzymałości', secCombat: 'Walka',
      secPrison: 'Więzienie', secHospital: 'Szpital',
      statPlayer: 'Gracz', statLevel: 'Poziom', statStamina: 'Wytrzymałość',
      statTickets: 'Bilety', statHP: 'HP', statRobberyPower: 'Moc kradzieży',
      statAssaultPower: 'Moc ataku', statCycle: 'Cykl',
      statsActions: 'Akcje', statsCycles: 'Cykle', statsErrors: 'Błędy',
      runtimeLabel: 'Czas pracy',
      autoRobbery: 'Auto kradzież', autoRobberyTip: 'Automatycznie wykonuje najsilniejszą kradzież w bezpiecznym zakresie.',
      autoGangRobbery: 'Kradzież gangu', autoGangRobberyTip: 'Automatycznie akceptuje i wykonuje zaproszenie do kradzieży gangu.',
      autoStamina: 'Uzupełnianie wytrzymałości', autoStaminaTip: 'Automatycznie uzupełnia wytrzymałość poniżej progu.',
      autoAssault: 'Walka z botami AI', autoAssaultTip: 'Poluje na boty AI poniżej twojej mocy. Nie atakuje poniżej min. HP.',
      autoDetox: 'Detoks', autoDetoxTip: 'Automatyczny detoks po osiągnięciu progu uzależnienia.',
      autoLevelUp: 'Auto awans poziomu', autoLevelUpTip: 'Żąda następnego poziomu po spełnieniu wymagań.',
      autoTraining: 'Trening', autoTrainingTip: 'Rozpoczyna dostępny trening od poziomu przestępczości 3.',
      presetRecommended: 'Zalecane', presetSlow: 'Wolniej',
      presetMedium: 'Średnie', presetMediumSub: 'Średnio szybkie',
      presetFast: 'Szybko', presetFastSub: 'Ryzyko',
      timingMinDelay: 'Min. opóźnienie akcji (ms)', timingMinDelayTip: 'Minimalne oczekiwanie między przejściami. Niżej = szybciej, ale ryzykowniej.',
      timingMaxDelay: 'Maks. opóźnienie akcji (ms)', timingMaxDelayTip: 'Maksymalne oczekiwanie między przejściami.',
      timingCycleMin: 'Min. opóźnienie cyklu (ms)', timingCycleMinTip: 'Minimalne oczekiwanie między dwoma głównymi cyklami.',
      timingCycleMax: 'Maks. opóźnienie cyklu (ms)', timingCycleMaxTip: 'Maksymalne oczekiwanie między dwoma głównymi cyklami.',
      timingActivityMin: 'Min. odstęp aktywności (ms)', timingActivityMinTip: 'Minimalne oczekiwanie między dwoma różnymi akcjami. Ochrona anti-ban.',
      timingActivityMax: 'Maks. odstęp aktywności (ms)', timingActivityMaxTip: 'Maksymalne oczekiwanie między dwoma różnymi akcjami.',
      autoHealing: 'Auto użycie przedmiotu', autoHealingTip: 'Automatycznie aktywuje wybrany przedmiot według wyzwalacza.',
      healingItem: 'Przedmiot', healingItemTip: 'Wybierz przedmiot. Użyj Sync, aby odświeżyć listę.',
      healingTrigger: 'Kiedy użyć', healingTriggerTip: 'Wybierz: niskie HP, przed kradzieżą/atakiem lub oba.',
      healingTriggerLowHp: 'Gdy HP spadnie', healingTriggerBeforeAction: 'Przed kradzieżą lub atakiem', healingTriggerBoth: 'Oba',
      healingHp: 'Próg HP (%)', healingHpTip: 'Przedmiot zostanie użyty, gdy HP spadnie poniżej tego procentu.',
      autoAirport: 'Lotnisko', autoAirportTip: 'Automatycznie odbiera przybyły ładunek.',
      airportAutoBuy: 'Kup najtańszy ładunek', airportAutoBuyTip: 'Automatycznie kupuje najtańszy ładunek na wolnych pasach.',
      airportMaxCargo: 'Maks. za ładunek ($)', airportMaxCargoTip: 'Maksymalna gotówka za pojedynczy ładunek.',
      airportReserve: 'Rezerwa po zakupie ($)', airportReserveTip: 'Zakupy nie zbiją gotówki poniżej tej rezerwy.',
      autoCollectHookers: 'Zbierz zarobki', autoCollectHookersTip: 'Zbiera zarobki prostytutek powyżej minimum.',
      autoFreeDice: 'Darmowy rzut kością', autoFreeDiceTip: 'Używa darmowego rzutu kością oferowanego przez serwer.',
      autoBankDeposit: 'Wpłać nadwyżkę do banku', autoBankDepositTip: 'Wpłaca gotówkę powyżej rezerwy do banku.',
      bankReserve: 'Gotówka w ręku ($)', bankReserveTip: 'Ta kwota zostaje w ręku; reszta idzie do banku.',
      bankMin: 'Min. wpłata ($)', bankMinTip: 'Wpłaty poniżej tej kwoty są pomijane.',
      robberyFilter: 'Typ kradzieży', robberyFilterTip: 'Wykonuje tylko wybrany typ kradzieży.',
      robberyFilterAll: 'Wszystkie', robberyFilterCash: 'Tylko gotówka', robberyFilterStocks: 'Akcje',
      robberyFilterEvents: 'Wydarzenia', robberyFilterCashDrugs: 'Gotówka i narkotyki/komponenty',
      robberyMargin: 'Bezpieczeństwo kradzieży (%)', robberyMarginTip: 'Kradnie tylko tych, których moc mieści się w tym % twojej.',
      staminaFloor: 'Uzupełnij poniżej (%)', staminaFloorTip: 'Auto-uzupełnianie startuje poniżej tego %.',
      staminaTarget: 'Docelowa wytrzymałość (%)', staminaTargetTip: 'Uzupełnianie podnosi wytrzymałość do tego %.',
      ticketTarget: 'Cel biletów', ticketTargetTip: 'Punkty wytrzymałości do osiągnięcia biletami. 100 = 1 bilet.',
      ticketReserve: 'Minimalna rezerwa biletów', ticketReserveTip: 'Bilety poniżej tej liczby są zachowywane. 0 = bez limitu.',
      refillCash: 'Limit gotówki na uzupełnienie ($)', refillCashTip: 'Maksymalna gotówka na wejście do rave lub uzupełnienie.',
      useTicket: 'Użyj biletów', useTicketTip: 'Używać biletów przy uzupełnianiu? Jeśli wyłączone, tylko rave.',
      unsafeRave: 'Niebezpieczne publiczne rave', unsafeRaveTip: 'Możliwe ataki. Jeśli włączone, dozwolone są niebezpieczne rave.',
      assaultHp: 'Min. HP (%)', assaultHpTip: 'Nie zaatakuje poniżej tego % HP.',
      assaultMargin: 'Bezpieczeństwo walki (%)', assaultMarginTip: 'Atakuje tylko boty o mocy w granicach tego % twojej.',
      autoPrisonBribe: 'Wyjście z więzienia (łapówka)', autoPrisonBribeTip: 'Płaci łapówkę w gotówce, jeśli uwięziony.',
      prisonMax: 'Maks. łapówka ($)', prisonMaxTip: 'Łapówki powyżej tej kwoty są pomijane.',
      detoxAddiction: 'Próg uzależnienia (%)', detoxAddictionTip: 'Detoks wykonywany po osiągnięciu tego %.',
      logActivity: 'Aktywność', logCombatTitle: 'Nagrody za kradzież i atak',
      statusReady: 'Gotowe.', statusStopped: 'Zatrzymane.', statusStarted: 'Rozpoczęte.',
      statusSyncing: 'Synchronizacja...', statusSynced: 'Zsynchronizowano.',
      selectNone: 'Brak',
      languageInfo: 'Wybierz język interfejsu. Zmiany są natychmiastowe.',
      languageLabel: 'Język',
      secVictimFilters: 'Filtry ofiar',
      victimUserBlacklist: 'Czarna lista (nazwa)',
      victimUserBlacklistTip: 'Oddzielone przecinkami. Pomija ofiary zawierające te nazwy.',
      victimIdBlacklist: 'Czarna lista (ID)',
      victimIdBlacklistTip: 'Oddzielone przecinkami. Pomija ofiary o tych ID.',
      victimCountryBlacklist: 'Czarna lista (kraj)',
      victimCountryBlacklistTip: 'Oddzielone przecinkami (tr, us). Pomija ofiary z tych krajów.',
      victimUserWhitelist: 'Biała lista (nazwa)',
      victimUserWhitelistTip: 'Jeśli ustawione, atakuje TYLKO ofiary pasujące do tych nazw.',
      victimIdWhitelist: 'Biała lista (ID)',
      victimIdWhitelistTip: 'Jeśli ustawione, atakuje TYLKO ofiary o tych ID.',
      secCharacterCriteria: 'Kryteria dla postaci',
      criteriaEnable: 'Zastosuj kryteria postaci',
      criteriaEnableTip: 'Gdy włączone, zakresy poziomu/szacunku są egzekwowane dla każdej klasy postaci.',
      criteriaHint: '0 = brak limitu. Filtrowane są tylko wypełnione pola.',
      criteriaChar: 'Postać',
      criteriaMaxLevel: 'Maks. poz.',
      criteriaMinResp: 'Min. szacunek',
      criteriaMaxResp: 'Maks. szacunek',
      secInvestigation: 'Kontrola konta',
      investigateBtn: 'Sprawdź konto',
      investigateHint: 'Sprawdź, czy konto jest pod kontrolą z powodu używania bota.',
      investigateChecking: 'Sprawdzanie kontroli konta...',
      investigateClean: '✓ Konto czyste, brak kontroli.',
      investigateFound: '⚠️ KONTO POD KONTROLĄ! Kontynuowanie jest ryzykowne.',
      investigateError: 'Błąd kontroli: {msg}',
      investigateConfirm: 'Twoje konto wydaje się być pod kontrolą z powodu używania bota. Kontynuować?',
      logInvestigationClean: 'Kontrola konta: czysta.',
      logInvestigationFound: 'Konto pod kontrolą! Logi w konsoli.',
      logVictimFiltered: 'Ofiara odfiltrowana: {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'Uniwersytet',
      autoUniversity: 'Uniwersytet', autoUniversityTip: 'Automatycznie dołącza do dostępnych zajęć, daje obecność i je kończy.',
      universityAutoEnroll: 'Auto zapis', universityAutoEnrollTip: 'Zapisuje na następne dostępne zajęcia (może kosztować).',
      universityPayment: 'Metoda płatności', universityPaymentCash: 'Gotówka', universityPaymentCredits: 'Kredyty',
      secFactories: 'Fabryki i laboratorium',
      autoBuildings: 'Zbierz fabryki', autoBuildingsTip: 'Zbiera ukończoną produkcję z fabryk i wykonuje konserwację.',
      autoLaboratory: 'Laboratorium', autoLaboratoryTip: 'Zarządza kolejką produkcji laboratorium: zbiera partie i zaczyna nowe.',
      autoMaintain: 'Auto konserwacja', autoMaintainTip: 'Naprawia fabryki wymagające konserwacji.',
      productionQty: 'Ilość na partię (0 = maks.)', productionQtyTip: 'Komponenty używane na partię laboratorium. 0 = maksimum.',
      productionComponents: 'Komponenty laboratorium',
      productionComponentsHint: 'Pozostaw puste, aby użyć wszystkich dostępnych komponentów. Wielokrotny wybór.',
      logUniEnroll: 'Uniwersytet: zapisano → {name}',
      logUniPresence: 'Uniwersytet: obecność oddana ({name})',
      logUniComplete: 'Uniwersytet: zajęcia ukończone ({name})',
      logUniNoAction: 'Uniwersytet: brak dostępnych zajęć.',
      logUniError: 'Błąd uniwersytetu: {msg}',
      logBuildingsCollect: 'Fabryki: zebrano {n} zakończonych produkcji.',
      logBuildingsMaintain: 'Fabryki: konserwacja wykonana.',
      logBuildingsNoAction: 'Fabryki: nic do zrobienia.',
      logBuildingsError: 'Błąd fabryki: {msg}',
      logLabStart: 'Laboratorium: rozpoczęto produkcję {qty}× komponentu #{drug}.',
      logLabComplete: 'Laboratorium: partia ukończona → {n} zebranych.',
      logLabNoAction: 'Laboratorium: nic do zrobienia.',
      logLabError: 'Błąd laboratorium: {msg}',
      maintUniversity: 'Uniwersytet', maintBuildings: 'Fabryki', maintLaboratory: 'Laboratorium',
      errBridgeTimeout: 'Przekroczono limit czasu bridge', errNoToken: 'Nie przechwycono tokenu',
      errForeignOrigin: 'Zewnętrzne origin zablokowane', errApiOnly: 'Akceptowane tylko /api/v1/',
      errNoEvents: 'Nie znaleziono zdarzeń Vue', errNoRouter: 'Nie znaleziono routera Vue',
      errUnknownMsg: 'Nieznany typ wiadomości',
      statusDead: 'Postać martwa. Czekam.',
      statusInPrison: 'W więzieniu. Próba łapówki...',
      statusInPrisonBribeOff: 'W więzieniu. Łapówka wyłączona.',
      statusDetox: 'Uzależnienie {p}%. Detoks...',
      statusLowStamina: 'Niska wytrzymałość ({p}%). Uzupełnianie...',
      statusRobbery: 'Wykonywanie kradzieży...',
      statusGangRobbery: 'Wykonywanie kradzieży gangu...',
      statusHuntingBot: 'Szukam bota AI...',
      statusNoAction: 'Brak aktywnej akcji.',
      statusError: 'Błąd: {msg}',
      statusBridgeNotReady: 'Bridge nie gotowy. Odśwież stronę.',
      logNav: 'Strona → {path}',
      logNavError: 'Błąd nawigacji: {msg}',
      logExitError: 'Błąd wyjścia: {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — próba {i}/{max}...',
      logInventoryLoaded: 'Ekwipunek załadowany: {n} przedmiotów.',
      logInventoryError: 'Błąd ładowania ekwipunku: {msg}',
      logItemActivate: 'Aktywacja przedmiotu: #{id}',
      logRobbery: 'Kradzież: {name} (moc {power}, wytrzymałość {energy})',
      logRobberySkipped: 'Kradzież pominięta: {msg}',
      logGangNoInvite: 'Kradzież gangu: brak zaproszenia ({n}).',
      logGangAccepting: 'Akceptacja zaproszenia: {name} (id {id})',
      logGangAccepted: '✓ Kradzież gangu zaakceptowana → {path}',
      logGangAcceptFailed: '❌ Akceptacja nieudana. Ostatni: {msg}',
      logGangExecuting: 'Wykonywanie kradzieży gangu: {name} (id {id})',
      logGangExecuted: '✓ Kradzież gangu wykonana → {path}',
      logGangExecFailed: '❌ Wykonanie nieudane. Ostatni: {msg}',
      logLevelUpReady: 'Awans: wymagania spełnione, żądanie...',
      logLevelUpSent: 'Żądanie awansu wysłane.',
      logTrainingStarting: 'Rozpoczynanie treningu: {name}',
      logTrainingStarted: 'Trening rozpoczęty.',
      logStaminaRefill: 'Uzupełnianie: obecnie={cur}, pojemność={cap}, cel={target}, bilety={tickets}',
      logTicketRefill: 'Uzupełnianie biletami: {n} biletów',
      logTicketRefillSuccess: 'Uzupełnianie OK: {before} → {after}',
      logTicketRefillFailed: 'Uzupełnianie nieudane: {msg} → przejście do rave party.',
      logTicketReserved: 'Rezerwa biletów zachowana (masz: {have}, rezerwa: {need}).',
      logNoRave: 'Nie znaleziono odpowiedniego rave.',
      logClubOverLimit: 'Wejście ${fee}, powyżej limitu ${limit}.',
      logEnteringRave: 'Rave party: {name} — wejście (obecnie: {before})',
      logTryingRefill: 'Próba przycisku uzupełniania...',
      logEnergyRefilled: 'Wytrzymałość uzupełniona: {before} → {after}',
      logRefillError: 'Błąd uzupełniania: {msg}',
      logBuyingDrug: 'Kupowanie narkotyku: {name}',
      logClubError: 'Błąd regeneracji w klubie: {msg}',
      logBotRoom: 'Sala polowań: {name} (moc bota {power})',
      logNoBot: 'Bot nie przyszedł, wychodzę.',
      logAttacking: 'Atak: {name}',
      logBotError: 'Błąd polowania: {msg}',
      logDetox: 'Detoks: płacę ${price} (uzależnienie {addiction}%)',
      logDetoxDone: 'Detoks wykonany (${price}).',
      logDetoxSkipped: 'Detoks pominięty: {reason}',
      logDetoxError: 'Błąd detoksu: {msg}',
      logPrisonBribe: 'Łapówka w więzieniu: ${price}',
      logPrisonBribed: 'Wyjście z więzienia (${price}).',
      logBribeSkipped: 'Łapówka pominięta: {reason}',
      logPrisonError: 'Błąd więzienia: {msg}',
      logAirportCollect: 'Lotnisko: zbieranie {n} ładunków.',
      logAirportBuy: 'Lotnisko: kupno ładunku za ${price}.',
      logBankDeposit: 'Bank: wpłata ${amount}.',
      logCollectEarnings: 'Zarobki: zbieranie ${amount}.',
      logFreeDice: 'Darmowy rzut kością ({n} pozostało).',
      logHealLow: 'HP {hp}% < {threshold}%. Użycie przedmiotu.',
      logHealFailed: 'Przedmiot nie użyty: {reason} {error}',
      logStatusLine: 'Status: HP={hp}% Wytrzymałość={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'Kradzież gangu pominięta: HP poniżej progu.',
      logGangSkipped: 'Kradzież gangu pominięta: {reason}',
      logCycleError: 'Błąd cyklu: {msg}',
      logStartedToken: 'Bot uruchomiony. Token gotowy.',
      logStartedNoToken: 'Bot uruchomiony. Czekam na token.',
      logBridgeError: 'Błąd bridge: {msg}',
      logStopped: 'Bot zatrzymany.',
      logSynced: 'Statystyki zsynchronizowane.',
      logSyncError: 'Błąd synchronizacji: {msg}',
      logPanelLoaded: 'Panel załadowany.',
      logAutoStart: 'Auto-start z poprzedniej sesji...',
      logMaintDone: '{label}: gotowe.',
      logMaintError: 'Błąd {label}: {msg}',
      logPreset: 'Preset czasu → {name} (akcja {min}-{max}ms, cykl {cmin}-{cmax}ms)',
      logToggleOn: 'WŁ.', logToggleOff: 'WYŁ.',
      logSettingChanged: '{key}: {value}',
      logItemSelected: 'Wybrany przedmiot: {id}',
      logTriggerChanged: 'Wyzwalacz przedmiotu: {v}',
      logFilterChanged: 'Filtr kradzieży: {v}',
      logLangChanged: 'Zmieniono język: {name}',
      logTaskError: 'Błąd zadania: {label} — {msg}',
      combatRobberyWin: '🎯 Kradzież udana: {name} (moc {power}, wytrzymałość {energy}){rewards}',
      combatRobberyLose: '💥 Kradzież nieudana: {name} (moc {power})',
      combatGangWin: '🎯 Kradzież gangu: {name}{rewards}',
      combatGangLose: '💥 Kradzież gangu nieudana: {name}',
      combatAssaultWin: '⚔️ Atak udany: {name} (moc {power}){rewards}',
      combatAssaultLose: '💀 Atak nieudany: {name}',
      combatHpLost: '   ↳ -{n} HP',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'Awans', maintTraining: 'Trening', maintAirport: 'Lotnisko',
      maintHookers: 'Zarobki', maintDice: 'Kości', maintBank: 'Bank',
    },

    ar: {
      panelTitle: 'Free for UnKnoWnCheaTs - The Crims Helper',
      tabAutomation: 'الأتمتة', tabStrategy: 'الاستراتيجية', tabLogs: 'السجلات',
      tabCombat: 'الأرباح', tabLanguages: 'اللغات',
      btnStart: 'ابدأ', btnStop: 'إيقاف', btnSync: 'مزامنة',
      secMainRoutine: 'الروتين الرئيسي', secTiming: 'التوقيت (مللي/تأخير)',
      secInventory: 'استخدام المخزون التلقائي', secAirport: 'المطار',
      secIncome: 'الدخل والبنك', secRobbery: 'السرقة',
      secStamina: 'استعادة الطاقة', secCombat: 'القتال',
      secPrison: 'السجن', secHospital: 'المستشفى',
      statPlayer: 'اللاعب', statLevel: 'المستوى', statStamina: 'الطاقة',
      statTickets: 'التذاكر', statHP: 'الصحة', statRobberyPower: 'قوة السرقة',
      statAssaultPower: 'قوة الهجوم', statCycle: 'الدورة',
      statsActions: 'الإجراءات', statsCycles: 'الدورات', statsErrors: 'الأخطاء',
      runtimeLabel: 'وقت التشغيل',
      autoRobbery: 'السرقة التلقائية', autoRobberyTip: 'يقوم تلقائيًا بأقوى عملية سرقة ضمن النطاق الآمن.',
      autoGangRobbery: 'سرقة العصابة', autoGangRobberyTip: 'يقبل وينفذ دعوة سرقة العصابة تلقائيًا.',
      autoStamina: 'تعبئة الطاقة', autoStaminaTip: 'يعيد تعبئة الطاقة تلقائيًا عند انخفاضها تحت الحد.',
      autoAssault: 'قتال روبوتات الذكاء الاصطناعي', autoAssaultTip: 'يصطاد الروبوتات الأقل من قوتك. لا يهاجم تحت الحد الأدنى للصحة.',
      autoDetox: 'إزالة السموم', autoDetoxTip: 'إزالة السموم تلقائيًا عند بلوغ حد الإدمان.',
      autoLevelUp: 'رفع المستوى التلقائي', autoLevelUpTip: 'يطلب المستوى التالي عند استيفاء الشروط.',
      autoTraining: 'التدريب', autoTrainingTip: 'يبدأ تدريبًا متاحًا بدءًا من مستوى الجريمة 3.',
      presetRecommended: 'موصى به', presetSlow: 'أبطأ',
      presetMedium: 'متوسط', presetMediumSub: 'متوسط سريع',
      presetFast: 'سريع', presetFastSub: 'خطر',
      timingMinDelay: 'أدنى تأخير للإجراء (مللي)', timingMinDelayTip: 'أدنى انتظار بين الانتقالات. أقل = أسرع لكن أكثر خطورة.',
      timingMaxDelay: 'أقصى تأخير للإجراء (مللي)', timingMaxDelayTip: 'أقصى انتظار بين الانتقالات.',
      timingCycleMin: 'أدنى تأخير للدورة (مللي)', timingCycleMinTip: 'أدنى انتظار بين دورتين رئيسيتين.',
      timingCycleMax: 'أقصى تأخير للدورة (مللي)', timingCycleMaxTip: 'أقصى انتظار بين دورتين رئيسيتين.',
      timingActivityMin: 'أدنى فاصل نشاط (مللي)', timingActivityMinTip: 'أدنى انتظار بين نوعين مختلفين من الإجراءات. حماية ضد الحظر.',
      timingActivityMax: 'أقصى فاصل نشاط (مللي)', timingActivityMaxTip: 'أقصى انتظار بين نوعين مختلفين من الإجراءات.',
      autoHealing: 'استخدام العنصر تلقائيًا', autoHealingTip: 'ينشط العنصر المحدد تلقائيًا وفقًا للمُشغِّل.',
      healingItem: 'العنصر', healingItemTip: 'اختر العنصر. استخدم Sync لتحديث القائمة.',
      healingTrigger: 'متى يُستخدم', healingTriggerTip: 'اختر الاستخدام عند انخفاض الصحة، أو قبل السرقة/الهجوم، أو الاثنين.',
      healingTriggerLowHp: 'عند انخفاض الصحة', healingTriggerBeforeAction: 'قبل السرقة أو الهجوم', healingTriggerBoth: 'الاثنان',
      healingHp: 'حد الصحة (%)', healingHpTip: 'يُستخدم العنصر عندما تنخفض الصحة تحت هذه النسبة.',
      autoAirport: 'المطار', autoAirportTip: 'يجمع البضائع الواصلة تلقائيًا.',
      airportAutoBuy: 'شراء أرخص بضاعة', airportAutoBuyTip: 'يشتري تلقائيًا أرخص بضاعة على المدارج الفارغة.',
      airportMaxCargo: 'الحد الأقصى لكل بضاعة ($)', airportMaxCargoTip: 'أقصى مبلغ نقدي مقابل بضاعة واحدة.',
      airportReserve: 'الاحتياطي بعد الشراء ($)', airportReserveTip: 'لن تنخفض النقود تحت هذا الاحتياطي بالشراء.',
      autoCollectHookers: 'جمع الأرباح', autoCollectHookersTip: 'يجمع أرباح البغايا عند تجاوز الحد الأدنى.',
      autoFreeDice: 'رمي النرد المجاني', autoFreeDiceTip: 'يستخدم رمية النرد المجانية التي يوفرها السيرفر.',
      autoBankDeposit: 'إيداع الفائض في البنك', autoBankDepositTip: 'يودع النقود الزائدة عن الاحتياطي في البنك.',
      bankReserve: 'النقد في اليد ($)', bankReserveTip: 'يبقى هذا المبلغ في اليد؛ والباقي يذهب للبنك.',
      bankMin: 'الحد الأدنى للإيداع ($)', bankMinTip: 'يتم تجاهل الإيداعات دون هذا المبلغ.',
      robberyFilter: 'نوع السرقة', robberyFilterTip: 'ينفذ نوع السرقة المحدد فقط.',
      robberyFilterAll: 'الكل', robberyFilterCash: 'نقد فقط', robberyFilterStocks: 'الأسهم',
      robberyFilterEvents: 'الأحداث', robberyFilterCashDrugs: 'نقد ومخدرات/مكونات',
      robberyMargin: 'أمان السرقة (%)', robberyMarginTip: 'يسرق فقط من تناسب قوته هذه النسبة من قوتك.',
      staminaFloor: 'التعبئة تحت (%)', staminaFloorTip: 'تبدأ التعبئة التلقائية عند انخفاض الطاقة تحت هذه النسبة.',
      staminaTarget: 'الطاقة المستهدفة (%)', staminaTargetTip: 'ترفع التعبئة الطاقة حتى هذه النسبة.',
      ticketTarget: 'هدف التذاكر', ticketTargetTip: 'نقاط الطاقة المستهدفة بالتذاكر. 100 طاقة = تذكرة واحدة.',
      ticketReserve: 'الاحتياطي الأدنى للتذاكر', ticketReserveTip: 'يتم الاحتفاظ بالتذاكر تحت هذا الرقم. 0 = بلا حد.',
      refillCash: 'حد النقد لكل تعبئة ($)', refillCashTip: 'أقصى نقد يُصرف على دخول الراve أو التعبئة.',
      useTicket: 'استخدام التذاكر', useTicketTip: 'استخدام التذاكر أثناء التعبئة؟ إذا أُغلق، راve فقط.',
      unsafeRave: 'راve عام غير آمن', unsafeRaveTip: 'الهجمات ممكنة. إذا مُفعّل، يُسمح بالراve غير الآمن.',
      assaultHp: 'الحد الأدنى للصحة (%)', assaultHpTip: 'لن يهاجم إذا كانت الصحة تحت هذه النسبة.',
      assaultMargin: 'أمان القتال (%)', assaultMarginTip: 'يهاجم فقط الروبوتات ذات القوة ضمن هذه النسبة من قوتك.',
      autoPrisonBribe: 'الخروج من السجن (رشوة)', autoPrisonBribeTip: 'يدفع رشوة نقدية إذا سُجن.',
      prisonMax: 'أقصى رشوة ($)', prisonMaxTip: 'يتم تجاهل الرشاوى فوق هذا المبلغ.',
      detoxAddiction: 'حد الإدمان (%)', detoxAddictionTip: 'تُجرى إزالة السموم عند بلوغ الإدمان هذه النسبة.',
      logActivity: 'النشاط', logCombatTitle: 'مكافآت السرقة والهجوم',
      statusReady: 'جاهز.', statusStopped: 'متوقف.', statusStarted: 'بدأ.',
      statusSyncing: 'جارٍ المزامنة...', statusSynced: 'تمت المزامنة.',
      selectNone: 'غير محدد',
      languageInfo: 'اختر لغة الواجهة. تُطبق التغييرات على الفور.',
      languageLabel: 'اللغة',
      secVictimFilters: 'مرشحات الضحايا',
      victimUserBlacklist: 'قائمة سوداء (اسم المستخدم)',
      victimUserBlacklistTip: 'مفصولة بفواصل. تتجاوز الضحايا الذين يحتوي اسمهم على هذه الأسماء.',
      victimIdBlacklist: 'قائمة سوداء (المعرف)',
      victimIdBlacklistTip: 'مفصولة بفواصل. تتجاوز الضحايا بهذه المعرفات.',
      victimCountryBlacklist: 'قائمة سوداء (الدولة)',
      victimCountryBlacklistTip: 'مفصولة بفواصل (tr، us). تتجاوز الضحايا من هذه الدول.',
      victimUserWhitelist: 'قائمة بيضاء (اسم المستخدم)',
      victimUserWhitelistTip: 'إذا تم التعيين، يهاجم فقط الضحايا المطابقين لهذه الأسماء.',
      victimIdWhitelist: 'قائمة بيضاء (المعرف)',
      victimIdWhitelistTip: 'إذا تم التعيين، يهاجم فقط الضحايا بهذه المعرفات.',
      secCharacterCriteria: 'معايير الشخصية',
      criteriaEnable: 'تطبيق معايير الشخصية',
      criteriaEnableTip: 'عند التفعيل، تُطبق نطاقات المستوى/الاحترام أدناه لكل فئة شخصية.',
      criteriaHint: '0 = بلا حد. يتم تصفية الحقول المملوءة فقط.',
      criteriaChar: 'الشخصية',
      criteriaMaxLevel: 'أقصى مستوى',
      criteriaMinResp: 'أدنى احترام',
      criteriaMaxResp: 'أقصى احترام',
      secInvestigation: 'التحقق من الحساب',
      investigateBtn: 'افحص الحساب',
      investigateHint: 'تحقق مما إذا كان الحساب تحت التحقيق بسبب استخدام البوت.',
      investigateChecking: 'جارٍ فحص تحقيق الحساب...',
      investigateClean: '✓ الحساب نظيف، لا يوجد تحقيق.',
      investigateFound: '⚠️ الحساب تحت التحقيق! المتابعة محفوفة بالمخاطر.',
      investigateError: 'خطأ التحقق: {msg}',
      investigateConfirm: 'يبدو أن حسابك تحت التحقيق بسبب استخدام البوت. هل تريد المتابعة على أي حال؟',
      logInvestigationClean: 'فحص التحقيق: نظيف.',
      logInvestigationFound: 'الحساب تحت التحقيق! السجلات في وحدة التحكم.',
      logVictimFiltered: 'تمت تصفية الضحية: {name} ({reason})',
      // === University & Factories ===
      secUniversity: 'الجامعة',
      autoUniversity: 'الجامعة', autoUniversityTip: 'ينضم تلقائيًا إلى الفصول المتاحة، يعطي الحضور ويكملها.',
      universityAutoEnroll: 'التسجيل التلقائي', universityAutoEnrollTip: 'يسجل في الفصل التالي المتاح (قد يكلف مالاً).',
      universityPayment: 'طريقة الدفع', universityPaymentCash: 'نقد', universityPaymentCredits: 'ائتمانات',
      secFactories: 'المصانع والمختبر',
      autoBuildings: 'جمع المصانع', autoBuildingsTip: 'يجمع الإنتاج المكتمل من المصانع ويقوم بالصيانة.',
      autoLaboratory: 'المختبر', autoLaboratoryTip: 'يدير قائمة إنتاج المختبر: يجمع الدفعات ويبدأ جديدة.',
      autoMaintain: 'الصيانة التلقائية', autoMaintainTip: 'يصلح المصانع التي تحتاج إلى صيانة.',
      productionQty: 'الكمية لكل دفعة (0 = الأقصى)', productionQtyTip: 'المكونات المستخدمة لكل دفعة مختبر. 0 = الأقصى.',
      productionComponents: 'مكونات المختبر',
      productionComponentsHint: 'اتركه فارغًا لاستخدام جميع المكونات المتاحة. اختيار متعدد.',
      logUniEnroll: 'الجامعة: تم التسجيل → {name}',
      logUniPresence: 'الجامعة: تم تسجيل الحضور ({name})',
      logUniComplete: 'الجامعة: تم إكمال الفصل ({name})',
      logUniNoAction: 'الجامعة: لا يوجد فصل متاح.',
      logUniError: 'خطأ الجامعة: {msg}',
      logBuildingsCollect: 'المصانع: تم جمع {n} إنتاج مكتمل.',
      logBuildingsMaintain: 'المصانع: تمت الصيانة.',
      logBuildingsNoAction: 'المصانع: لا شيء للقيام به.',
      logBuildingsError: 'خطأ المصنع: {msg}',
      logLabStart: 'المختبر: بدأ إنتاج {qty}× مكون #{drug}.',
      logLabComplete: 'المختبر: اكتملت الدفعة → {n} تم جمعها.',
      logLabNoAction: 'المختبر: لا شيء للقيام به.',
      logLabError: 'خطأ المختبر: {msg}',
      maintUniversity: 'الجامعة', maintBuildings: 'المصانع', maintLaboratory: 'المختبر',
      errBridgeTimeout: 'انتهت مهلة الجسر', errNoToken: 'لم يتم التقاط الرمز',
      errForeignOrigin: 'تم حظر الأصل الخارجي', errApiOnly: 'يُقبل فقط /api/v1/',
      errNoEvents: 'لم يتم العثور على أحداث Vue', errNoRouter: 'لم يتم العثور على راوتر Vue',
      errUnknownMsg: 'نوع رسالة غير معروف',
      statusDead: 'الشخصية ميتة. في الانتظار.',
      statusInPrison: 'في السجن. محاولة الرشوة...',
      statusInPrisonBribeOff: 'في السجن. الرشوة معطلة.',
      statusDetox: 'الإدمان {p}%. جارٍ إزالة السموم...',
      statusLowStamina: 'الطاقة منخفضة ({p}%). جارٍ التعبئة...',
      statusRobbery: 'جارٍ تنفيذ السرقة...',
      statusGangRobbery: 'جارٍ تنفيذ سرقة العصابة...',
      statusHuntingBot: 'البحث عن روبوت ذكاء اصطناعي...',
      statusNoAction: 'لا يوجد إجراء نشط.',
      statusError: 'خطأ: {msg}',
      statusBridgeNotReady: 'الجسر غير جاهز. أعد تحميل الصفحة.',
      logNav: 'الصفحة → {path}',
      logNavError: 'خطأ التنقل: {msg}',
      logExitError: 'خطأ الخروج: {msg}',
      logHttpRetry: 'HTTP {st} ({path}) — إعادة المحاولة {i}/{max}...',
      logInventoryLoaded: 'تم تحميل المخزون: {n} عنصر.',
      logInventoryError: 'خطأ تحميل المخزون: {msg}',
      logItemActivate: 'تنشيط العنصر: #{id}',
      logRobbery: 'السرقة: {name} (قوة {power}، طاقة {energy})',
      logRobberySkipped: 'تم تخطي السرقة: {msg}',
      logGangNoInvite: 'سرقة العصابة: لا توجد دعوة ({n}).',
      logGangAccepting: 'قبول دعوة سرقة العصابة: {name} (id {id})',
      logGangAccepted: '✓ تم قبول سرقة العصابة → {path}',
      logGangAcceptFailed: '❌ فشل القبول. الأخير: {msg}',
      logGangExecuting: 'تنفيذ سرقة العصابة: {name} (id {id})',
      logGangExecuted: '✓ تم تنفيذ سرقة العصابة → {path}',
      logGangExecFailed: '❌ فشل التنفيذ. الأخير: {msg}',
      logLevelUpReady: 'رفع المستوى: الشروط مستوفاة، جارٍ الطلب...',
      logLevelUpSent: 'تم إرسال طلب رفع المستوى.',
      logTrainingStarting: 'بدء التدريب: {name}',
      logTrainingStarted: 'بدأ التدريب.',
      logStaminaRefill: 'تعبئة الطاقة: الحالي={cur}، السعة={cap}، الهدف={target}، التذاكر={tickets}',
      logTicketRefill: 'تعبئة بالتذاكر: {n} تذاكر',
      logTicketRefillSuccess: 'نجحت التعبئة: {before} → {after}',
      logTicketRefillFailed: 'فشلت التعبئة: {msg} → استخدام راve party.',
      logTicketReserved: 'تم الحفاظ على احتياطي التذاكر (لديك: {have}، الاحتياطي: {need}).',
      logNoRave: 'لم يتم العثور على راve مناسب.',
      logClubOverLimit: 'دخول ${fee}، فوق الحد ${limit}.',
      logEnteringRave: 'راve party: {name} — جارٍ الدخول (الحالي: {before})',
      logTryingRefill: 'تجربة زر التعبئة...',
      logEnergyRefilled: 'تمت تعبئة الطاقة: {before} → {after}',
      logRefillError: 'خطأ التعبئة: {msg}',
      logBuyingDrug: 'شراء مخدر: {name}',
      logClubError: 'خطأ الاستعادة في النادي: {msg}',
      logBotRoom: 'غرفة الصيد: {name} (قوة الروبوت {power})',
      logNoBot: 'لم يصل روبوت، جارٍ الخروج.',
      logAttacking: 'الهجوم: {name}',
      logBotError: 'خطأ الصيد: {msg}',
      logDetox: 'إزالة السموم: دفع ${price} (الإدمان {addiction}%)',
      logDetoxDone: 'تمت إزالة السموم (${price}).',
      logDetoxSkipped: 'تم تخطي إزالة السموم: {reason}',
      logDetoxError: 'خطأ إزالة السموم: {msg}',
      logPrisonBribe: 'رشوة السجن: ${price}',
      logPrisonBribed: 'الخروج من السجن (${price}).',
      logBribeSkipped: 'تم تخطي الرشوة: {reason}',
      logPrisonError: 'خطأ السجن: {msg}',
      logAirportCollect: 'المطار: جمع {n} شحنة.',
      logAirportBuy: 'المطار: شراء شحنة مقابل ${price}.',
      logBankDeposit: 'البنك: إيداع ${amount}.',
      logCollectEarnings: 'الأرباح: جمع ${amount}.',
      logFreeDice: 'رمي النرد المجاني ({n} متبقية).',
      logHealLow: 'الصحة {hp}% < {threshold}%. استخدام العنصر.',
      logHealFailed: 'لم يُستخدم العنصر: {reason} {error}',
      logStatusLine: 'الحالة: الصحة={hp}% الطاقة={cur}/{cap} ({pct}%)',
      logGangSkippedHp: 'تم تخطي سرقة العصابة: الصحة تحت الحد.',
      logGangSkipped: 'تم تخطي سرقة العصابة: {reason}',
      logCycleError: 'خطأ الدورة: {msg}',
      logStartedToken: 'بدأ البوت. الرمز جاهز.',
      logStartedNoToken: 'بدأ البوت. في انتظار الرمز.',
      logBridgeError: 'خطأ الجسر: {msg}',
      logStopped: 'تم إيقاف البوت.',
      logSynced: 'تمت مزامنة الإحصائيات.',
      logSyncError: 'خطأ المزامنة: {msg}',
      logPanelLoaded: 'تم تحميل اللوحة.',
      logAutoStart: 'بدء تلقائي من الجلسة السابقة...',
      logMaintDone: '{label}: تم.',
      logMaintError: 'خطأ {label}: {msg}',
      logPreset: 'إعداد التوقيت → {name} (إجراء {min}-{max}مللي، دورة {cmin}-{cmax}مللي)',
      logToggleOn: 'مفعّل', logToggleOff: 'معطّل',
      logSettingChanged: '{key}: {value}',
      logItemSelected: 'العنصر المحدد: {id}',
      logTriggerChanged: 'مُشغِّل العنصر: {v}',
      logFilterChanged: 'فلتر السرقة: {v}',
      logLangChanged: 'تم تغيير اللغة: {name}',
      logTaskError: 'خطأ المهمة: {label} — {msg}',
      combatRobberyWin: '🎯 نجحت السرقة: {name} (قوة {power}، طاقة {energy}){rewards}',
      combatRobberyLose: '💥 فشلت السرقة: {name} (قوة {power})',
      combatGangWin: '🎯 سرقة العصابة: {name}{rewards}',
      combatGangLose: '💥 فشلت سرقة العصابة: {name}',
      combatAssaultWin: '⚔️ نجح الهجوم: {name} (قوة {power}){rewards}',
      combatAssaultLose: '💀 فشل الهجوم: {name}',
      combatHpLost: '   ↳ -{n} صحة',
      combatCashLost: '   ↳ -${n}',
      combatInfo: '   ↳ {msg}',
      maintLevelUp: 'رفع المستوى', maintTraining: 'تدريب', maintAirport: 'المطار',
      maintHookers: 'الأرباح', maintDice: 'النرد', maintBank: 'البنك',
    },
  };

  const LANGUAGES = [
    { code: 'tr', label: 'Türkçe',    flag: '🇹🇷' },
    { code: 'en', label: 'English',   flag: '🇬🇧' },
    { code: 'es', label: 'Español',   flag: '🇪🇸' },
    { code: 'fr', label: 'Français',  flag: '🇫🇷' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'pl', label: 'Polski',    flag: '🇵🇱' },
    { code: 'ar', label: 'العربية',   flag: '🇸🇦' },
  ];

  const RTL_LANGS = ['ar'];

  const PRESETS = {
    safe:   { minDelayMs: 5000, maxDelayMs: 9000, cycleMinMs: 10000, cycleMaxMs: 18000 },
    medium: { minDelayMs: 2500, maxDelayMs: 5500, cycleMinMs: 6000,  cycleMaxMs: 12000 },
    fast:   { minDelayMs: 800,  maxDelayMs: 1800, cycleMinMs: 2000,  cycleMaxMs: 4000  },
  };

  const pending = new Map();

  function bridgeCall(type, extra = {}, timeoutMs = 25000) {
    return new Promise((resolve, reject) => {
      const id = 'b_' + Math.random().toString(36).slice(2) + Date.now();
      pending.set(id, { resolve, reject });
      window.postMessage({ source: REQ, type, id, ...extra }, location.origin);
      setTimeout(() => {
        if (pending.has(id)) { pending.delete(id); reject(new Error('E_BRIDGE_TIMEOUT:' + type)); }
      }, timeoutMs);
    });
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    const data = event.data;
    if (!data || data.source !== RES || !data.id) return;
    const p = pending.get(data.id);
    if (!p) return;
    pending.delete(data.id);
    if (data.error) p.reject(new Error(translateBridgeError(data.error)));
    else p.resolve(data.payload);
  });

  async function apiGet(path, retries = 2) {
    const clean = path.replace(/^\/+/, '');
    let lastErr;
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await bridgeCall('fetch', {
          url: `/api/v1/${clean}`,
          options: { method: 'GET' },
        });
        const st = Number(res._status) || 0;
        const retryable = st === 405 || st === 429 || (st >= 500 && st < 600);
        if (retryable && i < retries) {
          log(tf('logHttpRetry', { st, path: clean, i: i + 1, max: retries }));
          await sleep(1200 + i * 800);
          continue;
        }
        if (st >= 400) throw new Error(`HTTP ${st}`);
        return res;
      } catch (e) {
        lastErr = e;
        if (i === retries) throw e;
        await sleep(1000 + i * 800);
      }
    }
    throw lastErr || new Error('apiGet: unknown error');
  }

  async function apiPost(path, body = {}, retries = 1) {
    const clean = path.replace(/^\/+/, '');
    let lastErr;
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await bridgeCall('fetch', {
          url: `/api/v1/${clean}`,
          options: { method: 'POST', body: JSON.stringify(body) },
        });
        const errors = (res.messages || [])
          .filter(m => Array.isArray(m) && /error|danger|fatal/i.test(String(m[1] || '')))
          .map(m => String(m[0] || '').replace(/<[^>]*>/g, ''));
        if (res._status >= 400 || errors.length) {
          const err = new Error(errors.join(' · ') || `HTTP ${res._status}`);
          err.response = res;
          throw err;
        }
        return res;
      } catch (e) {
        lastErr = e;
        const msg = String(e?.message || '');
        const isGameError = /enerji|stamina|para|cash|health|hp|hapis|prison|level|seviye/i.test(msg);
        if (isGameError || i === retries) throw e;
        await sleep(1000 + i * 800);
      }
    }
    throw lastErr || new Error('apiPost: unknown error');
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const rand  = (min, max) => Math.round(min + Math.random() * (max - min));
  let lastRoute = null;

  // ============ GÖREV KUYRUĞU (TaskRunner) ============
  const taskRunner = (function () {
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    return {
      running: false,
      queue: [],
      _timer: null,
      enqueue(fn, label = 'task') {
        this.queue.push({ fn, label });
        if (this.running) this._schedule();
      },
      start() {
        if (this.running) return;
        this.running = true;
        this._schedule();
      },
      stop() {
        this.running = false;
        if (this._timer) clearTimeout(this._timer);
        this._timer = null;
        this.queue = [];
      },
      _schedule() {
        if (!this.running || this._timer) return;
        if (this.queue.length === 0) return;
        const delay = rnd(CONFIG.cycleMinMs, CONFIG.cycleMaxMs);
        this._timer = setTimeout(() => {
          this._timer = null;
          this._runNext();
        }, delay);
      },
      async _runNext() {
        if (!this.running) return;
        const item = this.queue.shift();
        if (!item) return;
        try { await item.fn(); }
        catch (e) { log(tf('logTaskError', { label: item.label, msg: e?.message || e })); }
        this._schedule();
      },
    };
  })();

  // ============ AKTİVİTE KİLİDİ (Mutex / Anti-Ban) ============
  const activity = (function () {
    const state = {
      minGapMs: 3000,
      maxGapMs: 5000,
      busyType: null,
      lastType: null,
      lastAt: 0,
    };

    function canStart(type) {
      if (state.busyType && state.busyType !== type) return false;
      if (!state.busyType && state.lastType && state.lastType !== type) {
        return (Date.now() - state.lastAt) >= state.minGapMs;
      }
      return true;
    }

    function pickWaitMs() {
      const span = Math.max(1, state.maxGapMs - state.minGapMs + 1);
      return state.minGapMs + Math.floor(Math.random() * span);
    }

    return {
      setGapRange(minMs, maxMs) {
        state.minGapMs = Math.max(0, Number(minMs || 0));
        state.maxGapMs = Math.max(state.minGapMs, Number(maxMs || state.minGapMs));
      },
      getState() { return { ...state }; },

      async run(type, fn) {
        let guard = 0;
        while (state.busyType && state.busyType !== type && guard < 150) {
          await sleep(200);
          guard++;
        }

        if (state.lastType && state.lastType !== type) {
          const elapsed = Date.now() - state.lastAt;
          if (elapsed < state.minGapMs) {
            const target = pickWaitMs();
            const wait = Math.max(0, target - elapsed) + Math.floor(Math.random() * 150);
            if (wait > 0) await sleep(wait);
          }
        }

        if (!canStart(type)) {
          await sleep(200);
        }
        state.busyType = type;

        try {
          return await fn();
        } finally {
          state.busyType = null;
          state.lastType = type;
          state.lastAt = Date.now();
        }
      },
    };
  })();

  async function navigateTo(path, force = false) {
    try {
      const current = window.location.pathname;
      if (!force && (current === path || lastRoute === path)) return true;
      log(tf('logNav', { path }));
      await bridgeCall('navigate', { path }, 10000);
      lastRoute = path;
      await sleep(rand(900, 1400));
      return true;
    } catch (e) { log(tf('logNavError', { msg: e?.message || e })); return false; }
  }

  async function exitNightclub() {
    try { await bridgeCall('exit-nightclub', {}, 10000); }
    catch (e) { log(tf('logExitError', { msg: e?.message || e })); }
  }

  function staminaPct(user) {
    if (!user) return 0;
    const isPoints = user.stamina_points_system === true
      || user.stamina_points_system === 1
      || String(user.stamina_points_system).toLowerCase() === 'true';
    const capacity = isPoints ? 100 : Number(user.stamina_max || user.stamina_capacity || 1000);
    const cur = Number(user.stamina || 0);
    if (capacity <= 0) return 0;
    return (Math.min(cur, capacity) / capacity) * 100;
  }
  function staminaCurrent(user) { return Number(user?.stamina || 0); }
  function staminaCapacity(user) {
    const isPoints = user?.stamina_points_system === true
      || user?.stamina_points_system === 1
      || String(user?.stamina_points_system).toLowerCase() === 'true';
    return isPoints ? 100 : Number(user?.stamina_max || user?.stamina_capacity || 1000);
  }
  function hpPct(user) {
    if (!user) return 0;
    const max = Number(user.max_hp || 1);
    return Math.min(100, (Number(user.hp || 0) / max) * 100);
  }

  const VALID_FILTERS = ['all', 'cash_only', 'stocks', 'events', 'cash_drugs_and_components'];
  function filterRobberies(list, filter) {
    if (!filter || filter === 'all' || !VALID_FILTERS.includes(filter)) return list;
    return list.filter(r => {
      const attrs = Array.isArray(r?.filterable_attributes) ? r.filterable_attributes
                  : Array.isArray(r?.raw?.filterable_attributes) ? r.raw.filterable_attributes
                  : [];
      return attrs.includes(filter);
    });
  }

  // ---------------- Kazanç parser ----------------
  function extractRewards(res) {
    if (!res || typeof res !== 'object') return { parts: [], msgs: [] };
    const parts = [];

    const num = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };
    const fmt = (n) => n.toLocaleString('tr-TR');

    const rewards = res.rewards || res.loot || res.result || res;
    const user = res.user || {};

    const cash = num(rewards.cash ?? rewards.money ?? rewards.cash_gain ?? 0);
    if (cash > 0) parts.push(`$${fmt(cash)}`);

    const xp = num(rewards.xp ?? rewards.experience ?? rewards.exp ?? 0);
    if (xp > 0) parts.push(`${fmt(xp)} XP`);

    const respect = num(rewards.respect ?? rewards.reputation ?? 0);
    if (respect > 0) parts.push(`${fmt(respect)} saygı`);

    const energy = num(rewards.energy ?? 0);
    if (energy > 0) parts.push(`+${fmt(energy)} enerji`);

    const hp = num(rewards.hp ?? rewards.health ?? 0);
    if (hp > 0) parts.push(`+${fmt(hp)} HP`);

    const tickets = num(rewards.tickets ?? rewards.ticket ?? 0);
    if (tickets > 0) parts.push(`+${fmt(tickets)} ticket`);

    const items = rewards.items || rewards.loot_items || res.items || [];
    if (Array.isArray(items)) {
      for (const it of items) {
        if (!it) continue;
        const name = String(it.name || it.type_name || it.type || `#${it.id || '?'}`)
          .replace(/<[^>]*>/g, '').trim();
        const qty = num(it.quantity ?? it.qty ?? it.amount ?? 1) || 1;
        parts.push(`${name} ×${qty}`);
      }
    }

    if (rewards.level_up || res.level_up) {
      const lv = Number(user.level || rewards.new_level || 0);
      parts.push(`⭐ Seviye ${lv > 0 ? lv : 'atladı'}`);
    }

    const hpLost = num(rewards.hp_lost ?? res.hp_lost ?? 0);
    const cashLost = num(rewards.cash_lost ?? res.cash_lost ?? 0);

    const msgs = (res.messages || [])
      .map(m => String(Array.isArray(m) ? m[0] : m).replace(/<[^>]*>/g, '').trim())
      .filter(Boolean);

    return { parts, msgs, hpLost, cashLost };
  }

  let actionItemsCache = [];

  async function loadActionItems() {
    try {
      const state = await apiGet('equipment');
      const items = Array.isArray(state.items) ? state.items
                  : Array.isArray(state.data?.items) ? state.data.items
                  : [];
      actionItemsCache = items.filter(it => it && it.id != null);
      log(tf('logInventoryLoaded', { n: actionItemsCache.length }));
      populateActionItemSelect();
    } catch (e) {
      log(tf('logInventoryError', { msg: e?.message || e }));
      actionItemsCache = [];
      populateActionItemSelect();
    }
  }

  function populateActionItemSelect() {
    if (!refs.itemSelect) return;
    const current = String(CONFIG.healingId || 'none');
    refs.itemSelect.innerHTML = '';
    refs.itemSelect.add(new Option(t('selectNone'), 'none'));
    for (const it of actionItemsCache) {
      const qty = Number(it.quantity || 0);
      const raw = String(it.name || it.type_name || it.type || `#${it.id}`);
      const clean = raw.replace(/<[^>]*>/g, '').trim();
      refs.itemSelect.add(new Option(`${clean} ×${qty}`, String(it.id)));
    }
    refs.itemSelect.value = current;
  }

  async function doUseActionItem() {
    if (!CONFIG.autoHealing) return { changed: false, reason: 'disabled' };
    const itemId = String(CONFIG.healingId || 'none');
    if (itemId === 'none') return { changed: false, reason: 'no-item' };
    try {
      log(tf('logItemActivate', { id: itemId }));
      await apiPost('equipment/item/activate', { id: Number(itemId) });
      return { changed: true };
    } catch (e) { return { changed: false, reason: 'error', error: e.message }; }
  }

  async function doRobbery(state) {
    const user = state?.user;
    if (!user) return { changed: false, reason: 'no-user' };
    const list = state.single_robberies || [];
    if (!list.length) return { changed: false, reason: 'no-robberies' };
    const filtered = filterRobberies(list, CONFIG.robberyFilter);
    if (!filtered.length) return { changed: false, reason: `no-robberies-with-filter:${CONFIG.robberyFilter}` };
    const myPower = Number(user.single_robbery_power || user.robbery_power || 0);
    const maxPower = myPower * CONFIG.robberySafetyMargin;
    const curStamina = Number(user.stamina || 0);
    const perParticipantEnergy = (r) => {
      if (Number.isFinite(Number(r.energy_per_participant))) {
        return Number(r.energy_per_participant);
      }
      const req = Number(r.required_members || r.max_participants || 0);
      const total = Number(r.energy || 0);
      if (req > 1 && total > 0) return Math.ceil(total / req);
      return total;
    };

    const candidates = filtered
      .filter(r => Number(r.power || 0) <= maxPower)
      .filter(r => perParticipantEnergy(r) <= curStamina)
      .sort((a, b) => Number(b.power || 0) - Number(a.power || 0));
    const target = candidates[0];
    if (!target) return { changed: false, reason: 'no-safe-robbery' };
    log(tf('logRobbery', { name: target.name, power: target.power, energy: target.energy }));
    try {
      const res = await apiPost('robberies', { id: Number(target.id), full: true, tickets: null, items: [] }, 0);

      const { parts, msgs, hpLost, cashLost } = extractRewards(res);
      const targetName = String(target.name || '').replace(/<[^>]*>/g, '').trim() || `#${target.id}`;
      const success = res.success !== false && res.failed !== true && res.lost !== true;
      if (success) {
        const rewardTxt = parts.length ? ` → ${parts.join(' · ')}` : '';
        logCombat(tf('combatRobberyWin', { name: targetName, power: target.power, energy: target.energy, rewards: rewardTxt }), 'win');
      } else {
        logCombat(tf('combatRobberyLose', { name: targetName, power: target.power }), 'lose');
      }
      if (hpLost > 0) logCombat(tf('combatHpLost', { n: hpLost }), 'warn');
      if (cashLost > 0) logCombat(tf('combatCashLost', { n: cashLost.toLocaleString('tr-TR') }), 'warn');
      for (const m of msgs) logCombat(tf('combatInfo', { msg: m }), 'info');

      return { changed: true, target, response: res };
    } catch (e) {
      const msg = String(e?.message || '');
      if (/enerji|stamina/i.test(msg)) {
        log(tf('logRobberySkipped', { msg }));
        return { changed: false, reason: 'no-energy', error: msg };
      }
      throw e;
    }
  }

  // ---- Çete soygunu ----
  async function doGangRobbery(state) {
    const user = state?.user;
    if (!user) return { changed: false, reason: 'no-user' };
    if (hpPct(user) < CONFIG.gangRobberyMinHpPct) {
      return { changed: false, reason: 'low-hp' };
    }

    const planned = state?.planned_robbery
                || state?.plannedRobbery
                || state?.gang_robbery
                || null;

    if (!planned || !planned.id) {
      return { changed: false, reason: 'no-planned-robbery' };
    }

    const gangId = Number(planned.id);
    const name = String(planned.name || planned.title || `#${gangId}`)
      .replace(/<[^>]*>/g, '').trim();

    const invitations = Array.isArray(planned.invitations) ? planned.invitations : [];
    const myInvite = invitations.find(inv =>
      inv && inv.user && Number(inv.user.id) === Number(user.id)
    ) || invitations[0];

    if (!myInvite) {
      log(tf('logGangNoInvite', { n: invitations.length }));
      return { changed: false, reason: 'no-invitation' };
    }

    const alreadyAccepted = myInvite.accepted === true || myInvite.accepted === 1;

    if (!alreadyAccepted) {
      log(tf('logGangAccepting', { name, id: gangId }));
      const acceptBodies = [
        { id: gangId },
        { robbery_id: gangId },
        { planned_robbery_id: gangId },
        { gang_robbery_id: gangId },
      ];
      const acceptPaths = ['gangrobbery/accept', 'gangrobbery/join', 'planned-gang-robbery/accept'];

      let accepted = false, lastErr = null;
      outer:
      for (const path of acceptPaths) {
        for (const body of acceptBodies) {
          try {
            await apiPost(path, body, 0);
            accepted = true;
            log(tf('logGangAccepted', { path }));
            break outer;
          } catch (e) {
            lastErr = e;
            const msg = String(e?.message || '');
            if (/enerji|stamina/i.test(msg) && !/not found|method|does not exist/i.test(msg)) {
              return { changed: false, reason: 'no-energy', error: msg };
            }
            continue;
          }
        }
      }

      if (!accepted) {
        const msg = String(lastErr?.message || 'unknown error');
        log(tf('logGangAcceptFailed', { msg }));
        return { changed: false, reason: 'accept-failed', error: msg };
      }

      await sleep(rand(1800, 2500));
    }

    log(tf('logGangExecuting', { name, id: gangId }));
    const execBodies = [
      { id: gangId },
      { robbery_id: gangId },
      { planned_robbery_id: gangId },
      { gang_robbery_id: gangId },
    ];
    const execPaths = [
      'gangrobbery/execute',
      'gangrobbery/start',
      'gangrobbery/run',
      'planned-gang-robbery/execute',
      'planned-gang-robbery/start',
      'gangrobbery',
    ];

    let result = null, lastErr = null;
    outer2:
    for (const path of execPaths) {
      for (const body of execBodies) {
        try {
          result = await apiPost(path, body, 0);
          log(tf('logGangExecuted', { path }));
          break outer2;
        } catch (e) {
          lastErr = e;
          const msg = String(e?.message || '');
          if (/enerji|stamina/i.test(msg) && !/not found|method|does not exist/i.test(msg)) {
            return { changed: false, reason: 'no-energy', error: msg };
          }
          continue;
        }
      }
    }

    if (!result) {
      const msg = String(lastErr?.message || 'unknown error');
      log(tf('logGangExecFailed', { msg }));
      return { changed: false, reason: 'execute-failed', error: msg };
    }

    const { parts, msgs, hpLost, cashLost } = extractRewards(result);
    const success = result.success !== false && result.failed !== true && result.lost !== true;
    if (success) {
      const rewardTxt = parts.length ? ` → ${parts.join(' · ')}` : '';
      logCombat(tf('combatGangWin', { name, rewards: rewardTxt }), 'win');
    } else {
      logCombat(tf('combatGangLose', { name }), 'lose');
    }
    if (hpLost > 0) logCombat(tf('combatHpLost', { n: hpLost }), 'warn');
    if (cashLost > 0) logCombat(tf('combatCashLost', { n: cashLost.toLocaleString('tr-TR') }), 'warn');
    for (const m of msgs) logCombat(tf('combatInfo', { msg: m }), 'info');

    return { changed: true, target: planned, response: result };
  }

  async function doLevelUp() {
    try {
      let canLevel = false;
      try {
        const state = await apiGet('level');
        canLevel = state?.can_level_up === true
                || state?.requirements_met === true
                || state?.user?.can_level_up === true
                || state?.user?.level_requirements_met === true;
      } catch (_) {
        const r = await apiGet('robberies');
        canLevel = r?.user?.can_level_up === true
                || r?.user?.level_requirements_met === true;
      }
      if (!canLevel) return { changed: false, reason: 'requirements-not-met' };
      log(t('logLevelUpReady'));
      await apiPost('level-up', {});
      log(t('logLevelUpSent'));
      return { changed: true };
    } catch (e) {
      return { changed: false, reason: 'error', error: e?.message || String(e) };
    }
  }

  async function doTraining() {
    try {
      await navigateTo('/gym');
      const state = await apiGet('training');
      const user = state.user;
      if (!user) return { changed: false, reason: 'no-user' };
      const lvl = Number(user.level || 0);
      if (lvl < 3) return { changed: false, reason: 'level-too-low' };
      const workouts = state.workouts || state.trainings || state.available_trainings || [];
      const available = workouts.find(w => w && (w.available === true || w.can_start === true) && w.id != null);
      if (!available) return { changed: false, reason: 'no-available-workout' };
      log(tf('logTrainingStarting', { name: available.name || available.title || available.id }));
      await apiPost('training', { id: Number(available.id) });
      log(t('logTrainingStarted'));
      return { changed: true, workout: available };
    } catch (e) {
      return { changed: false, reason: 'error', error: e?.message || String(e) };
    }
  }

  async function doStaminaRecovery(state) {
    await navigateTo('/nightlife');
    const cur = staminaCurrent(state.user);
    const capacity = staminaCapacity(state.user);
    const target = Math.max(1, Math.ceil(capacity * CONFIG.staminaTargetPct / 100));
    log(tf('logStaminaRefill', { cur, cap: capacity, target, tickets: state.user.tickets ?? 0 }));
    if (cur >= target) return { changed: false, reason: 'already-full' };
    const tickets = Number(state.user.tickets || 0);
    if (CONFIG.useTicketRefill && tickets > 0) {
      const need = target - cur;
      const ticketsWanted = Math.min(10, Math.max(1, Math.ceil(need / 100)));
      const useTickets = Math.min(tickets, ticketsWanted);
      if (useTickets > CONFIG.ticketReserve) {
        log(tf('logTicketRefill', { n: useTickets }));
        try {
          const res = await apiPost('refill-stamina', { tickets: useTickets }, 0);
          const after = Number(res?.user?.stamina ?? cur);
          log(tf('logTicketRefillSuccess', { before: cur, after }));
          return { changed: true, method: 'ticket', newStamina: after };
        } catch (e) { log(tf('logTicketRefillFailed', { msg: e?.message || e })); }
      } else { log(tf('logTicketReserved', { have: tickets, need: CONFIG.ticketReserve })); }
    }
    return await nightclubRecovery(state);
  }

  async function nightclubRecovery(state) {
    try {
      const listing = await apiGet('nightclubs');
      let clubs = (listing.nightclubs || []).filter(c => Number(c.business_id) === 1 && !c.hunting_ground);
      if (!CONFIG.allowUnsafeNightclubs) clubs = clubs.filter(c => c.safe !== false);
      if (!clubs.length) { log(t('logNoRave')); return { changed: false, reason: 'no-club' }; }
      clubs.sort((a, b) => Number(a.fee || a.entrance_fee || 0) - Number(b.fee || b.entrance_fee || 0));
      const club = clubs[0];
      const fee = Number(club.fee || club.entrance_fee || 0);
      if (fee > CONFIG.maxNightclubRefillCash) {
        log(tf('logClubOverLimit', { fee, limit: CONFIG.maxNightclubRefillCash }));
        return { changed: false, reason: 'over-limit' };
      }
      const beforeStamina = staminaCurrent(listing.user);
      log(tf('logEnteringRave', { name: club.name || club.id, before: beforeStamina }));
      await navigateTo('/nightlife/nightclub');
      const entered = await apiPost('nightclub', { id: club.id });
      const room = entered.nightclub || entered;
      await sleep(rand(700, 1200));
      try {
        log(t('logTryingRefill'));
        const res = await apiPost('refill-stamina', { overdose: false }, 0);
        const after = Number(res?.user?.stamina ?? beforeStamina);
        if (after > beforeStamina) {
          log(tf('logEnergyRefilled', { before: beforeStamina, after }));
          await exitNightclub();
          return { changed: true, method: 'nightclub-refill', newStamina: after };
        }
      } catch (e) { log(tf('logRefillError', { msg: e?.message || e })); }
      const products = (room.products && room.products.drugs) || [];
      if (!products.length) { await exitNightclub(); return { changed: false, reason: 'no-refill' }; }
      const drug = products[0];
      log(tf('logBuyingDrug', { name: drug.name || drug.id }));
      await apiPost('nightclub/drug', { id: drug.id });
      await exitNightclub();
      return { changed: true, method: 'nightclub' };
    } catch (e) {
      log(tf('logClubError', { msg: e?.message || e }));
      try { await exitNightclub(); } catch (_) {}
      return { changed: false, reason: 'error' };
    }
  }

  // ============ KURBAN FİLTRELEME ============
  function botFilterReason(bot) {
    if (!bot) return 'no-bot';

    const uname = String(bot.username || bot.name || '').toLowerCase();
    const uid   = String(bot.id);
    const ucountry = String(
      bot.country_code || bot.country || bot.nationality || ''
    ).toLowerCase().trim();

    const uBL  = (CONFIG.victimUsernameBlacklist || []).map(s => String(s).toLowerCase());
    const idBL = (CONFIG.victimIdBlacklist       || []).map(s => String(s));
    const cBL  = (CONFIG.victimCountryBlacklist  || []).map(s => String(s).toLowerCase());
    const uWL  = (CONFIG.victimUsernameWhitelist || []).map(s => String(s).toLowerCase());
    const idWL = (CONFIG.victimIdWhitelist       || []).map(s => String(s));

    if (uBL.length  && uBL.some(u => u && uname.includes(u)))                 return 'user-blacklist';
    if (idBL.length && uid && idBL.includes(uid))                             return 'id-blacklist';
    if (cBL.length  && ucountry && cBL.some(c => c && ucountry.includes(c)))  return 'country-blacklist';
    if (uWL.length  && !uWL.some(u => u && uname.includes(u)))                return 'user-not-whitelisted';
    if (idWL.length && !idWL.includes(uid))                                    return 'id-not-whitelisted';

    if (CONFIG.criteriaEnabled) {
      const criteria = CONFIG.assaultCriteria || {};
      const charName = String(
        bot.character_text_name || bot.character || bot.character_name || ''
      ).toUpperCase().trim();
      const c = criteria[charName];
      if (c) {
        const lvl  = Number(bot.level || 0);
        const resp = Number(bot.respect || bot.reputation || 0);
        const maxL = Number(c.maxLevel || 0);
        const minR = Number(c.minRespect || 0);
        const maxR = Number(c.maxRespect || 0);
        if (maxL > 0 && lvl > maxL)   return `char-max-level:${charName}`;
        if (minR > 0 && resp < minR)  return `char-min-respect:${charName}`;
        if (maxR > 0 && resp > maxR)  return `char-max-respect:${charName}`;
      }
    }
    return null;
  }

  function filterBots(list) {
    const out = [];
    for (const b of list) {
      if (botFilterReason(b)) continue;
      out.push(b);
    }
    return out;
  }

  // ============ HESAP SORUŞTURMA DENETİMİ ============
  let investigationChecked = false;
  let investigationStatus = false;

  async function checkInvestigation(force = false) {
    if (investigationChecked && !force) return investigationStatus;
    try {
      updateStatus(t('investigateChecking'));
      const res = await bridgeCall('check-investigation', {}, 8000);
      investigationChecked = true;
      investigationStatus = !!(res && res.underInvestigation);
      if (investigationStatus) {
        log(t('logInvestigationFound'));
        try { console.warn('[TCB] Investigation logs:', res.data); } catch (_) {}
        updateStatus(t('investigateFound'), true);
      } else {
        log(t('logInvestigationClean'));
      }
      return investigationStatus;
    } catch (e) {
      log(tf('investigateError', { msg: e?.message || e }));
      return false;
    }
  }

  async function doHuntBot() {
    try {
      await navigateTo('/assaults-hunting-grounds');
      const grounds = await apiGet('hunting-grounds-nightclubs');
      const user = grounds.user;
      if (!user) return { changed: false, reason: 'no-user' };
      if (hpPct(user) < CONFIG.assaultMinHpPct) return { changed: false, reason: 'low-hp' };
      const myPower = Number(user.assault_power || 0);
      const maxPower = myPower * CONFIG.assaultSafetyMargin;
      const rooms = (grounds.nightclubs || [])
        .filter(r => r.hunting_ground)
        .filter(r => Number(r.bot_power || 0) <= maxPower);
      if (!rooms.length) return { changed: false, reason: 'no-safe-room' };
      rooms.sort((a, b) => Number(b.bot_power || 0) - Number(a.bot_power || 0));
      const room = rooms[0];
      log(tf('logBotRoom', { name: room.name, power: room.bot_power }));
      const enteredAt = Date.now();
      const entered = await apiPost('nightclub', { id: room.id });
      const r = entered.nightclub || entered;
      await sleep(rand(600, 1200));
      const visitors = r.visitors || [];

      const allBots = visitors.filter(v => v && v.is_bot === true && v.attackable !== false && v.assault_key && v.id);
      const filteredBots = filterBots(allBots);

      for (const fb of allBots) {
        if (filteredBots.includes(fb)) continue;
        const reason = botFilterReason(fb);
        if (reason) log(tf('logVictimFiltered', {
          name: fb.username || fb.name || fb.id,
          reason
        }));
      }

      const bot = filteredBots[0];
      if (!bot) { log(t('logNoBot')); await exitNightclub(); return { changed: false, reason: 'no-bot' }; }

      log(tf('logAttacking', { name: bot.username || bot.name || bot.id }));
      const tta = Math.max(300, Date.now() - enteredAt);
      const res = await apiPost('attack', { victim_id: bot.id, assault_key: bot.assault_key, tta });
      await exitNightclub();

      const { parts, msgs, hpLost, cashLost } = extractRewards(res);
      const botName = String(bot.username || bot.name || '').replace(/<[^>]*>/g, '').trim() || `#${bot.id}`;
      const success = res.success !== false && res.failed !== true && res.lost !== true;
      if (success) {
        const rewardTxt = parts.length ? ` → ${parts.join(' · ')}` : '';
        logCombat(tf('combatAssaultWin', { name: botName, power: bot.assault_power || bot.power || '?', rewards: rewardTxt }), 'win');
      } else {
        logCombat(tf('combatAssaultLose', { name: botName }), 'lose');
      }
      if (hpLost > 0) logCombat(tf('combatHpLost', { n: hpLost }), 'warn');
      if (cashLost > 0) logCombat(tf('combatCashLost', { n: cashLost.toLocaleString('tr-TR') }), 'warn');
      for (const m of msgs) logCombat(tf('combatInfo', { msg: m }), 'info');

      return { changed: true, bot };
    } catch (e) {
      log(tf('logBotError', { msg: e?.message || e }));
      try { await exitNightclub(); } catch (_) {}
      return { changed: false, reason: 'error' };
    }
  }

  async function doDetox(state) {
    const user = state.user;
    const addiction = Number(user.addiction || 0);
    if (addiction < CONFIG.detoxAtAddiction) return { changed: false, reason: 'below-threshold' };
    await navigateTo('/city-services/hospital');
    const hospital = await apiGet('hospital');
    const price = Number(hospital.detox_price || 0);
    if (!price) return { changed: false, reason: 'no-price' };
    if (Number(hospital.user?.cash || 0) < price) return { changed: false, reason: 'no-cash' };
    log(tf('logDetox', { price, addiction }));
    await apiPost('hospital/detox', {});
    return { changed: true, price, addiction };
  }

  async function doPrisonBribe() {
    await navigateTo('/city-services/prison');
    const prison = await apiGet('prison');
    const price = Number(prison.bribe_cash_cost || prison.bribe_amount || 0);
    if (!price) return { changed: false, reason: 'no-price' };
    if (price > CONFIG.prisonMaxCashBribe) return { changed: false, reason: 'over-limit', price };
    if (Number(prison.user?.cash || 0) < price) return { changed: false, reason: 'no-cash' };
    log(tf('logPrisonBribe', { price }));
    await apiPost('prison/cash-bribe', { bribe: price });
    return { changed: true, price };
  }

  async function doAirport() {
    await navigateTo('/airport');
    const state = await apiGet('airport');
    const flights = state.flights || [];
    const arrived = flights.filter(f => f.arrived && f.id);
    if (arrived.length) {
      log(tf('logAirportCollect', { n: arrived.length }));
      for (const f of arrived) {
        await apiPost('airport/collect', { id: f.id });
        await sleep(rand(250, 500));
      }
      return { changed: true, method: 'collect', count: arrived.length };
    }
    if (!CONFIG.airportAutoBuy) return { changed: false, reason: 'buy-disabled' };
    const user = state.user;
    const cash = Number(user.cash || 0);
    const maxPerDay = Number(state.max_flights_per_day || 0);
    const usedToday = Number(state.flights_last_day || 0);
    if (maxPerDay > 0 && usedToday >= maxPerDay) return { changed: false, reason: 'daily-limit' };
    const candidates = [];
    for (const rwy of state.runways || []) {
      if (!rwy.enabled) continue;
      const active = flights.some(f => !f.arrived && f.airport_runway_id === rwy.id);
      if (active) continue;
      for (const s of rwy.schedule || []) {
        if (!s.available) continue;
        const price = Number(rwy.cash_cost);
        if (!Number.isFinite(price)) continue;
        if (price > CONFIG.airportMaxCargoCash) continue;
        if (cash - price < CONFIG.airportCashReserve) continue;
        candidates.push({ rwy, s, price });
      }
    }
    if (!candidates.length) return { changed: false, reason: 'no-affordable' };
    candidates.sort((a, b) => a.price - b.price);
    const c = candidates[0];
    log(tf('logAirportBuy', { price: c.price }));
    await apiPost('airport', { id: c.rwy.id, schedule_id: c.s.id });
    return { changed: true, method: 'buy', price: c.price };
  }

  async function doBankDeposit(state) {
    const user = state.user;
    const cash = Number(user.cash || 0);
    const amount = Math.floor(cash - CONFIG.bankCashReserve);
    if (amount < CONFIG.bankDepositMin) return { changed: false, reason: 'below-min' };
    await navigateTo('/city-services/bank');
    log(tf('logBankDeposit', { amount }));
    await apiPost('bank/transfer', { action: 'deposit', amount });
    return { changed: true, amount };
  }

  async function doCollectEarnings() {
    await navigateTo('/underworld/hookers');
    const state = await apiGet('hookers');
    const earnings = Number(state.totalEarnings || 0);
    if (earnings < CONFIG.hookerCollectMin) return { changed: false, reason: 'below-min' };
    log(tf('logCollectEarnings', { amount: earnings }));
    await apiPost('hookers/collect', {});
    return { changed: true, earnings };
  }

  async function doFreeDice() {
    await navigateTo('/underworld/casino/dicegame');
    const state = await apiGet('casino/dicegame');
    const rollsLeft = Number(state.rollsLeft || 0);
    if (rollsLeft < 1) return { changed: false, reason: 'no-rolls' };
    const freePackage = (state.packages || []).find(p => p.free === true && Number(p.credit_cost) > 0);
    if (!freePackage) return { changed: false, reason: 'not-free' };
    log(tf('logFreeDice', { n: rollsLeft }));
    await apiPost('casino/dicegame', { credits: Number(freePackage.credit_cost) });
    return { changed: true };
  }

  // ============ UNIVERSITY ============
  async function doUniversity() {
    try {
      await navigateTo('/city-services/university');
      const overview = await apiGet('university');
      const courses = overview?.courses || {};

      for (const [courseId, course] of Object.entries(courses)) {
        const active = (course?.classes || []).find(c => c.is_participating && !c.completed);
        if (active) {
          const name = course?.name || courseId;
          if (active.fulfilled || active.current_part?.is_fulfilled) {
            log(tf('logUniComplete', { name }));
            await apiPost('university/complete', { class_id: active.id, id: courseId });
            return { changed: true, action: 'complete' };
          }
          const criteria = active.current_part?.criterias || active.criterias || [];
          if (active.can_increment && criteria.some(c => c.is_presence && !c.is_fulfilled)) {
            log(tf('logUniPresence', { name }));
            await apiPost('university/presence', { class_id: active.id, id: courseId });
            return { changed: true, action: 'presence' };
          }
          return { changed: false, reason: 'class-in-progress' };
        }
      }

      if (CONFIG.universityAutoEnroll) {
        for (const [courseId, course] of Object.entries(courses)) {
          const candidate = (course?.classes || []).find(c => c.available && !c.completed && !c.is_participating);
          if (candidate) {
            const name = course?.name || courseId;
            log(tf('logUniEnroll', { name }));
            await apiPost(`university/start/${candidate.sid}`, {
              payment_method: CONFIG.universityPaymentMethod || 'cash',
              id: courseId,
            });
            return { changed: true, action: 'start' };
          }
        }
      }
      return { changed: false, reason: 'no-action' };
    } catch (e) {
      log(tf('logUniError', { msg: e?.message || e }));
      return { changed: false, reason: 'error', error: e?.message };
    }
  }

  // ============ FACTORIES ============
  async function doBuildings() {
    try {
      await navigateTo('/financial-area/buildings');
      const state = await apiGet('buildings');
      const owned = state?.userBuildings || [];
      if (!owned.length) return { changed: false, reason: 'no-buildings' };

      const ready = owned.filter(b => Number(b.production || 0) > 0 && !b.is_laboratory);
      if (ready.length) {
        log(tf('logBuildingsCollect', { n: ready.length }));
        await apiPost('buildings/collect', { id: 0, quantity: 0 });
        return { changed: true, action: 'collect', count: ready.length };
      }

      if (CONFIG.autoMaintain && owned.some(b => b.maintenance_due || b.needs_maintenance)) {
        log(t('logBuildingsMaintain'));
        await apiPost('buildings/maintain-all', {});
        return { changed: true, action: 'maintain' };
      }
      return { changed: false, reason: 'no-action' };
    } catch (e) {
      log(tf('logBuildingsError', { msg: e?.message || e }));
      return { changed: false, reason: 'error', error: e?.message };
    }
  }

  // ============ LABORATORY ============
  function productionComponentOptions(state) {
    const owned = Array.isArray(state?.userBuildings) ? state.userBuildings : [];
    const sources = [
      ...(Array.isArray(state?.userDrugComponents) ? state.userDrugComponents : []),
      ...owned.flatMap(b => Array.isArray(b?.userDrugComponents) ? b.userDrugComponents : []),
    ];
    const byDrug = new Map();
    for (const item of sources) {
      const comp = item?.component || {};
      const drugId = Number(comp.drug_id || comp.drug?.id || item?.drug_id || item?.drug?.id || 0);
      if (!Number.isInteger(drugId) || drugId <= 0) continue;
      const avail = Math.max(0, Number(item?.quantity || item?.amount || 0));
      const name = String(
        comp.drug?.name || item?.drug?.name ||
        comp.drug_name || item?.drug_name ||
        comp.name || item?.name || `#${drugId}`
      ).trim();
      const cur = byDrug.get(drugId);
      if (!cur) byDrug.set(drugId, { drugId, name, available: avail });
      else {
        cur.available = Math.max(cur.available, avail);
        if (cur.name.startsWith('#') && !name.startsWith('#')) cur.name = name;
      }
    }
    return [...byDrug.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  async function doLaboratory() {
    try {
      await navigateTo('/financial-area/buildings');
      const state = await apiGet('buildings');
      const owned = state?.userBuildings || [];
      const labs = owned.filter(b => b.is_laboratory || b.building?.is_laboratory);
      if (!labs.length) return { changed: false, reason: 'no-laboratory' };

      const selectedIds = (CONFIG.productionDrugIds || []).map(Number).filter(id => id > 0);
      const allComponents = productionComponentOptions(state).filter(c => c.available > 0);
      const allowed = selectedIds.length ? allComponents.filter(c => selectedIds.includes(c.drugId)) : allComponents;
      if (!allowed.length) return { changed: false, reason: 'no-components' };

      for (const lab of labs) {
        const queue = lab?.laboratory_productions || lab?.productions || [];
        const completed = queue.filter(p =>
          p?.completed === true ||
          Number(p?.completed_at_timestamp || p?.complete_at || 0) * 1000 <= Date.now()
        );
        if (completed.length) {
          for (const item of completed) {
            await apiPost(`buildings/${lab.id}/production/${item.id}/complete`, {});
            await sleep(rand(200, 400));
          }
          log(tf('logLabComplete', { n: completed.length }));
          return { changed: true, action: 'complete', count: completed.length };
        }
        const maxLote = Number(lab.max_production) || Infinity;
        const comp = allowed[0];
        const qty = Math.max(1, Math.min(comp.available, maxLote, Number(CONFIG.productionQuantity) || comp.available));
        await apiPost(`buildings/${lab.id}/production/start`, { drug_id: comp.drugId, quantity: qty });
        log(tf('logLabStart', { qty, drug: comp.drugId }));
        return { changed: true, action: 'start', drug: comp.drugId, quantity: qty };
      }
      return { changed: false, reason: 'no-action' };
    } catch (e) {
      log(tf('logLabError', { msg: e?.message || e }));
      return { changed: false, reason: 'error', error: e?.message };
    }
  }

  const lastMaint = { airport: 0, bank: 0, hookers: 0, dice: 0, levelup: 0, training: 0, university: 0, buildings: 0, laboratory: 0 };

  async function runMaintenance(state) {
    const now = Date.now();
    const jobs = [
      { key: 'levelup',    every: 60000,  enabled: CONFIG.autoLevelUp,        fn: () => doLevelUp(),         labelKey: 'maintLevelUp' },
      { key: 'training',   every: 90000,  enabled: CONFIG.autoTraining,       fn: () => doTraining(),        labelKey: 'maintTraining' },
      { key: 'university', every: 90000,  enabled: CONFIG.autoUniversity,     fn: () => doUniversity(),      labelKey: 'maintUniversity' },
      { key: 'buildings',  every: 120000, enabled: CONFIG.autoBuildings,      fn: () => doBuildings(),       labelKey: 'maintBuildings' },
      { key: 'laboratory', every: 120000, enabled: CONFIG.autoLaboratory,     fn: () => doLaboratory(),      labelKey: 'maintLaboratory' },
      { key: 'airport',    every: 120000, enabled: CONFIG.autoAirport,        fn: () => doAirport(),         labelKey: 'maintAirport' },
      { key: 'hookers',    every: 300000, enabled: CONFIG.autoCollectHookers, fn: () => doCollectEarnings(), labelKey: 'maintHookers' },
      { key: 'dice',       every: 600000, enabled: CONFIG.autoFreeDice,       fn: () => doFreeDice(),        labelKey: 'maintDice' },
      { key: 'bank',       every: 300000, enabled: CONFIG.autoBankDeposit,    fn: () => doBankDeposit(state),labelKey: 'maintBank' },
    ];
    for (const j of jobs) {
      if (!running) return;
      if (!j.enabled) continue;
      if (now - lastMaint[j.key] < j.every) continue;
      lastMaint[j.key] = now;
      const label = t(j.labelKey);
      try {
        const r = await j.fn();
        if (r?.changed) { stats.actions++; updateStats(); log(tf('logMaintDone', { label })); }
        else if (r?.reason === 'error') log(tf('logMaintError', { label, msg: r.error || '?' }));
      } catch (e) { log(tf('logMaintError', { label, msg: e?.message || e })); }
    }
  }

  // ---------------- Runtime Sayaç ----------------
  let runtimeAccum = 0;
  let runtimeStartedAt = 0;
  let runtimeTick = null;

  function fmtRuntime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function renderRuntime() {
    if (!refs.runtimeEl) return;
    const now = Date.now();
    const total = runtimeAccum + (runtimeStartedAt ? (now - runtimeStartedAt) : 0);
    refs.runtimeEl.textContent = fmtRuntime(total);
  }

  function startRuntime() {
    runtimeStartedAt = Date.now();
    if (runtimeTick) clearInterval(runtimeTick);
    runtimeTick = setInterval(renderRuntime, 1000);
    renderRuntime();
  }

  function pauseRuntime() {
    if (runtimeStartedAt) {
      runtimeAccum += Date.now() - runtimeStartedAt;
      runtimeStartedAt = 0;
    }
    if (runtimeTick) { clearInterval(runtimeTick); runtimeTick = null; }
    renderRuntime();
  }

  function resetRuntime() {
    runtimeAccum = 0;
    runtimeStartedAt = 0;
    if (runtimeTick) { clearInterval(runtimeTick); runtimeTick = null; }
    renderRuntime();
  }

  // ---------------- Preset ----------------
  function detectActivePreset() {
    for (const [name, p] of Object.entries(PRESETS)) {
      if (p.minDelayMs === Number(CONFIG.minDelayMs) &&
          p.maxDelayMs === Number(CONFIG.maxDelayMs) &&
          p.cycleMinMs === Number(CONFIG.cycleMinMs) &&
          p.cycleMaxMs === Number(CONFIG.cycleMaxMs)) {
        return name;
      }
    }
    return null;
  }

  function highlightPresetButtons() {
    if (!refs.shadow) return;
    const active = detectActivePreset();
    refs.shadow.querySelectorAll('.preset-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === active);
    });
  }

  function applyPreset(name) {
    const p = PRESETS[name];
    if (!p) return;
    Object.assign(CONFIG, p);

    if (refs.presetInputs) {
      for (const [key, el] of Object.entries(refs.presetInputs)) {
        if (el && p[key] != null) el.value = String(p[key]);
      }
    }
    highlightPresetButtons();
    saveConfig();
    log(tf('logPreset', { name: name.toUpperCase(), min: p.minDelayMs, max: p.maxDelayMs, cmin: p.cycleMinMs, cmax: p.cycleMaxMs }));
  }

  // ---------------- Ana döngü ----------------
  let running = false;
  let runGeneration = 0;
  let nextMainAction = 'robbery';
  const stats = { cycles: 0, actions: 0, robberies: 0, gangRobberies: 0, recoveries: 0, assaults: 0, errors: 0 };

  function isCurrent(gen) { return running && gen === runGeneration; }

  async function oneCycle(gen) {
    if (!isCurrent(gen)) return;

    stats.cycles += 1;
    updateStats();
    updateStatus(t('statusSyncing'));

    await navigateTo('/robberies');
    if (!isCurrent(gen)) return;

    const state = await apiGet('robberies');
    if (!isCurrent(gen)) return;

    const user = state.user;
    if (!user) throw new Error('no-user');
    updateUser(user);

    if (!user.alive) { updateStatus(t('statusDead')); return; }

    if (user.in_prison) {
      if (CONFIG.autoPrisonBribe) {
        updateStatus(t('statusInPrison'));
        try {
          const r = await doPrisonBribe();
          if (!isCurrent(gen)) return;
          if (r.changed) { stats.actions++; updateStats(); log(tf('logPrisonBribed', { price: r.price })); }
          else log(tf('logBribeSkipped', { reason: r.reason }));
        } catch (e) { log(tf('logPrisonError', { msg: e.message })); }
      } else { updateStatus(t('statusInPrisonBribeOff')); }
      return;
    }

    const addiction = Number(user.addiction || 0);
    if (CONFIG.autoDetox && addiction >= CONFIG.detoxAtAddiction) {
      updateStatus(tf('statusDetox', { p: addiction }));
      try {
        const r = await doDetox(state);
        if (!isCurrent(gen)) return;
        if (r.changed) { stats.actions++; updateStats(); log(tf('logDetoxDone', { price: r.price })); }
        else log(tf('logDetoxSkipped', { reason: r.reason }));
      } catch (e) { log(tf('logDetoxError', { msg: e.message })); }
      return;
    }

    if (CONFIG.autoLevelUp) {
      try {
        const r = await doLevelUp();
        if (!isCurrent(gen)) return;
        if (r.changed) { stats.actions++; updateStats(); }
      } catch (_) {}
    }

    const healingLowHp = CONFIG.healingTrigger === 'low-hp' || CONFIG.healingTrigger === 'both';
    if (CONFIG.autoHealing && healingLowHp) {
      const curHp = hpPct(user);
      if (curHp < CONFIG.healingBelowHpPct) {
        log(tf('logHealLow', { hp: curHp.toFixed(0), threshold: CONFIG.healingBelowHpPct }));
        const r = await activity.run('heal', () => doUseActionItem());
        if (!isCurrent(gen)) return;
        if (r?.changed) { stats.actions++; updateStats(); }
        else if (r?.reason !== 'no-item') log(tf('logHealFailed', { reason: r?.reason, error: r?.error || '' }));
      }
    }

    const sp = staminaPct(user);
    const cur = staminaCurrent(user);
    const cap = staminaCapacity(user);
    log(tf('logStatusLine', { hp: hpPct(user).toFixed(0), cur, cap, pct: sp.toFixed(1) }));

    if (CONFIG.autoStamina && sp < CONFIG.staminaFloorPct) {
      updateStatus(tf('statusLowStamina', { p: sp.toFixed(1) }));
      await sleep(rand(CONFIG.minDelayMs, CONFIG.maxDelayMs));
      if (!isCurrent(gen)) return;
      const r = await activity.run('stamina', () => doStaminaRecovery(state));
      if (!isCurrent(gen)) return;
      if (r?.changed) { stats.actions++; stats.recoveries++; updateStats(); }
      return;
    }

    const canRob    = CONFIG.autoRobbery;
    const canGang   = CONFIG.autoGangRobbery && hpPct(user) >= CONFIG.gangRobberyMinHpPct;
    const canAssault = CONFIG.autoAssault && hpPct(user) >= CONFIG.assaultMinHpPct;

    const actionPool = [];
    if (canRob)     actionPool.push('robbery');
    if (canGang)    actionPool.push('gang');
    if (canAssault) actionPool.push('assault');

    let action = null;
    if (actionPool.length) {
      if (actionPool.includes(nextMainAction)) {
        action = nextMainAction;
      } else {
        action = actionPool[0];
      }
      const idx = actionPool.indexOf(action);
      nextMainAction = actionPool[(idx + 1) % actionPool.length];
    }

    if (action === 'robbery' || action === 'gang' || action === 'assault') {
      const healingBeforeAction = CONFIG.healingTrigger === 'before-action' || CONFIG.healingTrigger === 'both';
      if (CONFIG.autoHealing && healingBeforeAction) {
        await activity.run('heal', () => doUseActionItem());
        if (!isCurrent(gen)) return;
      }
    }

    if (action === 'robbery') {
      await navigateTo('/robberies');
      if (!isCurrent(gen)) return;
      updateStatus(t('statusRobbery'));
      await sleep(rand(CONFIG.minDelayMs, CONFIG.maxDelayMs));
      if (!isCurrent(gen)) return;
      const r = await activity.run('robbery', () => doRobbery(state));
      if (!isCurrent(gen)) return;
      if (r?.changed) { stats.actions++; stats.robberies++; }
      else if (r?.reason === 'no-energy') {}
      else if (canAssault && r?.reason === 'no-safe-robbery') {
        const a = await activity.run('assault', () => doHuntBot());
        if (!isCurrent(gen)) return;
        if (a?.changed) { stats.actions++; stats.assaults++; }
      }
    } else if (action === 'gang') {
      updateStatus(t('statusGangRobbery'));
      await navigateTo('/robberies');
      if (!isCurrent(gen)) return;
      await sleep(rand(CONFIG.minDelayMs, CONFIG.maxDelayMs));
      if (!isCurrent(gen)) return;
      const r = await activity.run('gang', () => doGangRobbery(state));
      if (!isCurrent(gen)) return;

      if (r?.changed) {
        stats.actions++; stats.gangRobberies++;
      } else if (r?.reason === 'no-energy') {
      } else if (r?.reason === 'low-hp') {
        log(t('logGangSkippedHp'));
      } else if (r?.reason === 'no-planned-robbery') {
        if (canRob) {
          const rr = await activity.run('robbery', () => doRobbery(state));
          if (!isCurrent(gen)) return;
          if (rr?.changed) { stats.actions++; stats.robberies++; }
        }
      } else if (r?.reason) {
        log(tf('logGangSkipped', { reason: r.reason }));
      }
    } else if (action === 'assault') {
      updateStatus(t('statusHuntingBot'));
      await sleep(rand(CONFIG.minDelayMs, CONFIG.maxDelayMs));
      if (!isCurrent(gen)) return;
      const r = await activity.run('assault', () => doHuntBot());
      if (!isCurrent(gen)) return;
      if (r?.changed) { stats.actions++; stats.assaults++; }
      else if (canRob && (r?.reason === 'no-safe-room' || r?.reason === 'no-bot')) {
        const rr = await activity.run('robbery', () => doRobbery(state));
        if (!isCurrent(gen)) return;
        if (rr?.changed) { stats.actions++; stats.robberies++; }
      }
    } else { updateStatus(t('statusNoAction')); }

    await runMaintenance(state);
    if (!isCurrent(gen)) return;
    updateStats();
  }

  async function loop(gen) {
    if (!isCurrent(gen)) return;
    try { await oneCycle(gen); }
    catch (e) {
      if (!isCurrent(gen)) return;
      stats.errors++;
      updateStats();
      log(tf('logCycleError', { msg: e?.message || e }));
      updateStatus(tf('statusError', { msg: e?.message || e }), true);
    }
    if (!isCurrent(gen)) return;
    const g = gen;
    taskRunner.enqueue(() => loop(g), 'main-loop');
  }

  async function start() {
    if (running) return;
    try {
      const pong = await bridgeCall('ping', {}, 5000);
      if (!pong?.ok) throw new Error('E_BRIDGE_TIMEOUT:ping');
      log(pong.hasToken ? t('logStartedToken') : t('logStartedNoToken'));
    } catch (e) {
      log(tf('logBridgeError', { msg: e.message }));
      updateStatus(t('statusBridgeNotReady'), true);
      return;
    }

    const underInvestigation = await checkInvestigation();
    if (underInvestigation) {
      const proceed = window.confirm(t('investigateConfirm'));
      if (!proceed) {
        log('⚠️ ' + t('investigateFound'));
        return;
      }
      log('⚠️ ' + t('logInvestigationFound'));
    }

    runGeneration++;
    const gen = runGeneration;

    running = true;
    CONFIG.enabled = true;
    lastRoute = null;
    await saveConfig();
    updateStatus(t('statusStarted'));
    syncUi();

    resetRuntime();
    startRuntime();

    taskRunner.start();
    setTimeout(() => {
      if (isCurrent(gen)) taskRunner.enqueue(() => loop(gen), 'main-loop');
    }, 800);
  }

  function stop() {
    running = false;
    runGeneration++;
    CONFIG.enabled = false;
    saveConfig();
    taskRunner.stop();
    pauseRuntime();
    log(t('logStopped'));
    updateStatus(t('statusStopped'));
    syncUi();
  }

  async function syncStats() {
    updateStatus(t('statusSyncing'));
    try {
      await navigateTo('/robberies', true);
      const state = await apiGet('robberies');
      if (state.user) updateUser(state.user);
      log(t('logSynced'));
      updateStatus(t('statusSynced'));
      loadActionItems();
    } catch (e) {
      log(tf('logSyncError', { msg: e?.message || e }));
      updateStatus(tf('logSyncError', { msg: e?.message || e }), true);
    }
  }

  async function saveConfig() {
    try {
      const toSave = { enabled: CONFIG.enabled };
      for (const k of Object.keys(DEFAULTS)) if (k !== 'enabled') toSave[k] = CONFIG[k];
      await chrome.storage.local.set({ crims_mini_bot: toSave });
    } catch (_) {}
  }

  async function loadConfig() {
    try {
      const data = await chrome.storage.local.get('crims_mini_bot');
      if (data.crims_mini_bot) {
        Object.assign(CONFIG, data.crims_mini_bot);
        if (CONFIG.healingTrigger === 'choose') CONFIG.healingTrigger = 'both';
        if (!Array.isArray(CONFIG.victimUsernameBlacklist)) CONFIG.victimUsernameBlacklist = [];
        if (!Array.isArray(CONFIG.victimIdBlacklist))       CONFIG.victimIdBlacklist = [];
        if (!Array.isArray(CONFIG.victimCountryBlacklist))  CONFIG.victimCountryBlacklist = [];
        if (!Array.isArray(CONFIG.victimUsernameWhitelist)) CONFIG.victimUsernameWhitelist = [];
        if (!Array.isArray(CONFIG.victimIdWhitelist))       CONFIG.victimIdWhitelist = [];
        if (typeof CONFIG.criteriaEnabled !== 'boolean') CONFIG.criteriaEnabled = false;
        if (!CONFIG.assaultCriteria || typeof CONFIG.assaultCriteria !== 'object') {
          CONFIG.assaultCriteria = JSON.parse(JSON.stringify(DEFAULTS.assaultCriteria));
        } else {
          for (const ch of Object.keys(DEFAULTS.assaultCriteria)) {
            if (!CONFIG.assaultCriteria[ch]) CONFIG.assaultCriteria[ch] = { ...DEFAULTS.assaultCriteria[ch] };
          }
        }
        if (typeof CONFIG.autoUniversity !== 'boolean') CONFIG.autoUniversity = false;
        if (typeof CONFIG.universityAutoEnroll !== 'boolean') CONFIG.universityAutoEnroll = false;
        if (!CONFIG.universityPaymentMethod) CONFIG.universityPaymentMethod = 'cash';
        if (typeof CONFIG.autoBuildings !== 'boolean') CONFIG.autoBuildings = false;
        if (typeof CONFIG.autoLaboratory !== 'boolean') CONFIG.autoLaboratory = false;
        if (typeof CONFIG.autoMaintain !== 'boolean') CONFIG.autoMaintain = false;
        if (!Number.isFinite(Number(CONFIG.productionQuantity))) CONFIG.productionQuantity = 0;
        if (!Array.isArray(CONFIG.productionDrugIds)) CONFIG.productionDrugIds = [];
      }
      activity.setGapRange(CONFIG.activityMinGapMs, CONFIG.activityMaxGapMs);
    } catch (_) {}
  }

  // ---------------- UI ----------------
  let refs = {};

  function tip(text, i18nKey) {
    const safe = String(text || '').replace(/"/g, '&quot;');
    const keyAttr = i18nKey ? ` data-i18n-tip="${i18nKey}"` : '';
    return `<span class="tip" data-tip="${safe}"${keyAttr}>?</span>`;
  }

  function t(key) {
    const lang = CONFIG.language || 'tr';
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key])
        || TRANSLATIONS.en[key]
        || TRANSLATIONS.tr[key]
        || key;
  }

  function tf(key, vars = {}) {
    let s = t(key);
    for (const k of Object.keys(vars)) {
      s = s.split('{' + k + '}').join(String(vars[k]));
    }
    return s;
  }

  const BRIDGE_ERR_MAP = {
    E_BRIDGE_TIMEOUT: 'errBridgeTimeout',
    E_NO_TOKEN:       'errNoToken',
    E_FOREIGN_ORIGIN: 'errForeignOrigin',
    E_API_ONLY:       'errApiOnly',
    E_NO_EVENTS:      'errNoEvents',
    E_NO_ROUTER:      'errNoRouter',
    E_UNKNOWN_MSG:    'errUnknownMsg',
  };

  function translateBridgeError(raw) {
    const s = String(raw || '');
    const base = s.includes(':') ? s.split(':')[0] : s;
    const key = BRIDGE_ERR_MAP[base];
    if (!key) return s;
    const suffix = s.includes(':') ? s.slice(s.indexOf(':')) : '';
    return t(key) + suffix;
  }

  function isRtl(lang) { return RTL_LANGS.includes(lang); }

  function applyLanguage() {
    if (!refs.shadow) return;
    const s = refs.shadow;

    s.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!key) return;
      const val = t(key);
      if (val != null && val !== key) el.textContent = val;
    });

    s.querySelectorAll('[data-i18n-tip]').forEach(el => {
      const key = el.dataset.i18nTip;
      if (!key) return;
      const val = t(key);
      if (val != null && val !== key) el.setAttribute('data-tip', val);
    });

    if (refs.toggleBtn) {
      refs.toggleBtn.textContent = running ? t('btnStop') : t('btnStart');
    }
    if (refs.syncBtn) {
      refs.syncBtn.textContent = t('btnSync');
    }

    s.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === (CONFIG.language || 'tr'));
    });

    const rtl = isRtl(CONFIG.language || 'tr');
    if (refs.panel) refs.panel.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    s.querySelectorAll('.log').forEach(el => el.setAttribute('dir', rtl ? 'rtl' : 'ltr'));

    populateActionItemSelect();
  }

  function buildPanel() {
    if (document.getElementById('crims-mini-bot-host')) return;

    loadFiraSans();

    const host = document.createElement('div');
    host.id = 'crims-mini-bot-host';
    host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;right:16px;bottom:16px;';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          font-family: 'Fira Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
          color-scheme: dark;
          font-weight: 500;
          letter-spacing:-.005em;
          --bg:#0e0f11; --bg-2:#141518; --card:#181a1d; --card-hover:#1f2125;
          --line:#2a2c31; --line-soft:#212327; --text:#e8eaed; --text-soft:#a8aeb6;
          --muted:#71767e; --red:#b93b2b; --red-bright:#e04a3a; --red-deep:#7a2418;
          --red-dark:#3a1410; --gold:#d4a648;
        }
        * { box-sizing: border-box; }

        .launcher {
          position:fixed;right:12px;bottom:11px;
          width:60px;height:60px;border:0;padding:0;background:transparent;
          cursor:pointer;z-index:2;
          display:flex;align-items:center;justify-content:center;
          transition:transform .25s cubic-bezier(.4,0,.2,1);
          -webkit-tap-highlight-color:transparent;
          font-family:'Fira Sans', sans-serif;
        }
        .launcher:hover { transform:translateY(-2px) scale(1.04); }
        .launcher:active { transform:scale(.95); }
        .launcher::before {
          content:'';position:absolute;inset:0;border-radius:50%;
          background:conic-gradient(from 0deg,
            rgba(113,118,126,.12) 0deg, #b93b2b 80deg, #e04a3a 140deg, #d4a648 200deg,
            rgba(113,118,126,.12) 290deg, rgba(113,118,126,.12) 360deg);
          -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
                  mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
          animation:launcher-spin 5s linear infinite;
          filter:drop-shadow(0 0 6px rgba(224,74,58,.45));
          transition:filter .3s;
        }
        .launcher.on::before { animation-duration:1.6s; filter:drop-shadow(0 0 12px rgba(224,74,58,.95)); }
        .launcher::after {
          content:'';position:absolute;inset:5px;border-radius:50%;
          background:radial-gradient(circle at 32% 28%, #232629 0%, #131517 45%, #08090b 100%);
          border:1px solid #2a2c31;
          box-shadow: inset 0 0 14px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.05), 0 6px 18px rgba(0,0,0,.7);
          transition:border-color .3s, box-shadow .3s;
        }
        .launcher.on::after {
          border-color:rgba(224,74,58,.5);
          box-shadow: inset 0 0 18px rgba(185,59,43,.35), inset 0 1px 0 rgba(255,255,255,.06), 0 6px 22px rgba(185,59,43,.45);
        }
        .launcher-symbol {
          position:relative;z-index:2;width:26px;height:26px;color:#a8aeb6;
          transition:color .25s, filter .25s;filter:drop-shadow(0 1px 1px rgba(0,0,0,.9));
        }
        .launcher:hover .launcher-symbol { color:#e8eaed; }
        .launcher.on .launcher-symbol {
          color:#ff6a55; filter:drop-shadow(0 0 6px rgba(224,74,58,.9));
          animation:launcher-glow 2s ease-in-out infinite;
        }
        .launcher-led {
          position:absolute;bottom:4px;right:4px;width:10px;height:10px;border-radius:50%;
          background:#4a4d55;border:2px solid #0b0c0e;z-index:3;
          transition:background .3s, box-shadow .3s;
        }
        .launcher.on .launcher-led {
          background:#4ade80;
          box-shadow:0 0 10px rgba(74,222,128,.95), 0 0 20px rgba(74,222,128,.5);
          animation:launcher-pulse 1.4s ease-in-out infinite;
        }
        @keyframes launcher-spin { to { transform:rotate(360deg); } }
        @keyframes launcher-pulse { 0%,100% { opacity:1; transform:scale(1);} 50% { opacity:.55; transform:scale(.85);} }
        @keyframes launcher-glow {
          0%,100% { filter:drop-shadow(0 0 5px rgba(224,74,58,.7)); }
          50%     { filter:drop-shadow(0 0 10px rgba(224,74,58,1)); }
        }

        .panel {
          position:fixed;right:16px;bottom:82px;
          width:600px;max-width:calc(100vw - 32px);height:85vh;
          background:linear-gradient(180deg,#131417 0%,#0b0c0e 100%);
          color:var(--text);border-radius:16px;border:1px solid #2a2c31;
          display:none;flex-direction:column;overflow:hidden;
          box-shadow:0 24px 60px rgba(0,0,0,.75);
        }
        .panel.open { display:flex; }

        .header {
          display:flex;justify-content:space-between;align-items:center;
          padding:14px 18px;
          background:linear-gradient(180deg,#171a1e,#121417);
          border-bottom:1px solid #24262b;position:relative;
        }
        .header h3 {
          margin:0;font-size:15px;font-weight:800;letter-spacing:.02em;
          background:linear-gradient(90deg,#e04a3a 0%,#d4a648 50%,#e04a3a 100%);
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .header button {
          background:transparent;border:none;color:var(--muted);cursor:pointer;
          font-size:20px;line-height:1;padding:0;transition:.15s;
          width:28px;height:28px;border-radius:6px;
          display:flex;align-items:center;justify-content:center;
        }
        .header button:hover { color:#e04a3a; background:rgba(224,74,58,.1); }

        .status {
          margin:12px 18px 0;padding:9px 12px;
          background:#121317;border:1px solid #232528;border-radius:8px;
          font-size:12px;color:var(--text-soft);min-height:16px;
          line-height:1.45;font-weight:500;
        }
        .status.ok { color:#8fd6a8; border-color:rgba(143,214,168,.3); }
        .status.err { color:#e08080; border-color:rgba(224,128,128,.3); }

        .stat-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 18px 0; }
        .stat { background:#16181b;padding:9px 11px;border-radius:8px;min-width:0;border:1px solid #232528;transition:.15s; }
        .stat:hover { border-color:#33363b; }
        .stat span {
          display:block;color:var(--muted);font-size:9.5px;font-weight:600;
          text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px;
        }
        .stat strong {
          color:var(--text);font-size:13px;font-weight:700;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;
        }

        .stats-panel {
          margin:14px 18px 0;padding:12px 14px;background:#131519;
          border:1px solid #232528;border-radius:10px;
          display:flex;align-items:center;justify-content:space-around;gap:8px;
        }
        .stats-panel .stat-item { display:flex;flex-direction:column;align-items:center;gap:3px;flex:1; }
        .stats-panel .stat-item .label {
          font-size:9.5px;font-weight:600;color:var(--muted);
          text-transform:uppercase;letter-spacing:.1em;
        }
        .stats-panel .stat-item .value { font-size:16px;font-weight:700;color:#e8eaed; }
        .stats-panel .divider { width:1px;height:26px;background:#2a2c31; }

        .runtime-bar {
          margin:10px 18px 0;padding:10px 14px;
          background:linear-gradient(90deg,#131519 0%,#181a1f 100%);
          border:1px solid #232528;border-radius:10px;
          display:flex;align-items:center;justify-content:space-between;gap:10px;
        }
        .runtime-bar .runtime-left { display:flex;align-items:center;gap:8px; }
        .runtime-dot {
          width:8px;height:8px;border-radius:50%;background:#4a4d55;transition:.2s;
        }
        .runtime-dot.on {
          background:#e04a3a;box-shadow:0 0 8px rgba(224,74,58,.8);
          animation:pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.45; } }
        .runtime-label {
          font-size:10.5px;font-weight:700;color:var(--muted);
          text-transform:uppercase;letter-spacing:.1em;
        }
        .runtime-value {
          font-family:'Fira Sans', ui-monospace, monospace;
          font-size:15px;font-weight:700;color:#e8eaed;letter-spacing:.05em;
          font-variant-numeric:tabular-nums;
        }

        .tabs {
          display:flex;justify-content:center;gap:2px;padding:0 18px;
          border-bottom:1px solid #232528;margin-top:0;
        }
        .tabs button {
          position:relative;padding:9px 14px 12px;border:0;background:none;
          color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;
          letter-spacing:-.005em;transition:.15s;
        }
        .tabs button:hover { color:var(--text-soft); }
        .tabs button.active { color:#e8eaed; font-weight:700; }
        .tabs button.active:after {
          content:"";position:absolute;left:8px;right:8px;bottom:-1px;
          height:2px;border-radius:2px;background:#b93b2b;
        }

        .body { padding:16px 18px 18px;overflow-y:auto;flex:1;min-height:0; }
        .body::-webkit-scrollbar { width:8px; }
        .body::-webkit-scrollbar-track { background:transparent; }
        .body::-webkit-scrollbar-thumb { background:#33363b; border-radius:4px; }
        .body::-webkit-scrollbar-thumb:hover { background:#424650; }

        .tab { display:none; }
        .tab.active { display:block; }

        .section { margin-bottom:20px; }
        .section-title {
          font-size:13px;font-weight:700;letter-spacing:.02em;margin-bottom:10px;
          display:flex;align-items:center;gap:10px;color:#e8eaed;
        }
        .section-title::before {
          content:"";width:3px;height:14px;border-radius:2px;background:#b93b2b;
        }
        .section-title::after {
          content:"";flex:1;height:1px;
          background:linear-gradient(90deg, #2a2c31, transparent);
        }
        [dir="rtl"] .section-title::after {
          background:linear-gradient(270deg, #2a2c31, transparent);
        }

        .grid2 { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
        .grid2 .row.full { grid-column:1 / -1; }

        .row {
          display:flex;align-items:center;justify-content:space-between;
          gap:10px;padding:10px 12px;background:#16181b;
          border:1px solid #232528;border-radius:8px;
          transition:.15s;position:relative;
        }
        .row:hover { border-color:#33363b; }
        .row.toggle-row { cursor:pointer; user-select:none; }
        .row.toggle-row:hover { background:#1c1e22; border-color:#3a3d44; }
        .row.toggle-row > span:first-child,
        .row > span:first-child {
          font-size:13px;color:#d8dade;flex:1;line-height:1.4;font-weight:500;
        }

        .row input[type=number] {
          width:92px;padding:6px 9px;background:#0d0e10;color:#e8eaed;
          border:1px solid #2a2c31;border-radius:6px;
          font-size:12.5px;font-weight:600;outline:none;cursor:text;
          text-align:right;flex:none;transition:.15s;
          font-family:'Fira Sans', ui-monospace, monospace;
        }
        [dir="rtl"] .row input[type=number] { text-align:left; }
        .row input[type=text] {
          width:220px;padding:6px 9px;background:#0d0e10;color:#e8eaed;
          border:1px solid #2a2c31;border-radius:6px;
          font-size:12px;font-weight:600;outline:none;
          flex:none;transition:.15s;text-align:left;
          font-family:'Fira Sans', ui-monospace, monospace;
        }
        [dir="rtl"] .row input[type=text] { text-align:right; }
        .row input[type=text]:focus {
          border-color:#b93b2b;box-shadow:0 0 0 2px rgba(185,59,43,.2);
        }
        .row input[type=number]:focus {
          border-color:#b93b2b;box-shadow:0 0 0 2px rgba(185,59,43,.2);
        }
        .row select {
          width:180px;padding:6px 9px;background:#0d0e10;color:var(--text);
          border:1px solid #2a2c31;border-radius:6px;
          font-size:12.5px;font-weight:600;outline:none;cursor:pointer;
          flex:none;transition:.15s;
        }
        .row select:focus {
          border-color:#b93b2b;box-shadow:0 0 0 2px rgba(185,59,43,.2);
        }
        .row select option { background:#16181b; color:var(--text); }

        .preset-row {
          display:grid;grid-template-columns:repeat(3,1fr);gap:8px;grid-column:1 / -1;
        }
        .preset-btn {
          display:flex;flex-direction:column;align-items:center;gap:2px;
          padding:9px 8px;background:#0d0e10;color:var(--text-soft);
          border:1px solid #2a2c31;border-radius:8px;
          font-family:'Fira Sans', sans-serif;cursor:pointer;transition:.15s;
        }
        .preset-btn:hover { border-color:#b93b2b;color:#e8eaed;background:#15161a; }
        .preset-btn .preset-title { font-size:12px;font-weight:700;letter-spacing:-.005em; }
        .preset-btn .preset-sub { font-size:10px;font-weight:500;color:var(--muted);letter-spacing:.02em; }
        .preset-btn.safe .preset-sub   { color:#8fd6a8; }
        .preset-btn.medium .preset-sub { color:#d4a648; }
        .preset-btn.fast .preset-sub   { color:#e08080; }
        .preset-btn.active {
          background:linear-gradient(135deg,rgba(185,59,43,.18),rgba(122,36,24,.18));
          border-color:#b93b2b;color:#e8eaed;
          box-shadow:0 0 0 1px rgba(185,59,43,.35), 0 0 14px rgba(185,59,43,.25);
        }
        .preset-btn.active .preset-title { color:#fff; }

        .switch {
          position:relative;width:34px;height:19px;background:#2a2c31;
          border-radius:10px;transition:.25s;flex:none;border:1px solid #33363b;
        }
        .switch::after {
          content:'';position:absolute;top:2px;left:2px;width:13px;height:13px;
          background:#71767e;border-radius:50%;
          transition:.25s cubic-bezier(.4,0,.2,1);
        }
        input[type=checkbox] { display:none; }
        input[type=checkbox]:checked + .switch {
          background:linear-gradient(135deg,#b93b2b,#7a2418);
          border-color:#b93b2b;
        }
        input[type=checkbox]:checked + .switch::after {
          transform:translateX(15px);background:#fff;
        }
        [dir="rtl"] input[type=checkbox]:checked + .switch::after {
          transform:translateX(-15px);
        }

        .criteria-grid { display:flex;flex-direction:column;gap:6px;grid-column:1 / -1; }
        .criteria-header {
          display:grid;grid-template-columns:1fr 70px 90px 90px;gap:6px;
          font-size:10px;color:#71767e;font-weight:700;
          text-transform:uppercase;letter-spacing:.06em;padding:0 6px;
        }
        .criteria-row {
          display:grid;grid-template-columns:1fr 70px 90px 90px;gap:6px;
          align-items:center;padding:5px 6px;background:#131519;
          border:1px solid #212327;border-radius:6px;
        }
        .criteria-row .criteria-name {
          font-size:12px;font-weight:700;color:#d8dade;letter-spacing:.02em;
        }
        .criteria-row input {
          width:100%;padding:5px 7px;background:#0d0e10;color:#e8eaed;
          border:1px solid #2a2c31;border-radius:5px;
          font-size:11.5px;text-align:right;outline:none;
          font-family:'Fira Sans', ui-monospace, monospace;
        }
        .criteria-row input:focus {
          border-color:#b93b2b;box-shadow:0 0 0 2px rgba(185,59,43,.2);
        }

        .log {
          height:100%;min-height:340px;overflow-y:auto;background:#0d0e10;
          border-radius:8px;padding:10px 14px;
          font-family:'Fira Sans', ui-monospace, Consolas, monospace;
          font-size:11.5px;color:var(--text-soft);line-height:1.7;
          border:1px solid #232528;font-weight:500;
        }
        .log::-webkit-scrollbar { width:6px; }
        .log::-webkit-scrollbar-thumb { background:#33363b; border-radius:3px; }
        .log div { padding:3px 0;border-bottom:1px solid #1a1c1f;word-break:break-word; }
        .log div:last-child { border-bottom:none; }
        .log time { color:#71767e;margin-right:8px; }
        [dir="rtl"] .log time { margin-right:0; margin-left:8px; }
        .log .c-win  { color:#8fd6a8; }
        .log .c-lose { color:#e08080; }
        .log .c-warn { color:#d4a648; }
        .log .c-info { color:#7a8188; padding-left:14px; }
        [dir="rtl"] .log .c-info { padding-left:0; padding-right:14px; }
        .log .c-info time { color:#4a4d55; }

        .footer {
          padding:12px 18px;border-top:1px solid #232528;
          display:flex;justify-content:center;align-items:center;gap:10px;
          background:#0f1013;position:relative;
        }
        .credit {
          position:absolute;right:16px;top:50%;transform:translateY(-50%);
          font-family:'Fira Sans', ui-monospace, monospace;
          font-size:12px;font-weight:600;letter-spacing:.15em;
          color:#b93b2b;text-transform:lowercase;
          pointer-events:none;user-select:none;opacity:.7;
          display:flex;flex-direction:column;align-items:flex-end;gap:1px;line-height:1.2;
        }
        .credit .credit-version {
          font-size:9.5px;font-weight:700;letter-spacing:.2em;
          color:#71767e;text-transform:lowercase;opacity:.85;
        }
        [dir="rtl"] .credit { right:auto; left:16px; align-items:flex-start; }

        .btn {
          padding:9px 22px;border-radius:8px;border:1px solid transparent;
          font-size:12.5px;font-weight:700;cursor:pointer;letter-spacing:.02em;
          transition:.15s;min-width:96px;font-family:'Fira Sans', sans-serif;
        }
        .btn.start {
          background:linear-gradient(135deg,#b93b2b 0%,#7a2418 100%);
          border-color:#e04a3a;color:#ffffff;
          box-shadow:0 0 14px rgba(224,74,58,.5), 0 0 26px rgba(224,74,58,.2);
        }
        .btn.start:hover:not(:disabled) {
          background:linear-gradient(135deg,#e04a3a 0%,#b93b2b 100%);
          transform:translateY(-1px);
          box-shadow:0 0 20px rgba(224,74,58,.8), 0 0 36px rgba(224,74,58,.4);
        }
        .btn.stop {
          background:linear-gradient(135deg,#7a2418 0%,#3a1410 100%);
          border-color:#b93b2b;color:#ffffff;
          box-shadow:0 0 14px rgba(185,59,43,.5), 0 0 26px rgba(185,59,43,.2);
        }
        .btn.stop:hover:not(:disabled) {
          background:linear-gradient(135deg,#b93b2b 0%,#5c1a12 100%);
          transform:translateY(-1px);
          box-shadow:0 0 20px rgba(185,59,43,.8), 0 0 36px rgba(185,59,43,.4);
        }
        .btn.sync { background:#1a1c20;color:#c8cbd0;border-color:#2a2c31; }
        .btn.sync:hover:not(:disabled) { background:#22252a;border-color:#3a3d44;color:#ffffff; }
        .btn:disabled { opacity:.4;cursor:not-allowed;transform:none; }

        .tip {
          display:inline-flex;align-items:center;justify-content:center;
          width:15px;height:15px;border-radius:50%;
          background:#232528;color:#9ba1a9;font-size:9px;font-weight:700;
          cursor:help;margin-left:6px;vertical-align:middle;flex:none;
          border:1px solid #33363b;transition:.15s;
        }
        [dir="rtl"] .tip { margin-left:0; margin-right:6px; }
        .tip:hover { background:#b93b2b;color:#fff;border-color:#b93b2b; }

        .tooltip-popup {
          position:fixed;background:#1a1c20;color:#e8eaed;
          padding:10px 12px;border-radius:8px;
          font-size:12px;font-weight:500;line-height:1.5;
          width:250px;text-align:left;z-index:2147483647;
          border:1px solid #33363b;
          box-shadow:0 8px 24px rgba(0,0,0,.6);
          white-space:normal;pointer-events:none;display:none;
        }
        .tooltip-popup.visible { display:block; }
        .tooltip-popup[dir="rtl"] { text-align:right; }

        .lang-info {
          margin:12px 0 10px;font-size:12px;color:#8a9099;line-height:1.5;
          padding:10px 12px;background:#0f1013;
          border:1px solid #232528;border-radius:8px;
        }
        .lang-label-title {
          display:block;margin-bottom:8px;font-size:11px;font-weight:700;
          letter-spacing:.08em;text-transform:uppercase;color:#71767e;
        }
        .lang-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
        .lang-btn {
          display:flex;align-items:center;gap:10px;
          padding:11px 14px;background:#16181b;color:#d8dade;
          border:1px solid #232528;border-radius:8px;
          cursor:pointer;font-family:'Fira Sans', sans-serif;
          font-size:13px;font-weight:600;transition:.15s;
          width:100%;text-align:left;
        }
        [dir="rtl"] .lang-btn { text-align:right; }
        .lang-btn:hover {
          border-color:#b93b2b;background:#1c1e22;transform:translateY(-1px);
        }
        .lang-btn.active {
          background:linear-gradient(135deg,rgba(185,59,43,.18),rgba(122,36,24,.18));
          border-color:#b93b2b;color:#fff;
          box-shadow:0 0 0 1px rgba(185,59,43,.35), 0 0 14px rgba(185,59,43,.25);
        }
        .lang-btn .lang-flag { font-size:20px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
        .lang-btn .lang-label { flex:1; }
        .lang-btn.active .lang-label::after {
          content:' ✓';color:#4ade80;font-weight:700;margin-left:6px;
        }
      </style>

      <button class="launcher" id="launcher" aria-label="TCB">
        <svg class="launcher-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
          <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z"/>
          <path d="M13 7 L9 13 L12 13 L11 17 L15 11 L12 11 Z" fill="currentColor" stroke="none"/>
        </svg>
        <span class="launcher-led"></span>
      </button>

      <aside class="panel" id="panel">
        <div class="header">
          <h3 data-i18n="panelTitle">Free for UnKnoWnCheaTs - The Crims Helper</h3>
          <button id="close">×</button>
        </div>

        <div class="status" id="status" data-i18n="statusReady">Hazır.</div>

        <div class="stat-grid">
          <div class="stat"><span data-i18n="statPlayer">Oyuncu</span><strong id="u-name">—</strong></div>
          <div class="stat"><span data-i18n="statLevel">Seviye</span><strong id="u-level">—</strong></div>
          <div class="stat"><span data-i18n="statStamina">Enerji</span><strong id="u-stamina">—</strong></div>
          <div class="stat"><span data-i18n="statTickets">Ticket</span><strong id="u-tickets">—</strong></div>
          <div class="stat"><span data-i18n="statHP">HP</span><strong id="u-hp">—</strong></div>
          <div class="stat"><span data-i18n="statRobberyPower">Soygun Gücü</span><strong id="u-robbery">—</strong></div>
          <div class="stat"><span data-i18n="statAssaultPower">Saldırı Gücü</span><strong id="u-assault">—</strong></div>
          <div class="stat"><span data-i18n="statCycle">Döngü</span><strong id="u-cycles">0</strong></div>
        </div>

        <div class="stats-panel" id="stats">
          <div class="stat-item"><span class="label" data-i18n="statsActions">Aksiyon</span><span class="value" id="stats-actions">0</span></div>
          <div class="divider"></div>
          <div class="stat-item"><span class="label" data-i18n="statsCycles">Döngü</span><span class="value" id="stats-cycles">0</span></div>
          <div class="divider"></div>
          <div class="stat-item"><span class="label" data-i18n="statsErrors">Hata</span><span class="value" id="stats-errors">0</span></div>
        </div>

        <div class="runtime-bar">
          <div class="runtime-left">
            <span class="runtime-dot" id="runtime-dot"></span>
            <span class="runtime-label" data-i18n="runtimeLabel">Çalışma Süresi</span>
          </div>
          <span class="runtime-value" id="runtime-timer">00:00:00</span>
        </div>

        <nav class="tabs">
          <button class="active" data-tab="automation" data-i18n="tabAutomation">Otomasyon</button>
          <button data-tab="strategy" data-i18n="tabStrategy">Strateji</button>
          <button data-tab="logs" data-i18n="tabLogs">Loglar</button>
          <button data-tab="combat" data-i18n="tabCombat">Kazançlar</button>
          <button data-tab="languages" data-i18n="tabLanguages">Diller</button>
          <button data-tab="changelog">ChangeLog</button>
        </nav>

        <div class="body">

          <section class="tab active" data-page="automation">
            <div class="section">
              <div class="section-title" data-i18n="secMainRoutine">Ana Rutin</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoRobbery">Otomatik Soygun</span>${tip('Güvenli aralıkta olan en güçlü soygunu otomatik yapar.', 'autoRobberyTip')}</span>
                  <input type="checkbox" id="c-robbery"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoGangRobbery">Çete Soygunu</span>${tip('Aktif çete soygununa davet edildiğinde otomatik katılır ve yürütür.', 'autoGangRobberyTip')}</span>
                  <input type="checkbox" id="c-gang-robbery"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoStamina">Enerji Doldurma</span>${tip('Enerji belirlediğin eşiğin altına düştüğünde otomatik doldurur.', 'autoStaminaTip')}</span>
                  <input type="checkbox" id="c-stamina"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoAssault">AI Bot Savaşı</span>${tip('Gücünün altındaki AI botlarını avlar. HP minimumun altındaysa saldırmaz.', 'autoAssaultTip')}</span>
                  <input type="checkbox" id="c-assault"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoDetox">Detoks</span>${tip('Bağımlılık eşiği aşıldığında otomatik detoks yapar.', 'autoDetoxTip')}</span>
                  <input type="checkbox" id="c-detox"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoLevelUp">Otomatik seviye atlama</span>${tip('Tüm gereksinimler karşılandıktan sonra bir sonraki seviyeyi talep eder.', 'autoLevelUpTip')}</span>
                  <input type="checkbox" id="c-levelup"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoTraining">Eğitim</span>${tip("Suç seviyesi 3'ten itibaren mevcut bir antrenmanı başlatır.", 'autoTrainingTip')}</span>
                  <input type="checkbox" id="c-training"><span class="switch"></span>
                </label>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secTiming">Zamanlama (Ms/Delay)</div>
              <div class="grid2">
                <div class="row full" style="padding:0;background:transparent;border:none;">
                  <div class="preset-row">
                    <button class="preset-btn safe" data-preset="safe" type="button">
                      <span class="preset-title" data-i18n="presetRecommended">Önerilen</span>
                      <span class="preset-sub" data-i18n="presetSlow">Daha yavaş</span>
                    </button>
                    <button class="preset-btn medium" data-preset="medium" type="button">
                      <span class="preset-title" data-i18n="presetMedium">Orta</span>
                      <span class="preset-sub" data-i18n="presetMediumSub">Orta Hızlı</span>
                    </button>
                    <button class="preset-btn fast" data-preset="fast" type="button">
                      <span class="preset-title" data-i18n="presetFast">Hızlı</span>
                      <span class="preset-sub" data-i18n="presetFastSub">Risk</span>
                    </button>
                  </div>
                </div>
                <div class="row">
                  <span><span data-i18n="timingMinDelay">Min. aksiyon gecikmesi (ms)</span>${tip('Soygun/enerji geçişleri arası minimum bekleme. Düşürürsen bot hızlanır ama risk artar.', 'timingMinDelayTip')}</span>
                  <input type="number" id="c-min-delay" min="100" max="60000" step="100">
                </div>
                <div class="row">
                  <span><span data-i18n="timingMaxDelay">Maks. aksiyon gecikmesi (ms)</span>${tip('Soygun/enerji geçişleri arası maksimum bekleme.', 'timingMaxDelayTip')}</span>
                  <input type="number" id="c-max-delay" min="100" max="60000" step="100">
                </div>
                <div class="row">
                  <span><span data-i18n="timingCycleMin">Min. döngü gecikmesi (ms)</span>${tip('İki ana döngü arası minimum bekleme (TaskRunner).', 'timingCycleMinTip')}</span>
                  <input type="number" id="c-cycle-min" min="500" max="120000" step="500">
                </div>
                <div class="row">
                  <span><span data-i18n="timingCycleMax">Maks. döngü gecikmesi (ms)</span>${tip('İki ana döngü arası maksimum bekleme (TaskRunner).', 'timingCycleMaxTip')}</span>
                  <input type="number" id="c-cycle-max" min="500" max="120000" step="500">
                </div>
                <div class="row">
                  <span><span data-i18n="timingActivityMin">Min. aktivite aralığı (ms)</span>${tip('Farklı tür iki aksiyon arasında minimum bekleme. Anti-ban koruması.', 'timingActivityMinTip')}</span>
                  <input type="number" id="c-activity-min" min="0" max="120000" step="250">
                </div>
                <div class="row">
                  <span><span data-i18n="timingActivityMax">Maks. aktivite aralığı (ms)</span>${tip('Farklı tür iki aksiyon arasında maksimum bekleme.', 'timingActivityMaxTip')}</span>
                  <input type="number" id="c-activity-max" min="0" max="120000" step="250">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secInventory">Envanter Otomatik Kullanım</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoHealing">Otomatik eşya kullan</span>${tip('Seçili envanter eşyasını belirlenen tetikleyiciye göre otomatik aktive eder.', 'autoHealingTip')}</span>
                  <input type="checkbox" id="c-healing"><span class="switch"></span>
                </label>
                <div class="row">
                  <span><span data-i18n="healingItem">Eşya</span>${tip('Kullanılacak eşyayı seç. Sync ile güncel listeyi çekebilirsin.', 'healingItemTip')}</span>
                  <select id="c-healing-item"><option value="none" data-i18n="selectNone">Seçilmedi</option></select>
                </div>
                <div class="row full">
                  <span><span data-i18n="healingTrigger">Ne zaman kullanılsın</span>${tip('HP azalınca mı yoksa Soygun veya Saldırı öncesi mi kullanılacağını belirle.', 'healingTriggerTip')}</span>
                  <select id="c-healing-trigger">
                    <option value="low-hp" data-i18n="healingTriggerLowHp">Belirtilen HP Azalınca</option>
                    <option value="before-action" data-i18n="healingTriggerBeforeAction">Soygun veya Saldırı öncesi</option>
                    <option value="both" data-i18n="healingTriggerBoth">Hepsi</option>
                  </select>
                </div>
                <div class="row full">
                  <span><span data-i18n="healingHp">HP eşiği (%)</span>${tip('HP bu yüzdenin altına düşünce eşya kullanılır.', 'healingHpTip')}</span>
                  <input type="number" id="c-healing-hp" min="1" max="100">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secAirport">Havaalanı</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoAirport">Havaalanı</span>${tip('Ulaşan kargoları otomatik toplar.', 'autoAirportTip')}</span>
                  <input type="checkbox" id="c-airport"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="airportAutoBuy">En ucuz kargoyu al</span>${tip('Boş pistlere otomatik en ucuz kargoyu satın alır.', 'airportAutoBuyTip')}</span>
                  <input type="checkbox" id="c-airport-buy"><span class="switch"></span>
                </label>
                <div class="row">
                  <span><span data-i18n="airportMaxCargo">Kargo başına maks. ($)</span>${tip('Tek kargo için ödenecek maksimum nakit.', 'airportMaxCargoTip')}</span>
                  <input type="number" id="c-airport-max-cargo" min="0">
                </div>
                <div class="row">
                  <span><span data-i18n="airportReserve">Alım sonrası rezerv ($)</span>${tip('Bu nakit rezervin altına düşmeyecek şekilde alım yapılır.', 'airportReserveTip')}</span>
                  <input type="number" id="c-airport-reserve" min="0">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secIncome">Gelirler ve Banka</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoCollectHookers">Gelirleri topla</span>${tip('Fahişelerden biriken gelirleri minimum üstüne çıkınca toplar.', 'autoCollectHookersTip')}</span>
                  <input type="checkbox" id="c-hookers"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoFreeDice">Ücretsiz zar at</span>${tip('Sunucunun ücretsiz sunduğu zar hakkını kullanır.', 'autoFreeDiceTip')}</span>
                  <input type="checkbox" id="c-dice"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoBankDeposit">Fazlasını bankaya yatır</span>${tip('Elde tutulan nakit rezervinin üstünü bankaya yatırır.', 'autoBankDepositTip')}</span>
                  <input type="checkbox" id="c-bank"><span class="switch"></span>
                </label>
                <div class="row">
                  <span><span data-i18n="bankReserve">Elde tutulan nakit ($)</span>${tip('Bu tutar elde tutulur, üstü bankaya yatırılır.', 'bankReserveTip')}</span>
                  <input type="number" id="c-bank-reserve" min="0">
                </div>
                <div class="row">
                  <span><span data-i18n="bankMin">Min. yatırım ($)</span>${tip('Bu tutarın altındaki yatırımlar yapılmaz.', 'bankMinTip')}</span>
                  <input type="number" id="c-bank-min" min="0">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secUniversity">Üniversite</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoUniversity">Üniversite</span>${tip('Mevcut derslere otomatik katılır, yoklama verir ve tamamlar.', 'autoUniversityTip')}</span>
                  <input type="checkbox" id="c-university"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="universityAutoEnroll">Otomatik kayıt ol</span>${tip('Boş ders varsa otomatik kayıt olur (ücret ödenebilir).', 'universityAutoEnrollTip')}</span>
                  <input type="checkbox" id="c-university-enroll"><span class="switch"></span>
                </label>
                <div class="row full">
                  <span><span data-i18n="universityPayment">Ödeme yöntemi</span></span>
                  <select id="c-university-payment">
                    <option value="cash" data-i18n="universityPaymentCash">Nakit</option>
                    <option value="credits" data-i18n="universityPaymentCredits">Kredi</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secFactories">Fabrikalar ve Laboratuvar</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoBuildings">Fabrikaları topla</span>${tip('Üretimi hazır fabrikalardan otomatik toplar ve bakım yapar.', 'autoBuildingsTip')}</span>
                  <input type="checkbox" id="c-buildings"><span class="switch"></span>
                </label>
                <label class="row toggle-row">
                  <span><span data-i18n="autoLaboratory">Laboratuvar</span>${tip('Laboratuvar üretim kuyruğunu yönetir, tamamlananları toplar, boş slotlara yeni parti başlatır.', 'autoLaboratoryTip')}</span>
                  <input type="checkbox" id="c-laboratory"><span class="switch"></span>
                </label>
                <label class="row toggle-row full">
                  <span><span data-i18n="autoMaintain">Bakımı otomatik yap</span>${tip('Bakım zamanı gelen fabrikaları tamir eder.', 'autoMaintainTip')}</span>
                  <input type="checkbox" id="c-maintain"><span class="switch"></span>
                </label>
                <div class="row full">
                  <span><span data-i18n="productionQty">Parti başına miktar (0 = maks.)</span>${tip('Bir laboratuvar partisinde kullanılacak bileşen miktarı. 0 = maksimum.', 'productionQtyTip')}</span>
                  <input type="number" id="c-production-qty" min="0">
                </div>
                <div class="row full">
                  <span><span data-i18n="productionComponents">Laboratuvar bileşenleri</span>${tip('Boş bırakılırsa mevcut tüm bileşenler kullanılır. Çoklu seçim desteklenir.', 'productionComponentsHint')}</span>
                  <select id="c-production-drugs" multiple style="width:220px;min-height:60px;"></select>
                </div>
              </div>
            </div>
          </section>

          <section class="tab" data-page="strategy">
            <div class="section">
              <div class="section-title" data-i18n="secRobbery">Soygun</div>
              <div class="grid2">
                <div class="row full">
                  <span><span data-i18n="robberyFilter">Soygun türü</span>${tip('Sadece seçilen türdeki soyguna girer.', 'robberyFilterTip')}</span>
                  <select id="c-robbery-filter">
                    <option value="all" data-i18n="robberyFilterAll">Hepsi</option>
                    <option value="cash_only" data-i18n="robberyFilterCash">Sadece Nakit</option>
                    <option value="stocks" data-i18n="robberyFilterStocks">Hisseler</option>
                    <option value="events" data-i18n="robberyFilterEvents">Olaylar</option>
                    <option value="cash_drugs_and_components" data-i18n="robberyFilterCashDrugs">Nakit ve Uyuşturucular/Bileşenler</option>
                  </select>
                </div>
                <div class="row full">
                  <span><span data-i18n="robberyMargin">Soygun gücünün (%) (Önerilen %100)</span>${tip('Sadece gücünün bu yüzdesine kadar güç isteyen soyguna girer.', 'robberyMarginTip')}</span>
                  <input type="number" id="c-robbery-margin" min="10" max="100">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secStamina">Enerji Toplama</div>
              <div class="grid2">
                <div class="row">
                  <span><span data-i18n="staminaFloor">Altına düşünce doldur (%)</span>${tip('Enerji bu yüzdenin altına düştüğünde otomatik doldurma başlar.', 'staminaFloorTip')}</span>
                  <input type="number" id="c-stamina-floor" min="1" max="99">
                </div>
                <div class="row">
                  <span><span data-i18n="staminaTarget">Hedef enerji (%)</span>${tip('Doldurma işlemi enerjiyi bu yüzdeye kadar yükseltir.', 'staminaTargetTip')}</span>
                  <input type="number" id="c-stamina-target" min="10" max="100">
                </div>
                <div class="row">
                  <span><span data-i18n="ticketTarget">Ticket hedefi</span>${tip('Ticket ile ulaşılacak enerji puanı. 100 enerji = 1 ticket.', 'ticketTargetTip')}</span>
                  <input type="number" id="c-ticket-target" min="100" max="1000" step="100">
                </div>
                <div class="row">
                  <span><span data-i18n="ticketReserve">Minimum ticket rezervi</span>${tip('Bu sayının altına ticket harcanmaz. 0 = sınır yok.', 'ticketReserveTip')}</span>
                  <input type="number" id="c-ticket-reserve" min="0">
                </div>
                <div class="row full">
                  <span><span data-i18n="refillCash">Refil başına nakit limiti ($)</span>${tip('Rave party girişi veya refil için harcanacak maksimum nakit.', 'refillCashTip')}</span>
                  <input type="number" id="c-refill-cash" min="0">
                </div>
                <label class="row toggle-row full">
                  <span><span data-i18n="useTicket">Ticket kullan</span>${tip('Enerji doldururken ticket kullanılsın mı? Kapalıysa sadece rave party kullanılır.', 'useTicketTip')}</span>
                  <input type="checkbox" id="c-use-ticket"><span class="switch"></span>
                </label>
                <label class="row toggle-row full">
                  <span><span data-i18n="unsafeRave">Korumasız halka açık ravelar</span>${tip('Saldırı riski var. Açıksa korumasız ravelara da girebilir.', 'unsafeRaveTip')}</span>
                  <input type="checkbox" id="c-unsafe-rave"><span class="switch"></span>
                </label>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secCombat">Savaş</div>
              <div class="grid2">
                <div class="row">
                  <span><span data-i18n="assaultHp">Minimum HP (%)</span>${tip('HP bu yüzdenin altındaysa bot saldırmaz.', 'assaultHpTip')}</span>
                  <input type="number" id="c-assault-hp" min="1" max="100">
                </div>
                <div class="row">
                  <span><span data-i18n="assaultMargin">Savaş güvenlik (%)</span>${tip('Sadece gücünün bu yüzdesi kadar güçlü botlara saldırır.', 'assaultMarginTip')}</span>
                  <input type="number" id="c-assault-margin" min="10" max="100">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secPrison">Hapishane</div>
              <div class="grid2">
                <label class="row toggle-row">
                  <span><span data-i18n="autoPrisonBribe">Hapisten çık (rüşvet)</span>${tip('Hapiste yakalanırsan sunucunun belirlediği nakit rüşveti öder.', 'autoPrisonBribeTip')}</span>
                  <input type="checkbox" id="c-prison"><span class="switch"></span>
                </label>
                <div class="row">
                  <span><span data-i18n="prisonMax">Maks. rüşvet ($)</span>${tip('Bu tutarın üstündeki rüşvetler ödenmez, bot bekler.', 'prisonMaxTip')}</span>
                  <input type="number" id="c-prison-max" min="0">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secHospital">Hastane</div>
              <div class="grid2">
                <div class="row">
                  <span><span data-i18n="detoxAddiction">Bağımlılık eşiği (%)</span>${tip('Bağımlılık bu yüzdeye ulaşınca detoks yapılır.', 'detoxAddictionTip')}</span>
                  <input type="number" id="c-detox-addiction" min="1" max="100">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secVictimFilters">Kurban Filtreleri</div>
              <div class="grid2">
                <div class="row full">
                  <span><span data-i18n="victimUserBlacklist">Kara Liste (Kullanıcı Adı)</span>${tip('Virgülle ayır. Bu kullanıcı adlarını içeren kurbanlara saldırmaz.', 'victimUserBlacklistTip')}</span>
                  <input type="text" id="c-victim-user-bl" placeholder="user1,user2">
                </div>
                <div class="row full">
                  <span><span data-i18n="victimIdBlacklist">Kara Liste (ID)</span>${tip('Virgülle ayır. Bu ID\'lere sahip kurbanlara saldırmaz.', 'victimIdBlacklistTip')}</span>
                  <input type="text" id="c-victim-id-bl" placeholder="123,456">
                </div>
                <div class="row full">
                  <span><span data-i18n="victimCountryBlacklist">Kara Liste (Ülke)</span>${tip('Virgülle ayır (tr, us). Bu ülkelerdeki kurbanlara saldırmaz.', 'victimCountryBlacklistTip')}</span>
                  <input type="text" id="c-victim-country-bl" placeholder="tr,us">
                </div>
                <div class="row full">
                  <span><span data-i18n="victimUserWhitelist">Beyaz Liste (Kullanıcı Adı)</span>${tip('Dolu ise SADECE bu kullanıcı adlarını içeren kurbanlara saldırır.', 'victimUserWhitelistTip')}</span>
                  <input type="text" id="c-victim-user-wl" placeholder="user1,user2">
                </div>
                <div class="row full">
                  <span><span data-i18n="victimIdWhitelist">Beyaz Liste (ID)</span>${tip('Dolu ise SADECE bu ID\'lere sahip kurbanlara saldırır.', 'victimIdWhitelistTip')}</span>
                  <input type="text" id="c-victim-id-wl" placeholder="123,456">
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secCharacterCriteria">Karakter Bazlı Kriterler</div>
              <div class="grid2">
                <label class="row toggle-row full">
                  <span><span data-i18n="criteriaEnable">Karakter kriterlerini uygula</span>${tip('Açıksa, aşağıdaki karakter sınıfları için tanımlı seviye/saygınlık aralıkları uygulanır.', 'criteriaEnableTip')}</span>
                  <input type="checkbox" id="c-criteria-enable"><span class="switch"></span>
                </label>
                <div class="lang-info" style="grid-column:1 / -1;" data-i18n="criteriaHint">0 = sınır yok. Sadece doldurulan alanlar filtrelenir.</div>
                <div class="criteria-grid" id="criteria-grid"></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title" data-i18n="secInvestigation">Hesap Denetimi</div>
              <div class="grid2">
                <div class="row full">
                  <span data-i18n="investigateHint">Hesabın bot kullanımı nedeniyle soruşturma altında olup olmadığını kontrol et.</span>
                  <button class="btn sync" id="c-investigate" style="min-width:auto;padding:7px 14px;font-size:12px;" data-i18n="investigateBtn">Hesabı Denetle</button>
                </div>
              </div>
            </div>
          </section>

          <section class="tab" data-page="logs" style="height:100%;">
            <div class="section" style="height:100%;display:flex;flex-direction:column;">
              <div class="section-title" data-i18n="logActivity">Aktivite</div>
              <div class="log" id="log"></div>
            </div>
          </section>

          <section class="tab" data-page="combat" style="height:100%;">
            <div class="section" style="height:100%;display:flex;flex-direction:column;">
              <div class="section-title" data-i18n="logCombatTitle">Soygun & Saldırı Kazançları</div>
              <div class="log" id="combat-log"></div>
            </div>
          </section>

          <section class="tab" data-page="languages" style="height:100%;">
            <div class="section">
              <span class="lang-label-title" data-i18n="languageLabel">Dil</span>
              <div class="lang-info" data-i18n="languageInfo">
                Arayüz dilini seçin. Değişiklik anında uygulanır.
              </div>
              <div class="lang-grid" id="lang-grid"></div>
            </div>
          </section>

                    <section class="tab" data-page="changelog" style="height:100%;">
            <div class="section">
              <div class="section-title">Changelog</div>
              <div class="changelog" style="
                background:#0d0e10;border:1px solid #232528;border-radius:8px;
                padding:14px 18px;font-family:'Fira Sans', ui-monospace, Consolas, monospace;
                font-size:12px;color:var(--text-soft);line-height:1.65;
                max-height:calc(85vh - 260px);overflow-y:auto;
              ">
                <div style="font-size:14px;font-weight:800;color:#e04a3a;margin:0 0 8px;">v1.0.2</div>
                <ul style="margin:0 0 18px;padding-left:20px;list-style:disc;">
                  <li><b style="color:#e8eaed;">Robbery safety default changed to 100%</b> — the bot now starts with the safety margin at 100% instead of 90%, so the strongest affordable robbery is picked by default. Older saves still keep their own value; set it manually under Strategy → Robbery if you want to change it.</li>
                  <li><b style="color:#e8eaed;">University</b> — auto joins the active class, gives presence, completes it. Optional auto-enroll with cash or credits.</li>
                  <li><b style="color:#e8eaed;">Factories</b> — auto-collects finished production and performs maintenance when needed.</li>
                  <li><b style="color:#e8eaed;">Laboratory</b> — manages the production queue: collects completed batches and starts new ones with your selected components.</li>
                  <li><b style="color:#e8eaed;">Full translations</b> — all 7 languages (TR, EN, ES, FR, PT, PL, AR) now include the new sections, tooltips, log lines and status messages.</li>
                  <li>Config safely merges older saves missing the new fields.</li>
                </ul>

                <div style="font-size:14px;font-weight:800;color:#d4a648;margin:0 0 8px;">v1.0.1</div>
                <ul style="margin:0 0 18px;padding-left:20px;list-style:disc;">
                  <li>Added 7 languages (TR, EN, ES, FR, PT, PL, AR)</li>
                  <li>Added Victim Filters (blacklist / whitelist by username, ID, country)</li>
                  <li>Added Character-based attack criteria (level / respect ranges per class)</li>
                  <li>Added Account Investigation check + auto-check on Start</li>
                  <li>Safely merges older saved configs missing the new fields</li>
                </ul>

                <div style="font-size:14px;font-weight:800;color:#8fd6a8;margin:0 0 8px;">v1.0.0</div>
                <ul style="margin:0;padding-left:20px;list-style:disc;">
                  <li>Initial release</li>
                </ul>
              </div>
            </div>
          </section>

        </div>

        <div class="footer">
          <button class="btn sync" id="sync" data-i18n="btnSync">Sync</button>
          <button class="btn start" id="toggle" data-i18n="btnStart">Başlat</button>
                    <span class="credit">by aedius<span class="credit-version">v1.0.2</span></span>
        </div>
      </aside>
    `;

    refs = {
      shadow,
      panel: shadow.getElementById('panel'),
      launcher: shadow.getElementById('launcher'),
      logEl: shadow.getElementById('log'),
      combatLogEl: shadow.getElementById('combat-log'),
      statusEl: shadow.getElementById('status'),
      statsActions: shadow.getElementById('stats-actions'),
      statsCycles: shadow.getElementById('stats-cycles'),
      statsErrors: shadow.getElementById('stats-errors'),
      runtimeEl: shadow.getElementById('runtime-timer'),
      runtimeDot: shadow.getElementById('runtime-dot'),
      user: {
        name: shadow.getElementById('u-name'),
        level: shadow.getElementById('u-level'),
        stamina: shadow.getElementById('u-stamina'),
        tickets: shadow.getElementById('u-tickets'),
        hp: shadow.getElementById('u-hp'),
        robbery: shadow.getElementById('u-robbery'),
        assault: shadow.getElementById('u-assault'),
        cycles: shadow.getElementById('u-cycles'),
      },
      itemSelect: shadow.getElementById('c-healing-item'),
      healingTriggerSelect: shadow.getElementById('c-healing-trigger'),
      robberyFilterSelect: shadow.getElementById('c-robbery-filter'),
      toggleBtn: shadow.getElementById('toggle'),
      syncBtn: shadow.getElementById('sync'),
      presetInputs: {
        minDelayMs: shadow.getElementById('c-min-delay'),
        maxDelayMs: shadow.getElementById('c-max-delay'),
        cycleMinMs: shadow.getElementById('c-cycle-min'),
        cycleMaxMs: shadow.getElementById('c-cycle-max'),
      },
      criteriaGrid: shadow.getElementById('criteria-grid'),
      investigateBtn: shadow.getElementById('c-investigate'),
    };

    refs.launcher.addEventListener('click', () => refs.panel.classList.toggle('open'));
    shadow.getElementById('close').addEventListener('click', () => refs.panel.classList.remove('open'));

    refs.toggleBtn.addEventListener('click', () => {
      if (running) stop(); else start();
    });

    refs.syncBtn.addEventListener('click', async () => {
      refs.syncBtn.disabled = true;
      try { await syncStats(); } finally { refs.syncBtn.disabled = false; }
    });

    shadow.querySelectorAll('.tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        shadow.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b === btn));
        shadow.querySelectorAll('.tab').forEach(p => p.classList.toggle('active', p.dataset.page === btn.dataset.tab));
      });
    });

    const bindCheck = (id, key) => {
      const el = shadow.getElementById(id);
      if (!el) return;
      el.checked = !!CONFIG[key];
      el.addEventListener('change', () => {
        CONFIG[key] = el.checked;
        saveConfig();
        log(tf('logSettingChanged', { key, value: el.checked ? t('logToggleOn') : t('logToggleOff') }));
      });
    };
    bindCheck('c-robbery', 'autoRobbery');
    bindCheck('c-gang-robbery', 'autoGangRobbery');
    bindCheck('c-stamina', 'autoStamina');
    bindCheck('c-assault', 'autoAssault');
    bindCheck('c-levelup', 'autoLevelUp');
    bindCheck('c-training', 'autoTraining');
    bindCheck('c-use-ticket', 'useTicketRefill');
    bindCheck('c-unsafe-rave', 'allowUnsafeNightclubs');
    bindCheck('c-detox', 'autoDetox');
    bindCheck('c-prison', 'autoPrisonBribe');
    bindCheck('c-healing', 'autoHealing');
    bindCheck('c-airport', 'autoAirport');
    bindCheck('c-airport-buy', 'airportAutoBuy');
    bindCheck('c-hookers', 'autoCollectHookers');
    bindCheck('c-dice', 'autoFreeDice');
    bindCheck('c-bank', 'autoBankDeposit');
    bindCheck('c-criteria-enable', 'criteriaEnabled');
    bindCheck('c-university', 'autoUniversity');
    bindCheck('c-university-enroll', 'universityAutoEnroll');
    bindCheck('c-buildings', 'autoBuildings');
    bindCheck('c-laboratory', 'autoLaboratory');
    bindCheck('c-maintain', 'autoMaintain');

    refs.itemSelect.addEventListener('change', () => {
      CONFIG.healingId = refs.itemSelect.value || 'none';
      saveConfig();
      log(tf('logItemSelected', { id: CONFIG.healingId }));
    });

    if (refs.healingTriggerSelect) {
      refs.healingTriggerSelect.value = CONFIG.healingTrigger || 'both';
      refs.healingTriggerSelect.addEventListener('change', () => {
        CONFIG.healingTrigger = refs.healingTriggerSelect.value;
        saveConfig();
        log(tf('logTriggerChanged', { v: CONFIG.healingTrigger }));
      });
    }

    if (refs.robberyFilterSelect) {
      refs.robberyFilterSelect.value = CONFIG.robberyFilter || 'all';
      refs.robberyFilterSelect.addEventListener('change', () => {
        CONFIG.robberyFilter = refs.robberyFilterSelect.value;
        saveConfig();
        log(tf('logFilterChanged', { v: CONFIG.robberyFilter }));
      });
    }

    const bindNum = (id, key, toUi = v => v, fromUi = v => v, min = -Infinity, max = Infinity, onChange = null) => {
      const el = shadow.getElementById(id);
      if (!el) return;
      el.value = String(toUi(CONFIG[key]));
      el.addEventListener('change', () => {
        const v = Number(el.value);
        if (!Number.isFinite(v)) return;
        const clamped = Math.max(min, Math.min(max, v));
        el.value = String(clamped);
        CONFIG[key] = fromUi(clamped);
        saveConfig();
        if (onChange) onChange();
      });
    };
    bindNum('c-stamina-floor',  'staminaFloorPct',     v => v,                    v => v, 1, 99);
    bindNum('c-stamina-target', 'staminaTargetPct',    v => v,                    v => v, 10, 100);
    bindNum('c-ticket-target',  'ticketRefillTargetPoints', v => v,               v => v, 100, 1000);
    bindNum('c-ticket-reserve', 'ticketReserve',       v => v,                    v => v, 0, 999999);
    bindNum('c-refill-cash',    'maxNightclubRefillCash', v => v,                 v => v, 0, 99999999);
    bindNum('c-detox-addiction','detoxAtAddiction',    v => v,                    v => v, 1, 100);
    bindNum('c-prison-max',     'prisonMaxCashBribe',  v => v,                    v => v, 0, 99999999);
    bindNum('c-healing-hp',     'healingBelowHpPct',   v => v,                    v => v, 1, 100);
    bindNum('c-airport-max-cargo', 'airportMaxCargoCash', v => v,                 v => v, 0, 999999999);
    bindNum('c-airport-reserve',   'airportCashReserve',  v => v,                 v => v, 0, 999999999);
    bindNum('c-bank-reserve',   'bankCashReserve',     v => v,                    v => v, 0, 999999999);
    bindNum('c-bank-min',       'bankDepositMin',      v => v,                    v => v, 0, 999999999);
    bindNum('c-robbery-margin', 'robberySafetyMargin', v => Math.round(v * 100),  v => v / 100, 10, 100);
    bindNum('c-assault-hp',     'assaultMinHpPct',     v => v,                    v => v, 1, 100);
    bindNum('c-assault-margin', 'assaultSafetyMargin', v => Math.round(v * 100),  v => v / 100, 10, 100);
    bindNum('c-min-delay',      'minDelayMs',          v => v,                    v => v, 100, 60000);
    bindNum('c-max-delay',      'maxDelayMs',          v => v,                    v => v, 100, 60000);
    bindNum('c-cycle-min',      'cycleMinMs',          v => v,                    v => v, 500, 120000);
    bindNum('c-cycle-max',      'cycleMaxMs',          v => v,                    v => v, 500, 120000);
    bindNum('c-activity-min',   'activityMinGapMs',    v => v,                    v => v, 0, 120000,
      () => activity.setGapRange(CONFIG.activityMinGapMs, CONFIG.activityMaxGapMs));
    bindNum('c-activity-max',   'activityMaxGapMs',    v => v,                    v => v, 0, 120000,
      () => activity.setGapRange(CONFIG.activityMinGapMs, CONFIG.activityMaxGapMs));
    bindNum('c-production-qty', 'productionQuantity',  v => v,                    v => v, 0, 999999);

    const uniPaySel = shadow.getElementById('c-university-payment');
    if (uniPaySel) {
      uniPaySel.value = CONFIG.universityPaymentMethod || 'cash';
      uniPaySel.addEventListener('change', () => {
        CONFIG.universityPaymentMethod = uniPaySel.value;
        saveConfig();
      });
    }

    // ===== Kurban Filtreleri (list) =====
    const bindList = (id, key) => {
      const el = shadow.getElementById(id);
      if (!el) return;
      el.value = (CONFIG[key] || []).join(',');
      el.addEventListener('change', () => {
        CONFIG[key] = el.value.split(',').map(s => s.trim()).filter(Boolean);
        saveConfig();
      });
    };
    bindList('c-victim-user-bl',    'victimUsernameBlacklist');
    bindList('c-victim-id-bl',      'victimIdBlacklist');
    bindList('c-victim-country-bl', 'victimCountryBlacklist');
    bindList('c-victim-user-wl',    'victimUsernameWhitelist');
    bindList('c-victim-id-wl',      'victimIdWhitelist');

    // ===== Karakter Kriterleri Grid =====
    const CRITERIA_CHARS = ['BUSINESSMAN', 'BROKER', 'DEALER', 'HITMAN', 'PIMP', 'ROBBER', 'GANGSTER'];
    const criteriaGrid = refs.criteriaGrid;
    if (criteriaGrid) {
      if (!CONFIG.assaultCriteria) CONFIG.assaultCriteria = {};
      let html = '<div class="criteria-header">' +
        '<span data-i18n="criteriaChar">Karakter</span>' +
        '<span data-i18n="criteriaMaxLevel">Maks. Lvl</span>' +
        '<span data-i18n="criteriaMinResp">Min. Saygınlık</span>' +
        '<span data-i18n="criteriaMaxResp">Maks. Saygınlık</span>' +
      '</div>';
      for (const ch of CRITERIA_CHARS) {
        if (!CONFIG.assaultCriteria[ch]) CONFIG.assaultCriteria[ch] = { maxLevel: 0, minRespect: 0, maxRespect: 0 };
        const c = CONFIG.assaultCriteria[ch];
        html += '<div class="criteria-row">' +
          '<span class="criteria-name">' + ch + '</span>' +
          '<input type="number" min="0" data-char="' + ch + '" data-field="maxLevel" value="' + Number(c.maxLevel || 0) + '">' +
          '<input type="number" min="0" data-char="' + ch + '" data-field="minRespect" value="' + Number(c.minRespect || 0) + '">' +
          '<input type="number" min="0" data-char="' + ch + '" data-field="maxRespect" value="' + Number(c.maxRespect || 0) + '">' +
        '</div>';
      }
      criteriaGrid.innerHTML = html;
      criteriaGrid.querySelectorAll('input[data-char]').forEach(inp => {
        inp.addEventListener('change', () => {
          const ch = inp.dataset.char;
          const field = inp.dataset.field;
          const v = Math.max(0, Number(inp.value) || 0);
          inp.value = String(v);
          CONFIG.assaultCriteria[ch][field] = v;
          saveConfig();
        });
      });
    }

    // ===== Hesap Denetimi Butonu =====
    if (refs.investigateBtn) {
      refs.investigateBtn.addEventListener('click', async () => {
        refs.investigateBtn.disabled = true;
        try {
          const found = await checkInvestigation(true);
          if (found) {
            window.alert(t('investigateFound'));
          } else {
            window.alert(t('investigateClean'));
          }
        } finally {
          refs.investigateBtn.disabled = false;
        }
      });
    }

    shadow.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });

    Object.values(refs.presetInputs).forEach(el => {
      if (!el) return;
      el.addEventListener('change', () => {
        setTimeout(highlightPresetButtons, 0);
      });
    });

    highlightPresetButtons();

    syncUi();
    updateStats();

    // ---- Tooltip (RTL uyumlu) ----
    const tipPopup = document.createElement('div');
    tipPopup.className = 'tooltip-popup';
    shadow.appendChild(tipPopup);
    shadow.querySelectorAll('.tip').forEach(tipEl => {
      tipEl.addEventListener('mouseenter', () => {
        tipPopup.textContent = tipEl.getAttribute('data-tip') || '';
        tipPopup.classList.add('visible');
        tipPopup.style.left = '0px';
        tipPopup.style.top = '-9999px';
        const rect = tipEl.getBoundingClientRect();
        const popW = 250;
        const popH = tipPopup.offsetHeight || 60;
        const rtl = isRtl(CONFIG.language || 'tr');

        let left = rect.left + rect.width / 2 - popW / 2;
        left = Math.max(8, Math.min(window.innerWidth - popW - 8, left));

        let top = rect.top - popH - 8;
        if (top < 8) top = rect.bottom + 8;
        if (top + popH > window.innerHeight - 8) top = window.innerHeight - popH - 8;

        tipPopup.setAttribute('dir', rtl ? 'rtl' : 'ltr');
        tipPopup.style.textAlign = rtl ? 'right' : 'left';
        tipPopup.style.left = left + 'px';
        tipPopup.style.top = top + 'px';
      });
      tipEl.addEventListener('mouseleave', () => tipPopup.classList.remove('visible'));
    });

    // ---- Dil butonlarını oluştur ----
    const langGrid = shadow.getElementById('lang-grid');
    if (langGrid) {
      for (const lang of LANGUAGES) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lang-btn';
        btn.dataset.lang = lang.code;
        btn.innerHTML = `<span class="lang-flag">${lang.flag}</span><span class="lang-label">${lang.label}</span>`;
        btn.addEventListener('click', () => {
          CONFIG.language = lang.code;
          saveConfig();
          applyLanguage();
          log(tf('logLangChanged', { name: lang.label }));
        });
        langGrid.appendChild(btn);
      }
    }

    async function loadProductionComponents() {
      const sel = shadow.getElementById('c-production-drugs');
      if (!sel) return;
      try {
        const state = await apiGet('buildings');
        const list = productionComponentOptions(state);
        const current = new Set((CONFIG.productionDrugIds || []).map(Number));
        sel.innerHTML = '';
        for (const c of list) {
          const opt = document.createElement('option');
          opt.value = String(c.drugId);
          opt.textContent = `${c.name} ×${c.available}`;
          opt.selected = current.has(c.drugId);
          sel.appendChild(opt);
        }
        sel.addEventListener('change', () => {
          CONFIG.productionDrugIds = Array.from(sel.selectedOptions).map(o => Number(o.value));
          saveConfig();
        });
      } catch (_) {}
    }
    loadProductionComponents();

    applyLanguage();
    loadActionItems();
  }

  function syncUi() {
    if (!refs.toggleBtn) return;
    if (running) {
      refs.toggleBtn.textContent = t('btnStop');
      refs.toggleBtn.classList.remove('start');
      refs.toggleBtn.classList.add('stop');
    } else {
      refs.toggleBtn.textContent = t('btnStart');
      refs.toggleBtn.classList.remove('stop');
      refs.toggleBtn.classList.add('start');
    }
    refs.launcher.classList.toggle('on', running);
    if (refs.runtimeDot) refs.runtimeDot.classList.toggle('on', running);
  }

  function updateStatus(text, isError = false) {
    if (!refs.statusEl) return;
    refs.statusEl.textContent = text;
    refs.statusEl.classList.toggle('ok', running && !isError);
    refs.statusEl.classList.toggle('err', isError);
  }

  function fmtNum(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return '—';
    return Math.floor(v).toLocaleString('tr-TR');
  }

  function updateUser(user) {
    if (!refs.user || !user) return;
    refs.user.name.textContent = user.username || user.name || '—';
    refs.user.level.textContent = user.level ?? '—';
    const cur = staminaCurrent(user);
    const cap = staminaCapacity(user);
    const pct = staminaPct(user).toFixed(0);
    refs.user.stamina.textContent = `${fmtNum(cur)}/${fmtNum(cap)} (${pct}%)`;
    refs.user.tickets.textContent = fmtNum(user.tickets);
    refs.user.hp.textContent = `${fmtNum(user.hp)}/${fmtNum(user.max_hp)}`;
    refs.user.robbery.textContent = fmtNum(user.single_robbery_power || user.robbery_power);
    refs.user.assault.textContent = fmtNum(user.assault_power);
  }

  function updateStats() {
    if (refs.user?.cycles) refs.user.cycles.textContent = stats.cycles;
    if (refs.statsActions) refs.statsActions.textContent = stats.actions;
    if (refs.statsCycles) refs.statsCycles.textContent = stats.cycles;
    if (refs.statsErrors) refs.statsErrors.textContent = stats.errors;
  }

  function log(msg) {
    console.log('[TCB]', msg);
    if (!refs.logEl) return;
    const t = new Date().toLocaleTimeString('tr-TR');
    const div = document.createElement('div');
    const safe = String(msg).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    div.innerHTML = `<time>${t}</time>${safe}`;
    refs.logEl.appendChild(div);
    refs.logEl.scrollTop = refs.logEl.scrollHeight;
    while (refs.logEl.children.length > 100) refs.logEl.removeChild(refs.logEl.firstChild);
  }

  function logCombat(msg, kind = 'info') {
    console.log('[TCB-Combat]', msg);
    if (!refs.combatLogEl) return;
    const t = new Date().toLocaleTimeString('tr-TR');
    const div = document.createElement('div');
    div.className = 'c-' + kind;
    const safe = String(msg).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    div.innerHTML = `<time>${t}</time>${safe}`;
    refs.combatLogEl.appendChild(div);
    refs.combatLogEl.scrollTop = refs.combatLogEl.scrollHeight;
    while (refs.combatLogEl.children.length > 300) refs.combatLogEl.removeChild(refs.combatLogEl.firstChild);
  }

  try {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg?.type === 'TCB_TOGGLE_PANEL') {
        if (refs?.panel) {
          refs.panel.classList.toggle('open');
        } else {
          try { buildPanel(); refs.panel?.classList.add('open'); } catch (_) {}
        }
      }
    });
  } catch (_) {}

  async function boot() {
    await loadConfig();
    buildPanel();
    applyLanguage();
    log(t('logPanelLoaded'));
    if (CONFIG.enabled) {
      log(t('logAutoStart'));
      setTimeout(() => start(), 3000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();