import Navbar from './components/home/Navbar'
import Hero from './components/home/Hero'
import Showcase from './components/home/Showcase'
import Services from './components/home/Services'
import Categories from './components/home/Categories'
import CTA from './components/home/CTA'
import Footer from './components/home/Footer'
import { useGallery } from './components/home/useGallery'

function App() {
  // Single source of truth for gallery media — fetched once, shared by the hero
  // collage and the showcase grid so both reflect the live Blob store.
  const { works } = useGallery()

  return (
    <>
      <Navbar />
      <main>
        <Hero works={works} />
        <Showcase works={works} />
        <Services />
        <Categories />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
