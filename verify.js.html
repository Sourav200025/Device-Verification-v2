<meta name='viewport' content='width=device-width, initial-scale=1'/>const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { user_id, bot_api, user_agent, screen_res, language, platform } = body;

        // Extract real IP provided by Netlify edge routers
        const clientIp = event.headers['x-nf-client-connection-ip'] || 
                         event.headers['x-forwarded-for'] || 
                         '127.0.0.1';

        if (!user_id || !bot_api) {
            return {
                statusCode: 400,
                body: JSON.stringify({ status: "error", message: "Missing required parameters" })
            };
        }

        // Initialize Netlify Blob store
        const store = getStore({ name: 'device_tracking', consistency: 'strong' });
        
        // Fetch existing records list
        const existingData = await store.get('records', { type: 'json' }) || [];

        // Check if user or IP exists
        const userExists = existingData.find(r => r.user_id === user_id);
        const ipExists = existingData.find(r => r.ip_address === clientIp);

        if (userExists) {
            return {
                statusCode: 200,
                body: JSON.stringify({ status: "info", message: "Already Verified" })
            };
        }

        if (ipExists) {
            return {
                statusCode: 200,
                body: JSON.stringify({ status: "error", message: "Same Device Detected" })
            };
        }

        // Save new log record
        const newRecord = {
            id: Date.now(),
            user_id,
            bot_api,
            ip_address: clientIp,
            user_agent,
            screen_res,
            language,
            platform,
            timestamp: new Date().toISOString()
        };

        existingData.push(newRecord);
        await store.setJSON('records', existingData);

        return {
            statusCode: 200,
            body: JSON.stringify({ status: "success" })
        };

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: "error", message: "Internal server error" })
        };
    }
};
