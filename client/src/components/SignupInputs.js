const SignupInputs = ({
  email,
  setEmail,
  emailErr,
  password,
  setPassword,
  passwordErr,
  passwordConfirm,
  setPasswordConfirm,
}) => {
  return (
    <>
      {" "}
      <div className="input-container">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <p className="error">{emailErr}</p>
      </div>
      <div className="input-container">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <p className="error">{passwordErr}</p>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
    </>
  );
};

export default SignupInputs;
