const ResendButton = ({ handleResend }) => {
  return (
    <div>
      <button
        style={{
          textAlign: "center",
          marginLeft: "24px",
        }}
        className="button-7"
        onClick={handleResend}
      >
        Resend
      </button>
    </div>
  );
};

export default ResendButton;
