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


function setTitleAndDescription() {
    const h1_title = document.evaluate("//h1[text()='ChatGPT']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!h1_title) {
        return;
    }

    h1_title.textContent = "Web ChatGPT";

    const div = document.createElement("div");
    div.classList.add("w-full", "bg-gray-50", "dark:bg-white/5", "p-6", "rounded-md", "mb-10", "border");
    div.textContent = "With Web ChatGPT you can augment your prompts with relevant web search results for better and up-to-date answers.";
    h1_title.parentNode.insertBefore(div, h1_title.nextSibling);

}

function showErrorMessage(e) {
    console.log(e);
    var errorDiv = document.createElement("div");
    errorDiv.classList.add("web-chatgpt-error", "absolute", "bottom-0", "right-1", "text-white", "bg-red-500", "p-4", "rounded-lg", "mb-4", "mr-4", "text-sm");
    errorDiv.innerHTML = "<b>An error occurred</b><br>" + e + "<br><br>Check the console for more details.";
    document.body.appendChild(errorDiv);
    setTimeout(() => { errorDiv.remove(); }, 5000);
}

function pasteWebResultsToTextArea(results, query) {
    let counter = 1;
    let formattedResults = "Web search results:\n\n";
    formattedResults = formattedResults + results.reduce((acc, result) => acc += `[${counter++}] "${result.body}"\nSource: ${result.href}\n\n`, "");

    formattedResults = formattedResults + `\nCurrent date: ${new Date().toLocaleDateString()}`;
    formattedResults = formattedResults + `\nInstructions: Using the provided web search results, write a comprehensive reply to the given prompt. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.\nPrompt: ${query}`;

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

function updateUI() {

    if (document.querySelector(".web-chatgpt-options")) {
        return;
    }

    textarea = document.querySelector("textarea");
    var textareaWrapper = textarea.parentNode;

    var btnSubmit = textareaWrapper.querySelector("button");

    textarea.addEventListener("keydown", onSubmit);

    btnSubmit.addEventListener("click", onSubmit);


    var toolbarDiv = document.createElement("div");
    toolbarDiv.classList.add("web-chatgpt-toolbar", "gap-3");
    toolbarDiv.style.padding = "0em 0.5em 0em 0.5em";


    // Web access switch
    var toggleWebAccessDiv = document.createElement("div");
    toggleWebAccessDiv.innerHTML = '<label class="web-chatgpt-toggle"><input class="web-chatgpt-toggle-checkbox" type="checkbox"><div class="web-chatgpt-toggle-switch"></div><span class="web-chatgpt-toggle-label">Search on the web</span></label>';
    toggleWebAccessDiv.classList.add("web-chatgpt-toggle-web-access");
    chrome.storage.sync.get("web_access", (data) => {
        toggleWebAccessDiv.querySelector(".web-chatgpt-toggle-checkbox").checked = data.web_access;
    });
    toolbarDiv.appendChild(toggleWebAccessDiv);


    var checkbox = toggleWebAccessDiv.querySelector(".web-chatgpt-toggle-checkbox");
    checkbox.addEventListener("click", () => {
            isWebAccessOn = checkbox.checked;
            chrome.storage.sync.set({ "web_access": checkbox.checked });
        });

    textareaWrapper.parentNode.insertBefore(toolbarDiv, textareaWrapper);

    var divider = document.createElement("hr");

    var optionsDiv = document.createElement("div");
    optionsDiv.classList.add("web-chatgpt-options", "p-4", "space-y-2");

    var title = document.createElement("h4");
    title.innerHTML = "Web ChatGPT Options";
    title.classList.add("text-white", "pb-4", "text-lg", "font-bold");

    var divNumResultsSlider = document.createElement("div");
    divNumResultsSlider.classList.add("flex", "justify-between");

    var label = document.createElement("label");
    label.innerHTML = "Web results";
    label.classList.add("text-white");

    var value = document.createElement("span");
    chrome.storage.sync.get("num_web_results", (data) => {
        value.innerHTML = data.num_web_results;
    });
    label.appendChild(value);

    divNumResultsSlider.appendChild(label);
    divNumResultsSlider.appendChild(value);

    var numResultsSlider = document.createElement("input");
    numResultsSlider.type = "range";
    numResultsSlider.min = 1;
    numResultsSlider.max = 10;
    numResultsSlider.step = 1;
    chrome.storage.sync.get("num_web_results", (data) => {
        numResultsSlider.value = data.num_web_results;
    });
    numResultsSlider.classList.add("w-full");

    numResultsSlider.oninput = function () {
        numWebResults = this.value;
        value.innerHTML = numWebResults;
        chrome.storage.sync.set({ "num_web_results": this.value });
    };

    var timePeriodLabel = document.createElement("label");
    timePeriodLabel.innerHTML = "Results from:";
    timePeriodLabel.classList.add("text-white");

    var timePeriodDropdown = document.createElement("select");
    timePeriodDropdown.classList.add("text-white", "ml-0", "bg-gray-900", "border", "w-full");

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
        optionElement.classList.add("text-white");
        timePeriodDropdown.appendChild(optionElement);
    });

    timePeriodDropdown.onchange = function () {
        chrome.storage.sync.set({ "time_period": this.value });
        timePeriod = this.value;
    };


    var regionDropdown = document.createElement("select");
    regionDropdown.classList.add("text-white", "ml-0", "bg-gray-900", "border", "w-full");

    fetch(chrome.runtime.getURL('regions.json'))
        .then(function (response) {
        return response.json();
        })
        .then(function (regions) {
        regions.forEach(function (region) {
            var optionElement = document.createElement("option");
            optionElement.value = region.value;
            optionElement.innerHTML = region.label;
            optionElement.classList.add("text-white");
            regionDropdown.appendChild(optionElement);
        });

        regionDropdown.value = region;
        });

    regionDropdown.onchange = function () {
        chrome.storage.sync.set({ "region": this.value });
        region = this.value;
    };

    var emptyDiv = document.createElement("div");
    emptyDiv.classList.add("p-4");

    var supportMe = document.createElement("a");
    supportMe.innerHTML = "Like the extension?<br>Please consider <span class='underline'><a href='https://www.buymeacoffee.com/anzorq' target='_blank'>supporting me</a></span>";
    supportMe.classList.add("text-sm", "text-gray-500");


    optionsDiv.appendChild(title);
    optionsDiv.appendChild(divNumResultsSlider);
    optionsDiv.appendChild(numResultsSlider);
    optionsDiv.appendChild(timePeriodLabel);
    optionsDiv.appendChild(timePeriodDropdown);
    optionsDiv.appendChild(regionDropdown);
    optionsDiv.appendChild(emptyDiv);
    optionsDiv.appendChild(supportMe);

    var navMenu = document.querySelector('nav');
    navMenu.appendChild(divider);
    navMenu.appendChild(optionsDiv);
}

const titleEl = document.querySelector('title');

window.onload = function() {

    const observer = new MutationObserver(() => {
        setTitleAndDescription();
        updateUI();
    });

    observer.observe(titleEl, {
        childList: true
    });
};
