import { useState, useEffect } from 'react'
import DeckGL from '@deck.gl/react';

import {
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight
} from "@deck.gl/core";


const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.5
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 23),
  color: [255, 255, 255],
  intensity: 3.0,
  _shadow: true
});

const sunLight = new SunLight({
  timestamp: 1554927200000,
  color: [255, 255, 255],
  intensity: 10
});

const lightingEffect = new LightingEffect({ ambientLight, dirLight });


import { useControls } from 'leva'

import { renderLayers } from './Layers'

import zipLoader from './zipLoader'
import { CSVLoader } from '@loaders.gl/csv';
import { JSONLoader } from '@loaders.gl/json';

import "./index.css";

// 初期ビューポートの設定
const INITIAL_VIEW_STATE = {
  latitude: 31.35849434267462,
  longitude: 34.332168049944734,
  bearing: 4.759615384615384,
  pitch: 56.49901894659391,
  zoom: 11
};

function App() {
  const [viwState, setViewState] = useState(INITIAL_VIEW_STATE);

  const [data, setData] = useState([]);
  const [world, setWorld] = useState([]);
  const [selectLayer, setSelectLayer] = useState("ヘックス")


  useControls("レイヤー選択",{
    materialPreset: {
      value: "ヘックス", // material is a threejs material passed as props
      options: ["ヘックス", "ヒートマップ", "ポイント"],
      onChange: (value) => {
        setSelectLayer(value)
      }
    }
  });


  useEffect(() => {
    const loadData = async () => {
      const resData = await zipLoader("./data/gaza_data.zip", CSVLoader, (d) => {
        //console.log(d) //ローディング処理
      })
      setData(resData[0].data)

      const resWorld = await zipLoader("./data/ne_10m_admin_0_countries_jpn.zip", JSONLoader, (d) => {
        //console.log(d) //ローディング処理
      })

      setWorld(resWorld[0])
    }

    loadData()

  }, [])


  return (
    <div>
      <DeckGL
//        effects={[lightingEffect]}
        initialViewState={viwState}
        controller={true}
        layers={renderLayers({ data, world, selectLayer })}
        //onViewStateChange={v=> console.log(v.viewState)}
      >
      </DeckGL>
      <div className="attribution">
        <a
          href="http://www.openstreetmap.org/about/"
          target="_blank"
          rel="noopener noreferrer"
        >
          © OpenStreetMap
        </a>
      </div>
    </div>
  );
}

export default App
