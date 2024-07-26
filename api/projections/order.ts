import Customer from "../models/customer";
import Vehicle from "../models/vehicle";
import { CustomerRepository } from "../repository/customer";
import { StatusEnumRepository, TypeEnumRepository } from "../repository/enums";
import { VehicleRepository } from "../repository/vehicle";
import { makeCustomerView } from "./customer";
import { makeVehicleView } from "./vehicle";

export const makeOrderView = async (document) => {
    if (document == null)
        return {};
    
    const order = {
        id: document.ID,
        isVerified: document.IsVerified,
        status: document.Status,
        timeIn: document.TimeIn,
        timeOut: document.TimeOut,
        customer: await retrieveCustomer(document.CustomerId),
        type: document.Type,
        vehicle: await retrieveVehicle(document.VehicleId),
        estimateNumber: document.EstimateNumber,
        scopeOfWork: document.ScopeOfWork,
        // expenses: document.expenses.map((value) => {
        //     return makeExpenseView(value)
        // }),
    };
    console.log(order)
    return order;
}

export const makeOrderArrayView = async (documents) => {
    return Promise.all(documents.map(async (val) => {
        const v = await makeOrderView(val)
        return v
    }));
}

const retrieveCustomer = async (id : number) : Promise<Customer | null> => {
    try {
        return CustomerRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    return null
                }
                const view = makeCustomerView(result)
                return view
            })
            .catch((err) => {
                console.log(err);
                return null
            })
    } catch (error) {
        console.log(error)
        return null
    }
}


const retrieveVehicle = async (id : number) : Promise<Vehicle | null> => {
    try {
        return VehicleRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    return null
                }
                const view = makeVehicleView(result)
                return view
            })
            .catch((err) => {
                console.log(err);
                return null
            })
    } catch (error) {
        console.log(error)
        return null
    }
}


const makeExpenseView = (expense) => {
    return {
        dateRecorded: expense.dateRecorded,
        description: expense.description,
        amount: parseFloat(expense.amount)
    };
}

