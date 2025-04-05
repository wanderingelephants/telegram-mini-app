// server.ts
import { serve } from "https://deno.land/std/http/server.ts";
const HASURA_ADMIN_SECRET = Deno.env.get("HASURA_ADMIN_SECRET");
let pre_populated_arrays: any = null;

// Utility to call your GraphQL API
async function postToGraphQL(payload: any): Promise<any> {
  const response = await fetch("http://graphql:8080/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":  HASURA_ADMIN_SECRET// replace with env var or inject
    },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

const API_URL = Deno.env.get("NODE_API_URL") || "http://api:3000";


async function initData() {
  try {
    console.log("populate using ", API_URL)
    const res = await fetch(`${API_URL}/api/internal/data`, {
        headers: { "X-Internal-Request": "true" }
      });
    pre_populated_arrays = await res.json();
    console.log("pre_populated_array", Object.keys(pre_populated_arrays))
    console.log("✅ Fetched pre_populated_arrays at startup");
  } catch (err) {
    console.error("❌ Failed to fetch pre_populated_arrays", err);
  }
}
console.log("🔁 Deno executor listening on http://0.0.0.0:4123");

serve(async (req) => {
  const url = new URL(req.url);
    console.log("url", url)
  if (url.pathname === "/init" && req.method === "POST") {
    await initData();
    return new Response(JSON.stringify({ status: "initialized" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (url.pathname === "/exec" && req.method === "POST") {
    const { functionText } = await req.json();

    if (!pre_populated_arrays) {
      return new Response(JSON.stringify({ error: "Data not initialized" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(functionText)
    try {
      const fn = new Function("input", "postToGraphQL", `
        const userFunc = ${functionText};
        return userFunc(input, postToGraphQL);
      `);

      const result = await fn(pre_populated_arrays, postToGraphQL);
      return new Response(JSON.stringify({ result }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Not found", { status: 404 });
}, { port: 4123 });
