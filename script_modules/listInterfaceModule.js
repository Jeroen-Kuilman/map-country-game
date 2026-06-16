import { config } from "../config";
class CountrySearchList {
  _parentElement = document.querySelector(".search-list");
  _data;

  // needs to be trigger by every key input
  renderMarkup(data, query) {
    this._data = data;
    const markup = this._data
      .filter((c) => c.name.toLowerCase().startsWith(query))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, config.MAX_LIST_RESULTS)
      .map((el) => this._generateMarkup(el))
      .join("");

    this._parentElement.innerHTML = markup;
  }

  _generateMarkup(country) {
    return `
    <li class="search-list-country ${country.name}">
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
