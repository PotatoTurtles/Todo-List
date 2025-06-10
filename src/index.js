import { compareAsc, format } from "date-fns";

import "./style.css";

const inTitle = document.querySelector("input#title");
const date = document.querySelector("input#date");
const radio = [...document.querySelectorAll("input.rad")];
const area = document.querySelector("textarea");
const sub = document.querySelector(".create");
const radIn = document.querySelector("#newInput");
const sidebar = document.querySelector('.sidebar')




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
console.log("hello world");

let userStorage = {
    "userData":{
        username:"User", 
        tasksCompleted: 0,
    },
    "userProjects":{
        "Project Title":{
            "Title":{
                "due":"2025-08-20",
                "projName":"Project Title",
                "description":"Idk u gotta do work homi pls. Ur finna get fired atp!"
            },
            "2nd":{
                "due":"2026-11-5",
                "projName":"Project Title",
                "description":"It eez what it eez"
            }
        },
        "Work":{
            "Title":{
                "due":"2025-08-20",
                "projName":"Project Title",
                "description":"Idk u gotta do work homi pls. Ur finna get fired atp!"
            },
            "2nd":{
                "due":"2026-11-5",
                "projName":"Project Title",
                "description":"It eez what it eez"
            }
        }
    }
};



function hideChildren(self){
    const hide = [...self.parentNode.querySelectorAll(".taskTile")];
    hide.forEach((val=>val.style.display='none'));
}
function showChildren(self){
    console.log("made it!");
    const hide = [...self.parentNode.querySelectorAll(".taskTile")];
    hide.forEach((val=>val.style.display='flex'));
}

function checkDisplay(self){
    
    const children = [...self.parentNode.querySelectorAll('.taskTile')];
    let flag = false
    children.forEach((kid)=>{
        console.log(kid.style.display);
        flag = kid.style.display=='none'
    });
    return flag
}

function popToForm(self){
    let taskTitle = self.closest(".taskTile").querySelector("h4");
    let projTitle = self.closest(".project").querySelector(".projectTitle>h3");
    let taskData = userStorage["userProjects"][projTitle.textContent][taskTitle.textContent];

    inTitle.value=taskTitle.textContent;
    date.value=taskData["due"];
    radio.forEach((element)=>{
        if(element.value==projTitle.textContent){
            element.checked=true;
        }
        else{
            element.checked=false;
        }
    });
    area.value=taskData["description"]
    
}

function unpopForm(self){
    let taskTitle = self.closest(".taskTile").querySelector("h4");
    let projTitle = self.closest(".project").querySelector(".projectTitle>h3");
    delete userStorage["userProjects"][projTitle.textContent][taskTitle.textContent];

    

    let proj ="";
    radio.forEach((element)=>{
        if(element.checked){
            proj=element.value
        }
    });

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
    inTitle.value="";
    radIn.value="";
}

function checkPlus(){
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

function newProject(){
    let proj = radIn.value;
    userStorage["userProjects"][proj][inTitle.value]={
        "due":date.value,
        "projName":proj,
        "description":area.value
    }
}

//populate DOM from storage.
function populateProject(projectName){
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
            tile.style.display='none';
                let left = document.createElement('div');
                left.classList.add('left');
                    let title = document.createElement('h4');
                    title.textContent=task;
                    left.appendChild(title);

                    let cont = document.createElement('div');
                        "2025-08-20"
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
populateProject("Project Title");
populateProject("Work");







//eventListeners
sub.addEventListener('click',()=>{
    if(checkPlus()){
        unpopForm(checkPlus());
        checkPlus().textContent='+';
    }
    else{
        let project = radio.filter(e=>e.checked)[0];
        if(userStorage["userProjects"][project.value][inTitle.value]){

        }
    }
});

const allExpand = [...document.querySelectorAll('.projectTitle>button')];
allExpand.forEach((val)=>val.addEventListener('click',()=>{
    val.textContent=='^'?val.textContent='v':val.textContent='^';
    choosePop(val.parentNode);
}));

const allPop = [...document.querySelectorAll(".right>button")];
allPop.forEach((val)=>val.addEventListener('click',()=>{
    if(val.textContent=='–'){
        val.textContent='+';
        unpopForm(val);
    }
    else{
        if(checkPlus()){
            unpopForm(checkPlus());
            checkPlus().textContent='+';
        }
        val.textContent='–';
        popToForm(val);
    }
}));