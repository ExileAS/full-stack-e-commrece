const deleteUnwantedFields = async (model, email) => {
  await model.findOneAndUpdate(
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
};

module.exports = deleteUnwantedFields;
