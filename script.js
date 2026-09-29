/* =====================================
   ДАННЫЕ
===================================== */

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let tables =
    JSON.parse(localStorage.getItem("tables")) || [];

let pages =
    JSON.parse(localStorage.getItem("pages")) || [];

let currentPage = null;


/* =====================================
   СОХРАНЕНИЕ
===================================== */

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


function saveTables() {
    localStorage.setItem(
        "tables",
        JSON.stringify(tables)
    );
}


function savePages() {
    localStorage.setItem(
        "pages",
        JSON.stringify(pages)
    );
}


/* =====================================
   НАВИГАЦИЯ
===================================== */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(element => {
            element.classList.add("hidden");
        });


    document
        .querySelectorAll(".nav-item")
        .forEach(element => {
            element.classList.remove("active");
        });


    if (page === "home") {

        document
            .getElementById("homePage")
            .classList.remove("hidden");

        document
            .getElementById("breadcrumb")
            .textContent = "Главная";
    }


    if (page === "tasks") {

        document
            .getElementById("tasksPage")
            .classList.remove("hidden");

        document
            .getElementById("breadcrumb")
            .textContent = "Задачи";

        showTasks();
    }


    if (page === "tables") {

        document
            .getElementById("tablesPage")
            .classList.remove("hidden");

        document
            .getElementById("breadcrumb")
            .textContent = "Таблицы";

        showTables();
    }


    if (page === "custom") {

        document
            .getElementById("customPage")
            .classList.remove("hidden");

        loadCustomPage();
    }


    if (window.innerWidth <= 800) {

        document
            .querySelector(".sidebar")
            .classList.remove("open");
    }

}


function toggleSidebar() {

    document
        .querySelector(".sidebar")
        .classList.toggle("open");
}


/* =====================================
   ЗАДАЧИ
===================================== */

function addTask() {

    const input =
        document.getElementById("taskInput");

    const text =
        input.value.trim();


    if (text === "") {
        return;
    }


    tasks.push({
        text: text,
        done: false
    });


    input.value = "";

    saveTasks();

    showTasks();

    updateDashboard();

    toast("Задача добавлена");
}


function showTasks() {

    const list =
        document.getElementById("taskList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    const searchInput =
        document.getElementById("searchInput");


    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    tasks.forEach((task, index) => {

        if (
            !task.text
                .toLowerCase()
                .includes(search)
        ) {
            return;
        }


        const row =
            document.createElement("div");

        row.className = "task";


        const checkbox =
            document.createElement("div");

        checkbox.className = "checkbox";


        if (task.done) {

            checkbox.classList.add("checked");

            checkbox.textContent = "✓";
        }


        checkbox.onclick = () => {

            toggleTask(index);

        };


        const text =
            document.createElement("div");

        text.className = "task-text";

        text.textContent = task.text;


        if (task.done) {

            text.classList.add("done");

        }


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-button";

        deleteButton.textContent = "×";


        deleteButton.onclick = () => {

            deleteTask(index);

        };


        row.appendChild(checkbox);

        row.appendChild(text);

        row.appendChild(deleteButton);

        list.appendChild(row);

    });

}


function toggleTask(index) {

    tasks[index].done =
        !tasks[index].done;

    saveTasks();

    showTasks();

    updateDashboard();
}


function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    showTasks();

    updateDashboard();

    toast("Задача удалена");
}


/* =====================================
   ТАБЛИЦЫ
===================================== */

function addTable() {

    tables.push({

        title: "Новая таблица",

        columns: [
            "Название",
            "Статус",
            "Заметка"
        ],

        rows: [
            ["", "", ""]
        ]

    });


    saveTables();

    showTables();

    updateDashboard();

    toast("Таблица создана");
}


function showTables() {

    const container =
        document.getElementById(
            "tablesList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    tables.forEach(
        (table, tableIndex) => {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "table-wrapper";


        const top =
            document.createElement("div");

        top.className = "table-top";


        const title =
            document.createElement("input");

        title.className =
            "table-name";

        title.value =
            table.title;


        title.onchange = () => {

            table.title =
                title.value;

            saveTables();

        };


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "×";


        deleteButton.onclick = () => {

            deleteTable(tableIndex);

        };


        top.appendChild(title);

        top.appendChild(deleteButton);


        const scroll =
            document.createElement("div");

        scroll.className =
            "table-scroll";


        const tableElement =
            document.createElement("table");


        const head =
            document.createElement("thead");

        const headRow =
            document.createElement("tr");


        table.columns.forEach(
            (column, columnIndex) => {

            const th =
                document.createElement("th");

            const input =
                document.createElement("input");

            input.value = column;


            input.onchange = () => {

                table.columns[
                    columnIndex
                ] = input.value;

                saveTables();

            };


            th.appendChild(input);

            headRow.appendChild(th);

        });


        const actionHead =
            document.createElement("th");

        actionHead.textContent = "×";

        headRow.appendChild(actionHead);

        head.appendChild(headRow);


        const body =
            document.createElement("tbody");


        table.rows.forEach(
            (row, rowIndex) => {

            const tr =
                document.createElement("tr");


            row.forEach(
                (cell, columnIndex) => {

                const td =
                    document.createElement("td");

                const input =
                    document.createElement("input");

                input.value = cell;

                input.placeholder =
                    "Введите...";


                input.onchange = () => {

                    table.rows[
                        rowIndex
                    ][
                        columnIndex
                    ] = input.value;

                    saveTables();

                };


                td.appendChild(input);

                tr.appendChild(td);

            });


            const action =
                document.createElement("td");


            const deleteRowButton =
                document.createElement("button");


            deleteRowButton.className =
                "delete-button";


            deleteRowButton.style.opacity =
                "1";


            deleteRowButton.textContent =
                "×";


            deleteRowButton.onclick = () => {

                deleteRow(
                    tableIndex,
                    rowIndex
                );

            };


            action.appendChild(
                deleteRowButton
            );

            tr.appendChild(action);

            body.appendChild(tr);

        });


        tableElement.appendChild(head);

        tableElement.appendChild(body);

        scroll.appendChild(tableElement);


        const buttons =
            document.createElement("div");

        buttons.className =
            "table-buttons";


        const addRowButton =
            document.createElement("button");

        addRowButton.textContent =
            "+ Строка";


        addRowButton.onclick = () => {

            addRow(tableIndex);

        };


        const addColumnButton =
            document.createElement("button");

        addColumnButton.textContent =
            "+ Столбец";


        addColumnButton.onclick = () => {

            addColumn(tableIndex);

        };


        buttons.appendChild(addRowButton);

        buttons.appendChild(
            addColumnButton
        );


        wrapper.appendChild(top);

        wrapper.appendChild(scroll);

        wrapper.appendChild(buttons);

        container.appendChild(wrapper);

    });

}


function addRow(tableIndex) {

    const table =
        tables[tableIndex];


    table.rows.push(
        new Array(
            table.columns.length
        ).fill("")
    );


    saveTables();

    showTables();
}


function addColumn(tableIndex) {

    const table =
        tables[tableIndex];


    table.columns.push(
        "Столбец " +
        (table.columns.length + 1)
    );


    table.rows.forEach(row => {

        row.push("");

    });


    saveTables();

    showTables();
}


function deleteRow(
    tableIndex,
    rowIndex
) {

    tables[
        tableIndex
    ].rows.splice(
        rowIndex,
        1
    );


    saveTables();

    showTables();
}


function deleteTable(index) {

    tables.splice(index, 1);

    saveTables();

    showTables();

    updateDashboard();

    toast("Таблица удалена");
}


/* =====================================
   СТРАНИЦЫ
===================================== */

function addPage() {

    const newPage = {

        title: "Новая страница",

        text: "",

        blocks: []

    };


    pages.push(newPage);

    currentPage =
        pages.length - 1;


    savePages();

    showPages();

    updateDashboard();

    showPage("custom");

    toast("Страница создана");
}


function showPages() {

    const container =
        document.getElementById(
            "pagesList"
        );


    container.innerHTML = "";


    pages.forEach(
        (page, index) => {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "page-list-item";


        const openButton =
            document.createElement("button");

        openButton.className =
            "page-open-button";


        openButton.innerHTML =
            "📄 " +
            escapeHTML(
                page.title ||
                "Без названия"
            );


        openButton.onclick = () => {

            currentPage = index;

            showPage("custom");

        };


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "page-delete-button";

        deleteButton.textContent =
            "×";


        deleteButton.onclick = (event) => {

            event.stopPropagation();

            deletePage(index);

        };


        wrapper.appendChild(
            openButton
        );

        wrapper.appendChild(
            deleteButton
        );


        container.appendChild(wrapper);

    });

}


function deletePage(index) {

    const pageName =
        pages[index].title ||
        "Страница";


    const confirmed =
        confirm(
            `Удалить «${pageName}»?`
        );


    if (!confirmed) {
        return;
    }


    pages.splice(index, 1);


    currentPage = null;


    savePages();

    showPages();

    updateDashboard();

    showPage("home");

    toast("Страница удалена");
}


function deleteCurrentPage() {

    if (currentPage === null) {
        return;
    }


    deletePage(currentPage);
}


/* =====================================
   РЕДАКТИРОВАНИЕ СТРАНИЦ
===================================== */

function loadCustomPage() {

    if (currentPage === null) {
        return;
    }


    const page =
        pages[currentPage];


    document
        .getElementById(
            "customPageTitle"
        )
        .value =
        page.title;


    document
        .getElementById(
            "mainPageText"
        )
        .value =
        page.text || "";


    document
        .getElementById(
            "breadcrumb"
        )
        .textContent =
        page.title;


    renderBlocks();
}


function saveCurrentPageTitle() {

    if (currentPage === null) {
        return;
    }


    const input =
        document.getElementById(
            "customPageTitle"
        );


    pages[currentPage].title =
        input.value.trim() ||
        "Без названия";


    savePages();

    showPages();


    document
        .getElementById(
            "breadcrumb"
        )
        .textContent =
        pages[currentPage].title;
}


function saveCurrentPageText(value) {

    if (currentPage === null) {
        return;
    }


    pages[currentPage].text =
        value;


    savePages();
}


/* =====================================
   БЛОКИ
===================================== */

function addTextBlock() {

    if (currentPage === null) {
        return;
    }


    pages[currentPage].blocks.push({

        type: "text",

        content: ""

    });


    savePages();

    renderBlocks();
}


function addHeadingBlock() {

    if (currentPage === null) {
        return;
    }


    pages[currentPage].blocks.push({

        type: "heading",

        content: "Новый заголовок"

    });


    savePages();

    renderBlocks();
}


function addQuoteBlock() {

    if (currentPage === null) {
        return;
    }


    pages[currentPage].blocks.push({

        type: "quote",

        content: "Новая цитата"

    });


    savePages();

    renderBlocks();
}


function deleteBlock(index) {

    pages[currentPage]
        .blocks
        .splice(index, 1);


    savePages();

    renderBlocks();
}


function renderBlocks() {

    const container =
        document.getElementById(
            "customBlocks"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (currentPage === null) {
        return;
    }


    pages[currentPage]
        .blocks
        .forEach(
            (block, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "custom-block";


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "block-delete";

            deleteButton.textContent =
                "×";


            deleteButton.onclick = () => {

                deleteBlock(index);

            };


            element.appendChild(
                deleteButton
            );


            if (
                block.type ===
                "heading"
            ) {

                const input =
                    document.createElement(
                        "input"
                    );


                input.value =
                    block.content;


                input.oninput = () => {

                    block.content =
                        input.value;

                    savePages();

                };


                element.appendChild(
                    input
                );

            }


            else if (
                block.type ===
                "quote"
            ) {

                const quote =
                    document.createElement(
                        "blockquote"
                    );


                quote.contentEditable =
                    "true";


                quote.textContent =
                    block.content;


                quote.oninput = () => {

                    block.content =
                        quote.textContent;

                    savePages();

                };


                element.appendChild(
                    quote
                );

            }


            else {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    block.content;


                textarea.placeholder =
                    "Введите текст...";


                textarea.oninput = () => {

                    block.content =
                        textarea.value;

                    savePages();

                };


                element.appendChild(
                    textarea
                );

            }


            container.appendChild(
                element
            );

        });
}


/* =====================================
   ПОИСК
===================================== */

function focusSearch() {

    showPage("tasks");


    setTimeout(() => {

        const input =
            document.getElementById(
                "searchInput"
            );


        if (input) {
            input.focus();
        }

    }, 100);
}


/* =====================================
   ТЕМА
===================================== */

function toggleTheme() {

    document.body.classList.toggle(
        "light"
    );


    const isLight =
        document.body.classList.contains(
            "light"
        );


    if (isLight) {

        document.documentElement
            .style
            .setProperty(
                "--bg",
                "#ffffff"
            );

        document.documentElement
            .style
            .setProperty(
                "--sidebar",
                "#f7f7f5"
            );

        document.documentElement
            .style
            .setProperty(
                "--hover",
                "#eeeeec"
            );

        document.documentElement
            .style
            .setProperty(
                "--text",
                "#222222"
            );

        document.documentElement
            .style
            .setProperty(
                "--muted",
                "#777777"
            );


        document
            .getElementById(
                "themeIcon"
            )
            .textContent =
            "☀";


        localStorage.setItem(
            "theme",
            "light"
        );

    }

    else {

        document.documentElement
            .style
            .setProperty(
                "--bg",
                "#191919"
            );

        document.documentElement
            .style
            .setProperty(
                "--sidebar",
                "#202020"
            );

        document.documentElement
            .style
            .setProperty(
                "--hover",
                "#2d2d2d"
            );

        document.documentElement
            .style
            .setProperty(
                "--text",
                "#e9e9e9"
            );

        document.documentElement
            .style
            .setProperty(
                "--muted",
                "#9b9b9b"
            );


        document
            .getElementById(
                "themeIcon"
            )
            .textContent =
            "☾";


        localStorage.setItem(
            "theme",
            "dark"
        );

    }
}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "theme"
        );


    if (theme === "light") {
        toggleTheme();
    }
}


/* =====================================
   DASHBOARD
===================================== */

function updateDashboard() {

    const taskCount =
        document.getElementById(
            "taskCount"
        );


    const tableCount =
        document.getElementById(
            "tableCount"
        );


    const pageCount =
        document.getElementById(
            "pageCount"
        );


    if (taskCount) {
        taskCount.textContent =
            tasks.length;
    }


    if (tableCount) {
        tableCount.textContent =
            tables.length;
    }


    if (pageCount) {
        pageCount.textContent =
            pages.length;
    }
}


/* =====================================
   ГЛАВНАЯ
===================================== */

function saveHomeTitle() {

    const input =
        document.getElementById(
            "homeTitle"
        );


    localStorage.setItem(
        "homeTitle",
        input.value
    );
}


function loadHomeTitle() {

    const saved =
        localStorage.getItem(
            "homeTitle"
        );


    if (saved) {

        document
            .getElementById(
                "homeTitle"
            )
            .value =
            saved;
    }
}


/* =====================================
   УВЕДОМЛЕНИЕ
===================================== */

function toast(message) {

    const element =
        document.getElementById(
            "toast"
        );


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(() => {

        element.classList.remove(
            "show"
        );

    }, 1800);
}


/* =====================================
   ЗАЩИТА ТЕКСТА
===================================== */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================
   ЗАПУСК
===================================== */

showPages();

showTasks();

showTables();

updateDashboard();

loadHomeTitle();

loadTheme();

loadWorkspace();

showPage("home");
/* =====================================
   WORKSPACE
===================================== */

function saveWorkspaceName() {

    const input =
        document.getElementById("workspaceName");

    const name =
        input.value.trim() || "My Workspace";

    input.value = name;

    localStorage.setItem(
        "workspaceName",
        name
    );
}


/* =====================================
   ИЗМЕНЕНИЕ ИКОНКИ WORKSPACE
===================================== */

function changeWorkspaceImage(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(e) {

        const image =
            e.target.result;

        localStorage.setItem(
            "workspaceImage",
            image
        );

        setWorkspaceImage(image);
    };

    reader.readAsDataURL(file);
}


function setWorkspaceImage(image) {

    const icon =
        document.getElementById(
            "workspaceIcon"
        );

    icon.style.backgroundImage =
        `url("${image}")`;

    icon.style.backgroundSize =
        "cover";

    icon.style.backgroundPosition =
        "center";

    icon.style.backgroundRepeat =
        "no-repeat";

    icon.textContent = "";
}


/* =====================================
   ЗАГРУЗКА WORKSPACE
===================================== */

function loadWorkspace() {

    const savedName =
        localStorage.getItem(
            "workspaceName"
        );

    const savedImage =
        localStorage.getItem(
            "workspaceImage"
        );


    const nameInput =
        document.getElementById(
            "workspaceName"
        );


    if (savedName) {

        nameInput.value =
            savedName;
    }


    if (savedImage) {

        setWorkspaceImage(
            savedImage
        );
    }
}


/* =====================================
   НАСТРОЙКИ
===================================== */

function openWorkspaceSettings() {

    const input =
        document.getElementById(
            "workspaceImageInput"
        );

    input.click();
}