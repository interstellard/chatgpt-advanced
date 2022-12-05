let isWebAccessOn = true;
let isProcessing = false;
var numWebResults = 1;

chrome.storage.sync.get(["num_web_results", "web_access"], (data) => {
    numWebResults = data.num_web_results;
    isWebAccessOn = data.web_access;
});


window.addEventListener("load", function () {

    const threadLayout = document.querySelector("[class^='ThreadLayout__NodeWrapper']");
    try {
        setTitle();
        addCapabilitiesDescription();
    } catch (e) { console.log(e); }

    threadLayout.addEventListener("DOMNodeInserted", (event) => {
        try {
            if (event.target.classList[0].startsWith("shared__Wrapper")) {
                setTitle();
                addCapabilitiesDescription();
            }

            if (event.target.classList[0].startsWith("ConversationItem__ActionButtons")) {
                addCopyButton(event.target);
            }
        } catch (e) { console.log(e); }
    });
});

function setTitle() {
    const title = document.querySelector("[class^='shared__Title']");
    if (title) {
        title.textContent = "ChatGPT Advanced";
    }
}

function addCapabilitiesDescription() {

    addListItem("Advanced: Copy generated messages to clipboard");
    addListItem("Advanced: Augment your prompts with web search results");

    function addListItem(text) {
        const capability = document.querySelectorAll("[class^='shared__Capability']")[1];
        const listItem = capability.querySelector("[class^='shared__ListItem']");
        const li = document.createElement("li");
        li.className = listItem.className;
        li.style.borderWidth = "1px";
        li.textContent = text;
        // add it to the list as the first item:
        listItem.parentNode.insertBefore(li, listItem.parentNode.firstChild);
    }
}


function addCopyButton(actionButtons) {
    actionButtons.style.flexDirection = "column";
    actionButtons.style.alignItems = "center";

    const copyButton = document.createElement("button");
    const svgCopy = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
    const svgDone = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>'

    copyButton.innerHTML = svgCopy;
    copyButton.classList.add("copy-button");

    copyButton.addEventListener("click", () => {
        const message = actionButtons.parentElement.textContent;
        navigator.clipboard.writeText(message);

        copyButton.innerHTML = svgDone;
        setTimeout(() => {
            copyButton.innerHTML = svgCopy;
        }, 2500);

    });
    actionButtons.appendChild(copyButton);
}


var textareaWrapper = document.querySelector("[class^='PromptTextarea__TextareaWrapper']");
var textarea = document.querySelector("textarea");

textarea.addEventListener("keydown", function (event) {
    if (event.key === 'Enter' && isWebAccessOn && !isProcessing) {

        isProcessing = true;

        // showCommandsList(false);

        let query = textarea.value;
        textarea.value = "";

        fetch(`https://ddg-webapp-aagd.vercel.app/search?max_results=${numWebResults}&q=${query}`)
            .then(response => response.json())
            .then(results => {
                let formattedResults = results.map(result => `"${result.body}"\nSource: ${result.href}`).join("\n\n");

                formattedResults = formattedResults + `\n\nGiven these web results, answer the following question: ${query}`;

                textarea.value = formattedResults;

                // simulate pressing enter on the textarea
                textarea.focus();
                const enterEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' });
                textarea.dispatchEvent(enterEvent);

                isProcessing = false;
            });
    }
});


var toolbarDiv = document.createElement("div");
toolbarDiv.classList.add("chatgpt-adv-toolbar", "gap-3");
toolbarDiv.style.padding = "0em 0.5em 0em 0.5em";


// Web access switch
var toggleWebAccessDiv = document.createElement("div");
toggleWebAccessDiv.innerHTML = '<label class="chatgpt-adv-toggle"><input class="chatgpt-adv-toggle-checkbox" type="checkbox"><div class="chatgpt-adv-toggle-switch"></div><span class="chatgpt-adv-toggle-label">Search on the web</span></label>';
toggleWebAccessDiv.classList.add("chatgpt-adv-toggle-web-access");
chrome.storage.sync.get("web_access", (data) => {
    toggleWebAccessDiv.querySelector(".chatgpt-adv-toggle-checkbox").checked = data.web_access;
});
toolbarDiv.appendChild(toggleWebAccessDiv);


var checkbox = toggleWebAccessDiv.querySelector(".chatgpt-adv-toggle-checkbox");
checkbox.addEventListener("click", function () {
    isWebAccessOn = checkbox.checked;
    chrome.storage.sync.set({ "web_access": checkbox.checked });
});

// reset thread button
var resetButton = document.createElement("button");
resetButton.className = "chatgpt-adv-reset-button btn flex gap-2 justify-center btn-neutral";
resetButton.style.padding = "0.5em";
resetButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>Reset Thread';
toolbarDiv.appendChild(resetButton);

resetButton.addEventListener("click", () => {
    const anchors = document.querySelectorAll('a');

    let resetThreadAnchor = Array.from(anchors).find(anchor => anchor.innerText === 'Reset Thread');

    const mouseEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
    resetThreadAnchor.dispatchEvent(mouseEvent);
    textarea.focus();
});

textareaWrapper.parentNode.insertBefore(toolbarDiv, textareaWrapper);

var divider = document.createElement("hr");

var optionsDiv = document.createElement("div");
optionsDiv.classList.add("p-4", "space-y-2");

var title = document.createElement("h4");
title.innerHTML = "Advanced Options";
title.classList.add("pb-4", "text-lg", "font-bold");

var labelDiv = document.createElement("div");
labelDiv.classList.add("flex", "justify-between");

var label = document.createElement("label");
label.innerHTML = "Web results";

var value = document.createElement("span");
chrome.storage.sync.get("num_web_results", (data) => {
    value.innerHTML = data.num_web_results;
});
label.appendChild(value);

labelDiv.appendChild(label);
labelDiv.appendChild(value);

var numWebResultsSlider = document.createElement("input");
numWebResultsSlider.type = "range";
numWebResultsSlider.min = 1;
numWebResultsSlider.max = 10;
numWebResultsSlider.step = 1;
chrome.storage.sync.get("num_web_results", (data) => {
    numWebResultsSlider.value = data.num_web_results;
});
numWebResultsSlider.classList.add("w-full");

numWebResultsSlider.oninput = function () {
    numWebResults = this.value;
    value.innerHTML = numWebResults;
    chrome.storage.sync.set({ "num_web_results": this.value });
};

optionsDiv.appendChild(title);
optionsDiv.appendChild(labelDiv);
optionsDiv.appendChild(numWebResultsSlider);


var navMenuItem = document.querySelector('[class^="Navigation__NavMenuItem"]');
var navMenu = navMenuItem.parentNode;
navMenu.appendChild(divider);
navMenu.appendChild(optionsDiv);
