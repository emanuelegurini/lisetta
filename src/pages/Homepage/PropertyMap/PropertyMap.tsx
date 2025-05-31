import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";

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

const PropertyPopup = ({ property }) => {
  if (!property) return null;

  const availableFeatures = [];
  if (property.balcony)
    availableFeatures.push({ label: "Balcone", icon: "🏖️" });
  if (property.car_park)
    availableFeatures.push({ label: "Parcheggio", icon: "🅿️" });
  if (property.garage) availableFeatures.push({ label: "Garage", icon: "🏠" });
  if (property.cycle_basement)
    availableFeatures.push({ label: "Cantina Ciclabile", icon: "🚲" });
  if (property.elevator)
    availableFeatures.push({ label: "Ascensore", icon: "🛗" });
  if (property.air_conditioning)
    availableFeatures.push({ label: "Climatizzazione", icon: "❄️" });
  if (property.garden)
    availableFeatures.push({ label: "Giardino", icon: "🌳" });

  return (
    <Card className="w-80 border-none shadow-none">
      <CardContent className="p-0">
        {/* Header con prezzo e indirizzo */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                €{property.price?.toLocaleString("it-IT") || "N/A"}
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
              <Badge
                className={`${getAPEColor(
                  property.energy_classes.energy_class
                )} text-white font-bold`}
              >
                {property.energy_classes.energy_class}
              </Badge>
            )}
          </div>
        </div>

        {/* Features */}
        {availableFeatures.length > 0 && (
          <div className="p-4 border-b">
            <div className="text-sm font-medium mb-3 text-gray-700">
              Caratteristiche
            </div>
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
            onClick={() => window.open(property.url, "_blank")}
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

const PropertyMap = ({properties}: any) => {
  return (
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
            <Marker key={property.id} position={[property.lat, property.long]}>
              <Popup>
                <PropertyPopup property={property} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default PropertyMap