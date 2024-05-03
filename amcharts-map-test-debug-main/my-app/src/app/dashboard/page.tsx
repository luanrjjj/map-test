"use client"
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import * as geoJsonBrazil from "./maps_counties"

import React, { useRef, useEffect, useState } from "react";
import * as MapStyles from "./styles";

import { StateData } from "./formatDataForStatesAndRegions";
import mockData from "./mock.json";

interface BrazilMapProps {
  data: StateData[];
  state: string;
  ref: any;
}

export interface CustomSettings {
  value: number;
  category: string;
  coverage: number;
}

const MapState= ({ data = []}: BrazilMapProps) => {
  const [state, setState] = useState("BA")
  const ref = useRef(null);
;
  function setupMap(root: am5.Root, data: StateData[], state: string) {
    const theme = am5.Theme.new(root);
    theme.rule("Label").setAll({
      fontSize: "12px",
      fontFamily: "Open Sans"
    });

    root.setThemes([
      am5themes_Animated.new(root),
      // am5themes_Responsive.new(root),
      // theme
    ]);

    root._logo?.dispose();

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        wheelX: "none",
        wheelY: "none",
        pinchZoom: true
      })
    );

    theme.rule("Label").setAll({
      fontSize: "12px",
      fontFamily: "Open Sans"
    });

    let object = {
      features: (geoJsonBrazil as any)?.[state as any]?.features,
      type: (geoJsonBrazil as any)?.[state]?.type
    }
    console.log("object: ", object);
    if (object.features === undefined) {
      return;
    }

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: object,
        reverseGeodata: true,
        // valueField: type == "shots" ? "value": "coverage",
        valueField: "value",
        calculateAggregates: false
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      interactive: true,
      strokeWidth: 2,
      stroke: am5.color(0xe9e7ee)
    });

    polygonSeries.mapPolygons.template.adapters.add(
      "tooltipText",
      (text, target) => {
        const data = target.dataItem;
        const context = data?.dataContext;
        const value = (context as CustomSettings).value;
        if (value > 0) {
          return  "[fontSize: 16px]{name}\n {value}]";
        }
        return "";
      }
    );

    polygonSeries.set("heatRules", [
      {
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        key: "fill",
        min: am5.color("#E8D7FF"),
        logarithmic: true,
        max: am5.color("#00005C")
      }
    ]);

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const data = target.dataItem;
      const context = data?.dataContext;
      const value = (context as CustomSettings).value;

      if (value === 0 || !value) {
        return am5.color("#E9E7EE");
      }

      return fill;
    });

    polygonSeries.data.setAll(data);
  }

  useEffect(() => {
    const data = mockData.find((item) => item.state === state)?.data;
    
    if (!data) {
      return;
    }
    
    if (ref?.current && data.length > 0) {

      const rootBrazilMapByState = am5.Root.new(ref.current);
      setupMap(rootBrazilMapByState, data, state);
      return () => {
        rootBrazilMapByState.dispose();
      };
    }
  }, [state]);

  return (
    <MapStyles.Container>
      <div className="content">
        <div className="select-container">
          <select onChange={(e) => setState(e.target.value)}>
            <option value="BA">BA</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
          </select>
        </div>
      </div>
      <MapStyles.Map id="statemapdiv" ref={ref}></MapStyles.Map>
    </MapStyles.Container>
  );
};

export default MapState;
