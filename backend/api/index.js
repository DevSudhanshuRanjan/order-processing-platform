import app from '../src/app.js';
import connectDB from '../src/database/db.js';

let dbInitialized = false;

// Initialize DB on first request, with retry on failure
const initDb = async () => {
    if (!dbInitialized) {
        try {
            await connectDB();
            dbInitialized = true;
        } catch (error) {
            dbInitialized = false;
            throw error;
        }
    }
};

export default async (req, res) => {
    try {
        await initDb();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
    return app(req, res);
};
