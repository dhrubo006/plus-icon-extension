import React, { useEffect, useState } from 'react';

const CollectionManager = ({ onClose }) => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentFavicon, setCurrentFavicon] = useState("");

  useEffect(() => {
    // Fetch collections from Chrome storage
    const fetchCollections = () => {
      console.log("Fetching collections...");
      chrome.storage.local.get({ collections: {} }, (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error fetching collections: ", chrome.runtime.lastError);
        } else {
          const fetchedCollections = result.collections || {};
          setCollections(Object.entries(fetchedCollections));
        }
      });
    };

    fetchCollections();

    // Capture the current URL and favicon
    captureCurrentUrlAndFavicon();
  }, []);

  const captureCurrentUrlAndFavicon = () => {
    const url = window.location.href;
    setCurrentUrl(url);
    console.log('Captured URL: ', url);

    const getFavicon = () => {
      let favicon = "";
      const nodeList = document.querySelectorAll('link[rel~="icon"]');
      if (nodeList.length > 0) {
        favicon = nodeList[0].href;
      }
      return favicon;
    };

    const favicon = getFavicon();
    setCurrentFavicon(favicon);
    console.log('Captured Favicon: ', favicon);
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim() === "") {
      alert("Collection name cannot be empty");
      return;
    }

    const newCollection = {
      name: newCollectionName,
      urls: [{ url: currentUrl, favicon: currentFavicon }], // Save the current URL with favicon in the new collection
    };

    console.log("New collection created:", newCollection); // Console log to verify URL

    // Send the new collection to the background script
    chrome.runtime.sendMessage(
      { action: "storeUrlInCollection", collection: newCollectionName, url: currentUrl, favicon: currentFavicon },
      (response) => {
        if (response && response.status === 'success') {
          console.log("Collection stored successfully");

          // Update the local state
          const updatedCollections = [...collections, [newCollectionName, newCollection.urls]];
          setCollections(updatedCollections);
        } else {
          console.error("Error storing collection");
        }
      }
    );

    setNewCollectionName("");
  };

  const handleAddToExistingCollection = (collectionName) => {
    console.log(`Adding URL: ${currentUrl} to collection: ${collectionName}`); // Console log to verify URL

    // Send the URL to be added to the existing collection to the background script
    chrome.runtime.sendMessage(
      { action: "storeUrlInCollection", collection: collectionName, url: currentUrl, favicon: currentFavicon },
      (response) => {
        if (response && response.status === 'success') {
          console.log(`URL added to collection: ${collectionName}`);

          // Update the local state
          const updatedCollections = collections.map(([name, urls]) => {
            if (name === collectionName) {
              return [name, [...urls, { url: currentUrl, favicon: currentFavicon }]];
            }
            return [name, urls];
          });
          setCollections(updatedCollections);
        } else {
          console.error("Error adding URL to collection");
        }
      }
    );
  };

  return (
    <div className="collection-manager">
      <h3>Collections</h3>
      {collections.length > 0 ? (
        <ul>
          {collections.map(([name, urls], index) => (
            <li key={index} onClick={() => handleAddToExistingCollection(name)}>
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No collections available.</p>
      )}
      <input 
        type="text" 
        value={newCollectionName} 
        onChange={(e) => setNewCollectionName(e.target.value)} 
        placeholder="New collection name" 
      />
      <button onClick={handleCreateCollection}>Create Collection</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CollectionManager;
