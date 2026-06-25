import { createContext, useContext, useState } from 'react';
import * as turf from '@turf/turf';

const LocationContext = createContext();

// Hardcoded Delhi Zone polygon for MVP - Expanded to cover entire Delhi
export const DELI_ZONE_POLYGON = [
  [76.84, 28.88], // North-West
  [77.34, 28.88], // North-East
  [77.34, 28.40], // South-East
  [76.84, 28.40], // South-West
  [76.84, 28.88]  // Close the polygon
];

export const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [serviceable, setServiceable] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkServiceability = (lat, lng) => {
    const pt = turf.point([lng, lat]);
    const poly = turf.polygon([DELI_ZONE_POLYGON]);
    const isInside = turf.booleanPointInPolygon(pt, poly);
    setServiceable(isInside);
    return isInside;
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          checkServiceability(lat, lng);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const updateLocationFromPincode = async (pincode) => {
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=india&format=json`);
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setLatitude(lat);
        setLongitude(lng);
        checkServiceability(lat, lng);
        return { success: true, lat, lng };
      }
      return { success: false };
    } catch (error) {
      console.error("Error fetching location for pincode", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ 
      latitude, 
      longitude, 
      serviceable, 
      loading, 
      getCurrentLocation, 
      updateLocationFromPincode,
      checkServiceability,
      setLatitude,
      setLongitude
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
