import { Client } from "shieldbow";
import { get_icon_id, read_json_file } from "./functions.js";
import defaultIcons from './icons.json' assert { type: 'json' };


const client = new Client('RGAPI-c5607cae-c86e-4642-8591-8ce003369c32');

client
    .initialize({
        region: 'euw'
    })
    .then(async () => {
        const summoner = await client.summoners.fetchBySummonerName('Rezzii');

        console.log(`Summoner name: ${summoner.name} (level: ${summoner.level} icon: ${get_icon_id(summoner.profileIcon)}).`);
        console.log(defaultIcons['0']);
    });