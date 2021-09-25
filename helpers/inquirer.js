const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'Choose an option',
        choices: [
            { name: `${'1.'.green} Search city`, value: 1 },
            { name: `${'2.'.green} History`, value: 2 },
            { name: `${'0.'.green} Bye`, value: 0 }
        ]
    }
];

const showMenu = async () => {
    console.clear();
    console.log('=========================='.green)
    console.log('     Choose an option ')
    console.log('==========================\n'.green)

    const { option } = await inquirer.prompt(questions);

    return option;
}

const showCities = async (cities) => {
    const choices = cities.map((city, idx) => {
        const index = `${idx + 1}.`.green;
        return ({
        name: `${index} ${city.placeName}`,
        value: city.id
    })});

    choices.unshift({name: `${'0.'.red} Cancel`, value: 0});
    
    const question = [{
        type: 'list',
        name: 'idCity',
        message: 'Choose a result',
        choices
    }];

    const { idCity } = await inquirer.prompt(question);
    return idCity;
}

const confirmInput = async () => {
    const question = [{
        type: 'input',
        name: 'pause',
        message: `Press ${'ENTER'.green} to continue\n`
    }];

    console.log();

    await inquirer.prompt(question);
}

const readInput = async (message = '') => {
    const question = [{
        type: 'input',
        name: 'input',
        message
    }];

    const { input } = await inquirer.prompt(question);
    return input;
}

module.exports = {
    showMenu,
    showCities,
    confirmInput,
    readInput
}