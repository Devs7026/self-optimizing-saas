const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "event-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function sendEvent(event) {
  await producer.connect();
  await producer.send({
    topic: "user-events",
    messages: [{ value: JSON.stringify(event) }],
  });
}

module.exports = { sendEvent };
