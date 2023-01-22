import { useRouter } from 'next/router';
import type { NextApiRequest, NextApiResponse } from 'next';
const http = require("http");

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { imgPath } = req.query;

    http.get(`http://localhost:3001/api/images/${imgPath![0]}/${imgPath![1]}`, (response: any) => {
        response.pipe(res);
    });
}