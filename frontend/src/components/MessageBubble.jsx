import { Check, Copy, ExternalLink, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import OrbitLogo from './OrbitLogo'

function MessageBubble({ role, content, images }) {
  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'up' | 'down' | null

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }

  const copyFullMessage = async () => {
    await navigator.clipboard.writeText(content || "")
    setCopiedMessage(true)
    setTimeout(() => {
      setCopiedMessage(false)
    }, 2000)
  }

  return (
    <div className={`flex gap-3 my-1 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className='hidden sm:flex items-start pt-1 shrink-0'>
          <div className='w-8 h-8 rounded-xl bg-white/[0.04] border border-indigo-500/20 flex items-center justify-center p-1 shadow-sm'>
            <OrbitLogo size={20} />
          </div>
        </div>
      )}

      <div className={`w-fit max-w-[94vw] md:max-w-[78%] rounded-2xl break-words leading-relaxed transition-all
        ${isUser
          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 rounded-tr-sm shadow-md shadow-indigo-500/10"
          : "bg-[#131620] border border-white/[0.08] text-slate-100 p-4 sm:p-5 rounded-tl-sm shadow-sm"
        }`}>

        {/* Attached Images */}
        {images?.length > 0 && (
          <div className='flex flex-wrap gap-2.5 mb-3'>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="attachment"
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-36 h-24 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 hover:scale-[1.02] transition"
              />
            ))}
          </div>
        )}

        {/* Markdown Content */}
        <div className="text-[14.5px] leading-relaxed">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className='text-xl sm:text-2xl font-bold mt-4 mb-2 text-white border-b border-white/[0.06] pb-1.5'>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className='text-lg sm:text-xl font-bold mt-4 mb-2 text-white'>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className='text-base font-semibold mt-3 mb-1 text-slate-200'>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className='mb-3 whitespace-pre-wrap break-words text-slate-200 last:mb-0'>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className='list-disc pl-5 space-y-1.5 my-2.5 text-slate-200'>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className='list-decimal pl-5 space-y-1.5 my-2.5 text-slate-200'>{children}</ol>
              ),
              table: ({ children }) => (
                <div className='overflow-x-auto my-4 rounded-xl border border-white/10'>
                  <table className='min-w-full text-xs sm:text-sm divide-y divide-white/10'>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className='bg-white/[0.05] px-3.5 py-2.5 text-left font-semibold text-slate-200'>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className='px-3.5 py-2 text-slate-300 border-t border-white/[0.05]'>
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className='border-l-2 border-indigo-500/60 pl-3.5 italic text-slate-400 my-2.5'>
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {children}
                  <ExternalLink size={12} />
                </a>
              ),
              code: ({ className, children }) => {
                const value = String(children).trim()

                if (!className) {
                  return (
                    <code className='px-1.5 py-0.5 rounded-md bg-white/[0.08] text-indigo-300 text-[13px] font-mono'>
                      {value}
                    </code>
                  )
                }

                const language = className.replace("language-", "")

                return (
                  <div className='my-3.5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b0d13] shadow-md'>
                    <div className='flex items-center justify-between bg-[#11141c] border-b border-white/[0.06] px-3.5 py-2'>
                      <div className='flex items-center gap-2'>
                        {/* Mac-style Window Controls */}
                        <div className='flex items-center gap-1.5'>
                          <span className='w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block' />
                          <span className='w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block' />
                          <span className='w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block' />
                        </div>
                        <span className='uppercase text-[11px] font-semibold text-slate-400 tracking-wider pl-1.5'>
                          {language || "code"}
                        </span>
                      </div>

                      <button 
                        type="button"
                        className='flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] px-2.5 py-1 rounded-md transition-colors cursor-pointer'
                        onClick={() => copyCode(value)}
                      >
                        {copiedCode === value ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <SyntaxHighlighter
                      language={language}
                      style={oneDark}
                      wrapLongLines
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: "14px 16px",
                        background: "#0b0d13",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {value}
                    </SyntaxHighlighter>
                  </div>
                )
              },
              img: ({ src }) => {
                if (!src) return null
                return (
                  <img
                    src={src}
                    alt="content image"
                    onClick={() => setLightBox(src)}
                    loading="lazy"
                    onError={(e) => e.currentTarget.remove()}
                    className="w-48 h-32 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition my-2"
                  />
                )
              }
            }}
          >
            {content}
          </Markdown>
        </div>

        {/* Assistant Footer Action Toolbar */}
        {!isUser && (
          <div className='flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06] text-xs text-slate-400'>
            <div className='flex items-center gap-1 text-[11px] text-slate-500'>
              <span className='font-semibold text-slate-400'>orbitAI</span>
              <span>•</span>
              <span>Autonomous Assistant</span>
            </div>

            <div className='flex items-center gap-1.5'>
              <button
                type="button"
                onClick={copyFullMessage}
                title="Copy entire response"
                className='flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/[0.06] hover:text-slate-200 transition-colors cursor-pointer'
              >
                {copiedMessage ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span className='text-[11px]'>{copiedMessage ? "Copied" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                title="Helpful"
                className={`p-1 rounded-md transition-colors cursor-pointer ${feedback === 'up' ? 'text-indigo-400 bg-indigo-500/10' : 'hover:bg-white/[0.06] hover:text-slate-200'}`}
              >
                <ThumbsUp size={13} />
              </button>

              <button
                type="button"
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                title="Not helpful"
                className={`p-1 rounded-md transition-colors cursor-pointer ${feedback === 'down' ? 'text-rose-400 bg-rose-500/10' : 'hover:bg-white/[0.06] hover:text-slate-200'}`}
              >
                <ThumbsDown size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LightBox Image Modal */}
      {lightBox && (
        <div className='fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6'>
          <button
            className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer'
            onClick={() => setLightBox(null)}
          >
            <X size={18} />
          </button>
          <img
            src={lightBox}
            alt="zoom view"
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default MessageBubble
