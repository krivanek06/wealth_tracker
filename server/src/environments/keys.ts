const IS_PROD = process.env.NODE_ENV === 'production';

// Login
const PROD_LOGIN_REDIRECT = 'https://spendmindful.com/dashboard';

// Google OAuth
const PROD_GOOGLE_CALLBACK = 'https://spend-mindful-graphql-6bhi5d4fdq-ew.a.run.app/auth/google/callback';
const PROD_GOOGLE_CLIENT_ID = '921790580233-19h25nmct0jq94r1qfv2r7kfv3jr7q7n.apps.googleusercontent.com';
const PROD_GOOGLE_CLIENT_SECRET = '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';

const PROD_PORT = 8080;

// DEVELOPMENT -----------------------
// DEVELOPMENT -----------------------
// DEVELOPMENT -----------------------

const DEV_GOOGLE_CALLBACK = 'http://localhost:3000/auth/google/callback';
const DEV_GOOGLE_CLIENT_ID = '921790580233-r0jbl55966m3am0lbhermga39gfleee4.apps.googleusercontent.com';
const DEV_GOOGLE_CLIENT_SECRET = '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';

const DEV_LOGIN_REDIRECT = 'http://localhost:4200/dashboard';

const DEV_PORT = 3000;

// EXPORTED VARIABLES -----------------------
// EXPORTED VARIABLES -----------------------
// EXPORTED VARIABLES -----------------------

export const GOOGLE_CALLBACK = IS_PROD ? PROD_GOOGLE_CALLBACK : DEV_GOOGLE_CALLBACK;
export const GOOGLE_CLIENT_ID = IS_PROD ? PROD_GOOGLE_CLIENT_ID : DEV_GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = IS_PROD ? PROD_GOOGLE_CLIENT_SECRET : DEV_GOOGLE_CLIENT_SECRET;
export const LOGIN_REDIRECT = IS_PROD ? PROD_LOGIN_REDIRECT : DEV_LOGIN_REDIRECT;
export const PORT = IS_PROD ? PROD_PORT : DEV_PORT;

// Google GCP
export const GOOGLE_BUCKET = 'frequently_accessible_assets';
export const GOOGLE_BUCKET_TAG_IMAGES = 'personal-account-tags';
export const GOOGLE_BUCKET_INVESTMENT_ACCOUNT = 'investment-account';

// Password hashing
export const CRYPTO_TEST_ENCRYPT = 'Lamp19';

// API KEYS
export const FINANCIAL_MODELING_API_KEY = '';

// Sendgrid for emails
export const SENDGRID_API_KEY = '';
export const SENDGRID_EMAIL_ADDRESS = '';

// JWT token
export const JWT_SECRET = 'BUCHA_1998_SLOV_9881';
export const JWT_EXPIRES_IN = 90;

// Google authenticaion - testing LOCAL_HOST
export const GOOGLE_STORAGE_SERVICE_ACCOUNT = {
	type: '',
	project_id: '',
	private_key_id: '',
	private_key: '',
	client_email: '',
	client_id: '',
	auth_uri: '',
	token_uri: '',
	auth_provider_x509_cert_url: '',
	client_x509_cert_url: '',
};
