import React, {useState} from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css'


const GeoSpatialMap = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const saveFile = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        fetch('http://localhost:8080/upload', {
            method: 'POST',
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
                    </MapContainer>
                </div>
                <div className='upload-container'>
                    <div>
                        <input type="file" accept=".geojson,.kml,.json" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeoSpatialMap;