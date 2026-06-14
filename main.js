import L from "leaflet";
import "leaflet/dist/leaflet.css";

// temporary eventlistener to toggle the search list
document
  .querySelector("#country-search")
  .addEventListener("click", function () {
    document.querySelector(".search-list").classList.toggle("hidden");
  });

////////////////////////////////////////////////////////////////
// create module later
// two test numbers
const randomLat = Math.floor(Math.random() * 180 - 90);

const randomLng = Math.floor(Math.random() * 360 - 180);

const map = L.map("map").setView([randomLat, randomLng], 5);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
