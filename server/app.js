import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { achievements, createUser, findUserByEmail, findUserById, getProgress, levels, saveProgress, usingDatabase } from './db/store.js'
import { requireAuth } from './middleware/auth.js'
import { runCommand } from './services/simulator.js'

const app = express()
app.use(cors())
app.use(express.json())
const tokenFor = (user) => jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'development-secret', { expiresIn: '7d' })
const publicUser = (user) => ({ id: user.id, username: user.username, email: user.email })

app.get('/api/health', (req, res) => res.json({ status: 'ok', storage: usingDatabase() ? 'mysql' : 'memory' }))
app.post('/api/auth/register', async (req, res, next) => { try { const { username, email, password } = req.body; if (!username || !email || !password || password.length < 8) return res.status(400).json({ error: 'Username, email, and an 8-character password are required' }); if (await findUserByEmail(email.toLowerCase())) return res.status(409).json({ error: 'Email is already registered' }); const user = await createUser({ username: username.trim(), email: email.toLowerCase().trim(), password }); res.status(201).json({ user: publicUser(user), token: tokenFor(user) }) } catch (error) { next(error) } })
app.post('/api/auth/login', async (req, res, next) => { try { const user = await findUserByEmail(req.body.email?.toLowerCase()); if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) return res.status(401).json({ error: 'Invalid email or password' }); res.json({ user: publicUser(user), token: tokenFor(user) }) } catch (error) { next(error) } })
app.get('/api/auth/me', requireAuth, async (req, res, next) => { try { const user = await findUserById(req.user.id); if (!user) return res.status(404).json({ error: 'User not found' }); res.json({ user: publicUser(user) }) } catch (error) { next(error) } })
app.get('/api/levels', requireAuth, (req, res) => res.json({ levels }))
app.get('/api/levels/:id', requireAuth, (req, res) => { const level = levels.find((item) => item.id === Number(req.params.id)); if (!level) return res.status(404).json({ error: 'Level not found' }); res.json({ level }) })
app.get('/api/labs/:id', requireAuth, (req, res) => { const level = levels.find((item) => item.id === Number(req.params.id)); if (!level) return res.status(404).json({ error: 'Lab not found' }); res.json({ lab: level }) })
app.get('/api/levels/:id/quiz', requireAuth, (req, res) => { const level = levels.find((item) => item.id === Number(req.params.id)); if (!level) return res.status(404).json({ error: 'Level not found' }); res.json({ quiz: level.guide.quiz.map(({ answer, ...question }) => question) }) })
app.post('/api/levels/:id/quiz/submit', requireAuth, (req, res) => { const level = levels.find((item) => item.id === Number(req.params.id)); if (!level) return res.status(404).json({ error: 'Level not found' }); const answers = Array.isArray(req.body.answers) ? req.body.answers : []; const correct = level.guide.quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0); res.json({ correct, total: level.guide.quiz.length, passed: correct === level.guide.quiz.length, explanations: level.guide.quiz.map((question) => question.explanation) }) })
app.get('/api/progress', requireAuth, async (req, res, next) => { try { res.json({ progress: await getProgress(req.user.id) }) } catch (error) { next(error) } })
app.post('/api/progress', requireAuth, async (req, res, next) => { try { const levelId = Number(req.body.levelId); const tasksCompleted = Number(req.body.tasksCompleted); const level = levels.find((item) => item.id === levelId); const current = await getProgress(req.user.id); const previous = current.find((item) => item.level_id === levelId - 1); if (!level || tasksCompleted < 0 || tasksCompleted > level.tasks.length) return res.status(400).json({ error: 'Invalid progress payload' }); if (levelId > 1 && !previous?.completed) return res.status(403).json({ error: 'Complete the previous level first' }); const progress = await saveProgress(req.user.id, levelId, tasksCompleted, tasksCompleted === level.tasks.length); res.json({ progress }) } catch (error) { next(error) } })
app.get('/api/achievements', requireAuth, (req, res) => res.json({ achievements }))
app.post('/api/simulate/command', requireAuth, (req, res) => res.json({ output: runCommand(req.body.command || '') }))
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ error: 'Unexpected server error' }) })
export default app
