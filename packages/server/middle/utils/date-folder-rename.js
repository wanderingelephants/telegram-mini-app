const fs = require('fs').promises;
const path = require('path');

// Regular expression to match date folders like "30-Nov-2024"
const datePattern = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/;

// Map of month abbreviations to their numeric values
const monthMap = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
};

async function convertDateFormat(oldFormat) {
    const match = oldFormat.match(datePattern);
    if (!match) return null;

    const [_, day, month, year] = match;
    const monthNum = monthMap[month.toLowerCase()];
    if (!monthNum) return null;

    // Pad day with leading zero if necessary
    const paddedDay = day.padStart(2, '0');
    return `${year}-${monthNum}-${paddedDay}`;
}

async function processDirectory(dirPath) {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                // Check if the directory name matches our date pattern
                const newDate = await convertDateFormat(entry.name);
                
                if (newDate) {
                    const newPath = path.join(path.dirname(fullPath), newDate);
                    try {
                        await fs.rename(fullPath, newPath);
                        console.log(`Renamed: ${entry.name} → ${newDate}`);
                    } catch (err) {
                        console.error(`Error renaming ${fullPath}: ${err.message}`);
                    }
                }

                // Recursively process subdirectories
                // If we renamed the directory, use the new path
                await processDirectory(newDate ? path.join(path.dirname(fullPath), newDate) : fullPath);
            }
        }
    } catch (err) {
        console.error(`Error processing directory ${dirPath}: ${err.message}`);
    }
}

// Start processing from the current directory
const baseDir = '/Users/sachetsingh1/telegram-mini-app/packages/downloads/moneycontrol'
console.log(`Starting directory scan from: ${baseDir}`);

processDirectory(baseDir)
    .then(() => console.log('Directory processing completed'))
    .catch(err => console.error('Error:', err));