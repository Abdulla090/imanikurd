// IslamHouse API Proxy Function for Vercel
// This function bypasses Cloudflare protection by making server-side requests

const API_BASE = 'https://api3.islamhouse.com/v3';
const API_KEY = 'paV29H2gm56kvLP';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Get the endpoint from query parameters
        const { endpoint } = req.query;

        if (!endpoint) {
            return res.status(400).json({ error: 'Missing endpoint parameter' });
        }

        // Construct the full API URL
        const apiUrl = `${API_BASE}/${API_KEY}/${endpoint}`;

        console.log('Fetching:', apiUrl);

        // Make the request to IslamHouse API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8,ku;q=0.7',
                'Referer': 'https://islamhouse.com/',
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: 'API request failed',
                status: response.status,
                statusText: response.statusText
            });
        }

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
