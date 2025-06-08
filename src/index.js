import { compareAsc, format } from "date-fns";

import "./style.css";

const inTitle = document.querySelector("input#title");
const date = document.querySelector("input#date");
const radio = [...document.querySelectorAll("input.rad")];
const area = document.querySelector("textarea");
const sub = document.querySelector(".create");
const radIn = document.querySelector("#newInput");

sub.addEventListener('click',()=>console.log(date.value));


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
            }
        }
    }
};

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
        val.textContent='–';
        popToForm(val);
    }
}));

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

function choosePop(self){
    if(checkDisplay(self)){
        showChildren(self);
    }
    else{
        hideChildren(self);
    }
}

