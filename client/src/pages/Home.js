export function Home(){
  const el = document.createElement('div')
  el.innerHTML = `
    <section>
      <h1>Welcome to StyleSync</h1>
      <p>This is a simple starter page.</p>
    </section>
  `
  return el
}
