(function () {
    // Define to do object
    function Todo(id, task, hasDone = false) {
        this.id = id;
        this.task = task;
        this.hasDone = hasDone
    }
    // create task arr
    function listToDo() {
        this.list = [];
    }
    // add task
    listToDo.prototype.addTask = function (todo) {
        this.list.push(todo);
    }
    listToDo.prototype.setDataToLocalSotrage = function() {
        localStorage.setItem('listToDo', JSON.stringify(this.list));
    }
    listToDo.prototype.getDataFromLocalStorage = function() {
        let dataString = localStorage.getItem('listToDo');
        if(dataString) {
            this.list = JSON.parse(dataString)
        } else this.list = [];
        return this.list;
    }
    // delete task
    listToDo.prototype.deleteTask = function(id) {
        for(let i = this.list.length - 1; i >= 0; i--) {
            let todo = this.list[i];
            if(todo.id === id) {
                this.list.splice(i, 1);
            }
        }
    }
    // edit task
    listToDo.prototype.editTask = function(id, task) {
        for(let todo of this.list) {
            if(todo.id == id) {
                if(task.trim() !== todo.task) {
                    todo.task = task;
                }
            }
        }
    }
    listToDo.prototype.toggleCheck = function(id) {
        for(let todo of this.list) {
            todo.id == id;
            if(todo.id == id) {
                todo.hasDone = !todo.hasDone;
            }
        }
    }
    // count completed task
    listToDo.prototype.countCompleted = function() {
        let count = 0;
        this.list.forEach(item => {if(item.hasDone) count++})
        return count;
    }
    // delete completed task
    listToDo.prototype.deleteCompletedTask = function() {
        for(let i = this.list.length - 1; i >= 0; i--) {
            let todo = this.list[i];
            if(todo.hasDone) {
                this.list.splice(i, 1);
            }
        }
    }
    // count active task
    listToDo.prototype.countActiveTask = function() {
        let active = 0;
        this.list.forEach(item => {if(!item.hasDone) active++});
        return active;
    }

    listToDo.prototype.countAllTask = function() {
        return this.list.length;
    }
    // filter active task
    listToDo.prototype.filterActiveTask = function() {
        return this.list.filter(item=> !item.hasDone)
    }
    // filter completed task
    listToDo.prototype.filterCommpletedTask  = function() {
        return this.list.filter(item => item.hasDone)
    }
    window.ListToDo = listToDo;
    window.Todo = Todo;
})();

(function () {
    function createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }
    function checkElementExist(element) {
        //If it isn't "undefined" and it isn't "null", then it exists.
        if(typeof(element) != 'undefined' && element != null){
            return true;
        } else return false;
    }
    function SetCaretAtEnd(elem) {
        var elemLen = elem.value.length;
        // For IE Only
        if (document.selection) {
            // Set focus
            elem.focus();
            // Use IE Ranges
            var oSel = document.selection.createRange();
            // Reset position to 0 & then set at end
            oSel.moveStart('character', -elemLen);
            oSel.moveStart('character', elemLen);
            oSel.moveEnd('character', 0);
            oSel.select();
        }
        else if (elem.selectionStart || elem.selectionStart == '0') {
            // Firefox/Chrome
            elem.selectionStart = elemLen;
            elem.selectionEnd = elemLen;
            elem.focus();
        } // if
    } // SetCaretAtEnd()
    function ToDoView() {
        this.self = null;
        this.checked = null;
        this.label = null;
        this.delete = null;
        this.edit = null;
    }
    ToDoView.prototype.renderToDo = function (todo) {
        this.self = createElementFromHTML(`<li data-target="${todo.id}">
                            <div class="todoItem__wrap">
                                <input class="toggle" type="checkbox" name="check" data-target="${todo.id}">
                                <label class="desTodo">${todo.task}</label>
                                <button class="button button--close" id="delete${todo.id}"></button>
                            </div>
                            <input class="edit" value="${todo.task}" >
                        </li>`);
        this.initEventElement();
        // check input if to do done
        if(todo.hasDone) {
            this.checked.checked = true;
            this.addEffectWhenChecked(this.checked);
        }
    }
    ToDoView.prototype.addEffectWhenChecked = function(elInput) {
        if(elInput.checked) {
            elInput.parentElement.parentElement.classList.add('completed');
        } else elInput.parentElement.parentElement.classList.remove('completed');
    }
    ToDoView.prototype.initEventElement = function() {
        this.checked = this.self.querySelector('input');
        this.label = this.self.querySelector('label');
        this.delete = this.self.querySelector('button');
        this.edit = this.self.querySelector('input[class*=edit]');

        this.checked.addEventListener('click', function () {
            let id = this.dataset.target;
            // toggle has done
            listToDo.toggleCheck(id);
            // set data to local storage
            listToDo.setDataToLocalSotrage();

            let status = footerView.getStatusFilterFromLocalStorage();
            if(status === "active" || status === "completed") {
                this.parentElement.parentElement.remove();
            }
            else {
                // add class completed
                todoView.addEffectWhenChecked(this)
            }

            // count item left
            let active = listToDo.countActiveTask();
            // render item left
            footerView.renderItemLeft(active);
            // render btn clear
            footerView.renderBtnClear();

            // Check all to do checked
            if(active === 0) {
                document.getElementById('toggle-all').checked = true;
            } else {
                document.getElementById('toggle-all').checked = false;
            }

        })
        this.label.addEventListener('dblclick', function () {
            todoView.editTask(this);
        })
        this.delete.addEventListener('click', function () {
            let id = this.parentElement.parentElement.dataset.target;
            //remove view
            this.parentElement.parentElement.remove();
            // remove data
            listToDo.deleteTask(parseInt(id));
            listToDo.setDataToLocalSotrage();
            // remove footer view and checkbox all if nothing to do
            let count = listToDo.countAllTask();
            let active = listToDo.countActiveTask();
            console.log('count', count);
            if(count === 0) {
                showView.removeFooterView();  // remove footer view
                wrapList.removeCheckBoxAll()  // remove checkbox all
            }

            // Count the number of items left each time a to do is added
            if(count !== 0) footerView.renderItemLeft(active);
        })
    }
    ToDoView.prototype.getSelfElement = function () {
        return this.self;
    }
    ToDoView.prototype.editTask = function (el) {
        let arr = listToDoView.listView.children;
        console.log(arr);
        for(let item of arr) {
            item.classList.remove('editing')
        }
        el.parentElement.parentElement.classList.add('editing');
        let li = el.parentElement.parentElement;
        let input = li.querySelector('input[class*="edit"]');
        input.focus();
        SetCaretAtEnd(input);
        input.addEventListener('blur', todoView.eventWhenBlur);
        input.addEventListener('keyup', todoView.eventWhenEnter)
    }

    ToDoView.prototype.eventWhenEnter = function (e) {
        if(e.keyCode === ENTER) {
            let id = this.parentElement.dataset.target;
            console.log('id: ',id);
            let newTask = this.value;
            console.log('new task: ', newTask);
            // edit data
            listToDo.editTask(id, newTask);
            // set data edit to local storage
            listToDo.setDataToLocalSotrage();

            let label = document.querySelector('li[class*=editing] label');
            let li = document.querySelector('li[class*=editing]');

            label.innerHTML = newTask;
            li.classList.remove('editing')
        }
    }
    ToDoView.prototype.eventWhenBlur = function () {
        let id = this.parentElement.dataset.target;
        console.log('id: ',id);
        let newTask = this.value;
        console.log('new task: ', newTask);
        // edit data
        listToDo.editTask(id, newTask);
        // set data edit to local storage
        listToDo.setDataToLocalSotrage();

        let label = document.querySelector('li[class*=editing] label');
        let li = document.querySelector('li[class*=editing]');

        label.innerHTML = newTask;
        li.classList.remove('editing')
    }

    function ListToDoView(listView) {
        this.listView = listView;
        this.childView = [];
    }
    ListToDoView.prototype.addToDoView = function (toDoView) {
        let todoViewElement = toDoView.getSelfElement();
        this.listView.appendChild(todoViewElement);
        this.childView.push(toDoView);
    }
    ListToDoView.prototype.removeFilterToDo = function () {
        for(let i = this.listView.children.length -1; i >= 0; i--) {
            this.listView.children[i].remove();
        }
    }

    function WrapListToDo(element) {
        this.self = element;
    }
    WrapListToDo.prototype.addCheckBoxAll = function () {
        let content = createElementFromHTML(`<div id="checkAll"><input type="checkbox" id="toggle-all" class="toggle-all">
                        <label for="toggle-all"></label></div>`);
        this.self.insertBefore(content, this.self.childNodes[0]);
        let checkall = this.self.querySelector('input[id=toggle-all]');
        checkall.addEventListener('click', function () {
            let checkboxes = document.getElementsByName('check');
            length = checkboxes.length;
            for(let i = 0; i < length; i++) {
                if(checkboxes[i].checked != this.checked) {
                    // edit data
                    let id = checkboxes[i].dataset.target;
                    listToDo.toggleCheck(id);
                    // check view
                    checkboxes[i].checked = this.checked;
                    todoView.addEffectWhenChecked(checkboxes[i]);
                }
            }
            // count item left
            let active = listToDo.countActiveTask();
            footerView.renderItemLeft(active)
        })
    }
    WrapListToDo.prototype.removeCheckBoxAll = function () {
        this.self.removeChild(this.self.childNodes[0])
    }

    function FooterView() {
        this.self = null;
        this.filter = null;
        this.all = null;
        this.active = null;
        this.completed = null;
        this.clear = null;
    }
    FooterView.prototype.getSelfElement = function() {
        return this.self;
    }
    FooterView.prototype.renderFooter = function() {
       this.self = createElementFromHTML( `<footer class="footer" id="footer">
                <span id="todoCount"></span>
                <ul class="filter">
                    <li><a href="#/" class="filter__item" id="all">All</a></li>
                    <li><a href="#/active" class="filter__item" id="active">Active</a>
                    <li><a href="#/completed" class="filter__item" id="completed">Completed</a></li>
                </ul>
            </footer>`);
        this.initElement();
    }
    FooterView.prototype.initElement = function() {
        this.filter = this.self.querySelector('.filter');
        this.all = this.self.querySelector('#all');
        this.active = this.self.querySelector('#active');
        this.completed = this.self.querySelector('#completed');
        this.clear = this.self.querySelector('#clear');

        // get status from local storage
        let status = this.getStatusFilterFromLocalStorage();

        // add class selected
        if(status === "completed") {
            this.completed.classList.add('selected');
        } else if(status === "active") {
            this.active.classList.add('selected');
        } else {
            this.all.classList.add('selected');
        }

        // set status filter to local storage
        this.SetStatusFilterToLocalStorage(status);
        // event when click
        this.eventClick();
    }
    FooterView.prototype.getStatusFilterFromLocalStorage = function() {
        let dataString = localStorage.getItem('statusFilter');
        if(dataString) {
            return JSON.parse(dataString);
        } else return 'all';
    }
    FooterView.prototype.SetStatusFilterToLocalStorage = function(status) {
        localStorage.setItem('statusFilter', JSON.stringify(status))
    }

    FooterView.prototype.eventClick = function() {
        let arrFilter = this.filter.querySelectorAll('.filter__item');
        this.filter.addEventListener('click', function (e) {
            arrFilter.forEach(function (item) {
                item.classList.remove('selected');
            });
            if (e.target.id === "all") {
                e.target.classList.add('selected');
                // set status filter to local storage
                console.log('status filter', e.target.id);
                footerView.SetStatusFilterToLocalStorage(e.target.id);
                //localStorage.setItem('statusFilter', JSON.stringify())
                listToDoView.removeFilterToDo(); // remove filter to do
                let allToDoArr = listToDo.list;
                for(let todo of allToDoArr) {
                    todoView.renderToDo(todo);
                    listToDoView.addToDoView(todoView);
                }
            }
            if (e.target.id === "active") {
                e.target.classList.add('selected');
                // set status filter to local storage
                footerView.SetStatusFilterToLocalStorage(e.target.id);
                // remove filter before
                listToDoView.removeFilterToDo();
                let allToDoArr = listToDo.filterActiveTask();
                // add new filter
                for(let todo of allToDoArr) {
                    todoView.renderToDo(todo);
                    listToDoView.addToDoView(todoView);
                }

            }
            if (e.target.id === "completed") {
                e.target.classList.add('selected');
                // set status filter to local storage
                console.log('status filter', e.target.id);
                footerView.SetStatusFilterToLocalStorage(e.target.id);
                //localStorage.setItem('statusFilter', JSON.stringify(e.target.id))
                listToDoView.removeFilterToDo();
                let allToDoArr = listToDo.filterCommpletedTask();
                console.log(allToDoArr);
                for(let todo of allToDoArr) {
                    todoView.renderToDo(todo);
                    listToDoView.addToDoView(todoView);
                }
            }
        })
    }
    FooterView.prototype.renderItemLeft = function (count) {
        let content;
        if(count === 0 || count === 1) content = `${count} item left`;
        else content = `${count} items left`;
        document.getElementById('todoCount').innerHTML = content;
    }
    FooterView.prototype.renderBtnClear = function () {
        let btnClear = document.getElementById('btnClearCompleted');
        let completed = listToDo.countCompleted();
        if(completed >= 1 && !checkElementExist(btnClear)) {
            let content = createElementFromHTML(`<button id="btnClearCompleted" class="button button--clear">Clear completed</button>`);
            this.self.appendChild(content);
            let btnClear = document.getElementById('btnClearCompleted');
            btnClear.addEventListener('click', function () {  // event when click button clear
                let completed = document.querySelectorAll(`[class*="completed"]`);
                completed.forEach(item => {
                    item.remove();
                });
                listToDo.deleteCompletedTask();
                listToDo.setDataToLocalSotrage();
                let count = listToDo.countAllTask();

                // if nothing to do, remove footer & checkbox all
                if(count === 0) {
                    showView.removeFooterView();
                    wrapList.removeCheckBoxAll();
                }
                // remove button when no thing completed
                this.remove()
            });
        }
        // remove button when no thing completed
        if(completed == 0 && checkElementExist(btnClear)) {
            btnClear.remove();
        }
    }

    function ShowView(todoView) {
        this.self = todoView;
    }
    ShowView.prototype.addFooterView = function(footer) {
        let footerEl = footer.getSelfElement();
        this.self.appendChild(footerEl);
    }
    ShowView.prototype.removeFooterView = function() {
        let footerNode = this.self.querySelector('footer');
        this.self.removeChild(footerNode);
    }

    window.ToDoView = ToDoView;
    window.ListToDoView = ListToDoView;
    window.FooterView = FooterView;
    window.ShowView = ShowView;
    window.WrapListToDo = WrapListToDo;
})()

const ENTER = 13;
const elInput = document.getElementById('newToDo');
const elTodo = document.getElementById('todo');
const elListToDo = document.getElementById('todo-list');
const main = document.getElementById('main');

let todoView = new ToDoView();
let listToDoView = new ListToDoView(elListToDo);
let footerView = new FooterView();
let showView = new ShowView(elTodo);
let wrapList = new WrapListToDo(main);

let listToDo = new ListToDo();

// get list to do form local storage
listToDo.getDataFromLocalStorage();

// get status filter from local storage
let statusFilter = footerView.getStatusFilterFromLocalStorage();

// check status filter
let arrFilter = [];
if(statusFilter === "active") {arrFilter = listToDo.filterActiveTask()}
else if(statusFilter === "completed") {arrFilter = listToDo.filterCommpletedTask()}
else {arrFilter = listToDo.list};

// if exist to do, render to do
let count = listToDo.countAllTask();
if(count !== 0) {
    // render to do
    for(let todo of arrFilter) {
        todoView.renderToDo(todo);
        listToDoView.addToDoView(todoView);
    }
    // render footer
    footerView.renderFooter();
    showView.addFooterView(footerView);
    wrapList.addCheckBoxAll();
    let active = listToDo.countActiveTask();
    footerView.renderItemLeft(active)
    footerView.renderBtnClear()
}

// event when enter to do
elInput.addEventListener('keyup', function (e) {
    if(e.keyCode === ENTER) {
        let value = elInput.value.trim();
        if(value !== '') {
            // create and assign value for to do
            let todo = new Todo();
            todo.id = new Date().getTime();
            todo.task = value;

            // add to do into list to do array
            listToDo.addTask(todo);
            listToDo.setDataToLocalSotrage();

            // render footer when the first new to do is added
            let count = listToDo.countAllTask();
            let active = listToDo.countActiveTask();
            if(count === 1) {
                footerView.renderFooter();
                showView.addFooterView(footerView);
                wrapList.addCheckBoxAll();
            }
            footerView.renderItemLeft(active)

            // render to do
            let check = footerView.completed.classList.contains('selected');
            if(!check) {
                todoView.renderToDo(todo);
                listToDoView.addToDoView(todoView);
            }
            elInput.value = '';
        }
    }
})