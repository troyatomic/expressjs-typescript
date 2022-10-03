import dotenv from "dotenv";
import express from "express";
import path from "path";
import routes from "./routes";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();

app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Configure routes
app.use('/', routes);

// start the express server
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server started at http://localhost:${port}`);
});
