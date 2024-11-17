import mysql2 from "mysql2";
import 'dotenv/config';


const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

connection.connect((error) =>{
    if(error){
        throw new Error("Error al conectar a la base de datos " + error);
    }
})

export default connection