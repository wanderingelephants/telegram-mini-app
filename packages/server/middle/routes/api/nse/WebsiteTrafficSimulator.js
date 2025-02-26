const { DateTime } = require('luxon');
const NSEScraper = require('./NSEScraper');
const { getCurrentActivityBand } = require('../../../config/marketActivity');
const path = require('path');
const fs = require('fs');

class WebsiteTrafficSimulator extends NSEScraper {
    constructor() {
        super({ equities: [], sme: [] }, true); // Initialize as master scraper
        this.currentActivityBand = null;
    }

    async simulateTraffic() {
        console.log(process.env.PDF_DOWNLOAD_ENABLED)
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
            const allPdfs = await this.scrapeAnnouncements();
            console.log("Simulator allPdfs", allPdfs.length)
            const downloadedPdfs = await this.getDownloadedPdfs();
            console.log("Simulator downloadedPdfs", downloadedPdfs.length)
            // Get new PDFs to download
            const newPdfs = {
                equities: allPdfs.equities.filter(pdf => !downloadedPdfs.equities.includes(pdf)),
                sme: allPdfs.sme.filter(pdf => !downloadedPdfs.sme.includes(pdf))
            };

            if (!this.hasNewPdfs(newPdfs)) {
                console.log('No new PDFs to download');
                return;
            }

            // Calculate number of simulators
            const numSimulators = Math.floor(
                config.MIN_PERSONS_TO_SIMULATE * (1 + Math.random())
            );

            // Distribute PDFs among simulators
            const simulators = await this.createSimulators(numSimulators, newPdfs, config);
            
            // Execute simulators with random delays
            for (const simulator of simulators) {
                await simulator.scrapeAnnouncements();
                await this.sleep(
                    config.MIN_GAP_BETWEEN_PERSONS * (1 + Math.random())
                );
            }

        } catch (error) {
            console.error('Traffic simulation failed:', error);
        }
    }

    async getAllPdfLinks() {
        // Implementation to get all PDF links from website
        // This should use the existing table parsing logic
        return {
            equities: [],  // Fill with actual PDF links
            sme: []       // Fill with actual PDF links
        };
    }

    async getDownloadedPdfs() {
        const downloadedPdfs = {
            equities: [],
            sme: []
        };
        
        // Get all years
        const rootDir = this.announcement_dir;
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
                    for (const index of ['equities', 'sme']) {
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
    /*async getDownloadedPdfs() {
        const now = DateTime.now().setZone('Asia/Kolkata');
        const date = now.toFormat('yyyy-MM-dd');
        const [year, month, day] = date.split('-');
        
        const downloadedPdfs = {
            equities: [],
            sme: []
        };

        for (const index of ['equities', 'sme']) {
            fs.mkdirSync(path.join(this.announcement_dir, year, month, day, index), {recursive: true})
            const logPath = path.join(
                this.announcement_dir,
                year,
                month,
                day,
                index,
                'activity.log'
            );

            if (fs.existsSync(logPath)) {
                const content = fs.readFileSync(logPath, 'utf-8');
                console.log("getDownloadedPdfs", logPath)
                console.log(content)
                const jsonContent = '[' + content.replace(/,\s*$/, '') + ']';
                const logs = JSON.parse(jsonContent);
                downloadedPdfs[index] = logs.map(log => log.ATTACHMENT);
            }
        }

        return downloadedPdfs;
    }*/

    async createSimulators(count, pdfs, config) {
        const simulators = [];
        
        for (let i = 0; i < count; i++) {
            const linksPerSimulator = Math.floor(
                config.MIN_LINKS_TO_DOWNLOAD * (1 + Math.random())
            );

            const simulatorPdfs = {
                equities: this.getRandomPdfs(pdfs.equities, linksPerSimulator),
                sme: this.getRandomPdfs(pdfs.sme, linksPerSimulator)
            };

            simulators.push(new NSEScraper(simulatorPdfs, false));
        }

        return simulators;
    }

    getRandomPdfs(pdfList, count) {
        const shuffled = [...pdfList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    hasNewPdfs(pdfs) {
        return pdfs.equities.length > 0 || pdfs.sme.length > 0;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = WebsiteTrafficSimulator;