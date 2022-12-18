import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as session from 'express-session';
import session from 'express-session';
import passport from 'passport';
//import * as passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(
		session({
			secret: 'asiodasjoddjdoasddasoidjasiodasdjaiodd',
			saveUninitialized: false,
			resave: false,
			cookie: {
				maxAge: 60000,
			},
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(3000);
}
bootstrap();
