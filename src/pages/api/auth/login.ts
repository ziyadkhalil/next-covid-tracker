import axios, { AxiosError } from "axios";
import { NextApiHandler } from "next";
import { z } from "zod";
import { config } from "../../../config";
import { loginSchema } from "../../../shared/loginSchema";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    // Validate and return errors if any
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).send(parsed.error.format());

    // Handle password login
    if (parsed.data.type === "password") {
      try {
        const auth0Res = await axios.post(`${config.auth0Issuer}/oauth/token`, {
          grant_type: "password",
          client_secret: config.auth0Secret,
          client_id: config.auth0Id,
          audience: "/api/v2",
          username: parsed.data.email,
          password: parsed.data.password,
          scope: "openid read:reports",
        });
        return res.send(auth0Res.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          console.error(e.request.body);
          return res.status(e.response.status).send(e.response?.data);
        }
        return res.status(400).send("An error occured");
      }
    } else {
      try {
        const auth0Res = await axios.post(`${config.auth0Issuer}/oauth/token`, {
          grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
          client_secret: config.auth0Secret,
          client_id: config.auth0Id,
          username: parsed.data.email,
          otp: parsed.data.code,
          audience: "/api/v2",
          realm: "email",
          scope: "openid read:reports",
        });
        res.send(auth0Res.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response)
          return res.status(e.response.status).send(e.response.data);
        console.error(e);
        return res.status(400).send("An error occured");
      }
    }
  }
};

export default handler;
