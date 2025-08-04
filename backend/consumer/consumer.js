import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'realtime-processor',
    brokers: ['localhost:9092'],    // ← here, use YOUR broker host:port
});

const consumer = kafka.consumer({ groupId: 'log-consumers' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'db-changes', fromBeginning: true });
    console.log('📡 Listening for database change events...');
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const payload = JSON.parse(message.value.toString());
                const log = {
                    timestamp: new Date().toISOString(),
                    event: 'DB_CHANGE',
                    topic,
                    partition,
                    payload,
                };
                console.log(JSON.stringify(log, null, 2));
            } catch (err) {
                console.error('❌ Failed to parse message:', err);
            }
        }
    });
};

run().catch(err => {
    console.error('🚨 Kafka consumer crashed:', err);
});
