'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TagProps {
  label: string | number
  overflow?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

function Tag({ label, overflow, onClick, className, style }: TagProps) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <span
      className={cn(className)}
      onClick={onClick}
      onMouseEnter={() => onClick && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.01)',
        background: hovered ? '#E9E8EC' : '#F3F2F5',
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        color: 'inherit',
        textDecoration: onClick ? 'underline' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {label}
    </span>
  )
}

export { Tag }
