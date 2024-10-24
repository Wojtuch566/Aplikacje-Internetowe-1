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
    },
    
    draw : function () {
        const ul = document.getElementById("task-list");
        ul.innerHTML = '';

        this.tasks.forEach((task, index) => {
            const li = document.createElement('li');

            //elementów taska
            const taskDiv = document.createElement('div');
            taskDiv.textContent = task[0];
            li.appendChild(taskDiv);

            const dateDiv = document.createElement('div');
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
            this.tasks.push([taskName, taskDate]);

            this.saveTasks();
            this.debugList();

            document.getElementById('task-name').value = '';
            document.getElementById('task-date').value = '';
            this.draw();
        } else {
            alert("Wypełnij pola!");
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
