const addListBtn = document.querySelector('.addList');
const listsDOM  = document.querySelector('.lists')
let lists = {}
let closeListBtns=[];
let addNoteBtns=[];
let closeNoteBtns=[];







class UI {
    
    getCloseListBtns(){
        let buttons = [...document.querySelectorAll('.listCross')];
        buttons.forEach(button => {
            button.addEventListener('click',()=>{
                delete lists[event.target.dataset.id];
                Storage.updateLists(lists);
                listsDOM.removeChild(event.target.parentElement.parentElement);
                console.log("GET CLOSE LIST EVENT");
            })
        })
    }

    getAddNoteBtns(){
        let buttons = [...document.querySelectorAll('.addNote')];
        console.log(buttons);
        buttons.forEach(button => {
            button.addEventListener('click',()=>{
                let heading = prompt('Please enter note heading');
                console.log(heading)
                let temp = lists[button.dataset.id].filter(item => item.heading === heading);
                if(heading === '' || heading === null || temp.length > 0){
                    alert('Note Creation failed');
                    return;
                }
                let desc = prompt('Please enter note description.');
                if(desc === '' || desc === null ){
                    alert('Note Creation failed');
                    return;
                }
                let list = button.parentElement;
                let referenceNode = list.firstElementChild;
                console.log('refeNOde',referenceNode)
                let note = document.createElement('div');
                note.classList.add('notes');
                note.innerHTML=`
                <div class="notesHeading">
                    <span>${heading}</span>
                    <svg class="notesCross"  data-id=${heading} style="width:18px;height:18px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                    </svg>
                </div>
                <div class="notesDesc">${desc}</div>
                `
                referenceNode.parentNode.insertBefore(note, referenceNode.nextSibling);
                lists[list.id].unshift({heading:heading,desc:desc});
                Storage.updateLists(lists);
                console.log('temp',temp)
                
                console.log(list)
                // for(const property in lists[button.dataset.id])
                // if(lists[button.dataset.id].hasOwnProperty(listHeader) || listHeader === '' || listHeader === null)
            })
        })
    }

    addListClick(){
        addListBtn.addEventListener('click',()=>{
            let listHeader = prompt("Please enter list name");
            console.log(listHeader)
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
                list.innerHTML = `
                <div class="listHeading">
                    <span>${listHeader}</span>
                    <svg class="listCross" data-id=${listHeader} style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                    </svg>
                </div>
                <svg class="addNote"  data-id=${listHeader} style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
                </svg>
                `
                let listCross = list.querySelector('.listCross');
                let NotesAddBtn = list.querySelector('.addNote');
                listCross.addEventListener('click',(event)=> {
                    delete lists[event.target.dataset.id];
                    Storage.updateLists(lists);
                    listsDOM.removeChild(event.target.parentElement.parentElement);
                })
                NotesAddBtn.addEventListener('click',()=>{
                    let heading = prompt('Please enter note heading');
                    console.log(heading)
                    let temp = lists[NotesAddBtn.dataset.id].filter(item => item.heading === heading);
                    if(heading === '' || heading === null || temp.length > 0){
                        alert('Note Creation failed');
                        return;
                    }
                    let desc = prompt('Please enter note description.');
                    if(desc === '' || desc === null ){
                        alert('Note Creation failed');
                        return;
                    }
                    let list = NotesAddBtn.parentElement;
                    let referenceNode = list.firstElementChild;
                    console.log('refeNOde',referenceNode)
                    let note = document.createElement('div');
                    note.classList.add('notes');
                    note.innerHTML=`
                    <div class="notesHeading">
                        <span>${heading}</span>
                        <svg class="notesCross"  data-id=${heading} style="width:18px;height:18px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                        </svg>
                    </div>
                    <div class="notesDesc">${desc}</div>
                    `
                    referenceNode.parentNode.insertBefore(note, referenceNode.nextSibling);
                    lists[list.id].unshift({heading:heading,desc:desc});
                    Storage.updateLists(lists);
                    console.log('temp',temp)
                    
                    console.log(list)
                    // for(const property in lists[button.dataset.id])
                    // if(lists[button.dataset.id].hasOwnProperty(listHeader) || listHeader === '' || listHeader === null)
                })
                this.addListToDom(list)
                Storage.updateLists(lists)
            }
            console.log('clicked add list')
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
            lists[property].forEach(note => {
                let noteDom = document.createElement('div');
                noteDom.classList.add('notes');
                noteDom.innerHTML=`
                <div class="notesHeading">
                    <span>${note.heading}</span>
                    <svg class="notesCross" data-id=${note.heading} style="width:18px;height:18px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                    </svg>
                </div>
                <div class="notesDesc">${note.desc}</div>
                `
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