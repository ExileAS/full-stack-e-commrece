const LoginInputs = ({
  email,
  setEmail,
  password,
  setPassword,
  passwordErr,
  emailErr,
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
      </div>
    </>
  );
};

export default LoginInputs;
