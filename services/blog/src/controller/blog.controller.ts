import { sql } from '../config/db.config.js';
import TryCatch from '../utils/tryCatch.js';

export const getAllBlogs = TryCatch(async (req, res) => {
  const {searchQuery, category} = req.query;
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

  res.status(200).json({
    success:true,
    data: blogs,
  })
});