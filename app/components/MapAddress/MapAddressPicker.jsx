import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_API_KEY = 'AIzaSyCC7HjSHyAqiJ4lnJQ9l4p4nA3pcHKeoso';
Geocoder.init(GOOGLE_API_KEY);

const MapAddressPicker = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const [region, setRegion] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Request location permission (Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS auto handled
  };

  // Get current location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        setMarkerPos({ latitude, longitude });
        setTimeout(() => mapRef.current?.animateToRegion(newRegion, 500), 500);
        fetchAddress(latitude, longitude);
      },
      err => console.log('Location error:', err),
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
    );
  };

  // Fetch address from coordinates
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await Geocoder.from(lat, lng);
      const comp = res.results[0].address_components;
      const getVal = type => comp.find(c => c.types.includes(type))?.long_name || '';
      setSelectedAddress({
        address_line1: res.results[0].formatted_address,
        city: getVal('locality') || getVal('administrative_area_level_2'),
        state: getVal('administrative_area_level_1'),
        pincode: getVal('postal_code'),
        country: getVal('country'),
        landmark: '',
      });
    } catch (error) {
      console.log('Geocoder error:', error);
    }
  };

  // Automatically get current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Google Places Search */}
      <GooglePlacesAutocomplete
        placeholder="Search location"
        fetchDetails
        onPress={(data, details = null) => {
          if (!details) return;
          const { lat, lng } = details.geometry.location;
          const newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 };
          setRegion(newRegion);
          setMarkerPos({ latitude: lat, longitude: lng });
          mapRef.current?.animateToRegion(newRegion, 300);
          fetchAddress(lat, lng);
        }}
        query={{ key: GOOGLE_API_KEY, language: 'en' }}
        styles={{ container: styles.search, textInput: styles.searchInput }}
      />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        onPress={e => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setMarkerPos({ latitude, longitude });
          setRegion({ ...region, latitude, longitude });
          fetchAddress(latitude, longitude);
        }}
      >
        {markerPos && (
          <Marker
            coordinate={markerPos}
            draggable
            flat={false} // prevents rotation, keeps upright
            onDragEnd={e => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarkerPos({ latitude, longitude });
              fetchAddress(latitude, longitude);
            }}
          />
        )}
      </MapView>

      {/* Show Current Location Button */}
      <TouchableOpacity style={styles.currentBtn} onPress={getCurrentLocation}>
        <Text style={styles.currentBtnText}>Show Current Location</Text>
      </TouchableOpacity>

      {/* Confirm Selected Location Button */}
      {selectedAddress && (
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.navigate('AddDeleveryAddress', { selectedAddress })}
        >
          <Text style={styles.confirmBtnText}>Use This Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapAddressPicker;

const styles = StyleSheet.create({
  search: { position: 'absolute', top: 10, width: '100%', zIndex: 10 },
  searchInput: { height: 45, marginHorizontal: 10, borderRadius: 8 },
  currentBtn: {
    position: 'absolute',
    bottom: 80,
    right: 15,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
  },
  currentBtnText: { color: '#fff', fontWeight: 'bold' },
  confirmBtn: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
  },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
});
