const cors = require('cors');
import { PrismaClient } from '@prisma/client';
import { URL } from "helpers/helper";
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
import { v4 as uuidv4 } from 'uuid';
const io = require("socket.io-client");
const prisma = new PrismaClient();
const socket = io('http://54.95.32.231:4000');
const corsMiddleware = cors({
    origin: 'http://54.95.32.231:3001', // Replace this with your Next.js frontend URL
    methods: ['POST'], // Allow only the POST method for this endpoint
});
export default async function handler(req, res) {
    await new Promise((resolve, reject) => corsMiddleware(req, res, (result) => {
        if (result instanceof Error) {
            return reject(result);
        }
        return resolve(result);
    }));
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token === undefined) {
        return res.status(500).json({ error: 'Bearer Token Undefined ' });
    }
    const response = await fetch(`${URL}/rest/auth/verifyToken?token=` + token + ``);
    const data = await response.json();
    if (data.valid === false) {
        return res.status(500).json({ error: 'Token Invalid ' });
    }
    if (data.decoded.role !== 'enduser') {
        return res.status(500).json({ error: 'Token Invalid For User' });
    }
    if (req.method === 'POST') {
        function formatTime(time) {
            // Assuming that time is in 'HH:mm:ss' format or any other valid time format
            const [hours, minutes, _] = time.split(':');
            return `${hours}:${minutes}`;
        }
        if (data.decoded.wa_access_token !== null) {
            const Apidata = req.body;
            const wainstances = await prisma.Wa_Instances.findMany({
                where: {
                    userid: data.decoded.id,
                },
            });
            if (wainstances) {
                const guid = uuidv4();
                console.log('time ', Apidata.campaign_post_time);
                const datetimeObj = formatTime(Apidata.campaign_post_time);
                // Create a Date object from the input string
                const dateObj = new Date(Apidata.campaign_post_time);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const convertedDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
                const CreateBulk = await prisma.Wa_Bulk_Compaign.create({
                    data: {
                        guid: guid,
                        userid: data.decoded.id,
                        instanceid: Apidata.instanceid,
                        caption: Apidata.caption,
                        group_name: Apidata.group_name,
                        campaign_name: Apidata.campaign_name,
                        campaign_status: 'pending',
                        campaign_post_time: convertedDateString,
                        media_path: Apidata.media_path,
                        msg_interval_maximum_time: Apidata.msg_interval_maximum_time,
                        msg_interval_minium_time: Apidata.msg_interval_minium_time,
                    }
                });
                if (CreateBulk.group_name) {
                    socket.emit("BulkScheduleSave", {
                        data: CreateBulk
                    });
                    return res.status(200).json({ code: 200, message: 'Shedule Save SuccessFully ', data: CreateBulk });
                } else {
                    return res.status(500).json({ code: 500, message: 'Shedule Not Save In Db Please Check it ' });
                }
            } else {
                return res.status(500).json({ code: 500, message: 'User Not Found' });
            }
        } else {
            return res.status(405).json({ message: 'Access Token Null' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}