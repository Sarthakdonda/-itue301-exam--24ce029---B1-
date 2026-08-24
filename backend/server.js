const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required. Copy .env.example to .env and add the connection string.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required. Add a private value to backend/.env.");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Leave Management API listening on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = startServer;
