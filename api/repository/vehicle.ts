import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Vehicle, { VehicleRow } from "../models/vehicle";
import IRepository from "./IRepository";


export const VehicleRepository : IRepository<Vehicle> = {
    retrieveAll(limit? : number, offset? : number) : Promise<Vehicle[]> {
        let query = "SELECT * FROM vehicle";
        let values = []
        if (limit){
            query += ` LIMIT ?`
            values.push(limit)
        }
        if (offset){
            query += ` OFFSET ?`
            values.push(offset)
        }

        return new Promise((resolve, reject) => {
            connection.execute<Vehicle[]>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res)
                    }
                }
            )
        })
    },

    retrieveById(id :  number) : Promise<Vehicle | undefined> {
        let query = `SELECT * FROM vehicle WHERE Id = ?`

        return new Promise((resolve, reject) => {
            connection.execute<Vehicle[]>(
                query,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res[0])
                    }
                }
            )
        })
    },

    insert(object : VehicleRow ) : Promise<number> {
        let values = [
            object.LicensePlate,
            object.Model,
            object.Manufacturer,
            object.YearManufactured,
            object.Color,
            object.Engine,
            object.Remarks
        ]

        let query ="INSERT INTO vehicle(LicensePlate, Model, Manufacturer, YearManufactured, Color, Engine, Remarks) \
        VALUES(?, ?, ?, ?, ?, ?, ?);"
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res.insertId)
                    }
                }
            )
        })
    },

    update(id : number, object : VehicleRow) : Promise<number> {
        let values = [
            object.LicensePlate,
            object.Model,
            object.Manufacturer,
            object.YearManufactured,
            object.Color,
            object.Engine,
            object.Remarks,
            id
        ]

        let query ="UPDATE vehicle SET LicensePlate = ?, Model = ?, Manufacturer = ?, YearManufactured = ?, Color = ?, Engine = ?, Remarks = ? WHERE Id=?"
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(id)
                    }
                }
            )
        })
    },

    delete(id : number) : Promise<number> {
        let query =`DELETE FROM vehicle WHERE id = ?`
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(id)
                    }
                }
            )
        })
    },

    count() : Promise<number> {
        let query = "SELECT COUNT(*) FROM vehicle"
        
        return new Promise((resolve, reject) => {
            connection.execute<QueryResult>(
                query,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res[0]['COUNT(*)'])
                    }
                }
            )
        })
    }
}