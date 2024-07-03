import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Popup.css";
import { FaTrash } from "react-icons/fa";

const Popup = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    chrome.storage.local.get({ urls: [] }, (result) => {
      setUrls(result.urls);
    });
  }, []);

  const handleClearUrls = () => {
    chrome.storage.local.set({ urls: [] }, () => {
      setUrls([]);
    });
  };

  const handleDeleteUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    chrome.storage.local.set({ urls: newUrls }, () => {
      setUrls(newUrls);
    });
  };

  return (
    <div className="popup">
      <h1>Stored URLs</h1>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
            <FaTrash
              className="delete-icon"
              onClick={() => handleDeleteUrl(index)}
            />
          </li>
        ))}
      </ul>
      <button className="clear-button" onClick={handleClearUrls}>
        Clear All URLs
      </button>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("root"));
