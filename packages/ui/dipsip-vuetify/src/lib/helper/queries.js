import { gql } from "graphql-tag";

const GET_STOCK_LIST = gql`
    query  GetStocks{
        stock{
            id
            company_name
        }
    }
`
const GET_USER_MF_PORTFOLIO = gql `
query  GetUserMFPortfolio($email: String!){
        portfolio_mutual_funds(where: {user: {email : {_eq: $email}}}){
						mutual_fund{
              id
              name
              return_3Y
              star_rating
              isDipSipETF
            }   
  			}
            users(where: {email: {_eq: $email}}){
    user_configs{
      key
      value
    }
    }
  
}
`
const INSERT_USER_MF_PORTFOLIO = gql`
mutation InsertMFPortfolio($object: portfolio_mutual_funds_insert_input!) {
  insert_portfolio_mutual_funds_one(object: $object) {
    mutual_fund_id
    user_id
  }
}
`
const DELETE_USER_MF_PORTFOLIO = gql`
mutation deleteUserMutualFundPortfolio($mutual_fund_id: Int!, $email: String!){
  delete_portfolio_mutual_funds(where: {
    mutual_fund_id: {_eq: $mutual_fund_id},
    user: {email: {_eq: $email}}
  }){
    affected_rows
  }
}
`
const GET_USER_STOCK_PORTFOLIO  = gql `
query  GetUserStockPortfolio($email: String!){
        portfolio_stocks(where: {user: {email : {_eq: $email}}}){
						stock{
              id
              company_name
            }
  			}
}
`
const INSERT_PORTLFOLIO_STOCK = gql`
mutation InsertStockPortfolio($object: portfolio_stocks_insert_input!) {
  insert_portfolio_stocks_one(object: $object) {
    stock_id
    user_id
  }
}
`
const DELETE_USER_STOCK_PORTFOLIO = gql`
mutation deleteUserStockPortfolio($stock_id: Int!, $email: String!){
  delete_portfolio_stocks(where: {
    stock_id: {_eq: $stock_id},
    user: {email: {_eq: $email}}
  }){
    affected_rows
  }
}
`
const INSERT_USER_CONFIG = gql`
mutation  insertUserConfig($object: user_config_insert_input!){
  insert_user_config_one(object: $object, on_conflict:{
    constraint: user_config_key_user_id_key,
    update_columns: [value]
  }){
    id
  }
}
`
const DELETE_USER_CONFIG = gql `
mutation deleteUserConfig($email: String!, $key: String!){
  delete_user_config(where: {key: {_eq: $key},user:  {email: {_eq: $email}}}){
    affected_rows
  }
}
`
const GET_PORTFOLIO_ANNOUNCEMENTS = gql`
query UserStockPortfolio($email: String!, $fromDate: date!, $toDate: date!, $fromDateTime: timestamptz!, $toDateTime: timestamptz!){
  portfolio_stocks(where: {user:{email: {_eq: $email}}}){
    stock{
      company_name
      stock_price_dailies(where: {price_date: {_gte: $fromDate, _lte: $toDate}}){
        open
        high
        low
        volume
        price_date
      }
      stock_announcements (where: {announcement_sentiment:{_gt:-1}, announcement_date: {_gte: $fromDate, _lte: $toDate}}){
        announcement_date
        announcement_text_summary
        announcement_impact
        announcement_document_link
        announcement_sentiment
      }
      insider_trades (where: {created_at: {_gte: $fromDateTime, _lte: $toDateTime}}){
        intimation_date
        name_of_insider
        number_of_securities_transacted
        number_of_securities_after_transaction
        number_of_securities_before_transaction
        type_of_security
        shareholding_before_transaction
        shareholding_after_transaction
        mode_of_transaction
        transaction_type
        category_of_insider
      }
    }
    
  }
  
}
`
const USER_CHAT_HISTORY = gql`query UserChatHistory($email: String!){
  user_chat(where: {user: {email: {_eq: $email}}}){
    chat_uuid
    chat_title
    textContent_user_query
    textContent_assistant_formatted_response
    created_at
    updated_at
  }
}`
export {
    GET_STOCK_LIST, INSERT_PORTLFOLIO_STOCK, GET_USER_STOCK_PORTFOLIO, DELETE_USER_STOCK_PORTFOLIO,
    GET_PORTFOLIO_ANNOUNCEMENTS, GET_USER_MF_PORTFOLIO, INSERT_USER_MF_PORTFOLIO, DELETE_USER_MF_PORTFOLIO,
    INSERT_USER_CONFIG, DELETE_USER_CONFIG, USER_CHAT_HISTORY
}