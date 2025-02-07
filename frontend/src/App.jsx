import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { Fragment } from "react";
import "./App.css";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";


function App() {

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
