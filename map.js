// Stadyum bilgileri ve fotoğraf adları
const stadiums = [
    { name: "Galatasaray", image: "images/galatasaray.jpg", coords: [41.0767, 28.9897], city: "Istanbul" },  // Galatasaray Stadyumu'nun koordinatları
    { name: "Real Madrid", image: "images/realmadrid.jpg", coords: [40.4531, -3.6884], city: "Madrid" },   // Real Madrid'in stadyumunun koordinatları
    { name: "Manchester City", image: "images/city.jpg", coords: [53.4808, -2.2005], city: "Manchester" },     // Manchester City Stadyumu'nun koordinatları
    { name: "Barcelona", image: "images/barca.jpg", coords: [41.3809, 2.1916], city: "Barcelona" },
    { name: "Bayern Munich", image: "images/bayern.jpg", coords: [48.2186, 11.6247], city: "Munich" },
    { name: "Arsenal", image: "images/arsenal.jpg", coords: [51.5560, -0.1086], city: "London" },
    { name: "Atletico Madrid", image: "images/atleticomadrid.jpg", coords: [40.4138, -3.7095], city: "Madrid" },
    { name: "Liverpool", image: "images/liverpool.jpg", coords: [53.4308, -2.9601], city: "Liverpool" },
    { name: "Manchester United", image: "images/manu.jpg", coords: [53.4631, -2.2913], city: "Manchester" },
    { name: "Borussia Dortmund", image: "images/dortmund.jpg", coords: [51.4925, 7.4512], city: "Dortmund" }
];

let currentStadiumIndex = 0; // Oyun başında ilk stadyum
let points = 0;             // Başlangıç puanı
let timeLeft = 120;          // Saniye cinsinden süre
let mapClicked = false;     // Kullanıcı haritayı tıkladı mı?

// HTML öğelerini seçme
const imageContainer = document.getElementById("image");
const timerElement = document.getElementById("timer");
const pointsElement = document.getElementById("points");
const mapElement = document.getElementById("map");
const startButton = document.getElementById("startButton");

// Leaflet.js ile harita oluşturma
const map = L.map(mapElement).setView([41.0767, 28.9897], 2); // Başlangıç merkezi olarak İstanbul
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Rastgele bir stadyum yükle
function loadStadium() {
    const stadium = stadiums[currentStadiumIndex];

    // Stadyum resmini yükle
    imageContainer.innerHTML = `<img src="${stadium.image}" alt="${stadium.name}" style="max-width: 100%; border-radius: 5px;">`;

    // Haritayı başlangıç görünümüne sıfırla
    map.setView([0, 0], 2);
    mapClicked = false; // Haritada tıklama yapılabilir

    // Kullanıcıya seçimi yapmaları için mesaj göstermek
    timerElement.textContent = `Time Left: ${timeLeft} seconds`;
    pointsElement.textContent = `Points: ${points}`;
}

// Zamanlayıcı başlat
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = `Time Left: ${timeLeft} seconds`;
        } else {
            clearInterval(timerInterval); // Zaman dolduğunda zamanlayıcıyı durdur
            alert("Time's up! Your final score: " + points);
            resetGame(); // Oyunu sıfırla
        }
    }, 1000);
}

// Harita üzerinde kullanıcı tıklaması
map.on("click", function (e) {
    if (mapClicked) return; // Eğer kullanıcı bir yer seçtiyse tekrar seçim yapamasın

    const { lat, lng } = e.latlng;
    const stadiumCoords = stadiums[currentStadiumIndex].coords;

    // Seçilen koordinat ile doğru stadyum arasındaki mesafeyi hesapla (metre cinsinden)
    const distance = L.latLng(lat, lng).distanceTo(L.latLng(stadiumCoords));

    // 100 km'den daha yakınsa, doğru kabul et ve 10 puan ver
    if (distance <= 100000) {
        alert(`Correct! You are close enough to ${stadiums[currentStadiumIndex].city}.`);
        points += 10; // Doğru tahmin için 10 puan
    } else {
        alert(`Wrong! The correct location was ${stadiums[currentStadiumIndex].city}.`);
    }

    pointsElement.textContent = `Points: ${points}`;
    mapClicked = true; // Kullanıcı bir yer seçti, artık başka bir seçim yapamasın

    // Sıradaki stadyuma geç
    currentStadiumIndex = (currentStadiumIndex + 1) % stadiums.length;
    loadStadium();
});

// Oyunu sıfırla
function resetGame() {
    currentStadiumIndex = 0;
    points = 0;
    timeLeft = 120;
    loadStadium();
    startTimer();
}

// "Start Game" butonuna tıklanmasıyla oyunu başlat
startButton.addEventListener("click", function () {
    // Buton gizlensin ve oyun başlasın
    startButton.style.display = "none";
    loadStadium(); // İlk stadyumu yükle
    startTimer(); // Zamanlayıcıyı başlat
});
