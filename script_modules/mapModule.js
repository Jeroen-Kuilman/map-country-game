import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const gameMap = function () {
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

  return map;
};
