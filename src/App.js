import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { UserProvider } from "./userContext";
import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Order from "./pages/Order/Order";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import LatestReviews from "./pages/LatestReviews/LatestReviews";
import TopWriters from "./pages/TopWriters/TopWriters";
import Samples from "./pages/TopWriters/TopWriters";
import Blog from "./pages/Blog/Blog";

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    onError((error) => {
      console.log(error);
    }),
    httpLink,
  ]),
});

function App() {
  const token = localStorage.getItem("token");

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <div className="App">
          <Helmet>
            <meta charSet="utf-8" />
            <title>
              Essay Writing Service - We Do Essay Writing And Formatting
            </title>
            <link rel="canonical" href="http://mysite.com/example" />
            <meta
              name="description"
              content="Professional academic writing services"
            />
          </Helmet>
          {token !== "" ? null : (
            <section className="px-6 py-8 bg-surface">
              <NavigationBar />
            </section>
          )}
          <section className="px-6 py-8 bg-surface">
            <NavigationBar />
          </section>
          <Routes>
            <Route
              path="/"
              element={
                <section className="bg-gradient-to-r to-primary from-secondary-container flex justify-around items-center p-10 h-50">
                  <div className="">
                    <p className="tracking-wider text-5xl pr-10">
                      Online Essay Writing Service{" "}
                    </p>
                    <p className="text-5xl tracking-wider mt-10">
                      Available 24/7
                    </p>
                    <p className="text-lg py-10">
                      We do all types of writing at the cheapest rates in town.
                    </p>
                  </div>
                  <div>
                    <Order />
                  </div>
                </section>
              }
            ></Route>
            <Route path="/howitworks" element={<HowItWorks />}></Route>
            <Route path="/latestreviews" element={<LatestReviews />}></Route>
            <Route path="/topwriters" element={<TopWriters />}></Route>
            <Route path="/samples" element={<Samples />}></Route>
            <Route path="/blog" element={<Blog />}></Route>
            {/* <Route path='/registration' element={<Registration />}></Route>
						<Route path='/auth_password_reset' element={<AuthPasswordReset />}></Route>
						<Route path="/dashboard" element={<DashBoard />}></Route>
						<Route path="/settings" element={<Settings />}></Route>
						<Route path="tables" element={<Tables />}></Route> */}
            {/*<Route path='/*' element={ <Navigate to="/dashboard" /> }/>*/}
          </Routes>
        </div>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
