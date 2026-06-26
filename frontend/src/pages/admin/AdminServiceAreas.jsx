import React, { useState, useEffect } from 'react';
import { getServiceAreas, createServiceArea, updateServiceArea, deleteServiceArea } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from '../../components/dashboard/Modal';

const AdminServiceAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAreas = async () => {
    try {
      const data = await getServiceAreas();
      setAreas(data.areas || []);
    } catch (error) {
      toast.error('Failed to load service areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleDelete = async () => {
    if (!selectedArea) return;
    setDeleting(true);
    try {
      await deleteServiceArea(selectedArea._id);
      toast.success('Service area deleted');
      fetchAreas();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete service area');
    } finally {
      setDeleting(false);
    }
  };

  // Convert area polygon data from [lng, lat] to [lat, lng] for Leaflet
  const getLeafletPositions = (polygon) => {
    if (!polygon || polygon.length === 0) return [];
    return polygon.map(coord => [coord[1], coord[0]]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Service Areas</h2>
          <p className="text-on-primary-container font-body-md text-body-md">Manage delivery zones and geographical limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar Data */}
        <div className="lg:col-span-1 space-y-4">
          {loading ? (
            <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
          ) : areas.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
              <span className="material-symbols-outlined text-[48px] text-on-primary-container mb-2">map</span>
              <p className="text-on-primary-container">No service areas configured yet.</p>
            </div>
          ) : (
            areas.map((area) => (
              <div key={area._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline-lg text-white">{area.name}</h3>
                  <button
                    onClick={() => { setSelectedArea(area); setDeleteModalOpen(true); }}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Area"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
                <div className="space-y-2 text-sm text-on-primary-container">
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    <span className="text-white">{area.polygon ? area.polygon.length : 0} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-white">{new Date(area.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leaflet Map */}
        <div className="lg:col-span-2 bg-[#141b2b] rounded-2xl border border-white/10 overflow-hidden relative" style={{ height: '500px' }}>
          <MapContainer 
            center={[28.6139, 77.2090]}
            zoom={12} 
            style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {areas.map((area) => {
              const positions = getLeafletPositions(area.polygon);
              if (positions.length === 0) return null;
              return (
                <Polygon 
                  key={area._id} 
                  positions={positions} 
                  pathOptions={{ 
                    color: '#3B82F6',
                    fillColor: '#3B82F6', 
                    fillOpacity: 0.2,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="text-black font-body-md">
                      <h3 className="font-bold">{area.name}</h3>
                      <p>{area.polygon.length} coordinate points</p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}
          </MapContainer>
        </div>

      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Service Area"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete <span className="text-white font-bold">{selectedArea?.name}</span>? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-white/10 rounded-lg text-on-primary-container hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminServiceAreas;
