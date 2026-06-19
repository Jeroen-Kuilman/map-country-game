import { config, RESULT } from "./config.js";
import {
  state,
  toggleStateIsPlaying,
  resetState,
  getRandomCountryIndex,
  createCurrentCountryObject,
  fetchCountryAPI,
  fetchGeoData,
  updateGameState,
  updateRoundHistory,
} from "./script_modules/appModule";
import MapInterface from "./script_modules/mapModule";
import ListInterface from "./script_modules/listInterfaceModule";
import StatsInterface from "./script_modules/statsInterfaceModule.js";
import mapModule from "./script_modules/mapModule";
import statsInterfaceModule from "./script_modules/statsInterfaceModule.js";

const DOM = {
  searchList: document.querySelector(".search-list"),
  startButton: document.querySelector(".btn-start"),
  input: document.querySelector("#country-search"),
};

const controlGame = function () {
  if (state.isPlaying) {
    // reset relevant state and UI parts
    resetState();
    StatsInterface.clearMarkup(
      state.playerCorrectPoints,
      state.playerWrongPoints,
    );
    mapModule.clearMapUI();

    // control round (once)
    controlSetupRound();
  }
};

const controlSetupRound = function () {
  const previous = state.rounds.at(-1)?.markerCoords;
  DOM.input.value = "";
  ListInterface.hideList();

  const countryIndex = getRandomCountryIndex(state.countries);
  const current = createCurrentCountryObject(state.countries, countryIndex);
  MapInterface.renderGameMap(
    state.geoData,
    current.lat,
    current.lng,
    state.roundResult,
  );

  const newCoord = [current.lat, current.lng];
  if (previous) {
    MapInterface.addPolyLine([previous, newCoord], state.roundResult);
  }
};

const controlFinalizeRound = function () {
  const answer =
    DOM.input.value.toLowerCase() === state.currentCountry.name.toLowerCase();

  if (state.isProcessing) return;
  const checkResult = updateGameState(answer);

  controlApplyRoundResult();

  // timeout to visualize the answer before going to the next round
  state.isProcessing = true;
  setTimeout(() => {
    if (!checkResult) controlSetupRound();
    else controlFinalizeGame(checkResult);

    state.isProcessing = false;
  }, config.UPDATE_ROUND_SECONDS * 1000);
};

const controlApplyRoundResult = function () {
  updateRoundHistory(
    state.roundResult,
    state.currentCountry.lat,
    state.currentCountry.lng,
  );

  StatsInterface.renderMarkup(
    state.roundResult,
    state.playerCorrectPoints,
    state.playerWrongPoints,
  );

  // apply new marker color
  const roundIndex = state.rounds.length - 1;
  MapInterface.setMarkerResult(
    roundIndex,
    state.roundResult,
    state.currentCountry.name,
  );
};

const controlFinalizeGame = function (result) {
  DOM.input.value = "";
  ListInterface.clearMarkup();

  // temporary if statements for testing purposes
  if (result === RESULT.WON) {
    toggleStateIsPlaying();
    console.log("Game won");
    console.log(state.isPlaying);
  }
  if (result === RESULT.LOST) {
    toggleStateIsPlaying();
    console.log("Game lost");
    console.log(state.isPlaying);
  }
};

const controlInputConfirm = function (e) {
  if (!ListInterface.results.length) return;

  // find better alternative for this check
  if (!DOM.searchList.classList.contains("hidden")) {
    if (e.type === "keydown")
      // Making sure the final answer will ALWAYS match with an existing country.
      DOM.input.value = ListInterface.results[0].name;
    controlFinalizeRound();
  }
};

const controlList = function (e) {
  const query = e.target.value.toLowerCase();
  ListInterface.renderMarkup(state.countries, query);
};

const controlListAutoCompleteClick = function (e) {
  const item = e.target.closest(".search-list-country");
  if (!item) return;
  DOM.input.value = item.dataset.country;
};

const controlListAutoCompleteTab = function (e) {
  if (!ListInterface.results.length) return;
  e.preventDefault();
  DOM.input.value = ListInterface.results[0].name;
};

const initEventListeners = function () {
  DOM.input.addEventListener("input", function (e) {
    if (state.isPlaying) {
      controlList(e);
    }
  });

  DOM.searchList.addEventListener("click", (e) => {
    if (state.isPlaying) {
      controlListAutoCompleteClick(e);
      controlInputConfirm(e);
    }
  });

  DOM.input.addEventListener("keydown", (e) => {
    if (state.isPlaying) {
      if (e.key === "Tab") controlListAutoCompleteTab(e);
      if (e.key === "Enter") controlInputConfirm(e);
    }
  });

  DOM.startButton.addEventListener("click", function () {
    if (!state.isPlaying) {
      toggleStateIsPlaying();
      controlGame(); // start of a new game
    }
  });
};

const init = async function () {
  try {
    // fetch API data
    if (!state.isInitialized) {
      [state.countries, state.geoData] = await Promise.all([
        fetchCountryAPI(),
        fetchGeoData(),
      ]);
      state.isInitialized = true;
    }

    // setup initial map
    mapModule.renderGameMap(state.geoData); // temporary input (besides geoData)

    initEventListeners();
  } catch (err) {
    console.error(err);
  }
};

init();
