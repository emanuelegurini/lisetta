import './App.css'
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, MapPin } from "lucide-react";


import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ViewingStatus =
  | "new"
  | "viewed"
  | "appointment_requested"
  | "appointment_confirmed"
  | "visited"
  | "interested"
  | "rejected"
  | "archived";

export const getViewingStatusIcon = (status: ViewingStatus): string => {
  const iconMap = {
    new: "🆕",
    viewed: "👁️",
    appointment_requested: "📞",
    appointment_confirmed: "📅",
    visited: "👁️",
    interested: "❤️",
    rejected: "❌",
    archived: "📦",
  };

  return iconMap[status] || "❓";
};


// TODO: creare un layer a parte
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase =  createClient(supabaseUrl, supabaseKey)

const get_properties = async () => {
      const { data, error } = await supabase
      .from("realty")
      .select(`
        id,
        address,
        price,
        condo_fees,
        surface_area,
        floor_number,
        needs_renovation,
        basement,
        cycle_basement,
        elevator,
        air_conditioning,
        balcony,
        garden,
        garage,
        car_park,
        lat,
        long,
        url,
        note,
        city (
          id,
          city_name
        ),
        region (
          id,
          region_name
        ),
        heating_systems (
          id,
          heat_system
        ),
        viewing_statuses (
          id, 
          viewing_status
        ), 
        energy_classes (
          id,
          energy_class
        ),
        property_portals (
          id,
          property_portals_name
        ), 
        real_estate_agencies (
          id,
          real_estate_agency,
          real_estate_agency_url
        )
      `);

      if (error) throw error;

      return data;
}


const getAPEColor = (ape: string): string => {
  const colors: { [key: string]: string } = {
    A4: "bg-green-700", // Verde scuro
    A3: "bg-green-600", // Verde
    A2: "bg-green-500", // Verde chiaro
    A1: "bg-green-400", // Verde molto chiaro
    B: "bg-yellow-500", // Giallo
    C: "bg-orange-500", // Arancione
    D: "bg-red-500", // Rosso
    E: "bg-red-700", // Rosso scuro
    F: "bg-red-800", // Rosso intenso
    G: "bg-red-900", // Rosso scuro (peggiore)
  };
  return colors[ape.toUpperCase()] || "bg-gray-500";
};


// Componente PropertyPopup aggiornato
const PropertyPopup = ({ property }) => {
  if (!property) return null;

  // Filtro solo le features disponibili
  const availableFeatures = [];
  if (property.balcony) availableFeatures.push({ label: "Balcone", icon: "🏖️" });
  if (property.car_park) availableFeatures.push({ label: "Parcheggio", icon: "🅿️" });
  if (property.garage) availableFeatures.push({ label: "Garage", icon: "🏠" });
  if (property.cycle_basement) availableFeatures.push({ label: "Cantina Ciclabile", icon: "🚲" });
  if (property.elevator) availableFeatures.push({ label: "Ascensore", icon: "🛗" });
  if (property.air_conditioning) availableFeatures.push({ label: "Climatizzazione", icon: "❄️" });
  if (property.garden) availableFeatures.push({ label: "Giardino", icon: "🌳" });

  return (
    <Card className="w-80 border-none shadow-none">
      <CardContent className="p-0">
        {/* Header con prezzo e indirizzo */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                €{property.price?.toLocaleString('it-IT') || 'N/A'}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="font-medium">{property.address}</span>
              </div>
              <div className="text-sm text-gray-500">
                {property.city?.city_name}, {property.region?.region_name}
              </div>
            </div>
            {property.energy_classes?.energy_class && (
              <Badge className={`${getAPEColor(property.energy_classes.energy_class)} text-white font-bold`}>
                {property.energy_classes.energy_class}
              </Badge>
            )}
          </div>
        </div>

        {/* Features */}
        {availableFeatures.length > 0 && (
          <div className="p-4 border-b">
            <div className="text-sm font-medium mb-3 text-gray-700">Caratteristiche</div>
            <div className="flex flex-wrap gap-2">
              {availableFeatures.slice(0, 6).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <span className="mr-1">{feature.icon}</span>
                  {feature.label}
                </Badge>
              ))}
              {availableFeatures.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{availableFeatures.length - 6} altro
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Pulsanti azione */}
        <div className="p-4 space-y-2">
          <Button 
            className="w-full" 
            onClick={() => window.open(property.url, '_blank')}
            disabled={!property.url}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visualizza Annuncio Completo
          </Button>
        </div>

        {/* Status e note */}
        {(property.viewing_statuses?.viewing_status || property.note) && (
          <div className="p-4 bg-gray-50 border-t">
            {property.viewing_statuses?.viewing_status && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant="outline" className="text-xs">
                  {property.viewing_statuses.viewing_status}
                </Badge>
              </div>
            )}
            {property.note && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">Note:</span> {property.note}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};



function App() {
  // TODO: eliminare gli any
  const [properties, setProperties] = useState<any>([])
  const [showMap, setShowMap] = useState<boolean>(true)

     useEffect(() => {
      const fetchProperties = async () => {
        try {
          const data = await get_properties(); 
          console.log('data:', data)
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

     const handleShowMap = () => {
      setShowMap((prev) => !prev)
     }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="m-auto w-full max-w-[1200px] flex-1 p-8">
        <div className="pb-8 pt-4 flex justify-between items-center mb-8">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="text-gray-700 hover:font-bold transition-colors duration-300"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 capitalize">Irene</span>
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>
                {"irene giacchetta"
                  .split(" ")
                  .slice(0, 2)
                  .map((name: string) => name[0].toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Switch checked={showMap} onCheckedChange={handleShowMap} />
            <Label htmlFor="airplane-mode">
              {showMap ? "Nascondi" : "Mostra"} Mappa
            </Label>
          </div>
          {/* Mappa */}
          {showMap && (
            <Card className="mb-8">
              <CardContent>
                <MapContainer
                  center={[44.493936, 11.342744]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full map-container-custom-z-index"
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
                          property={property}
                        />
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Table>
                <TableCaption>
                  Elenco delle tue proprietà preferite.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
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
                    <TableHead>Cantina</TableHead>
                    <TableHead>Cantina Ciclabile</TableHead>
                    <TableHead>Da Ristrutturare</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow>
                      <TableCell>
                        {getViewingStatusIcon(
                          property.viewing_statuses.viewing_status
                        )}
                      </TableCell>
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
                        {(
                          property.price / property.surface_area
                        ).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>{property.floor_number}°</TableCell>
                      <TableCell>{property.elevator ? "✓" : "✗"}</TableCell>
                      <TableCell
                        className={getAPEColor(
                          property.energy_classes.energy_class
                        )}
                      >
                        {property.energy_classes.energy_class}
                      </TableCell>
                      <TableCell>
                        {property.property_portals.property_portals_name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={
                            property.real_estate_agencies.real_estate_agency_url
                          }
                          target="__blank"
                        >
                          {property.real_estate_agencies.real_estate_agency}
                        </a>
                      </TableCell>
                      <TableCell>{property.garage ? "✓" : "✗"}</TableCell>
                      <TableCell>{property.balcony ? "✓" : "✗"}</TableCell>
                      <TableCell>
                        €
                        {property.condo_fees.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        /mese
                      </TableCell>
                      <TableCell>{property.garden ? "✓" : "✗"}</TableCell>
                      <TableCell>
                        {property.heating_systems.heat_system}
                      </TableCell>
                      <TableCell>
                        {property.air_conditioning ? "✓" : "✗"}
                      </TableCell>
                      <TableCell>{property.basement ? "✓" : "✗"}</TableCell>
                      <TableCell>
                        {property.cycle_basement ? "✓" : "✗"}
                      </TableCell>
                      <TableCell>
                        {property.needs_renovation ? "✓" : "✗"}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="z-[1000]">
                            <DialogHeader>
                              <DialogTitle>Note</DialogTitle>
                              <DialogDescription>
                                {property.note}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App
