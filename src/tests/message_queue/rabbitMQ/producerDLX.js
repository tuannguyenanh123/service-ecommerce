const amqplib = require("amqplib");
const message = "create product";

const log = console.log
console.log = function() {
  log.apply(console, [new Date()].concat(arguments))
}

const runProducerDLX = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx"; // type direction ==> success thì cho vào
    const notiQueue = "notificationQueueProcess"; // assertQueue
    const notificationExchangeDLX = "notificationExDLX"; //==> fail thì cho vào
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    // create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true, //true: server chết nó vẫn còn message trong queue
    });

    // create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép các connect khác truy cập vào cùng một vào một queue
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    const msg = 'a new product'
    console.log('producer msg::' , msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000'
    })
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(`error::`, error);
  }
};

runProducerDLX()
  .then((res) => console.log(res))
  .catch(console.error);
