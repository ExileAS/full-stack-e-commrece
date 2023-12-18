const OtpField = ({ handleOTP, otpRef }) => {
  return (
    <div>
      <input
        type="number"
        placeholder="type your otp..."
        className="input-otp"
        maxLength="6"
        onChange={handleOTP}
        ref={otpRef}
      />
    </div>
  );
};

export default OtpField;
