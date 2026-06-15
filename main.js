import L from "leaflet";
import "leaflet/dist/leaflet.css";

// temporary eventlistener to toggle the search list //// REMOVE WHEN FINISHED
const countrySearch = document.querySelector("#country-search");

// li.addEventListener("mousedown", () => {
//   // selectie werkt vóór blur
// });

countrySearch.addEventListener("focus", function () {
  document.querySelector(".search-list").classList.remove("hidden");
});
countrySearch.addEventListener("blur", function () {
  document.querySelector(".search-list").classList.add("hidden");
});

////////////////////////////////////////////////////////////////
// create module later
// two test numbers
const randomLat = Math.random() * 180 - 90;

const randomLng = Math.random() * 360 - 180;

console.log(randomLat, randomLng);

const map = L.map("map").setView([randomLat, randomLng], 5);
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CartoDB",
  },
).addTo(map);
