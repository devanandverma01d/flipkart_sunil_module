import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const pincodes = await prisma.FK_Pincode.findMany();
        console.log('okk',pincodes);
        if(pincodes[0].id){
            res.status(200).json({ message: 'Success',Data:pincodes });
        }else{
            res.status(405).json({ message: 'Data Not Found' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}