import { useState, useEffect } from "react";
const Key = "560de2e7";

export default function useMovies(query) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        setMovies([]);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong with fetch Movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("❌ Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (query.length > 1) {
      fetchData();
    } else {
      setMovies([]);
    }
    return function() {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
