import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Popup.css";
import { FaTrash } from "react-icons/fa";
import extensionIcon from "../public/icons/icon128.png";

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
      <h1>
        <img
          src={extensionIcon}
          alt="Extension Icon"
          className="extension-icon"
        />
        URL List
      </h1>

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
      <button className="clear-button" onClick={handleClearUrls}>
        Clear All URLs
      </button>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("root"));
