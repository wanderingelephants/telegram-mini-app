const SMART_PROXY_URL = process.env.SMART_PROXY_URL

const getPuppeteerConfig = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLinux = process.platform === 'linux';
    const baseArgs = ['--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-javascript',
        '--window-size=1920,1080',
        '--disable-dev-shm-usage', 
        '--disable-gpu', '--disable-setuid-sandbox']
    const puppetArgs = SMART_PROXY_URL ? [`--proxy-server=${SMART_PROXY_URL}`, ...baseArgs] : baseArgs   
    console.log("puppetArgs", puppetArgs) 
    // Configuration object
    const config = {
      puppeteer: isDevelopment && !isLinux ? 
        require('puppeteer') : 
        require('puppeteer-extra'),
        
      launchOptions: {
        // Base options for all environments
        headless: true, //!isDevelopment,
        args: puppetArgs,
        
        // Development-specific options for Mac
        ...(isDevelopment && !isLinux && {
          channel: 'chrome',
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        }),
        
      }
    };
  
    // Add stealth plugin for Linux
    if (isLinux) {
      const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
      config.puppeteer.use(StealthPlugin);
    }
  
    return config;
  };
  
  module.exports = getPuppeteerConfig;