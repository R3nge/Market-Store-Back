import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        __filename:path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true
};
