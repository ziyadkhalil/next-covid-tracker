import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "./config";

export const client = new MongoClient(config.dbURL, {
  serverApi: ServerApiVersion.v1,
});
