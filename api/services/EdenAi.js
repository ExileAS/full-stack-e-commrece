const axios = require("axios").default;
const fs = require("fs");
const FormData = require("form-data");

module.exports.detectExplicit = async (imgPath) => {
  const form = new FormData();
  form.append("show_original_response", "false");
  form.append("fallback_providers", "");
  form.append("providers", "api4ai");
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
      res.data.api4ai.status === "success" &&
      res.data.api4ai.nsfw_likelihood_score < 0.22;
    return safe;
  } catch (err) {
    console.log(err);
  }
};
