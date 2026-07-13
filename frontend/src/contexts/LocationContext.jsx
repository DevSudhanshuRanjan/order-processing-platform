import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

// Cache key for localStorage
const LOCATION_CACHE_KEY = 'aura_location_cache';

// Maximum age for cached location in milliseconds (24 hours)
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      // Check if cache is still valid
      if (data.timestamp && (Date.now() - data.timestamp < CACHE_MAX_AGE)) {
        return data;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null;
};

const setCachedLocation = (lat, lng, serviceable) => {
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
      latitude: lat,
      longitude: lng,
      serviceable,
      timestamp: Date.now()
    }));
    // Clear denied flag on successful location
    localStorage.removeItem('aura_location_denied');
  } catch (e) {
    // Ignore storage errors
  }
};

export const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [serviceable, setServiceable] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkServiceability = useCallback((lat, lng) => {
    const pt = turf.point([lng, lat]);
    const poly = turf.polygon([DELI_ZONE_POLYGON]);
    const isInside = turf.booleanPointInPolygon(pt, poly);
    setServiceable(isInside);
    setCachedLocation(lat, lng, isInside);
    return isInside;
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLoading(false);
      return;
    }
    setLoading(true);
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
        if (error.code === error.PERMISSION_DENIED) {
          localStorage.setItem('aura_location_denied', 'true');
          setServiceable(false);
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [checkServiceability]);

  // On mount, restore from cache if available (no permission prompt)
  useEffect(() => {
    const cached = getCachedLocation();
    if (cached) {
      setLatitude(cached.latitude);
      setLongitude(cached.longitude);
      setServiceable(cached.serviceable);
    }
  }, []);

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