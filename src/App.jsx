import { useState , useEffect} from "react"
import Search from "./components/serach"
import Spinner from "./spinner.jsx"
import Moviecard from "./components/moviecard.jsx"

import {useDebounce} from 'react-use'
import {UpdateSearch, trendingMovies} from './fetch.js'
const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_API_KEY
const API_Options = {
  method :'GET',
  headers:{
    accept : 'application/json',
    Authorization : `Bearer ${API_KEY}`
  }
}
const App=()=> {
  const [searchTerm,setsearchTerm] = useState('')
  const [error, seterror] = useState('')
  const [movie,setmovie] = useState('')
  const [trendingList,settrendingList] = useState([])
  const [loading, setloading] = useState(true)
  const [debouncemovie , setdebouncemovie] = useState('')
  const [initialvalue, setinitialvalue] = useState(0)
  useDebounce(()=>setdebouncemovie(searchTerm), 500, [searchTerm])
  const fetchMovies = async (querry='')=>{
    try {
      const endpoint = querry
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(querry)}` 
        : 
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const get = await fetch (endpoint, API_Options)
      if(!get.ok){
        throw new Error ("Failed to fetch")
      }
      const data = await get.json()
      if(data.Response === 'False'){
        seterror(data.Response)
        setmovie([])
        return
      }
      setmovie(data.results || [])
      if(querry&& data.results.length >0){
        await UpdateSearch(querry, data.results[0])

      }
    } 
    catch(error){
      seterror(error)
    }
    finally {
      setloading(false)
    }
  }

  const loadtrendingmovies = async ()=>{
    try{
      const movies = await trendingMovies()
      settrendingList(movies)
    }
    catch(err){
      console.log(err)
    }
  }
  
  useEffect(()=>{
    fetchMovies(debouncemovie)
  },[debouncemovie])
  useEffect(()=>{
    loadtrendingmovies()
  },[])
  return (
    <main>
      <div className="container"></div>
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="title image" />
          <h1>Find <span className="text-gradient">movies</span> You'll Enjoy Without Hassle</h1>
          <Search searchTerm = {searchTerm} setsearchTerm={setsearchTerm}/>
         
        </header>
        {trendingList.length>0 && (
          <section className="trending">
            <h2>Trending movies</h2>
          
            <ul>
              {trendingList.map((movie,index)=>(
                <li key={movie.$id}>
                   <p>{index +1}</p>
                  <img src= {movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
       
        <section className="all-movies">
          <h2 >ALL MOVIES</h2>
         {loading? (<Spinner/>):error? (<p className="text-red-500">{error}</p>): 
          (<ul>
          {movie.map((movietitle)=>(
            <Moviecard key={movietitle.id} movietitle={movietitle}/>
          ))}
          </ul>)}
        
        </section>
      </div>
    </main>
  )
}

export default App
