import Footer from "../FooterComponent/FooterComponent";
import Header from "../HeaderComponent/HeaderComponent";
const DefaultComponent = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer/>
    </div>
  );
};

export default DefaultComponent;
