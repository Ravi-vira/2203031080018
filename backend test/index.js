const express = require("express");
const sampleRoute = require("./route/routessimpe");

const app = express();
app.use(express.json());

app.use("/test", sampleRoute);
app.use("/", shortUrlRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

