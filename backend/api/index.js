import app from '../src/app.js';
import connectDB from '../src/database/db.js';

let dbInitialized = false;

// Initialize DB on first request
const initDb = async () => {
    if (!dbInitialized) {
        await connectDB();
        dbInitialized = true;
    }
};

export default async (req, res) => {
    await initDb();
    return app(req, res);
};
