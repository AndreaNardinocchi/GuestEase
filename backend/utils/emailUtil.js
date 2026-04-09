import express from "express";

const router = express.Router();

router.post("/send_email", async (req, res) => {
  // console.log("Hit /send_email route");
  const { email, subject, body, from } = req.body;

  if (!email || !subject || !body) {
    return res.status(400).json({
      status: "error",
      error: "Missing email, subject or body",
    });
  }

  /**
   * We are using 'Resend' as an email host. hence, we are sending an HTTP POST
   * request to Resend.
   * https://resend.com/docs/api-reference/emails/send-email
   */
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        /**
         * We authenticate using a Bearer token (our RESEND_API_KEY), as required by:
         * https://resend.com/docs/api-reference/introduction#authentication
         */
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },

      /**
       * Resend email payload format:
       * https://resend.com/docs/api-reference/emails/send-email#body
       */
      body: JSON.stringify({
        // to: [email, "setuproject.guesteasebb@gmail.com"],
        to: email,
        from: from || "onboarding@resend.dev",
        subject,
        html: body,
      }),
    });

    /**
     * Calling response.json() on a non‑JSON body would throw a SyntaxError,
     * so we read the raw text first and *attempt* to parse it as JSON.
     * If parsing fails, we safely fall back to the plain text response.
     */
    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    /**
     * response.ok is true for 2 status codes
     * https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
     */
    if (response.ok) {
      console.log("Resend success:", data);
      return res.json({ status: "Email sent", data });
    } else {
      console.error("Resend ERROR:", { status: response.status, data });
      return res.status(response.status).json({ status: "error", data });
    }
  } catch (err) {
    /**
     * Express error handling best practices:
     * https://expressjs.com/en/guide/error-handling.html
     */
    return res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
});

export default router;
