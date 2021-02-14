const addListBtn = document.querySelector('.addList');
const listsDOM  = document.querySelector('.lists')
let lists = {}








class UI {

    bindCloseListEvent(button){
        button.addEventListener('click',()=>{
            delete lists[event.target.dataset.id];
            Storage.updateLists(lists);
            listsDOM.removeChild(event.target.parentElement.parentElement);
        })
    }

    bindAddNotesEvent(button){
        button.addEventListener('click',()=>{
            let heading = prompt('Please enter note heading').trim();
            if(heading === '' || heading === null){
                alert('Note Creation failed');
                return;
            }
            let desc = prompt('Please enter note description.');
            let tempX=[];
            for(let property in lists){
                lists[property].forEach(note => {
                    if(note.heading === heading && note.desc === desc){
                        tempX.push(note);
                    }
                })
            }

            if(desc === '' || desc === null ||  tempX.length > 0 ){
                if(tempX.length > 0){
                    alert('Duplicate note exists. Note Creation failed.')
                    return;
                }
                alert('Note Creation failed.');
                return;
            }
            let list = button.parentElement;
            let referenceNode = list.firstElementChild;
            let note = document.createElement('div');
            note.classList.add('notes');
            note.id=heading+desc;
            note.dataset.id=heading;
            note.dataset.heading=heading;
            note.dataset.desc=desc;
            note.draggable = true;
            note.addEventListener('dragstart',(event)=>this.dragStart(event,note.id))
            note.addEventListener('dragend',this.dragEnd)
            note.innerHTML=`
            <div class="notesHeading">
                <span>${heading}</span>
                <svg class="notesCross"  data-id=${JSON.stringify(heading)} data-desc=${JSON.stringify(desc)} style="width:18px;height:18px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                </svg>
            </div>
            <div class="notesDesc">${desc}</div>
            `
            let notesCross = note.querySelector('.notesCross')
            this.bindCloseNoteEvent(notesCross)
            list.insertBefore(note, referenceNode.nextSibling);
            lists[list.id].unshift({heading:heading,desc:desc});
            Storage.updateLists(lists);
        })
    }

    dragStart(event,noteId){
        let listId = document.getElementById(noteId).parentElement.id
        event.dataTransfer.setData("originalListId", listId);
        event.target.classList.add('dragging')
    }

    dragEnd(event) {
        event.target.classList.remove('dragging')
    }

    dragOver(event) {
        event.preventDefault();
    }

    dragDrop(event) {
        event.preventDefault();
        if(event.target.id){
            let originalListId = event.dataTransfer.getData("originalListId");
            const dragNote = document.querySelector('.dragging');
            let list = document.getElementById(event.target.id);
            let oldList = document.getElementById(originalListId);
            if(list.id === oldList.id)
                return;

            lists[list.id].unshift({heading:dragNote.dataset.heading,desc:dragNote.dataset.desc});
            lists[oldList.id]=lists[oldList.id].filter(note => ( note.heading !== dragNote.dataset.heading && note.desc !== dragNote.dataset.desc));
            Storage.updateLists(lists);
            // Add note in new list
            let referenceNode = list.firstElementChild;
            list.insertBefore(dragNote, referenceNode.nextSibling);
        }
    }

    bindCloseNoteEvent(button){
        button.addEventListener('click',()=>{
            for(let property in lists){
                lists[property]=lists[property].filter(note =>  (note.heading !== button.dataset.id || note.desc !== button.dataset.desc))
            }
            Storage.updateLists(lists);
            button.parentElement.parentElement.parentElement.removeChild(button.parentElement.parentElement)
        })
    }

    getCloseListBtns(){
        let buttons = [...document.querySelectorAll('.listCross')];
        buttons.forEach(button => {
            this.bindCloseListEvent(button);
        })
    }

    getAddNoteBtns(){
        let buttons = [...document.querySelectorAll('.addNote')];
        buttons.forEach(button => {
            this.bindAddNotesEvent(button)
        })
    }

    addListClick(){
        addListBtn.addEventListener('click',()=>{
            let listHeader = prompt("Please enter list name").trim();
            if(lists.hasOwnProperty(listHeader) || listHeader === '' || listHeader === null){
                if(listHeader === ''){
                    alert('Please enter a name for the list')
                    return;
                }
                alert('List creation failed. List name already in use.')
            }
            else{
                lists[listHeader]=[];
                let list = document.createElement('div')
                list.classList.add('list');
                list.id= listHeader
                listHeader=JSON.stringify(listHeader)
                list.innerHTML = `
                <div class="listHeading">
                    <span>${JSON.parse(listHeader)}</span>
                    <svg class="listCross" data-id=${listHeader} style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                    </svg>
                </div>
                <svg class="addNote"  data-id=${listHeader} style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
                </svg>
                `
                list.addEventListener('dragover',function(event) {
                    event.preventDefault();
                });
                list.addEventListener('drop',this.dragDrop);
                let listCross = list.querySelector('.listCross');
                let NotesAddBtn = list.querySelector('.addNote');
                this.bindCloseListEvent(listCross)
                this.bindAddNotesEvent(NotesAddBtn)
                this.addListToDom(list)
                Storage.updateLists(lists)
            }
        })
    }

    
    addListToDom(list){
        listsDOM.appendChild(list)
    }

    setupApp(){
        lists = Storage.getLists();
        this.renderLists(lists);
        this.getCloseListBtns();
        this.getAddNoteBtns();
        this.addListClick();
        
    }

    renderLists(lists){
        for(let property in lists){
            let list = document.createElement('div')
            list.classList.add('list');
            list.id = property;
            list.innerHTML = `
            <div class="listHeading">
                <span>${property}</span>
                <svg class="listCross" data-id=${property} style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                </svg>
            </div>
            <svg class="addNote" data-id=${property} style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
            </svg>
            `
            list.addEventListener('dragover',function(event) {
                event.preventDefault();
            });
            list.addEventListener('drop',this.dragDrop);
            lists[property].forEach(note => {
                let noteDom = document.createElement('div');
                noteDom.id=note.heading+note.desc
                noteDom.dataset.id=note.heading;
                noteDom.dataset.heading=note.heading;
                noteDom.dataset.desc=note.desc;
                noteDom.classList.add('notes');
                noteDom.draggable = true;
                noteDom.addEventListener('dragstart',(event) => this.dragStart(event,noteDom.id))
                noteDom.addEventListener('dragend',this.dragEnd)
                noteDom.innerHTML=`
                <div class="notesHeading">
                    <span>${note.heading}</span>
                    <svg class="notesCross" data-id=${JSON.stringify(note.heading)} data-desc=${JSON.stringify(note.desc)} style="width:18px;height:18px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                    </svg>
                </div>
                <div class="notesDesc">${note.desc}</div>
                `
                let notesCross = noteDom.querySelector('.notesCross');
                this.bindCloseNoteEvent(notesCross);
                list.appendChild(noteDom)
            })
            this.addListToDom(list)
        }
    }
}

class Storage {
    static getLists(){
        return localStorage.getItem('lists')?JSON.parse(localStorage.getItem('lists')):{};
    }
    static updateLists(lists){
        localStorage.setItem('lists',JSON.stringify(lists));
    }
        
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    ui.setupApp();
})