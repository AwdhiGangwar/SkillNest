const targets = [
  'http://localhost:8080/api/admin/support/tickets',
  'http://127.0.0.1:8080/api/admin/support/tickets',
  'http://localhost:9999/api/admin/support/tickets' // expected to fail
];

const body = {
  subject: 'Simulated ticket',
  message: 'Testing network behavior from node script',
  userEmail: 'simulator@example.com'
};

async function run() {
  for (const url of targets) {
    console.log('\n--- Request to:', url, '---');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      console.log('Status:', res.status);
      console.log('Headers:', Object.fromEntries(res.headers.entries()));
      try {
        console.log('Body (parsed):', JSON.parse(text));
      } catch (e) {
        console.log('Body (raw):', text);
      }
    } catch (err) {
      console.error('Request failed with error:');
      console.error(err && err.message ? err.message : err);
    }
  }
}

run().catch((e) => {
  console.error('Script failed:', e);
  process.exit(1);
});
