import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Popup.css';

const Popup = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    chrome.storage.local.get({ urls: [] }, (result) => {
      setUrls(result.urls);
    });
  }, []);

  return (
    <div className="popup">
      <h1>Stored URLs</h1>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
