chrome.runtime.onMessage.addListener(((r,s,e)=>{if("storeUrl"===r.action)return chrome.storage.local.get({urls:[]},(s=>{const o=s.urls;o.push({url:r.url,favicon:r.favicon}),chrome.storage.local.set({urls:o},(()=>{e({status:"success",url:r.url})}))})),!0}));