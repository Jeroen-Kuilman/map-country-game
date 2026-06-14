import L from "leaflet";
import "leaflet/dist/leaflet.css";

// temporary eventlistener to toggle the search list
document
  .querySelector("#country-search")
  .addEventListener("click", function () {
    document.querySelector(".search-list").classList.toggle("hidden");
  });

////////////////////////////////////////////////////////////////
var map = L.map("map").setView([51.505, -0.09], 13);
