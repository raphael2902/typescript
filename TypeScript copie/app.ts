interface Task {
    id: number;
    title: string;
    description: string;
    status: boolean;
    deadline: string;
    userId: string;
}

class ToDoList {
    private tasks: Task[] = [];
    private currentUser: string | null = null;

    constructor() {
        this.loadTasks();
        this.bindEvents();
    }

    private bindEvents() {
        document.getElementById('loginBtn')?.addEventListener('click', () => this.login());
        document.getElementById('registerBtn')?.addEventListener('click', () => this.register());
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.addTask());
    }

    private loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        }
        this.renderTasks();
    }

    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    private renderTasks() {
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

    private login() {
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const username = usernameInput.value.trim();
        if (username) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            this.showTaskForm();
            this.loadTasks();
        }
    }

    private register() {
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const username = usernameInput.value.trim();
        if (username) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (!users.includes(username)) {
                users.push(username);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Utilisateur enregistré avec succès !');
            } else {
                alert('Cet utilisateur existe déjà.');
            }
        }
    }

    private addTask() {
        const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
        const descriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement;
        const deadlineInput = document.getElementById('taskDeadline') as HTMLInputElement;

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const deadline = deadlineInput.value;

        if (title && description && deadline) {
            const newTask: Task = {
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

    private validateTask(taskId: number) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = true;
            this.saveTasks();
            this.renderTasks();
        }
    }

    private deleteTask(taskId: number) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1 && !this.tasks[taskIndex].status) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
        }
    }

    private showTaskForm() {
        document.getElementById('auth')!.style.display = 'none';
        document.getElementById('taskForm')!.style.display = 'block';
    }
}

const todoList = new ToDoList();
