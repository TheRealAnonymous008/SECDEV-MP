export default interface IRepository<T> {
    retrieveAll: (limit? : number, offset? : number) => Promise<T[]>;
    retrieveById : (id :  number) => Promise<T | undefined>;
    insert : (object) => Promise<number>;
    update(id : number, object) : Promise<number>, 
    delete(id : number) : Promise<number>,
    count() : Promise<number>,
    filter(query) : Promise<T[]>
};