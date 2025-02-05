const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const postToGraphQL = async (body, token = null) => {
    let payload = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify(body)
    }
    if(!token) {
        payload.headers['x-hasura-admin-secret'] = process.env.HASURA_ADMIN_SECRET
    } else {
        payload.headers['Authorization'] = 'Bearer ' + token
    }
    let res = await fetch(process.env.HASURA_ENDPOINT + '/v1/graphql', payload);
    res = await res.json();
    if(res.errors) {
        throw new Error(JSON.stringify(res.errors));
    }
    return res
}

exports.postToGraphQL = postToGraphQL

exports.postToGraphQLMetadata = async (body) => {
    let res = await fetch(process.env.HASURA_ENDPOINT + '/v1/metadata', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
        },
        body: JSON.stringify(body)
    });
    res = await res.json();
    if(res.errors) {
        throw new Error(JSON.stringify(res.errors));
    }
    return res
}

exports.fetch = fetch;