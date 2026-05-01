import { sql } from '../config/db.config.js';
import ENV from '../config/env.config.js';
import { redisClient } from '../config/redis.config.js';
import TryCatch from '../utils/tryCatch.js';
import axios from 'axios';

export const getAllBlogs = TryCatch(async (req, res) => {
  const {searchQuery = "", category = ""} = req.query;
  
  const cacheKey = `blogs:${searchQuery}:${category}`;

  const cached = await redisClient.get(cacheKey);
  if(cached){
  console.log("Serving from Redis Cache");
    res.status(200).json({
      success:true,
      data: JSON.parse(cached),
    });
    return;
  }

  let blogs;

  if(searchQuery && category){
    blogs = await sql`
      SELECT * FROM BLOGS 
      WHERE 
        (TITLE ILIKE ${"%"+searchQuery + "%"} OR DESCRIPTION ILIKE ${"%" + searchQuery + "%"}) AND
        CATEGORY ILIKE ${"%" + category + "%"}
        ORDER BY 
        CREATED_AT DESC;
    `;
  } else if(searchQuery) {
    blogs = await sql`
      SELECT * FROM BLOGS 
      WHERE 
        (TITLE ILIKE ${"%"+searchQuery + "%"} OR DESCRIPTION ILIKE ${"%" + searchQuery + "%"})
        ORDER BY 
        CREATED_AT DESC;
    `;
  } else if(category) {
    blogs = await sql`
      SELECT * FROM BLOGS 
      WHERE 
        CATEGORY ILIKE ${"%"+ category + "%"}
        ORDER BY 
        CREATED_AT DESC;
    `;
  } else {
    blogs = await sql`
      SELECT * FROM BLOGS 
      ORDER BY 
      CREATED_AT DESC;
    `;
  }

  console.log("Serving from DB");

  await redisClient.set(
    cacheKey, 
    JSON.stringify(blogs),
    {
      EX: 3600,
    }
  )

  res.status(200).json({
    success:true,
    data: blogs,
  });
});

export const getSingleBlog = TryCatch(async (req, res) => {
  const blogId = req.params.id;

  const cacheKey = `blogs:${blogId}`;
  const cachedData = await redisClient.get(cacheKey);

  if(cachedData){
    res.status(200).json({
      success: true,
      data: JSON.parse(cachedData),
    });
    return;
  }

  const blogData = await sql`
    SELECT * FROM BLOGS WHERE ID=${blogId}
  `;
  if(blogData.length < 1){
    res.status(404).json({
      success: false,
      message: "No blog found"
    })
    return;
  }

  const blog = blogData[0];
  if (!blog) {
    res.status(404).json({
      success: false,
      message: "Blog not found",
    });
    return;
  }
  
  const {data} = await axios.get(`${ENV.USER_SERVICE}/api/v1/users/user/${blog.author}`);
  const responseData = {
      blog,
      author: data,
    }

  await redisClient.set(
    cacheKey,
    JSON.stringify(responseData),
    {
      EX: 3600,
    }
  )

  res.status(200).json({
    success: true,
    data: {
      blog,
      author: data,
    }
  })
});