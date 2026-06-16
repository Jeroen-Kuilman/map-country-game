import {
  state,
  getRandomCountryIndex,
  createCurrentCountryObject,
  fetchCountryAPI,
} from "./script_modules/appModule";
import { gameMap } from "./script_modules/mapModule";
import CountrySearchList from "./script_modules/listInterfaceModule";

// temporary eventlistener to toggle the search list //// REMOVE WHEN FINISHED
const countrySearch = document.querySelector("#country-search");

// Will be added later.
// li.addEventListener("mousedown", () => {
//   // selectie werkt vóór blur
// });

countrySearch.addEventListener("focus", function () {
  document.querySelector(".search-list").classList.remove("hidden");
});
countrySearch.addEventListener("blur", function () {
  document.querySelector(".search-list").classList.add("hidden");
});

////////////////////////////////////////////////////////////////
const startButton = document.querySelector(".btn-start");

const controlRound = async function () {
  try {
    if (!state.isInitialized) {
      state.countries = await fetchCountryAPI();
      state.isInitialized = true;
    }

    const countryIndex = getRandomCountryIndex(state.countries);
    const current = createCurrentCountryObject(state.countries, countryIndex);
    gameMap(current.lat, current.lng);

    document.querySelector(".instructions-title").textContent = current.name; // temporary feedback

    // NEEDS A SEPARATE CONTROL FUNCTION
    CountrySearchList.renderMarkup(state.countries);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  controlRound();
  startButton.addEventListener("click", controlRound);
  console.log(state);
};
init();
