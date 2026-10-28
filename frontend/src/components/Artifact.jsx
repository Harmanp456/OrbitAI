import { Check, Code2, Copy, Download, ExternalLink, Eye, Laptop, Monitor, PanelRightClose, PanelRightOpen, RefreshCw, Smartphone, Tablet, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, easeInOut, motion } from "motion/react"
import Editor from '@monaco-editor/react'

function Artifact() {
  const [collapsed, setCollapsed] = useState(false)
  const { artifacts } = useSelector(state => state.message)
  const [tab, setTab] = useState("preview")
  const [activeFile, setActiveFile] = useState(0)
  const [copied, setCopied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [viewport, setViewport] = useState("desktop") // desktop | tablet | mobile
  const [refreshKey, setRefreshKey] = useState(0)

  if (!artifacts || artifacts.length === 0) return null

  const files = artifacts[0]?.files || []
  const file = files[activeFile]
  const htmlFile = files.find(f => f.name === "index.html")
  const cssFile = files.find(f => f.name === "style.css")
  const jsFile = files.find(f => f.name === "script.js")

  const canPreview = Boolean(htmlFile)

  const previewDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${cssFile?.content || ""}
  </style>
</head>
<body>
  ${htmlFile?.content || ""}
  <script>
    ${jsFile?.content || ""}
  </script>
</body>
</html>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || "")
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleOpenNewTab = () => {
    const blob = new Blob([previewDoc], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const blob = new Blob([file?.content || ""], { type: "text/plain" })
    element.href = URL.createObjectURL(blob)
    element.download = file?.name || "code.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase()
    if (name.endsWith(".html")) return "html"
    if (name.endsWith(".css")) return "css"
    if (name.endsWith(".js")) return "javascript"
    if (name.endsWith(".jsx")) return "javascript"
    if (name.endsWith(".ts")) return "typescript"
    if (name.endsWith(".tsx")) return "typescript"
    if (name.endsWith(".json")) return "json"
    if (name.endsWith(".py")) return "python"
    return "plaintext"
  }

  const PanelContent = ({ onClose }) => {
    return (
      <div className='flex flex-col h-full bg-[#0b0d13] text-white'>
        {/* Top Header */}
        <div className='h-14 px-3.5 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f1118]'>
          <div className='flex items-center gap-2.5 min-w-0'>
            <button
              type="button"
              className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0'
              onClick={onClose ?? (() => setCollapsed(true))}
              title="Close Panel"
            >
              {onClose ? <X size={15} /> : <PanelRightClose size={16} />}
            </button>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0 text-indigo-400'>
                <Code2 size={13} />
              </div>
              <span className='text-[13px] font-semibold text-slate-200 truncate'>
                {artifacts[0]?.title || "Artifact Preview"}
              </span>
            </div>
          </div>

          <div className='flex items-center gap-1.5 shrink-0'>
            {canPreview && (
              <div className='flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-0.5 rounded-lg mr-1'>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    tab === "preview" 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Eye size={12} /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    tab === "code" 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Code2 size={12} /> Code
                </button>
              </div>
            )}

            {tab === "preview" && canPreview && (
              <>
                <button
                  type="button"
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  title="Reload Preview"
                  className='p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer'
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  title="Open in New Tab"
                  className='p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer'
                >
                  <ExternalLink size={14} />
                </button>
              </>
            )}

            {tab === "code" && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy File Code"
                  className='flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer'
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download File"
                  className='p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer'
                >
                  <Download size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Viewport bar for preview / File tabs for code */}
        {tab === "preview" && canPreview ? (
          <div className='flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] bg-[#0c0e14] text-xs text-slate-400'>
            <div className='flex items-center gap-1'>
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewport === "desktop" ? "bg-white/[0.08] text-indigo-400" : "hover:text-white"
                }`}
                title="Desktop View (100%)"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewport === "tablet" ? "bg-white/[0.08] text-indigo-400" : "hover:text-white"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewport === "mobile" ? "bg-white/[0.08] text-indigo-400" : "hover:text-white"
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone size={14} />
              </button>
            </div>
            <span className='text-[10px] text-slate-500 font-mono uppercase'>
              {viewport === "desktop" ? "Responsive" : viewport}
            </span>
          </div>
        ) : (
          <div className='flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 bg-[#0c0e14]'>
            {files.map((f, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveFile(index)}
                className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors border-r border-white/[0.04] relative cursor-pointer ${
                  activeFile === index 
                    ? "text-indigo-400 bg-white/[0.02]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]"
                }`}
              >
                {f?.name}
                {activeFile === index && (
                  <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full' />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className='flex-1 overflow-hidden relative bg-[#090b10] flex items-center justify-center'>
          {tab === "preview" && canPreview ? (
            <motion.div
              key={refreshKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`h-full transition-all duration-300 flex items-center justify-center p-2 ${
                viewport === "mobile"
                  ? "w-[375px] max-w-full"
                  : viewport === "tablet"
                  ? "w-[768px] max-w-full"
                  : "w-full"
              }`}
            >
              <div className='w-full h-full rounded-lg overflow-hidden border border-white/[0.08] shadow-2xl bg-white'>
                <iframe
                  title='preview'
                  srcDoc={previewDoc}
                  sandbox='allow-scripts allow-modals'
                  className='w-full h-full bg-white border-none'
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className='w-full h-full'
            >
              <Editor
                theme='vs-dark'
                language={detectLanguage(file?.name)}
                value={file?.content || ""}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 14, bottom: 14 },
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Floating Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xl shadow-indigo-500/25 cursor-pointer transition-transform active:scale-95"
      >
        <Eye size={14} />
        Live Sandbox
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[92vw] max-w-[480px] border-l border-white/[0.08] overflow-hidden"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Panel */}
      <motion.aside
        initial={{ width: 480 }}
        animate={{ width: collapsed ? 52 : 480 }}
        transition={{ duration: 0.25, ease: easeInOut }}
        className='hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0 z-10'
      >
        {collapsed ? (
          <div className='h-full bg-[#0b0d13] flex flex-col items-center py-4 gap-4 w-full'>
            <button
              onClick={() => setCollapsed(false)}
              className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer'
              title="Expand Sandbox"
            >
              <PanelRightOpen size={16} />
            </button>
            <div
              className='text-[11px] font-semibold text-slate-500 tracking-widest uppercase whitespace-nowrap mt-4'
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)"
              }}
            >
              {artifacts[0]?.title || "Sandbox Preview"}
            </div>
          </div>
        ) : (
          <PanelContent />
        )}
      </motion.aside>
    </>
  )
}

export default Artifact
