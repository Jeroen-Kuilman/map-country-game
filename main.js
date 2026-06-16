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

    console.log(state.roundResult);
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
  return (DOM.input.value = item.dataset.country);
};

const controlListAutoComplete = function (e) {
  if (!listInterfaceModule.results.length) return;
  if (e.key === "Tab") {
    e.preventDefault();
    DOM.input.value = listInterfaceModule.results[0].name;
  }
};

const controlInputConfirm = function (e) {
  if (!listInterfaceModule.results.length) return;
  if (
    e.key === "Enter" &&
    !DOM.countrySearchList.classList.contains("hidden")
  ) {
    const answer =
      DOM.input.value.toLowerCase() === state.currentCountry.name.toLowerCase();
    updateGameState(answer);
    controlRound();
  }
};

const init = function () {
  DOM.input.addEventListener("input", function (e) {
    controlList(e);
  });

  DOM.countrySearchList.addEventListener("click", function (e) {
    controlListInput(e);
  });

  DOM.input.addEventListener("keydown", function (e) {
    controlListAutoComplete(e);
  });

  DOM.input.addEventListener("keydown", function (e) {
    controlInputConfirm(e);
  });

  controlRound();
  DOM.startButton.addEventListener("click", controlRound);
};
init();
