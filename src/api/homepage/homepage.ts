import { supabase } from "@/App";

export const get_properties = async () => {
  const { data, error } = await supabase.from("realty").select(`
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
};
