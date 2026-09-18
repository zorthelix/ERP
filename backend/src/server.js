import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT || 5000);
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured before starting the API.');
app.listen(port, () => console.log(`Store Manager API listening on http://localhost:${port}`));

