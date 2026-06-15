export const state = {
  countries: [],
  currentCountry: {},
  isInitialized: false,
};

export const getRandomCountryIndex = function (data) {
  // create a random number which will be based on the total amount of countries (data)
  return Math.floor(Math.random() * data.length);
};

export const createCurrentCountryObject = function (data, randNum) {
  const currentCountry = data[randNum];
  state.currentCountry = {
    name: currentCountry.name,
    flag: currentCountry.flag,
    lat: currentCountry.lat,
    lng: currentCountry.lng,
  };
  return state.currentCountry;
};

export const fetchCountryAPI = async function () {
  try {
    const [countryInfoRes, countryCoordsRes] = await Promise.all([
      fetch(
        "https://countriesnow.space/api/v0.1/countries/info?returns=name,flag",
      ),
      fetch("https://countriesnow.space/api/v0.1/countries/positions"),
    ]);

    if (!countryInfoRes.ok || !countryCoordsRes.ok)
      throw new Error(`Fetch failed`);

    const [countryInfoData, countryCoordsData] = await Promise.all([
      countryInfoRes.json(),
      countryCoordsRes.json(),
    ]);

    // merging arrays and filtering out incomplete data.
    const positions = countryCoordsData.data;
    const countriesMerged = countryInfoData.data
      .map((country) => {
        const pos = positions.find((p) => p.name === country.name);
        return {
          name: country.name,
          flag: country.flag,
          lat: pos?.lat ?? null,
          lng: pos?.long ?? null,
        };
      })
      .filter(
        (country) =>
          country.flag !== undefined &&
          country.lat !== null &&
          country.lng !== null,
      );

    return countriesMerged;
  } catch (err) {
    console.error(err);
  }
};
