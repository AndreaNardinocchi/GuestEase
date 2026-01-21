/**
 * This file initializes a Supabase client specifically for server-side
 * operations. It uses the Supabase 'Secret Key' or 'Service Role Key', which must never be
 * exposed to the browser.
 * This client is intended for backend tasks such as handling bookings, deleting users, and
 * admin-level tasks.
 * https://supabase.com/docs/reference/javascript/introduction
 * https://supabase.com/docs/guides/api/api-keys
 * https://github.com/motdotla/dotenv#readme
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

/**
 * Load environment variables from the '.env' file into process.env.
 * This allows us to securely access secrets such as:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_SERVICE_ROLE_KEY
 * https://github.com/motdotla/dotenv#usage
 */
dotenv.config();

/**
 * Retrieve Supabase credentials from environment variables.
 * The Service Role Key should only be used on the server and never
 * exposed to the frontend.
 * https://supabase.com/dashboard/project/xxxxxxxxxxxxxxx/settings/api-keys
 */
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

/**
 * If the environment variables are missing, throw an error immediately.
 */
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key missing in .env");
}

// Create a Supabase client instance using the Service Role Key.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
