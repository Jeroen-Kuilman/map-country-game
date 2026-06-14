import L from "leaflet";
import "leaflet/dist/leaflet.css";

// temporary eventlistener to toggle the search list //// REMOVE WHEN FINISHED
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
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CartoDB",
  },
).addTo(map);
