const { Client } = require('shieldbow');
const express = require('express');
const cors = require('cors');
const { get_icon_id, generate_key_icon } = require('./functions');
const app = express();

const client = new Client('RGAPI-c5607cae-c86e-4642-8591-8ce003369c32');
let summoner;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/summonerEntry", async (req, res) => {
    console.log("Received summoner string:", req.body);
    await client.initialize({region: req.body['region']});
    console.log("Calling Riot API for summoner...");
    summoner = await client.summoners.fetchBySummonerName(req.body['username']);
    console.log(`Summoner name: ${summoner.name} (level: ${summoner.level})`);
    iconID = get_icon_id(summoner.profileIcon)
    res.status(200).json({
        'username': summoner.name,
        'level': summoner.level,
        'region' : summoner.region,
        'icon': iconID,
        'keyIcon': generate_key_icon(iconID)
    });
    summoner = null;
});

app.post("/iconCheck", async (req, res) => {
    console.log('Received summoner data:', req.body);
    await client.initialize({region: req.body['region']});
    console.log("Calling Riot API for summoner...");
    summoner = await client.summoners.fetchBySummonerName(req.body['username']);
    console.log("Comparing Icons...");
    iconID = get_icon_id(summoner.profileIcon)
    if (parseInt(iconID) === req.body["keyIcon"][0]) {
        console.log('Icons match!');
        res.json({ match: true });
    } else{
        console.log('Icons do not match!');
        res.json({ match: false });
    }
})

app.listen(5000, () => { console.log("Server started on port 5000")});