import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { Fragment, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import "./App.css";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";


function App() {
  // useEffect(()=> {
  //   fetchApi();
  // },[])
  const fetchApi = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/all`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("Error fetching API:", error);
    }
    
  };
  const query = useQuery({ queryKey: ['api'], queryFn: fetchApi });
  
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
