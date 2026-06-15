import { fetchCountryAPI } from "./script_modules/appModule";
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
gameMap();
// fetchCountryAPI()
