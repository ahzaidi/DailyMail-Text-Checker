chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ textList: [] }, (result) => {
    if (!result.textList) {
      chrome.storage.sync.set({ textList: [] });
    }
  });
});
