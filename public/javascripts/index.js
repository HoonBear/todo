let todoList = [];

$(document).ready(function(){
    $.ajax({
        type : "GET",
        url : "http://localhost:3000/getList",
        dataType : "text",
        error : function(){
            alert('통신실패!!');
        },
        success : function(data){
            todoList = JSON.parse(data)
            sortElementsById();
        }  
    });
});


let pageList = new Array();
let currentPage = 1;
let numberPerPage = 5;
let numberOfPages = 0;

function newElement() {
    let inputTitle = document.getElementById('title').value
    let inputDate = document.getElementById('due-date').value
    let todo = '';

    if (inputTitle === '') {
        alert("아무것도 안쓰고 추가하기 금지 ❌ ❌ ❌");
        return;
    } else {
        todo = inputTitle;
        if (inputDate != '') {
            todo = todo + " by " + inputDate
        }
    }
    let newTodoId = findNextId(),
        newTodo = {
            'todo': todo,
            'id': 'todo' + newTodoId
        };

    $.ajax({
        type : "GET",
        url : `http://localhost:3000/postList?id=todo${newTodoId}&todo=${todo}`,
        dataType : "text"
    });

    todoList.push(newTodo);
    sortElementsById();
    clearFields();
}

function fetchIdFromObj(todo) {
    return parseInt(todo.id.slice(4));
}

function findNextId() {
    if (todoList.length === 0) {
        return 0;
    }
    let lastElementId = fetchIdFromObj(todoList[todoList.length - 1]),
        firstElementId = fetchIdFromObj(todoList[0]);
    return (firstElementId >= lastElementId) ? (firstElementId + 1) : (lastElementId + 1);
}

function clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('due-date').value = '';
}

function deleteElement(event) {
    let idOfEltToBeDeleted = event.target.parentElement.id;
    $.ajax({
        type : "GET",
        url : `http://localhost:3000/deleteList?id=${idOfEltToBeDeleted}`,
        dataType : "text"
    });
    let arrayIndex = todoList.findIndex(function (singleTodo) {
        return singleTodo.id === idOfEltToBeDeleted;
    });
    if (arrayIndex !== -1) {
        todoList.splice(arrayIndex, 1);
    }
    load(todoList);
}

function displayOneElement(todoObject) {
    let li_element = document.createElement("li");
    let p_element = document.createElement("p");
    p_element.className = "task-name";
    li_element.appendChild(p_element);
    li_element.setAttribute("id", todoObject.id);
    let text_node = document.createTextNode(todoObject.todo);
    p_element.appendChild(text_node);
    let span_element = document.createElement("SPAN");
    span_element.className = "close";
    let txt_node = document.createTextNode("\u00D7");
    span_element.appendChild(txt_node);
    span_element.onclick = deleteElement;
    li_element.appendChild(span_element);
    document.getElementById("task-list").appendChild(li_element);
}

function sortElementsById() {
    let manyTodos = todoList.sort(function (a, b) {
        let x = fetchIdFromObj(a);
        let y = fetchIdFromObj(b);
        if (x > y) {
            return -1;
        }
        if (x < y) {
            return 1;
        }
        return 0;
    })
    load(manyTodos);
}

function sortElementsByName() {
    let manyTodos = todoList.sort(function (a, b) {
        let x = a.todo.toLowerCase();
        let y = b.todo.toLowerCase();
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    })
    load(manyTodos);
}

function searchInList() {
    let str = document.getElementById('search-text').value.toLowerCase();
    let searchResultList = [];
    for (let j = 0; j < todoList.length; j++) {
        if (todoList[j].todo.toLowerCase().match(str))
            searchResultList.push(todoList[j]);
    }
    load(searchResultList);
}

function getNumberOfPages(manyTodos) {
    return Math.ceil(manyTodos.length / numberPerPage);
}

function gotoPage(event) {
    currentPage = parseInt(event.target.id);
    loadList(todoList);
}

function refreshPaginations() {
    let paginationTarget = document.getElementById('pagination'),
        setActiveClass = false;
    paginationTarget.innerHTML = '';
    for (let i = 1; i <= numberOfPages; i++) {
        let li_element = document.createElement("li"),
            a_element = document.createElement('a');
        if (i === currentPage) {
            li_element.className = 'active';
            setActiveClass = true;
        } else {
            a_element.onclick = gotoPage;
        }
        a_element.setAttribute('id', i);
        a_element.innerHTML = i;
        li_element.appendChild(a_element);
        paginationTarget.appendChild(li_element);
    }
    if (numberOfPages > 0 && setActiveClass === false) {
        currentPage = 1;
        refreshPaginations();
        loadList(todoList);
    }
}

function loadList(manyTodos) {
    let begin = ((currentPage - 1) * numberPerPage);
    let end = begin + numberPerPage;
    pageList = manyTodos.slice(begin, end);
    refreshPaginations();
    drawList(pageList);
}

function drawList(manyTodos) {
    document.getElementById("task-list").innerHTML = "";
    manyTodos.forEach(function (singleTodo) {
        displayOneElement(singleTodo);
    });
}

function load(manyTodos) {
    numberOfPages = getNumberOfPages(manyTodos);
    loadList(manyTodos);
}

window.onload = function () {
    sortElementsById();
}
