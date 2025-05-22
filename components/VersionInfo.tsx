'use client'

import { useEffect, useState } from 'react'

interface VersionData {
  version: string
  buildNumber: number
  lastCommit: string
  lastCommitDate: string
  deploymentDate: string
}

export function VersionInfo() {
  const [version, setVersion] = useState<VersionData | null>(null)

  useEffect(() => {
    fetch('/version.json')
      .then(res => res.json())
      .then(data => setVersion(data))
      .catch(console.error)
  }, [])

  if (!version) return null

  return (
    <div className="fixed bottom-2 right-2 text-xs text-white/50">
      <div>v{version.version} (build {version.buildNumber})</div>
      <div>Deployed: {new Date(version.deploymentDate).toLocaleString()}</div>
      <div>Commit: {version.lastCommit.substring(0, 7)}</div>
    </div>
  )
}