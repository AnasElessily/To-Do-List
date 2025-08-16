// Getting elements.
const inputField = document.querySelector(".input")
const addButton = document.querySelector(".add")
const tasksContainer = document.querySelector(".tasks")
const progressContainer = document.querySelector(".progress-container")
const totalSpan = document.querySelector(".total")
const completedSpan = document.querySelector(".completed")
const pendingSpan = document.querySelector(".pending")

// Initialize array to hold tasks.
let tasksArray = JSON.parse(localStorage.getItem("Tasks")) || []

// Print tasks if the array is not empty.
if(tasksArray.length > 0){
    progressContainer.style.display = "block";
    tasksArray.forEach(task => appendTaskToContainer(task));
} else{
    renderEmptyState();
    progressContainer.style.display = "none";
}
updateProgress();

// Handle adding tasks button.
addButton.onclick = addTask

// Handle using "Enter" to add tasks.
inputField.addEventListener("keydown", event => {
    if(event.key === "Enter")
        addTask()
})

// Handle all click events in the tasks container.
tasksContainer.addEventListener("click", function(event){

    // Get the task div by its childs.
    const taskElement = event.target.closest(".task")

    // Handle done tasks click.
    if(taskElement && !event.target.classList.contains("del")){
        const taskID = taskElement.dataset.id
        toggleTask(taskID)
        taskElement.classList.toggle("done")
        updateData()
    }

    // Handle deleting tasks button.
    if(event.target.classList.contains("del")){
        const taskID = taskElement.dataset.id

        // Add this class to make animation.
        taskElement.classList.add("fade-out")

        // Start the deleting operation after finishing the animation.
        setTimeout(() => {
            deleteTask(taskID, taskElement)
        }, 300);
    }

    // Handle deleting all button.
    if(event.target.classList.contains("del-all"))
        deleteAllTasks()
})

function addTask(){
    // Make sure the input field is not empty
    if(inputField.value){
        const newTask = {
            id: Date.now(),
            title: inputField.value.trim(),
            completed: false
        }

        tasksArray.push(newTask)
        inputField.value = ""

        if(tasksArray.length == 1){
            tasksContainer.innerHTML = ""
            progressContainer.style.display = "block"
        }

        appendTaskToContainer(newTask)
        updateData()
    }
}

// Add a new task to the page.
function appendTaskToContainer(task){
    const taskDiv = document.createElement("div")
    taskDiv.className = task.completed ? "task done" : "task"
    taskDiv.dataset.id = task.id

    const taskTitle = document.createElement("p")
    taskTitle.textContent = task.title

    const deleteButton = document.createElement("button")
    deleteButton.innerText = "Delete"
    deleteButton.className = "del"

    taskDiv.append(taskTitle, deleteButton)

    const deleteAllBtn = document.querySelector(".del-all");

    if(deleteAllBtn)
        tasksContainer.insertBefore(taskDiv, deleteAllBtn);
    else{
        tasksContainer.appendChild(taskDiv);

        // Create Delete All button.
        if(tasksArray.length > 1)
            createDeleteAllButton();
    }
}

function createDeleteAllButton(){
    const deleteAll = document.createElement("button")
    deleteAll.innerText = "Delete All"
    deleteAll.className = "del-all"
    tasksContainer.appendChild(deleteAll)
}

function renderEmptyState(){
    tasksContainer.innerHTML = ""

    let p = document.createElement("p")
    p.className = "empty"

    let i = document.createElement("i")
    i.className = "fa-solid fa-note-sticky"
    i.style.cssText = "margin-right: 10px"

    p.append(i, "No Tasks Added Yet")
    tasksContainer.append(p)
}

// Handle updating the task status.
function toggleTask(taskID){
    const task = tasksArray.find(t => t.id == taskID)
    task.completed = !task.completed
}

function deleteTask(taskID, taskElement){
    // Delete the clicked task from the array.
    tasksArray = tasksArray.filter(task => task.id != taskID)

    // Remove the element from the page.
    taskElement.remove()

    if (tasksArray.length <= 1) {
        const delAllBtn = document.querySelector(".del-all");
        if (delAllBtn) delAllBtn.remove();
    }

    if (tasksArray.length == 0) {
        renderEmptyState();
        progressContainer.style.display = "none";
    }

    updateData()
}

function deleteAllTasks(){
    tasksArray = []
    tasksContainer.innerHTML = "";
    renderEmptyState();
    updateData()
    progressContainer.style.display = "none";
}

function updateData(){
    updateProgress()
    saveTasks()
}

function saveTasks(){
    localStorage.setItem("Tasks", JSON.stringify(tasksArray))
}

function updateProgress(){
    const allTasks = tasksArray.length
    const completedTasks = tasksArray.filter(ele => ele.completed).length

    totalSpan.textContent = `Total: ${allTasks}`
    completedSpan.textContent = `Completed: ${completedTasks}`
    pendingSpan.textContent = `Pending: ${allTasks - completedTasks}`
}