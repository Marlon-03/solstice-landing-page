export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, email, phone, looking_for, priority, household, timeline, result_key } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/quiz_submissions`,
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
          phone: phone || null,
          looking_for: looking_for || null,
          priority: priority || null,
          household: household || null,
          timeline: timeline || null,
          result_key: result_key || null
        })
      }
    );

    if (!response.ok) {
      const errBody = await response.json();
      throw new Error(errBody?.message || 'Submission failed');
    }

    res.status(200).json({ success: true, message: 'Quiz lead submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}