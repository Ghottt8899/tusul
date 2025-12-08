import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer | null = null;

export async function testDBSetup() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
}

export async function testDBClear() {
  const db = mongoose.connection.db;
  if (!db) return;
  const collections = await db.collections();
  for (const c of collections) await c.deleteMany({});
}

export async function testDBTeardown() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.connection.close().catch(() => {});
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}
