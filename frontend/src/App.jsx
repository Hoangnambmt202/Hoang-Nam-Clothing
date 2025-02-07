import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";

import "./App.css";

function App() {

  return (
    <>
      <Router>
      <Routes>
        {routes.map((route, index) => {
          if (route.children) {
            return (
              <Route key={index} path={route.path} element={<route.layout />}>
                {route.children.map((child, idx) => (
                  <Route key={idx} path={child.path} element={<child.page />} />
                ))}
              </Route>
            );
          } else {
            const Page = route.page;
            const Layout = route.layout || (({ children }) => <>{children}</>);

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
          }
        })}
      </Routes>
    </Router>
    </>
  );
}

export default App;
