import buildings from "../data/tall_buildings.json" assert {type: "json"};
import fs from "fs";

let output = buildings;
output.features.forEach(function(feature, index) {
    feature.id = index;
});

output = JSON.stringify(output);
fs.writeFile("../data/tall_buildings_id.json", output, function(error) {
    if (error) throw error;

    console.log("success. 👍");
});
