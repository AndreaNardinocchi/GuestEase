export interface ReviewEmailTemplateProps {
  booking_id: string;
  check_in: string;
  check_out: string;
  rating: number;
  comment: string;
  // Additional required fields for the email
  room_name: string;
  user_name: string;
  logoUrl: string;
  adminDashboardUrl: string;
}

export function reviewEmailTemplate({
  booking_id,
  check_in,
  check_out,
  rating,
  comment,
  room_name,
  user_name,
  logoUrl,
  adminDashboardUrl,
}: ReviewEmailTemplateProps): string {
  const formattedId = `#${String(booking_id).slice(-12)}`;

  return `
<div style="background:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; border:1px solid #472d3020; overflow:hidden;">

    <!-- Logo -->
    <tr>
      <td style="padding:25px; text-align:center; background:#472d30;">
        <img src="${logoUrl}" alt="GuestEase Logo" width="150" />
      </td>
    </tr>

    <!-- Header -->
    <tr>
      <td style="padding:20px; text-align:center; background:#E26D5C;">
        <h2 style="margin:0; font-weight:600; font-size:22px; color:#fff;">
          New Review Submitted ⭐
        </h2>
        <p style="margin:8px 0 0; font-size:14px; color:#fff; opacity:0.9;">
          Booking ID: <strong>${formattedId}</strong>
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:26px; color:#472d30; font-size:15px; line-height:1.6;">
        <p>Hello Admin,</p>

        <p>A new review has just been submitted by <strong>${user_name}</strong>.</p>

        <div style="background:#fff3ef; border-left:4px solid #E26D5C; padding:16px; margin:20px 0; border-radius:6px;">
          <p><strong>Room:</strong> ${room_name}</p>
           <p><strong>Check-in:</strong> ${check_in}</p>
            <p><strong>Check-in:</strong> ${check_out}</p>
          <p><strong>Rating:</strong> ${rating} / 5</p>
          <p><strong>Comment:</strong></p>
          <p style="margin-top:6px; padding:12px; background:#ffffff; border-radius:6px; border:1px solid #eee;">
          <i>${comment}</i>
          </p>
        </div>

        <p>You can view and manage this review from the admin dashboard.</p>

        <div style="text-align:center; margin:28px 0;">
          <a href="${adminDashboardUrl}"
            style="background:#E26D5C; color:#fff; padding:12px 24px;
            text-decoration:none; border-radius:6px; font-size:16px; font-weight:600;">
            Open Admin Dashboard
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="text-align:center; padding:18px; font-size:12px; color:#472d30;">
        © ${new Date().getFullYear()} GuestEase. Admin Notification.
      </td>
    </tr>

  </table>
</div>
  `;
}
