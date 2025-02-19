import { gql } from "graphql-tag";

const GET_STOCK_LIST = gql`
    query  GetStocks{
        stock{
            id
            company_name
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
const GET_PORTFOLIO_ANNOUNCEMENTS = gql`
query UserStockPortfolio($email: String!, $fromDate: date!, $toDate: date!){
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
      insider_trades (where: {intimation_date: {_gte: $fromDate, _lte: $toDate}}){
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
export {
    GET_STOCK_LIST, INSERT_PORTLFOLIO_STOCK, GET_USER_STOCK_PORTFOLIO, DELETE_USER_STOCK_PORTFOLIO,
    GET_PORTFOLIO_ANNOUNCEMENTS
}