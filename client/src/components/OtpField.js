import React from "react";

const OtpField = React.memo(({ handleOTP, otpRef }) => {
  return (
    <div>
      <input
        type="number"
        placeholder="type your otp..."
        className="input-otp"
        onChange={handleOTP}
        ref={otpRef}
      />
    </div>
  );
});

export default OtpField;
