export { };

declare global {
    interface Cinema {
        id: number;
        name: string;
        address: string;
        phone: string;
        opening_hours: string;
        city: number;
    }

    interface MovieSchedule{
        showtime_id: number,
        movie_id: number,
        movie_poster_url: string,
        movie_title: string,
        movie_genre: string,
        duration: string,
        start_time: string,
        end_time: string,
        base_price: number,
        screen_id: number,
        screen_name: string,
        screen_type: string,
    }

    interface SeatsScreen {
        id: number,
        screen_id: number,
        row: string,
        number: number,
        type: string,
        is_active: boolean,
        seat_name: string,
        seat_name_couple: string,
    }

    interface DataSeatsScreen{
        data: (SeatsScreen | false)[][],
        max_number: number,
        max_row: number,
    }

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
