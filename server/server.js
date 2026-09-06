import 'dotenv/config'
import app from './app.js'
import { initStore } from './db/store.js'
const port = Number(process.env.PORT || 4000)
const storage = await initStore()
app.listen(port, () => console.log(`Cyber Dominion API listening on http://localhost:${port} (${storage ? 'mysql' : 'memory'} storage)`))
