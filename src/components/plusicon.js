import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Draggable from 'react-draggable';
import './PlusIcon.css';

const PlusIcon = () => {
  useEffect(() => {
    console.log('PlusIcon component mounted');

    const captureAndStoreUrl = () => {
      console.log('Plus icon clicked');

      // Get the current URL
      const currentUrl = window.location.href;

      // Function to get the favicon URL
      const getFavicon = () => {
        let favicon = "";
        const nodeList = document.querySelectorAll('link[rel~="icon"]');
        if (nodeList.length > 0) {
          favicon = nodeList[0].href;
        }
        return favicon;
      };

      const favicon = getFavicon();

      // Send the URL and favicon to the background script
      chrome.runtime.sendMessage({ action: 'storeUrl', url: currentUrl, favicon: favicon }, (response) => {
        console.log('Response:', response);
      });
    };

    const plusIconElement = document.getElementById('plus-icon');
    if (plusIconElement) {
      plusIconElement.addEventListener('click', captureAndStoreUrl);
    } else {
      console.error('Plus icon element not found');
    }

  }, []);

  return (
    <Draggable>
      <div id="plus-icon" className="plus-icon">
        <FaPlus size={30} color="white" />  {/* Set the icon size and color */}
      </div>
    </Draggable>
  );
};

export default PlusIcon;
