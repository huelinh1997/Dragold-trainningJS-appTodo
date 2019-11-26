// Declare
let input = document.getElementById('newToDo');
let todo = document.getElementById('todo')
let listToDo = document.getElementById('todo-list');

// Event
input.addEventListener('keyup', addNewToDo)
// init
let count = 0; // count todo list

// Function
function addNewToDo(e) {
    let enter = 13  // Enter have ascii 13
    if(e.keyCode === enter) {
        count++;
        renderNewToDo(count);
        if(count == 1) {
            renderCheckBoxAll();
        }
        renderFooter(count);
    }
}

function renderNewToDo(count) {
    let newItem = `<li>
                        <div class="todoItem__wrap">
                            <input class="toggle" type="checkbox" name="check" id="toggle${count}">
                            <label class="desTodo">${input.value}</label>
                            <button class="btn btn--close"></button>
                        </div>
                    </li>`;
    listToDo.insertAdjacentHTML('beforeend', newItem);
    input.value = '';
    // Event when click checkbox
    clickCheckTodo();
}

function renderCheckBoxAll() {
    let content = `<input type="checkbox" id="toggle-all" class="toggle-all">
                <label for="toggle-all"></label>`;
    listToDo.insertAdjacentHTML('beforebegin', content);
    // event when check all
    clickCheckAll();
}

function clickCheckAll() {
    let checkAll = document.getElementById('toggle-all');
    checkAll.addEventListener('click', function () {
        let checkboxes = document.getElementsByName('check');
        length = checkboxes.length;
        for(let i = 0; i < length; i++) {
            checkboxes[i].checked = this.checked;
        }
    });
}

function clickCheckTodo() {
    let completed = 0, active = 0;
    document.getElementById(`toggle${count}`).addEventListener('click', function () {
        if(this.checked) {
            this.parentNode.parentNode.classList.add('completed');  // Add effect when click
            completed++;  // count completed
        } else {
            this.parentNode.parentNode.classList.remove('completed');
        }
        // Check All
        if(isAllBoxChecked()) {
            document.getElementById('toggle-all').checked = true;
        } else {
            document.getElementById('toggle-all').checked = false;
        }

        // Count todo item left
        active = count - completed;
        document.getElementById('todo-count').innerHTML = `${active} item left`
    })
}

function isAllBoxChecked() {
        let checkboxes = document.getElementsByName('check');
        let countChecked = 0;
        for(let item of checkboxes) {
            if(item.checked) countChecked++;
        }
        if(countChecked == checkboxes.length) return true;
        else return false;
}

function renderFooter(count) {
    let footer = `<footer class="footer">
                <span id="todo-count"></span>
                <ul class="filter">
                    <li><a href="#/" id="all">All</a></li><span></span>
                    <li><a href="#/active" id="active">Active</a><span></span>
                    <li><a href="#/completed" id="completed">Completed</a></li><span></span>
                </ul>
                <button class="btn">Clear completed</button>
            </footer>`;
    if(count == 1) {
        todo.insertAdjacentHTML('beforeend', footer);
    }
    let countToDo = document.getElementById('todo-count');
    countToDo.innerHTML = `${count} item left`;
    // declare for filter
    let all = document.getElementById('all');
    let active = document.getElementById('active');
    let completed = document.getElementById('completed');

    all.classList.add('selected');
}
