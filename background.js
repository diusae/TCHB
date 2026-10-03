// background.js — Toolbar ikonuna tıklanınca content script'e mesaj gönderir
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'TCB_TOGGLE_PANEL' }).catch(() => {
    // Content script yüklü değilse (henüz sayfa hazır değilse) sessizce yut
  });
});