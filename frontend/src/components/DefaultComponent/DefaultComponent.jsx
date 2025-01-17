import Footer from "../FooterComponent/FooterComponent";
import Header from "../HeaderComponent/HeaderComponent";
// eslint-disable-next-line react/prop-types
const DefaultComponent = ( { children } ) => {
  return (
    <div>
      <Header />
      {children}
      <Footer/>
    </div>
  );
};

export default DefaultComponent;
