//This is how we import our images, we specify the folder and the file type. 
//Here the type is .gif and the * means to add any file with the .gif extension
//What we actualy get is a list of paths we can access using the filename
//e.g. this will give the filepath for ideat.gif images["ideate"]
import images from "./images/thumbnails/*.gif";
console.log(images);

// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("taskform");
const tasklist = document.getElementById("tasklist");

//This is for the tags input, we need to initialise the tags input as a Tagify object
const tagsInput = document.getElementById("tags");
const tagify = new Tagify(tagsInput);

//list of options to add to the autocomplete form - these can be as long as you like
const autocompleteOptions = ["Lion", "Tiger", "Elephant", "Giraffe"];

// Get the datalist element and the input element for the autocomplete input section
const datalist = document.getElementById("datalist-options");
const autocompleteInput = document.getElementById("auto-complete");

// Populate the datalist with the options we defined above, the options are appeneded to the datalist
autocompleteOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    datalist.appendChild(optionElement);
});


// Handle form submission, using input values to add new task
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const tagsArray = tagify.value.map((tag) => tag.value); // Extract the tag values
    addTask(
        form.elements.taskName.value,
        form.elements.taskType.value,
        form.elements.taskRate.value,
        form.elements.taskTime.value,
        form.elements.taskClient.value,
        tagsArray,
        form.elements.taskAutocomplete.value
    );
});


// General function for fetching tasks from localStorage and rendering to screen
function displayTasks() {
    // Clear the tasklist <ul> element's content
    tasklist.innerHTML = "";

    // Fetch and parse tasks array from localStorage
    let localTasks = JSON.parse(localStorage.getItem("tasks"));

    // If there are tasks (localStorage item exists)
    if (localTasks !== null) {
        // Loop through all tasks in the array
        localTasks.forEach(function (task) {
            let taskImage = null;
            switch (task.type) {
                case "Concept Ideation":
                    taskImage = images["ideate"];
                    break;
                case "Wireframing":
                    taskImage = images["design"];
                    break;
                case "Application Coding":
                    taskImage = images["code"];
                    break;
                default:
                    break;
            }

            // Create new list item and populate with content (including data attribute for ID)
            let item = document.createElement("li");
            item.setAttribute("data-id", task.id);
            item.innerHTML = `<p><strong>${task.name}</strong><br>${task.type}</p><img src='${taskImage}' width='50'/>`;
            tasklist.appendChild(item);

            // Clear the value of the input once the task has been added to the page
            form.reset();

            // Setup delete button DOM elements
            let delButton = document.createElement("button");
            let delButtonText = document.createTextNode("Delete");
            delButton.appendChild(delButtonText);
            item.appendChild(delButton); // Adds a delete button to every task

            // Listen for when the delete button is clicked
            delButton.addEventListener("click", function (event) {
                // Loop through all the tasks to find the matching ID and remove it from the array
                localTasks.forEach(function (taskArrayElement, taskArrayIndex) {
                    if (taskArrayElement.id == item.getAttribute("data-id")) {
                        localTasks.splice(taskArrayIndex, 1);
                    }
                });

                // Update localStorage with the newly spliced array (converted to a JSON string)
                localStorage.setItem("tasks", JSON.stringify(localTasks));

                item.remove(); // Remove the task item from the page when button clicked
                // Because we used 'let' to define the item, this will always delete the right element
            });
        });
    }
}

// Create a function called 'addTask'
// Give the function input parameters for: name, type, rate, time, client
// Paste your object definition from above in the function
// Replace the property values with the input paramaters
// Add the object to the taskList array

function addTask(name, type, rate, time, client, tags, autocomplete) {
    // Creating the object, directly passing in the input parameters
    let task = {
        name,
        type,
        id: Date.now(),
        date: new Date().toISOString(),
        rate,
        time,
        client,
        tags,
        autocomplete
    };

    // Fetch and parse tasks array from localStorage
    let localTasks = JSON.parse(localStorage.getItem("tasks"));

    // If no tasks exist in local storage, create a new array using the current task
    if (localTasks == null) {
        localTasks = [task];
    } else {
        // Otherwise check to see if a task with the same ID already exists (just in case)
        if (localTasks.find((element) => element.id === task.id)) {
            console.log("Task ID already exists");
        } else {
            // If not, push the new task to the array
            localTasks.push(task);
        }
    }

    // Update localStorage with the array (converted to a JSON string)
    localStorage.setItem("tasks", JSON.stringify(localTasks));

    // Call function to display the tasks on the DOM
    displayTasks();
}

// Call the function with test values for the input paramaters
addTask("Initial Sketches", "Concept Ideation", 50, 5, "Google");
