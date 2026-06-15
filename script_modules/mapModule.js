import L from "leaflet";
import "leaflet/dist/leaflet.css";

let map;
export const gameMap = function (lat, lng) {
  map = L.map("map").setView([lat, lng], 5);
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap &copy; CartoDB",
    },
  ).addTo(map);

  return map;
};
