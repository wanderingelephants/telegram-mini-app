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
        try {
            const { band, config } = getCurrentActivityBand();
            console.log("simulate traffic band", {band, config})
            this.currentActivityBand = band;

            if (band === 'MARKET_NO_ACTIVITY_HOURS') {
                console.log('Market inactive hours. Skipping simulation.');
                return;
            }

            // Get all available PDFs from website
            const allPdfs = await this.scrapeAnnouncements();
            console.log("Simulator allPdfs", allPdfs)
            const downloadedPdfs = await this.getDownloadedPdfs();
            console.log("Simulator downloadedPdfs", downloadedPdfs)
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
    }

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