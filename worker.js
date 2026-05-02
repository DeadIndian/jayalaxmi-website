export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// Handle Telegram API endpoint
		if (url.pathname === "/api/send-telegram" && request.method === "POST") {
			try {
				const body = await request.json();
				const { name, company, phone, email, equipment, requirement, details } =
					body;

				// Access secrets securely set via Wrangler or Dashboard
				const botToken = env.TELEGRAM_BOT_TOKEN;
				const chatId = parseInt(env.TELEGRAM_CHAT_ID, 10);

				if (!botToken || !chatId) {
					return new Response(
						JSON.stringify({
							error: "Server misconfiguration: Missing environment variables",
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}

				const message = `<b>🔔 New Website Enquiry</b>\n\n<b>Name:</b> ${name}\n<b>Company:</b> ${company}\n<b>Phone:</b> ${phone}\n<b>Email:</b> ${email}\n<b>Equipment:</b> ${equipment}\n<b>Requirement:</b> ${requirement}\n<b>Details:</b> ${details}`;

				const telegramPayload = {
					chat_id: chatId,
					text: message,
					parse_mode: "HTML",
				};

				const telegramResponse = await fetch(
					`https://api.telegram.org/bot${botToken}/sendMessage`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(telegramPayload),
					},
				);

				const data = await telegramResponse.json();

				if (!data.ok) {
					console.error("Telegram API Error:", data);
					return new Response(
						JSON.stringify({
							error: "Failed to send Telegram message",
							details: data,
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}

				return new Response(
					JSON.stringify({
						success: true,
						message: "Enquiry received and sent to Telegram",
					}),
					{
						status: 200,
						headers: { "Content-Type": "application/json" },
					},
				);
			} catch (err) {
				return new Response(
					JSON.stringify({
						error: "Internal server error",
						details: err.message,
					}),
					{
						status: 500,
						headers: { "Content-Type": "application/json" },
					},
				);
			}
		}

		// Fallback: If it's not our API, serve the static assets (HTML, CSS, JS, Images)
		return env.ASSETS.fetch(request);
	},
};
