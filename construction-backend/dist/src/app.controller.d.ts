export declare class AppController {
    getRoot(): {
        success: boolean;
        application: {
            name: string;
            version: string;
            environment: string;
        };
        server: {
            status: string;
            uptime_seconds: number;
            timestamp: string;
        };
        services: {
            auth: boolean;
            projects: boolean;
            inventory: boolean;
            boq: boolean;
            vendors: boolean;
            clients: boolean;
            sites: boolean;
            cdn: boolean;
        };
        urls: {
            api_docs: string;
            health: string;
            ping: string;
        };
    };
    healthCheck(): {
        success: boolean;
        health: {
            status: string;
            timestamp: string;
            uptime_seconds: number;
        };
        memory: {
            rss: number;
            heap_total: number;
            heap_used: number;
            external: number;
        };
        process: {
            pid: number;
            platform: NodeJS.Platform;
            node_version: string;
        };
        database: {
            status: string;
            engine: string;
            orm: string;
        };
    };
    ping(): {
        success: boolean;
        message: string;
        timestamp: number;
    };
    version(): {
        success: boolean;
        version: {
            api: string;
            node: string;
            environment: string;
        };
    };
    cdnStatus(): {
        success: boolean;
        cdn: {
            enabled: boolean;
            provider: string;
            domain: string;
            upload_api: string;
            storage: {
                type: string;
                path: string;
            };
        };
    };
    getDocs(): void;
    readinessCheck(): {
        success: boolean;
        ready: boolean;
        timestamp: string;
    };
    livenessCheck(): {
        success: boolean;
        live: boolean;
    };
}
