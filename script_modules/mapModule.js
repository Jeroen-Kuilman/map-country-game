import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { config, RESULT } from "../config";

import blueIconUrl from "../img/marker-icon-2x-blue.png";
import redIconUrl from "../img/marker-icon-2x-red.png";
import greenIconUrl from "../img/marker-icon-2x-green.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

///////////////////////////////////////////////////////

class MapInterface {
  _map = false;
  _marker;
  _markers = [];
  _geoLayer;
  _geoLayerOutline;
  _polyline;
  _polylines = [];

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

  renderGameMap(
    geoData,
    lat = config.DEFAULT_LAT,
    lng = config.DEFAULT_LNG,
    lastRound = null,
  ) {
    if (!this._map) {
      this._map = L.map("map", {
        maxBounds: [
          [-90, -180], // southwest corner
          [90, 180], // northeast corner
        ],
        maxBoundsViscosity: 0.85,
      }).setView([lat, lng], 3);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 10,
          minZoom: 3,
          noWrap: true,
          attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`,
          subdomains: "abcd",
        },
      ).addTo(this._map);
      this._addGeo(geoData);
    } else {
      this._map.flyTo([lat, lng], 5, {
        duration: 1,
      });

      this._renderMarker(lat, lng);
    }

    return this._map;
  }

  _renderMarker(lat, lng) {
    const marker = L.marker([lat, lng], { icon: this._blueIcon }).addTo(
      this._map,
    );
    this._marker = marker;
    this._markers.push(marker);
  }

  _addGeo(geoData) {
    if (!geoData) return;
    if (this._geoLayer) this._geoLayer.remove();

    this._geoLayerOutline = L.geoJSON(geoData, {
      style: {
        color: "#5c715e",
        weight: 2,
        opacity: 0.35,
        fillOpacity: 0,
      },
    }).addTo(this._map);

    this._geoLayer = L.geoJSON(geoData, {
      style: {
        color: "#b6cdbd",
        weight: 0.75,
        opacity: 0.85,
        fillOpacity: 0,
      },
    }).addTo(this._map);
  }

  setMarkerResult(index, result, country, playerAnswer) {
    const marker = this._markers[index];
    if (!marker) return;

    const popupClass = playerAnswer ? "popup-wrong" : "popup-correct";
    const popupString = playerAnswer
      ? `<div>Your answer: ${playerAnswer}<br>Correct answer: ${country}</div>`
      : `<div>${country}</div>`;

    marker
      .bindPopup(popupString, {
        className: popupClass,
        autoPan: true,
        autoPanPadding: [40, 40],
      })
      .openPopup();

    if (result === RESULT.CORRECT) {
      marker.setIcon(this._greenIcon);
    } else {
      marker.setIcon(this._redIcon);
    }
  }

  addPolyLine(lastTwoCoords, result) {
    const polyline = L.polyline(lastTwoCoords, {
      color: `${result === RESULT.CORRECT ? "#2AAD27" : "#CB2B3E"}`,
      weight: 2,
      opacity: 60,
      dashArray: "5, 10",
    }).addTo(this._map);
    this._polyline = polyline;
    this._polylines.push(polyline);
  }
  clearMapUI() {
    const clearLayerArray = (layers) => {
      layers.forEach((layer) => this._map.removeLayer(layer));
    };

    clearLayerArray(this._markers);
    clearLayerArray(this._polylines);

    this._markers = [];
    this._marker = null;

    this._polylines = [];
    this._polyline = null;
  }

  setMapToOverview() {
    //simple method to set the map to the same view settings as when initiated
    this._map.flyTo([config.DEFAULT_LAT, config.DEFAULT_LNG], 3, {
      duration: 1,
    });
  }
}

export default new MapInterface();
