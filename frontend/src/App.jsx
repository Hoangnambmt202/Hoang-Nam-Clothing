import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { Fragment } from "react";
import axios from "axios";

import "./App.css";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";


function App() {
 
  // const fetchApi = async () => {
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/all`);
  //     console.log(res.data);
  //     return res.data;
  //   } catch (error) {
  //     console.log("Error fetching API:", error);
  //   }
    
  //};

  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </>
  );
}

export default App;
