const fs = require('fs').promises;
const path = require('path');
const {postToGraphQL} = require("../../../lib/helper")

const route = async (req, res) => {
    try {
        const isDipSipETF = "true" === req.query.isDipSipETF ? true : false 
        const gqlResp = await postToGraphQL({
            query: `query mutual_funds{
  mutual_fund(where: 
            {isDipSipETF: {_eq: ${isDipSipETF}}, mf_direct_variant_id:{_is_null:true}},order_by: {return_3Y: desc_nulls_last}){
    id        
    name
    plan
    star_rating
    aum
    return_1Y
    return_2Y
    return_3Y
    return_5Y
  }
}`, variables: {}
        })
        const mutualFundList = gqlResp.data.mutual_fund.map(m => ({"id": m.id, "name": m.name, "star_rating": m.star_rating ,"category": m.category, "aum": m.aum, "return_3Y": m.return_3Y}))
        
        res.status(200).json(mutualFundList);
    } catch (e) {
        console.error('Error processing mutual funds data:', e);
        res.status(500).json("Failed to get list");
    }
};

module.exports = route;