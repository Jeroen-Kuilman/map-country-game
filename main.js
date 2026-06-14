import L from "leaflet";
import "leaflet/dist/leaflet.css";

// temporary eventlistener to toggle the search list
document
  .querySelector("#country-search")
  .addEventListener("click", function () {
    document.querySelector(".search-list").classList.toggle("hidden");
  });

////////////////////////////////////////////////////////////////
const map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
