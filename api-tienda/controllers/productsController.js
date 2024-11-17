import connection from "../config/db.js";
import {validateProductSchema, validatePartialSchema} from "../schemas/productSchema.js"

export class ProductsController {

    static getAllProducts(req,res) {        

        const query = 'select p.id,p.nombre,p.descripcion,p.precio,p.stock,p.categoria,p.fecha_creacion,dp.id,color,talla,precio,dimensiones from productos p inner join detalles_producto dp on dp.producto_id = p.id;'

        try {
            connection.query(query,(error,results)=>{
                if(error){
                    res.status(400).json({message: "error al obtener los productos, " + error})
                }

                res
                .header("Content-Type", "application/json")
                .status(200)
                .json(results)
            })
        } catch (error) {
            return res.status(400).json({message: "error al obtener los datos, " + error})
        }
    }

    static getProductById(req,res){
        const {id} = req.params

        const query = 'select p.id id_Producto,p.nombre,p.descripcion,p.precio,p.stock,p.categoria,p.fecha_creacion,dp.id detID,color,talla,precio,dimensiones from productos p left join detalles_producto dp on dp.producto_id = p.id where p.id = ?;'

        try {
            connection.query(query,id,(error,results)=>{
                if(error){
                    res.status(400).json({message: "error al obtener el producto buscado, " + error})
                }

                if(results && results.length===0){
                    res.status(200).json({message: "Producto no encontrado"})
                    return
                }

                return res
                    .header({"Content-Type": "application/json"})
                    .status(200)
                    .json(results)                    
            })
        } catch (error) {
            return res.status(400).json({message: "error al obtener el producto, " + error})
        }
    }

    static async createProduct(req, res) {
        const data = req.body;
    
        const { success, error } = validateProductSchema(data);
        if (!success) {
            return res.status(400).json({ 
                message: "Error al crear el producto: valores no válidos. " + error 
            });
        }
    
        const { nombre, descripcion, precio, stock, categoria } = data;
        const { color, talla, peso, dimensiones } = data;
    
        try {
            // Insertar en la tabla productos
            const insertProductQuery = 
                "INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)";
            const productResult = await new Promise((resolve, reject) => {
                connection.query(insertProductQuery, [nombre, descripcion, precio, stock, categoria], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
    
            // Obtener el ID insertado
            const insertID = productResult.insertId;
    
            // Insertar en la tabla detalles_producto
            const insertDetailsQuery = 
                "INSERT INTO detalles_producto (producto_id, color, talla, peso, dimensiones) VALUES (?, ?, ?, ?, ?)";
            await new Promise((resolve, reject) => {
                connection.query(insertDetailsQuery, [insertID, color, talla, peso, dimensiones], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
    
            // Responder con éxito
            return res
                .header({ "Content-Type": "application/json" })
                .status(201)
                .json({
                    message: "Producto y detalles creados exitosamente",
                    producto: { ...data, id: insertID }
                });
        } catch (err) {
            return res.status(400).json({ 
                message: "Error al crear el producto en la base de datos: " + err 
            });
        }
    }
    

    static updateProduct(req,res){
        const {id} = req.params
        const data = req.body

        const {success, error} = validatePartialSchema(data)
        const query = "update productos set ? where id = ?"

        if(!success){
            return res.status(400).json({message: "error al actualizar el producto valores no validos, " + error})
        }

        try {
            console.log(query)
            connection.query(query,[data,id],(error,results)=>{
                if(error){
                    res.status(400).json({message: "error al actualizar el producto en la base de datos, " + error})
                }
                return res
                .header({"Content-Type": "application/json"})
                .status(200)
                .json({message: "Producto actualizado exitosamente",datos: data})
            })
            
        } catch (error) {
            return res.status(400).json({message: "error al actualizar el producto en la base de datos," + error})
        }
    }

    static deleteProduct(req,res){
        const {id} = req.params

        const query = "delete from productos where id = ?"

        try {

            connection.query(query,id,(error,results)=>{
                if(error){
                    res.status(400).json({message: "error al eliminar el producto en la base de datos, " + error})
                }
                return res
                .header({"Content-Type": "application/json"})
                .status(200)
                .json({message: "Producto eliminado exitosamente"})
            })
            
        } catch (error) {
            return res.status(400).json({message: "error al eliminar el producto en la base de datos," + error})
        }
    }

    
}



