import Header from '../../components/common/Header/Header.jsx'
import Hero from '../../components/customer/Hero/Hero.jsx'
import WhyChoose from '../../components/customer/WhyChoose/WhyChoose.jsx'
import Menu from '../../components/customer/Menu/Menu.jsx'
import AboutUs from '../../components/customer/AboutUs/AboutUs.jsx'
import Footer from '../../components/common/Footer/Footer.jsx'

export default function HomePage() {
  return (
  <>
    <Header />
    <Hero />
    <WhyChoose />
    <Menu />
    <AboutUs/>
    <Footer />
  </>
  )
}