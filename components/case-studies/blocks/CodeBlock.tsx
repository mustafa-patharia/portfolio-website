export function CodeBlock({ code, language = "typescript" }: { code: string, language?: string }) {
  return (
    <div className="rounded-2xl bg-[#0f1115] border border-stroke overflow-hidden text-sm w-full">
      <div className="flex items-center px-4 py-3 bg-[#1a1d24] border-b border-stroke gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
      </div>
      <pre className="p-6 overflow-x-auto text-[#a9b5c5] font-mono leading-relaxed text-xs md:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
