// This function sets the number of tasks that we have in any filter.
export const drawNumTask = () => {
  const reqDb = window.indexedDB.open('todo');
  reqDb.onsuccess = () => {
    const store = reqDb.result.transaction(['tasks'], 'readonly').objectStore('tasks');
    store.getAll().onsuccess = e => {
      const filterValue = document.querySelector('.ul__span-filter--active').dataset.filter;
      let numTask = null;
      filterValue === 'all' ? (numTask = e.target.result.length) : (numTask = e.target.result.filter(({ state }) => state === filterValue).length);
      document.getElementById('taskNumber').textContent = `${numTask} Tasks`;
    };
  };
};

// This function creates a li template for the new task.
export const addTask = numTask => {
  const $input = document.getElementById('input');
  const $newLi = document.getElementById('li-template').cloneNode(true).content;
  $newLi.querySelector('.ul__p').textContent = $input.value;
  $newLi.querySelector('.ul__li').dataset.task = numTask;
  document.querySelector('.ul').prepend($newLi);
  drawNumTask();
  $input.value = '';
};

// This function draws the array of tasks passed
const drawTasks = arrayOfTasks => {
  const fragment = new DocumentFragment();
  for (const { id, text, state } of arrayOfTasks) {
    const $newLi = document.getElementById('li-template').cloneNode(true).content;
    $newLi.querySelector('.ul__p').textContent = text;
    $newLi.querySelector('.ul__li').dataset.task = id;
    $newLi.querySelector('.ul__li').classList.toggle('ul__li--done', state === 'completed');
    fragment.append($newLi);
  }
  document.querySelectorAll('[draggable="true"]').forEach($li => $li.remove());
  document.querySelector('.ul').prepend(fragment);
  drawNumTask();
};

// This function filters the task and will execute the drawsTask function to draw the tasks filtered
export const filterBy = by => {
  document.querySelectorAll('.ul__span-filter').forEach($element => $element.classList.toggle('ul__span-filter--active', $element.dataset.filter === by));
  const reqDb = window.indexedDB.open('todo');
  reqDb.onsuccess = () => {
    let db = reqDb.result;
    const store = db.transaction(['tasks'], 'readonly').objectStore('tasks');

    store.getAll().onsuccess = e => {
      let tasks = null;
      by === 'all' ? (tasks = e.target.result) : (tasks = e.target.result.filter(({ state }) => state === by));
      drawTasks(tasks);
    };
  };
};

// This function sets the updates of the task that we are updating to IndexedDB.
export const setUpdate = () => {
  const $li = document.querySelector('.ul__li--updating');
  const $input = document.querySelector('input');
  const reqDb = window.indexedDB.open('todo');
  reqDb.onsuccess = () => {
    const state = $li.classList.contains('ul__li--done') ? 'completed' : 'active';
    const store = reqDb.result.transaction(['tasks'], 'readwrite').objectStore('tasks');
    store.put({
      id: +$li.dataset.task,
      text: $input.value,
      state: state,
    });
    $input.dataset.state = 'add';
    $li.querySelector('.ul__p').textContent = $input.value;
    $li.classList.remove('ul__li--updating');
    $input.value = '';
    document.getElementById('cancel-update').classList.remove('cont-input__cancelBtn--show');
    drawNumTask();
  };
};

// This function will delete all completed tasks.
export const clearCompleted = () => {
  const reqDb = window.indexedDB.open('todo');
  reqDb.onsuccess = () => {
    document.querySelectorAll('.ul__li--done').forEach($element => {
      const store = reqDb.result.transaction(['tasks'], 'readwrite').objectStore('tasks');
      store.delete(+$element.dataset.task);
      $element.remove();
      drawNumTask();
    });
  };
  filterBy(document.querySelector('.ul__span-filter--active').dataset.filter);
};
