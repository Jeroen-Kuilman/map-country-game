class CountrySearchList {
  _parentElement = document.querySelector(".search-list");
  _data;

  renderMarkup(data) {
    this._data = data;
    console.log(data);
    const markup = this._data.map((el) => this._generateMarkup(el)).join("");

    this._parentElement.innerHTML = markup;
  }
  _generateMarkup(country) {
    return `
    <li class="search-list-country">
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
