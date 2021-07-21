const { getBasicMovies, saveMovies, getFullMovieData } = require('./modules/utils')

const getMovieData = async () => {
    const movieData = await getBasicMovies()
    // const completeMovieData = await getFullMovieData(movieData)
    await getFullMovieData(movieData)
        .then((result) => saveMovies(result))
    // console.log(completeMovieData)
    // saveMovies(completeMovieData)
    // Get detailed data from OMDB
    // saveMovies(movies)
}

getMovieData()

