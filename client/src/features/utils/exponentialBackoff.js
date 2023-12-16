const exponentialBackoff = async (cbPromise) => {
  let retries = 0;
  const maxRetries = 3;

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
      console.error(`Error processing attempt ${retries}: ${err.message}`);
      const delay = Math.pow(2, retries - 1) * 3000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  if (retries === maxRetries) {
    console.error("Max retries reached. Unable to process request.");
  }
};

export default exponentialBackoff;
