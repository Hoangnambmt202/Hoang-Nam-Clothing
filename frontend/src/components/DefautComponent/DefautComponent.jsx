import Footer from "../FooterComponent/FooterComponent";
import Header from "./../HeaderComponent/HeaderComponent";
const DefautComponent = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer/>
    </div>
  );
};

export default DefautComponent;
