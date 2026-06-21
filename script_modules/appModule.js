import { config, RESULT } from "./../config.js";

export const state = {
  countries: [],
  shuffledCountries: [],
  currentCountryIndex: null,
  currentCountry: {},
  isInitialized: false,
  roundResult: null,
  rounds: [], // keep for tracking game history as a possible future feature
  isProcessing: false,
  geoData: null,
  playerWrongPoints: config.POINTS_INIT_VALUE,
  playerCorrectPoints: config.POINTS_INIT_VALUE,
  isPlaying: false,
  gameResult: null,
};

export const createCurrentCountryObject = function (country) {
  state.currentCountry = {
    name: country.name,
    flag: country.flag,
    population: country.population,
    lat: +country.lat,
    lng: +country.lng,
  };

  return state.currentCountry;
};

const createInitialStateObject = function () {
  return {
    currentCountry: {},
    playerWrongPoints: config.POINTS_INIT_VALUE, // 0
    playerCorrectPoints: config.POINTS_INIT_VALUE,
    roundResult: null,
    isProcessing: false,
    rounds: [],
    gameResult: null,
    shuffledCountries: [],
    currentCountryIndex: null,
  };
};

export const resetState = function () {
  Object.assign(state, createInitialStateObject());
};

export const toggleStateIsPlaying = function () {
  state.isPlaying = !state.isPlaying;
};

// export const getRandomCountryIndex = function (data) {
//   // create a random number which will be based on the total amount of countries (data)
//   return Math.floor(Math.random() * data.length);
// };

export const shuffleStateCountriesArray = function () {
  const arr = [...state.countries];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  state.shuffledCountries = arr;
  state.currentCountryIndex = 0;
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
    if (!countryInfoRes.ok && !countryCoordsRes.ok && !countryPopRes.ok)
      throw new Error(`Fetch country API completely failed`);

    if (!countryInfoRes.ok || !countryCoordsRes.ok || !countryPopRes.ok)
      throw new Error(`Fetch country API partially failed`);

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
    throw err;
  }
};

export const fetchGeoData = async function () {
  try {
    const geoRes = await fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
    );
    if (!geoRes.ok) throw new Error(`Fetch GeoData failed`);

    const geoData = await geoRes.json();

    return geoData;
  } catch (err) {
    throw err;
  }
};

const checkGameEndingConditions = function () {
  if (state.playerCorrectPoints >= config.PLAYER_CORRECT_MAX) {
    state.gameResult = RESULT.WON;
    return state.gameResult;
  }
  if (state.playerWrongPoints >= config.PLAYER_WRONG_MAX) {
    state.gameResult = RESULT.LOST;
    return state.gameResult;
  }
};

const applyResult = function (result) {
  if (result === RESULT.CORRECT) {
    state.playerCorrectPoints++;
  } else {
    state.playerWrongPoints++;
  }
};

export const updateGameState = function (answer) {
  const result = answer ? RESULT.CORRECT : RESULT.WRONG;

  state.roundResult = result;
  applyResult(result);
  return checkGameEndingConditions();
};

export const updateRoundHistory = function (result = "test", lat, lng) {
  state.rounds.push({
    result,
    markerCoords: [lat, lng],
    country: state.currentCountry.name,
  });
};
