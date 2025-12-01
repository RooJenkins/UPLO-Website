import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

    // Fetch demo from Supabase
    const { data: demo, error } = await supabase
      .from('demos')
      .select('html_content, lead_id')
      .eq('id', id)
      .single();

    // If not found by demo ID, try by lead ID
    if (error || !demo) {
      const { data: demoByLead, error: leadError } = await supabase
        .from('demos')
        .select('html_content')
        .eq('lead_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (leadError || !demoByLead) {
        // Return a nice 404 page
        return res.status(404).send(`
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
        `);
      }

      // Serve the HTML
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      return res.status(200).send(demoByLead.html_content);
    }

    // Serve the HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    return res.status(200).send(demo.html_content);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
