import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
const ConutryPicker = ({ countryState, setCountryState }) => {
  return (
    <span className="country-drop">
      <CountryDropdown
        classes="country"
        value={countryState.country}
        onChange={(v) => setCountryState({ ...countryState, country: v })}
      />
      <RegionDropdown
        country={countryState.country}
        value={countryState.region}
        onChange={(v) => setCountryState({ ...countryState, region: v })}
      />
    </span>
  );
};

export default ConutryPicker;
