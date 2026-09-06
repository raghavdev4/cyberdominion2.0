const responses = {
  pwd: '/home/trainee/training-server',
  ls: 'access.log  controls.txt  evidence.txt  timeline.txt  traffic.txt',
  'cat evidence.txt': 'CASE-041\nStatus: training artifact\nNote: rotate the exposed demo key.',
  'grep failed access.log': '08:41:02 AUTH failed user=demo source=simulated-client\n08:41:08 AUTH failed user=demo source=simulated-client',
  'cat controls.txt': 'validation: required\nauthentication: session-bound\noutput-encoding: required',
  'grep validation controls.txt': 'validation: required',
  'cat traffic.txt': '443 HTTPS normal\n22 SSH normal\n4444 TCP suspicious simulated beacon',
  'grep suspicious traffic.txt': '4444 TCP suspicious simulated beacon',
  'cat timeline.txt': '09:10 alert raised\n09:12 evidence preserved\n09:15 contain the simulated host',
  'grep contain timeline.txt': '09:15 contain the simulated host',
  'cat review.txt': 'validation: required\noutput-encoding: required\nauthentication: session-bound',
  'grep encoding review.txt': 'output-encoding: required',
  'cat services.txt': '443 HTTPS web\n53 DNS resolver\n22 SSH administration',
  'grep https services.txt': '443 HTTPS web',
  'cat alerts.txt': 'rule: repeated-auth-failure\nrule: simulated-beacon\nseverity: review',
  'grep beacon alerts.txt': 'rule: simulated-beacon',
  'cat response.txt': 'preserve evidence\nrecord timeline\ncontain simulated host',
  'grep preserve response.txt': 'preserve evidence',
  'cat final-report.txt': 'root cause: unsafe demo credential\nremediate: rotate credential and validate controls',
  'grep remediate final-report.txt': 'remediate: rotate credential and validate controls',
}
export function runCommand(raw) {
  const command = raw.trim().toLowerCase().replace(/"/g, '')
  if (responses[command]) return responses[command]
  if (command === 'help') return 'Available: pwd, ls, cat <file>, grep <term> <file>'
  return `simulator: command not available: ${raw.trim()}\nTry help for the safe command list.`
}
