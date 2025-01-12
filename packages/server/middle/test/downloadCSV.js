const fetchCSV = require('./csvFetcher');

async function download(){
    const year = '2010'
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    try{
        for (let idx=0; idx<months.length; idx++){
            const month = months[idx]
            const frmdtDay = month == 'Jan' ? '01' : '02'
            const todtDay = month == 'Dec' ? '31' : '01'
            const todtMonth = month == 'Dec' ? month : months[idx + 1]
            const frmdt = frmdtDay + '-' + month + '-' + year
            const todt = todtDay + '-' + todtMonth + '-' + year
            const url = `https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?frmdt=${frmdt}&todt=${todt}`
            const filepath = './downloads/' + year + '/' + month + '-' + year +'/amfi.csv'
            console.log('url', url, filepath)
            await fetchCSV(url, filepath)
        }
        //await fetchCSV('https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&frmdt=02-Dec-2024&todt=02-Dec-2024', './downloads/02-Dec-2024/amfi_53.csv')
        //await fetchCSV('https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&frmdt=01-Feb-2024&todt=02-Feb-2024', './downloads/02-Feb-2024/amfi_53.csv')
    }
    catch(e){
        console.log('error in download', e)
    }
}
// Example usage
//fetchCSV('https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&frmdt=02-Dec-2024&todt=02-Dec-2024', './downloads/02-Dec-2024/amfi_53.csv')
  //  .then(() => console.log('CSV downloaded successfully'))
    //.catch(err => console.error('Failed to download CSV:', err));

 download()   