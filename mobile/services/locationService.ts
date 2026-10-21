import * as Location from 'expo-location';
import { ItemLocation } from '../types/item';

const DEFAULT_LOCATION: ItemLocation = {
  latitude: 37.7749,
  longitude: -122.4194,
  city: 'San Francisco',
  state: 'CA',
  country: 'USA',
  approximateArea: 'Civic Center / Market St',
};

export const locationService = {
  async getCurrentLocation(): Promise<ItemLocation> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return DEFAULT_LOCATION;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const city = geocode?.city || geocode?.subregion || 'San Francisco';
      const district = geocode?.district || geocode?.street || 'Central Area';
      const approximateArea = `${district}, ${city}`;

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city,
        state: geocode?.region || undefined,
        country: geocode?.country || undefined,
        approximateArea,
      };
    } catch (err) {
      console.warn('Could not fetch GPS location, using default:', err);
      return DEFAULT_LOCATION;
    }
  },

  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};
