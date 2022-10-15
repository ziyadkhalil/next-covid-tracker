import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  return res.status(401).send("Unauthorized");
};

export default handler;
