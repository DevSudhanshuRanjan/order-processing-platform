import React, { useState, useEffect } from 'react';
import { getServiceAreas } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DELI_ZONE_POLYGON } from '../../contexts/LocationContext';

const AdminServiceAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use the MVP expanded Delhi zone polygon for the first area
  const defaultPolygons = [
    DELI_ZONE_POLYGON.map(coord => [coord[1], coord[0]]),
    [
      [28.5939, 77.2290],
      [28.6039, 77.2290],
      [28.6039, 77.2390],
      [28.5939, 77.2390]
    ]
  ];

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getServiceAreas();
        setAreas(data.areas);
      } catch (error) {
        toast.error('Failed to load service areas');
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Service Areas</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Manage delivery zones and geographical limits.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl font-label-md hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[18px]">draw</span>
          Draw New Zone
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar Data */}
        <div className="lg:col-span-1 space-y-4">
          {loading ? (
            <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
          ) : (
            areas.map((area, i) => (
              <div key={area._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline-lg text-white">{area.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${area.active ? 'bg-[#10B981]' : 'bg-gray-500'}`}></div>
                </div>
                <div className="space-y-2 text-sm text-on-primary-container">
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="text-white">₹{area.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Order:</span>
                    <span className="text-white">₹{area.minOrder}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leaflet Map */}
        <div className="lg:col-span-2 bg-[#141b2b] rounded-2xl border border-white/10 overflow-hidden relative" style={{ height: '500px' }}>
          <MapContainer 
            center={[28.6139, 77.2090]} // New Delhi
            zoom={12} 
            style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark theme tile layer
            />
            
            {areas.map((area, index) => (
              <Polygon 
                key={area._id} 
                positions={defaultPolygons[index % defaultPolygons.length]} 
                pathOptions={{ 
                  color: area.active ? '#3B82F6' : '#6B7280',
                  fillColor: area.active ? '#3B82F6' : '#6B7280', 
                  fillOpacity: 0.2,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-black font-body-md">
                    <h3 className="font-bold">{area.name}</h3>
                    <p>Fee: ₹{area.deliveryFee}</p>
                    <p>Min Order: ₹{area.minOrder}</p>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default AdminServiceAreas;
