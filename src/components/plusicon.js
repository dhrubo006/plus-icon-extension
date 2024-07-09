import React, { useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import Draggable from "react-draggable";
import "./PlusIcon.css";

const PlusIcon = () => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const clickTimeoutRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const TIME_THRESHOLD = 200; // Time threshold in milliseconds

  
  
  //////////////////////////////////////// URL Capture Function ////////////////////////////////////////////////////////////
  
  const captureAndStoreUrl = () => {
    console.log("Plus icon clicked or Add Now clicked");

    // Get the current URL
    const currentUrl = window.location.href;

    // Function to get the favicon URL
    const getFavicon = () => {
      console.log('getFevicon function called')
      let favicon = "";
      const nodeList = document.querySelectorAll('link[rel~="icon"]');
      console.log('noedeList: ', nodeList)
      if (nodeList.length > 0) {
        favicon = nodeList[0].href;
        console.log('favicon: ', favicon)
      }
      return favicon;
    };

    const favicon = getFavicon();

    // Send the URL and favicon to the background script
    chrome.runtime.sendMessage(
      { action: "storeUrl", url: currentUrl, favicon: favicon },
      (response) => {
        console.log("Response:", response);
      }
    );
  };
  //////////////////////////////////////////////XXXXXXXXXXXXXXXXXX//////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////handling mouse function ////////////////////////////////////////////////////////////////////

  const handleMouseDown = () => {
    console.log("Mouse down");
    clickTimeoutRef.current = setTimeout(() => {
      console.log("Set dragging to true");
      setDragging(true);
    }, TIME_THRESHOLD); // Adjust the time threshold as needed
  };

  const handleMouseUp = () => {
    console.log("Mouse up");
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      if (!dragging) {
        // This is a click, not a drag
        console.log("Set show menu to true");
        setShowMenu(prevShowMenu => !prevShowMenu); // Toggle the state
        if (showMenu) {
          document.getElementById("plus-icon-menu").style.display = "block";
        }
        //captureAndStoreUrl();
      }
    }
    setTimeout(() => setDragging(false), 0); // Reset dragging state
  };

  //////////////////////////////////////////////XXXXXXXXXXXXXXXXXXXXXXX////////////////////////////////////////

  
  /////////////////////////////////eVEN lISTENERS CALLING THE THE MOUSE EVENT FUNCTIONS /////////////////////////////
  
  useEffect(() => {
    console.log("PlusIcon component mounted");

    const plusIconElement = document.getElementById("plus-icon");
    if (plusIconElement) {
      console.log("calling mouse up & down from plus icon element");
      plusIconElement.addEventListener("mousedown", handleMouseDown);
      plusIconElement.addEventListener("mouseup", handleMouseUp);
    } else {
      console.error("Plus icon element not found");
    }

    return () => {
      if (plusIconElement) {
        plusIconElement.removeEventListener("mousedown", handleMouseDown);
        plusIconElement.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [dragging]);

  const handleDrag = (e, data) => {
    console.log("Dragging");
    setPosition({ x: data.x, y: data.y });
  };


  ///////////////////////////////////////XXXXXXXXXXXXXXXXXXXXXXXXXXXXX//////////////////////////////////



  


  return (
    <Draggable
      position={position}
      onStart={() => setDragging(false)}
      onDrag={handleDrag}
      onStop={() => setDragging(false)}
    >
      <div id="plus-icon" className="plus-icon">
        <FaPlus size={30} color="white" /> {/* Set the icon size and color */}
        <div
          id="plus-icon-menu"
          className="menu"
          style={{ display: showMenu ? "block" : "none" }}
        >
          <button onClick={captureAndStoreUrl}>Add Now</button>
          <button onClick={() => console.log("Add to Collection clicked")}>
            Add to Collection
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default PlusIcon;
