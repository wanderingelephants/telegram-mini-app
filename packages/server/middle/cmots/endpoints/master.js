const axios = require('axios');
const fs = require('fs').promises;
const path = require("path")
const cmots_api_token = process.env.cmots_api_token
const cmotsApiUrl = "http://jwttoken.cmots.com/Aidea/api"
function transformKeysToLowercase(data) {
    if (Array.isArray(data)) {
        return data.map(item => transformKeysToLowercase(item));
    } else if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((acc, key) => {
            const value = data[key];
            const lowerKey = key.toLowerCase();

            if (value !== null && typeof value === 'object') {
                acc[lowerKey] = transformKeysToLowercase(value);
            } else {
                acc[lowerKey] = value;
            }

            return acc;
        }, {});
    }
    return data;
}
const axiosConfig = {
    headers: {
        'Authorization': `Bearer ${cmots_api_token}`
    }
};
const route = async (req, res) => {
    const apiType = req.params.apiType
    const categoryId = req.params.categoryId
    console.log("get master data", {apiType, categoryId})
    try {
        const apiUrl = categoryId ? `${cmotsApiUrl}/${apiType}/${categoryId}` : `${cmotsApiUrl}/${apiType}`
        console.log(apiUrl)
        const response = await axios.get(apiUrl, axiosConfig);
        
        const transformedData = { ...response.data };

        if (transformedData.data) {
            transformedData.data = transformKeysToLowercase(transformedData.data);
            res.status(200).json(transformedData.data)
        }
        else res.status(200).json(transformedData)

    }
    catch (e) {
        console.error(e)
        res.status(500).json(e)
    }
}
module.exports = route