import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import StarRating from "./Startrating.jsx"; // Ensure correct import with matching filename

// function Test() {
//   const [movieset, Setmovies] = useState(0);
//   return (
//     <div className="">
//       <StarRating color="green" maxRating={10} onSetRating={Setmovies} />

//       <p>tis movie is rated {movieset} Stars</p>
//     </div>
//   );
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    {/* <StarRating
      maxRating={10}
      messages={["terrible", "bad", "ugly", "ok", "good"]}
      defaultrATING={3}
    />
    <StarRating
      color="blue"
      size={15}
      messages={["hi", "hiii", "bye", "gudbye", ""]}
      defaultrATING={3}
    />
    <Test /> */}
  </>
);
