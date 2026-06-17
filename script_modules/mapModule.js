import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RESULT } from "../config";
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

class MapInterface {
  map = false;
  marker = null;
  markers = [];
  currentCoords = [];

  blueIcon = new L.Icon({
    iconUrl: "./img/marker-icon-2x-blue.png",
    shadowUrl: "./img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  greenIcon = new L.Icon({
    iconUrl: "./img/marker-icon-2x-green.png",
    shadowUrl: "./img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  redIcon = new L.Icon({
    iconUrl: "./img/marker-icon-2x-red.png",
    shadowUrl: "./img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  renderGameMap(lat, lng, lastRound) {
    if (!this.map) {
      this.map = L.map("map").setView([lat, lng], 5);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap &copy; CartoDB",
        },
      ).addTo(this.map);
    } else {
      this.map.setView([lat, lng], 5);
    }

    this.renderBlueMarker(lat, lng);

    return this.map;
  }

  setMarkerResult(index, result) {
    const marker = this.markers[index];
    if (!marker) return;
    if (result === RESULT.CORRECT) {
      marker.setIcon(this.greenIcon);
    } else {
      marker.setIcon(this.redIcon);
    }
  }
  renderGreenMarker(lat, lng) {
    L.marker([lat, lng], { icon: this.greenIcon }).addTo(this.map);
  }
  renderBlueMarker(lat, lng) {
    const marker = L.marker([lat, lng], { icon: this.blueIcon }).addTo(
      this.map,
    );
    this.marker = marker;
    this.markers.push(marker);
  }
  renderRedMarker(lat, lng) {
    L.marker([lat, lng], { icon: this.redIcon }).addTo(this.map);
  }

  //   addPolyLine(latlng) {
  //     console.log(latlng);
  //     L.polyline(latlng, { color: "red" }).addTo(map);
  //   }
}

export default new MapInterface();
