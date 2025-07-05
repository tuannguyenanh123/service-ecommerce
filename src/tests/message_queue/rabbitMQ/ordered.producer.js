"use strict";

const amqplib = require("amqplib");

const consumerOrderedMessage = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "ordered-queue-message";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    for (let i = 0; i < 10; i++) {
      const message = `ordered-queue-message::${i}`;
      console.log(message);
      await channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
    }

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.log(`consumerOrderedMessage error::`, error);
  }
};

consumerOrderedMessage().catch(err => console.error(err))
