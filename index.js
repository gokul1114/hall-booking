import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import * as path from 'path';
// Deployed link https://node-filesys.herokuapp.com/
const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json())

app.get("/",async(req,resp) => {
    fs.readFile("./sampleDetails.txt","utf-8",function(err,content){
       resp.send(content)
    })
})

app.get("/getRooms",async(req,resp) => {
    fs.readFile("./data.json","utf-8",function(err,content){
        let data = JSON.parse(content)
        resp.send(data)
    })
  
})
app.post("/createRoom",async(req,resp) => {
    let body = req.body;
    console.log(body)
    fs.readFile("./data.json","utf-8",function(err,content){
        let currentContent = JSON.parse(content);
        body = {...body,"roomId" : currentContent.length+1}
        currentContent.push(body)
         fs.writeFile("./data.json",JSON.stringify(currentContent),function(err,contenWritten){
            resp.send({message:"Room created successfully"});
         })
        
    })
})

app.post("/bookRoom", async(req,resp) => {
    let body = req.body;
    fs.readFile("./bookingDetails.json","utf-8",function(err,content){
        let isRoomAlreadyBooked = false;
        let currentContent = JSON.parse(content);
                let bodyDay = body.date.split("-")[0];
                let bodyMonth = body.date.split("-")[1];
                let bodyYear = body.date.split("-")[2];
                let bodyStartTimeHours = body.startTime.split(":")[0];
                let bodyStartTimeMinutes = body.startTime.split(":")[1];
                let bodyEndTimeHours = body.endTime.split(":")[0];
                let bodyEndTimeMinutes = body.endTime.split(":")[1];

        for(let i=0; i < currentContent.length; i++){
    //         "date": "28-12-2021",
    // "startTime": "10:00",
    // "endTime": "13:00",
            if(body.roomId == currentContent[i].roomId) {
                let currentContentDay = currentContent[i].date.split("-")[0];
                let currentContentMonth = currentContent[i].date.split("-")[1];
                let currentContentYear = currentContent[i].date.split("-")[2];
                let currentContentStartTimeHours = currentContent[i].startTime.split(":")[0];
                let currentContentStartTimeMinutes = currentContent[i].startTime.split(":")[1];
                let currentContentEndTimeHours = currentContent[i].endTime.split(":")[0];
                let currentContentEndTimeMinutes = currentContent[i].endTime.split(":")[1];
                
                let bodyStartTimeStamp = new Date(bodyYear,bodyMonth,bodyDay,bodyStartTimeHours,bodyStartTimeMinutes,'00','00').getTime();
                let bodyEndTimeStamp = new Date(bodyYear,bodyMonth,bodyDay,bodyEndTimeHours,bodyEndTimeMinutes,'00','00').getTime(); 

                let currentContentStartTimeStamp = new Date(currentContentYear,currentContentMonth,currentContentDay,currentContentStartTimeHours,currentContentStartTimeMinutes,'00','00').getTime();
                let currentContentEndTimeStamp = new Date(currentContentYear,currentContentMonth,currentContentDay,currentContentEndTimeHours,currentContentEndTimeMinutes,'00','00').getTime();
                
                console.log(bodyStartTimeStamp,bodyEndTimeStamp,currentContentStartTimeStamp,currentContentEndTimeStamp);
                if((currentContentStartTimeStamp >= bodyStartTimeStamp && bodyStartTimeStamp <= currentContentEndTimeStamp)
                || (currentContentStartTimeStamp >= bodyEndTimeStamp && bodyEndTimeStamp <= currentContentEndTimeStamp)) {
                    isRoomAlreadyBooked = true;
                    resp.send({message : "Room already booked at this time"})
                    break;
                }
            }
        }
        if(!isRoomAlreadyBooked) {
        body = {...body,"bookingId" : currentContent.length+1, bookingStatus : "successfull"}
        currentContent.push(body)
         fs.writeFile("./bookingDetails.json",JSON.stringify(currentContent),function(err,contenWritten){
            resp.send({message:"Booking successfull"});
         })
        }
    })
})

app.get("/getBookingDetails", async(req,resp) => {
    fs.readFile("./bookingDetails.json","utf-8",function(err,content){
        let data = JSON.parse(content)
        resp.send(data)
    })
})

app.get("/getCustomerBookingDetails", async(req,resp) => {
    fs.readFile("./bookingDetails.json","utf-8",function(err,content){
        let data = JSON.parse(content)
        resp.send(data)
    })
})

app.listen(PORT, () => {console.log("server started")})
