import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const cards = await prisma.FK_Card_Details.findMany();
        console.log('okk',cards);
        if(cards[0].id){
            res.status(200).json({ message: 'Success',Data:cards });
        }else{
            res.status(405).json({ message: 'Data Not Found' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
