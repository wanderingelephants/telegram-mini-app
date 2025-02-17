const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const scraper_api_key = process.env.SCRAPER_API_KEY
fetch(`https://api.scraperapi.com/?api_key=${scraper_api_key}&url=https%3A%2F%2Fwww.nseindia.com%2F%2Fapi%2Fcorporate-announcements%3Findex%3Dequities%26from_date%3D16-02-2025%26to_date%3D16-02-2025%26csv%3Dtrue&country_code=in&device_type=desktop&max_cost=1&session_number=0`)
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  });


  