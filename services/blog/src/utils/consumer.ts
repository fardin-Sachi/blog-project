import amqp from 'amqplib';
import { redisClient } from '../config/redis.config.js';
import { sql } from '../config/db.config.js';

interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "password",
    });

    const channel:amqp.Channel = await connection.createChannel();

    const queueName = "cache-invalidation";

    await channel.assertQueue(
      queueName,
      {
        durable: true,
      }
    );
    console.log("Blog service cache consumer started");

    channel.consume(queueName, async (msg) => {
      if(msg){
        try {
          const content = JSON.parse(msg.content.toString()) as CacheInvalidationMessage;

          console.log("Blog Service received cache invalidation message: ", content);

          if(content.action === "invalidateCache"){
            for(const pattern of content.keys){
              const keys = await redisClient.keys(pattern);
              if(keys.length > 0){
                await redisClient.del(keys);

                console.log(`Blog Service invalidated ${keys.length} cache keys matching: ${pattern}`);

                const searchQuery = "";
                const category = "";

                const cacheKey = `blogs:${searchQuery}:${category}`;

                const blogs = await sql`
                  SELECT * from BLOGS ORDER BY CREATED_AT DESC;
                `;

                await redisClient.set(
                  cacheKey,
                  JSON.stringify(blogs),
                  {
                    EX: 3600,
                  }
                );
                console.log("Cache rebuilt with key: ", cacheKey);
              }
            }
          }

          channel.ack(msg);
        } catch (error) {
          console.error(`Error in processing cache invalidation in Blog Service: ${error}`);

          channel.nack(msg, false, true);
        }
      }
    })
  } catch (error) {
    console.error(`Failed to start RabbitMQ consumer. Error: ${error}`);
  }
}