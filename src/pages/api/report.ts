import { NextApiHandler } from "next";
import { client } from "../../db";
import { reportSchema } from "../../shared/reportSchema";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const userId = req.query.userId;

      const parsed = reportSchema.parse(req.body);
      const connection = await client.connect();

      try {
        const report = {
          userId,
          temperature: parsed.temperature + "°C",
          symptoms: parsed.symptoms,
          location: parsed.location,
          created_at: new Date().getTime(),
        };

        await connection.db().collection("report").insertOne(report);

        return res.send(report);
      } catch (e) {
        throw e;
      } finally {
        connection.close();
      }
    } catch (e) {
      console.error(e);
      res.status(400).send("An error occured");
    }
  }

  if (req.method === "GET") {
    const userId = req.query.userId;
    const connection = await client.connect();
    try {
      const reports = await connection
        .db()
        .collection("report")
        .find({ userId }, { sort: { created_at: -1 } })
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
