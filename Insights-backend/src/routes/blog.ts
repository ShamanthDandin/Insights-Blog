import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {verify } from 'hono/jwt'
import { createBlogInput, CreateBlogInput, updateBlogInput, UpdateBlogInput} from '@sampi019/insights-common'



export const blogRouter  = new Hono<{
	Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string

	}
    Variables : {
        userId : string;
    }
}>();


blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("Authorization") || "";
    // const token = header.split(" ")[1]
    try{
        const user = await verify(header,c.env.JWT_SECRET);
        if(user){
            c.set("userId", user.id as string);
            await next();
          } 
          else {
            c.status(403)
            return c.json({error : "unauthorized"});
    }
    }
    catch(e){
        c.status(403);
        return c.json({
            message:"Not valid token"
        })
    }
   
  
  })


blogRouter.post('/', async (c) =>  {
    const body = await c.req.json();
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const authid = c.get("userId");
    const {success} = createBlogInput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message: "Inputs are invalid"
		})
	}

    const blog = await prisma.blog.create({
        data:{
            title:body.title,
            content: body.content,
            authorId: Number(authid)
        }
    })
    return c.json({
        id:blog.id
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const {success} = updateBlogInput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			message: "Inputs are invalid"
		})
	}
    const blog =  await prisma.blog.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content,
        }
    })
    return c.json({
        blog
    })
})


blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
        select:{
            content:true,
            title:true,
            id:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });
    return c.json({
        blogs
    })
  })
  
  blogRouter.get('/:id',  async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    try{
    const blog = await  prisma.blog.findFirst({
        where:{
            id:Number(id)
        },
        select :{
            title:true,
            content:true,
            author:{
                select:{
                    name: true,
                }
            }
        }
    })
    return c.json({
        blog
    })
    }
catch(e){
    c.status(411);
    return c.json({
        message:"Error while fetching"
    })
}
  })
  
 
  