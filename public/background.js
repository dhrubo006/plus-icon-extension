chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeUrl') {
    chrome.storage.local.get({ urls: [] }, (result) => {
      const urls = result.urls;
      urls.push({ url: message.url, favicon: message.favicon });
      chrome.storage.local.set({ urls }, () => {
        sendResponse({ status: 'success', url: message.url });
      });
    });
    return true; // Indicates that the response will be sent asynchronously
  }

  if (message.action === 'storeUrlInCollection') {
    chrome.storage.local.get({ collections: {} }, (result) => {
      const collections = result.collections;
      if (!collections[message.collection]) {
        collections[message.collection] = [];
      }
      collections[message.collection].push({ url: message.url, favicon: message.favicon });
      chrome.storage.local.set({ collections }, () => {
        sendResponse({ status: 'success', collection: message.collection, url: message.url });
      });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});
