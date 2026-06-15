import Navbar from './components/home/Navbar'
import Hero from './components/home/Hero'
import Showcase from './components/home/Showcase'
import Services from './components/home/Services'
import Categories from './components/home/Categories'
import CTA from './components/home/CTA'
import Footer from './components/home/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Services />
        <Categories />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
