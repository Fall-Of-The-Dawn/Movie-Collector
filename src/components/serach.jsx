const Search = ({searchTerm,setsearchTerm})=>{
    return(
        <div className="search">
            <div>
                <img src="./search.svg" alt="" />
                <input type="text"
                 placeholder="serach through 1000 movies"
                 value={searchTerm} 
                 onChange={(e)=>setsearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}
export default Search