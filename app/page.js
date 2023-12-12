"use client"
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import esriConfig  from '@arcgis/core/config';
import { useEffect, useRef } from 'react';
export default function Home() {
  const mapDiv = useRef(null);

  useEffect(()=>{
    esriConfig.apiKey= "AAPK1dca06ceb44043debc84e9bfc1580b1b1a61Lr3F5NsxNxILpVrKwys7GlyPD1m9CDKoDK1Y6-Cht5QPYrMmMLX0pu0-DjLU"
    

  
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const webmap = new Map({
        basemap: "dark-gray-vector"
      });

      const view = new MapView({
        container: mapDiv.current, // The id or node representing the DOM element containing the view.
        map: webmap, // An instance of a Map object to display in the view.
        center: [-117.1490,32.7353],
        scale: 10000000 // Represents the map scale at the center of the view.
      });

      return () => view && view.destroy()
    }
  },[])
  
  return (

    <div className="mapDiv" ref={mapDiv} style={{height: '100vh', width: "100%"}}></div>
 
  
  )
}
