"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = 8000;
const MONGO_URI = 'mongodb://localhost:27017/octofit';
// Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(express_1.default.json());
// MongoDB connection
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB on port 27017'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
// Health check route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'OctoFit Tracker API is running' });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map