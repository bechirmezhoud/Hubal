import React, { useState, Suspense } from "react";
import "./styles.css";
import ReactMapGL, { Marker } from "react-map-gl";
import { useFirestoreDocData, useFirestore, SuspenseWithPerf } from "reactfire";

import FormAdd from "./FormAdd";

export default function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 34.41418745308229,
    longitude: 9.530643008655552,
    zoom: 6
  });
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [dinamiquewh, setDinamiquewh] = useState(100 * viewport.zoom);
  const [showForm, setShowForm] = useState(false);

  const showAddMarkerPopup = event => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude
    });
  };

  const announceRef = useFirestore()
    .collection("announce")
    .doc("eC48By4Liwam36rxoz85");

  const announce = useFirestoreDocData(announceRef);

  return (
    <React.Fragment>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={e => {
          setViewport(e);
          setDinamiquewh(6 * e.zoom);
        }}
        onDblClick={e => {
          showAddMarkerPopup(e);
          setShowForm(false);
        }}
        onClick={() => {
          setAddEntryLocation(null);
          setShowForm(false);
        }}
      >
        {addEntryLocation && (
          <>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <svg
                height={`${dinamiquewh}px`}
                width={`${dinamiquewh}px`}
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <circle
                  cx={`${dinamiquewh / 2}px`}
                  cy={`${dinamiquewh / 2}px`}
                  r={`${0.1 * dinamiquewh}px`}
                  fill="rgb(19, 119, 212)"
                />
                <circle
                  cx={`${dinamiquewh / 2}px`}
                  cy={`${dinamiquewh / 2}px`}
                  r={`${0.4 * dinamiquewh}px`}
                  stroke="rgb(19, 119, 212)"
                  fill="rgb(19, 119, 212)"
                  fillOpacity="50%"
                />
              </svg>
            </Marker>
          </>
        )}
      </ReactMapGL>
      {addEntryLocation && (
        <>
          <div
            className="form-btn"
            style={
              showForm
                ? {
                    width: "80vw",
                    height: "80vh",
                    bottom: "10vh",
                    left: "10vw",
                    borderRadius: 20,
                    cursor: "default",
                    background:
                      "radial-gradient(166.67% 2021.63% at 0% 13.73%,#ebebeb 0%,#c2c2c2 100%)"
                  }
                : {
                    width: "8vw",
                    height: "10vh",
                    bottom: "10vh",
                    left: "30vw"
                  }
            }
          >
            {showForm && <FormAdd />}
            {!showForm && (
              <div className="Addbtn" onClick={() => setShowForm(true)}>
                <SuspenseWithPerf fallback={"loading..."}>
                  <p className="AddSign">{announce}</p>
                </SuspenseWithPerf>
              </div>
            )}
          </div>
        </>
      )}
    </React.Fragment>
  );
}
