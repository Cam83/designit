import * as react_jsx_runtime from 'react/jsx-runtime';

interface HoverBtnProps {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    style?: React.CSSProperties;
    title?: string;
    disabled?: boolean;
    accentColor?: string;
    /** Rest (and hover) outline, e.g. `1px solid #fff` — Figma default variant only */
    restBorder?: string;
}
declare function HoverBtn({ style, children, onClick, title, disabled, accentColor, restBorder, }: HoverBtnProps): react_jsx_runtime.JSX.Element;

interface TabBtnProps {
    active?: boolean;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** Active state border + text alpha color, e.g. "rgba(255,255,255,0.3)" */
    activeColor?: string;
    /** Active state background color, e.g. "rgba(255,255,255,0.1)" */
    activeBg?: string;
    /** Inactive text color */
    mutedColor?: string;
    /** Base background (inactive), e.g. theme.bg */
    bg?: string;
    /** Base border color (inactive), e.g. theme.border */
    borderColor?: string;
    style?: React.CSSProperties;
}
declare function TabBtn({ active, children, onClick, activeColor, activeBg, mutedColor, bg, borderColor, style, }: TabBtnProps): react_jsx_runtime.JSX.Element;

export { HoverBtn, type HoverBtnProps, TabBtn, type TabBtnProps };
