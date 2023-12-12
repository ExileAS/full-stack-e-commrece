const makeRequestWithRetry = async (
  apiRequestFn,
  apiParams,
  validateFn,
  maxRetries = 3
) => {
  let retryCount = 0;
  const maxDelay = 2000;

  while (retryCount < maxRetries) {
    try {
      const res = await apiRequestFn(apiParams);
      console.log(res.data);
      return validateFn(res.data);
    } catch (err) {
      console.error(`Error on attempt ${retryCount + 1}:`, err);
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(delay, maxDelay))
      );
      retryCount++;
    }
  }

  console.error(`Request failed after ${maxRetries} attempts.`);
  return false;
};

module.exports = makeRequestWithRetry;
