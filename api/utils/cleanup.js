const mongoose = require("mongoose");
const cleanupExpiredUsers = async () => {
  try {
    const db = mongoose.connection;

    if (db.readyState !== 1) {
      console.error("MongoDB connection is not ready");
      return;
    }

    const collection = db.collection("users");

    const query = {
      expireAt: { $exists: true, $lt: new Date() },
      verified: false,
      verifiedAt: { $exists: false },
    };

    const result = await collection.deleteMany(query);

    console.log(`${result.deletedCount} documents deleted during cleanup`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

const cleanAccountResets = async () => {
  try {
    const db = mongoose.connection;

    if (db.readyState !== 1) {
      console.error("MongoDB connection is not ready");
      return;
    }

    const collection = db.collection("reseting-users");

    const query = {
      deletionAt: { $exists: true, $lt: new Date() },
    };

    const result = await collection.deleteMany(query);

    console.log(`${result.deletedCount} documents deleted during cleanup`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

const cleanExit = async () => {
  console.log("Shutting down node server");

  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

module.exports = {
  cleanupExpiredUsers,
  cleanExit,
  cleanAccountResets,
};
