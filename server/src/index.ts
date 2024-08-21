import express, { Express } from "express";
import bodyParser from 'body-parser';
import { listGuests, loadGuest, saveGuest, updateGuest } from "./routes";


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/save", saveGuest);
app.post("/api/update", updateGuest);
app.get("/api/load", loadGuest);
app.get("/api/list", listGuests);
app.listen(port, () => console.log(`Server listening on ${port}`));
