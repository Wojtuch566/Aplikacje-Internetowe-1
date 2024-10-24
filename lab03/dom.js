document.todo = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [
        ['Zadanie 1', '2025-07-04'],
        ['Zadanie 2', '2024-11-11']
    ],

    init: function () {
        for (let i = 0; i < this.tasks.length; i++) {
            console.log(this.tasks.at(i).at(0) + " " + this.tasks.at(i).at(1));
        }

        this.draw();
    },
    
    draw : function () {
        const ul = document.getElementById("task-list");
    }
}
document.todo.init();
