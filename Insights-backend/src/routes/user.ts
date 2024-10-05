import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { signupInput , singinInput} from "@sampi019/insights-common"


export const userRouter  = new Hono<{
	Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
	}
}>();

userRouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success} = signupInput.safeParse(body);

	if(!success){
		c.status(411);
		return c.json({
			message: "Inputs are invalid"
		})
	}
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name:body.name
			}
		});
		const token = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt : token });
	} catch(e) {
		c.status(403);
		return c.json({ error: "Error while signing up", "ec" : e });
	}
})


userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success} = singinInput.safeParse(body);

	if(!success){
		c.status(411);
		return c.json({
			message: "Inputs are invalid"
		})
	}
	try{
	const user = await prisma.user.findFirst({
		where: {
			email: body.email,
			password:body.password
		}
	});
	if(!user){
		c.status(403);
	return c.json({ error: "Invalid Creds" });
	}
	const jwt = await sign({id: user!.id}, c.env.JWT_SECRET);
	return c.json({ jwt });
	}
	catch(e){
	c.status(403);
	return c.json({ error: "Error while signing up" });
}

})