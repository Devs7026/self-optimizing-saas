const { Kafka } = require("kafkajs");
const { Client } = require("pg");

// Kafka setup
const kafka = new Kafka({
  clientId: "event-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

// Postgres setup
const db = new Client({
  user: "admin",
  password: "admin",
  host: "localhost",
  port: 5433,
  database: "saas",
});

async function run() {
  // Connect to DB
  await db.connect();
  console.log("Connected to Postgres");

  // Connect to Kafka
  await consumer.connect();
  await consumer.subscribe({ topic: "user-events", fromBeginning: true });

  console.log("Consumer started...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());

      // Insert into DB
      await db.query(
        "INSERT INTO events(user_id, event_type, timestamp, latency) VALUES($1,$2,$3,$4)",
        [event.user_id, event.event_type, event.timestamp, event.latency]
      );

      console.log("Stored event:", event);
    },
  });
}

run().catch(console.error);
