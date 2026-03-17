import React from 'react'

const typeConfig: Record<string, { icon: string; borderColor: string; titleColor: string }> = {
  info: { icon: '\u2139', borderColor: 'border-l-accent', titleColor: 'text-accent' },
  warning: { icon: '\u26A0', borderColor: 'border-l-amber-500', titleColor: 'text-amber-400' },
  tip: { icon: '\uD83D\uDCA1', borderColor: 'border-l-green', titleColor: 'text-green' },
  danger: { icon: '\uD83D\uDEAB', borderColor: 'border-l-red-500', titleColor: 'text-red-400' },
  prerequisites: { icon: '\uD83D\uDCCB', borderColor: 'border-l-accent', titleColor: 'text-accent' },
  note: { icon: '\u2139', borderColor: 'border-l-accent', titleColor: 'text-accent' },
}

interface AdmonitionProps {
  type: string
  title: string
  children: React.ReactNode
}

export function Admonition({ type, title, children }: AdmonitionProps) {
  const config = typeConfig[type.toLowerCase()] || typeConfig.info
  return (
    <div className={`my-4 rounded-r-lg border-l-4 ${config.borderColor} bg-dark-light p-4`}>
      <div className={`mb-2 font-semibold ${config.titleColor}`}>
        {config.icon} {title}
      </div>
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  )
}
