// const msg: string = "Hello";
// alert(msg);

const styleLinks = document.querySelectorAll<HTMLAnchorElement>(".style-holder");

//klucz w LocalStorage dla zapamiętanego stylu
const STYLE_STORAGE_KEY = "selectedStyle";

const styleDictionary: Record<number, string> = {
    1: "page1.css",
    2: "page2.css",
    3: "page3.css"
};

function changeStyle(cssFileName: string): void {
    const oldLink = document.querySelector<HTMLLinkElement>("link[rel='stylesheet']");
    if (oldLink) {
        oldLink.remove();
    }

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = `styles/${cssFileName}`;
    document.head.appendChild(newLink);
}

function saveStyleToLocalStorage(styleId: number): void {
    localStorage.setItem(STYLE_STORAGE_KEY, styleId.toString());
}

function loadStyleFromLocalStorage(): void {
    const savedStyleId = localStorage.getItem(STYLE_STORAGE_KEY);
    if (savedStyleId) {
        const styleId = parseInt(savedStyleId, 10);
        const cssFileName = styleDictionary[styleId];
        if (cssFileName) {
            changeStyle(cssFileName);
            logCurrentStyle(cssFileName);
        }
    }
}

function logCurrentStyle(cssFileName: string): void {
    console.log(`Aktualny styl: ${cssFileName}`);
}

styleLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const styleId = index + 1;
        const cssFileName = styleDictionary[styleId];
        if (cssFileName) {
            changeStyle(cssFileName);
            saveStyleToLocalStorage(styleId);
            logCurrentStyle(cssFileName);
        }
    });
});

loadStyleFromLocalStorage();
