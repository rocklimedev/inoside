export declare class AppController {
    getHello(): {
        success: boolean;
        message: string;
        version: string;
        status: string;
        timestamp: string;
        environment: string;
    };
    healthCheck(): {
        success: boolean;
        status: string;
        uptime: number;
        timestamp: string;
        database: string;
    };
    getDocs(): void;
}
