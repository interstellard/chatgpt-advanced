let isWebAccessOn = true;
let isProcessing = false;
var numWebResults = 1;
var timePeriod = "";
var region = "";
var textarea;

chrome.storage.sync.get(["num_web_results", "web_access", "region"], (data) => {
    numWebResults = data.num_web_results;
    isWebAccessOn = data.web_access;
    region = data.region || "wt-wt";
});


function showErrorMessage(e) {
    console.info("WebChatGPT error --> API error: ", e);
    var errorDiv = document.createElement("div");
    errorDiv.classList.add("web-chatgpt-error", "absolute", "bottom-0", "right-1", "dark:text-white", "bg-red-500", "p-4", "rounded-lg", "mb-4", "mr-4", "text-sm");
    errorDiv.innerHTML = "<b>An error occurred</b><br>" + e + "<br><br>Check the console for more details.";
    document.body.appendChild(errorDiv);
    setTimeout(() => { errorDiv.remove(); }, 5000);
}

function pasteWebResultsToTextArea(results, query) {
    let counter = 1;
    let formattedResults = "Web search results:\n\n";
    formattedResults = formattedResults + results.reduce((acc, result) => acc += `[${counter++}] "${result.body}"\nSource: ${result.href}\n\n`, "");

    formattedResults = formattedResults + `\nCurrent date: ${new Date().toLocaleDateString()}`;
    formattedResults = formattedResults + `\nInstructions: Using the provided web search results, write a comprehensive reply to the given prompt. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.`;
    formattedResults = formattedResults + `\nPrompt: ${query}`;

    textarea.value = formattedResults;
}

function pressEnter() {
    textarea.focus();
    const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter'
    });
    textarea.dispatchEvent(enterEvent);
}

function onSubmit(event) {
    if (event.shiftKey && event.key === 'Enter') {
        return;
    }

    if ((event.type === "click" || event.key === 'Enter') && isWebAccessOn && !isProcessing) {

        isProcessing = true;

        try {
            let query = textarea.value;
            textarea.value = "";

            query = query.trim();

            if (query === "") {
                isProcessing = false;
                return;
            }

            api_search(query, numWebResults, timePeriod, region)
              .then(results => {
                pasteWebResultsToTextArea(results, query);
                pressEnter();
                isProcessing = false;
              });
        } catch (error) {
            isProcessing = false;
            showErrorMessage(error);
        }
    }
}

function updateTitleAndDescription() {
    const h1_title = document.evaluate("//h1[text()='ChatGPT']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!h1_title) {
        return;
    }

    h1_title.textContent = "WebChatGPT";

    const div = document.createElement("div");
    div.classList.add("w-full", "bg-gray-50", "dark:bg-white/5", "p-6", "rounded-md", "mb-10", "border");
    div.textContent = "With WebChatGPT you can augment your prompts with relevant web search results for better and up-to-date answers.";
    h1_title.parentNode.insertBefore(div, h1_title.nextSibling);

}

function updateUI() {

    if (document.querySelector(".web-chatgpt-toolbar")) {
        return;
    }

    textarea = document.querySelector("textarea");
    if (!textarea) {
        return;
    }
    var textareaWrapper = textarea.parentNode;

    var btnSubmit = textareaWrapper.querySelector("button");

    textarea.addEventListener("keydown", onSubmit);

    btnSubmit.addEventListener("click", onSubmit);


    var toolbarDiv = document.createElement("div");
    toolbarDiv.classList.add("web-chatgpt-toolbar", "flex", "items-baseline", "gap-3", "mt-0");
    toolbarDiv.style.padding = "0em 0.5em";

    // settings button
    settingsBtn = document.createElement("i");
    settingsBtn.classList.add("material-icons", "md-18", "settings", "cursor-pointer", "text-gray-500", "dark:text-white");
    settingsBtn.setAttribute("role", "img");
    settingsBtn.setAttribute("aria-label", "Settings");
    settingsBtn.textContent = "tune";
    settingsBtn.addEventListener("click", () => {
        toggleSettingsWindow();
    });

    // Web access switch
    var toggleWebAccessDiv = document.createElement("div");
    toggleWebAccessDiv.innerHTML = '<label class="web-chatgpt-toggle"><input class="web-chatgpt-toggle-checkbox" type="checkbox"><div class="web-chatgpt-toggle-switch"></div><span class="web-chatgpt-toggle-label">Search on the web</span></label>';
    toggleWebAccessDiv.classList.add("web-chatgpt-toggle-web-access");
    chrome.storage.sync.get("web_access", (data) => {
        toggleWebAccessDiv.querySelector(".web-chatgpt-toggle-checkbox").checked = data.web_access;
    });

    var checkbox = toggleWebAccessDiv.querySelector(".web-chatgpt-toggle-checkbox");
    checkbox.addEventListener("click", () => {
            isWebAccessOn = checkbox.checked;
            chrome.storage.sync.set({ "web_access": checkbox.checked });
        });


    // Number of web results
    var numResultsDropdown = document.createElement("select");
    numResultsDropdown.classList.add("text-sm", "dark:text-white", "ml-0", "dark:bg-gray-800", "border-0");

    for (let i = 1; i <= 10; i++) {
        let optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = i + " result" + (i == 1 ? "" : "s");
        numResultsDropdown.appendChild(optionElement);
    }

    chrome.storage.sync.get("num_web_results", (data) => {
        numResultsDropdown.value = data.num_web_results;
    });

    numResultsDropdown.onchange = function () {
        numWebResults = this.value;
        chrome.storage.sync.set({ "num_web_results": this.value });
    };

    // Time period
    var timePeriodLabel = document.createElement("label");
    timePeriodLabel.innerHTML = "Results from:";
    timePeriodLabel.classList.add("text-sm", "dark:text-white");

    var timePeriodDropdown = document.createElement("select");
    timePeriodDropdown.classList.add("text-sm", "dark:text-white", "ml-0", "dark:bg-gray-800", "border-0");

    var timePeriodOptions = [
        { value: "", label: "Any time" },
        { value: "d", label: "Past day" },
        { value: "w", label: "Past week" },
        { value: "m", label: "Past month" },
        { value: "y", label: "Past year" }
    ];

    timePeriodOptions.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.innerHTML = option.label;
        optionElement.classList.add("text-sm", "dark:text-white");
        timePeriodDropdown.appendChild(optionElement);
    });

    timePeriodDropdown.onchange = function () {
        chrome.storage.sync.set({ "time_period": this.value });
        timePeriod = this.value;
    };

    // Region
    var regionDropdown = document.createElement("select");
    regionDropdown.classList.add("text-sm", "dark:text-white", "ml-0", "dark:bg-gray-800", "border-0");

    fetch(chrome.runtime.getURL('regions.json'))
        .then(function (response) {
        return response.json();
        })
        .then(function (regions) {
        regions.forEach(function (region) {
            var optionElement = document.createElement("option");
            optionElement.value = region.value;
            optionElement.innerHTML = region.label;
            optionElement.classList.add("text-sm", "dark:text-white");
            regionDropdown.appendChild(optionElement);
        });

        regionDropdown.value = region;
        });

    regionDropdown.onchange = function () {
        chrome.storage.sync.set({ "region": this.value });
        region = this.value;
    };

    toolbarDiv.appendChild(settingsBtn);
    toolbarDiv.appendChild(toggleWebAccessDiv);
    toolbarDiv.appendChild(numResultsDropdown);
    toolbarDiv.appendChild(timePeriodDropdown);
    toolbarDiv.appendChild(regionDropdown);

    textareaWrapper.parentNode.insertBefore(toolbarDiv, textareaWrapper.nextSibling);

    toolbarDiv.parentNode.classList.remove("flex");
    toolbarDiv.parentNode.classList.add("flex-col");


    var bottomDiv = document.querySelector("div[class*='absolute bottom-0']");

    var footerDiv = document.createElement("div");

    var extension_version = chrome.runtime.getManifest().version;
    footerDiv.innerHTML = "<a href='https://github.com/qunash/chatgpt-advanced' target='_blank' class='underline'>WebChatGPT extension v." + extension_version + "</a>. If you like the extension, please consider <a href='https://www.buymeacoffee.com/anzorq' target='_blank' class='underline'>supporting me</a>.";

    var lastElement = bottomDiv.lastElementChild;
    lastElement.appendChild(footerDiv);
}

function openSettings() {
    
}

const rootEl = document.querySelector('div[id="__next"]');
window.onload = () => {
   
    updateTitleAndDescription();
    updateUI();

    new MutationObserver(() => {
        try {
            updateTitleAndDescription();
            updateUI();
        } catch (e) {
            console.info("WebChatGPT error --> Could not update UI:\n", e.stack);
        }
    }).observe(rootEl, { childList: true });
};
