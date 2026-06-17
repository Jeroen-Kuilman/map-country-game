class StatsInterface {
  _parentElement = document.querySelector(".stats-container");

  renderMarkup(data) {
    this._data = data;

    this._parentElement.innerHTML = markup;
  }
  _generateMarkup(country) {
    return `
    <h2>Stats</h2>
            <h3>Points:</h3>
            <p class="points-display">🔥🔥</p>

            <h3>Lifes:</h3>
            <p class="lifes-display">💗💗💗</p>
    `;
  }
}

export default new StatsInterface();
