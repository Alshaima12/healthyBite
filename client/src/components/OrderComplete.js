import React, { useState, useEffect } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import salad from "../images/salad-illustration.png";
import locationIcon from '../images/location-icon.webp';


function OrderComplete() {
  useRequireAuth();

  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const restaurantCoords = {
    lat: 23.589792255986705,
    lng: 58.38499049993414
  };

  const restaurantLocation =
    "https://maps.google.com/maps?q=23.589792255986705,58.38499049993414&hl=es;&output=embed";

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance;
  };

  // Request user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          setUserLocation(userCoords);

          // Calculate distance to restaurant
          const dist = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            restaurantCoords.lat,
            restaurantCoords.lng
          );

          setDistance(dist);
          setLoadingLocation(false);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred.';
          }

          setLocationError(errorMessage);
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  }, []);

  const handleViewMap = () => {
    window.open(restaurantLocation, "_blank");
  };

  return (
    <main className="order-complete-container">
      <section className="order-complete-left">
        <h2 className="order-complete-header">Order Complete Successfully!</h2>

        {/* Location Status */}
        {loadingLocation && (
          <div style={{ padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '8px', marginBottom: '15px' }}>
            <p style={{ margin: 0, color: '#2f8b4b' }}>📍 Retrieving your location...</p>
          </div>
        )}

        {/* Distance Information */}
        {distance !== null && !locationError && (
          <div style={{
            padding: '15px',
            backgroundColor: '#d2f0dd',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '2px solid #2f8b4b'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#295237', fontSize: '18px' }}>
              📍 Distance Information
            </h3>
            <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '600', color: '#2f8b4b' }}>
              Distance to restaurant: {distance.toFixed(2)} km
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
              Your location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
              Restaurant: {restaurantCoords.lat}, {restaurantCoords.lng}
            </p>
          </div>
        )}

        {/* Location Error */}
        {locationError && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffe6e6',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '2px solid #ff4444'
          }}>
            <p style={{ margin: 0, color: '#cc0000', fontWeight: '600' }}>
              ⚠️ {locationError}
            </p>
          </div>
        )}

        {/* Location Card */}
        <div className="location-card" onClick={handleViewMap}>
          <div className="location-icon-container">
            <img src={locationIcon} alt="Restaurant Location" className="location-icon" />
          </div>
          <p className="location-text">Restaurant Location</p>
        </div>
        <br />

        {/* Map Display */}
        <div className="map-container">
          <iframe
            src={restaurantLocation}
            width="100%"
            height="250"
            style={{
              border: "none",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Restaurant Location Map"
          ></iframe>
        </div>

      </section>

      <section className="order-complete-right">
        <div className="circle-image">
          <img src={salad} alt="Healthy bowl" />
        </div>
      </section>
    </main>
  );
}

export default OrderComplete;
