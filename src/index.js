import { compareAsc, format } from "date-fns";

import "./style.css";

const inTitle = document.querySelector("input#title");
const date = document.querySelector("input#date");
let radio = [...document.querySelectorAll("input.rad")];
const area = document.querySelector("textarea");
const sub = document.querySelector(".create");
let radIn = document.querySelector("#newInput");
const sidebar = document.querySelector('.sidebar');
let slider = document.querySelector('.slider');
let useName = document.querySelector('.input-like');




function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);

    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

storageAvailable("localStorage");

let userStorage = {
    "userData":{
        "username":"User", 
        "tasksCompleted": 0,
    },
    "userProjects":{
        "Starting JonesDo":{
            "How To...":{
                "due":"2025-06-12",
                "projName":"Starting JonesDo",
                "description":"Make you first task by clicking the submit task button below. Almost all fields are editable. Click the checkbox under a tab to complete it. Create a new project by clicking on 'new project' and inputing your new project's name!",
                "color":"red"
            },
        },
    }
};
if (!localStorage.getItem("userProjects")) {
    setStorage(); // store defaults
} else {
    getStorage(); // load saved
}



function hideChildren(self){
    const hide = [...self.parentNode.querySelectorAll(".taskTile")];
    hide.forEach((val=>val.style.display='none'));
}
function showChildren(self){
    const hide = [...self.parentNode.querySelectorAll(".taskTile")];
    hide.forEach((val=>val.style.display='flex'));
}

function checkDisplay(self){
    
    const children = [...self.parentNode.querySelectorAll('.taskTile')];
    let flag = false
    children.forEach((kid)=>{
        flag = kid.style.display=='none'
    });
    return flag
}

function popToForm(self){
    let taskTitle = self.closest(".taskTile").querySelector("h4");
    let projTitle = self.closest(".project").querySelector(".projectTitle>h3");
    getStorage();
    let taskData = userStorage["userProjects"][projTitle.textContent][taskTitle.textContent];

    inTitle.value=taskTitle.textContent;
    date.value=taskData["due"];
    slider.value=toNum(userStorage['userProjects'][projTitle.textContent][taskTitle.textContent]["color"]);
    radio.forEach((element)=>{
        if(element.value==projTitle.textContent){
            element.checked=true;
        }
        else{
            element.checked=false;
        }
    });
    area.value=taskData["description"]
    setStorage();
}

function unpopForm(self){
    let taskTitle = self.closest(".taskTile").querySelector("h4");
    let projTitle = self.closest(".project").querySelector(".projectTitle>h3");
    getStorage();
    delete userStorage["userProjects"][projTitle.textContent][taskTitle.textContent];
    setStorage();

    let proj ="";
    radio.forEach((element)=>{
        if(element.checked){
            proj=element.value
        }
    });

    getStorage();
    userStorage["userProjects"][proj] ??= {};
    userStorage["userProjects"][proj][inTitle.value] ??= {};

    userStorage["userProjects"][proj][inTitle.value]["due"]=date.value;
    date.value="";
    userStorage["userProjects"][proj][inTitle.value]["projName"]=proj;
    userStorage["userProjects"][proj][inTitle.value]["description"]=area.value;
    area.value="";
    for(let i=0; i<radio.length;i++){
        i==0?radio[i].checked=true:radio[i].checked=false;
    }
    userStorage['userProjects'][proj][inTitle.value]["color"]=toColor(slider.value);
    slider.value="3";
    inTitle.value="";
    radIn.value="";
    setStorage();
}

function checkPlus(){
    allPop = [...document.querySelectorAll(".right>button")]
    let pop = allPop.filter((e)=>e.textContent=='–');
    if(pop.length>0){
        return pop[0]
    }
}

function choosePop(self){
    if(checkDisplay(self)){
        showChildren(self);
    }
    else{
        hideChildren(self);
    }
}

// function newProject(){
//     let proj = radIn.value;
//     userStorage["userProjects"][proj][inTitle.value]={
//         "due":date.value,
//         "projName":proj,
//         "description":area.value
//     }
// }

function setStorage(){
    
    if(storageAvailable("localStorage")){
        localStorage.setItem("userProjects", JSON.stringify(userStorage["userProjects"]));
        localStorage.setItem("userData", JSON.stringify(userStorage["userData"]));
    }
}

function getStorage(){
    
    if(storageAvailable("localStorage") && localStorage.getItem("userProjects")){
        userStorage["userProjects"] = JSON.parse(localStorage.getItem("userProjects"));
        userStorage["userData"] = JSON.parse(localStorage.getItem("userData"));
    }
}

//populate DOM from storage.

function populateProject(projectName){
    getStorage();
    let container = document.createElement('div');
    container.classList.add('project');
        let topTile = document.createElement('div');
        topTile.classList.add('projectTitle');
            let top = document.createElement('h3');
            top.textContent=projectName;
            topTile.appendChild(top);

            let flip = document.createElement('button');
            flip.textContent='^';
            topTile.appendChild(flip);
        container.appendChild(topTile);

        for(const task in userStorage['userProjects'][projectName]){
            let tile = document.createElement('div');
            tile.classList.add("taskTile");
            console.log(userStorage['userProjects'][projectName][task]["color"])
            tile.classList.add(userStorage['userProjects'][projectName][task]["color"]);
            tile.style.display='none';
                let left = document.createElement('div');
                left.classList.add('left');
                    let title = document.createElement('h4');
                    title.textContent=task;
                    left.appendChild(title);

                    let cont = document.createElement('div');
                        let dueBy = document.createElement('div');
                        let sorted = `${userStorage['userProjects'][projectName][task]["due"].slice(5,7)}/${userStorage['userProjects'][projectName][task]["due"].slice(8)}/${userStorage['userProjects'][projectName][task]["due"].slice(0,4)}`;
                        dueBy.textContent=sorted
                        cont.appendChild(dueBy);

                        let check = document.createElement('input');
                        check.type="checkbox"
                        cont.appendChild(check);
                    left.appendChild(cont);
                tile.appendChild(left);

                let right = document.createElement('div');
                right.classList.add('right');
                    let plus = document.createElement('button');
                    plus.textContent='+';
                    right.appendChild(plus);
                tile.appendChild(right);
            container.appendChild(tile);
        }
    sidebar.appendChild(container);

}

function toColor(){
    let send = ""
    switch (slider.value){
        case "1":
            send = 'blue';
            break;
        case "2":
            send = 'green';
            break;
        case "3":
            send = 'yellow';
            break;
        case "4":
            send = 'orange';
            break;
        case "5":
            send = 'red';
            break;
    }
    return send
}
function toNum(color){
    let send = ""
    switch (color){
        case 'blue':
            send = '1';
            break;
        case 'green':
            send = '2';
            break;
        case 'yellow':
            send = '3';
            break;
        case 'orange':
            send = '4';
            break;
        case 'red':
            send = '5';
            break;
    }
    return send
}

function daysAway(a, b){
    return a.replaceAll("-","")<b.replaceAll("-","")
}

function populateSidebar(){
    getStorage();
    for(let i in userStorage['userProjects']){
        if (userStorage['userProjects'].hasOwnProperty(i)) {
            populateProject(i);
        }
    }
}
function clearSidebar(){
    Array.from(sidebar.children).forEach(child => child.remove());
}

function populateRadios(){
    const field = document.querySelector('fieldset');
    for(let i in userStorage['userProjects']){
        let div = document.createElement('div')
            let inp = document.createElement('input');
            inp.type='radio';
            inp.id=i;
            inp.name='project';
            inp.value=i;
            inp.classList.add('rad');
            div.appendChild(inp);

            let lab = document.createElement('label');
            lab.for=i;
            lab.classList.add('lab')
            lab.textContent=i;
            div.appendChild(lab);
        field.appendChild(div);
    }
    let div = document.createElement('div');
        let inp = document.createElement('input');
        inp.type='radio';
        inp.id='newProject';
        inp.name='project';
        inp.value="New Project";
        inp.classList.add('rad');
        div.appendChild(inp);

        let lab = document.createElement('label');
        lab.for='newProject';
        lab.classList.add('lab');
            let miniput = document.createElement('input');
            miniput.placeholder="New Project";
            miniput.id="newInput";
            lab.appendChild(miniput);
        div.appendChild(lab);
        console.log(div);
    field.appendChild(div);

    radio = [...document.querySelectorAll("input.rad")];
    radIn = document.querySelector("#newInput");

    for(let i=0; i<radio.length;i++){
        i==0?radio[i].checked=true:radio[i].checked=false;
    }
}

function removeRadio(){
    radio.forEach((element)=>element.remove());
    let labels = [...document.querySelectorAll('.lab')];
    labels.forEach((element)=>element.remove());
}

function removeTask(element){
    let task = element.parentNode.parentNode.querySelector('h4');
    let project = element.parentNode.parentNode.parentNode.parentNode.querySelector('h3');
    delete userStorage['userProjects'][project.textContent][task.textContent];
    clearSidebar();
    populateSidebar();
    resetListeners();
}

useName.textContent=userStorage['userData']['username'];

clearSidebar();
populateSidebar();
removeRadio();
populateRadios();

function createTask(){
    getStorage();
    let projectRadio = radio.filter(e=>e.checked)[0];
    let hold = projectRadio.value
    if(hold == "New Project"){
        hold=radIn.value;
        userStorage["userProjects"][hold] ??= {};
    }
    userStorage["userProjects"][hold][inTitle.value] ??= {};
    userStorage["userProjects"][hold][inTitle.value]["due"]=date.value;
    date.value="";
    userStorage["userProjects"][hold][inTitle.value]["projName"]=hold;
    userStorage["userProjects"][hold][inTitle.value]["description"]=area.value;
    area.value="";
    userStorage["userProjects"][hold][inTitle.value]["color"]=toColor();
    console.log(userStorage["userProjects"][hold][inTitle.value]["color"]);
    for(let i=0; i<radio.length;i++){
        i==0?radio[i].checked=true:radio[i].checked=false;
    }
    inTitle.value="";
    radIn.value="";
    setStorage();
}

function resetListeners() {
    let allExpand = [...document.querySelectorAll('.projectTitle>button')];
    allExpand.forEach((val)=>val.addEventListener('click',()=>{
        val.textContent=='^'?val.textContent='v':val.textContent='^';
        choosePop(val.parentNode);
    }));

    let allPop = [...document.querySelectorAll(".right>button")];
    allPop.forEach((val)=>val.addEventListener('click',()=>{
        if(val.textContent=='–'){
            document.querySelector('fieldset').style.display='flex';
            document.querySelector('.inputCont').style.display='flex';
            val.textContent='+';
            unpopForm(val);
            clearSidebar();
            populateSidebar();
            resetListeners();
        }
        else{
            document.querySelector('fieldset').style.display='none';
            document.querySelector('.inputCont').style.display='none';
            if(checkPlus()){
                unpopForm(checkPlus());
                checkPlus().textContent='+';
            }
            val.textContent='–';
            popToForm(val);
        }
    }));

    let allCheck = [...document.querySelectorAll('input[type=checkbox]')];
    allCheck.forEach((element)=>element.addEventListener('click',()=>removeTask(element)));
}





//eventListeners

let allCheck = [...document.querySelectorAll('input[type=checkbox]')];
allCheck.forEach((element)=>element.addEventListener('click',()=>removeTask(element)));

sub.addEventListener('click',()=>{
    if(checkPlus()){
        document.querySelector('fieldset').style.display='flex';
        document.querySelector('.inputCont').style.display='flex';
        unpopForm(checkPlus());
        checkPlus().textContent='+';
        clearSidebar();
        populateSidebar();
        resetListeners();
    }
    else{
        createTask();
        console.table(userStorage['userProjects']);
        clearSidebar();
        populateSidebar();
        resetListeners();
        removeRadio();
        populateRadios();
    }
});

let allExpand = [...document.querySelectorAll('.projectTitle>button')];
allExpand.forEach((val)=>val.addEventListener('click',()=>{
    val.textContent=='^'?val.textContent='v':val.textContent='^';
    choosePop(val.parentNode);
}));

let allPop = [...document.querySelectorAll(".right>button")];
allPop.forEach((val)=>val.addEventListener('click',()=>{
    if(val.textContent=='–'){
        document.querySelector('fieldset').style.display='flex';
        document.querySelector('.inputCont').style.display='flex';
        val.textContent='+';
        unpopForm(val);
        clearSidebar();
        populateSidebar();
        resetListeners();
    }
    else{
        document.querySelector('fieldset').style.display='none';
        document.querySelector('.inputCont').style.display='none';
        if(checkPlus()){
            unpopForm(checkPlus());
            checkPlus().textContent='+';
        }
        val.textContent='–';
        popToForm(val);
    }
}));
useName.addEventListener('keydown',()=>{
    getStorage();
    userStorage['userData']['username']=useName.textContent;
    setStorage();

})