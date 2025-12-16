import './style.css'
import './styles/global.css'
import { Header } from './components/Header.js'
import { Home } from './pages/Home.js'
import { Footer } from './components/footer/Footer.jsx'

const app = document.getElementById('app')
app.appendChild(Header())
app.appendChild(Home())
// If Footer is a DOM factory use it directly; if it's a React component
// it should be mounted by a React renderer instead. Try to call if callable.
try{
	const maybe = Footer()
	if(maybe instanceof Node) app.appendChild(maybe)
	else app.appendChild(maybe)
}catch(e){
	// no-op: Footer may be a React component — leave mounting to user
	console.warn('Footer not mounted automatically. Use a React renderer to mount it.', e)
}
