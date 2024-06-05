import { useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import StarRating from "./Startrating";
import useMovies from "./useMovies";
import useLoaclstorage from "./useLocal";
import useKey from "./useKey";
const average = (arr) => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

const Key = "560de2e7";

//using escape key to return to main menu

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  //using custom hook
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLoaclstorage([], "watched");
  // const [watched, setWatched] = useState(function() {
  //   const storedval = localStorage.getItem("watched");
  //   return JSON.parse(storedval);
  // });
  function handleSelect(id) {
    setSelected((selected) => (id === selected ? null : id));
  }
  function handleClose() {
    setSelected(null);
  }
  function handleWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    setSelected(null);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function deletewatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  function handleremove() {
    setQuery("");
  }

  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery} onremove={handleremove} />
        <NumBar movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onClick={handleSelect} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selected ? (
            <SelectedId
              selected={selected}
              onClose={handleClose}
              onAddWatch={handleWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <SummaryList watched={watched} ondelete={deletewatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

function Loading() {
  return (
    <div className="loading">
      <ReactLoading
        type="spinningBubbles"
        color="#007bff"
        height={50}
        width={50}
      />
      <span>Loading...</span>
    </div>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="popcorn">
        🍿
      </span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery, onremove }) {
  const inputEl = useRef(null);
  useKey("Enter", function() {
    if (e.code === "Enter") {
      if (document.activeElement === inputEl.current) return;
      inputEl.current.focus();
      setQuery("");
    }
  });
  // useEffect(
  //   function() {
  //     function callback(e) {
  //       if (e.code === "Enter") {
  //         if (document.activeElement === inputEl.current) return;
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);
  //     return () => document.addEventListener("keydown", callback);
  //   },
  //   [setQuery]
  // );
  // useEffect(function() {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // });

  return (
    <div className="search-container">
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />

      {!query ? (
        ""
      ) : (
        <span onClick={onremove} style={{ fontSize: 15 }}>
          X
        </span>
      )}
    </div>
  );
}

function NumBar({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button toggle={() => setIsOpen((open) => !open)} isOpen={isOpen} />
      {isOpen && children}
    </div>
  );
}

function SelectedId({ selected, onClose, onAddWatch, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selected);
  const watchedUserMovies = watched.find((movie) => movie.imdbID === selected)
    ?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selected,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: parseInt(runtime), // Ensure runtime is a number
      userRating: Number(userRating), // Ensure userRating is a number
    };
    onAddWatch(newWatchedMovie);
  }
  useKey("Escape", onClose);

  useEffect(() => {
    async function getMovieDetails() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&i=${selected}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    }
    getMovieDetails();
  }, [selected]);
  useEffect(
    function() {
      if (!title) return;
      document.title = `Movie|${title}`;

      return function() {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>Your already rated ⭐{watchedUserMovies}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function MoviesList({ movies, onClick }) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onClick={onClick} />
      ))}
    </ul>
  );
}

function Movie({ movie, onClick }) {
  return (
    <li onClick={() => onClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span role="img" aria-label="calendar">
            🗓
          </span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SummaryList({ watched, ondelete }) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <SummaryWatchedMovies
          key={movie.imdbID}
          movie={movie}
          ondelete={ondelete}
        />
      ))}
    </ul>
  );
}

function SummaryWatchedMovies({ movie, ondelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span role="img" aria-label="star">
            ⭐️
          </span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span role="img" aria-label="star">
            🌟
          </span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span role="img" aria-label="hourglass">
            ⏳
          </span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => ondelete(movie.imdbID)}>
        X
      </button>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <Summarydetails
        watched={watched}
        avgImdbRating={avgImdbRating}
        avgUserRating={avgUserRating}
        avgRuntime={avgRuntime}
      />
    </div>
  );
}

function Summarydetails({ watched, avgImdbRating, avgUserRating, avgRuntime }) {
  return (
    <div>
      <p>
        <span role="img" aria-label="number">
          #️⃣
        </span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span role="img" aria-label="star">
          ⭐️
        </span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span role="img" aria-label="star">
          🌟
        </span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span role="img" aria-label="hourglass">
          ⏳
        </span>
        <span>{avgRuntime.toFixed(1)} min</span>
      </p>
    </div>
  );
}

function Button({ toggle, isOpen }) {
  return (
    <button className="btn-toggle" onClick={toggle}>
      {isOpen ? "-" : "+"}
    </button>
  );
}

// function Timer({ initialSeconds }) {
//   const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

//   useEffect(() => {
//     if (secondsRemaining > 0) {
//       const id = setInterval(() => {
//         setSecondsRemaining((prev) => prev - 1);
//       }, 1000);

//       return () => clearInterval(id);
//     }
//   }, [secondsRemaining]);

//   const mins = Math.floor(secondsRemaining / 60);
//   const seconds = secondsRemaining % 60;

//   return (
//     <div className="timer">
//       {mins < 10 ? "0" : ""}
//       {mins}:{seconds < 10 ? "0" : ""}
//       {seconds}
//     </div>
//   );
// }
