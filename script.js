let isWebAccessOn = true;
let isProcessing = false;
var numWebResults = 1;

chrome.storage.sync.get(["num_web_results", "web_access"], (data) => {
    numWebResults = data.num_web_results;
    isWebAccessOn = data.web_access;
});


window.addEventListener("load", function () {

    try {
        setTitleAndDescription();
    } catch (e) { console.log(e); }
});

function setTitleAndDescription() {
    title = document.evaluate("//h1[text()='ChatGPT']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    console.log(title);
    if (title) {
        title.textContent = "ChatGPT Advanced";
    }

    const div = document.createElement("div");
    div.classList.add("w-full", "bg-gray-50", "dark:bg-white/5", "p-6", "rounded-md", "mb-8", "border");
    div.textContent = "With ChatGPT Advanced you can augment your prompts with relevant web search results for better and up-to-date answers.";
    title.parentNode.insertBefore(div, title.nextSibling);

}

var textarea = document.querySelector("textarea");
var textareaWrapper = textarea.parentNode;

var btnSubmit = textareaWrapper.querySelector("button");

textarea.addEventListener("keydown", onSubmit);
btnSubmit.addEventListener("click", onSubmit);

function onSubmit(event) {
    if (event.shiftKey && event.key === 'Enter') {
        return;
    }

    if ((event.type === "click" || event.key === 'Enter') && isWebAccessOn && !isProcessing) {

        isProcessing = true;

        // showCommandsList(false);

        let query = textarea.value;
        textarea.value = "";

        fetch(`https://ddg-webapp-aagd.vercel.app/search?max_results=${numWebResults}&q=${query}`)
            .then(response => response.json())
            .then(results => {
                // let formattedResults = results.map(result => `"${result.body}"\nSource: ${result.href}`).join("\n\n");
                let counter = 1;
                let formattedResults = results.reduce((acc, result) => acc += `${counter++}. "${result.body}"\nSource: ${result.href}\n\n`, "");

                formattedResults = formattedResults + `\n\nGiven these web results, answer the following question: ${query}`;
                // formattedResults = formattedResults + `\nInstructions: Using the provided web search results, write a comprehensive reply to the given prompt. Cite results when referenced using [[number](URL)] notation. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.\nPrompt: ${query}`;

                textarea.value = formattedResults;

                // simulate pressing enter on the textarea
                textarea.focus();
                const enterEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' });
                textarea.dispatchEvent(enterEvent);

                isProcessing = false;
            });
    }
}


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


var navMenu = document.querySelector('nav');
navMenu.appendChild(divider);
navMenu.appendChild(optionsDiv);
