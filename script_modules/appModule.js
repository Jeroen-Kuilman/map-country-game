import { config, RESULT } from "./../config.js";

export const state = {
  countries: [],
  currentCountry: {},
  isInitialized: false,
  roundResult: null,
  isProcessing: false,
};

export const getRandomCountryIndex = function (data) {
  // create a random number which will be based on the total amount of countries (data)
  return Math.floor(Math.random() * data.length);
};

export const createCurrentCountryObject = function (data, randNum) {
  const index = randNum;
  const currentCountry = data[index];
  state.currentCountry = {
    name: currentCountry.name,
    flag: currentCountry.flag,
    population: currentCountry.population,
    lat: +currentCountry.lat,
    lng: +currentCountry.lng,
    index: index, // possible future use
  };
  return state.currentCountry;
};

export const fetchCountryAPI = async function () {
  try {
    const [countryInfoRes, countryCoordsRes, countryPopRes] = await Promise.all(
      [
        fetch(
          "https://countriesnow.space/api/v0.1/countries/info?returns=name,flag",
        ),
        fetch("https://countriesnow.space/api/v0.1/countries/positions"),
        fetch("https://countriesnow.space/api/v0.1/countries/population"),
      ],
    );

    if (!countryInfoRes.ok || !countryCoordsRes.ok || !countryPopRes.ok)
      throw new Error(`Fetch failed`);

    const [countryInfoData, countryCoordsData, countryPopData] =
      await Promise.all([
        countryInfoRes.json(),
        countryCoordsRes.json(),
        countryPopRes.json(),
      ]);

    // merging arrays and filtering out incomplete data.
    const positions = countryCoordsData.data;
    const populations = countryPopData.data;
    const countriesMerged = countryInfoData.data
      .map((country) => {
        const pos = positions.find((p) => p.name === country.name);
        const pop = populations.find((p) => p.country === country.name);
        const latestPop = pop?.populationCounts?.at(-1)?.value ?? null;
        return {
          name: country.name,
          flag: country.flag,
          population: latestPop,
          lat: pos?.lat ?? null,
          lng: pos?.long ?? null,
        };
      })
      .filter(
        (country) =>
          country.flag !== undefined &&
          country.lat !== null &&
          country.lng !== null &&
          country.population !== null &&
          // added to limit the amount of tiny countries
          country.population > config.MIN_POP_SIZE,
      );

    return countriesMerged;
  } catch (err) {
    console.error(err);
  }
};

export const updateGameState = function (answer) {
  state.roundResult = answer ? RESULT.CORRECT : RESULT.WRONG;
  if (state.roundResult === RESULT.CORRECT) {
    return;
  }
  if (state.countries === RESULT.WRONG) {
  }
};
