import './App.css'
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mappa */}
      <Card className="mb-8">
        <CardContent>
            <MapContainer
              center={[44.493936, 11.342744]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full" 
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
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Realty</h2>
          <ul className="space-y-2">
            {properties.map((property) => (
              <li key={property.id} className="border-b pb-2">
                <p>ID: {property.id}</p>
                <p>City: {property.city.city_name}</p>
                <a 
                  href={property.url} 
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Link
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      </div>
  </div>
);
}

export default App
