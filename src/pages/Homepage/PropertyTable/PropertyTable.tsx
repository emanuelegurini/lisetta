import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const PropertyTable = ({properties}: any) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableCaption>Elenco delle tue proprietà preferite.</TableCaption>
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
              <TableRow key={property.id}>
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
                  {(property.price / property.surface_area).toLocaleString(
                    "it-IT",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </TableCell>
                <TableCell>{property.floor_number}°</TableCell>
                <TableCell>{property.elevator ? "✓" : "✗"}</TableCell>
                <TableCell
                  className={getAPEColor(property.energy_classes.energy_class)}
                >
                  {property.energy_classes.energy_class}
                </TableCell>
                <TableCell>
                  {property.property_portals.property_portals_name}
                </TableCell>
                <TableCell>
                  <a
                    href={property.real_estate_agencies.real_estate_agency_url}
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
                <TableCell>{property.heating_systems.heat_system}</TableCell>
                <TableCell>{property.air_conditioning ? "✓" : "✗"}</TableCell>
                <TableCell>{property.basement ? "✓" : "✗"}</TableCell>
                <TableCell>{property.cycle_basement ? "✓" : "✗"}</TableCell>
                <TableCell>{property.needs_renovation ? "✓" : "✗"}</TableCell>
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
                        <DialogDescription>{property.note}</DialogDescription>
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
  );
};

export default PropertyTable
