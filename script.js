let taskList = [];

if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"));
}

const taskInput = document.querySelector("#txtTaskName");
const clearBtn = document.querySelector("#clearBtn");
const filters = document.querySelectorAll(".filters span");
let editId;
let isEditTask = false;
displayTask("all");

function displayTask(filter) {
    ul = document.getElementById("task-list");
    ul.innerHTML = "";
    if (taskList.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Task list is empty.</p>";
    } else {


        for (let task of taskList) {
            let completed = task.situation == "completed" ? "checked" : "";
            if (filter == task.situation || filter == "all") {

                let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                    <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
                        <li><a onclick='editTask(${task.id}, "${task.taskName}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                    </ul>
                </div>
            </li> `;
                ul.insertAdjacentHTML("afterbegin", li);
            }
            // ul.insertAdjacentHTML("beforeend",li);

        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click", addTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function () {
    if (event.key == "Enter") {
        document.querySelector("#btnAddNewTask").click();
    }
});


for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTask(span.id);
    })
}

//  Pushing new task data to taskList object
function addTask(event) {

    if (taskInput.value !== "") {
        if (!isEditTask) {
            //Adding
            taskList.push({ "id": taskList.length + 1, "taskName": taskInput.value, "situation": "pending" });
        } else {
            // Updating
            for (let task of taskList) {
                if (task.id == editId) {
                    task.taskName = taskInput.value;
                }
                isEditTask = false;
            }
        }

        taskInput.value = "";
        displayTask(document.querySelector("span.active").id);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    } else {
        alert("Please enter a task name");
    }

    event.preventDefault();
}

//  Deleting Task
function deleteTask(id) {
    let deleteId;
    // for(let index in taskList){
    //     if(taskList[index].id == id){
    //         deleteId = index;
    //     }
    // }

    // deleteId = taskList.findIndex(function(task){
    //     return task.id == id;
    // });

    deleteId = taskList.findIndex(task => task.id == id);
    taskList.splice(deleteId, 1);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTask(document.querySelector("span.active").id);
}

// Editing task
function editTask(id, taskName) {
    editId = id;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");
    // console.log(set);


}

// Clear all tasks
clearBtn.addEventListener("click", function () {
    taskList.splice(0, taskList.length);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTask("all");
});

// Updating task list situation status

function updateStatus(selectedTask) {
    // console.log(selectedTask.parentElement.lastElementChild);

    let label = selectedTask.nextElementSibling;
    let situation;
    if (selectedTask.checked) {
        label.classList.add("checked");
        situation = "completed";
    } else {
        label.classList.remove("checked");
        situation = "pending";
    }

    for (let task of taskList) {
        if (task.id == selectedTask.id) {
            task.situation = situation;
        }
    }
    displayTask(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));

    // console.log(taskList);
}