import {
  state,
  getRandomCountryIndex,
  createCurrentCountryObject,
  fetchCountryAPI,
} from "./script_modules/appModule";
import { gameMap } from "./script_modules/mapModule";
import listInterfaceModule from "./script_modules/listInterfaceModule";

// temporary eventlistener to toggle the search list //// REMOVE WHEN FINISHED
const countrySearch = document.querySelector("#country-search");
const countrySearchLI = document.querySelector(".search-list-country");

// Will be added later.
// li.addEventListener("mousedown", () => {
//   // selectie werkt vóór blur
// });

////////////////////////////////////////////////////////////////
const startButton = document.querySelector(".btn-start");
const input = document.querySelector("#country-search");

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
  if (!state.isInitialized) {
    state.countries = await initiateFetch();
  }

  const countryIndex = getRandomCountryIndex(state.countries);
  const current = createCurrentCountryObject(state.countries, countryIndex);
  gameMap(current.lat, current.lng);

  document.querySelector(".instructions-title").textContent = current.name; // temporary feedback
};

const controlList = function (e) {
  console.log(e);

  const query = e.target.value.toLowerCase();
  listInterfaceModule.renderMarkup(state.countries, query);
};

const init = function () {
  input.addEventListener("input", function (e) {
    controlList(e);
  });

  countrySearch.addEventListener("focus", function () {
    document.querySelector(".search-list").classList.remove("hidden");
  });
  // li.addEventListener("mousedown", function (e) {
  //   console.log(e.target);
  // });
  countrySearch.addEventListener("blur", function () {
    document.querySelector(".search-list").classList.add("hidden");
  });

  controlRound();
  startButton.addEventListener("click", controlRound);
};
init();
