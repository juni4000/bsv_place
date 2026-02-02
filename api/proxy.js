module.exports = async (req, res) => {
    const { url } = req.query; // Get the target URL from the query string

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    try {
        // Forward the request to the target URL (Whatsonchain)
        // We propagate the method (GET/POST) and the body if present
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (req.method === 'POST' && req.body) {
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(url, options);

        // Forward the status code and data back to the frontend
        const data = await response.text();

        // Vercel serverless functions handle CORS automatically if configured, 
        // but we explicitly allow origin * for public access
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Content-Type', 'application/json');

        res.status(response.status).send(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch external resource', details: error.message });
    }
};
