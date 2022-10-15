import axios, { AxiosError } from "axios";
import { NextApiHandler } from "next";
import { z } from "zod";
import { config } from "../../../config";

const passwordlessSchema = z.object({
  type: z.literal("link").or(z.literal("code")),
  email: z.string().email(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    // Validate and return errors if any
    const parsedPasswordlessBody = passwordlessSchema.safeParse(req.body);
    if (!parsedPasswordlessBody.success)
      return res.send(parsedPasswordlessBody.error.format());

    try {
      const auth0Res = await axios.post(
        `${config.auth0Issuer}/passwordless/start`,
        {
          client_secret: config.auth0Secret,
          client_id: config.auth0Id,
          connection: "email",
          email: parsedPasswordlessBody.data.email,
          send: parsedPasswordlessBody.data.type,
          authParams: {
            scope: "openid read:reports profile email name",
            audience: "/api/v2",
          },
        }
      );
      return res.send(auth0Res.data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        return res.status(e.response.status).send(e.response.data);
      }
      console.error(e);
      return res.status(400).send("An error occured");
    }
  }
};

export default handler;
