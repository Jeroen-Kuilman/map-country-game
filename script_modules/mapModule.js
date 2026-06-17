import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix broken marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

///////////////////////////////////////////////////////
let map, marker, greenIcon;
export const gameMap = function (lat, lng) {
  if (!map) {
    map = L.map("map").setView([lat, lng], 5);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap &copy; CartoDB",
      },
    ).addTo(map);
  } else {
    map.setView([lat, lng], 5);
  }

  greenIcon = new L.Icon({
    iconUrl: "./img/marker-icon-2x-green.png",
    shadowUrl: "./img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  marker = L.marker([lat, lng], { icon: greenIcon }).addTo(map);

  return map;
};
