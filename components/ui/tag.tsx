'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  overflow?: boolean
  className?: string
  style?: React.CSSProperties
}

function Tag({ label, overflow, className, style }: TagProps) {
  return (
    <span
      className={cn(className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.01)',
        background: '#F3F2F5',
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        color: 'inherit',
        ...style,
      }}
    >
      {label}
    </span>
  )
}

export { Tag }
