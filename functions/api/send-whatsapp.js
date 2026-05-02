export async function onRequestPost({ request, env }) {
	try {
		const body = await request.json();
		const { name, company, phone, email, equip, type, msg } = body;

		// Access secrets securely set in the Cloudflare Pages dashboard
		const waPhoneId = env.WA_PHONE_ID;
		const waToken = env.WA_ACCESS_TOKEN;
		const waRecipient = env.WA_RECIPIENT_NUMBER;

		if (!waPhoneId || !waToken || !waRecipient) {
			return new Response(JSON.stringify({ error: 'Server misconfiguration: Missing environment variables' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const waMessageBody = `*New Website Enquiry!*\n\n*Name:* ${name}\n*Company:* ${company || "—"}\n*Phone:* ${phone}\n*Email:* ${email}\n*Equipment:* ${equip}\n*Requirement:* ${type}\n*Details:* ${msg || "—"}`;

		const waPayload = {
			messaging_product: "whatsapp",
			recipient_type: "individual",
			to: waRecipient,
			type: "text",
			text: {
				preview_url: false,
				body: waMessageBody
			}
		};

		const waResponse = await fetch(`https://graph.facebook.com/v20.0/${waPhoneId}/messages`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${waToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(waPayload)
		});

		const data = await waResponse.json();

		if (data.error) {
			return new Response(JSON.stringify({ error: 'Failed to send WhatsApp message', details: data.error }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ success: true, message: "WhatsApp notification sent successfully" }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (err) {
		return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
