const fs = require('fs');
const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');


async function fetchWithRetry(url, options, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fetch(url, options);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`Attempt ${i + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

async function fetchPDF(pdfUrl, targetPath, proxyUrl) {
    console.log("fetchPDF", pdfUrl, targetPath, proxyUrl)
    if (fs.existsSync(targetPath)){
        console.log("Target PDF exists. Skip", targetPath)
    }
    try {
        const agent = proxyUrl 
            ? new HttpsProxyAgent(proxyUrl)
            : new https.Agent({
                keepAlive: true,
                timeout: 60000,
                rejectUnauthorized: false
            });
        const response = await fetchWithRetry(
            pdfUrl,
            {
                method: 'GET',
                agent,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/pdf',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                },
                timeout: 30000
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fileStream = fs.createWriteStream(targetPath);
        const reader = response.body.getReader();

        return new Promise((resolve, reject) => {
            async function processStream() {
                try {
                    while (true) {
                        const {done, value} = await reader.read();
                        
                        if (done) {
                            fileStream.end();
                            break;
                        }
                        fileStream.write(Buffer.from(value));
                    }
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }

            fileStream.on('error', reject);
            processStream();
        });

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    }
}

module.exports = fetchPDF;