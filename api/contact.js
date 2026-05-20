export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, email, inquiry_type, message } = req.body;

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/contact_submissions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          full_name,
          email,
          inquiry_type,
          message
        })
      }
    );

    if (!response.ok) {
      const errBody = await response.json();
      throw new Error(errBody?.message || 'Submission failed');
    }

    res.status(200).json({ success: true, message: 'Contact form submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}