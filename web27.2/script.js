const container = document.querySelector(".container");
const movieSelect = document.getElementById("movie");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const reservationDateInput = document.getElementById("reservationDate");
const resetBtn = document.getElementById("resetBtn");
const confirmBtn = document.getElementById("confirmBtn");
const reservationList = document.getElementById("reservationList");
const seats = document.querySelectorAll(".row .seat");
const count = document.getElementById("count");
const total = document.getElementById("total");

let ticketPrice = +movieSelect.value;
let reservations = [];
let selectedSeats = [];
let soldSeats = [];

function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  const selectedSeatsCount = selectedSeats.length;
  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
}

function loadReservationsFromLocalStorage() {
  const reservationsData = localStorage.getItem("reservations");
  if (reservationsData) {
    reservations = JSON.parse(reservationsData);
    reservations.forEach(reservation => displayReservation(reservation));
  }
}

function loadSoldSeatsFromLocalStorage() {
  const soldSeatsData = localStorage.getItem("soldSeats");
  if (soldSeatsData) {
    soldSeats = JSON.parse(soldSeatsData);
    soldSeats.forEach(seatIndex => {
      seats[seatIndex].classList.add("sold");
    });
  }
}

function loadSelectedSeatsFromLocalStorage() {
  const selectedSeatsData = localStorage.getItem("selectedSeats");
  if (selectedSeatsData) {
    selectedSeats = JSON.parse(selectedSeatsData);
    selectedSeats.forEach(seatIndex => {
      seats[seatIndex].classList.add("selected");
    });
  }
}

function saveReservationsToLocalStorage() {
  localStorage.setItem("reservations", JSON.stringify(reservations));
}

function saveSoldSeatsToLocalStorage() {
  const soldSeatsIndexes = [...seats].filter((seat, index) => seat.classList.contains("sold")).map(seat => [...seats].indexOf(seat));
  localStorage.setItem("soldSeats", JSON.stringify(soldSeatsIndexes));
}

function saveSelectedSeatsToLocalStorage() {
  const selectedSeatsIndexes = [...seats].filter((seat, index) => seat.classList.contains("selected")).map(seat => [...seats].indexOf(seat));
  localStorage.setItem("selectedSeats", JSON.stringify(selectedSeatsIndexes));
}

function displayReservation(reservation) {
  const reservationItem = document.createElement("li");
  reservationItem.classList.add("reservation");
  reservationItem.innerHTML = `
    <div>Jméno: ${reservation.firstName} ${reservation.lastName}</div>
    <div>Datum: ${reservation.date}</div>
    <div>Film: ${reservation.movie}</div>
    <div>Sedadla: ${reservation.seats}</div>
    <div>Cena: ${reservation.price} Kč</div>
  `;
  reservationList.appendChild(reservationItem);
}

function populateUI() {
  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");
  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }

  const selectedMoviePrice = localStorage.getItem("selectedMoviePrice");
  if (selectedMoviePrice !== null) {
    ticketPrice = +selectedMoviePrice;
  }
  
  loadSelectedSeatsFromLocalStorage();
}

function clearLocalStorage() {
  localStorage.clear();
}

// Smazání vybraných sedadel z paměti při prvním načtení stránky
if (!localStorage.getItem("firstLoad")) {
  clearLocalStorage();
  localStorage.setItem("firstLoad", true);
}

movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("seat") && !e.target.classList.contains("sold")) {
    e.target.classList.toggle("selected");
    updateSelectedCount();
    saveSelectedSeatsToLocalStorage();
  }
});

resetBtn.addEventListener("click", () => {
  const username = prompt("Pro reset rezervací zadejte uživatelské jméno:");
  const password = prompt("Zadejte heslo:");
  if (username === "admin" && password === "admin123") {
    reservationList.innerHTML = "";
    seats.forEach((seat) => {
      seat.classList.remove("selected", "sold");
    });
    clearLocalStorage();
    count.innerText = "0";
    total.innerText = "0";
    firstNameInput.value = "";
    lastNameInput.value = "";
    reservationDateInput.value = "";
    reservations = [];
    selectedSeats = [];
    soldSeats = [];
    alert("Rezervace byly úspěšně smazány.");
  } else {
    alert("Nesprávné uživatelské jméno nebo heslo.");
  }
});

confirmBtn.addEventListener("click", () => {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  const selectedSeatsNumbers = Array.from(selectedSeats).map((seat) => seat.innerText);
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const selectedMovie = movieSelect.options[movieSelect.selectedIndex].text;
  const reservationDate = reservationDateInput.value;
  const price = selectedSeats.length * ticketPrice;

  const reservation = {
    firstName,
    lastName,
    date: reservationDate,
    movie: selectedMovie,
    price,
    seats: selectedSeatsNumbers.join(", ")
  };
  reservations.unshift(reservation);
  displayReservation(reservation);
  saveReservationsToLocalStorage();

  selectedSeats.forEach((seat) => {
    seat.classList.remove("selected");
    seat.classList.add("sold");
  });
  updateSelectedCount();
  saveSoldSeatsToLocalStorage();
  firstNameInput.value = "";
  lastNameInput.value = "";
  reservationDateInput.value = "";
});

// Načtení uložených rezervací z localStorage po načtení stránky
loadReservationsFromLocalStorage();
// Načtení uložených prodaných sedadel z localStorage po načtení stránky
loadSoldSeatsFromLocalStorage();
// Načtení uložených vybraných sedadel z localStorage po načtení
