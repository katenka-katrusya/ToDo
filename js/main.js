// находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// добавление задачи
form.addEventListener('submit', addTask);

// удаление задачи
tasksList.addEventListener('click', deleteTask);

// отмечаем задачу завершённой
tasksList.addEventListener('click', doneTask);

let tasks = [];

// если что-то есть в localStorage,то парсим и записываем в массив
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    // рендерим то, что в массиве
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

function addTask(event) {
    // отменяем отправку формы
    event.preventDefault();

    // достаём текст задачи из поля ввода
    const taskText = taskInput.value;

    const newTask = {
        // можно сделать нормальный айдишник, но этот тоже прикольный
        id: Date.now(),
        text: taskText.trim(),
        done: false,
    };

    // добавляем объект (задачу) в массив
    tasks.push(newTask);

    // очищаем поле ввода и возвращаем на него фокус
    taskInput.value = '';
    taskInput.focus();

    renderTask(newTask);
    checkEmptyList();
    // сохраняем список задач в хранилище браузера localStorage при загрузке и потом в других функциях
    saveToLocalStorage();
}

function deleteTask(event) {

    // проверяем, если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    // а если клик был по кнопке "удалить задачу"
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи и переводим строку в число для последующего сравнения
    const id = +parentNode.id;

    // способ 1
    // // находим индекс задачи в массиве
    // const index = tasks.findIndex((task) => task.id === id);
    //
    // // удаляемзадачу из массива
    // tasks.splice(index, 1);

    // способ 2 удаление из массива задачи с помощью фильтра
    tasks = tasks.filter((task) => task.id !== id);

    // удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
    saveToLocalStorage();
}

function doneTask(event) {

    // проверяем, если клик произошел НЕ по кнопке "выполнено"
    if (event.target.dataset.action !== 'done') return;

    // проверяем, что клик произошел по кнопке "выполнено"
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи
    const id = +parentNode.id;
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    saveToLocalStorage();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// рендерим задачу на страницу
function renderTask(task) {
    // формируем CSS класс для названия задачи
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новых задач
    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;

    // добавить задачу на страницу (в конец - это первый аргумент и второй аргумент переменная, где разметка хранится)
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

