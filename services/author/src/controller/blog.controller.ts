import { sql } from '../config/db.config.js';
import { invalidateCacheJob } from '../config/rabbitmq.config.js';
import type { AuthenticatedRequest } from '../types/authenticatedRequest.js';
import type { IBlog } from '../types/blog.js';
import getBuffer from '../utils/dataUri.js';
import TryCatch from '../utils/tryCatch.js';
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = TryCatch(async (req:AuthenticatedRequest, res) => {
  const {title, description, blogContent, category} = req.body;

  const file = req.file;
  if(!file){
    res.status(400).json({
      success:false,
      message: "No file to upload",
    })
    return;
  }

  const fileBuffer = getBuffer(file);
  if(!fileBuffer || !fileBuffer.content){
    res.status(400).json({
      success:false,
      message: "Failed to generate buffer",
    })
    return;
  }

  const cloud = await cloudinary.uploader.upload(
    fileBuffer.content,
    {
      folder:"blogs",
    }
  );
  const result = await sql`
    INSERT INTO BLOGS (TITLE, DESCRIPTION, IMAGE, BLOG_CONTENT, CATEGORY, AUTHOR) VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogContent}, ${category}, ${req.user?._id}) RETURNING *;
  `;

  await invalidateCacheJob(["blogs:*"]);

  res.status(201).json({
    success: true,
    data: {
      blog: result[0],
    }
  });

});

export const updateBlog = TryCatch(async (req:AuthenticatedRequest, res) => {
  const {id} = req.params;

  const {title, description, blogContent, category} = req.body;

  const blogData = await sql`
    SELECT * FROM BLOGS WHERE ID=${id}
  `;

  //Check if blog exists
  if(!blogData.length){
    res.status(404).json({
      success:false,
      message: `No blog with id ${id} found`,
    })
    return;
  }
  const blog = blogData[0];

  if (!blog) {
    res.status(404).json({
      success: false,
      message: `No blog found`,
    });
    return;
  }

  //Check if the author of the post and the requester is same
  if(blog.author !== req.user?._id){
    res.status(401).json({
      success:false,
      message: `You are not the author of this blog`,
    })
    return;
  }
  
  const file = req.file;

  let imageUrl = blog.image;
  if(file){
    const fileBuffer = getBuffer(file);
    if(!fileBuffer || !fileBuffer.content){
      res.status(400).json({
        success:false,
        message: "Failed to generate buffer",
      })
      return;
    }
    const cloud = await cloudinary.uploader.upload(
      fileBuffer.content,
      {
        folder:"blogs",
      }
    );

    imageUrl = cloud.secure_url;
  }

  const updatedBlog = await sql`
    UPDATE BLOGS 
    SET TITLE=${title || blog.title}, 
        DESCRIPTION=${description || blog.description}, 
        IMAGE=${imageUrl},
        BLOG_CONTENT=${blogContent || blog.blog_content},
        CATEGORY=${category || blog.category}
    WHERE ID=${id}
    RETURNING *;
  `
  await invalidateCacheJob([`blogs:*`, `blog:${id}`]);

  res.status(201).json({
    success: true,
    data: {
      message: "Blog updated successfully",
      blog: updatedBlog[0],
    }
  })
});

export const deleteBlog = TryCatch(async (req:AuthenticatedRequest, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid blog ID",
    });
    return;
  }

  const blogData = await sql`
    SELECT * FROM BLOGS WHERE ID=${id};
  `;

  if(!blogData.length){
    res.status(404).json({
      success: false,
      message: `No blog found for id=${id}`,
    });
    return;
  }

  const blog = blogData[0];
  if (!blog) {
    res.status(404).json({
      success: false,
      message: `No blog found`,
    });
    return;
  }
  if(blog.author !== req.user?._id){
    res.status(401).json({
      success: false,
      message: `You are not author of this blog`,
    });
    return;
  }

  await sql`
    DELETE FROM SAVED_BLOGS WHERE BLOG_ID=${id};
  `;
  await sql`
    DELETE FROM COMMENTS WHERE BLOG_ID=${id};
  `;
  await sql`
    DELETE FROM BLOGS WHERE ID=${id};
  `;

  await invalidateCacheJob([`blogs:*`, `blog:${id}`]);

  res.status(201).json({
    success:true,
    data: {
      message: `Blog id=${id} is deleted`,
    }
  })
});