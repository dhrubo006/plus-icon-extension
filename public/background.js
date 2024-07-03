chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeUrl') {
    chrome.storage.local.get({ urls: [] }, (result) => {
      const urls = result.urls;
      urls.push(message.url);
      chrome.storage.local.set({ urls }, () => {
        sendResponse({ status: 'success', url: message.url });
      });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});
