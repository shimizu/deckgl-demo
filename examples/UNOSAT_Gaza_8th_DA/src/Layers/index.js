import { 
    BitmapLayer, 
    GeoJsonLayer,
    ScatterplotLayer,
    HeatmapLayer, 
    HexagonLayer } from 'deck.gl';
import { TileLayer } from '@deck.gl/geo-layers';

export function renderLayers({ data, world, selectLayer }) {

    let Layer = []


    const geojsonLayer = new GeoJsonLayer({
        id: 'GeoJsonLayer',
        data: world,
        stroked: true,
        filled: true,
        pickable: false,
        getFillColor: [160, 160, 180, 200],
        getLineColor: [0, 0, 0, 255],
        lineWidthMinPixels :1,
        getLineWidth: 1,
    });


    const scatterLayer = new ScatterplotLayer({
        id: 'ScatterplotLayer',
        data: data,
        stroked: true,
        getPosition: d => [d.X,d.Y],
        getRadius: 2,
        getFillColor: [255, 140, 0],
        getLineColor: [0, 0, 0],
        getLineWidth: 1,
        radiusScale: 6,
        pickable: false
    });


    const heatmapLayer = new HeatmapLayer({
        id: 'HeatmapLayer',
        data:data , 
        aggregation: 'SUM',
        getPosition: d => [d.X, d.Y],
        weightsTextureSize:512
    });


    const hexagonLayer = new HexagonLayer({
        id: 'HexagonLayer',
        data:data,
        opacity:0.9,
        extruded: true,
        getPosition: d => [d.X, d.Y],
        elevationScale: 4,
        radius: 200,
        pickable: false,
    });


    //OSMタイルを読み込みベースマップとして表示
    const tileLayer = new TileLayer({
        data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",

        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,

        renderSubLayers: (props) => {
            const {
                bbox: { west, south, east, north }
            } = props.tile;

            return new BitmapLayer(props, {
                data: null,
                image: props.data,
                bounds: [west, south, east, north]
            });
        }
    });

    Layer.push(tileLayer)


    if (selectLayer === "ヘックス"){
        Layer.push(hexagonLayer)
    }

    if (selectLayer === "ヒートマップ"){
        Layer.push(heatmapLayer)
    }

    if (selectLayer === "ポイント") {
        Layer.push(scatterLayer)
    }
    console.log("select", selectLayer)
    console.log("layer", Layer)


    return Layer;
}