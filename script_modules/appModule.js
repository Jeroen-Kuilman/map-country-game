export const getJSON = async function () {
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

    console.log(countriesMerged);
  } catch (err) {
    console.error(err);
  }
};
