
const _config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    webtoken: process.env.JWT_SECRET,
    client: process.env.CLIENT_URL,
    database: {
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        name: process.env.DB_DATABASE_DEV,
        host: process.env.DB_HOST_DEV,        
        dialect: process.env.DB_DIALECT,
    },
};
export const CONFIG = Object.freeze(_config);
 
