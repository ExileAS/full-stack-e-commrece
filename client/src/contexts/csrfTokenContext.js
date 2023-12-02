import { useState, useEffect, createContext, useContext } from "react";

const csrfTokenContext = createContext(null);

export const CsrfTokenProvider = ({ children }) => {
  const [token, setToken] = useState("");

  //   useEffect(() => {
  //     const fetchToken = async () => {
  //       try {
  //         const res = await fetch("/api/csrf-create-token");
  //         const data = await res.json();
  //         setToken(data.csrfToken);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     fetchToken();
  //   }, []);

  return (
    <csrfTokenContext.Provider value={token}>
      {children}
    </csrfTokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(csrfTokenContext);
  if (!context) {
    throw new Error("token context is only used inside it's provider");
  }
  return context;
};
