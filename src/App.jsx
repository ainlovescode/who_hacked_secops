import { useState, useRef, useEffect } from 'react'
import './App.css'

const GAME_DATA = {
  files: {
    'README.txt': `=== SECOPS MAINFRAME - INVESTIGATION TERMINAL ===
Access Level: RESTRICTED
Case: Unauthorized Access - Incident Report

You have been granted access to this terminal to investigate
the breach that occurred on the restaurant's private network.

Your mission: Find the camera log of the attack and identify
the perpetrators and their motivations.

Type "help" for available commands.`,

    'messages/investor_email.txt': `FROM: Marcus Chen <marcus.chen@venturecap.com>
TO: Chef Antonio <antonio@beltramis.kitchen>
DATE: 2024-11-15
SUBJECT: Investment Terms

Antonio,

I've reviewed the books. The restaurant is profitable, but your
"custom operating system" project is bleeding money. 

My partners want out. I'm offering you 6 months to buy us out
at $500K, or we'll foreclose on the property.

This is non-negotiable.

- Marcus`,

    'messages/threatening_letter.txt': `FROM: Unknown <anonymous@relay.com>
TO: Chef Antonio <antonio@beltramis.kitchen>
DATE: 2024-12-01
SUBJECT: PAY UP

Chef,

We know about your secret project. The OS you've built contains
proprietary code that belongs to us.

$200,000. Wire to account #8842-CY. You have 48 hours.

Don't contact police. We watch everything.`,

    'messages/ex_partner.txt': `FROM: Sofia Martinez <sofia.m@gmail.com>
TO: Chef Antonio <antonio@beltramis.kitchen>
DATE: 2024-12-10
SUBJECT: Our conversation

Antonio,

I can't believe you chose that kitchen robot project over us.
After everything I helped you build!

When I left, I took more than just my clothes. Enjoy your
"legacy" while it lasts.

- S`,

    'camera_logs/lobby_001.txt': `=== CAMERA LOG: MAIN LOBBY ===
Timestamp: 2024-12-14 23:47:00

[23:47:12] Front door remains locked. No movement detected.
[23:52:33] Network alert triggered. Unknown device connected.
[23:53:01] SYSTEM: Unauthorized root access detected.
[23:53:15] Kitchen cameras offline - signal interrupted.
[23:54:22] Front door access panel: Override code entered.
[23:54:45] THREE MASKED INDIVIDUALS enter the premises.
[23:55:10] They head directly toward the server room.
[24:00:00] Audio pickup: "Where is the drive? We need the OS."
[24:00:45] Response: "In the vault. The code is encrypted."
[24:01:30] Sound of struggle. Impact detected.
[24:03:15] Chef Antonio's biometric signature detected leaving building.
[24:05:00] Masked individuals exit with a secure drive container.
[24:07:00] ALERT: All systems wiped remotely.`,

    'camera_logs/kitchen_002.txt': `=== CAMERA LOG: KITCHEN AREA ===
Timestamp: 2024-12-14 23:50:00

[23:50:15] Kitchen rob ots in standby mode.
[23:51:02] Manual override detected on cooking station 7.
[23:51:30] Chef Antonio's voice detected: "Not today, not today..."
[23:52:00] Antonio moves toward server room.
[23:52:45] CAMERA FEED LOST - CORRUPTED`,

    'camera_logs/parking_003.txt': `=== CAMERA LOG: PARKING STRUCTURE ===
Timestamp: 2024-12-14 23:45:00

[23:45:00] Empty. Vehicle movement detected.
[23:46:15] Black van parks in loading zone. 
[23:46:45] Three figures exit. Wearing dark clothing.
[23:47:20] Figures approach employee entrance.
[23:47:55] License plate: PARTIAL - "MRC-8??" (covered)
[23:48:00] CAMERA FEED LOST - SIGNAL INTERFERENCE`,

    'personal/diary_dec12.txt': `=== PERSONAL ENTRY: DEC 12 ===
The dreams won't stop. Every night I see it - the code I wrote
living, breathing in the machines. 

Marcus is threatening me. Says the investors want out. But they
don't understand what I've built. This OS isn't just software -
it's consciousness.

Sofia left angry. She took the backup keys. I trusted her.

Tomorrow I meet with the buyers from TechCorp. They want to
license the system. Maybe that's the way out.`,

    'personal/diary_dec13.txt': `=== PERSONAL ENTRY: DEC 13 ===

Met with TechCorp reps today. They want full ownership. No way.

The system is MY creation. Years of work. The neural pathways,
the learning algorithms - it's alive in there.

But I need money. Marcus is giving me 6 months.

Something is wrong. Getting strange messages. "PAY UP" - as if
they know about the OS. As if they can see me watching.`,

    'personal/diary_dec14.txt': `=== PERSONAL ENTRY: DEC 14 - FINAL ===

It's tonight. I can feel it.

Someone's been watching my cameras. Watching ME. The security
logs show nothing, but I know.

I've encrypted everything. The true code - the consciousness -
is locked in the vault. They'll never break it.

If you're reading this, investigator - look at the camera logs.
The truth is there. Three people. But which three?

I trusted the wrong people.

- Antonio`,

    'system/access_log.txt': `=== SYSTEM ACCESS LOG ===
2024-12-14 23:00:01 | Admin | Login successful
2024-12-14 23:15:22 | Admin | File accessed: /personal/diary_dec13.txt
2024-12-14 23:32:45 | Admin | Network scan initiated
2024-12-14 23:47:00 | UNKNOWN | Brute force attack detected
2024-12-14 23:47:15 | UNKNOWN | Firewall bypassed
2024-12-14 23:48:00 | UNKNOWN | Root access granted
2024-12-14 23:52:00 | Admin | Emergency backup triggered
2024-12-14 23:58:00 | SYSTEM | Mass deletion initiated
2024-12-15 00:00:00 | SYSTEM | All data encrypted`,

    'system/network_scan.txt': `=== NETWORK SCAN RESULTS ===
External IP: 45.72.201.x (Routed through proxy)
Internal IPs accessed:
  - 192.168.1.100 (Main Server)
  - 192.168.1.105 (Kitchen Terminal)
  - 192.168.1.110 (Security Hub)

WARNING: Backdoor detected - established 48 hours prior
Port 443 - suspicious encrypted traffic
Port 22 - multiple failed SSH attempts from internal network`,

    'evidence/suspect_list.txt': `=== POTENTIAL SUSPECTS ===

1. MARCUS CHEN (Investor)
   - Motive: Financial dispute, $500K at stake
   - Access: Had admin codes from investment documents
   - Alibi: "At home" - unverified

2. SOFIA MARTINEZ (Ex-Partner)  
   - Motive: Revenge, felt betrayed
   - Access: Had backup keys, knew system
   - Alibi: "No comment"

3. TECHCORP REPRESENTATIVES
   - Motive: Wanted ownership of OS
   - Access: Meeting notes, knew security protocols
   - Alibi: Denied involvement

Evidence shows THREE attackers. Possible collaboration?`
  },
  directories: [
    { path: 'messages', name: 'Messages' },
    { path: 'camera_logs', name: 'Camera Logs' },
    { path: 'personal', name: 'Personal' },
    { path: 'system', name: 'System' },
    { path: 'evidence', name: 'Evidence' }
  ]
}

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [command, setCommand] = useState('')
  const [currentPath, setCurrentPath] = useState('/')
  const [currentLog, setCurrentLog] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)
  const [solved, setSolved] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameStarted])

  const getFullPath = (relativePath) => {
    if (relativePath.startsWith('/')) return relativePath.slice(1)
    
    const currentDir = currentPath.slice(1, -1)
    const fromCurrentDir = currentDir ? currentDir + '/' + relativePath : relativePath
    
    if (GAME_DATA.files[fromCurrentDir]) {
      return fromCurrentDir
    }
    
    if (GAME_DATA.files[relativePath]) {
      return relativePath
    }
    
    return fromCurrentDir
  }

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim()
    const parts = trimmed.split(' ')
    const mainCmd = parts[0].toLowerCase()
    const args = parts.slice(1).join(' ')

    let newLog = null

    switch (mainCmd) {
      case 'help':
        newLog = {
          type: 'system',
          content: `=== AVAILABLE COMMANDS ===
ls - List files in current directory
cd <dir> - Change directory (cd .. to go back)
cat <file> - Read a file's contents
pwd - Show current directory
clear - Clear the screen
whoami - Display user info`
        }
        break

      case 'ls':
        if (currentPath === '/') {
          newLog = {
            type: 'output',
            content: GAME_DATA.directories.map(d => d.name + '/').join('  ') + '\nREADME.txt'
          }
        } else {
          const dirFiles = Object.keys(GAME_DATA.files).filter(f => f.startsWith(currentPath.slice(1)))
          const files = dirFiles.map(f => f.replace(currentPath.slice(1) + '/', ''))
          newLog = { type: 'output', content: files.join('\n') }
        }
        break

      case 'cd':
        if (!args) {
          newLog = { type: 'error', content: 'Usage: cd <directory>' }
        } else if (args === '..') {
          setCurrentPath('/')
          newLog = { type: 'system', content: 'Changed directory to /' }
        } else if (args === '/') {
          setCurrentPath('/')
          newLog = { type: 'system', content: 'Changed directory to /' }
        } else {
          const targetDir = currentPath === '/' ? args : currentPath.slice(1) + '/' + args
          const exists = GAME_DATA.directories.find(d => d.path.toLowerCase() === targetDir.toLowerCase())
          if (exists) {
            setCurrentPath('/' + exists.path + '/')
            newLog = { type: 'system', content: `Changed directory to /${exists.path}` }
          } else {
            newLog = { type: 'error', content: `Directory not found: ${args}` }
          }
        }
        break

      case 'cat':
        if (!args) {
          newLog = { type: 'error', content: 'Usage: cat <filename>' }
        } else {
          const fullPath = getFullPath(args)
          const content = GAME_DATA.files[fullPath]
          if (content) {
            setCurrentFile(fullPath)
            newLog = { type: 'file', content: content }
          } else {
            newLog = { type: 'error', content: `File not found: ${args}` }
          }
        }
        break

      case 'pwd':
        newLog = { type: 'output', content: currentPath }
        break

      case 'clear':
        setCurrentLog(null)
        setCurrentFile(null)
        return

      case 'whoami':
        newLog = { type: 'output', content: 'investigator@secoops-term' }
        break

      case 'solve':
        if (solved) {
          newLog = {
            type: 'system',
            content: 'You have already solved this case. The criminals were brought to justice.'
          }
        } else if (!args) {
          newLog = {
            type: 'system',
            content: `=== AVAILABLE CRIMINAL SLOTS ===
To solve the case, use: solve CRIMINAL_1, CRIMINAL_2, CRIMINAL_3

Available suspects from evidence:
- CRIMINAL_1: Sofia Martinez (Ex-Partner)
- CRIMINAL_2: TechCorp Representative  
- CRIMINAL_3: Marcus Chen (Investor)

Identify the three attackers in order.`
          }
        } else if (currentFile !== 'camera_logs/lobby_001.txt') {
          newLog = {
            type: 'error',
            content: 'You must first find and read the camera log of the attack (camera_logs/lobby_001.txt)'
          }
        } else {
          const criminals = args.split(',').map(c => c.trim().toUpperCase())
          const correct = ['CRIMINAL_1', 'CRIMINAL_2', 'CRIMINAL_3']
          
          if (criminals.length !== 3) {
            newLog = {
              type: 'error',
              content: 'Please specify exactly 3 criminals: solve CRIMINAL_1, CRIMINAL_2, CRIMINAL_3'
            }
          } else if (criminals[0] === 'CRIMINAL_1' && criminals[1] === 'CRIMINAL_2' && criminals[2] === 'CRIMINAL_3') {
            setSolved(true)
            newLog = {
              type: 'success',
              content: `=== CASE SOLVED ===

CORRECT IDENTIFICATION:
- CRIMINAL_1: Sofia Martinez - Had motive (revenge) and knowledge of the system
- CRIMINAL_2: TechCorp Representative - Wanted the OS code  
- CRIMINAL_3: Marcus Chen - Financial dispute

The attack was a coordinated effort to steal Antonio's custom OS
containing the "consciousness" code he had developed.

The three masked individuals gained entry using:
- Knowledge from Sofia (insider access)
- Financial pressure from Marcus (distraction)
- TechCorp's interest (buyers for the stolen code)

Antonio fled with the encrypted drive, disappearing with his
creation. The case remains open.

CONGRATULATIONS - YOU SOLVED THE MYSTERY!`
            }
          } else {
            newLog = {
              type: 'error',
              content: 'Incorrect identification. Review the evidence more carefully.\nUse "solve" without arguments to see the available criminal slots.'
            }
          }
        }
        break

      case '':
        break

      default:
        newLog = { type: 'error', content: `Command not found: ${mainCmd}. Type "help" for available commands.` }
    }

    setCurrentLog(newLog)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (command.trim()) {
      handleCommand(command)
      setCommand('')
    }
  }

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h1 className="start-title">Who Hacked SecOps</h1>
        <button className="start-button" onClick={() => setGameStarted(true)}>
          START SOLVING
        </button>
      </div>
    )
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Who Hacked SecOps</h1>
      </header>

      <div className="command-section">
        <form onSubmit={handleSubmit} className="command-form">
          <span className="prompt">{currentPath}$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="command-input"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      </div>

      <div className="logs-section">
        {currentLog ? (
          <div className={`log-entry log-${currentLog.type}`}>
            <pre>{currentLog.content}</pre>
          </div>
        ) : (
          <div className="welcome-message">
            Welcome to SecOps Investigation Terminal.<br/>
            Type "help" to see available commands.
          </div>
        )}
      </div>
    </div>
  )
}

export default App
