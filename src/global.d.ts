

export interface Repository<T> {
    count: (filter: Object) => Promise<number>
    create: (item: T) => Promise<void>
    remove: (id: string | number) => Promise<void>
    update: (id: string | number, item: T) => Promise<void>
    findById: (id: string | number) => Promise<T>
    find: (filter: Object) => Promise<T[]>

}

export interface UserRouterParam {
    createUser: (user: User) => Promise<void>
    deleteUser: (id: string | number) => Promise<void>
    updateUser: (id: string | number, user: User) => Promise<void>
    getUser: (id: string | number) => Promise<User>
    getUsers: (filter: Object) => Promise<User[]>

}

export interface DataSource<T> {
    count: (filter: Object) => Promise<number>

}
export interface User {
    id: string | number
    name: string
}

export interface Product {
    id: string | number
    name: string,
    unitPrice: number
}



