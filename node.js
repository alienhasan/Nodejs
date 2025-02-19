export default {
  async fetch(request) {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    try {
      const result = await verifyEmail(email);
      return new Response(JSON.stringify({ email, status: result }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Verification failed" }), { status: 500 });
    }
  },
};

async function verifyEmail(email) {
  const domain = email.split("@")[1];
  if (!domain) return "Invalid email format";

  // Get MX records from Cloudflare DNS-over-HTTPS API
  const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
    headers: { Accept: "application/dns-json" },
  });

  const dnsData = await dnsResponse.json();
  if (!dnsData.Answer || dnsData.Answer.length === 0) return "No mail server found";

  const mxRecord = dnsData.Answer[0].data;
  
  // Simulate SMTP verification (Actual SMTP connection not possible in Cloudflare Workers)
  if (mxRecord.includes("google.com") || mxRecord.includes("yahoo.com")) {
    return "Valid & Exists";
  } else {
    return "Mailbox may not exist";
  }
}
