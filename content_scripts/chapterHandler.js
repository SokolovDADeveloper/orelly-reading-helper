window.preventTranslate = (elem) => {
    elem.setAttribute("translate", "no");
    elem.classList.add("notranslate");
};
window.addDataOriginTextContent = (elem) => {
    if (!("dataset" in elem)) {
        return;
    }

    elem.dataset.originTextContent = elem.textContent;
};

window.toNextPageRedirect_global = () => {
    const nextHref = document.querySelector(".next").href
    window.location.href = nextHref
}

function handleChapter() {

    const $bottomButtonsPanel = createBottomButtonsPanel();
    document.body.appendChild($bottomButtonsPanel);


    fixBugRedirectToNextPage();
    addBtnShowNote();
    addButtonShowOriginTextVisibleElements();

    handleAllParagraphs();
    removeJsSubscribeNag();
    HandleCodeBlocks();
    addAllClickHandlers();
    autoScrollToStartArticle();
    addSpaceAtStickyWords();


    // (КОСТЫЛЬ)
    //addSpaceAtStickyWords(); // (ВРЕМЕННО)

    // Автоматическая прокрутка к началу страницы
    function autoScrollToStartArticle() {
        window.scrollTo(0, 0)
    }

    // Фикс перехода на следующую страницу
    function fixBugRedirectToNextPage() {
        const $next = document.querySelector('.t-sbo-next.sbo-next.sbo-nav-top');
        if (!$next) {
            return
        }

        $next.onclick = toNextPageRedirect

        function toNextPageRedirect(event) {
            event.preventDefault()
            const nextHref = event.currentTarget.querySelector(".next").href
            window.location.href = nextHref
        }
    }

    // Обработка блоков кода
    function HandleCodeBlocks() {
        let allCodeBlocks = getAllCodeBlocks();

        if (allCodeBlocks.length === 0) {
            return;
        }

        allCodeBlocks.forEach($block => {
            preventTranslate($block);
            addClassCodeBlock($block);
            addButtonCodeCopy($block);
            highlightBlock($block);
        });


        ///
        function getAllCodeBlocks() {
            let allCodeBlocks = [];
            return allCodeBlocks.concat([...document.getElementsByClassName('ProgramCode')], [...document.getElementsByTagName("PRE")], [...document.getElementsByClassName('processedcode')]);
// processedcode
        }

        ///
        function addClassCodeBlock(elem) {
            elem.classList.add("codeBlock");
        }

        ///
        function addButtonCodeCopy(elem) {
            const btn = createBtnCodeCopy();
            elem.parentNode.insertBefore(btn, elem.nextSibling);

            function createBtnCodeCopy() {
                const btn = document.createElement("Button");
                btn.innerHTML = "CopyCode";
                btn.id = "copy_code";
                preventTranslate(btn);
                return btn;
            }
        }

        ///
        function highlightBlock(elem) {
            if (!hljs) {
                alert("Not Found HLJS!");
                return;
            }

            hljs.highlightBlock(elem);
        }
    }

    // Удаление предложения подписаться
    function removeJsSubscribeNag() {
        const $jsSubscribeNag = document.querySelector('#js-subscribe-nag');
        if ($jsSubscribeNag) $jsSubscribeNag.remove();
    }

    /// Обработка всех параграфов
    function handleAllParagraphs() {
        const allTagsP = document.querySelectorAll('P');
        allTagsP.forEach($p => {
            // Пропустить "пустые"
            if ($p.textContent && $p.textContent !== "") {
                addDataOriginTextContent($p);
                addButtonCopyText($p);
                fixStickyWords($p);
            }
        });

        // Фикс "слипания" текста и кода при переводе текста
        function fixStickyWords($p) {
            const internalCodes = [...$p.getElementsByTagName("CODE")]
            internalCodes.forEach($code => {
                try {
                    $code.innerText = $code.innerText + " ";
                } catch (e) {
                    return;
                }

            })
        }

        // Добавление кнопки скопировать текст
        function addButtonCopyText($p) {
            const btn = createBtnParagraphTextCopy();
            $p.parentNode.insertBefore(btn, $p.nextElementSibling)
        }

        //
        function createBtnParagraphTextCopy() {
            const btn = document.createElement("Button");
            preventTranslate(btn);
            btn.innerHTML = "ADD";
            btn.id = "addToNote";
            return btn;
        }

        //
    }

    // Добавление кнопки "Показать оригинальный текст видимых элементов"
    function addButtonShowOriginTextVisibleElements() {
        const btn = document.createElement("Button");
        btn.id = "showOriginTextVisibleElements";
        btn.innerHTML = "SHOW";
        btn.setAttribute("style", "color:yellow;");
        $bottomButtonsPanel.appendChild(btn);
    }

    // Добавление кнопки "Показать заметки"
    function addBtnShowNote() {
        const btn = document.createElement("BUTTON");
        btn.id = "showNote";
        btn.innerHTML = "showNote";
        btn.setAttribute("style", "color:blue;");
        $bottomButtonsPanel.appendChild(btn);
    }

    // Добавить пробел в слипшиеся слова (ОТКЛЮЧЕНО)
    function addSpaceAtStickyWords() {
        const allTagP = [...document.getElementsByTagName('P')];
        if (allTagP.length === 0) return;
        allTagP.forEach($tagP => changeText($tagP));

        function changeText($tagP) {
            const TagsCode = [...$tagP.getElementsByTagName('code')];
            if (TagsCode.length === 0) return;

            TagsCode.forEach($code => addSpaceToText($code));

            function addSpaceToText($code) {
                $code.innerText = $code.innerText + " ";
            }
        }
    }

    // Создание нижней панели кнопок
    function createBottomButtonsPanel() {
        const $bottomButtonsPanel = document.createElement("DIV");
        preventTranslate($bottomButtonsPanel);
        $bottomButtonsPanel.id = "bottomButtonsPanel";
        $bottomButtonsPanel.setAttribute("style", "position:fixed;bottom:0;padding:0;width:100%;display:flex;flex-flow:row-reverse nowrap;");
        return $bottomButtonsPanel;
    }

    // Добавление обработчиков кликов
    function addAllClickHandlers() {
        document.addEventListener("click", callTargetHandler, false);
        // Добавление обработчика кликов клавиатуры
        document.addEventListener('keydown', (event) => {

            if (!(event.ctrlKey || event.altKey || event.metaKey || event.shiftKey)) {
                return handleKeydownWithoutModifierKeys(event)
            }

        });

        //
        function callTargetHandler(event) {
            let target;
            if (event.target && event.target.id) {
                target = event.target
            } else {
                return;
            }

            if (target.id === "showOriginTextVisibleElements") {
                handleButtonShowOriginTextVisibleElements();
                return;
            }

            if (target.id === "addToNote") {
                handleClickBtnParagraphTextCopy(target)
                return
            }

            if (target.id === "showNote") {
                handleBtnShowNote()
                return
            }

            if (target.id === "copy_code") {
                handleBtnCopyCode(target)
                return
            }

            // "Показать оригинальный текст"
            function handleButtonShowOriginTextVisibleElements() {
                const allTargetElements = getInViewportElements();
                allTargetElements.forEach(elemVisibleInViewport => {

                    if (!("dataset" in elemVisibleInViewport) || !(elemVisibleInViewport.dataset.originTextContent)) {
                        return;
                    }

                    const newElem = createOriginElement(elemVisibleInViewport);
                    elemVisibleInViewport.insertBefore(newElem, elemVisibleInViewport.firstChild);
                });

                function getInViewportElements() {
                    const els = [...document.getElementsByTagName("P")];
                    const targetEls = els.filter(el => {
                        let rect = el.getBoundingClientRect();
                        return (
                            rect.top >= 0 &&
                            rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                        );
                    });

                    return targetEls;
                }

                function createOriginElement(elem) {
                    const originElem = document.createElement("P");
                    preventTranslate(originElem);
                    const originInnerText = getOriginText(elem);
                    originElem.style.color = "#9654AE";
                    originElem.innerText = originInnerText;
                    return originElem;

                    function getOriginText(elem) {
                        const text = elem.dataset.originTextContent || "Without originTextContent";
                        return text;
                    };
                }
            }

            // Обработчик клика кнопки "Добавить в заметку"
            function handleClickBtnParagraphTextCopy(target) {
                const $popupNote = document.getElementById("popupNote").querySelector('.popupNoteCopiedContent');
                const $targetForCopy = target.previousElementSibling
                const cloneTarget = $targetForCopy.cloneNode(true);
                $popupNote.appendChild(cloneTarget)
            }

            // Обработчик кнопки "Показать заметку"
            function handleBtnShowNote() {
                const $popupNote = document.getElementById("popupNote")
                $popupNote.classList.toggle("visible")
            }

            // Обработчик кнопки "Добавить код"
            function handleBtnCopyCode(target) {
                const $popupNote = document.getElementById("popupNote").querySelector('.popupNoteCopiedContent');
                const $targetForCopy = target.previousElementSibling
                const cloneTarget = $targetForCopy.cloneNode(true);
                $popupNote.appendChild(cloneTarget)

                const br = document.createElement("BR");
                $popupNote.appendChild(br)
            }
        }
        // Переход на следующую страницу
        function handleKeydownWithoutModifierKeys(event) {
            if (event.key === "ArrowRight") {
                return window.toNextPageRedirect_global()
            }
        }
    }

}

handleChapter();





