import { compareAsc, format } from "date-fns";

import "./style.css";

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

let userStorage = [];

const allExpand = [...document.querySelectorAll('.projectTitle>button')];
allExpand.forEach((val)=>val.addEventListener('click',()=>{
    val.textContent=='^'?val.textContent='v':val.textContent='^';
    choosePop(val.parentNode);
}));


const allPop = [...document.querySelectorAll(".right>button")];
allPop.forEach((val)=>val.addEventListener('click',()=>{val.textContent=='–'?val.textContent='+':val.textContent='–'}));//val.textContent=='-'?val.textContent='+':val.textContent='+'

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

function choosePop(self){
    // console.log(checkDisplay(self));
    if(checkDisplay(self)){
        showChildren(self);
    }
    else{
        hideChildren(self);
    }
    //checkDisplay(self)?showChildren(self):;
    
}

//hideChildren(document.querySelector('.projectTitle'));
// showChildren(document.querySelector('.projectTitle'));
