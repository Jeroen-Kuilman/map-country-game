import { config } from "../config.js";
import fallbackFlag from "../img/NO_FLAG_drawio.png";

class ListInterface {
  _parentElement = document.querySelector(".search-list");
  _data;

  _message = "No matching countries found 🌍⁉️";

  results = [];

  selectedIndex = -1; // reset in renderMarkup

  renderMarkup(data, query) {
    this._data = data;
    if (!query) {
      this.hideList();
      this._parentElement.innerHTML = "";
      return;
    }
    this._showList();
    this.results = this._generateSearchResults(this._data, query);

    this.selectedIndex = -1;
    this._renderList();

    // if (!this.results.length)
    //   return (this._parentElement.innerHTML = this._message);

    // const markup = this.results.map((el) => this._generateMarkup(el)).join("");
    // this._parentElement.innerHTML = markup;
  }

  _generateSearchResults(data, query) {
    return data
      .filter((c) => c.name.toLowerCase().startsWith(query))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, config.MAX_LIST_RESULTS);
  }

  _renderList() {
    const html = this.results
      .map((el, index) => this._generateMarkup(el, index))
      .join("");
    this._parentElement.innerHTML = html;
  }

  hideList() {
    this._parentElement.classList.add("hidden");
  }

  _showList() {
    this._parentElement.classList.remove("hidden");
  }

  _generateMarkup(country, index) {
    return `
    <li class="search-list-country ${index === this.selectedIndex ? "selected" : ""}"data-index${index} data-country="${country.name}">
      <p>${country.name}</p>
      <figure>
      <img
        class="country-flag"
        src="${country.flag}"
        alt="flag of ${country.name}"
        onerror="this.onerror=null;this.src='${fallbackFlag}';this.classList.add('country-flag');"
      />
      </figure>
    </li>
    `;
  }

  selectNext() {
    if (!this.results.length) return null;

    this.selectedIndex = (this.selectedIndex + 1) % this.results.length;

    this._renderList();

    return this.results[this.selectedIndex];
  }

  getSelectedName() {
    if (this.selectedIndex === -1) return null;

    return this.results[this.selectedIndex].name;
  }

  setSelectedByIndex(i) {
    this.selectedIndex = i;
    this._renderList();
  }

  clearMarkup() {
    this._parentElement.innerHTML = "";
    this.hideList();
  }
}

export default new ListInterface();
