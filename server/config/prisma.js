import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import pgPkg from 'pg';
const { Pool } = pgPkg;

import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
