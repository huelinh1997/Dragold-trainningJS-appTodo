// Declare
let input = document.getElementById('newToDo');
let todo = document.getElementById('todo')
let listToDo = document.getElementById('todo-list');
// Event
input.addEventListener('keyup', addNewToDo)

// init
let count = 0;     // count to do list
let completed = 0; // count to do list completed
let active = 0;    // count to do list active

// Function
function addNewToDo(e) {
    let enter = 13  // Enter have ascii 13
    if(e.keyCode === enter) {
        count++;
        renderNewToDo(count); // render new todo
        if(count == 1) {      // render when the first new todo is added
            renderCheckBoxAll();
            renderFooter();
        }
        countItemLeft();       // count item left
    }
}

function renderNewToDo(count) {
    let newItem = `<li>
                        <div class="todoItem__wrap">
                            <input class="toggle" type="checkbox" name="check" id="toggle${count}">
                            <label class="desTodo">${input.value}</label>
                            <button class="button button--close" id="delete${count}"></button>
                        </div>
                    </li>`;
    listToDo.insertAdjacentHTML('beforeend', newItem);
    input.value = '';
    // Event when click checkbox
    clickCheckTodo();
    clickDelTodo();
}

function renderCheckBoxAll() {
    let content = `<div id="checkAll"><input type="checkbox" id="toggle-all" class="toggle-all">
    <label for="toggle-all"></label></div>`;
    listToDo.insertAdjacentHTML('beforebegin', content);
    // event when check all
    clickCheckAll();
}

function clickCheckAll() {
    let checkAll = document.getElementById('toggle-all');
    checkAll.addEventListener('click', function () {
        let checkboxes = document.getElementsByName('check');
        let completedBefore = completed;
        length = checkboxes.length;
        for(let i = 0; i < length; i++) {
            checkboxes[i].checked = this.checked;
            addEffectAndCountCompletedWhenCheck(checkboxes[i]);
        }
        if(completedBefore !== 0 && isAllBoxChecked()) {completed = completed - completedBefore;}
        countItemLeft()
    });
}

function clickCheckTodo() {
    let id = count;
    document.getElementById(`toggle${id}`).addEventListener('click', function () {
        // Add effect when check
        addEffectAndCountCompletedWhenCheck(this);

        // Check all to do checked
        if(isAllBoxChecked()) {
            document.getElementById('toggle-all').checked = true;
        } else {
            document.getElementById('toggle-all').checked = false;
        }

        // Add button clear if exist to do completed
        addBtnClearCompleted();

        // Count to do item left
        countItemLeft();
    })
}

function addEffectAndCountCompletedWhenCheck(el) {
    if(el.checked) {
        el.parentNode.parentNode.classList.add('completed');  // Add effect when click
        completed++;  // count completed
    } else {
        el.parentNode.parentNode.classList.remove('completed');
        completed--;
    }
}

function addBtnClearCompleted() {
    let btnClear = document.getElementById('btnClearCompleted');
    if(completed == 1 && !checkElementExist(btnClear)) {
        let content = `<button id="btnClearCompleted" class="button button--clear">Clear completed</button>`;
        document.getElementById('footer').insertAdjacentHTML('beforeend', content);
        document.getElementById('btnClearCompleted').addEventListener('click', deleteTodoCompleted);
    }
    if(completed == 0) {
        btnClear.remove();
    }
}

function checkElementExist(element) {
    //If it isn't "undefined" and it isn't "null", then it exists.
    if(typeof(element) != 'undefined' && element != null){
        return true;
    } else return false;
}

function deleteTodoCompleted() {
    let todos = document.querySelectorAll(`[class*="completed"]`);
    todos.forEach(item => {
        item.remove();
        count--;
    })
    completed = 0;
    removeFooterAndCheckAll();
}

function countItemLeft() {
    console.log('completed',completed);
    active = count - completed;
    document.getElementById('todo-count').innerHTML = `${active} item left`;
}

function clickDelTodo() {
    let id = count;
    document.getElementById(`delete${id}`).addEventListener('click', function () {
        if(document.getElementById(`toggle${id}`).checked) completed--;
        count--;
        this.parentElement.parentElement.remove();
        countItemLeft();
        removeFooterAndCheckAll();

    })
}

function removeFooterAndCheckAll() {
    if(count == 0) {
        document.getElementById('footer').remove();
        document.getElementById('checkAll').remove();
    }
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

function renderFooter() {
    let footer = `<footer class="footer" id="footer">
                <span id="todo-count"></span>
                <ul class="filter">
                    <li><a href="#/" id="all">All</a></li><span></span>
                    <li><a href="#/active" id="active">Active</a><span></span>
                    <li><a href="#/completed" id="completed">Completed</a></li><span></span>
                </ul>
            </footer>`;
        todo.insertAdjacentHTML('beforeend', footer);

    // declare for filter
    let all = document.getElementById('all');
    let active = document.getElementById('active');
    let completed = document.getElementById('completed');

    all.classList.add('selected');
}
