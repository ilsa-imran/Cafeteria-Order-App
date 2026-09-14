import autocannon from "autocannon";

const baseUrl = process.env.LOAD_TEST_URL ?? "http://localhost:4000";

async function run(title, opts) {
  const result = await autocannon({ url: baseUrl, connections: 50, duration: 10, ...opts });
  console.log(`\n=== ${title} ===`);
  console.log(`requests/sec: ${result.requests.average}`);
  console.log(`latency avg (ms): ${result.latency.average}`);
  console.log(`latency p99 (ms): ${result.latency.p99}`);
  console.log(`errors: ${result.errors}`);
  console.log(`non-2xx: ${result.non2xx}`);
  return result;
}

await run("GET /menu (rush-hour browsing)", { url: `${baseUrl}/menu` });

const loginRes = await fetch(`${baseUrl}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "student@university.test", password: "student12345" }),
});
const { token } = await loginRes.json();

const menuRes = await fetch(`${baseUrl}/menu`);
const menu = await menuRes.json();
const menuItemId = menu.find((item) => item.available)?.id;

await run("POST /orders (rush-hour checkout)", {
  url: `${baseUrl}/orders`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    items: [{ menuItemId, quantity: 1 }],
    pickupTime: "WITHIN_30_MIN",
  }),
});
