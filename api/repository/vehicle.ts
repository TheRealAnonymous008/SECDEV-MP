import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Vehicle, { VehicleRow } from "../models/vehicle";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";

const tableName = "vehicle"
export const VehicleRepository = {
    retrieveAll(limit : number = LIMIT_MAX, offset? : number) : Promise<Vehicle[]> {
        let qv = queryBuilder.select(tableName)
        queryBuilder.limit(qv, limit),
        queryBuilder.skip(qv, offset)

        return new Promise((resolve, reject) => {
            connection.execute<Vehicle[]>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.select(tableName)
        queryBuilder.where(qv, {"Id": id})

        return new Promise((resolve, reject) => {
            connection.execute<Vehicle[]>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.insert(tableName, {
            "LicensePlate": object.LicensePlate,
            "Model": object.Model,
            "Manufacturer": object.Manufacturer,
            "YearManufactured": object.YearManufactured,
            "Color": object.Color,
            "Engine": object.Engine,
            "Remarks": object.Remarks
        })
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.update(tableName, {
            "LicensePlate": object.LicensePlate,
            "Model": object.Model,
            "Manufacturer": object.Manufacturer,
            "YearManufactured": object.YearManufactured,
            "Color": object.Color,
            "Engine": object.Engine,
            "Remarks": object.Remarks
        })

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.delete(tableName)
        queryBuilder.where(qv, {"id" : id})

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.count(tableName)

        return new Promise((resolve, reject) => {
            connection.execute<QueryResult>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res[0]['COUNT(*)'])
                    }
                }
            )
        })
    },

    filter(query : any) : Promise<Vehicle[]> {
        let qv = makeSQLQuery(query)

        return new Promise((resolve, reject) => {
            connection.execute<Vehicle[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res)
                    }
                }
            )
        })
    }
}

export interface VehicleQuery {
    licensePlate: string,
    model: string,
    manufacturer: string,
    yearManufactured: number,
    color: string,
    engine: string,
    remarks: string,
    limit: number ,
    skip: number 
}

export const makeSQLQuery = (query: VehicleQuery): QueryValuePair => {
    let qv = queryBuilder.select(tableName)
    queryBuilder.filter(qv, {
        "LicensePlate": query.licensePlate,
        "Model": query.model,
        "Manufacturer": query.manufacturer,
        "YearManufactured": query.yearManufactured,
        "Color": query.color,
        "Engine": query.engine,
        "Remarks": query.remarks
    })
    queryBuilder.limit(qv, query.limit)
    queryBuilder.skip(qv, query.skip)

    return qv;
}