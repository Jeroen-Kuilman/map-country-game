import {
  state,
  createCurrentCountryObject,
  fetchCountryAPI,
} from "./script_modules/appModule";
import { gameMap } from "./script_modules/mapModule";

// temporary eventlistener to toggle the search list //// REMOVE WHEN FINISHED
const countrySearch = document.querySelector("#country-search");

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
    const data = await fetchCountryAPI();
    state.countries = data;
    const current = createCurrentCountryObject(state.countries);

    gameMap(current.lat, current.lng);

    document.querySelector(".instructions-title").textContent = current.name; // temporary feedback
    return state.currentCountry;
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  controlRound();
};

init();
startButton.addEventListener("click", function () {
  controlRound();
});
