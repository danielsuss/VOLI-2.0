var icons = {
    0: "Blue Minion Bruiser Icon",
    1: "Blue Minion Hammer Time Icon",
    2: "Blue Cannon Minion Icon",
    3: "Blue Minion Caster Icon",
    4: "Blue Mountain Icon",
    5: "Blue Super Minion Icon",
    6: "Ole Paw Icon",
    7: "Debonair Rose Icon",
    8: "Ancient Golem Icon",
    9: "Daggers Icon",
    10: "Winged Sword Icon",
    11: "Lizard Elder Icon",
    12: "Fully Stacked Mejai's Icon",
    13: "Red Cannon Minion Icon",
    14: "Red Siege Minion Icon",
    15: "Red Bruiser Minion Icon",
    16: "Red Caster Minion Icon",
    17: "Red Super Minion Icon",
    18: "Mix Mix Icon",
    19: "Targon Icon",
    20: "Shurima Icon",
    21: "Tree of Life Icon",
    22: "Revive Icon",
    23: "Lil' Sprout Icon",
    24: "Spike Shield Icon",
    25: "Level One Critter Icon",
    26: "Level Two Critter Icon",
    27: "Wraith Icon"
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function get_icon_id(url) {
    const regex = /profileicon\/(\d+)\.png/;
    const match = url.match(regex);
    
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

function generate_key_icon(currentIcon) {
    let randomID = getRandomInt(28);

    while (randomID === currentIcon) {
        randomID = getRandomInt(28);
    }

    const icon = icons[randomID];

    return [randomID, icon];
}

module.exports = {get_icon_id, generate_key_icon};