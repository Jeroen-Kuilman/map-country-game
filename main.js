import { config } from "./config.js";
import {
  state,
  getRandomCountryIndex,
  createCurrentCountryObject,
  fetchCountryAPI,
  updateGameState,
} from "./script_modules/appModule";
import { gameMap } from "./script_modules/mapModule";
import listInterfaceModule from "./script_modules/listInterfaceModule";

const DOM = {
  countrySearchList: document.querySelector(".search-list"),
  startButton: document.querySelector(".btn-start"),
  input: document.querySelector("#country-search"),
};

const initiateFetch = async function () {
  try {
    const countries = await fetchCountryAPI();
    state.isInitialized = true;
    return countries;
  } catch (err) {
    console.error(err);
  }
};

const controlRound = async function () {
  try {
    if (!state.isInitialized) {
      state.countries = await initiateFetch();
    }
    // empty previous search result and hide list if not hidden
    DOM.input.value = "";
    listInterfaceModule.hideList();

    const countryIndex = getRandomCountryIndex(state.countries);
    const current = createCurrentCountryObject(state.countries, countryIndex);
    gameMap(current.lat, current.lng);

    document.querySelector(".instructions-title").textContent = current.name; // temporary feedback REMOVE WHEN DONE!!!!!!!!!

    console.log(state.roundResult); // temporary roundresults
  } catch (err) {
    console.error(err);
  }
};

const controlList = function (e) {
  const query = e.target.value.toLowerCase();
  listInterfaceModule.renderMarkup(state.countries, query);
};

const controlListInput = function (e) {
  const item = e.target.closest(".search-list-country");
  if (!item) return;
  DOM.input.value = item.dataset.country;
};

const controlListAutoComplete = function (e) {
  if (!listInterfaceModule.results.length) return;
  e.preventDefault();
  DOM.input.value = listInterfaceModule.results[0].name;
};

const controlInputConfirm = function (e) {
  if (!listInterfaceModule.results.length) return;

  // find better alternative for this check
  if (!DOM.countrySearchList.classList.contains("hidden")) {
    if (e.type === "keydown")
      // Making sure the final answer will ALWAYS match with an existing country.
      DOM.input.value = listInterfaceModule.results[0].name;

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

  DOM.countrySearchList.addEventListener("click", function (e) {
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
