import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap, CornerDownLeft } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'

function ChatInput() {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages, isLoading } = useSelector(state => state.message)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const fileRef = useRef(null)
  const textareaRef = useRef(null)
  const dispatch = useDispatch()

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
      activeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20"
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
      activeBg: "bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-violet-500/20"
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
      activeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20"
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
      activeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20"
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
      activeBg: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-fuchsia-500/20"
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision",
      activeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20"
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
      activeBg: "bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/20"
    }
  ]

  useEffect(() => {
    const handlePromptEvent = (e) => {
      if (e.detail?.prompt) {
        setValue(e.detail.prompt)
      }
      if (e.detail?.agent) {
        const match = agents.find(
          a => a.id.toLowerCase() === e.detail.agent.toLowerCase() || 
               a.label.toLowerCase() === e.detail.agent.toLowerCase()
        )
        if (match) setSelectedAgent(match.label)
      }
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }

    window.addEventListener('orbit-set-prompt', handlePromptEvent)
    return () => window.removeEventListener('orbit-set-prompt', handlePromptEvent)
  }, [])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = ""
      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript
      }
      setValue(prev => prev + " " + transcript)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.")
      return
    }
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  const handleSendMessage = async () => {
    if (!value.trim() && !selectedFile) return
    if (isLoading) return

    dispatch(setIsLoading(true))
    let conversation = selectedConversation
    if (!conversation) {
      dispatch(setMessages([]))
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation?.title === "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: value.slice(0, 40) }))
    }

    const formData = new FormData()
    formData.append("prompt", value.trim())
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent.toLowerCase())
    if (selectedFile) {
      formData.append("file", selectedFile)
    }

    dispatch(addMessage({ role: "user", content: value.trim() }))
    const currentVal = value
    setValue("")

    try {
      const data = await sendMessage(formData)
      dispatch(setIsLoading(false))
      setSelectedFile(null)
      dispatch(setArtifacts(data?.artifacts || []))
      dispatch(addMessage({ role: "assistant", content: data?.answer, images: data?.images }))
    } catch (error) {
      dispatch(setIsLoading(false))
      dispatch(addMessage({ role: "assistant", content: "Error processing request. Please check backend connection." }))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className='w-full px-3 md:px-8 pb-4 pt-2 shrink-0 bg-[#0c0e14]'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex flex-col gap-2 bg-[#12151e]/90 border border-white/[0.08] focus-within:border-indigo-500/40 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.08)] rounded-2xl px-4 pt-3 pb-3 transition-all duration-200'>
          
          {/* Agent Selector Bar */}
          <div className='flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1 shrink-0 hidden sm:inline'>
              Mode:
            </span>
            {agents.map((agent) => {
              const isActive = selectedAgent === agent.label
              const Icon = agent.icon
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setSelectedAgent(agent.label)}
                  className={`
                    shrink-0
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1.5
                    rounded-lg
                    text-xs
                    font-medium
                    border
                    transition-all
                    cursor-pointer
                    ${isActive
                      ? `${agent.activeBg} font-semibold shadow-sm`
                      : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-200"
                    }
                  `}
                >
                  <Icon size={13} className={isActive ? "" : "text-slate-500"} />
                  {agent.label}
                </button>
              )
            })}
          </div>

          {/* Uploaded File Attachment Preview */}
          {selectedFile && (
            <div className='my-1'>
              <div className='inline-flex items-center gap-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5'>
                {selectedFile?.type === "application/pdf" ? (
                  <FileText size={16} className="text-red-400" />
                ) : (
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="attachment" 
                    className="h-8 w-8 rounded-lg object-cover" 
                  />
                )}
                <div>
                  <p className='text-xs font-medium text-slate-200 truncate max-w-[180px]'>
                    {selectedFile?.name}
                  </p>
                  <p className='text-[10px] text-slate-400'>
                    {Math.ceil(selectedFile.size / 1024)} KB
                  </p>
                </div>
                <button 
                  type="button"
                  className='ml-1 text-slate-400 hover:text-white cursor-pointer' 
                  onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = "" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Textarea Input */}
          <textarea
            ref={textareaRef}
            placeholder={`Ask orbitAI anything, or type a request for ${selectedAgent} mode...`}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            value={value}
            className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-100 placeholder:text-slate-500 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-[56px] pt-1"
            rows={2}
          />

          {/* Action Footer */}
          <div className='flex items-center justify-between pt-1 border-t border-white/[0.04]'>
            <div className='flex items-center gap-1.5'>
              <input 
                type="file" 
                accept='.pdf,image/*' 
                hidden 
                ref={fileRef} 
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setSelectedFile(file)
                }} 
              />

              <button 
                type="button"
                className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer'
                title="Attach PDF or Image"
                onClick={() => fileRef.current?.click()}
              >
                <Paperclip size={15} />
              </button>

              <button
                type="button"
                onClick={toggleMic}
                title={listening ? "Stop voice listening" : "Start voice input"}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer ${
                  listening ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                {listening ? <Mic size={15} /> : <MicOff size={15} />}
              </button>

              {listening && (
                <span className='text-[11px] font-medium text-red-400 animate-pulse pl-1'>
                  Listening...
                </span>
              )}
            </div>

            <div className='flex items-center gap-2'>
              <span className='hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium'>
                <span>Send</span>
                <kbd className='px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[9px]'>↵</kbd>
              </span>

              <button
                type="button"
                disabled={(!value.trim() && !selectedFile) || isLoading}
                onClick={handleSendMessage}
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all cursor-pointer ${
                  value.trim() || selectedFile
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-700 active:scale-95" 
                    : "bg-white/[0.04] text-slate-600 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
