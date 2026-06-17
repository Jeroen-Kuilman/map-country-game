import { config, TEST_VARIABLES } from "./config.js";
import {
  state,
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

const DOM = {
  ListInterface: document.querySelector(".search-list"),
  startButton: document.querySelector(".btn-start"),
  input: document.querySelector("#country-search"),
};

const controlRound = async function () {
  try {
    if (!state.isInitialized) {
      [state.countries, state.geoData] = await Promise.all([
        fetchCountryAPI(),
        fetchGeoData(),
      ]);
      state.isInitialized = true;
    }

    // empty previous search result and hide list if not hidden
    DOM.input.value = "";
    ListInterface.hideList();

    const countryIndex = getRandomCountryIndex(state.countries);
    const current = createCurrentCountryObject(state.countries, countryIndex);
    MapInterface.renderGameMap(
      current.lat,
      current.lng,
      state.roundResult,
      state.geoData,
    );

    console.log(state.roundResult); // temporary roundresults
    updateRoundHistory(state.roundResult, current.lat, current.lng);

    const roundIndex = state.rounds.length - 2;
    MapInterface.setMarkerResult(roundIndex, state.roundResult);

    if (state.rounds.length < 2) return;
    const lastTwoCoords = state.rounds
      .slice(-2)
      .map((round) => round.markerCoords);
    MapInterface.addPolyLine(lastTwoCoords, state.roundResult);
  } catch (err) {
    console.error(err);
  }
};

const controlList = function (e) {
  const query = e.target.value.toLowerCase();
  ListInterface.renderMarkup(state.countries, query);
};

const controlListInput = function (e) {
  const item = e.target.closest(".search-list-country");
  if (!item) return;
  DOM.input.value = item.dataset.country;
};

const controlListAutoComplete = function (e) {
  if (!ListInterface.results.length) return;
  e.preventDefault();
  DOM.input.value = ListInterface.results[0].name;
};

const controlInputConfirm = function (e) {
  if (!ListInterface.results.length) return;

  // find better alternative for this check
  if (!DOM.ListInterface.classList.contains("hidden")) {
    if (e.type === "keydown")
      // Making sure the final answer will ALWAYS match with an existing country.
      DOM.input.value = ListInterface.results[0].name;

    const answer =
      DOM.input.value.toLowerCase() === state.currentCountry.name.toLowerCase();

    // timeout to visualize the answer before going to the next round
    if (state.isProcessing) return;
    state.isProcessing = true;
    setTimeout(() => {
      updateGameState(answer);
      controlRound();
      state.isProcessing = false;
    }, config.UPDATE_ROUND_SECONDS * 1000);
  }
};

const init = function () {
  DOM.input.addEventListener("input", function (e) {
    controlList(e);
  });

  DOM.ListInterface.addEventListener("click", function (e) {
    controlListInput(e);
    controlInputConfirm(e);
  });

  DOM.input.addEventListener("keydown", function (e) {
    if (e.key === "Tab") controlListAutoComplete(e);
    if (e.key === "Enter") controlInputConfirm(e);
  });

  controlRound();
  DOM.startButton.addEventListener("click", controlRound);
};
init();
