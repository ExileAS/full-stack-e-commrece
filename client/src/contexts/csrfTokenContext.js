import { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import { CREATE_CSRF_URL } from "../features/utils/urlConstants";

export const csrfTokenContext = createContext(null);

const CsrfTokenProvider = ({ children }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(CREATE_CSRF_URL);
        const data = await res.json();
        setToken(data.csrfToken);
      } catch (err) {
        console.log(err);
      }
    };
    fetchToken();
  }, []);

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
