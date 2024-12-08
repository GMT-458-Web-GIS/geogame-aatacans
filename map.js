const stadiums = [
    { name: "Galatasaray", image: "images/galatasaray.jpg", coords: [41.0767, 28.9897], city: "Istanbul" },
    { name: "Real Madrid", image: "images/realmadrid.jpg", coords: [40.4531, -3.6884], city: "Madrid" },
    { name: "Manchester City", image: "images/city.jpg", coords: [53.4808, -2.2005], city: "Manchester" },
    { name: "Barcelona", image: "images/barca.jpg", coords: [41.3809, 2.1915], city: "Barcelona" },
    { name: "Bayern Munich", image: "images/bayern.jpg", coords: [48.2187, 11.6247], city: "Munich" },
    { name: "Arsenal", image: "images/arsenal.jpg", coords: [51.556, -0.108], city: "London" },
    { name: "Atletico Madrid", image: "images/atleticomadrid.jpg", coords: [40.4138, -3.6798], city: "Madrid" },
    { name: "Liverpool", image: "images/liverpool.jpg", coords: [53.4308, -2.9601], city: "Liverpool" },
    { name: "Manchester United", image: "images/manu.jpg", coords: [53.4631, -2.2913], city: "Manchester" },
    { name: "Dortmund", image: "images/dortmund.jpg", coords: [51.4924, 7.4504], city: "Dortmund" }
];

let currentStadiumIndex = 0;
let points = 0;
let timeLeft = 120;
let gameStarted = false;
let mapClicked = false;

// Yeni pop-up alanı
const endGamePopup = document.getElementById("endGamePopup");
const endGameMessage = document.getElementById("endGameMessage");
const imageContainer = document.getElementById("image");
const timerElement = document.getElementById("timer");
const pointsElement = document.getElementById("points");
const mapElement = document.getElementById("map");
const iconElement = document.getElementById("icon");
const startButton = document.getElementById("startButton");

const map = L.map(mapElement).setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function loadStadium() {
    const stadium = stadiums[currentStadiumIndex];
    imageContainer.innerHTML = `<img src="${stadium.image}" alt="${stadium.name}" style="max-width: 100%; border-radius: 5px;">`;
    map.setView([0, 0], 2);
    mapClicked = false;

    timerElement.textContent = `Time Left: ${timeLeft} seconds`;
    pointsElement.textContent = `Points: ${points}`;
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = `Time Left: ${timeLeft} seconds`;
        } else {
            clearInterval(timerInterval);
            alert("Time's up! Your final score: " + points);
            resetGame();
        }
    }, 1000);
}

startButton.addEventListener("click", () => {
    iconElement.style.display = "none";  // İkonu gizle
    gameStarted = true;
    startButton.disabled = true;  // Butonu devre dışı bırak
    startTimer();
    loadStadium();
});

map.on("click", function (e) {
    if (!gameStarted || mapClicked) return;

    const { lat, lng } = e.latlng;
    const stadiumCoords = stadiums[currentStadiumIndex].coords;
    const distance = L.latLng(lat, lng).distanceTo(L.latLng(stadiumCoords));

    let message;
    if (distance <= 100000) {
        message = `Correct! You are close enough to ${stadiums[currentStadiumIndex].city}.`;
        points += 10;
    } else {
        message = `Wrong! The correct location was ${stadiums[currentStadiumIndex].city}.`;
    }

    pointsElement.textContent = `Points: ${points}`;

    // Pop-up mesajını harita üzerinde gösterme
    const popup = L.popup()
        .setLatLng(e.latlng) // Tıklanan konumda pop-up göster
        .setContent(message) // Mesajı yerleştir
        .openOn(map);

    mapClicked = true;
    currentStadiumIndex = (currentStadiumIndex + 1) % stadiums.length;
    loadStadium();
});

function resetGame() {
    currentStadiumIndex = 0;
    points = 0;
    timeLeft = 120;
    gameStarted = false;
    iconElement.style.display = "block"; // İkonu tekrar göster
    startButton.disabled = false;
    loadStadium();
}
