import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPEmailRequest {
  guests: Array<{
    name: string;
    dietaryRestrictions?: string;
  }>;
  message?: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guests, message, recipientEmail }: RSVPEmailRequest = await req.json();

    console.log("Sending RSVP email for guests:", guests.map(g => g.name).join(", "));

    // Build the guest list HTML
    const guestListHTML = guests.map(guest => `
      <li style="margin-bottom: 12px;">
        <strong>${guest.name}</strong>
        ${guest.dietaryRestrictions ? `<br><em style="color: #666;">Dietary Restrictions: ${guest.dietaryRestrictions}</em>` : ''}
      </li>
    `).join('');

    const emailResponse = await resend.emails.send({
      from: "Wedding RSVP <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "New Wedding RSVP Received! 💍",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B7355; border-bottom: 2px solid #8B7355; padding-bottom: 10px;">
            New RSVP Received
          </h1>
          
          <h2 style="color: #333; margin-top: 30px;">Attending Guests:</h2>
          <ul style="list-style: none; padding: 0;">
            ${guestListHTML}
          </ul>

          ${message ? `
            <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8B7355;">
              <h3 style="color: #333; margin-top: 0;">Message from Guests:</h3>
              <p style="color: #666; white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}

          <p style="margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            This is an automated notification from your wedding RSVP system.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-rsvp-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
