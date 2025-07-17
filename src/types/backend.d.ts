export { };

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }
    
    interface ILogin{
        user:{
            id : string;
            email: string;
            full_name: string;
            phone: string;
            role: string;
            avatar: string;
            is_staff_member: boolean;
            is_admin: boolean;
        },
        access_token: string;
        refresh_token: string;
    }

    interface IRegister{
        _id : string;
    }
}
