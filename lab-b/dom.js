document.todo = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [
        ['Zadanie 1', '2025-07-04'],
        ['Zadanie 2', '2024-11-11'],
        ['Zadanie 3', '2024-11-16']
    ],

    debugList: function () {
        // for (let i = 0; i < this.tasks.length; i++) {
        //     console.log(this.tasks.at(i).at(0) + " " + this.tasks.at(i).at(1));
        // }
        console.log(this.tasks);
    },

    init: function () {
        this.debugList();
        this.draw();

        const addButton = document.getElementById("task-add");
        addButton.addEventListener('click', () => {
            this.addTask();
        });

        const searchInput = document.getElementById('search-item');
        searchInput.addEventListener('input', () => this.searchTasks(searchInput.value))
    },
    
    draw : function (filteredTasks = this.tasks) {
        const ul = document.getElementById("task-list");
        ul.innerHTML = '';

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');

            //elementy taska
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('tasklist-name');
            taskDiv.textContent = task[0];
            li.appendChild(taskDiv);

            //edycja nazwy
            taskDiv.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = task[0];
                input.classList.add('tasklist-name');
                taskDiv.replaceWith(input);

                //zapis
                const saveEdit = () => {
                    const trimmedValue = input.value.trim();

                    if (trimmedValue.length >= 2) {
                        task[0] = input.value.trim();
                        this.saveTasks();
                        this.draw(filteredTasks);
                        this.debugList();
                    } else {
                        alert("Nazwa zadania musi mieć co najmniej 2 znaki!");
                        this.draw(filteredTasks);
                    }
                };

                //zapis przy opuszczeniu edycji
                input.addEventListener('blur', saveEdit);

                input.focus();
            });

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('tasklist-date');
            dateDiv.textContent = formatDate(task[1]);
            li.appendChild(dateDiv);

            const deleteDiv = document.createElement('div');
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('material-symbols-outlined');
            deleteIcon.textContent = 'delete';
            deleteDiv.appendChild(deleteIcon);
            li.appendChild(deleteDiv);

            //usuwanie taska
            deleteIcon.addEventListener('click', () => {
                this.deleteTask(index);
            });

            //końcowe dodanie taska do listy
            ul.appendChild(li);
        });
    },

    deleteTask: function (index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.debugList();
        this.draw();
    },

    addTask: function () {
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;

        if (taskName && taskDate) {
            if (taskName.length < 3) {
                alert("Podaj minimum 3 znaki!");
            } else if (taskName.length > 255) {
                alert("Maksymalna ilość znaków 255!")
            } else {
                this.tasks.push([taskName, taskDate]);

                this.saveTasks();
                this.debugList();

                document.getElementById('task-name').value = '';
                document.getElementById('task-date').value = '';
                this.draw();
            }
        } else {
            alert("Wypełnij pola!");
        }
    },

    searchTasks: function (searchTerm) {
        if (searchTerm.length >= 2) {
            const filteredTasks = this.tasks.filter(task =>
                task[0].toLowerCase().includes(searchTerm.toLowerCase())
            );

            this.draw(filteredTasks);
        } else {
            this.draw();
        }
    },

    saveTasks: function () {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}
document.todo.init();

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0'); // Dzień z przedrostkiem 0
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące od 0, więc dodajemy 1
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Format DD.MM.RRRR
}
