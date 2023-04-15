import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as session from 'express-session';
import session from 'express-session';
import passport from 'passport';
import { PORT } from './environments';
//import * as passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			credentials: true,
			origin: true,
		},
	});
	app.use(
		session({
			secret: 'TEST_SECRET',
			saveUninitialized: false,
			resave: false,
			cookie: {
				maxAge: 60000,
			},
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	// check if the port is set in the environment variables
	const port = PORT;

	await app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
}
bootstrap();
