const amqplib = require("amqplib");
const message = "hello microservice, i learning rabbitMQ";

const runProducer = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    //send message to cusumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`message sent::`, message);
  } catch (error) {
    console.log(`error::`, error);
  }
};

runProducer().catch(console.error);
