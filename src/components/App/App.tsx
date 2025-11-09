import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeMovieModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);

      const data = (await fetchMovies(query)) as Movie[];

      if (data.length === 0) {
        toast.error("No movies found for your request.");
      }

      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      <div className={styles.app}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {isError ? (
          <ErrorMessage />
        ) : (
          movies.length > 0 && (
            <MovieGrid onSelect={handleSelectMovie} movies={movies} />
          )
        )}
        {isLoading && <Loader />}
        {selectedMovie && (
          <MovieModal onClose={closeMovieModal} movie={selectedMovie} />
        )}
      </div>
    </>
  );
}
