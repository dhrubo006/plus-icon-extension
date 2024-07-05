import React, { useEffect, useState, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import Draggable from 'react-draggable';
import './PlusIcon.css';

const PlusIcon = () => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const clickTimeoutRef = useRef(null);
  const TIME_THRESHOLD = 200; // Time threshold in milliseconds

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

    return () => {
      if (plusIconElement) {
        plusIconElement.removeEventListener('click', captureAndStoreUrl);
      }
    };
  }, [dragging]);

  const handleMouseDown = () => {
    clickTimeoutRef.current = setTimeout(() => {
      setDragging(true);
    }, TIME_THRESHOLD); // Adjust the time threshold as needed
  };

  const handleMouseUp = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      if (!dragging) {
        // This is a click, not a drag
        const plusIconElement = document.getElementById('plus-icon');
        plusIconElement.click();
      }
    }
    setTimeout(() => setDragging(false), 0); // Reset dragging state
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={position}
      onStart={() => setDragging(false)}
      onDrag={handleDrag}
      onStop={() => setDragging(false)}
    >
      <div
        id="plus-icon"
        className="plus-icon"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <FaPlus size={30} color="white" />  {/* Set the icon size and color */}
      </div>
    </Draggable>
  );
};

export default PlusIcon;
