const NSEScraper = require('./NSEScraper');
const InsiderScraper = require('./InsiderScraper');
const FiftyTwoWeekHighLowScraper = require("./FiftyTwoWeekHighLowScraper");
const { getCurrentActivityBand } = require('../../../config/marketActivity');
const path = require('path');
const fs = require('fs');

class WebsiteTrafficSimulator extends NSEScraper {
    constructor(typeOfDisclosure, isMaster, filesToDownload) {
        super(typeOfDisclosure, isMaster, filesToDownload); // Initialize as master scraper
        this.currentActivityBand = null;
    }

    async simulateTraffic() {
        if (process.env.PDF_DOWNLOAD_ENABLED && process.env.PDF_DOWNLOAD_ENABLED.toLowerCase() !== "true"){
            console.log("PDF not enabled on this env")
            return;
        }
        try {
            const { band, config } = getCurrentActivityBand();
            console.log("simulate traffic band", {band, config})
            this.currentActivityBand = band;

            if (band === 'MARKET_NO_ACTIVITY_HOURS') {
                console.log('Market inactive hours. Skipping simulation.');
                return;
            }
            let sleepInterval = config.MIN_GAP_TO_START * (1 + Math.random())
            console.log("Website Sim start Sleep for ", sleepInterval, new Date())
            await this.sleep(sleepInterval);
            console.log("Website Sim start Wake up for ", config.MIN_GAP_TO_START, new Date())
            // Get all available PDFs from website
            const allPdfs = await this.scrapeTables();
            //console.log("Simulator allPdfs", allPdfs)
            const downloadedPdfs = await this.getDownloadedPdfs();
            //console.log("Simulator downloadedPdfs", downloadedPdfs)
            // Get new PDFs to download
            /*const newPdfs = {
                equities: allPdfs.equities.filter(pdf => !downloadedPdfs.equities.includes(pdf)),
                sme: allPdfs.sme.filter(pdf => !downloadedPdfs.sme.includes(pdf))
            };*/
            const newPdfs = {}
        
            Object.keys(this.disclosureConfig.tabs).forEach(k => newPdfs[k] = allPdfs[k].filter(pdf => !downloadedPdfs[k].includes(pdf)))

            if (!this.hasNewPdfs(newPdfs)) {
                console.log('No new PDFs to download');
                return;
            }

            // Calculate number of simulators
            const numSimulators = Math.floor(
                config.MIN_PERSONS_TO_SIMULATE * (1 + Math.random())
            );
            console.log("newPDFs to Download", newPdfs.length)
            // Distribute PDFs among simulators
            const simulators = await this.createSimulators(numSimulators, newPdfs, config);
            
            // Execute simulators with random delays
            for (const simulator of simulators) {
                await simulator.scrapeTables();
                await this.sleep(
                    config.MIN_GAP_BETWEEN_PERSONS * (1 + Math.random())
                );
            }

        } catch (error) {
            console.error('Traffic simulation failed:', error);
        }
    }

    async getAllPdfLinks() {
        const allPdfLinks = {}

        Object.keys(this.disclosureConfig.tabs).forEach(k => allPdfLinks[k] = []) 
        return allPdfLinks
               // Implementation to get all PDF links from website
        // This should use the existing table parsing logic
        /*return {
            equities: [],  // Fill with actual PDF links
            sme: []       // Fill with actual PDF links
        };*/
    }

    async getDownloadedPdfs() {
        const downloadedPdfs = {}
        /*const downloadedPdfs = {
            equities: [],
            sme: []
        };*/
        Object.keys(this.disclosureConfig.tabs).forEach(k => downloadedPdfs[k] = [])
        
        // Get all years
        const rootDir = this.storage_dir;
        if (!fs.existsSync(rootDir)) {
            console.log("Root directory does not exist:", rootDir);
            return downloadedPdfs;
        }
        
        const years = fs.readdirSync(rootDir);
        
        for (const year of years) {
            const yearPath = path.join(rootDir, year);
            if (!fs.statSync(yearPath).isDirectory()) continue;
            
            const months = fs.readdirSync(yearPath);
            for (const month of months) {
                const monthPath = path.join(yearPath, month);
                if (!fs.statSync(monthPath).isDirectory()) continue;
                
                const days = fs.readdirSync(monthPath);
                for (const day of days) {
                    const dayPath = path.join(monthPath, day);
                    if (!fs.statSync(dayPath).isDirectory()) continue;
                    
                    // Check for each index folder
                    for (const index of Object.keys(this.disclosureConfig.tabs)) {
                        const indexPath = path.join(dayPath, index);
                        if (!fs.existsSync(indexPath)) continue;
                        
                        const logPath = path.join(indexPath, 'activity.log');
                        if (fs.existsSync(logPath)) {
                            try {
                                const content = fs.readFileSync(logPath, 'utf-8');
                                if (content.trim()) {
                                    console.log("Processing log:", logPath);
                                    const jsonContent = '[' + content.replace(/,\s*$/, '') + ']';
                                    const logs = JSON.parse(jsonContent);
                                    downloadedPdfs[index].push(...logs.map(log => log.ATTACHMENT));
                                }
                            } catch (error) {
                                console.error(`Error processing ${logPath}:`, error);
                            }
                        }
                    }
                }
            }
        }
        
        return downloadedPdfs;
    }
   
    async createSimulators(count, pdfs, config) {
        const simulators = [];
        
        for (let i = 0; i < count; i++) {
            const linksPerSimulator = Math.floor(
                config.MIN_LINKS_TO_DOWNLOAD * (1 + Math.random())
            );

            /*const simulatorPdfs = {
                equities: this.getRandomPdfs(pdfs.equities, linksPerSimulator),
                sme: this.getRandomPdfs(pdfs.sme, linksPerSimulator)
            };*/
            const simulatorPdfs = {}
            Object.keys(this.disclosureConfig.tabs).forEach(k => simulatorPdfs[k] = this.getRandomPdfs(pdfs[k], linksPerSimulator))

            switch(this.typeOfDisclosure){
                case "announcements" :
                    simulators.push(new NSEScraper(this.typeOfDisclosure, false, simulatorPdfs))
                    break;
                case "insider_trades" : 
                    simulators.push(new InsiderScraper(this.typeOfDisclosure, false, simulatorPdfs))
                    break;
                case "fifty_two_weeks_high" : 
                    simulators.push(new FiftyTwoWeekHighLowScraper(this.typeOfDisclosure, false, simulatorPdfs))
                    break;
                case "fifty_two_weeks_low" : 
                    simulators.push(new FiftyTwoWeekHighLowScraper(this.typeOfDisclosure, false, simulatorPdfs))
                    break;
            }
            
        }

        return simulators;
    }

    getRandomPdfs(pdfList, count) {
        const shuffled = [...pdfList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    hasNewPdfs(pdfs) {
        let newPdfs = false;
        for (const key of Object.keys(this.disclosureConfig.tabs)){
            if (pdfs[key].length > 0) newPdfs = true; break;
        }
        return newPdfs
        //return pdfs.equities.length > 0 || pdfs.sme.length > 0;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = WebsiteTrafficSimulator;