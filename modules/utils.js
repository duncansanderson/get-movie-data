const fs = require('fs').promises
const path = require('path')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const dataModel = require('./data-model')

dotenv.config()

// Path to movie json files.
const basicMoviesLocation = path.join(__dirname, '../assets/basicMovies.json')
const completeMoviesLocation = path.join(__dirname, '../assets/movies.json')

/**
 * Should read the movies @basicMoviesLocation
 * path and convert to js object
 */
const getBasicMovies = async () => {
    try {
        const data = (await fs.readFile(basicMoviesLocation)).toString()
        return JSON.parse(data)
    } catch (error) {
        console.log('File read error:', error.message)
    }
}

const saveMovies = async (movies) => {
    try {
        await fs.writeFile(completeMoviesLocation, JSON.stringify(movies, null, 2))
    } catch (error) {
        console.log(error0)
    }
}

// const getFullMovieData = async (movies) => {
//     const fullData = []
//     movies.forEach(async (movie) => {
//         const movieData = await getMovie(movie)
//         fullData.push(movieData)
//     })

//     return Promise.all(fullData)
// }

const getFullMovieData = async (movies) => {
    const fullData = []

    await Promise.all(movies.map(async (movie, index) => {

        const title = (movie.altTitle) ? movie.altTitle : movie.title
        const url = new URL(process.env.APIURL)
        url.searchParams.set('apikey', process.env.APIKEY)
        url.searchParams.set('t', title)
        url.searchParams.set('year', movie.year)
        url.searchParams.set('plot', 'full')

        await fetch(url)
            .then((resp) => resp.json())
            .then((data) => (data.Error === 'Movie not found!') ? movie : data)
            .then((data) => objectKeysToLowerCase(data))
            .then((data) => removeUnwantedData(data))
            .then((data) => fullData.push(data))
            .catch((error) => console.log(error))
    }))

    return fullData
}
// async function getMovieData() {
//     await Promise.all(movieJson.map(async (movie) => {
//         const fetchUrl = `${url}?apikey=${apiKey}&t=${movie.title.toLowerCase()}&year=${movie.year}&plot=full`

//         fetch(fetchUrl)
//             .then((resp) => resp.json())
//             .then((data) => finalData.push(data))
//     }))

//     return finalData
// }

// const getMovie = async (movie) => {
//     const fetchUrl = new URL(process.env.APIURL)
//     fetchUrl.searchParams.set('apikey', process.env.APIKEY)
//     fetchUrl.searchParams.set('t', movie.title)
//     fetchUrl.searchParams.set('year', movie.year)
//     fetchUrl.searchParams.set('plot', 'full')

//     fetch(fetchUrl)
//         .then((resp) => resp.json())
//         .then((data) => objectKeysToLowerCase(data))
//         .then((data) => removeUnwantedData(data))
//         // .then((data) => fullData.push(data))
//         .catch((error) => console.log(error))
// }

const objectKeysToLowerCase = (data) => {
    const cleanData = {}

    for (const [key, value] of Object.entries(data)) {
        cleanData[key.toLowerCase()] = value
    }

    return cleanData
}

const removeUnwantedData = (data) => {
    return Object.keys(dataModel).reduce((obj, key) => {
        obj[key] = data[key]
        return obj
    }, {})
}

// const removeUnwantedData = (data) => {
//     // console.log('data model', dataModel)
//     // const cleanData = data
//     // console.log('c',data)
//     const cleanData = Object.keys(dataModel).reduce((obj, key) => {
//         obj[key] = data[key]
//         return obj
//     }, {})
//     // console.log('d', cleanData)
//     return cleanData
// }

module.exports = {
    getBasicMovies,
    saveMovies,
    getFullMovieData
}
