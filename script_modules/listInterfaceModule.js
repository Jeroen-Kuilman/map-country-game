import { config } from "../config";

class CountrySearchList {
  _parentElement = document.querySelector(".search-list");
  _data;

  _message = "No matching countries found 🌍⁉️";

  renderMarkup(data, query) {
    this._data = data;
    if (!query) {
      this._hideList();
      this._parentElement.innerHTML = "";
      return;
    }

    this._showList();

    const results = this._data
      .filter((c) => !query || c.name.toLowerCase().startsWith(query))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, config.MAX_LIST_RESULTS);

    if (!results.length) return (this._parentElement.innerHTML = this._message);

    const markup = results.map((el) => this._generateMarkup(el)).join("");
    this._parentElement.innerHTML = markup;
  }

  _hideList() {
    this._parentElement.classList.add("hidden");
  }

  _showList() {
    this._parentElement.classList.remove("hidden");
  }

  _generateMarkup(country) {
    return `
    <li class="search-list-country" data-country="${country.name}">
        <p>${country.name}</p>
        <figure>
        <img
            class="country-flag"
            src="${country.flag}"
            alt="flag"
        />
        </figure>
    </li>
    `;
  }
}

export default new CountrySearchList();
