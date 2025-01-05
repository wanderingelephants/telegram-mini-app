const  Historical = require('./historical')

const historical = new Historical()
const csvs = ['Nifty_50_2019_2024','Nifty_GoldBees_2019_2024','Nifty_India_Manufacturing_2022_2024','Nifty_Shariah_2019_2024','Nifty_Auto_2019_2024','Nifty_IT_2019_2024','Nifty_Midcap_100_2019_2024','Nifty_SilverBees_2022_2024','Nifty_Bank_2019_2024','Nifty_India_Digital_2022_2024','Nifty_Pharma_2019_2024','Nifty_Smallcap_250_2019_2024'
]
for (const csv of csvs){
    historical.parseCSV(csv)
}
