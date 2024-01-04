const exponentialBackoff = async (cbPromise, reqName) => {
  let retries = 0;
  const maxRetries = 4;
  const maxDelay = 3000;
  while (retries < maxRetries) {
    try {
      const requestResult = await cbPromise();
      if (!requestResult) {
        throw new Error("request failed");
      } else {
        console.log("success");
        return requestResult;
      }
    } catch (err) {
      retries++;
      console.error(
        `Error processing ${reqName}, attempt ${retries}: ${err.message}`
      );
      const delay = Math.pow(2, retries - 1) * 1500 + Math.random() * 1000;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(delay, maxDelay))
      );
    }
  }

  if (retries === maxRetries) {
    console.error("Max retries reached. Unable to process request.");
  }
};

export default exponentialBackoff;
