const amqplib = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    //listen message from producer
    channel.consume(
      queueName,
      (msg) => {
        if (msg !== null) {
          console.log("Received:", msg.content.toString());
          // channel.ack(msg);
        } else {
          console.log("Consumer cancelled by server");
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(`error::`, error);
  }
};

runConsumer().catch(console.error);
