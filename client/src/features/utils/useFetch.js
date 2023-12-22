import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setTempEmail } from "../userRegister/userSlice";

const useFetch = () => {
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resErr, setResErr] = useState({});
  const [successInfo, setSuccessInfo] = useState("");
  const dispatch = useDispatch();

  const fetchGetPost = useCallback(
    async (url, { body, token }) => {
      setLoading(true);
      setResErr({});
      try {
        const res = body
          ? await fetch(url, {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
                "csrf-token": token,
              },
            })
          : await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "csrf-token": token,
              },
            });
        const data = await res.json();
        if (data.err) {
          setResErr(data.err);
        }
        if (data.errors) {
          setResErr(data.errors);
        }
        if (data.info) {
          setSuccessInfo(data.info);
        }
        if (data.unverifiedEmail) {
          setResErr("please verify your account");
          dispatch(setTempEmail(data.unverifiedEmail));
        }
        setResData(data);
        return data;
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );
  return { fetchGetPost, resData, loading, resErr, setResErr, successInfo };
};

export default useFetch;
