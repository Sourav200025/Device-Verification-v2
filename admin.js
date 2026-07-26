<meta name='viewport' content='width=device-width, initial-scale=1'/>const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
    const pass = event.queryStringParameters.pass;

    if (pass !== '0909') {
        return {
            statusCode: 403,
            headers: { 'Content-Type': 'text/html' },
            body: '<h1 style="font-family:sans-serif; text-align:center; margin-top:50px;">403 Access Denied: Invalid Password</h1>'
        };
    }

    try {
        const store = getStore({ name: 'device_tracking', consistency: 'strong' });
        const records = await store.get('records', { type: 'json' }) || [];

        // Render HTML Table
        const rows = records.map(r => `
            <tr>
                <td>${r.user_id}</td>
                <td>${r.bot_api}</td>
                <td><b>${r.ip_address}</b></td>
                <td>${r.platform} (${r.screen_res})</td>
                <td><small>${r.user_agent}</small></td>
                <td>${new Date(r.timestamp).toLocaleString()}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Netlify Tracking Database</title>
                <style>
                    body { font-family: -apple-system, sans-serif; padding: 30px; background: #f8f9fa; }
                    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; }
                    th, td { padding: 12px 16px; border-bottom: 1px solid #edf2f7; text-align: left; }
                    th { background-color: #0f172a; color: white; font-weight: 600; }
                    tr:hover { background-color: #f1f5f9; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>🔒 Netlify Admin Tracking Database</h2>
                    <span>Total Logs: <b>${records.length}</b></span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Bot API</th>
                            <th>IP Address</th>
                            <th>Device Details</th>
                            <th>User Agent</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="6" style="text-align:center; padding:30px;">No records found yet.</td></tr>'}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' },
            body: html
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'text/html' },
            body: '<h1>Database fetch error</h1>'
        };
    }
};
