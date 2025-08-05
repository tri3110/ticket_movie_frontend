export { };

declare global {
    
    interface OptionType{ 
        label: string; 
        value: number 
    };

    interface Cinema {
        id: number;
        name: string;
        address: string;
        phone: string;
        opening_hours: string;
        city: number;
    }

    interface Movie {
        id: number;
        title: string;
        status: string;
        duration: number;
        poster_url: string;
        rating: string;
        movie_cast: string;
        description: string;
        director: string;
        genre: string;
        release_date: string;
        trailer_url: string;
    }

    interface City {
        id: number;
        name: string;
        country: string;
    }

    interface Showtimes {
        showtime_id: number,
        duration: string,
        start_time: string,
        end_time: string,
        base_price: number,
    }

    interface ScreenType{
        id: number,
        name: string,
        type: string,
        capacity: number,
        cinema: Cinema
    }

    interface ScreenShowTime{
        screen_id: number,
        screen_name: string,
        screen_type: string,
        showtimes: Showtimes[]
    }

    interface MovieSchedule {
        movie: Movie,
        screens: ScreenShowTime[],
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
        is_booking: boolean,
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
