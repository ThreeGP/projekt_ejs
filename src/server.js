const dotenv = require("dotenv");
const app = require("./app");
const { connectDB } = require("./data/db");

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("db problem", err);
    process.exit(1);
  }
}

start();
