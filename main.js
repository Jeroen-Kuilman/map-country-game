import {
  state,
  getRandomCountryIndex,
  createCurrentCountryObject,
  fetchCountryAPI,
} from "./script_modules/appModule";
import { gameMap } from "./script_modules/mapModule";
import listInterfaceModule from "./script_modules/listInterfaceModule";

// temporary eventlistener to toggle the search list //// REMOVE WHEN FINISHED

////////////////////////////////////////////////////////////////

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
  const query = e.target.value.toLowerCase();
  listInterfaceModule.renderMarkup(state.countries, query);
};

const init = function () {
  const countrySearchList = document.querySelector(".search-list");
  const startButton = document.querySelector(".btn-start");
  const input = document.querySelector("#country-search");

  input.addEventListener("input", function (e) {
    controlList(e);
  });
  countrySearchList.addEventListener("click", function (e) {
    const item = e.target.closest(".search-list-country");
    if (!item) return;
    input.value = item.dataset.country;
  });

  // window.addEventListener("keydown", function (e) {
  //   if (e.key === "Enter") console.log(e);
  //   else console.log("wrong button!");
  // });

  controlRound();
  startButton.addEventListener("click", controlRound);
};
init();
