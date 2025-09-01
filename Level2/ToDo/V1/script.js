document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dateDisplay = document.getElementById('date-display');

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Set current date
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // --- Core Functions ---

    /**
     * Renders tasks to the DOM based on the current filter.
     */
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear current list

        // Filter tasks based on the current filter state
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'pending') return !task.completed;
            return true; // 'all'
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">No tasks found.</li>';
            return;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Complete task">
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="delete-btn" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"/>
                        </svg>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    /**
     * Saves the current tasks array to localStorage.
     */
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // --- Event Handlers ---

    /**
     * Handles the form submission to add a new task.
     */
    const addTask = (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();

        if (text) {
            tasks.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };
    
    /**
     * Handles clicks on the task list for actions like toggling complete or deleting.
     */
    const handleTaskListClick = (e) => {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = Number(taskItem.getAttribute('data-id'));

        // Toggle complete
        if (target.matches('input[type="checkbox"]')) {
            const task = tasks.find(t => t.id === taskId);
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
        
        // Delete task
        if (target.matches('.delete-btn, .delete-btn *')) {
            // Add animation class, then remove after animation completes
            taskItem.classList.add('removing');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== taskId);
                saveTasks();
                renderTasks();
            }, 500); // Match CSS animation duration
        }

        // Edit task (inline)
        if (target.matches('.task-text')) {
            const currentText = target.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            target.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const newText = input.value.trim();
                if (newText) {
                    const task = tasks.find(t => t.id === taskId);
                    task.text = newText;
                    saveTasks();
                }
                renderTasks(); // Re-render to restore span
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        }
    };
    
    /**
     * Handles clicks on filter buttons to change the view.
     */
    const handleFilterClick = (e) => {
        if (e.target.matches('.filter-btn')) {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        }
    };


    // --- Initial Setup ---
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskListClick);
    document.querySelector('.filter-controls').addEventListener('click', handleFilterClick);
    
    renderTasks(); // Initial render on page load
});