import React, { useRef, useEffect } from "react";

const Timer = ({ start, timer, setTimer }) => {
  const Ref = useRef(null);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(seconds > 9 ? seconds : "0" + seconds);
    }
  };

  const clearTimer = (e) => {
    setTimer("15");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 15);
    return deadline;
  };
  useEffect(() => {
    if (start) {
      clearTimer(getDeadTime());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <div>
      <h2 className="timer">Resend in: {timer}</h2>
    </div>
  );
};

export default Timer;
