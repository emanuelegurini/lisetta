import './App.css'
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
// TODO: creare un layer a parte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase =  createClient(supabaseUrl, supabaseKey)

const get_properties = async () => {
      const { data, error } = await supabase
        .from('realty')
        .select('id, region (id, region_name), city (id, city_name), url')
      if (error) throw error;

      return data;
}

function App() {
  // TODO: eliminare gli any
  const [properties, setProperties] = useState<any>([])

     useEffect(() => {
      const fetchProperties = async () => {
        try {
          const data = await get_properties(); 
          setProperties([...data])
        } catch (err) {
          console.error("Error:", err);
        } finally {
          console.log('finish')
        }
      };

      fetchProperties();
     }, [])

     useEffect(() => {
      console.log(properties)
     }, [properties])
  
  return (
    <>
      <MapContainer
        center={[44.493936, 11.342744]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[44.494246, 11.338522]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <div>
        <p>Realty</p>
        <ul>
          {properties.map((property) => {
            return (
              <li>
                <p>{property.id}</p>
                <p>{property.city.city_name}</p>
                <a href={property.url} target="__blank">
                  Link
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default App
