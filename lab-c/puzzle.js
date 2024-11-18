//prośba o uprawnienia do powiadomień na początku
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

// //prośba o uprawnienia do lokalizacji
// if (navigator.permissions) {
//     navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
//         if (permissionStatus.state === 'prompt') {
//             alert("Proszę o zgodę na dostęp do lokalizacji.");
//         }
//     });
// }

//tworzenie mapy
let map = L.map('current-loc').setView([53.430127, 14.564802], 18);

//style mapy
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

//tworzenie znacznika
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Tutaj jestem!</strong>");

const tileSize = 80;
let rasterPuzzle = [];

//pobieranie lokalizacji
document.getElementById('locButton').addEventListener("click", function (event) {
    if (!navigator.geolocation) {
        console.log('Brak włączonej lokalizacji.');
        return;
    }

    if (Notification.permission === 'granted') {
        new Notification("Szukam lokalizacji...");
    } else {
        alert("Szukam lokalizacji...");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon], 18);
        marker.remove();
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup("<strong>Tutaj jestem!</strong>");
    }, positionError => {
        console.log(positionError);
        alert("Nie udało się uzyskać lokalizacji.");
    },
    {
        timeout: 5000,
        enableHighAccuracy: true
    });
});

//zmiana stylu mapki
document.getElementById('styleButton').addEventListener("click", function (event) {});

//tworzenie canvasu i podział na puzzle
document.getElementById('saveButton').addEventListener("click", function (event) {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById('raster-map');
        rasterMap.width = 320;
        rasterMap.height = 320;
        let rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, 320, 320);

        if (!rasterMap.empty) {
            rasterPuzzle = [];

            //podział obrazu na 16 kafelków
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const imageData = rasterContext.getImageData(
                        col * tileSize,
                        row * tileSize,
                        tileSize,
                        tileSize
                    );
                    rasterPuzzle.push({ imageData, index: row * 4 + col });
                }
            }
            console.log(rasterPuzzle);

            //mieszanie kafelków
            shuffleTiles(rasterPuzzle);

            const puzzleItems = document.querySelectorAll('.puzzle-item');

            puzzleItems.forEach((canvas, index) => {
                canvas.width = tileSize;
                canvas.height = tileSize;
                const context = canvas.getContext('2d');
                context.putImageData(rasterPuzzle[index].imageData, 0, 0);

                //ustawienie atrybutów do drag and drop
                canvas.setAttribute('draggable', true);
                canvas.dataset.index = rasterPuzzle[index].index; //ustawienie właściwego indeksu
                canvas.addEventListener('dragstart', handleDragStart);
            });

            //obsługa drop na polach puzzle-target
            const puzzleTargets = document.querySelectorAll('.puzzle-target');

            puzzleTargets.forEach((target, index) => {
                target.width = tileSize;
                target.height = tileSize;
                target.dataset.index = index;

                // target.addEventListener('dragstart', handleDragStart);
                target.addEventListener('dragover', handleDragOver);
                // target.addEventListener('dragenter', function (event) {
                //     this.style.backgroundColor = "#DD8B6F";
                // });
                // target.addEventListener('dragleave', function (event) {
                //     this.style.backgroundColor = "#D38165";
                // });
                target.addEventListener('drop', handleDrop);

                target.setAttribute('draggable', true);
            });
        }
    });
});

//funckja mieszająca kafelki
function shuffleTiles(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const puzzleTargets = document.querySelectorAll('.puzzle-target');

puzzleTargets.forEach((target, index) => {
    target.width = tileSize;
    target.height = tileSize;
    target.dataset.index = index;
    target.dataset.placedIndex = null;

    target.setAttribute('draggable', true);
    target.addEventListener('dragstart', handleDragStart);
    target.addEventListener('dragover', handleDragOver);
    target.addEventListener('drop', handleDrop);
});

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData('text/plain');
    const targetIndex = event.target.dataset.index;

    const draggedCanvas = document.querySelector(`.puzzle-item[data-index="${draggedIndex}"]`) ||
    document.querySelector(`.puzzle-target[data-placedIndex="${draggedIndex}"]`);
    const targetCanvas = event.target;

    //przenoszenie obrazu na miejsce docelowe
    if (targetCanvas && draggedCanvas && draggedCanvas !== targetCanvas) {
        const draggedContext = draggedCanvas.getContext('2d');
        const targetContext = targetCanvas.getContext('2d');


        const draggedImageData = draggedContext.getImageData(0, 0, tileSize, tileSize);
        const targetImageData = targetContext.getImageData(0, 0, tileSize, tileSize);
        targetContext.putImageData(draggedImageData, 0, 0);
        draggedContext.clearRect(0, 0, tileSize, tileSize);

        const tempPlacedIndex = targetCanvas.dataset.placedIndex;
        targetCanvas.dataset.placedIndex = draggedIndex;
        draggedCanvas.dataset.placedIndex = tempPlacedIndex || null;

        checkPuzzleCompletion();
    }
}

function checkPuzzleCompletion() {
    const puzzleTargets = document.querySelectorAll('.puzzle-target');
    let isCompleted = true;

    puzzleTargets.forEach((target, index) => {
        const placedIndex = target.dataset.placedIndex;
        if (placedIndex != index) {
            isCompleted = false;
        }
    });

    if (isCompleted) {
        showCompletionNotification();
    }
}

function compareImageData(imageData1, imageData2) {
    if (!imageData1 || !imageData2 || imageData1.data.length !== imageData2.data.length) {
        return false;
    }

    for (let i = 0; i < imageData1.data.length; i++) {
        if (imageData1.data[i] !== imageData2.data[i]) {
            return false;
        }
    }

    return true;
}

function showCompletionNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Gratulacje!', {
            body: "Puzzle zostały ułożone."
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Gratulacje!', {
                    body: 'Puzzle zostały ułożone.'
                });
            } else {
                alert('Puzzle zostały ułożone!');
            }
        });
    } else {
        alert('Puzzle zostały ułożone!');
    }
}
