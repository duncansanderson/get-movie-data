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
 * Read the movies @basicMoviesLocation
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

/**
 * write the movie JSON data to the
 * file @completeMoviesLocation path
 * @param {*} movies - convert to JSON and write to file
 */
const saveMovies = async (movies) => {
    try {
        await fs.writeFile(completeMoviesLocation, JSON.stringify(movies, null, 2))
    } catch (error) {
        console.log(error0)
    }
}

/**
 * Query the oMDB API to get more
 * detailed information about each movie
 * @param {*} movies - array of movie objects
 * @returns detailed movie date
 */
const getFullMovieData = async (movies) => {
    const fullData = []

    await Promise.all(movies.map(async (movie) => {

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

/**
 * Make all object keys lowercase.
 * @param {*} data
 * @returns data containing objects with lowercase keys.
 */
const objectKeysToLowerCase = (data) => {
    const cleanData = {}

    for (const [key, value] of Object.entries(data)) {
        cleanData[key.toLowerCase()] = value
    }

    return cleanData
}

/**
 * Remove unused object data
 * @param {*} data
 * @returns cleaned objects
 */
const removeUnwantedData = (data) => {
    return Object.keys(dataModel).reduce((obj, key) => {
        obj[key] = data[key]
        return obj
    }, {})
}

module.exports = {
    getBasicMovies,
    saveMovies,
    getFullMovieData
}
