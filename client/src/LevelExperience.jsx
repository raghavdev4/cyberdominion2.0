import { useMemo, useState } from 'react'

const fallbackGuide = {
  time: '20-25 min',
  objectives: ['Read the mission briefing', 'Interpret simulated evidence', 'Choose a defensive conclusion'],
  why: 'Evidence-led reasoning helps cybersecurity professionals make careful decisions without guessing.',
  terms: [['evidence', 'A fictional artifact used for investigation.'], ['indicator', 'A clue that helps describe an event.']],
  mistakes: 'Jumping to conclusions before comparing multiple pieces of evidence.',
  hints: ['Start with the file named in the task.', 'Read the evidence before selecting a conclusion.', 'Use the task prompt as your search term.'],
  quiz: [{ question: 'What is the safest first step in a simulated investigation?', options: ['Destroy evidence', 'Read and preserve evidence', 'Attack the source', 'Run host commands'], answer: 1, explanation: 'Evidence-led work starts by reading and preserving fictional artifacts.' }, { question: 'What is an indicator?', options: ['A clue about an event', 'A real exploit', 'A password', 'A shell command'], answer: 0, explanation: 'An indicator is a clue that helps describe a fictional event.' }, { question: 'What should a responder do before concluding?', options: ['Compare evidence', 'Delete logs', 'Attack a target', 'Run host commands'], answer: 0, explanation: 'Comparing evidence reduces assumptions and supports careful decisions.' }],
}

const outputs = {
  pwd: '/home/trainee/training-server',
  ls: 'access.log  controls.txt  evidence.txt  timeline.txt  traffic.txt',
  'cat evidence.txt': 'CASE-041 | training artifact | rotate the exposed demo key.',
  'grep failed access.log': '08:41:02 AUTH failed user=demo source=simulated-client',
  'cat controls.txt': 'validation: required | authentication: session-bound | output-encoding: required',
  'grep validation controls.txt': 'validation: required',
  'cat traffic.txt': '443 HTTPS normal | 4444 TCP suspicious simulated beacon',
  'grep suspicious traffic.txt': '4444 TCP suspicious simulated beacon',
  'cat timeline.txt': '09:10 alert raised | 09:15 contain the simulated host',
  'grep contain timeline.txt': '09:15 contain the simulated host',
  'cat review.txt': 'validation: required | output-encoding: required',
  'grep encoding review.txt': 'output-encoding: required',
  'cat services.txt': '443 HTTPS web | 53 DNS resolver | 22 SSH administration',
  'grep https services.txt': '443 HTTPS web',
  'cat alerts.txt': 'rule: repeated-auth-failure | rule: simulated-beacon',
  'grep beacon alerts.txt': 'rule: simulated-beacon',
  'cat response.txt': 'preserve evidence | record timeline | contain simulated host',
  'grep preserve response.txt': 'preserve evidence',
  'cat final-report.txt': 'root cause: unsafe demo credential | remediate: rotate credential',
  'grep remediate final-report.txt': 'remediate: rotate credential and validate controls',
}

function runSimulatedCommand(command) {
  const normalized = command.trim().toLowerCase().replace(/"/g, '')
  if (normalized === 'help') return 'Allowed: pwd, ls, cat <file>, grep <term> <file>'
  return outputs[normalized] || `simulator: command not available: ${command.trim() || '(empty)'}\nTry help for the safe command list.`
}

export default function LevelExperience({ level, onClose, onComplete }) {
  const guide = level.guide || fallbackGuide
  const [stage, setStage] = useState('learn')
  const [task, setTask] = useState(0)
  const [command, setCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState('SIMULATOR READY. Type help for allowed commands.')
  const [history, setHistory] = useState([])
  const [hints, setHints] = useState(0)
  const [expanded, setExpanded] = useState('terms')
  const [quizAnswers, setQuizAnswers] = useState([])
  const [quizFeedback, setQuizFeedback] = useState(null)
  const [quizPassed, setQuizPassed] = useState(false)
  const currentTask = level.tasks[task]
  const quiz = guide.quiz || fallbackGuide.quiz
  const completionPercent = stage === 'learn' ? 15 : stage === 'practice' ? 35 : stage === 'mission' ? 65 : stage === 'quiz' ? 85 : 100
  const steps = useMemo(() => ['LEARN', 'PRACTICE', 'MISSION', 'QUIZ', 'COMPLETE'], [])

  function enterMission() { setStage('mission') }
  function runCommand(event) {
    event.preventDefault()
    const value = command.trim()
    if (!value) return
    const result = runSimulatedCommand(value)
    const matches = value.toLowerCase().replace(/"/g, '') === currentTask.answer
    setHistory((items) => [...items, { command: value, result, matches }])
    setTerminalOutput(result)
    setCommand('')
    if (matches && task + 1 === level.tasks.length) setStage('quiz')
    else if (matches) setTask((value) => value + 1)
  }
  function submitQuiz(event) {
    event.preventDefault()
    const correct = quiz.reduce((total, question, index) => total + (quizAnswers[index] === question.answer ? 1 : 0), 0)
    const passed = correct === quiz.length
    setQuizFeedback({ correct, total: quiz.length })
    setQuizPassed(passed)
    if (passed) { setStage('complete'); onComplete(level.id, level.tasks.length) }
  }
  return <div className="modal-backdrop"><section className="experience-modal">
    <button className="close-button" onClick={onClose}>×</button>
    <div className="experience-heading"><div><p className="eyebrow">LEVEL {String(level.id).padStart(2, '0')} / {level.difficulty}</p><h2>{level.title}</h2><p>{level.mission}</p></div><div className="reward-chip"><strong>+{level.xp} XP</strong><span>+{level.coins || Math.round(level.xp / 2)} COINS</span></div></div>
    <div className="learning-stepper">{steps.map((item, index) => <button key={item} className={stage === item.toLowerCase() ? 'current' : index < steps.indexOf(stage.toUpperCase()) ? 'done' : ''} onClick={() => index === 0 ? setStage('learn') : null}>{index < steps.indexOf(stage.toUpperCase()) ? '✓ ' : ''}{item}</button>)}</div>
    <div className="experience-progress"><i style={{ width: `${completionPercent}%` }} /></div>
    {stage === 'learn' && <LearnStage guide={guide} expanded={expanded} setExpanded={setExpanded} onContinue={() => setStage('practice')} />}
    {stage === 'practice' && <PracticeStage guide={guide} onContinue={enterMission} />}
    {stage === 'mission' && <MissionStage level={level} task={task} history={history} hints={hints} setHints={setHints} guide={guide} terminalOutput={terminalOutput} command={command} setCommand={setCommand} runCommand={runCommand} onReset={() => { setHistory([]); setTerminalOutput('SIMULATOR RESET. Type help for the safe command list.'); setTask(0) }} />}
    {stage === 'quiz' && <QuizStage quiz={quiz} answers={quizAnswers} setAnswers={setQuizAnswers} feedback={quizFeedback} onSubmit={submitQuiz} />}
    {stage === 'complete' && <CompleteStage level={level} onClose={onClose} />}
  </section></div>
}

function LearnStage({ guide, expanded, setExpanded, onContinue }) { return <div className="stage-content"><p className="stage-label">01 / LEARN</p><h3>Build your mental model first.</h3><p className="stage-intro">This mission takes about {guide.time}. Read the short briefing, then practice one idea before entering the investigation.</p><div className="lesson-callout"><strong>WHY THIS MATTERS</strong><p>{guide.why}</p></div><div className="notes-grid"><NoteSection title="KEY TERMS" open={expanded === 'terms'} onClick={() => setExpanded(expanded === 'terms' ? '' : 'terms')}><dl>{guide.terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></NoteSection><NoteSection title="COMMON MISTAKE" open={expanded === 'mistakes'} onClick={() => setExpanded(expanded === 'mistakes' ? '' : 'mistakes')}><p>{guide.mistakes}</p></NoteSection></div><div className="objectives"><strong>LEARNING OBJECTIVES</strong>{guide.objectives.map((objective) => <span key={objective}>□ {objective}</span>)}</div><button className="primary-button" onClick={onContinue}>START PRACTICE →</button></div> }
function PracticeStage({ guide, onContinue }) { return <div className="stage-content"><p className="stage-label">02 / PRACTICE</p><h3>Try the idea safely.</h3><p className="stage-intro">Use the reference below as a quick study guide. Nothing here touches the host machine or a real target.</p><div className="practice-card"><span>QUICK REFERENCE</span>{guide.terms.map(([term, definition]) => <p key={term}><code>{term}</code> {definition}</p>)}</div><button className="primary-button" onClick={onContinue}>ENTER SIMULATED MISSION →</button></div> }
function MissionStage({ level, task, history, hints, setHints, guide, terminalOutput, command, setCommand, runCommand, onReset }) { return <div className="stage-content"><p className="stage-label">03 / MISSION</p><h3>Investigate the fictional environment.</h3><div className="task-strip"><span>TASK {task + 1} / {level.tasks.length}</span><strong>{level.tasks[task].prompt}</strong><i><b style={{ width: `${task / level.tasks.length * 100}%` }} /></i></div><div className="terminal"><div className="terminal-top"><span>● ● ●</span><small>sealed-shell / training-server</small></div><div className="terminal-output">{terminalOutput.split('\n').map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}</div><form onSubmit={runCommand} className="terminal-input"><span>trainee@cd:~$</span><input autoFocus value={command} onChange={(event) => setCommand(event.target.value)} placeholder="enter simulated command" /></form></div><div className="terminal-tools"><button type="button" onClick={() => setHints((value) => Math.min(value + 1, guide.hints.length))}>HINT {hints}/{guide.hints.length}</button><button type="button" onClick={onReset}>RESET</button><button type="button" onClick={() => navigator.clipboard?.writeText(terminalOutput)}>COPY OUTPUT</button></div>{hints > 0 && <div className="hint-box">Hint {hints}: {guide.hints[hints - 1]}</div>}<div className="command-history"><strong>COMMAND HISTORY</strong>{history.length ? history.map((item, index) => <div key={`${item.command}-${index}`}><code>{item.command}</code><span className={item.matches ? 'success' : ''}>{item.matches ? 'verified' : 'review output'}</span></div>) : <p>No commands yet. Start with the task prompt.</p>}</div></div> }
function QuizStage({ quiz, answers, setAnswers, feedback, onSubmit }) { return <form className="stage-content quiz-stage" onSubmit={onSubmit}><p className="stage-label">04 / KNOWLEDGE CHECK</p><h3>Show what you learned.</h3><p className="stage-intro">Answer every question correctly to complete the mission. You can retry without losing progress.</p>{quiz.map((question, index) => <fieldset key={question.question}><legend>{index + 1}. {question.question}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => { const next = [...answers]; next[index] = optionIndex; setAnswers(next) }} />{option}</label>)}</fieldset>)}{feedback && <div className={quizPassed ? 'quiz-feedback success' : 'quiz-feedback'}>{quizPassed ? `Correct. ${feedback.correct}/${feedback.total} verified.` : `Not quite. ${feedback.correct}/${feedback.total} correct. Review the notes and try again.`}</div>}<button className="primary-button">SUBMIT KNOWLEDGE CHECK →</button></form> }
function CompleteStage({ level, onClose }) { return <div className="complete-state"><span>✦</span><p className="eyebrow">05 / MISSION COMPLETE</p><h2>Signal secured.</h2><p>You completed the learning loop and earned {level.xp} XP plus {level.coins || Math.round(level.xp / 2)} coins.</p><button className="primary-button" onClick={onClose}>RETURN TO ARCHIVE →</button></div> }
function NoteSection({ title, open, onClick, children }) { return <article className={`note-section ${open ? 'open' : ''}`}><button type="button" onClick={onClick}><span>{title}</span><strong>{open ? '−' : '+'}</strong></button>{open && <div>{children}</div>}</article> }
