interface AuroraBackgroundProps {
  children?: React.ReactNode
}

/**
 * Full-viewport Aurora mesh: cream paper-tone base + three soft pastel
 * radial-gradient blobs. The gradient is verbatim from vibemap-aurora-tokens.md
 * §1 (decision: visual-direction-aurora) — do not eyeball-edit hex/positions;
 * any change is a new decision. Fixed behind content (-z-10), non-interactive;
 * blur lives only on glass cards, never on this background. Optional `children`
 * render above the mesh.
 */
export function AuroraBackground({ children }: AuroraBackgroundProps) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundColor: '#fef5ee',
          backgroundImage: [
            'radial-gradient(70% 50% at 20% 0%, #ffcfe0 0%, transparent 60%)',
            'radial-gradient(60% 50% at 100% 30%, #ffd6a8 0%, transparent 55%)',
            'radial-gradient(80% 60% at 50% 110%, #d4d6ff 0%, transparent 55%)',
          ].join(', '),
          willChange: 'transform',
        }}
      />
      {children}
    </>
  )
}
