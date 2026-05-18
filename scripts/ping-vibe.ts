async function main() {
  const res = await fetch('http://localhost:3000/api/vibe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Привет. Кто ты и что умеешь? Найди мне концерт инди-рока в Москве на пятницу.',
    }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
