import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RESULT } from "../config";

import blueIconUrl from "../img/marker-icon-2x-blue.png";
import redIconUrl from "../img/marker-icon-2x-red.png";
import greenIconUrl from "../img/marker-icon-2x-green.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

///////////////////////////////////////////////////////

class MapInterface {
  map = false;
  marker = null;
  markers = [];
  currentCoords = [];
  geoLayer = null;

  blueIcon = new L.Icon({
    iconUrl: blueIconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  greenIcon = new L.Icon({
    iconUrl: greenIconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  redIcon = new L.Icon({
    iconUrl: redIconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  renderGameMap(lat, lng, lastRound, geoData) {
    if (!this.map) {
      this.map = L.map("map").setView([lat, lng], 5);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          minZoom: 1,
          attribution: "&copy; OpenStreetMap &copy; CartoDB",
        },
      ).addTo(this.map);
    } else {
      this.map.flyTo([lat, lng], 5, {
        duration: 1,
      });
    }
    this.addGeo(geoData);

    this.renderBlueMarker(lat, lng);

    return this.map;
  }

  addGeo(geoData) {
    if (!geoData) return;
    if (this.geoLayer) this.geoLayer.remove();
    this.geoLayer = L.geoJSON(geoData, {
      style: {
        color: "#b6cdbd", // border color
        weight: 1, // border thickness
        fillOpacity: 0, // transparent fill — just borders
      },
    }).addTo(this.map);
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

  addPolyLine(lastTwoCoords, result) {
    const polyline = L.polyline(lastTwoCoords, {
      color: `${result === RESULT.CORRECT ? "green" : "red"}`,
      weight: 2,
      opacity: 60,
      dashArray: "5, 10",
    }).addTo(this.map);
  }
}

export default new MapInterface();
