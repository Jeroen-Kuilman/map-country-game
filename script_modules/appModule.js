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

////////////////////////////////
// create objects
///////////////////////////////
/**
 * creates an Object for the current country for a round.
 * @param {Object} country
 * @returns {Object} state.currentCountry
 */
export const createCurrentCountryObject = function (country) {
  state.currentCountry = {
    name: country.name,
    flag: country.flag,
    population: country.population,
    lat: country.lat,
    lng: country.lng,
  };
  return state.currentCountry;
};

/**
 * A function to reset certain state properties to its default values
 * @returns {Object}
 */
const createInitialStateObject = function () {
  return {
    currentCountry: {},
    playerWrongPoints: config.POINTS_INIT_VALUE,
    playerCorrectPoints: config.POINTS_INIT_VALUE,
    roundResult: null,
    isProcessing: false,
    rounds: [],
    gameResult: null,
    shuffledCountries: [],
    currentCountryIndex: null,
  };
};

////////////////////////////////
// state manipulation
///////////////////////////////
export const resetState = function () {
  Object.assign(state, createInitialStateObject());
};

export const toggleStateIsPlaying = function () {
  state.isPlaying = !state.isPlaying;
};

/**
 * Shuffle the state.countries array using the Fisher-Yates algorithm, with the goal of providing a unique sequence of countries every new game.
 * Gets called in controlGame in main.js
 * Mutatesstate.shuffledCountries and state.currentCountryIndex.
 */
export const shuffleStateCountriesArray = function () {
  const arr = [...state.countries];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  state.shuffledCountries = arr;
  state.currentCountryIndex = 0;
};

/**
 * called by updateRoundHistory
 * Updates state.gameResult based on whether state.playerCorrect/WrongPoints target has been reached.
 * @returns {string} state.gameResult -RESULT.WON or RESULT.LOST
 */
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

/**
 * Updates state.playerCorrect/WrongPoints
 * @param {string} result -RESULT.CORRECT or RESULT.WRONG
 */
const applyResult = function (result) {
  if (result === RESULT.CORRECT) {
    state.playerCorrectPoints++;
  } else {
    state.playerWrongPoints++;
  }
};

/**
 * Updates the state.roundresult.
 * Calls applyresults.
 * On return the modified data gets passed on and can be stored in a local variable the moment updateGameState is called.
 * @param {boolean} validAnswer  -true or false
 * @returns {function} checkGameEndingCondion()
 */
export const updateGameState = function (validAnswer) {
  const result = validAnswer ? RESULT.CORRECT : RESULT.WRONG;

  state.roundResult = result;
  applyResult(result);
  return checkGameEndingConditions();
};

/**
 * pushes the result, with matching coordinates, into state.rounds. Used to keep track of rounds.
 * Necessary to add polylines between markers
 * @param {string} result -"correct" or "wrong"
 * @param {number} lat    -Latitude
 * @param {number} lng    -Longitude
 */
export const updateRoundHistory = function (result, lat, lng) {
  state.rounds.push({
    result,
    markerCoords: [lat, lng],
    country: state.currentCountry.name,
  });
};

////////////////////////////////
// API fetching
///////////////////////////////
/**
 * @typedef {Object} Country
 * @property {string} name        - Country name
 * @property {string} flag        - URL to flag image
 * @property {number} population  - Latest population value
 * @property {number} lat         - Latitude
 * @property {number} lng         - Longitude
 */

/**
 * Fetch, merge and filter country info, coordinates and population. Countries with missing data (flag excepted) or less than the specified minimum of population amount will be filtered out
 * @async
 * @returns {Promise<country[]>} Array of merged country objects
 * @throws {Error} When one or more fetch requests fail
 * @example
 * const countries = await fetchCountryAPI();
 * console.log(countries[0].name, countries[0].lat, countries[0].lng);
 */
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
          population: +latestPop,
          lat: +pos?.lat ?? null,
          lng: +pos?.long ?? null,
        };
      })
      .filter(
        (country) =>
          country.flag !== undefined &&
          country.lat !== null &&
          country.lng !== null &&
          country.population !== null &&
          country.population > config.MIN_POP_SIZE,
      );

    return countriesMerged;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetch data to create a GeoJSON country borders layer over the map for better visibility.
 * @async
 * @returns {Promise<Object>} GeoJSON object with country border features
 * @throws {Error} When the fetch request fails
 */
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
