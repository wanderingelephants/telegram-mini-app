const mapping_category_of_insider = {
  "Promoters": 1,
  "Key Management Personnel": 2,
  "Relative": 3,
  "-": 4,
  "Promoter Group": 5,
  "Employees/Designated Employees": 6,
  "Director": 7,
  "Other": 8,
  "Immediate relative": 9,
  "Key Managerial Personnel": 10
};
const reverse_mapping_category_of_insider = Object.entries(mapping_category_of_insider)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const mapping_regulation = {
  "7(2)": 1,
  "7(3)": 2,
};
const reverse_mapping_regulation = Object.entries(mapping_regulation)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const mapping_type_of_security = {
  "Equity Shares": 1,
  "Convertible Debentures": 2,
  "Warrants": 3
};
const reverse_mapping_type_of_security = Object.entries(mapping_type_of_security)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const mapping_mode_of_transaction = {
  "ESOP": 1,
  "Gift": 2,
  "Invocation of Pledge": 3,
  "Market Purchase": 4,
  "Market Sale": 5,
  "Off Market": 6,
  "Others": 7,
  "Pledge Creation": 8,
  "Preferential Offer": 9,
  "Revokation of Pledge": 10,
  "Scheme of Amalgamation/Merger/Demerger/Arrangement": 11,
  "Inter-se-Transfer": 12
};
const reverse_mapping_mode_of_transaction = Object.entries(mapping_mode_of_transaction)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const mapping_transaction_type = {
    "Buy": 1,
    "Sell": 2,
    "Pledge": 3,
    "Pledge Revoke": 4,
    "Invocation of Pledge": 5,
  };
  const reverse_mapping_transaction_type = Object.entries(mapping_transaction_type)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  
const mapping_exchange = {
  "NSE": 1,
  "BSE": 2,
  "MSEI": 3,
  "NA": 4
};
const reverse_mapping_exchange = Object.entries(mapping_exchange)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  const mapping_announcement_sentiment = {
    "": -1,
    "Positive": 0,
    "Negative": 1,
    "Neutral": 2
  };
  const reverse_mapping_announcement_sentiment = Object.entries(mapping_announcement_sentiment)
  .reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
    
module.exports = {mapping_category_of_insider, mapping_regulation, mapping_type_of_security, mapping_mode_of_transaction, 
  mapping_transaction_type, mapping_exchange,
  reverse_mapping_category_of_insider, reverse_mapping_regulation, reverse_mapping_type_of_security, reverse_mapping_mode_of_transaction, 
  reverse_mapping_transaction_type, reverse_mapping_exchange, 
  mapping_announcement_sentiment, reverse_mapping_announcement_sentiment}