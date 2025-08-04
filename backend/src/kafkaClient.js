import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'sre-app',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'sre-group' });
