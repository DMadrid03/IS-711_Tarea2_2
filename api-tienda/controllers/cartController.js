import { query } from "express";
import connection from "../config/db.js";

export class CartController {

    static getCartByUser(req, res) {

        const { userID } = req.params;

        const query = 'select c.id, usuario_id, u.nombre Usuario,producto_id,p.nombre Producto, c.cantidad,c.fecha_agregado from carrito c  inner join usuarios u on u.id = c.usuario_id inner join productos p on p.id = c.producto_id where usuario_id = ?';

        try {
            connection.query(query, userID, (error, results) => {
                if (error) {
                    res.status(400).json({ message: "error al obtener el carrito, " + error })
                    return
                }

                if (results && results.length === 0) {
                    res.status(200).json({ message: "Carrito no encontrado" })
                    return
                }

                return res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json(results)
            })
        }
        catch (error) {
            return res.status(400).json({ message: "error al obtener el carrito, " + error })
        }
    }

    static async addToCart(req, res) {
        const data = req.body;
        const { usuario_id, producto_id, cantidad } = data;

        // Validaciones iniciales
        if (!usuario_id || !producto_id || !cantidad) {
            return res.status(400).json({ message: "Obligatorio enviar usuario_id, producto_id y cantidad" });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
        }

        try {
            // Validar existencia del usuario
            const userQuery = 'select count(*) count from usuarios where id = ?';
            const userResult = await new Promise((resolve, reject) => {
                connection.query(userQuery, [usuario_id], (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count > 0); 
                });
            });

            if (!userResult) {
                return res.status(400).json({ message: "El usuario no existe" });
            }

            // Validar existencia del producto
            const productQuery = 'select count(*) count from productos where id = ?';
            const productResult = await new Promise((resolve, reject) => {
                connection.query(productQuery, [producto_id], (error, results) => {
                    if (error) return reject(error);
                    resolve(results[0].count > 0); 
                });
            });

            if (!productResult) {
                return res.status(400).json({ message: "El producto no existe" });
            }

            // Agregar al carrito
            const insertQuery = `
                INSERT INTO carrito (usuario_id, producto_id, detalle_id, cantidad) 
                VALUES (?, ?, (SELECT id FROM detalles_producto WHERE producto_id = ? LIMIT 1), ?)
            `;
            connection.query(insertQuery, [usuario_id, producto_id, producto_id, cantidad], (error, results) => {
                if (error) {
                    return res.status(400).json({ message: "Error al agregar al carrito en la base de datos: " + error });
                }

                return res.status(200).json({
                    message: "Producto agregado al carrito exitosamente",
                    cartItem: {
                        id: results.insertId,
                        usuario_id,
                        producto_id,
                        cantidad
                    }
                    // ,resultados: results
                });
            });
        } catch (error) {
            return res.status(500).json({ message: "Error interno del servidor: " + error });
        }
    }


    static removeFromCart(req, res) {
        const {producto_id} = req.params;

        
        const{usuario_id} = req.body;
        if(!usuario_id){
            return res.status(400).json({message: "Obligatorio enviar usuario_id"})
        }
        //para distinguir del carrito de que usuario, recibir el usuario_id
        const query = "delete from carrito where producto_id = ? and usuario_id = ?";

        try {
            connection.query(query,[producto_id,usuario_id],(error,results)=>{
                if(error){
                    return res.status(500).json({error: true, message: "Error al borrar el producto del carrito en la DB "+ error})
                }
                if(results && results.affectedRows ===0){
                    return res.status(400).json({message: "El producto no existe "})
                }
                
                return res.status(200).json({
                    message: "Producto eliminado del carrito",
                    resultados: results
                })
            })
        } catch (error) {
            return res.status(400).json({error: true, message: "Error al borrar el producto del carrito "+ error})
        }
    }
}