const http = require('http');
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database successfully.');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma disconnected on app termination');
  process.exit(0);
});
