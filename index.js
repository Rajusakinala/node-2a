const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.send("welcome");
});
app.get("/test", (req, res) => {
  res.send("welcome test");
});
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
