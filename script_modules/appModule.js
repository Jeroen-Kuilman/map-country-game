const state = {
  country: {},
};

const createCountryObject = function (data, num) {
  console.log(data[0]);
  const country = data[num];
  return (state.country = {
    name: country.name,
    flag: country.flag,
    lat: country.lat,
    lng: country.lng,
  });
};

export const fetchCountryAPI = async function () {
  try {
    const [countryInfoRes, countryCoordsRes] = await Promise.all([
      fetch(
        "https://countriesnow.space/api/v0.1/countries/info?returns=name,flag",
      ),
      fetch("https://countriesnow.space/api/v0.1/countries/positions"),
    ]);

    if (!countryInfoRes.ok || !countryCoordsRes.ok)
      throw new Error(`Fetch failed`);

    const [countryInfoData, countryCoordsData] = await Promise.all([
      countryInfoRes.json(),
      countryCoordsRes.json(),
    ]);

    const positions = countryCoordsData.data;
    const countriesMerged = countryInfoData.data
      .map((country) => {
        const pos = positions.find((p) => p.name === country.name);
        return {
          name: country.name,
          flag: country.flag,
          lat: pos?.lat ?? null,
          lng: pos?.long ?? null,
        };
      })
      .filter(
        (country) =>
          country.flag !== undefined &&
          country.lat !== null &&
          country.lng !== null,
      );

    return countriesMerged;
  } catch (err) {
    console.error(err);
  }
};
// const arr = getJSON();
// createCountryArray(arr, 0);
const arr = await fetchCountryAPI();
createCountryObject(arr, Math.floor(Math.random() * (arr.length - 1)));
console.log(state.country);
