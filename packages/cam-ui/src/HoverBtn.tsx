import { useState } from "react"

export interface HoverBtnProps {
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  style?: React.CSSProperties
  title?: string
  disabled?: boolean
  accentColor?: string
}

export function HoverBtn({
  style,
  children,
  onClick,
  title,
  disabled,
  accentColor = "rgba(0,0,0,0.06)",
}: HoverBtnProps) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...style,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        borderRadius: "6px",
        background: hov ? accentColor : style?.background ?? "transparent",
      }}
    >
      {children}
    </button>
  )
}
