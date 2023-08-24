import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const numbers = await prisma.FK_Customer_Number.findMany();
        console.log('okk',numbers);
        if(numbers[0].id){
            res.status(200).json({ message: 'Success',Data:numbers });
        }else{
            res.status(405).json({ message: 'Data Not Found' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}