import { useEffect, useRef, useState } from 'react';

interface TerminalLine {
  prompt?: boolean;
  text: string;
  delay?: number;
}

/**
 * A scripted, client-side-only typewriter animation showing a sample
 * exploit session. This is NOT a live connection to anything — it's a
 * preview of what the real per-user sandbox terminal (Milestone 4.5)
 * will feel like to use. Labeled honestly in the UI so it's never
 * mistaken for a live shell.
 */
export function TerminalPreview({ lines }: { lines: TerminalLine[] }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const indexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let charIndex = 0;
    let cancelled = false;

    function typeNextLine() {
      if (cancelled || indexRef.current >= lines.length) return;
      const line = lines[indexRef.current];
      charIndex = 0;

      function typeChar() {
        if (cancelled) return;
        if (charIndex <= line.text.length) {
          setCurrentText(line.text.slice(0, charIndex));
          charIndex++;
          setTimeout(typeChar, line.prompt ? 25 : 10);
        } else {
          setVisibleLines((prev) => [...prev, (line.prompt ? '$ ' : '') + line.text]);
          setCurrentText('');
          indexRef.current++;
          setTimeout(typeNextLine, line.delay ?? 500);
        }
      }
      typeChar();
    }

    typeNextLine();
    return () => {
      cancelled = true;
    };
  }, [lines]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [visibleLines, currentText]);

  const isTyping = indexRef.current < lines.length;
  const currentLinePrefix = lines[indexRef.current]?.prompt ? '$ ' : '';

  return (
    <div className="overflow-hidden rounded-lg border border-void-border bg-black">
      <div className="flex items-center gap-1.5 border-b border-void-border bg-void-surface px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-breach/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
        <span className="ml-2 font-mono text-xs text-ink-muted">
          preview — sandbox terminal (M4.5)
        </span>
      </div>
      <div ref={containerRef} className="h-56 overflow-y-auto p-4 font-mono text-sm">
        {visibleLines.map((line, i) => (
          <div key={i} className="text-ink">
            {line.startsWith('$ ') ? (
              <>
                <span className="text-signal">$ </span>
                {line.slice(2)}
              </>
            ) : (
              <span className="text-ink-muted">{line}</span>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-ink">
            {currentLinePrefix && <span className="text-signal">{currentLinePrefix}</span>}
            {currentText}
            <span className="animate-pulse text-signal">▋</span>
          </div>
        )}
      </div>
    </div>
  );
}
