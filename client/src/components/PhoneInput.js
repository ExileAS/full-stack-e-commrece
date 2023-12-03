import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

export const PhoneNumberInput = ({ number, setNumber }) => {
  return (
    <PhoneInput
      international
      countryCallingCodeEditable={false}
      defaultCountry="EG"
      placeholder="enter phone number"
      value={number}
      onChange={setNumber}
    />
  );
};
