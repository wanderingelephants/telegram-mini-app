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
export {
    GET_STOCK_LIST, INSERT_PORTLFOLIO_STOCK, GET_USER_STOCK_PORTFOLIO, DELETE_USER_STOCK_PORTFOLIO
}