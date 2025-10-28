import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function NairobiMap({ pickup, dropoff, driverLocation, showRoute = false }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const initializeMap = async () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          const L = window.L;
          
          // Initialize map centered on Nairobi
          const map = L.map(mapRef.current, {
            center: [-1.2921, 36.8219],
            zoom: 12,
            zoomControl: true
          });

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          mapInstanceRef.current = map;
          updateMarkers();
        };
        document.head.appendChild(script);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [pickup, dropoff, driverLocation]);

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    const bounds = [];

    // Add pickup marker (green)
    if (pickup) {
      const pickupMarker = L.marker([pickup.lat, pickup.lng], {
        icon: L.divIcon({
          html: '<div style="background-color: #2AD7A1; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          className: 'custom-marker'
        })
      }).addTo(map);
      
      pickupMarker.bindPopup(`<b>Pickup Location</b><br>${pickup.address}`);
      markersRef.current.push(pickupMarker);
      bounds.push([pickup.lat, pickup.lng]);
    }

    // Add dropoff marker (navy)
    if (dropoff) {
      const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], {
        icon: L.divIcon({
          html: '<div style="background-color: #0E1F40; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          className: 'custom-marker'
        })
      }).addTo(map);
      
      dropoffMarker.bindPopup(`<b>Dropoff Location</b><br>${dropoff.address}`);
      markersRef.current.push(dropoffMarker);
      bounds.push([dropoff.lat, dropoff.lng]);
    }

    // Add driver location marker (moving car)
    if (driverLocation) {
      const driverMarker = L.marker([driverLocation.lat, driverLocation.lng], {
        icon: L.divIcon({
          html: '<div style="background-color: #FFA500; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [15, 15],
          className: 'custom-marker driver-marker'
        })
      }).addTo(map);
      
      driverMarker.bindPopup('<b>Driver Location</b>');
      markersRef.current.push(driverMarker);
      bounds.push([driverLocation.lat, driverLocation.lng]);
    }

    // Add route line
    if (showRoute && pickup && dropoff) {
      const routeLine = L.polyline([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      ], {
        color: '#2AD7A1',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
      }).addTo(map);
      
      markersRef.current.push(routeLine);
    }

    // Fit map to show all markers
    if (bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 15);
      } else {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  };

  const centerOnLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstanceRef.current.setView([latitude, longitude], 16);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to Nairobi center
          mapInstanceRef.current.setView([-1.2921, 36.8219], 12);
        }
      );
    }
  };

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ minHeight: '300px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={centerOnLocation}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Center on my location"
        >
          <Navigation className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Loading State */}
      {!mapInstanceRef.current && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-turquoise mx-auto mb-2"></div>
            <MapPin className="w-12 h-12 mx-auto mb-2 text-turquoise" />
            <p className="text-gray-600 font-medium">Loading Nairobi Map</p>
            <p className="text-xs text-gray-500 mt-1">Powered by OpenStreetMap</p>
          </div>
        </div>
      )}

      {/* Map Legend */}
      {(pickup || dropoff || driverLocation) && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
          <div className="space-y-2 text-xs">
            {pickup && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-turquoise rounded-full"></div>
                <span>Pickup</span>
              </div>
            )}
            {dropoff && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-navy rounded-full"></div>
                <span>Dropoff</span>
              </div>
            )}
            {driverLocation && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Driver</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}