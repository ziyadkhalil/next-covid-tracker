import axios from "axios";
import { NextApiHandler } from "next";
import { z } from "zod";
import { config } from "../../../config";
import { registerSchema } from "../../../shared/registerSchema";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).send(parsed.error.format());
    try {
      await axios.post(`${config.auth0Issuer}/dbconnections/signup`, {
        connection: "Username-Password-Authentication",
        client_id: config.auth0Id,
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      });
      const auth0Res = await axios.post(`${config.auth0Issuer}/oauth/token`, {
        grant_type: "password",
        client_secret: config.auth0Secret,
        client_id: config.auth0Id,
        username: parsed.data.email,
        password: parsed.data.password,
        scope: "openid",
      });
      return res.send(auth0Res.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        return res.status(e.response.status).send({
          message: e.response?.data,
        });
      }
      return res.status(400).send("An error occured");
    }
  }
};

export default handler;
