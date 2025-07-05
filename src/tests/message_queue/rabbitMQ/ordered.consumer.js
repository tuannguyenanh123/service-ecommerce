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

    //set prefetch to 1 to ensure only one ack at a time
    channel.prefetch(1)

    channel.consume(
      queueName,
      (msg) => {
        setTimeout(() => {
          console.log("Received:", msg.content.toString());
          channel.ack(msg);
        }, Math.random() * 1000);
      }
    );
  } catch (error) {
    console.log(`error::`, error);
  }
};

consumerOrderedMessage().catch(console.error);
