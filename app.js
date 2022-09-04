const express = require('express');
const app=express();
app.use(express.json());

const sqlite3=require('sqlite3');
const {open} = require('sqlite');

const path=require('path');
const dbPath= path.join(__dirname,'cricketTeam.db');

let db=null;

const initDatabase= async ()=>{
    try {
    db = await open({
        filename:dbPath,
        driver:sqlite3.Database,
    });
    app.listen(3000,()=>{
        console.log("Server Started");
    });
    }
    catch(e){
        console.log(e);
    }


}
initDatabase();


//get all players API 1

app.get('/players/', async (request,response)=>{
    const sqlQuery=`
        SELECT *
        FROM cricket_team
        ORDER BY player_id;
    `;
    const playersArray= await db.all(sqlQuery);
    response.send(playersArray);        
});

// Add Player API 2

app.post('/players/',async (request,response)=>{
        const playerDetails = request.body;
        const {
            player_name,
            jersey_number,
            role            
        }=playerDetails;
        const addPlayerQuery=`
            INSERT INTO cricket_team(player_name,jersey_number,role)
            VALUES(
                '${player_name}',
                ${jersey_number},
                '${role}'
            );
        
        `;
        await db.run(addPlayerQuery);
        response.send("Player Added to Team");
})

//Get a Player API3

app.get('/players/:player_id/',async (request,response)=>{
    const  {player_id}=request.params;
    const getPlayerQuery=`
    SELECT *
    FROM  cricket_team
    WHERE player_id = ${player_id};`;
    const playerResponse= await  db.get(getPlayerQuery);
    response.send(playerResponse);
})

// Update the player Details API 4

app.put('/players/:player_id/',async (request,response)=>{
    const {player_id} = request.params;
    const playerDetails = request.body;
    const {
            player_name,
            jersey_number,
            role            
        }=playerDetails;
       const updatePlayer = `
    UPDATE
      cricket_team
    SET
       player_name='${player_name}',
      jersey_number=${jersey_number},
      role='${role}'
    WHERE
      player_id = ${player_id};`;
        await db.run(updatePlayer);
        response.send("Player Details Updated");
})

//Delete A player API 5

app.delete('/players/:player_id/', async (request,response)=>{
    const {player_id}=request.params;
    const deleteQuery=`
        DELETE FROM cricket_team
        WHERE player_id=${player_id};
    `;
    await db.run(deleteQuery);
    response.send("Player Removed");        
})