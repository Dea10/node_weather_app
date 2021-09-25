const fs = require('fs');
const axios = require('axios');

class Querys {
    constructor() {
        this.history = [];
        this.dbPath = './db/db.json';
    }

    get mapboxParams() {
        return (
            {
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5
            }
        )
    }

    get weatherParams() {
        return this._weatherParams;
    }

    set weatherParams(coords) {
        const [ lat, lon ] = coords;
        this._weatherParams = {
            lat,
            lon,
            appid: process.env.WEATHER_KEY,
            units: 'metric'
        }
    }

    async searchCity(place = '') {

        let baseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`;

        const instance = axios.create({
            baseURL: baseUrl,
            params: this.mapboxParams
        });

        const resp = await instance.get()
            .then(resp => {
                const foundCities = resp.data.features.map(({ id, place_name, center }) => ({
                    id,
                    placeName: place_name,
                    coords: center
                }));
                return foundCities;
            })
            .catch(err => {
                console.log(err);
                return [];
            });

        return resp;
    }

    async getWeather(lat, lon) {
        let baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.weatherParams = [lat, lon];

        const instance = axios.create({
            baseURL: baseUrl,
            params: this.weatherParams
        });

        const resp = await instance.get()
            .then(resp => {
                const {weather, main: {temp, temp_min, temp_max}} = resp.data;
                return {weather, temp, temp_min, temp_max};
            })
            .catch(err => {
                return {
                    weather: [{main: 'not found'}],
                    temp: 'not found',
                    temp_min: 'not found',
                    temp_max: 'not found'
                };
            });

        return resp;
    }

    saveOnHistory( place = '') {
        if( this.history.includes(place) ) {
            return;
        }
        this.history.unshift( place );
    }

    saveOnDB() {
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readFromDB(newRecords) {
        this.history = newRecords.history;
    }
}

module.exports = Querys;