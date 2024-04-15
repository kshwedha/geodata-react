import React, {useState} from 'react';
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import iconUrl from './location.svg';
import 'leaflet/dist/leaflet.css';
import './Home.css'
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import { toJSON } from 'flatted';



const GeoSpatialMap = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [drawnItems, setDrawnItems] = useState(null);
    const featureGroupRef = React.useRef();

    const customDrawCSS = `
        .leaflet-draw-draw-marker {
            background-image: url(${iconUrl});
            background-size: cover;
            background-position: center;
            text-indent: -9999px;
        }
        .leaflet-draw-draw-rectangle:before,
        .leaflet-draw-draw-circle:before,
        .leaflet-draw-draw-marker:before,
        .leaflet-draw-draw-polygon:before {
            content: '';
        }
    `;

    const defaultMarkerIcon = new L.Icon.Default();

    const customIcon = new L.Icon({
        iconUrl,
        iconSize: [12, 12], // Size of the icon
        iconAnchor: [8, 8], // Point of the icon which will correspond to marker's location
    });

    const onCreated = (e) => {
        const { layer } = e;
        layer.editing.enable();
        setDrawnItems(layer);
        featureGroupRef.current?.leafletElement?.addLayer(layer);
    };
    const onDeleted = (e) => {
        setDrawnItems(null);
    };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const saveFile = () => {
        const formData = new FormData();
        const userid = localStorage.getItem('userid')
        const token = localStorage.getItem('token')
        formData.append('file', selectedFile);
        fetch('http://localhost:8080/upload', {
            method: 'POST',
            headers: {
                'token': token,
                'userid': userid
            },
            body: formData,
        })
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
        });
    }

    const handleUpload = () => {
        if (selectedFile) {
            saveFile()
            setGeojsonData(null);
            const reader = new FileReader();
            reader.readAsText(selectedFile);
            reader.onload = () => {
                const geojsonData = JSON.parse(reader.result);
                setGeojsonData(geojsonData);
            };
            setSelectedFile(null);
            alert('File uploaded successfully');
        } else {
            alert('Please select a file to upload');
        }
    };

    const handleSubmit = async () => {
        try {
            // objWithCircularRef.self = drawnItems
            const objWithCircularRef = toJSON(drawnItems);
            const token = localStorage.getItem('token')
            const userid = localStorage.getItem('userid')
            const response = await fetch('http://127.0.0.1:8080/save', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'token': token,
                'userid': userid
                },
                body: JSON.stringify(objWithCircularRef),
            })
            .then((response) => {
                    if (!response.ok) {
                        throw new Error('Data not saved at server');
                    }
                    alert('Data Saved Successfully.');
                    return response.json();
            })
            .then(data => {
                setTimeout(() => {
                        window.location.href = '/home'
                }, 2000)
            });
            } catch (error) {
            console.error('!! Data not sent to server', error);
            alert('!! Data not sent to server');
            }
        };

    const sendDrawData = () => {
        if (drawnItems) {
            handleSubmit()
            console.log(drawnItems);
        }
    };

    if (localStorage.getItem('token')) {
    return (
        <div className='map-container'>
            <h1>GeoSpace Dashboard</h1>
            <div className='map-manager-container'>
                <div className='manager-container'>
                    <MapContainer center={[23.7127837, 79.0059413]} zoom={1} style={{ width: "100%", height: "90vh" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {geojsonData && <GeoJSON data={geojsonData} />}
                        <FeatureGroup ref={featureGroupRef}>
                        <EditControl
                            position="topright"
                            onCreated={onCreated}
                            onDeleted={onDeleted}
                            draw={{
                                rectangle: {
                                    icon: defaultMarkerIcon, // Custom icon for rectangle tool
                                    shapeOptions: {
                                        color: '#f06eaa', // Color of the shape outline
                                        fillColor: '#fff' // Color of the shape fill
                                    }
                                },
                                circle: {
                                    icon: defaultMarkerIcon, // Custom icon for rectangle tool
                                    shapeOptions: {
                                        color: '#f06eaa', // Color of the shape outline
                                        fillColor: '#fff' // Color of the shape fill
                                    }
                                },
                                polygon: {
                                    icon: defaultMarkerIcon, // Custom icon for rectangle tool
                                    shapeOptions: {
                                        color: '#f06eaa', // Color of the shape outline
                                        fillColor: '#fff' // Color of the shape fill
                                    }
                                },
                                marker: {
                                    icon: customIcon},
                                polyline: {
                                    icon: defaultMarkerIcon, // Custom icon for rectangle tool
                                    shapeOptions: {
                                        color: '#f06eaa', // Color of the shape outline
                                        fillColor: '#fff' // Color of the shape fill
                                    }
                                },
                            }}
                            edit={{
                                featureGroup: featureGroupRef.current ? featureGroupRef.current.leafletElement : null
                            }}
                        />
                        {drawnItems && <p>Drawn shape: {drawnItems.toGeoJSON().geometry.type}</p>}
                        </FeatureGroup>
                    </MapContainer>
                </div>
                <div className='upload-container'>
                    <div>
                        <input type="file" accept=".geojson,.kml,.json" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                    <div className='save-container'>
                        <button onClick={sendDrawData}>Save Draw Data</button>
                    </div>
                </div>
            </div>
        </div>
    )
    } else {
        window.location.href = '/login';
    }
}

export default GeoSpatialMap;