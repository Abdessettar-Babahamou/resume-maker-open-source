import { useState, useEffect } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

export function useLocationData() {
  const [country, setCountry] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [location, setLocation] = useState<{
    country: string;
    state: string;
    city:string
  }>({ country: '', state: '',city:'' });

  useEffect(() => {
    const loadCountries = async () => {
      const countries = await Country.getAllCountries();
      setCountry(countries);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      if (location.country) {
        const [countryCode] = location.country.split('-');
        const statesList = await State.getStatesOfCountry(countryCode);
        setStates(statesList);
      } else {
        setStates([]);
      }
      setCities([]);
    };
    loadStates();
  }, [location.country]);

  useEffect(() => {
    console.log("rener cityces")
    const loadCities = async () => {
      if (location.state) {
        const [countryCode, stateCode] = location.state.split('-');
        const citiesList = await City.getCitiesOfState(countryCode, stateCode);
        setCities(citiesList);
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [location.state]);

  return {
    country,
    states,
    cities,
    location,
     setCities,
    setLocation,
  };
}
