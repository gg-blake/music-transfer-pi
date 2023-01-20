import type { NextApiRequest, NextApiResponse } from 'next';
var express = require("express");
const { exec , execSync } = require("child_process");
var app = express();
const { promisify } = require('util');
const { resolve } = require('path');const fs = require('fs');
const { json } = require("body-parser");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

let jsonList: any[] = [];
let ignoreFiles: any[] = [];
let lastScanTime = Date.now();

async function getFiles(dir: string) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir: any) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;  
    }));  
    return files.reduce((a, f) => a.concat(f), []);
}

async function cacheJson(dir: string) {
    if (ignoreFiles.includes(dir)) {
        return
    }
    let response = await execSync(`cd && cd ../music && ffprobe -v quiet -print_format json -show_format -show_streams '${dir}'>`);
    let json = JSON.parse(response.toString());
    json['date_added'] = Date.now();
    jsonList.push(json);
}

async function loadAllJSON(dir: string) {
    getFiles(dir)    .then(files => {
        files.map((file: string) => {            
            cacheJson(file)
            .catch((error) => {
                ignoreFiles.push(file);
            })
        })
    })
    .then(() => {        
        lastScanTime = Date.now();    
    })
    .catch((error) => {
        console.log(error)
    })
}

function scanFiles(dir: string) {
    let names = jsonList.map(file => file.format.filename);
    getFiles(dir)
    .then(files => {
        files.map((file: string) => {
            if (!names.includes(file)) {
                console.log(`New file found: ${file}`);
                cacheJson(file);
            }
        })
    })
    .then(() => {
        getFiles(dir)
        .then(files => {
            jsonList.map((file, index) => {
                if (!files.includes(file.format.filename)) {
                    console.log(`File removed: ${file.format.filename}`);
                    jsonList.splice(index, 1);
                }
            })
        })
        
        

    })
    .catch((error) => {
        console.log("")
    })
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
    
    res.status(200).json({message: 'Connected'});
}