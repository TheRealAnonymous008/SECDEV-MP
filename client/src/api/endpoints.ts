export const ENDPOINTS = {
    handshake: 'authz/handshake',
    login: 'authz/login',
    register: 'authz/register',
    refreshToken: 'authz/refresh',
    logout: 'authz/logout',

    orderTypes: '/types',
    orderStatuses: '/statuses',
    userRoles: '/roles',

    users: 'user/all',
    uploadImage: 'user/upload',

    customers: 'customer/all',
    getCustomer: 'customer/id',
    addCustomer: 'customer/create',
    updateCustomer: 'customer/update',
    deleteCustomer: 'customer/delete',
    filterCustomer: 'customer/filter',

    vehicles: 'vehicle/all',
    getVehicle: 'vehicle/id',
    addVehicle: 'vehicle/create',
    updateVehicle: 'vehicle/update',
    deleteVehicle: 'vehicle/delete',
    filterVehicle: 'vehicle/filter',
    countVehicle: 'vehicle/count',

    orders: 'order/all',
    getOrder: "order/id",
    addOrder: "order/create",
    updateOrder: "order/update",
    deleteOrder: "order/delete",
    filterOrder: 'order/filter',
    verifyOrder: 'order/verify',

    getUser: "user/id",
    getUserView: 'user/view',
    addUser: "user/create",
    updateUser: "user/update",
    deleteUser: "user/delete",
    filterUser: 'user/filter',

    expenses: 'expenses/all',
    getExpense: 'expenses/id',
    addExpense: 'expenses/create',
    updateExpense: 'expenses/update',
    deleteExpense: 'expenses/delete',
    filterExpense: 'expenses/filter',

}