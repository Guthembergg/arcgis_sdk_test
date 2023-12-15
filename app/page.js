"use client";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useEffect, useRef } from "react";
import Search from "@arcgis/core/widgets/Search.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";
import DotDensityRenderer from "@arcgis/core/renderers/DotDensityRenderer";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

export default function Home() {
  const mapDiv = useRef(null);
  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */ const labelClass = {
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
      const featureLayerP = new FeatureLayer({
        url: "https://services.arcgis.com/RL4g2ycRCRI9aQRK/arcgis/rest/services/ComuniItaliani_WFL1/FeatureServer",
        labelingInfo: [labelClass],
        minScale: 1820000,
        maxScale: 35000,
        title: "Popolazione corrente",
      });

      const graphicsLayer = new GraphicsLayer();
      const webmap = new Map({
        basemap: "topo",
        layers: [featureLayer, featureLayerP],
      });

      const view = new MapView({
        container: mapDiv.current, // The id or node representing the DOM element containing the view.
        map: webmap, // An instance of a Map object to display in the view.
        center: [11.60849, 44.8653],
        scale: 100000, // Represents the map scale at the center of the view.
      });

      view.when().then(() => {
        const dotDensityRenderer = new DotDensityRenderer({
          // The number of units per dot
          dotValue: 3,
          outline: null,
          // When referenceScale is set, linearly scales the dot value
          // based on the referenceDotValue. The layer view will draw
          // dots using the value in referenceDotValue only at the scale
          // specified here.
          referenceScale: 100000,
          legendOptions: {
            // Displays "1 dot = 100 people" in the legend
            unit: "people",
          },
          attributes: [
            {
              // One red dot will be drawn for every 100 White people
              field: "Popolazione_residente_al_31_12_",
              color: "#f23c3f",
              label: "Popolazione",
            },
          ],
        });
        featureLayerP.renderer = dotDensityRenderer;
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
      /*      const point = {
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
 */

      /*  const polygon = {
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
        color: [27, 19, 79, 0.8], // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };

      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      }); */

      var searchWidget = new Search({
        view: view,
      });
      view.ui.add(searchWidget, {
        position: "top-right",
      });
      /*   const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      }); */
      view.when(() => {
        const sketch = new Sketch({
          layer: graphicsLayer,
          view: view,
          // graphic will be selected as soon as it is created
          creationMode: "update",
        });

        view.ui.add(sketch, "top-right");
      });
      /*   graphicsLayer.add(pointGraphic); */
      /*   graphicsLayer.add(polylineGraphic);
      graphicsLayer.add(polygonGraphic); */
      view.ui.add(
        [
          new Expand({
            view: view,
            content: new Legend({ view: view }),
            group: "top-left",
            expanded: true,
          }),
          /*   new Expand({
            view: view,
            content: new Bookmarks({ view: view }),
            group: "top-left",
          }), */
        ],
        "bottom-left"
      );
      let scaleBar = new ScaleBar({
        view: view,
      });
      // Add widget to the bottom left corner of the view
      view.ui.add(scaleBar, {
        position: "bottom-right",
      });
      webmap.add(graphicsLayer);
      // view.navigation.momentumEnabled = false; the map keeps moving after the click of the mouse - enabled by default
      return () => view && view.destroy();
    }

    // Add the search widget to the top right corner of the view
  }, []);
  return (
    <div
      className="mapDiv"
      ref={mapDiv}
      style={{ height: "93vh", width: "100%" }}
    ></div>
  );
}
