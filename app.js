const fs = require('fs');
require('dotenv').config();
require('colors');
const { showMenu, confirmInput, readInput, showCities } = require('./helpers/inquirer');
const Querys = require('./models/querys');

console.clear();

const main = async () => {
    const querys = new Querys();
    let opt = 0;

    try {
        fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
        const dbRecords = JSON.parse(fs.readFileSync(querys.dbPath));
        querys.readFromDB(dbRecords);
    } catch (err) { }

    do {

        opt = await showMenu();

        switch (opt) {
            case 1:
                const place = await readInput('City: ');
                const citiesResult = await querys.searchCity(place);
                const idCity = await showCities(citiesResult);


                if (idCity !== 0) {
                    const { placeName, coords: [lon, lat] } = citiesResult.find(city => city.id === idCity);
                    const { weather: [{ main }], temp, temp_min, temp_max } = await querys.getWeather(lat, lon);
                    // show results
                    console.log('\nCity\'s info\n');
                    console.log(`${'City: '.gray} ${placeName}`);
                    console.log(`${'Lat: '.gray} ${lat}`);
                    console.log(`${'Lng: '.gray} ${lon}`);
                    console.log(`${'Weather: '.gray} ${main}`)
                    console.log(`${'Temperature: '.gray} ${temp}`);
                    console.log(`${'Min: '.gray} ${temp_min}`);
                    console.log(`${'Max: '.gray} ${temp_max}`);

                    querys.saveOnHistory(placeName);
                    querys.saveOnDB();
                } else {
                    continue;
                }
                break;
            case 2:
                // history
                querys.history.forEach((place, idx) => {
                    const index = `${idx + 1}.`.green;
                    console.log(`${index} ${place}`);
                })
                break;
            case 3:
                // bye
                break;
            default:
                break;
        }

        if (opt !== 0) await confirmInput();
    } while (opt !== 0);
}

main();
