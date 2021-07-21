const { getBasicMovies, saveMovies, getFullMovieData } = require('./modules/utils')

const getMovieData = async () => {
    const movieData = await getBasicMovies()
    await getFullMovieData(movieData)
        .then((result) => saveMovies(result))
}

getMovieData()
