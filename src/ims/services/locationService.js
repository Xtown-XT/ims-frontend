import api from "./api.js";

const locationService = {
  // Get all countries
  getCountries: () => api.get("/location/countries"),

  // Get states by country ID
  getStatesByCountry: (countryId) => api.get(`/location/states/${countryId}`),

  // Get cities by state ID
  getCitiesByState: (stateId) => api.get(`/location/cities/${stateId}`),

  // Get all states (if no country filter needed)
  getAllStates: () => api.get("/location/states"),

  // Get all cities (if no state filter needed)
  getAllCities: () => api.get("/location/cities"),
};

export default locationService;
