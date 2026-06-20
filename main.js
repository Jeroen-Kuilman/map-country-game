import { config, RESULT, FEEDBACK_MESSAGE } from "./config.js";
import {
  state,
  toggleStateIsPlaying,
  resetState,
  createCurrentCountryObject,
  fetchCountryAPI,
  fetchGeoData,
  updateGameState,
  updateRoundHistory,
  shuffleStateCountriesArray,
} from "./script_modules/appModule";
import MapInterface from "./script_modules/mapModule";
import ListInterface from "./script_modules/listInterfaceModule";
import StatsInterface from "./script_modules/statsInterfaceModule.js";
// removed duplicate imports: use `MapInterface` for map actions and `StatsInterface` for stats

const DOM = {
  searchList: document.querySelector(".search-list"),
  startButton: document.querySelector(".btn-start"),
  input: document.querySelector("#country-search"),
  feedbackMessage: document.querySelector(".feedback-title"),
};

const controlGame = function () {
  // reset relevant state and UI parts
  resetState();
  StatsInterface.clearMarkup(
    state.playerCorrectPoints,
    state.playerWrongPoints,
  );
  MapInterface.clearMapUI();
  shuffleStateCountriesArray();
  // control round (once)
  controlSetupRound();
  // initial isPlaying feedback
  controlFeedback();
};

const controlSetupRound = function () {
  const previous = state.rounds.at(-1)?.markerCoords;
  DOM.input.value = "";
  ListInterface.hideList();

  const country = state.shuffledCountries[state.currentCountryIndex];
  const current = createCurrentCountryObject(country);

  state.currentCountryIndex++;

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

const controlFinalizeRound = function (answer) {
  console.log(answer);
  const checkAnswer = answer === state.currentCountry.name;
  if (state.isProcessing) return;
  const checkGameEnd = updateGameState(checkAnswer);

  controlApplyRoundResult(answer, checkAnswer);

  // timeout to visualize the answer before going to the next round
  state.isProcessing = true;
  setTimeout(() => {
    if (!checkGameEnd) controlSetupRound();
    else controlFinalizeGame();

    state.isProcessing = false;
  }, config.UPDATE_ROUND_SECONDS * 1000);
};

const controlApplyRoundResult = function (answer, checkAnswer) {
  const wrongAnswerOfPlayer = !checkAnswer ? answer : null;
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
    wrongAnswerOfPlayer,
  );
};

const controlFeedback = function () {
  const feedback = (message) => (DOM.feedbackMessage.textContent = message);
  // default feedback
  if (!state.isPlaying && !state.gameResult)
    return feedback(FEEDBACK_MESSAGE.DEFAULT);
  // has won feedback
  if (!state.isPlaying && state.gameResult === RESULT.WON)
    return feedback(FEEDBACK_MESSAGE.GAMEOVER_WON);
  // has lost feedback
  if (!state.isPlaying && state.gameResult === RESULT.LOST)
    return feedback(FEEDBACK_MESSAGE.GAMEOVER_LOST);
  // is playing feedback
  if (state.isPlaying) return feedback(FEEDBACK_MESSAGE.ISPLAYING);
};

const controlFinalizeGame = function () {
  toggleStateIsPlaying();
  DOM.input.value = "";
  ListInterface.clearMarkup();
  MapInterface.setMapToOverview();

  // gameover feedback (needs to be after toggleStateIsPlaying)
  controlFeedback();
};
const controlList = function (e) {
  const query = e.target.value.toLowerCase();
  ListInterface.renderMarkup(state.countries, query);
};

const initEventListeners = function () {
  DOM.input.addEventListener("input", function (e) {
    if (state.isPlaying) {
      controlList(e);
    }
  });

  DOM.searchList.addEventListener("click", (e) => {
    if (state.isPlaying) {
      const item = e.target.closest(".search-list-country");
      if (!item) return;

      const index = Number(item.dataset.index);

      ListInterface.setSelectedByIndex(index);

      DOM.input.value = item.dataset.country;

      controlFinalizeRound(DOM.input.value);
    }
  });

  DOM.input.addEventListener("keydown", (e) => {
    if (state.isPlaying) {
      if (e.key === "Tab") {
        e.preventDefault();
        const next = ListInterface.selectNext();

        if (next) {
          DOM.input.value = next.name;
        }
      }
      if (e.key === "Enter") {
        const selected = ListInterface.getSelectedName();

        const value = selected || ListInterface.results[0]?.name;

        if (value) {
          controlFinalizeRound(value);
        }
      }
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

    // initial feedback
    controlFeedback();

    // setup initial map
    MapInterface.renderGameMap(state.geoData); // temporary input (besides geoData)

    initEventListeners();
  } catch (err) {
    console.error(err);
  }
};

init();
