'use client'
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from "@mui/material";
import UserSection from "./components/UserSection";
import Image from 'next/image'

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState<any[]>(null!);
  const [visibleMovies, setVisibleMovies] = useState(15);
  const [userId, setUserId] = useState("")
  


  useEffect(()=>{
    setUserId(window.localStorage.getItem("userId")!)
  },[])
  
  const fetchMovies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/movies");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/recommendations/"+userId);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleShowMore = () => {
    setVisibleMovies(prevVisibleMovies => prevVisibleMovies + 15);
  };

  useEffect(() => {
    if(userId != "")
    {
      fetchRecommendations();
    }
  }, [userId]);

  useEffect(()=>{
    if(recommendations !== null)
    {
      fetchMovies();
    }
  },[recommendations])

  return (
    <main className="items-center md:pt-0 lg:pt-0 xl:pt-0 justify-between md:p-24 lg:p-24 xl:p-24 md:pl-40 lg:pl-40 xl:pl-40">
        <ToastContainer />
        <div className="flex mb-32 items-center mx-auto w-1/2">
          <div className="text-2xl items-center gap-0">
              <div className="w-5/12 mx-auto">
                <Image src="/logo.png" alt="logo" fill className="image"/>
              </div>
              <h1 className="text-red-600 mx-auto w-[90%]">Like Netflix, but with all the chill and none of the stream.</h1>
          </div>
        </div>
        <UserSection setUserId={setUserId} />
        <div className="">
          <h1 className="text-red-600 font-bold text-3xl">We recommend:</h1>
          {
            recommendations &&
            recommendations.length > 0 ?
              <div className="flex flex-wrap justify-start">
                {recommendations?.slice(0, visibleMovies).map((movie:any, key:any) => (
                  <MovieCard movie={movie} userId={userId+""} key={key} />
                ))}
              </div>
              :
              <div className="mt-12 w-full">
                There are no recommendations yet...
              </div>
          }
        </div>
        <div className="">
          <h1 className="text-red-600 font-bold text-3xl mt-20">Other movies:</h1>
          {
            movies.length > 0 ?
              <div className="flex flex-wrap justify-start">
                {movies.slice(0, visibleMovies).map((movie:any, key) => (
                  <MovieCard movie={movie} userId={userId+""} key={key} />
                ))}
              </div>
              :
              <div className="mx-auto mt-40 w-10">
                <CircularProgress />
              </div>
          }
        </div>
      {visibleMovies < movies.length && (
        <button 
          onClick={handleShowMore} 
          className="mt-10 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Show More
        </button>
      )}
    </main>
  );
}

