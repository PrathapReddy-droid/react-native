import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
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

  // ---------------- LOCATION PERMISSION ----------------
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // ---------------- CURRENT LOCATION ----------------
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setMarkerPos({ latitude, longitude });

        mapRef.current?.animateToRegion(newRegion, 500);
        fetchAddress(latitude, longitude);
      },
      error => {
        Alert.alert('Error', 'Unable to fetch location');
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  };

  // ---------------- FETCH ADDRESS ----------------
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await Geocoder.from(lat, lng);
      const comp = res.results?.[0]?.address_components || [];

      const getVal = type =>
        comp.find(c => c.types.includes(type))?.long_name || '';

      setSelectedAddress({
        address_line1: res.results[0].formatted_address || '',
        city: getVal('locality') || getVal('administrative_area_level_2'),
        state: getVal('administrative_area_level_1'),
        pincode: getVal('postal_code'),
        country: getVal('country'),
        landmark: '',
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      // ✅ Fallback so button always appears
      setSelectedAddress({
        address_line1: 'Selected Location',
        city: '',
        state: '',
        pincode: '',
        country: '',
        landmark: '',
        latitude: lat,
        longitude: lng,
      });
    }
  };

  // ---------------- ON LOAD ----------------
  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (!region) {
    return (
      <View style={styles.loader}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* -------- SEARCH -------- */}
      <GooglePlacesAutocomplete
        placeholder="Search location"
        fetchDetails
        onPress={(data, details = null) => {
          if (!details) return;

          const { lat, lng } = details.geometry.location;

          const newRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setRegion(newRegion);
          setMarkerPos({ latitude: lat, longitude: lng });
          mapRef.current?.animateToRegion(newRegion, 300);

          fetchAddress(lat, lng);
        }}
        query={{ key: GOOGLE_API_KEY, language: 'en' }}
        styles={{
          container: styles.search,
          textInput: styles.searchInput,
        }}
      />

      {/* -------- MAP -------- */}
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
            onDragEnd={e => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarkerPos({ latitude, longitude });
              setRegion({ ...region, latitude, longitude });
              fetchAddress(latitude, longitude);
            }}
          />
        )}
      </MapView>

      {/* -------- CURRENT LOCATION BUTTON -------- */}
      <TouchableOpacity style={styles.currentBtn} onPress={getCurrentLocation}>
        <Text style={styles.btnText}>Current Location</Text>
      </TouchableOpacity>

      {/* -------- CONFIRM BUTTON -------- */}
      {markerPos && (
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() =>
            navigation.navigate('AddDeleveryAddress', { selectedAddress })
          }
        >
          <Text style={styles.btnText}>Use This Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapAddressPicker;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    position: 'absolute',
    top: 10,
    width: '100%',
    zIndex: 10,
  },
  searchInput: {
    height: 45,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  currentBtn: {
    position: 'absolute',
    bottom: 90,
    right: 15,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    zIndex: 10,
  },
  confirmBtn: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    zIndex: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
