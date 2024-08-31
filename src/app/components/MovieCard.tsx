import { IconStar, IconStarFilled } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function MovieCard({ movie, userId }: { movie: any, userId: string }) {
  const [movieRating, setMovieRating] = useState(0);
  const [rating, setRaiting] = useState({})
  const [newMovierating, setNewMovierating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const [isClient, setIsClient] = useState(false)
  useEffect(()=>{
    setIsClient(true)
  },[])

  const fetchMovieRating = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/ratings/${userId}/${movie.MovieID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovieRating(Number(data.Rating));
      setRaiting(data)
      setNewMovierating(Number(data.Rating));
      setLoadingRating(false)
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setMovieRating(0);
      setLoadingRating(false)
    }
  };

  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 10) + 1);

  const handleReview = async (star:number) => {
    setLoadingRating(true)
    setNewMovierating(star)
    setLoadingRating(false)
  }

  const updateMovieRating = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/ratings${movieRating === 0 ? "" : `/${userId}/${movie.MovieID}`}`,{
            method: movieRating === 0 ? "POST" : "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                movieRating === 0 ?
                {
                    'user_id': userId,
                    'movie_id': movie.MovieID,
                    'rating': newMovierating,
                }
                :
                {
                    ...rating,
                    'rating': newMovierating,
                }
            )
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
  }
  const handleReviewSubmit = async () =>{
    toast.info("Updating review")
    await updateMovieRating()
    isClient && window.location.reload()
  }

  useEffect(() => {
    fetchMovieRating();
    setRandomNumber(Math.floor(Math.random() * 10) + 1)
  }, []);

  return (
    <div className="bg-white text-black px-3 w-full md:w-1/4 lg:w-1/4 xl:w-1/4 py-5 my-10 mr-20 md:max-w-[20%] lg:max-w-[20%] xl:max-w-[20%]">
      <div className="w-full">
        <Image src={`/cine${randomNumber}.jpeg`} className="image" fill alt="cine" />
      </div>
      <div className="my-3">
        <div className="">
            <p className="">
                {movie.Title}
            </p>
            <div className="flex mt-2 cursor-pointer">
                {
                    !loadingRating ?
                    Array.from({ length: 5 }, (_, i) => i + 1).map((star) =>
                        star <= newMovierating ? (
                        <IconStarFilled onClick={()=>handleReview(star)} key={star} className="text-yellow-300" />
                        ) : (
                        <IconStar onClick={()=>handleReview(star)} key={star} className="text-black" />
                        )
                    )
                    :
                    <div className="">
                        <p>Loading review...</p>
                    </div>
                }
            </div>
        </div>
        {
            movieRating !== newMovierating &&
            <button 
                onClick={()=>handleReviewSubmit()}
                className="mt-10 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
            Submit review
            </button>
        }
      </div>
    </div>
  );
}
