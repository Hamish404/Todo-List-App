const taskInput = document.querySelector('.input');
const addButton = document.querySelector('.add-btn');
const sortButton = document.querySelector('.sort-btn');
const wrapper = document.querySelector('.wrapper');
const listItemsContainer = document.querySelector('.list-items-container');
const iconStyling = document.querySelector('.icon');
let sortIndex = 0;

let priorityOrderAsc = {
  'High': 1,
  'Medium': 2,
  'Low': 3
};

let priorityOrderDesc = {
  'Low': 1,
  'Medium': 2,
  'High': 3
};

const sortAsc = () => { 
  tasks.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority]) 
};
const sortDesc = () => { 
  tasks.sort((a, b) => priorityOrderDesc[a.priority] - priorityOrderDesc[b.priority]) 
};
const sortUncheckedAsc = () => { 
  tasks.sort((a, b) => (a.isChecked ? 1 : 0) - (b.isChecked ? 1 : 0)) 
};
const sortUncheckedDesc = () => { 
  tasks.sort((a, b) => priorityOrderDesc[a.priority] - priorityOrderDesc[b.priority]);
  tasks.sort((a, b) => (a.isChecked ? 1 : 0) - (b.isChecked ? 1 : 0));
 };

const sortFunctions = [
  sortDesc,
  sortAsc,
  sortUncheckedAsc,
  sortUncheckedDesc
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
if (!Array.isArray(tasks)) {
  tasks = [];
};

onPageLoad();

addButton.addEventListener('click', () => {
  if (tasks.length < 13) {
    addTaskToList();
    taskInput.focus();
  };
});

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && tasks.length < 13) {
    addTaskToList();
    taskInput.focus();
  };
});

wrapper.addEventListener('click', (event) => {
  deleteButtonLogic(event);
});

sortButton.addEventListener('click', () => {
  sortFunctions[sortIndex]();
  sortIndex = (sortIndex + 1) % sortFunctions.length;  

  updateLocalStorage();
  listItemsContainer.replaceChildren();
  onPageLoad();
});

function addTaskToList() {
  const task = taskInput.value.trim();

  if (task === '') {
    alert('Must enter a valid task');
    return;
  }
  if (tasks.some(t => t.tasks === task)) {
    alert('Task already exists');
    return;
  }
  
  const taskObject = {
    tasks: task,
    isChecked: false, 
    priority: null 
  };

  const listItems = document.createElement('div');
  const checkboxPWrapper = document.createElement('div');
  const checkboxInput = document.createElement('input');
  const labelElement = document.createElement('label');
  const dropdownContainer = document.createElement('div');
  const dropdownButton = document.createElement('i');
  const dropdown = document.createElement('ul');
  const optionLow = document.createElement('li');
  const optionMedium = document.createElement('li');
  const optionHigh = document.createElement('li');
  const taskText = document.createElement('p');
  const deleteButton = document.createElement('button');
  const underline = document.createElement('hr');

  checkboxInput.setAttribute('type', 'checkbox');
  checkboxInput.setAttribute('aria-label', 'Mark task as completed');
  dropdownButton.setAttribute('aria-label', 'Select task priority');
  optionLow.setAttribute('aria-label', 'Set task priority to low');
  optionMedium.setAttribute('aria-label', 'Set task priority to medium');
  optionHigh.setAttribute('aria-label', 'Set task priority to high');
  deleteButton.setAttribute('type', 'button');
  deleteButton.setAttribute('data-task', task);
  deleteButton.setAttribute('aria-label', 'Delete this task');
  labelElement.setAttribute('for', 'priority');
  optionLow.setAttribute('data-value', 'low');
  optionMedium.setAttribute('data-value', 'medium');
  optionHigh.setAttribute('data-value', 'high');

  listItems.classList.add('list-items');
  checkboxPWrapper.classList.add('checkbox-p-wrapper');
  checkboxInput.classList.add('checkbox');
  labelElement.classList.add('label');
  dropdownContainer.classList.add('dropdown');
  dropdownContainer.id = 'priority-dropdown';
  dropdownContainer.id = 'priority';
  dropdownButton.classList.add('fa-solid', 'fa-angle-down', 'dropdown-icon');
  dropdown.classList.add('options');
  optionLow.classList.add('option', 'option-1');
  optionMedium.classList.add('option', 'option-2');
  optionHigh.classList.add('option', 'option-3');
  taskText.classList.add('task-text');
  deleteButton.classList.add('delete-btn');
  underline.classList.add('list-item-hr');

  optionLow.textContent = 'Low';
  optionMedium.textContent = 'Medium';
  optionHigh.textContent = 'High';
  deleteButton.textContent = 'X';

  dropdown.append(optionLow, optionMedium, optionHigh);
  dropdownContainer.append(dropdownButton, dropdown);
  labelElement.append(dropdownContainer);
  checkboxPWrapper.append(checkboxInput, labelElement, taskText, deleteButton);
  listItems.append(checkboxPWrapper, underline);
  listItemsContainer.append(listItems);

  deleteButton.addEventListener('mouseover', () => {
    checkboxPWrapper.style.opacity = 0.5;
  });

  deleteButton.addEventListener('mouseout', () => {
    checkboxPWrapper.style.opacity = 1;
  });

  checkboxInput.addEventListener('click', () => {
    taskObject.isChecked = checkboxInput.checked;
    taskText.classList.toggle('striked', taskObject.isChecked);
    updateLocalStorage();
  });

  dropdownButton.addEventListener('click', () => {
    const allDropdowns = wrapper.querySelectorAll('.options');

    allDropdowns.forEach(dropdown => {
      if (dropdown !== dropdownButton.nextElementSibling) {
        dropdown.style.display = 'none';
      }
    });

    const isDropdownVisible = dropdown.style.display === 'block';
    dropdown.style.display = isDropdownVisible ? 'none' : 'block';
  });

  dropdown.addEventListener('click', (event) => {
    const clickedItem = event.target.textContent;

    if (clickedItem) {
      dropdown.style.display = 'none';

      switch (clickedItem) {

        case 'Low':
          dropdownButton.style.color = 'Green';
          taskObject.priority = 'Low';
          updateLocalStorage();
          break;

        case 'Medium':
          dropdownButton.style.color = 'Orange';
          taskObject.priority = 'Medium';
          updateLocalStorage();
          break;

        case 'High':
          dropdownButton.style.color = 'Red';
          taskObject.priority = 'High';
          updateLocalStorage();
          break;
      }

    };
  });

  taskText.textContent = task;
  taskInput.value = '';

  tasks.push(taskObject);

  updateLocalStorage();
  
};

function onPageLoad() {
  tasks.forEach(task => {
    const listItems = document.createElement('div');
    const checkboxPWrapper = document.createElement('div');
    const checkboxInput = document.createElement('input');
    const labelElement = document.createElement('label');
    const dropdownContainer = document.createElement('div');
    const dropdownButton = document.createElement('i');
    const dropdown = document.createElement('ul');
    const optionLow = document.createElement('li');
    const optionMedium = document.createElement('li');
    const optionHigh = document.createElement('li');
    const taskText = document.createElement('p');
    const deleteButton = document.createElement('button');
    const underline = document.createElement('hr');

    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.setAttribute('aria-label', 'Mark task as completed');
    dropdownButton.setAttribute('aria-label', 'Select task priority');
    optionLow.setAttribute('aria-label', 'Set task priority to low');
    optionMedium.setAttribute('aria-label', 'Set task priority to medium');
    optionHigh.setAttribute('aria-label', 'Set task priority to high');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('data-task', task.tasks);
    deleteButton.setAttribute('aria-label', 'Delete this task');
    labelElement.setAttribute('for', 'priority');
    optionLow.setAttribute('data-value', 'low');
    optionMedium.setAttribute('data-value', 'medium');
    optionHigh.setAttribute('data-value', 'high');

    listItems.classList.add('list-items');
    checkboxPWrapper.classList.add('checkbox-p-wrapper');
    checkboxInput.classList.add('checkbox');
    labelElement.classList.add('label');
    dropdownContainer.classList.add('dropdown');
    dropdownContainer.id = 'priority-dropdown';
    dropdownContainer.id = 'priority';
    dropdownButton.classList.add('fa-solid', 'fa-angle-down', 'dropdown-icon');
    dropdown.classList.add('options');
    optionLow.classList.add('option', 'option-1');
    optionMedium.classList.add('option', 'option-2');
    optionHigh.classList.add('option', 'option-3');
    taskText.classList.add('task-text');
    deleteButton.classList.add('delete-btn');
    underline.classList.add('list-item-hr');

    optionLow.textContent = 'Low';
    optionMedium.textContent = 'Medium';
    optionHigh.textContent = 'High';
    deleteButton.textContent = 'X';

    dropdown.append(optionLow, optionMedium, optionHigh);
    dropdownContainer.append(dropdownButton, dropdown);
    labelElement.append(dropdownContainer);
    checkboxPWrapper.append(checkboxInput, labelElement, taskText, deleteButton);
    listItems.append(checkboxPWrapper,  underline);
    listItemsContainer.append(listItems);

    deleteButton.addEventListener('mouseover', () => {
      checkboxPWrapper.style.opacity = 0.3;
    });
  
    deleteButton.addEventListener('mouseout', () => {
      checkboxPWrapper.style.opacity = 1;
    });

    checkboxInput.addEventListener('click', () => {
      task.isChecked = checkboxInput.checked;
      taskText.classList.toggle('striked', checkboxInput.checked);
      updateLocalStorage();
    });

    dropdownButton.addEventListener('click', () => {
      const allDropdowns = wrapper.querySelectorAll('.options');
  
      allDropdowns.forEach(dropdown => {
        if (dropdown !== dropdownButton.nextElementSibling) {
          dropdown.style.display = 'none';
        }
      });
  
      const isDropdownVisible = dropdown.style.display === 'block';
      dropdown.style.display = isDropdownVisible ? 'none' : 'block';
    });
  
    dropdown.addEventListener('click', (event) => {
      const clickedItem = event.target.textContent;
  
      if (clickedItem) {
        dropdown.style.display = 'none';
  
        switch (clickedItem) {

          case 'Low':
            dropdownButton.style.color = 'Green';
            task.priority = 'Low';
            updateLocalStorage();
            break;

          case 'Medium':
            dropdownButton.style.color = 'Orange';
            task.priority = 'Medium';
            updateLocalStorage();
            break;

          case 'High':
            dropdownButton.style.color = 'Red';
            task.priority = 'High';
            updateLocalStorage();
            break;

        };

      };
    });

    switch (task.priority) {
      case 'Low':
        dropdownButton.style.color = 'Green';
        break;
      case 'Medium':
        dropdownButton.style.color = 'Orange';
        break;
      case 'High':
        dropdownButton.style.color = 'Red'; 
    };

    taskText.textContent = task.tasks;
    
    checkboxInput.checked = task.isChecked;

    taskText.classList.toggle('striked', checkboxInput.checked);

  });
};

function deleteButtonLogic(event) {
  const clickedDeleteButton = event.target.closest('.delete-btn');

  if (clickedDeleteButton) {
    const taskText = clickedDeleteButton.getAttribute('data-task');
    const listItems = clickedDeleteButton.closest('.list-items');

    listItems.style.opacity = '0';

    setTimeout(() => {
      listItemsContainer.removeChild(listItems);
    }, 400);
    tasks = tasks.filter((t) => t.tasks !== taskText);

    updateLocalStorage();
  };
};

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};