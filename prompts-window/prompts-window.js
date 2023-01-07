
function createSettingsWindow(){

    const settingsDiv = document.createElement("div");
    settingsDiv.classList.add("webchatgpt-settings", "bg-white", "dark:bg-gray-800", "shadow-lg");
    settingsDiv.classList.add("absolute", "top-1/2", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2", "w-1/2", "h-1/2", "hidden");
    settingsDiv.classList.add("border", "rounded");

    const header = document.createElement("header");
    header.classList.add("webchatgpt-settings-header", "py-1", "flex", "items-center", "bg-gray-300", "dark:bg-gray-700", "rounded");
    
    
    const img = document.createElement("img");
    img.classList.add("w-6", "m-2");
    img.src = chrome.runtime.getURL("icons/icon48.png");
    
    const h1 = document.createElement("h1");
    h1.classList.add("text-xl", "font-bold");
    h1.innerText = "Prompts";
    
    header.appendChild(img);
    header.appendChild(h1);
    settingsDiv.appendChild(header);
    
    const flexDiv = document.createElement("div");
    flexDiv.classList.add("flex");
    
    const promptListDiv = document.createElement("div");
    promptListDiv.classList.add("webchatgpt-settings-prompt-list", "w-1/3", "h-full", "overflow-y-auto");
    
    const selectedPromptDiv = document.createElement("div");
    selectedPromptDiv.classList.add("webchatgpt-settings-selected-prompt", "w-2/3", "h-full");
    
    flexDiv.appendChild(promptListDiv);
    flexDiv.appendChild(selectedPromptDiv);
    settingsDiv.appendChild(flexDiv);

    document.body.appendChild(settingsDiv);
    
    makeWindowDraggable(header, settingsDiv);
}

function makeWindowDraggable(header, prompts_window) {

  // make draggable by the header
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  header.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    prompts_window.style.top = (prompts_window.offsetTop - pos2) + "px";
    prompts_window.style.left = (prompts_window.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function toggleSettingsWindow() {
  const settingsWindow = document.querySelector(".webchatgpt-settings");
  if (settingsWindow.classList.contains("hidden")) {
    settingsWindow.classList.remove("hidden");
  } else {
    settingsWindow.classList.add("hidden");
  }
}

createSettingsWindow();

document.addEventListener("DOMContentLoaded", () => {

    // Retrieve prompts from storage
    chrome.storage.sync.get("prompts", (result) => {
      console.log(result);
      const promptListElement = document.querySelector(".webchatgpt-settings-prompt-list");

      // Iterate over the prompts and create list items for them
      for (const [name, text] of Object.entries(result.prompts)) {
        const listItem = document.createElement("div");
        listItem.innerText = name;
        promptListElement.appendChild(listItem);
      }
    });
  });
