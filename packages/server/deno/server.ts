// server.ts
import { serve } from "https://deno.land/std/http/server.ts";
const HASURA_ADMIN_SECRET = Deno.env.get("HASURA_ADMIN_SECRET");
let pre_populated_arrays: any = null;

const API_URL = Deno.env.get("NODE_API_URL") || "http://api:3000";

// 🚫 Reject mutations in payloads
async function postToGraphQL(payload: any): Promise<any> {
  const queryText = JSON.stringify(payload).toLowerCase();
  if (queryText.includes("mutation")) {
    console.warn("Blocked GraphQL mutation attempt");
    return ""; // OR throw new Error("Mutations not allowed")
  }

  const response = await fetch("http://graphql:8080/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET
    },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

async function initData() {
  try {
    console.log("populate using ", API_URL);
    const res = await fetch(`${API_URL}/api/internal/data`, {
      headers: { "X-Internal-Request": "true" }
    });
    pre_populated_arrays = await res.json();
    console.log("pre_populated_array", Object.keys(pre_populated_arrays));
    console.log("✅ Fetched pre_populated_arrays at startup");
  } catch (err) {
    console.error("❌ Failed to fetch pre_populated_arrays", err);
  }
}

console.log("🔁 Deno executor listening on http://0.0.0.0:4123");

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/init" && req.method === "POST") {
    await initData();
    return new Response(JSON.stringify({ status: "initialized" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (url.pathname === "/exec" && req.method === "POST") {
    const { functionText } = await req.json();
  
    if (!pre_populated_arrays) {
        await initData();
    }
    if (!pre_populated_arrays) {
      return new Response(JSON.stringify({ error: "Data not initialized" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    if (
        typeof functionText !== "string" ||
        !/^(\s*(async\s+)?function\b|\s*async\s*\(|\s*\()/.test(functionText.trim())
      ) {
        return new Response(JSON.stringify({ error: "Invalid function format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000); // 30s timeout
  
    const workerCode = `
      self.onmessage = async (e) => {
        const { functionText, input } = e.data;
        const postToGraphQL = async (payload) => {
          if (JSON.stringify(payload).toLowerCase().includes("mutation")) {
            return ""; // Block mutations
          }
          const res = await fetch("http://graphql:8080/v1/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "${HASURA_ADMIN_SECRET}"
            },
            body: JSON.stringify(payload)
          });
          return await res.json();
        };
  
        try {
          const userFunc = eval("(" + functionText + ")");
          const result = await userFunc(input, postToGraphQL);
          self.postMessage({ result });
        } catch (err) {
          self.postMessage({ error: err.message });
        }
      };
    `;
  
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob), { type: "module" });
  
    const result = await new Promise((resolve, reject) => {
      controller.signal.addEventListener("abort", () => {
        worker.terminate();
        reject(new Error("Function execution timed out"));
      });
  
      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        resolve(e.data);
      };
  
      worker.onerror = (err) => {
        clearTimeout(timeoutId);
        reject(new Error("Worker error: " + err.message));
      };
  
      worker.postMessage({
        functionText,
        input: pre_populated_arrays
      });
    }).catch((err) => ({ error: err.message }));
  
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
  

  return new Response("Not found", { status: 404 });
}, { port: 4123 });
