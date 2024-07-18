// if the module has no dependencies, the above pattern can be simplified to

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD. Register as an anonymous module.

        define([], factory);

    } else if (typeof exports === 'object') {

        // Node. Does not work with strict CommonJS, but

        // only CommonJS-like environments that support module.exports,

        // like Node.

        module.exports = factory();

    } else {

        // Browser globals (root is window)

        root.returnExports = factory();

    }

}(this, function () {

    // Just return a value to define the module export.

    // This example returns an object, but the module

    // can return a function as the exported value.

    return {
        "version": 1,
        "themeName": "transparent",
        "theme": {
            "seriesCnt": 3,
            "backgroundColor": "transparent",
            "titleColor": "#cccccc",
            "subtitleColor": "#cccccc",
            "textColorShow": false,
            "textColor": "#333",
            "markTextColor": "#cccccc",
            "color": [
                "#5470c6",
                "#91cc75",
                "#fac858",
                "#ee6666",
                "#73c0de",
                "#3ba272",
                "#fc8452",
                "#9a60b4",
                "#ea7ccc"
            ],
            "borderColor": "#cccccc",
            "borderWidth": 0,
            "visualMapColor": [
                "#bf444c",
                "#d88273",
                "#f6efa6"
            ],
            "legendTextColor": "#333333",
            "kColor": "#eb5454",
            "kColor0": "#47b262",
            "kBorderColor": "#eb5454",
            "kBorderColor0": "#47b262",
            "kBorderWidth": 1,
            "lineWidth": 2,
            "symbolSize": 4,
            "symbol": "emptyCircle",
            "symbolBorderWidth": 1,
            "lineSmooth": false,
            "graphLineWidth": 1,
            "graphLineColor": "#aaaaaa",
            "mapLabelColor": "#000",
            "mapLabelColorE": "rgb(100,0,0)",
            "mapBorderColor": "#444",
            "mapBorderColorE": "#444",
            "mapBorderWidth": 0.5,
            "mapBorderWidthE": 1,
            "mapAreaColor": "#eee",
            "mapAreaColorE": "rgba(255,215,0,0.8)",
            "axes": [
                {
                    "type": "all",
                    "name": "通用坐标轴",
                    "axisLineShow": true,
                    "axisLineColor": "#6E7079",
                    "axisTickShow": true,
                    "axisTickColor": "#6E7079",
                    "axisLabelShow": true,
                    "axisLabelColor": "#6E7079",
                    "splitLineShow": true,
                    "splitLineColor": [
                        "#E0E6F1"
                    ],
                    "splitAreaShow": false,
                    "splitAreaColor": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                },
                {
                    "type": "category",
                    "name": "类目坐标轴",
                    "axisLineShow": true,
                    "axisLineColor": "#6E7079",
                    "axisTickShow": true,
                    "axisTickColor": "#6E7079",
                    "axisLabelShow": true,
                    "axisLabelColor": "#6E7079",
                    "splitLineShow": false,
                    "splitLineColor": [
                        "#E0E6F1"
                    ],
                    "splitAreaShow": false,
                    "splitAreaColor": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                },
                {
                    "type": "value",
                    "name": "数值坐标轴",
                    "axisLineShow": false,
                    "axisLineColor": "#6E7079",
                    "axisTickShow": false,
                    "axisTickColor": "#6E7079",
                    "axisLabelShow": true,
                    "axisLabelColor": "#6E7079",
                    "splitLineShow": true,
                    "splitLineColor": [
                        "#E0E6F1"
                    ],
                    "splitAreaShow": false,
                    "splitAreaColor": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                },
                {
                    "type": "log",
                    "name": "对数坐标轴",
                    "axisLineShow": false,
                    "axisLineColor": "#6E7079",
                    "axisTickShow": false,
                    "axisTickColor": "#6E7079",
                    "axisLabelShow": true,
                    "axisLabelColor": "#6E7079",
                    "splitLineShow": true,
                    "splitLineColor": [
                        "#E0E6F1"
                    ],
                    "splitAreaShow": false,
                    "splitAreaColor": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                },
                {
                    "type": "time",
                    "name": "时间坐标轴",
                    "axisLineShow": true,
                    "axisLineColor": "#6E7079",
                    "axisTickShow": true,
                    "axisTickColor": "#6E7079",
                    "axisLabelShow": true,
                    "axisLabelColor": "#6E7079",
                    "splitLineShow": false,
                    "splitLineColor": [
                        "#E0E6F1"
                    ],
                    "splitAreaShow": false,
                    "splitAreaColor": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            ],
            "axisSeperateSetting": true,
            "toolboxColor": "#999999",
            "toolboxEmphasisColor": "#666666",
            "tooltipAxisColor": "#cccccc",
            "tooltipAxisWidth": 1,
            "timelineLineColor": "#dae1f5",
            "timelineLineWidth": 2,
            "timelineItemColor": "#a4b1d7",
            "timelineItemColorE": "#ffffff",
            "timelineCheckColor": "#316bf3",
            "timelineCheckBorderColor": "#ffffff",
            "timelineItemBorderWidth": 1,
            "timelineControlColor": "#a4b1d7",
            "timelineControlBorderColor": "#a4b1d7",
            "timelineControlBorderWidth": 1,
            "timelineLabelColor": "#a4b1d7"
        }
    };

}));