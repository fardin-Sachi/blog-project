import amqp from 'amqplib';

let channel:amqp.Channel;

export const connectRabbitMq = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "password",
    });

    channel = await connection.createChannel();
    console.log("RabbitMQ is connected");
  } catch (error) {
    console.error(`Connection failed to RabbitMQ. Error: ${error}`);
  }
}

export const publishToQueue = async (queueName:string, message:any) => {
  if(!channel){
    console.error(`RabbitMQ channel is not initialized`);
    return;
  }

  await channel.assertQueue(
    queueName,
    {
      durable: true,
    }
  );

  channel.sendToQueue(
    queueName, 
    Buffer.from(JSON.stringify(message)), 
    {
      persistent: true,
    }
  )
}

export const invalidateCacheJob = async (cacheKeys: string[]) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    }

    await publishToQueue("cache-invalidation", message);
    console.log("Cache invalidation job published to RabbitMQ");
  } catch (error) {
    console.error(`Failed to Publish cache on RabbitMQ. Error: ${error}`);
  }
}