import { OAuth2Client } from "google-auth-library";

import dotenv from "dotenv";
dotenv.config();
export const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);