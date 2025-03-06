const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccount.json");

const initializeFirebase = () => {
    console.log("Initializing Firebase...");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

module.exports = { initializeFirebase };
