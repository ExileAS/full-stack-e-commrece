const exponentialBackoff = async (cbPromise) => {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      const requestResult = await cbPromise();
      if (requestResult.success) {
        console.log("request processed successfully!");
        break;
      } else {
        throw new Error("request failed");
      }
    } catch (error) {
      retries++;
      console.error(`Error processing attempt ${retries}: ${error.message}`);
      const delay = Math.pow(2, retries - 1) * 3000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  if (retries === maxRetries) {
    console.error("Max retries reached. Unable to process request.");
  }
};

export default exponentialBackoff;
