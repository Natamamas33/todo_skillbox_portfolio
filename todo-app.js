(function () {
  // содаем массив дел, чтобы список дел хранился в объекте
  let listArray = [],
    listName = "";

  // Создаем и возвращаем заголовок приложения

  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Создаем и возвращаем форму для создания дела

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    // Если поле инпута пустое, ничего не делаем
    input.addEventListener("input", function () {
      if (input.value !== "") {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // Создаем и возвращаем список элементов

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  // Создаем ДОМ-элемент с делом

  function createTodoItem(obj) {
    let item = document.createElement("li");

    // кнопки помещаем в элемент, который красиво покажет их в одной группе

    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    item.textContent = obj.name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (obj.done == true) item.classList.add("list-group-item-success");

    // добавляем обработчики на кнопки

    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");
      const currentName = item.firstChild.textContent;

      for (const listItem of listArray) {
        if (listItem.id == obj.id) listItem.done = !listItem.done;
      }

      saveList(listArray, listName);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();

        const currentName = item.firstChild.textContent;

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) listArray.splice(i, 1);
        }

        saveList(listArray, listName);
      }
    });

    // Вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // Делаем id
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  // делаем отдельную функцию для сохранения списка дел в LocalStorage
  // JSON.stringify преозаровывает запись в строку

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(container, title = "Список дел", keyName, defArray = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;
    listArray = defArray;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

// расшифровка записи  localStorage и превращение обратно из строки в массив

    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== '') listArray = JSON.parse(localData);

    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }
    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела

    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима, чтоьы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы странийа перезагрузилась при отправки формы
      e.preventDefault();

      // игнорируем создание елемента, если пользоватедь ничего не ввел в форму
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false,
        //  выполнено или нет
      };
      // создаем новую запись - объект с параметрами
      let todoItem = createTodoItem(newItem);
      console.log(listArray);
      // добавляем запись в список
      listArray.push(newItem);

      saveList(listArray, listName);

      // создаем и добавляем в список новое дело с названием ищ поля для ввода
      todoList.append(todoItem.item);
      // деактивируем кнопку после отпраки формы
      todoItemForm.button.disabled = true;
      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = "";
    });
  }
  window.createTodoApp = createTodoApp;
})();
