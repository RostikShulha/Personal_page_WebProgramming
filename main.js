const headerEl = document.getElementById("header")

window.addEventListener("scroll", function(){
    const scrollPos = window.scrollY
    if(scrollPos > 50){
        headerEl.classList.add("header_mini")
    } else{
        headerEl.classList.remove("header_mini")
    }
})

document.addEventListener("DOMContentLoaded", () => {
    let currentNode = document.body; // Початковий вузол
    let parentNodeStack = []; // Стек для повернення назад
    const rootNode = currentNode; // Початок дерева

    // Функція обробки вузла
    const traverseDOM = (node, callback) => {
        if (!node) {
            const restart = confirm("Це був останній вузол DOM. Почати з початку?");
            if (restart) {
                return callback("restart");
            } else {
                return callback("exit");
            }
        }

        let nodeDescription;

        if (node.nodeType === Node.ELEMENT_NODE) {
            nodeDescription = `<${node.tagName.toLowerCase()}>`;
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            nodeDescription = `Текстовий вузол: "${node.textContent.trim()}"`;
        } else {
            return callback("next"); // Пропуск коментарів та порожніх текстових вузлів
        }

        const message = `Поточний вузол: ${nodeDescription}\n\nЩо робити далі?\n- OK: Перейти до наступного\n- Cancel: Завершити`;
        const action = confirm(message);

        if (action) {
            callback("next");
        } else {
            callback("exit");
        }
    };

    // Обхід DOM
    const navigateDOM = (node) => {
        traverseDOM(node, (action) => {
            if (action === "next") {
                // Якщо є дочірній вузол - перейти до нього
                if (node.firstChild) {
                    parentNodeStack.push(node); // Зберігання вузла
                    navigateDOM(node.firstChild);
                } 
                // Якщо немає дочірніх вузлів - перейти до сусіднього
                else if (node.nextSibling) {
                    navigateDOM(node.nextSibling);
                } 
                // Якщо немає сусіднього - піднятися до батьківського і шукати новий
                else {
                    let parent = parentNodeStack.pop();
                    while (parent && !parent.nextSibling) {
                        parent = parentNodeStack.pop();
                    }
                    if (parent && parent.nextSibling) {
                        navigateDOM(parent.nextSibling);
                    } else {
                        const restart = confirm("Це був останній вузол DOM. Хочете почати з початку?");
                        if (restart) {
                            navigateDOM(rootNode);
                        }
                    }
                }
            } else if (action === "back") {
                // До попереднього вузла
                const parent = parentNodeStack.pop();
                if (parent) {
                    navigateDOM(parent);
                } else {
                    alert("Ви вже на початку.");
                }
            } else if (action === "restart") {
                // З початку дерева
                parentNodeStack = [];
                navigateDOM(rootNode);
            } else if (action === "exit") {
                alert("Навігацію завершено.");
            }
        });
    };

    // Початок навігації
    alert("Початок обходу DOM-дерева");
    navigateDOM(currentNode);
});
