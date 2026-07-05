import 'react'
import './App.css'
import HomeState from './components/HomeState'

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>現在の自宅情報</h1>
          <HomeState></HomeState>
        </div>
      </section>
    </>
  )
}

export default App
