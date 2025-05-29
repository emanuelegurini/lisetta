import './App.css'
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TODO: creare un layer a parte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase =  createClient(supabaseUrl, supabaseKey)

const get_properties = async () => {
      const { data, error } = await supabase
        .from('realty')
        .select(`
          id,
          address,
          price,
          surface_area,
          region (
            id,
            region_name
          ),
          city (
            id,
            city_name
          ),
          url,
          lat,
          long
        `)
      if (error) throw error;

      return data;
}


const getAPEColor = (ape) => {
  const colors = {
    A: "bg-green-500",
    B: "bg-green-400",
    C: "bg-yellow-500",
    D: "bg-yellow-600",
    E: "bg-orange-500",
    F: "bg-red-500",
    G: "bg-red-600",
  };
  return colors[ape] || "bg-gray-500";
};

// Componente Popup per una singola proprietà
const PropertyPopup = ({ property }) => {
  // Filtro solo le features disponibili
  const availableFeatures = [];
  if (property.balcony) availableFeatures.push("Balcone");
  if (property.parking) availableFeatures.push("Parcheggio");
  if (property.garage) availableFeatures.push("Garage");
  if (property.bikeCellar) availableFeatures.push("Cantina Ciclabile");

  return (
    <Card className="w-72 border-none shadow-none">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-600">
            {property.price}
          </CardTitle>
          <Badge
            className={`text-white font-semibold ${getAPEColor(property.ape)}`}
          >
            APE {property.ape}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 font-medium">{property.sqm} mq</p>
      </CardHeader>

      <CardContent className="space-y-2">
        {availableFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {availableFeatures.map((feature, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {feature}
              </div>
            ))}
          </div>
        )}

        <Button size="sm" className="w-full">
          Vedi Dettagli
        </Button>
      </CardContent>
    </Card>
  );
};


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

              {properties.map((property) => (
                <Marker
                  key={property.id}
                  position={[property.lat, property.long]}
                >
                  <Popup>
                    <PropertyPopup
                      property={{
                        id: 3,
                        price: "€280.000",
                        sqm: 95,
                        ape: "A",
                        bikeCellar: true,
                        balcony: false,
                        parking: true,
                        garage: true,
                        address: "Via Dante 22, Firenze",
                      }}
                    />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Table>
              <TableCaption>Elenco delle tue proprietà preferite.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Indirizzo</TableHead>
                  <TableHead>Prezzo</TableHead>
                  <TableHead>Mq</TableHead>
                  <TableHead>Prezzo/Mq</TableHead>
                  <TableHead>Piano</TableHead>
                  <TableHead>Ascensore</TableHead>
                  <TableHead>APE</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Agenzia</TableHead>
                  <TableHead>Garage</TableHead>
                  <TableHead>Balcone</TableHead>
                  <TableHead>Spese Cond.</TableHead>
                  <TableHead>Giardino</TableHead>
                  <TableHead>Riscaldamento</TableHead>
                  <TableHead>Climatizzazione</TableHead>
                  <TableHead>Orientamento</TableHead>
                  <TableHead>Cantina</TableHead>
                  <TableHead>Da Ristrutturare</TableHead>
                  <TableHead>Visitato</TableHead>
                  <TableHead>Cantina Ciclabile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      <a href={property.url} target="__blank">
                        {property.address}, {property.city.city_name}
                      </a>
                    </TableCell>
                    <TableCell>
                      {property.price.toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>{property.surface_area}</TableCell>
                    <TableCell>
                      €
                      {(property.price / property.surface_area).toLocaleString(
                        "it-IT",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </TableCell>
                    <TableCell>3°</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>B</TableCell>
                    <TableCell>Idealista</TableCell>
                    <TableCell>Tecnocasa</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>€120/mese</TableCell>
                    <TableCell>✗</TableCell>
                    <TableCell>Autonomo</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>Sud</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>✗</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>✓</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App
