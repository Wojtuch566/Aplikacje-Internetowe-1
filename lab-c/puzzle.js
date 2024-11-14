//tworzenie mapy
let map = L.map('current-loc').setView([53.430127, 14.564802], 18);

//style mapy
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

//tworzenie znacznika
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Tutaj jestem!</strong>");

document.getElementById('locButton').addEventListener("click", function (event) {
    if (!navigator.geolocation) {
        console.log('Brak włączonej lokalizacji.');
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.log(positionError);
    });
});

document.getElementById('saveButton').addEventListener("click", function (event) {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById('raster-map');
        rasterMap.width = 320;
        rasterMap.height = 320;
        let rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, 320, 320);
    })
});
