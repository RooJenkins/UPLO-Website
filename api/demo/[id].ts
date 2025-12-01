import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// 404 page HTML
const notFoundPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Demo Not Found | UPLO</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 40px;
    }
    h1 { font-size: 4rem; margin: 0; }
    p { font-size: 1.25rem; opacity: 0.9; }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: white;
      color: #764ba2;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
    a:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>This demo doesn't exist or has expired.</p>
    <a href="https://uplo.ai">Visit UPLO.ai</a>
  </div>
</body>
</html>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Demo ID is required' });
    }

    let htmlContent: string | null = null;

    // 1. First try to find by slug (website name like "corcoransolicitors")
    const { data: demoBySlug } = await supabase
      .from('demos')
      .select('html_content')
      .eq('slug', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (demoBySlug?.html_content) {
      htmlContent = demoBySlug.html_content;
    }

    // 2. If not found by slug, try by demo ID (UUID)
    if (!htmlContent) {
      const { data: demoById } = await supabase
        .from('demos')
        .select('html_content')
        .eq('id', id)
        .single();

      if (demoById?.html_content) {
        htmlContent = demoById.html_content;
      }
    }

    // 3. If still not found, try by lead ID (UUID)
    if (!htmlContent) {
      const { data: demoByLead } = await supabase
        .from('demos')
        .select('html_content')
        .eq('lead_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (demoByLead?.html_content) {
        htmlContent = demoByLead.html_content;
      }
    }

    // If no demo found, return 404
    if (!htmlContent) {
      return res.status(404).send(notFoundPage);
    }

    // Serve the HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    return res.status(200).send(htmlContent);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
