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
    
    draw : function (filteredTasks = this.tasks, highlightTerm = '') {
        const ul = document.getElementById("task-list");
        ul.innerHTML = '';

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');

            //elementy taska
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('tasklist-name');
            if (highlightTerm) {
                const regex = new RegExp(`(${highlightTerm})`, 'gi');
                taskDiv.innerHTML = task[0].replace(regex, `<span class="highlight">$1</span>`);
            } else {
                taskDiv.textContent = task[0];
            }
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

                    if (trimmedValue.length > 255) {
                        alert("Maksymalna ilość znaków 255!")
                        this.draw(filteredTasks, highlightTerm);
                    } else {
                        if (trimmedValue.length >= 3) {
                            task[0] = input.value.trim();
                            this.saveTasks();
                            this.draw(filteredTasks, highlightTerm);
                            console.log("Zmieniono nazwę: [" + task[0] + " | " + task[1] + "]");
                            this.debugList();
                        } else {
                            alert("Podaj minimum 3 znaki!");
                            this.draw(filteredTasks, highlightTerm);
                        }
                    }
                };

                //zapis przy opuszczeniu edycji
                input.addEventListener('blur', saveEdit);

                input.focus();
            });

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('tasklist-date');
            if (task[1] === '') {
                dateDiv.style.color = 'transparent';
            }
            dateDiv.textContent = formatDate(task[1]);
            li.appendChild(dateDiv);

            //edycja daty
            dateDiv.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'date';
                input.value = task[1];
                input.classList.add('tasklist-date');
                dateDiv.replaceWith(input);

                //zapis
                const saveEdit = () => {
                    const trimmedValue = input.value.trim();

                    const selectedDate = new Date(trimmedValue);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        alert('Data musi być co najmniej dzisiejsza!')
                        this.draw(filteredTasks);
                    } else {
                        task[1] = input.value.trim();
                        this.saveTasks();
                        this.draw(filteredTasks);
                        console.log("Zmieniono datę: [" + task[0] + " | " + task[1] + "]");
                        this.debugList();
                    }
                }

                //zapis przy opuszczeniu edycji
                input.addEventListener('blur', saveEdit);
                input.focus();
            });

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
        console.log("Usunięto: [" + this.tasks[index][0] + " | " + this.tasks[index][1] + "]");
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.debugList();
        this.draw();
    },

    addTask: function () {
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;

        if (taskName) {
            if (taskName.length < 3) {
                alert("Podaj minimum 3 znaki!");
            } else if (taskName.length > 255) {
                alert("Maksymalna ilość znaków 255!")
            } else {
                const selectedDate = new Date(taskDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    alert("Data musi być co najmniej dzisiejsza!");
                    this.draw();
                } else {
                    this.tasks.push([taskName, taskDate]);

                    this.saveTasks();
                    console.log("Dodano: [" + taskName + " | " + taskDate + "]");
                    this.debugList();

                    document.getElementById('search-item').value = '';
                    document.getElementById('task-name').value = '';
                    document.getElementById('task-date').value = '';
                    this.draw();
                }
            }
        } else {
            alert("Podaj nazwę zadania!");
        }
    },

    searchTasks: function (searchTerm) {
        if (searchTerm.length >= 2) {
            const filteredTasks = this.tasks.filter(task =>
                task[0].toLowerCase().includes(searchTerm.toLowerCase())
            );

            this.draw(filteredTasks, searchTerm);
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
