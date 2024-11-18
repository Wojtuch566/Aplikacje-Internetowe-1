//prośba o uprawnienia do powiadomień na początku
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

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

                target.addEventListener('dragstart', handleDragStart);
                target.addEventListener('dragover', handleDragOver);
                target.addEventListener('drop', handleDrop);

                // target.setAttribute('draggable', true);
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

function handleDragStart(event) {
    const index = event.target.dataset.index || event.target.dataset.placedIndex;
    event.dataTransfer.setData('text/plain', index);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();

    const draggedIndex = event.dataTransfer.getData('text/plain');
    const targetIndex = event.target.dataset.index;

    const draggedCanvas = document.querySelector(`[data-index="${draggedIndex}"]`);
    const targetCanvas = event.target;

    //sprawdzenie, czy oba canvasy istnieją
    if (!draggedCanvas || !targetCanvas || draggedCanvas === targetCanvas) return;

    const draggedContext = draggedCanvas.getContext('2d');
    const targetContext = targetCanvas.getContext('2d');

    const draggedImageData = draggedContext.getImageData(0, 0, tileSize, tileSize);
    const targetImageData = targetContext.getImageData(0, 0, tileSize, tileSize);

    //zamiana obrazów między canvasami
    draggedContext.putImageData(targetImageData, 0, 0);
    targetContext.putImageData(draggedImageData, 0, 0);

    //aktualizacja indeksów dataset
    const tempPlacedIndex = targetCanvas.dataset.placedIndex;
    targetCanvas.dataset.placedIndex = draggedIndex;
    draggedCanvas.dataset.index = tempPlacedIndex || draggedIndex;

    checkPuzzleCompletion();
}

function checkPuzzleCompletion() {
    const puzzleTargets = document.querySelectorAll('.puzzle-target');
    let isCompleted = true;

    puzzleTargets.forEach((target, index) => {
        const placedIndex = target.dataset.placedIndex;
        if (Number(placedIndex) !== index) {
            isCompleted = false;
        }
    });

    if (isCompleted) {
        showCompletionNotification();
    }
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
