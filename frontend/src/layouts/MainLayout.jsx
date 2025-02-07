
import Header from "../components/HeaderComponent/HeaderComponent"
import Footer from "../components/FooterComponent/FooterComponent"

function MainLayout({children}) {
  return (
    <>
    <Header/>
      {children}
    <Footer/>
    </>
  )
}

export default MainLayout