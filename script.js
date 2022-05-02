/* eslint-disable import/no-mutable-exports */
const x = JSON.parse(localStorage.getItem('savedData'));
let tasks = [];

if (x) {
  tasks = x;
}

const list = document.querySelector('.li');
const textareaSelector = document.querySelectorAll('.user-input');
const form = document.querySelector('form');

const addTask = (description, completed, index) => {
  tasks.push({ description, completed, index });
  localStorage.setItem('savedData', JSON.stringify(tasks));
  // window.location.reload();
  return { description, completed, index };
};

function createTask({ description, completed, index }) {
  const listItem = document.createElement('li');
  list.appendChild(listItem);

  listItem.innerHTML = `
  <div class="input-label"><input type="checkbox" name="${index}" id="${index}" class="id checkbox ${completed}">
  <textarea class="user-input" for="${index}" readonly>${description}</textarea></div>
  <div class="icon"><i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-trash-can"></i></div><br>`;
}

tasks.forEach(createTask);

const updateText = (index, newText) => {
  tasks.forEach((task) => {
    if (task.index === +index) {
      task.description = newText;
    }
  });
  localStorage.setItem('savedData', JSON.stringify(tasks));
};

textareaSelector.forEach((textarea) => {
  textarea.addEventListener('focusout', (e) => {
    if (e.target.value) {
      updateText(e.target.previousElementSibling.id, e.target.value);
    }
    if (e.target.previousElementSibling.checked) {
      e.target.style.textDecoration = 'line-through';
    }
  });
});

const checkbox = document.querySelectorAll('input[type=checkbox]');
for (let i = 0; i < tasks.length; i += 1) {
  checkbox[i].addEventListener('change', (e) => {
    tasks.forEach((task) => {
      if (task.index === +e.target.id) {
        if (e.target.checked) {
          task.completed = true;
          e.target.nextElementSibling.style.textDecoration = 'line-through';
        } else {
          task.completed = false;
          e.target.nextElementSibling.style.textDecoration = 'none';
        }
      }
      localStorage.setItem('savedData', JSON.stringify(tasks));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < tasks.length; i += 1) {
    tasks.forEach((task) => {
      if (+checkbox[i].id === task.index) {
        if (task.completed === true) {
          checkbox[i].checked = true;
        } else {
          checkbox[i].checked = false;
        }
      }
    });
  }
});

function edit(e) {
  const item = e.target;

  if (item.classList.contains('fa-trash-can')) {
    const removeParent = item.parentElement.parentElement;
    removeParent.remove();

    const removeTaskFromArray =
      item.parentElement.previousElementSibling.children[0].getAttribute(
        'name'
      );

    tasks = tasks.filter((newTask) => {
      if (newTask.index !== +removeTaskFromArray) return true;
      return false;
    });

    localStorage.setItem('savedData', JSON.stringify(tasks));
  }

  if (item.classList.contains('fa-ellipsis-vertical')) {
    item.nextElementSibling.style.display = 'block';
    item.style.display = 'none';
  }

  if (item.classList.contains('user-input')) {
    item.removeAttribute('readonly');
  }
}

const clearCompleted = document.querySelector('.clear');

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter((task) => {
    if (task.completed !== true) {
      return true;
    }
    return false;
  });
  localStorage.setItem('savedData', JSON.stringify(tasks));
  window.location.reload(true);
  return false;
});

tasks.forEach((item, i) => {
  item.index = i + 1;
});

list.addEventListener('click', edit);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskValue = document.querySelector('#add');

  if (taskValue.value === '') {
    return false;
  }
  const description = taskValue.value;
  const completed = false;
  const index = tasks.length + 1;

  const newTask = addTask(description, completed, index);

  createTask(newTask);

  taskValue.value = '';
  return false;
});
