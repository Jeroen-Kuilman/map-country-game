import redIconUrl from "../img/marker-icon-red.png";
import greenIconUrl from "../img/marker-icon-green.png";

import { RESULT } from "./../config.js";
class StatsInterface {
  _rightContainer = document.querySelector(".right-answers-display");
  _wrongContainer = document.querySelector(".wrong-answers-display");
  _rightCounter = document.querySelector(".right-counter");
  _wrongCounter = document.querySelector(".wrong-counter");

  renderMarkup(lastRoundAnswer, correctCount, wrongCount) {
    const data = lastRoundAnswer;
    if (!data) return;
    const counter = data === RESULT.CORRECT ? correctCount : wrongCount;

    const iconElement =
      data === RESULT.CORRECT ? this._rightContainer : this._wrongContainer;

    const counterElement =
      data === RESULT.CORRECT ? this._rightCounter : this._wrongCounter;

    const iconMarkup = this._generateIcon(data);

    iconElement.insertAdjacentHTML("beforeend", iconMarkup);
    counterElement.textContent = counter;
  }
  _generateIcon(data) {
    return `<img src="${data === RESULT.CORRECT ? greenIconUrl : redIconUrl}" class="stat-icon" />
    
    `;
  }
  clearMarkup(rightDefault, wrongDefault) {
    this._rightContainer.innerHTML = "";
    this._wrongContainer.innerHTML = "";

    this._rightCounter.textContent = rightDefault;
    this._wrongCounter.textContent = wrongDefault;
  }
}

export default new StatsInterface();
