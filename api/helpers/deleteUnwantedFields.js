const deleteUnwantedFields = async (model, email) => {
  const updatedDoc = await model.findOneAndUpdate(
    {
      verified: true,
      email: email,
    },
    {
      $unset: {
        verifyURL: 1,
        OTP: 1,
        verifyAttempts: 1,
        resendAttempts: 1,
        encryptedEmail: 1,
        expireAt: 1,
      },
    }
  );
  console.log(updatedDoc);
};

module.exports = deleteUnwantedFields;
