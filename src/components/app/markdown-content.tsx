import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="space-y-5 break-words text-base leading-8 text-neutral-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 text-2xl font-semibold leading-tight text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 text-xl font-semibold text-white">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 text-lg font-semibold text-white">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="leading-8">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-teal-300 underline decoration-teal-500/40 underline-offset-4 transition hover:text-teal-200 [overflow-wrap:anywhere]"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-2 text-neutral-300 marker:text-teal-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-2 text-neutral-300 marker:text-teal-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-neutral-100">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-teal-400/50 bg-neutral-900/40 px-4 py-2 text-neutral-300 italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className?.startsWith("language-");
            if (isInline) {
              return (
                <code
                  className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-teal-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block whitespace-pre-wrap font-mono text-sm text-neutral-100"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-sm leading-6 text-neutral-100">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-6 border-neutral-800" />,
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-neutral-800 bg-neutral-900 px-3 py-2 text-left font-semibold text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-neutral-800 px-3 py-2 text-neutral-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
