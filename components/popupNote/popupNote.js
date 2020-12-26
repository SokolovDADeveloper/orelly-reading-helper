
const note = `<div id="popupNote">
    <div class="popupNoteHeader"><h1>Note</h1></div>
    <div class="popupNoteCopiedContent" contentEditable='true'></div>
    <div class="popupNoteButtonsPanel">
        <button class="cutAll">cutAll</button>
    </div>
</div>`


function injectPopupNote(note){
    const container = document.getElementById('container')
    container.insertAdjacentHTML('beforeend', note);
}

injectPopupNote(note)

