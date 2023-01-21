import type { NextApiRequest, NextApiResponse } from 'next';
var express = require("express");
const { exec , execSync } = require("child_process");
var app = express();
const { promisify } = require('util');
const { resolve } = require('path');const fs = require('fs');
const { json } = require("body-parser");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// ffprobe -v quiet -print_format json -show_format -show_streams '/home/music/[2021] Nurture [CD FLAC]/15 Fullmoon Lullaby.flac'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let response = await fetch("http://localhost:3001/api/files");
    let mdata = await response.json();

    res.status(200).json(mdata);
}