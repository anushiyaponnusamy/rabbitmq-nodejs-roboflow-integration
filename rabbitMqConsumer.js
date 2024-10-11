const amqp = require("amqplib");
const kitchenSafetyController = require("./controllers/kitchensafetcontroller");

class QueueConsumer {
  constructor() {
    this.rabbitMQUrl = process.env.RABBITMQ_URL;
    this.safetycontroller = new kitchenSafetyController();
    this.queues = {
      safety_queue: this.handleSafetyQueueMessage,
    };
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.rabbitMQUrl);
      this.channel = await this.connection.createChannel();

      // Assert all queues
      for (const queueName in this.queues) {
        console.log("queueName", queueName);
        await this.channel.assertQueue(queueName, { durable: true });
        console.log(`Queue ${queueName} is ready for consumption.`);
      }
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ: ${error.message}`);
      throw error;
    }
  }
  async consume() {
    for (const queueName in this.queues) {
      console.log(`Waiting for messages in ${queueName}...`);
      this.channel.consume(queueName, async (msg) => {
        if (msg !== null) {
         

          try {
            const messageContent = msg.content.toString();
            const jsonMessage = JSON.parse(messageContent);
            console.log(`Received from ${queueName}: ${jsonMessage}`);
            await this.queues[queueName].call(this, jsonMessage);
            this.channel.ack(msg);
          } catch (error) {
            console.error(
              `Error processing message from ${queueName}: ${error.message}`
            );
            this.channel.ack(msg);
            this.channel.nack(msg, false, false);
          }
        }
      });
    }
  }

  async handleSafetyQueueMessage(messageContent) {
    try {
      const r = await this.safetycontroller.createPrediction({
        body: { ...messageContent },
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
    console.log(`Connection closed.`);
  }
}

module.exports = QueueConsumer;
