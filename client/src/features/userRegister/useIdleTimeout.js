import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

function useIdleTimeout(onTimeout, timeout = 1000 * 60 * 20) {
  const timer = useRef({});
  const currUser = useSelector((state) => state.user.userEmail);
  useEffect(() => {
    if (!currUser) return;
    const resetTimer = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onTimeout();
      }, timeout);
    };

    const throttleReset = _.throttle(resetTimer, 1000);

    throttleReset();

    document.addEventListener("mouseover", throttleReset);
    document.addEventListener("keydown", throttleReset);
    document.addEventListener("scroll", throttleReset);

    return () => {
      document.removeEventListener("mouseover", throttleReset);
      document.removeEventListener("keydown", throttleReset);
      document.removeEventListener("scroll", throttleReset);
    };
  }, [timeout, onTimeout, currUser]);
}

export default useIdleTimeout;
