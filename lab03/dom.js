document.todo = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [
        ['Zadanie 1', '2025-07-04'],
        ['Zadanie 2', '2024-11-11']
    ],
    draw: function() {
        const ul = document.createElement('ul');
        ul.innerHTML = '';

        const listContainer = document.getElementById('task-list');
        listContainer.innerHTML = '';
        listContainer.appendChild(ul);
    },

    init: function () {
        this.draw();
    }
}

document.todo.init();
