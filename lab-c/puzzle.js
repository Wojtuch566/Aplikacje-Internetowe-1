//tworzenie mapy
let map = L.map('current-loc').setView([53.430127, 14.564802], 18);

//style mapy
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

//tworzenie znacznika
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Tutaj jestem!</strong>");

//pobieranie lokalizacji
document.getElementById('locButton').addEventListener("click", function (event) {
    if (!navigator.geolocation) {
        console.log('Brak włączonej lokalizacji.');
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
            let rasterPuzzle = [];
            const tileSize = 80;

            //podział obrazu na 16 kafelków
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const imageData = rasterContext.getImageData(
                        col * tileSize,
                        row * tileSize,
                        tileSize,
                        tileSize
                    );
                    rasterPuzzle.push(imageData);
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
                context.putImageData(rasterPuzzle[index], 0, 0);
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
