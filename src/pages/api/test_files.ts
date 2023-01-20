import type { NextApiRequest, NextApiResponse } from 'next';
const fs = require('fs');
const path = require('path');




export default async function (req: NextApiRequest, res: NextApiResponse) {
    let file = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../src/pages/api/files.json')))
    res.status(200).json(file);
}