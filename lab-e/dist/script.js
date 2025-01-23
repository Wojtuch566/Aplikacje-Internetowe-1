/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


// const msg: string = "Hello";
// alert(msg);
var styleLinks = document.querySelectorAll(".style-holder");
//klucz w LocalStorage dla zapamiętanego stylu
var STYLE_STORAGE_KEY = "selectedStyle";
var styleDictionary = {
  1: "page1.css",
  2: "page2.css",
  3: "page3.css"
};
function changeStyle(cssFileName) {
  var oldLink = document.querySelector("link[rel='stylesheet']");
  if (oldLink) {
    oldLink.remove();
  }
  var newLink = document.createElement("link");
  newLink.rel = "stylesheet";
  newLink.href = "styles/".concat(cssFileName);
  document.head.appendChild(newLink);
}
function saveStyleToLocalStorage(styleId) {
  localStorage.setItem(STYLE_STORAGE_KEY, styleId.toString());
}
function loadStyleFromLocalStorage() {
  var savedStyleId = localStorage.getItem(STYLE_STORAGE_KEY);
  if (savedStyleId) {
    var styleId = parseInt(savedStyleId, 10);
    var cssFileName = styleDictionary[styleId];
    if (cssFileName) {
      changeStyle(cssFileName);
      logCurrentStyle(cssFileName);
    }
  }
}
function logCurrentStyle(cssFileName) {
  console.log("Aktualny styl: ".concat(cssFileName));
}
styleLinks.forEach(function (link, index) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    var styleId = index + 1;
    var cssFileName = styleDictionary[styleId];
    if (cssFileName) {
      changeStyle(cssFileName);
      saveStyleToLocalStorage(styleId);
      logCurrentStyle(cssFileName);
    }
  });
});
loadStyleFromLocalStorage();
/******/ })()
;