import { get_properties } from "@/api/homepage/homepage";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PropertyTable from "./PropertyTable";
import PropertyMap from "./PropertyMap";

const Homepage = () => {
  const [properties, setProperties] = useState<any>([]);
  const [showMap, setShowMap] = useState<boolean>(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await get_properties();
        setProperties([...data]);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        console.log("finish");
      }
    };
    fetchProperties();
  }, []);

  const handleShowMap = () => {
    setShowMap((prev) => !prev);
  };

  return (
    <>
      {
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Switch checked={showMap} onCheckedChange={handleShowMap} />
            <Label htmlFor="airplane-mode">
              {showMap ? "Nascondi" : "Mostra"} Mappa
            </Label>
          </div>
        </div>
      }
      {showMap && (<PropertyMap properties={properties} />)} 
      <PropertyTable properties={properties} />
    </>
  );
};

export default Homepage;
