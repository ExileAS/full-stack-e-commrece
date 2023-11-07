const axios = require("axios").default;
const fs = require("fs");
const FormData = require("form-data");
const logger = require("../logs/winstonLogger");

module.exports.detectExplicit = async (imgPath) => {
  const form = new FormData();
  form.append("show_original_response", "false");
  form.append("fallback_providers", "");
  form.append("providers", "google");
  form.append("file", fs.createReadStream(`${imgPath}`));

  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/explicit_content",
    headers: {
      Authorization: `Bearer ${process.env.EDENAI_KEY}`,
      "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
    },
    data: form,
  };

  try {
    const res = await axios.request(options);
    console.log(res.data);
    const safe =
      (res.data.google.status === "success" ||
        res.data["eden-ai"].status === "success") &&
      (res.data.google.nsfw_likelihood_score < 0.5 ||
        res.data["eden-ai"].nsfw_likelihood < 2);
    if (!safe) logger.info(`${req.body.seller}: ${imgPath}`);
    return safe;
  } catch (err) {
    console.log(err);
  }
};
