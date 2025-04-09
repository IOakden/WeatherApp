import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DARK_TILE = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";

const DisableInteractions = () => {
  const map = useMap();
  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  }, [map]);
  return null;
};

// handle coordinate changes
const ChangeView = ({ coordinates }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 11, {
        animate: true,
        duration: 1.5
      });
    }
  }, [coordinates, map]);
  
  return null;
};

const BackgroundMap = ({ coordinates }) => {
  return (
    <MapContainer
      center={coordinates}
      zoom={11}
      zoomControl={false}
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1
      }}
    >
      <DisableInteractions />
      <ChangeView coordinates={coordinates} />
      <TileLayer
        url={DARK_TILE}
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
    </MapContainer>
  );
};

export default BackgroundMap;