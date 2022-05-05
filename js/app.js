import { setTheme, getTheme } from './modules/set_themes.js';
import { dragDrop } from './modules/drag_drop.js';
import { setTaskToDb, db } from './modules/indexdb.js';
import { addTask, filterBy, setUpdate, clearCompleted, drawNumTask } from './modules/crud.js';

window.addEventListener('DOMContentLoaded', () => {
  const getNumTasks = () => +localStorage.getItem('numTasks');
  const setNumTask = () => localStorage.setItem('numTasks', numTask);
  const $input = document.getElementById('input');
  let numTask = getNumTasks() || 0;
  getTheme();
  dragDrop();
  db();
  filterBy('all');

  // This function will be called when we create a new task.
  const createTask = () => {
    numTask++;
    setNumTask();
    setTaskToDb('add', {
      id: numTask,
      text: $input.value,
      state: 'active',
    });
    addTask(numTask);
    drawNumTask();
  };

  // This function will be called when we delete a task.
  const deleteTask = dataTask => {
    numTask--;
    setNumTask();
    setTaskToDb('delete', dataTask);
    document.querySelector(`[data-task="${dataTask}"]`).remove();
    document.getElementById('taskNumber').textContent = `${numTask} Tasks`;
    drawNumTask();
  };

  // This function will be called when we update a task.
  const updateTask = e => {
    const $li = e.target.closest('.ul__li');
    $li.classList.add('ul__li--updating');
    const $input = document.getElementById('input');
    $input.value = $li.textContent.trim();
    $input.dataset.state = 'update';
    document.getElementById('cancel-update').classList.add('cont-input__cancelBtn--show');
  };

    // This function will be called when we cancel the update of a task.
  const cancelUpdate = e => {
    document.querySelector('.ul__li--updating').classList.remove('ul__li--updating');
    const $input = document.getElementById('input');
    $input.value = '';
    $input.dataset.state = 'add';
    document.getElementById('cancel-update').classList.remove('cont-input__cancelBtn--show');
  };

  // this function will be executed when we complete a task or stop completing a task.
  const taskDoneAndActive = e => {
    const $li = e.target.closest('.ul__li');
    const reqDb = window.indexedDB.open('todo');

    $li.classList.contains('ul__li--done') ? $li.classList.remove('ul__li--done') : $li.classList.add('ul__li--done');

    reqDb.onsuccess = () => {
      const state = $li.classList.contains('ul__li--done') ? 'completed' : 'active';
      const store = reqDb.result.transaction(['tasks'], 'readwrite').objectStore('tasks');
      store.put({
        id: +$li.dataset.task,
        text: $li.querySelector('.ul__p').textContent,
        state: state,
      });
    };
  };

  // key even for the Enter key.
  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && $input.value.trim().length > 0) {
      $input.dataset.state === 'add' ? createTask() : setUpdate();
    }
  });

  // events for the sun and moon icons.
  document.querySelectorAll('[data-icon]').forEach($icon => {
    $icon.addEventListener('click', () => {
      document.body.dataset.theme = $icon.dataset.icon;
      setTheme();
      getTheme();
    });
  });

  // events for buttons on the container input.
  document.querySelector('.cont-input').addEventListener('click', e => {
    if (e.target.matches('#cancel-update')) cancelUpdate(e);
    else if (e.target.matches('.cont-input__addBtn') && $input.value.trim().length > 0) {
      $input.dataset.state === 'add' ? createTask() : setUpdate();
    }
  });

  // events for filter buttons that are in the mobile button container.
  document.getElementById('cont-bottom-filters').addEventListener('click', e => {
    if (e.target.classList.contains('ul__span-filter')) filterBy(e.target.dataset.filter);
  });

  // events for the interactives elements inside the ul container.
  document.querySelector('.ul').addEventListener('click', e => {
    if (e.target.dataset.id === 'update-btn') updateTask(e);
    else if (e.target.dataset.id === 'complete-btn') taskDoneAndActive(e);
    else if (e.target.classList.contains('ul__span-filter')) filterBy(e.target.dataset.filter);
    else if (e.target.matches('#clear-completed')) clearCompleted();
    else if (e.target.dataset.id === 'delete-btn') {
      const $liTaskId = +e.target.closest('.ul__li').dataset.task;
      deleteTask($liTaskId);
    }
  });
});
