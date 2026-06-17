import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RESULT } from "../config";

import blueIconUrl from "../img/marker-icon-2x-blue.png";
import redIconUrl from "../img/marker-icon-2x-red.png";
import greenIconUrl from "../img/marker-icon-2x-green.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

///////////////////////////////////////////////////////

class MapInterface {
  _map = false;
  _marker = null;
  _markers = [];
  _geoLayer = null;

  _blueIcon = new L.Icon({
    iconUrl: blueIconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  _greenIcon = new L.Icon({
    iconUrl: greenIconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  _redIcon = new L.Icon({
    iconUrl: redIconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  renderGameMap(lat, lng, lastRound, geoData) {
    if (!this._map) {
      this._map = L.map("map").setView([lat, lng], 5);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          minZoom: 1,
          attribution: "&copy; OpenStreetMap &copy; CartoDB",
        },
      ).addTo(this._map);
    } else {
      this._map.flyTo([lat, lng], 5, {
        duration: 1,
      });
    }
    this._addGeo(geoData);

    this._renderMarker(lat, lng);

    return this._map;
  }

  _addGeo(geoData) {
    if (!geoData) return;
    if (this._geoLayer) this._geoLayer.remove();
    this._geoLayer = L.geoJSON(geoData, {
      style: {
        color: "#b6cdbd", // border color
        weight: 1, // border thickness
        fillOpacity: 0, // transparent fill — just borders
      },
    }).addTo(this._map);
  }

  setMarkerResult(index, result) {
    const marker = this._markers[index];
    if (!marker) return;
    if (result === RESULT.CORRECT) {
      marker.setIcon(this._greenIcon);
    } else {
      marker.setIcon(this._redIcon);
    }
  }

  _renderMarker(lat, lng) {
    const marker = L.marker([lat, lng], { icon: this._blueIcon }).addTo(
      this._map,
    );
    this._marker = marker;
    this._markers.push(marker);
  }

  addPolyLine(lastTwoCoords, result) {
    const polyline = L.polyline(lastTwoCoords, {
      color: `${result === RESULT.CORRECT ? "green" : "red"}`,
      weight: 2,
      opacity: 60,
      dashArray: "5, 10",
    }).addTo(this._map);
  }
}

export default new MapInterface();
