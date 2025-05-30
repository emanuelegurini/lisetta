import './App.css'
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const getViewingStatusIcon = (status) => {
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
              {/*               <NavigationMenuItem>
                <NavigationMenuLink
                  href="/account"
                  className="text-gray-700 hover:font-bold transition-colors duration-300"
                >
                  Account
                </NavigationMenuLink>
              </NavigationMenuItem> */}
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
                    {/* <TableHead>Orientamento</TableHead> */}
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
                      {/* <TableCell>Sud</TableCell> */}
                      <TableCell>{property.basement ? "✓" : "✗"}</TableCell>
                      <TableCell>
                        {property.cycle_basement ? "✓" : "✗"}
                      </TableCell>
                      <TableCell>
                        {property.needs_renovation ? "✓" : "✗"}
                      </TableCell>
                      <TableCell>
                        {/** Drawer */}

                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline">Open Drawer</Button>
                          </DrawerTrigger>
                          <DrawerContent className="z-[1000]">
                            <div className="mx-auto w-full max-w-sm">
                              <DrawerHeader>
                                <DrawerTitle>Move Goal</DrawerTitle>
                                <DrawerDescription>
                                  Set your daily activity goal.
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="p-4 pb-0">
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="flex-1 text-center">
                                    <div className="text-7xl font-bold tracking-tighter">
                                      testo
                                    </div>
                                    <div className="text-muted-foreground text-[0.70rem] uppercase">
                                      Calories/day
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 h-[120px]">contenuto</div>
                              </div>
                              <DrawerFooter>
                                <Button>Submit</Button>
                                <DrawerClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </div>
                          </DrawerContent>
                        </Drawer>

                        {/** End - Drawer */}
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
