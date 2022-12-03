// Define the commands and their descriptions
var commands = {
    "help": "Show help and available commands",
    "status": "Set your custom status",
    "mention": "Mention a specific user or group"
};

// Target the textarea on the ChatGPT website
var textarea = document.querySelector("textarea");

// Target the div that wraps the textarea
var textareaWrapper = document.querySelector("[class^='PromptTextarea__TextareaWrapper']");

// Create the div that will hold the list of available commands
var commandDiv = document.createElement("div");
commandDiv.id = "command-options";

// Create the list of available commands
var list = document.createElement("ul");
list.id = "command-list";

// Function to show/hide the list of commands
function showCommandsList(show) {
    if (show) {
        // Get the user's input
        var value = textarea.value;

        // Generate the list of available commands
        list.innerHTML = "";
        for (var command in commands) {
            // Filter the commands to only show those that match the user's input
            if (command.startsWith(value.slice(1))) {
                var item = document.createElement("li");
                item.textContent = "/" + command + " - " + commands[command];
                item.addEventListener("click", function (event) {
                    textarea.value = event.target.textContent.split(" - ")[0];
                    showCommandsList(false);
                });
                list.appendChild(item);
            }
        }
    }
    commandDiv.style.display = show ? "block" : "none";
}

// Listen for user input in the textarea
textarea.addEventListener("input", function (event) {
    // Get the user's input
    var value = event.target.value;

    // if it starts with a slash, or a slash followed by a part of a command in the list, show the list
    if (value === "/" || value.startsWith("/") && Object.keys(commands).some(function (command) {
        return command.startsWith(value.slice(1));
    })) {
        showCommandsList(true);
    } else {
        // Hide the list of commands
        showCommandsList(false);
    }
});

// Add the command div and the list of commands to the page
commandDiv.appendChild(list);
textareaWrapper.parentNode.insertBefore(commandDiv, textareaWrapper);
