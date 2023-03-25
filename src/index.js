import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

async function init() {
    const buildings = await import("../data/tall_buildings_id.json");
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

    initPopup();
    initLegend();
}

function initLegend() {
    const legend = document.querySelector("#legend");
    const template = document.querySelector("#legend-entry");
    const fillColorStyle = map.getPaintProperty("buildings-fill", "fill-extrusion-color");

    fillColorStyle.splice(0, 2);
    let startValue = 0;

    for (let index = 0; index < fillColorStyle.length; index+=2) {
        const entry = document.importNode(template.content, true);
        const spans = entry.querySelectorAll("span");
        const color = fillColorStyle[index];
        const height = fillColorStyle[index + 1];

        spans[0].style.backgroundColor = color;

        if (index == fillColorStyle.length-1) {
            spans[1].textContent = ">=" + startValue;
        } else {
            spans[1].textContent = startValue + "-" + (height - 1);
            startValue = height;
        }

        legend.appendChild(entry);
    }
}

let hovered;
const popup = document.querySelector("#popup");
const buildingName = popup.querySelector(".building-name");
const potential = popup.querySelector(".potential");
function initPopup() {
    map.on('mousemove', 'buildings-fill', function(event) {
        if (event.features.length > 0) {
            hovered = event.features[0];
            buildingName.textContent = hovered.properties.name;
            potential.textContent = hovered.properties.liquefaction_potential;
            popup.style.display = "block";
            map.setFeatureState(hovered, {
                hover: true
            });
        }
    });
    map.on('mouseleave', 'buildings-fill', clearHover);
}

function clearHover() {
    popup.style.display = "none";
    if (hovered) {
        map.setFeatureState(hovered, {
            hover: false
        });
    }
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);

