import fs from 'fs/promises';

export function get_icon_id(url) {
    // This regular expression looks for digits (\d+) after 'profileicon/' and before '.png'
    const regex = /profileicon\/(\d+)\.png/;
    const match = url.match(regex);

    // If there's a match and it has the capturing group, return the ID
    if (match && match[1]) {
        return match[1];
    } else {
        return null; // or you can return an error or a default value
    }
}

export async function read_json_file(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return null;
    }
}