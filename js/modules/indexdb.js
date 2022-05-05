// Here we create the database and also we set some default records to the database.
export const db = () => {
  if (window.indexedDB) {
    const reqDb = window.indexedDB.open('todo', 1);
    reqDb.onupgradeneeded = () => {
      let db = reqDb.result;
      const objStore = db.createObjectStore('tasks', { keyPath: 'id' });
      objStore.add({
        id: 99,
        text: 'Read for 1 hour',
        state: 'active',
      });
      objStore.add({
        id: 98,
        text: '10 minutes meditation',
        state: 'completed',
      });
      objStore.add({
        id: 97,
        text: 'Appreciate our privileges',
        state: 'active',
      });
    };
  }
};

// This function will add or delete a task depending on the type argument. The ref argument can be an object or the key of an object.
export const setTaskToDb = (type, ref) => {
  const reqDb = window.indexedDB.open('todo');
  reqDb.onsuccess = () => {
    let db = reqDb.result;
    const store = db.transaction(['tasks'], 'readwrite').objectStore('tasks');
    if (type === 'add') store.add(ref);
    else if (type === 'delete') store.delete(ref);
  };
};
