module.exports = async (req, res) => {
    const { url } = req.query;

    console.log(`Proxying ${req.method} to: ${url}`);

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    try {
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (req.method === 'POST') {
            const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            console.log(`POST Body length: ${bodyStr.length}`);
            options.body = bodyStr;
        }

        const response = await fetch(url, options);
        console.log(`Target response status: ${response.status}`);

        const data = await response.text();
        console.log(`Target response data length: ${data.length}`);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Content-Type', 'application/json');

        res.status(response.status).send(data);
    } catch (error) {
        console.error('Proxy Backend Error:', error);
        res.status(500).json({ error: 'Proxy implementation error', details: error.message });
    }
};
