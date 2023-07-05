/*
    NOTES:

    -   This program uses local storage.
    -   The "Checkmark" button operates as a toggle.
    -   In case of a long task text, the text will have a multi-line behavior to maintain responsiveness.

*/


$(document).ready(function() {
    loadTableData(); //load the initial table data when the document is ready

    //when pressing the "Submit" button:
    $('#todoForm').submit(function(event) {
        event.preventDefault(); //prevent the auto-submit
        var task = {
            id: generateUniqueId(), //give the task a unique ID 
            text: $('#newTask').val(), //get the task text from the input field
            completed: false //set the initial completion status to false
        };
        saveData(task); //save the task data to local storage
        $('#newTask').val(''); //clear the input field
        loadTableData(); //refresh the table with updated data
    });

    //when pressing the checkmark button:
    $(document).on('click', '.checkButton', function() {
        var taskId = $(this).data('task-id'); //get the task ID
        toggleTaskCompletion(taskId); //toggle the completion status
    });

    //when pressing the X button:
    $(document).on('click', '.deleteButton', function() {
        var taskId = $(this).data('task-id'); //get the task ID
        deleteTask(taskId); //delete the task
    });
});

//save the task data to local storage:
function saveData(task) {
    var existingData = JSON.parse(localStorage.getItem('todoListData')) || []; //retrieve existing task data
    existingData.push(task); //add the new task to the existing data array
    localStorage.setItem('todoListData', JSON.stringify(existingData)); //store the updated data
}

//delete a task:
function deleteTask(taskId) {
    var existingData = JSON.parse(localStorage.getItem('todoListData')) || []; //retrieve existing task data
    var updatedData = existingData.filter(function(item) {
        return item.id !== taskId; //filter out the task with the specified ID
    });
    localStorage.setItem('todoListData', JSON.stringify(updatedData)); //store the updated data
    loadTableData(); //refresh the table (task list)
}

//toggle completion status:
function toggleTaskCompletion(taskId) {
    var existingData = JSON.parse(localStorage.getItem('todoListData')) || []; //retrieve existing task data from local storage
    for (var i = 0; i < existingData.length; i++) {
        if (existingData[i].id === taskId) { //find the task with the specified ID
            existingData[i].completed = !existingData[i].completed; //toggle the completion status
            break;
        }
    }
    localStorage.setItem('todoListData', JSON.stringify(existingData)); //store the updated data back to local storage
    loadTableData(); //refresh the table with updated data
}

//load or refresh the task list:
function loadTableData() {
    $('#taskList tbody').empty(); //clear the existing table data
    var existingData = JSON.parse(localStorage.getItem('todoListData')) || []; //retrieve existing task data from local storage
    for (var i = 0; i < existingData.length; i++) {
        var checkButton = '<button type="button" data-task-id="' + existingData[i].id + '" class="btn btn-outline-success btn-bold-square checkButton">✓</button>'; //create the check button with the task ID as a data element
        var deleteButton = '<button type="button" data-task-id="' + existingData[i].id + '" class="btn btn-outline-danger btn-bold-square deleteButton ms-2">X</button>'; //create the delete button with the task ID as a data element
        var buttons = '<div class="d-flex justify-content-end">' + checkButton + deleteButton + '</div>'; //container div for the buttons

        var row = '<tr class="box-glow"><td class="align-middle p-3 fs-5';
        if (existingData[i].completed) {
            row += ' completed'; //add the 'completed' class to the task row if it is completed
        }
        row += ' text-wrap text-break">' + existingData[i].text + '</td>'; //create the task row with the task text
        row += '<td class="text-end p-3">' + buttons + '</td>'; //add the buttons to the task row
        row += '</tr>';

        $('#taskList tbody').append(row); //append the task row to the table body
    }
}

//generate a unique ID for a task:
function generateUniqueId() {
    var timestamp = new Date().getTime(); //get the current timestamp in milliseconds
    return '_' + timestamp; //prefix the timestamp with an underscore as a uniqueID
}
