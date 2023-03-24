import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

async function init() {
    const buildings = await import("../data/tall_buildings.json");
    const seismic_hazards = await import("../data/seismic_hazards.json");
    const style = map.getStyle();
    
    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);
    map.getSource("buildings").setData(buildings);
    map.getSource("seismic_hazards").setData(seismic_hazards);
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);
