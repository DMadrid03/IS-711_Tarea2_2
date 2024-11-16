import mysql2 from "mysql2";


const connection = mysql2.createConnection({
    host: proccess.env.DB_HOST,
    port: proccess.env.DB_PORT,
    user: proccess.env.DB_USER,
    database: proccess.env.DB_NAME
});

connection.connect((error) =>{
    if(error){
        throw new Error("Error al conectar a la base de datos " + error);
    }
})

export default connection