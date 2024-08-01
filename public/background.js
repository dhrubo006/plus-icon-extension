chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeUrl') {
    chrome.storage.local.get({ urls: [] }, (result) => {
      const urls = result.urls;
      const newUrlData = { url: message.url, favicon: message.favicon };
      urls.push(newUrlData);
      chrome.storage.local.set({ urls }, () => {
        sendToFlaskBackend(newUrlData);
        sendResponse({ status: 'success', url: message.url });
      });
    });
    return true; // Indicates that the response will be sent asynchronously
  }

  if (message.action === 'storeUrlInCollection') {
    chrome.storage.local.get({ collections: {} }, (result) => {
      const collections = result.collections || {};
      if (!collections[message.collection]) {
        collections[message.collection] = [];
      }
      const newCollectionData = { url: message.url, favicon: message.favicon };
      collections[message.collection].push(newCollectionData);
      chrome.storage.local.set({ collections }, () => {
        sendToFlaskBackend({ collection: message.collection, ...newCollectionData });
        sendResponse({ status: 'success', collection: message.collection, url: message.url });
      });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

function sendToFlaskBackend(data) {
  fetch('http://localhost:5000/store_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
