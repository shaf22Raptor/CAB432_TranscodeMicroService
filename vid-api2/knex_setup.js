// module.exports = {
//     client: 'mysql2',
//     connection: {
//         host: '127.0.0.1',
//         database: 'videoapp',
//         user: 'root',
//         password: 'root@123'
//     }
// }

// client: 'mysql2',
//         connection: {
//             host: 'n11245409-assessment2.ce2haupt2cta.ap-southeast-2.rds.amazonaws.com',
//             database: 'videoapp',
//             user: 'admin',
//             password: 'CAB432Assignment2!'
const knex = require('knex');
const retrieveDBCredentials = require('./configFiles/secrets');

module.exports = async () => {
    try {
        const dbCredentials = await retrieveDBCredentials("n11245409-rdsCredentials");

        console.log("credentials retrieved are:", dbCredentials.host, dbCredentials.username, dbCredentials.password);

        return knex({
            client: 'mysql2',
            connection: {
                host: dbCredentials.host,
                database: 'videoapp',
                user: dbCredentials.username,
                password: dbCredentials.password
            }
        })
    } catch (error) {
        console.error("Error retrieving database credentials:", error);
        throw error;
    }
}
