import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DocMarkdownContentProps {
  content: string
}

export function DocMarkdownContent({ content }: DocMarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 pb-2 border-b">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-semibold mb-2 mt-3">{children}</h4>,
        p: ({ children }) => <p className="mb-3 text-sm leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 text-sm space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 text-sm space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-sm">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        hr: () => <hr className="my-6 border-border" />,
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-link underline underline-offset-4 hover:text-link-hover"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-selected-border pl-4 italic text-muted-foreground my-3">
            {children}
          </blockquote>
        ),
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs leading-relaxed">
            {children}
          </pre>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = typeof className === "string" && className.startsWith("language-")

          if (!isBlock) {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            )
          }

          return (
            <code
              className={className ? `${className} block font-mono` : "block font-mono"}
              {...props}
            >
              {children}
            </code>
          )
        },
        table: ({ children }) => (
          <div className="my-4 rounded-md border border-border">
            <Table className="whitespace-normal">
              {children}
            </Table>
          </div>
        ),
        thead: ({ children }) => <TableHeader className="bg-surface-subtle">{children}</TableHeader>,
        tbody: ({ children }) => <TableBody>{children}</TableBody>,
        tr: ({ children }) => <TableRow className="hover:bg-hover">{children}</TableRow>,
        th: ({ children }) => <TableHead className="whitespace-normal align-top">{children}</TableHead>,
        td: ({ children }) => <TableCell className="whitespace-normal align-top">{children}</TableCell>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
