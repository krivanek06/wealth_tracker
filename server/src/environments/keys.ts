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
export const FINANCIAL_MODELING_API_KEY = 'f12e9d44e3170501b45157946e3b58d2';

// Sendgrid for emails
export const SENDGRID_API_KEY = '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';
export const SENDGRID_EMAIL_ADDRESS = 'krivaneda@gmail.com';

// JWT token
export const JWT_SECRET = 'BUCHA_1998_SLOV_9881';
export const JWT_EXPIRES_IN = 90;

// Google authenticaion - testing LOCAL_HOST
export const GOOGLE_STORAGE_SERVICE_ACCOUNT = {
	type: 'service_account',
	project_id: 'wealth-tracker-364707',
	private_key_id: 'afcb02a40ba17889218ef6fad8da986de03c023f',
	private_key:
		'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8asO/EOGTlBNo\n8jcGWEpX7nUoEeaOSKXkOKTxlciW0BsWSXh7LNTZssTQ27VhUDglknTkUSDJzRWA\nbzFaptp4hAyV4KAcsGaiOCiQotmo+4DG6iXoSWSIbQroalfQLPqGR3+Sj5iieGeg\nu3C5iKQ4SregpgCE2UYbFnti+Klj2TqtxScvXoySMyYjCvx/bmgkyPurES9nF8aA\nx2nwNohPcpa8bLFuEyPhbcF5zqlMVzfqzMayiuJo2w1qTOcLo3BoswJLdsDDSIPG\n6Z9tXE8roga5RHu76M1n5wAO2Bfd/eRHh/+tkFXmiNZhigZy2Vlscj8PWmWfR/6b\nqLbwjDXLAgMBAAECggEAQp8pqbSJXopcNp52kFrFpsPdTxbNRAAyEDlrMTT6IUFi\nYoYGAN/AP12zs/oL72XTBI39oQGCq3hFow0uEVSwKS7f2Fr9okdJcxCSX1oFxndv\neGYwkyroTkjoM3fupuBQkQxU8nityrzyP2YnnKLRFkptFXO8+TxuSoOvizZLhs8c\nRHgbhGuR/dXXbGeDYH7y1oikLOL9icHB+1BdKyOG6Tl5GSDZGokb0fYpq+AZzNJk\n3alrfndsQY60AkH80KXnFBZFjFACckFm2fJbx+dSDrFB0B3MRbKL+Zrmbbm3Tf6l\nLJI/l+f0PBT5kj1NpWuLOm0wDvaHGtnNEo4k5y9hYQKBgQDjdky89qPJ3+MpDIsr\n5O89hD5yBq7329KHhYDy0ir5TRG+qRiOZYBfRuP7K6nNEGLfWM8P9tlyI2BYBQDx\nmpbIPN30C/GJDb92zwSaN4kifW2QYF/ak/lLh3rRg1OXcpLh6Isev8r6gnvcbnA/\nihQT7jaSGclGLeb8M3O2/pFWOwKBgQDUDmc8iPckB7il9G4TQ1c3NGeNz+tdcG7o\njrK8JYniaI0Ho4IRsitzB4JjVOskOwY8LZFN9iJsOnGIdJ6R6Lp3vWNcR7NG0acL\nAlT/y04qPSdukNdTAGvWdBJYL8G8mP/4P9GPaKT5xrCoVy4PqLdM6tAUiZVuN5/e\nnuwPaGpVsQKBgCv4iXsZ/q2evy4HQ7wXhHwS3XNzgU1ezELwdu353N7WnDCMRbf5\nPSit7pJ2bVu76DEe3OBMKtrapdw+E2GhLbbFtW5hBK8m3jVcbZpWVAc70ftP9het\n9Uo5hW+NAJLNTkGnj4VBND7bDJCfNMnDqn/z087Id1U+uGFWnO7qJTRTAoGBAJoW\nATP+fj6DEcwdCaMbqpMllB16uJbD7QM1NXD7ge6vc9LaH9hF88Z47WjKOrav4P73\nSX8x259y9C5oNxTk3CHHzxwtyXorO0sHncXk795HY5C21I+uXa2N2AqWYRtuvYig\nruCa9E2+73zTJFgii1brxNk3hAp7hsJYDkW/5IxxAoGAbLr6na/fAlCWCZEVFVH2\njVgurT1oCj+ObalETgwG5aweaYRA8qCqZCctRmr2RwYuTPymzWgeO3bqprmL3vb3\nKq5zJpu9TamtGSLFVob20GRJKTPp1civcpudPkem0Cn9k5XGK51wza4zURkXNZZr\nI29YCPVeX6bqDCbiv+Da0vA=\n-----END PRIVATE KEY-----\n',
	client_email: 'bucket-manager@wealth-tracker-364707.iam.gserviceaccount.com',
	client_id: '116908035976665487967',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/bucket-manager%40wealth-tracker-364707.iam.gserviceaccount.com',
};
