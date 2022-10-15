import axios from "axios";
import { NextApiHandler } from "next";
import { config } from "../../../config";

export const fetchUserData = async (token: string | undefined) => {
  const auth0Res = await axios.get(`${config.auth0Issuer}/userinfo`, {
    headers: token ? { Authorization: token } : {},
  });
  return auth0Res.data as { id: string; name: string; sub: string };
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const userData = await fetchUserData(req.headers.authorization);
      return res.send({
        ...userData,
        isAdmin: req.query.isAdmin && !!JSON.parse(req.query.isAdmin as string),
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        return res.status(e.response.status).send(e.response.data);
      }

      return res.status(400).send("An error occured");
    }
  }

  if (req.method === "PATCH") {
    const userId = req.query.userId;
    try {
      await axios.patch(
        `${config.auth0Issuer}/api/v2/users/${userId}`,
        req.body,
        {
          headers: { authorization: `Bearer ${config.auth0MgmtToken}` },
        }
      );
      res.send("Name updated successfully");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response)
        return res.status(e.response.status).send(e.response.data);

      res.status(400).send("An error occured");
    }
  }
};

export default handler;
