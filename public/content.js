console.log("content.js loaded"); // First line to verify script is running

window.onload = function () {
  console.log("Window onload event fired"); // Second log to verify window onload

  // Create a container for the React app
  var reactContainer = document.createElement("div");
  reactContainer.id = "react_container";
  document.body.appendChild(reactContainer);
  console.log("React container created and appended to body");

  // Inject the React web app
  var iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("index.html"); // Ensure this path is correct
  iframe.style.position = "fixed";
  iframe.style.bottom = "10px";
  iframe.style.right = "10px";
  iframe.style.width = "50px";
  iframe.style.height = "50px";
  iframe.style.border = "none";
  iframe.style.zIndex = "1000";
  document.getElementById("react_container").appendChild(iframe);
  console.log("Iframe created and appended to react_container");

  // Function to get the favicon URL
  const getFavicon = () => {
    let favicon = "";
    const nodeList = document.querySelectorAll('link[rel~="icon"]');
    if (nodeList.length > 0) {
      favicon = nodeList[0].href;
    }
    return favicon;
  };

  // Listen for messages from the iframe
  window.addEventListener("message", function (event) {
    console.log("Received message:", event.data);
    if (event.data.action === "storeUrl") {
      const currentUrl = window.location.href;
      const favicon = getFavicon();
      chrome.runtime.sendMessage(
        { action: "storeUrl", url: currentUrl, favicon: favicon },
        (response) => {
          console.log("Response:", response);
        }
      );
    }
  });

  iframe.onload = function () {
    console.log("Iframe loaded");
    iframe.contentWindow.postMessage(
      { action: "addPlusIconClickListener" },
      "*"
    );
  };
};
