const { postToGraphQL } = require("../../../lib/helper");
const sendEmail = require("../../../utils/sendMail");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const { reverse_mapping_category_of_insider, reverse_mapping_regulation,
    reverse_mapping_type_of_security, reverse_mapping_mode_of_transaction,
    reverse_mapping_transaction_type, reverse_mapping_exchange,
    mapping_announcement_sentiment, reverse_mapping_announcement_sentiment } = require("./mappings");

    const draftEmail = (portfolioStocks) => {
        
        // Group announcements by sentiment
        const announcements = {
            positive: [],
            negative: [],
            neutral: []
        };
    
        // Process each stock's announcements
        portfolioStocks.forEach(({ stock }) => {
            stock.stock_announcements.forEach(announcement => {
                const item = {
                    company: stock.company_name,
                    symbol: stock.symbol,
                    ...announcement
                };
    
                switch (announcement.announcement_sentiment) {
                    case 0:
                        announcements.positive.push(item);
                        break;
                    case 1:
                        announcements.negative.push(item);
                        break;
                    case 2:
                        announcements.neutral.push(item);
                        break;
                }
            });
        });
    
        let emailBody = `
        <div style="background-color: #fff3e6; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 10px;">💡</span>
                <h2 style="font-weight: bold; font-size: 20px; margin: 0;">Did You Know ?</h2>
            </div>
            <p style="margin: 10px 0;">
                On <a href="https://dipsip.co.in/stocks" style="color: #0066cc; text-decoration: underline;">DipSip.co.in</a>, 
                you can search for hidden gems by making nested and complex queries.<br/><br/>
                <em>For example:</em> "Which companies made positive announcements last week, and whose stock price went up next day, 
                and is now below the announcement day price"
            </p>
        </div>
    `;
        // Start building email body
        emailBody += `
            <h1 style="font-weight: bold; font-size: 24px;">Latest Updates</h1>
            
            <h2 style="font-weight: bold; font-size: 20px; margin-top: 20px;">Announcements</h2>
        `;
    
        // Add Positive Announcements
        if (announcements.positive.length > 0) {
            emailBody += `
                <div style="background-color: #e6ffe6; padding: 15px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="color: #006600;">Positive Updates</h3>
                    ${announcements.positive.map(ann => `
                        <div style="margin: 10px 0;">
                            <strong>${ann.company} (${ann.symbol})</strong><br/>
                            ${ann.announcement_text_summary}<br/>
                            <strong>Impact:</strong> ${ann.announcement_impact}<br/>
                            <a href="${ann.announcement_document_link}" style="color: #0066cc;">View Document</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    
        // Add Negative Announcements
        if (announcements.negative.length > 0) {
            emailBody += `
                <div style="background-color: #ffe6e6; padding: 15px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="color: #cc0000;">Negative Updates</h3>
                    ${announcements.negative.map(ann => `
                        <div style="margin: 10px 0;">
                            <strong>${ann.company} (${ann.symbol})</strong><br/>
                            ${ann.announcement_text_summary}<br/>
                            <strong>Impact:</strong> ${ann.announcement_impact}<br/>
                            <a href="${ann.announcement_document_link}" style="color: #0066cc;">View Document</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    
        // Add Neutral Announcements
        if (announcements.neutral.length > 0) {
            emailBody += `
                <div style="background-color: #e6f2ff; padding: 15px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="color: #004d99;">Neutral Updates</h3>
                    ${announcements.neutral.map(ann => `
                        <div style="margin: 10px 0;">
                            <strong>${ann.company} (${ann.symbol})</strong><br/>
                            ${ann.announcement_text_summary}<br/>
                            <strong>Impact:</strong> ${ann.announcement_impact}<br/>
                            <a href="${ann.announcement_document_link}" style="color: #0066cc;">View Document</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    
        // Add Insider Trades
        emailBody += `
            <h2 style="font-weight: bold; font-size: 20px; margin-top: 20px;">Insider Trades</h2>
        `;
    
        portfolioStocks.forEach(({ stock }) => {
            if (stock.insider_trades && stock.insider_trades.length > 0) {
                stock.insider_trades.forEach(trade => {
                    emailBody += `
                        <div style="margin: 15px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
                            <strong>${stock.company_name} (${stock.symbol})</strong><br/>
                            <strong>Date:</strong> ${trade.intimation_date}<br/>
                            <strong>Insider:</strong> ${trade.name_of_insider}<br/>
                            <strong>Transaction:</strong> ${reverse_mapping_mode_of_transaction[trade.mode_of_transaction]} - ${reverse_mapping_transaction_type[trade.transaction_type]}<br/>
                            <strong>Category:</strong> ${reverse_mapping_category_of_insider[trade.category_of_insider]}<br/>
                            <strong>Securities:</strong> ${trade.number_of_securities_transacted} ${reverse_mapping_type_of_security[trade.type_of_security]}<br/>
                            <strong>Shareholding:</strong> ${trade.shareholding_before_transaction}% → ${trade.shareholding_after_transaction}%
                        </div>
                    `;
                });
            }
        });
        
        

        return emailBody;
    }

const route = async (req, res) => {
    const summaryDate = req.query.dateStr

    const portfolioQuery = `
    query getPortfolios($summaryDate: date!, $summaryDateTime: timestamptz!){
  users{
    email
    portfolio_stocks{
      stock{
        symbol
        company_name
        stock_announcements(where: {announcement_sentiment: {_gt: -1},announcement_date: {_eq: $summaryDate}})
        {
          announcement_text_summary
          announcement_impact
          announcement_sentiment
          announcement_document_link
        }
        insider_trades(where: {created_at: {_gte: $summaryDateTime}}){
          name_of_insider
          category_of_insider
          transaction_type
          intimation_date
          mode_of_transaction
          number_of_securities_transacted
          type_of_security
          shareholding_before_transaction
          shareholding_after_transaction
        }
      }
    }
  }
}`
const summaryDateTime = `${summaryDate}T00:00:00.000Z`
const resp = await postToGraphQL({
    query: portfolioQuery,
    variables: {summaryDate, summaryDateTime}
})
console.log(resp.data)
const subscribers = resp.data.users
for (const subscriber of subscribers){
    const BodyText  = draftEmail(subscriber.portfolio_stocks)
    console.log("Sending Mail", new Date(), subscriber.email, BodyText)
    await sendEmail([subscriber.email], "DipSIP Watch List Updates", BodyText)
    await delay(2000)
}   
res.status(200).json("OK")
}
module.exports = route