"use client";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useEffect, useRef } from "react";
export default function Home() {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const graphicsLayer = new GraphicsLayer();

      const labelClass = {
        // autocasts as new LabelClass()
        symbol: {
          type: "text", // autocasts as new TextSymbol()
          color: "white",
          haloColor: "black",
          haloSize: 1,
          font: {
            // autocast as new Font()
            family: "Noto Sans",
            size: 14,
          },
        },
        labelPlacement: "above-right",
        labelExpressionInfo: {
          expression: "$feature.Denominazione__Italiana_e_stran",
        },
        maxScale: 0,
        minScale: 220000,
      };
      const featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/RL4g2ycRCRI9aQRK/arcgis/rest/services/ComuniItaliani_WFL1/FeatureServer",
        labelingInfo: [labelClass],
      });

      const template = {
        // autocasts as new PopupTemplate()
        title: "Comuni italiani",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "Denominazione__Italiana_e_stran",
                label: "Nome del comune",
              },
              {
                fieldName: "Superficie_territoriale__kmq__a",
                label: "Superficie",
              },
              {
                fieldName: "Popolazione_residente_al_31_12_",
                label: "Popolazione",
              },
            ],
          },
        ],
      };
      featureLayer.popupTemplate = template;
      const point = {
        //Create a point
        type: "point",
        longitude: 11.60649,
        latitude: 44.8657,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40], // Orange
        width: 0.1,
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      };

      const polyline = {
        type: "polyline",
        paths: [
          [11.60649, 44.8657], //Longitude, latitude
          [11.60649, 40.8657], //Longitude, latitude
          [15.60649, 40.8657], //Longitude, latitude
          [15.60649, 44.8657], //Longitude, latitude
          [11.60649, 44.8657], //Longitude, latitude
        ],
      };
      const simpleLineSymbol = {
        type: "simple-line",
        color: [90, 119, 120], // Orange
        width: 6,
      };

      const polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: simpleLineSymbol,
      });

      const webmap = new Map({
        basemap: "topo",
        layers: [featureLayer],
      });
      const polygon = {
        type: "polygon",
        rings: [
          [11.60649, 44.8657], //Longitude, latitude
          [11.60649, 40.8657], //Longitude, latitude
          [15.60649, 40.8657], //Longitude, latitude
          [15.60649, 44.8657], //Longitude, latitude
          [11.60649, 44.8657], //Longitude, latitude
        ],
      };

      const simpleFillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8], // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };

      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });

      const view = new MapView({
        container: mapDiv.current, // The id or node representing the DOM element containing the view.
        map: webmap, // An instance of a Map object to display in the view.
        center: [11.60849, 44.8653],
        scale: 100000, // Represents the map scale at the center of the view.
      });

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });

      graphicsLayer.add(pointGraphic);
      graphicsLayer.add(polylineGraphic);
      graphicsLayer.add(polygonGraphic);
      webmap.add(graphicsLayer);
      return () => view && view.destroy();
    }
  }, []);

  return (
    <div
      className="mapDiv"
      ref={mapDiv}
      style={{ height: "100vh", width: "100%" }}
    ></div>
  );
}
