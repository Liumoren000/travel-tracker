import { useState, useEffect, useMemo } from 'react';
import { getCountriesForCities } from '../services/countryCache';

export function useStatistics(routes) {
  const [countryMap, setCountryMap] = useState(new Map());
  const [loading, setLoading] = useState(false);

  // Extract unique cities from routes
  const uniqueCities = useMemo(() => {
    const citySet = new Set();
    const cities = [];

    routes.forEach(route => {
      if (route.cities && Array.isArray(route.cities)) {
        route.cities.forEach(city => {
          const key = `${city.name}_${city.lat}_${city.lng}`;
          if (!citySet.has(key)) {
            citySet.add(key);
            cities.push(city);
          }
        });
      }
    });

    return cities;
  }, [routes]);

  // Fetch country info when cities change
  useEffect(() => {
    if (uniqueCities.length === 0) {
      setCountryMap(new Map());
      return;
    }

    let cancelled = false;

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const results = await getCountriesForCities(uniqueCities);
        if (!cancelled) {
          setCountryMap(results);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCountries();

    return () => {
      cancelled = true;
    };
  }, [uniqueCities]);

  // Calculate statistics
  const stats = useMemo(() => {
    const countryGroups = {};

    uniqueCities.forEach(city => {
      const countryInfo = countryMap.get(city.name);
      const country = countryInfo?.country || '未知';
      
      if (!countryGroups[country]) {
        countryGroups[country] = {
          country,
          countryCode: countryInfo?.countryCode || 'XX',
          cities: []
        };
      }
      countryGroups[country].cities.push(city.name);
    });

    const sortedCountries = Object.values(countryGroups).sort(
      (a, b) => b.cities.length - a.cities.length
    );

    return {
      countryCount: sortedCountries.length,
      cityCount: uniqueCities.length,
      countries: sortedCountries
    };
  }, [uniqueCities, countryMap]);

  return { stats, loading };
}
