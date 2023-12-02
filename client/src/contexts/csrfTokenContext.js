import { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";

export const csrfTokenContext = createContext(null);

const CsrfTokenProvider = ({ children }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/csrf-create-token");
        const data = await res.json();
        setToken(data.csrfToken);
      } catch (err) {
        console.log(err);
      }
    };
    fetchToken();
  }, []);
  console.log(token);

  return (
    <csrfTokenContext.Provider value={token}>
      {children}
    </csrfTokenContext.Provider>
  );
};

export const CsrfContextLayout = () => {
  return (
    <CsrfTokenProvider>
      <Outlet />
    </CsrfTokenProvider>
  );
};
