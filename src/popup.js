import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./Popup.css";
import { FaTrash } from "react-icons/fa";
import extensionIcon from "../public/icons/icon128.png";

const Popup = () => {
  const [urls, setUrls] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch URLs from Chrome storage
    chrome.storage.local.get({ urls: [], collections: {} }, (result) => {
      setUrls(result.urls);
      setCollections(Object.entries(result.collections || {}));
    });
  }, []);

  const handleClearUrls = () => {
    chrome.storage.local.set({ urls: [] }, () => {
      setUrls([]);
    });
  };


  const handleClearCollections = () => {
    chrome.storage.local.set({ collections: {} }, () => {
      setCollections([]);
    });
  };

  const handleDeleteUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    chrome.storage.local.set({ urls: newUrls }, () => {
      setUrls(newUrls);
    });
  };

  const handleDeleteCollection = (collectionName) => {
    chrome.storage.local.get({ collections: {} }, (result) => {
      const collections = result.collections || {};
      delete collections[collectionName];
      chrome.storage.local.set({ collections }, () => {
        setCollections(Object.entries(collections));
      });
    });
  };

  const handleDeleteUrlFromCollection = (collectionName, urlIndex) => {
    chrome.storage.local.get({ collections: {} }, (result) => {
      const collections = result.collections || {};
      if (collections[collectionName]) {
        collections[collectionName].splice(urlIndex, 1);
        if (collections[collectionName].length === 0) {
          delete collections[collectionName];
        }
        chrome.storage.local.set({ collections }, () => {
          setCollections(Object.entries(collections));
        });
      }
    });
  };

  return (
    <div className="popup">
      <h1>
        <img
          src={extensionIcon}
          alt="Extension Icon"
          className="extension-icon"
        />
        URL List
      </h1>

      <h2>Individual URLs</h2>
      <ul>
        {urls.map((item, index) => (
          <li key={index}>
            <img src={item.favicon} alt="Favicon" className="favicon" />
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
            <FaTrash
              className="delete-icon"
              onClick={() => handleDeleteUrl(index)}
            />
          </li>
        ))}
      </ul>
      

      <h2>Collections</h2>
      <ul>
        {collections.map(([name, urls], collectionIndex) => (
          <li key={collectionIndex}>
            <strong className="collection-name">{name}</strong>
            <FaTrash
              className="delete-icon"
              onClick={() => handleDeleteCollection(name)}
            />
            <ul>
              {urls.map((item, urlIndex) => (
                <li key={urlIndex}>
                  <img src={item.favicon} alt="Favicon" className="favicon" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                  <FaTrash
                    className="delete-icon"
                    onClick={() =>
                      handleDeleteUrlFromCollection(name, urlIndex)
                    }
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button className="clear-button" onClick={handleClearUrls}>
        Clear All URLs
      </button>
      <button className="clear-button" onClick={handleClearCollections}>
        Clear All Collections
      </button>
    </div>
  );
};

// Updated to use createRoot
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<Popup />);
