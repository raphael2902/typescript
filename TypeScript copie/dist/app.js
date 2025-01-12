"use strict";
class ToDoList {
    constructor() {
        this.tasks = [];
        this.currentUser = null;
        this.loadTasks();
        this.bindEvents();
    }
    bindEvents() {
        var _a, _b, _c;
        (_a = document.getElementById('loginBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.login());
        (_b = document.getElementById('registerBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.register());
        (_c = document.getElementById('addTaskBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.addTask());
    }
    loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        }
        this.renderTasks();
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    renderTasks() {
        const taskList = document.getElementById('taskList');
        if (taskList) {
            taskList.innerHTML = '';
            this.tasks.forEach(task => {
                if (task.userId === this.currentUser) {
                    const taskDiv = document.createElement('div');
                    taskDiv.className = 'task';
                    taskDiv.innerHTML = `
                        <h3 class="${task.status ? 'completed' : ''}">${task.title}</h3>
                        <p>${task.description}</p>
                        <p>Deadline: ${task.deadline}</p>
                    `;
                    const validateButton = document.createElement('button');
                    validateButton.innerText = 'Valider';
                    validateButton.addEventListener('click', () => this.validateTask(task.id));
                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = 'Supprimer';
                    deleteButton.addEventListener('click', () => this.deleteTask(task.id));
                    taskDiv.appendChild(validateButton);
                    taskDiv.appendChild(deleteButton);
                    taskList.appendChild(taskDiv);
                }
            });
        }
    }
    login() {
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        if (username) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            this.showTaskForm();
            this.loadTasks();
        }
    }
    register() {
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        if (username) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (!users.includes(username)) {
                users.push(username);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Utilisateur enregistré avec succès !');
            }
            else {
                alert('Cet utilisateur existe déjà.');
            }
        }
    }
    addTask() {
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        const deadlineInput = document.getElementById('taskDeadline');
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const deadline = deadlineInput.value;
        if (title && description && deadline) {
            const newTask = {
                id: this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1,
                title,
                description,
                status: false,
                deadline,
                userId: this.currentUser || ''
            };
            this.tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            titleInput.value = '';
            descriptionInput.value = '';
            deadlineInput.value = '';
        }
    }
    validateTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = true;
            this.saveTasks();
            this.renderTasks();
        }
    }
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1 && !this.tasks[taskIndex].status) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
        }
    }
    showTaskForm() {
        document.getElementById('auth').style.display = 'none';
        document.getElementById('taskForm').style.display = 'block';
    }
}
const todoList = new ToDoList();
