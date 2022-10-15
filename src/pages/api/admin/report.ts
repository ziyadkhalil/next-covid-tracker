import { NextApiHandler } from "next";
import { client } from "../../../db";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const connection = await client.connect();
    try {
      const reports = await connection
        .db()
        .collection("report")
        .find({}, { sort: { created_at: -1 } })
        .toArray();
      return res.send(reports);
    } catch (e) {
      res.status(400).send("An error occured");
    } finally {
      connection.close();
    }
  }
};

export default handler;
