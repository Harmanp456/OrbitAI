import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'
import OrbitLogo from './OrbitLogo'
import { Code2, Presentation, Globe, FileText, Sparkles, ArrowRight, Zap, ImageIcon } from 'lucide-react'

function MessageList() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages, isLoading } = useSelector(state => state.message)
    const bottomRef = useRef(null)

    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        })
    }, [messages?.length, isLoading])

    const promptSuggestions = [
        {
            title: "Code Interactive App",
            desc: "Build a Kanban task board with dark mode and drag-and-drop",
            prompt: "Build a responsive Kanban board web app with HTML, modern CSS, and JavaScript with drag and drop support and dark theme.",
            agent: "coding",
            icon: Code2,
            tag: "Live Sandbox",
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        },
        {
            title: "Generate Presentation",
            desc: "Create an investor pitch deck for an autonomous AI agent startup",
            prompt: "Create a 6-slide investor pitch deck for an AI automation platform targeting enterprise workflows.",
            agent: "ppt",
            icon: Presentation,
            tag: "PPTX Export",
            color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20"
        },
        {
            title: "Web Deep Research",
            desc: "Analyze latest breakthroughs in quantum computing & silicon photonics",
            prompt: "Search the web and summarize the latest 2025 breakthroughs in quantum computing and optical processors.",
            agent: "search",
            icon: Globe,
            tag: "Real-time Web",
            color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
        },
        {
            title: "Document & PDF Analysis",
            desc: "Extract key metrics, financial summaries and table data from PDFs",
            prompt: "Analyze the uploaded document, summarize key findings, and present takeaways in structured bullet points.",
            agent: "pdf",
            icon: FileText,
            tag: "RAG Assistant",
            color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
        }
    ]

    const handleSelectPrompt = (item) => {
        window.dispatchEvent(new CustomEvent('orbit-set-prompt', {
            detail: {
                prompt: item.prompt,
                agent: item.agent
            }
        }))
    }

    return (
        <div className='flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 [scrollbar-width:thin]'>
            {messages.length === 0 || !selectedConversation ? (
                <div className="min-h-[75vh] flex flex-col items-center justify-center max-w-3xl mx-auto text-center px-2 py-8">
                    {/* Glowing Logo & Badge */}
                    <div className='mb-4 relative'>
                        <div className='absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse' />
                        <OrbitLogo size={52} className="relative" />
                    </div>

                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-4'>
                        <Sparkles size={12} className='text-indigo-400' />
                        <span>Autonomous Multi-Agent Workspace</span>
                    </div>

                    <h1 className='text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3'>
                        What would you like to build with <span className='bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent'>orbitAI</span>?
                    </h1>
                    
                    <p className='text-slate-400 text-sm md:text-base max-w-lg mb-8 leading-relaxed'>
                        Code software in live sandboxes, generate slide decks, analyze PDFs, and tap into real-time web intelligence.
                    </p>

                    {/* Quick Capabilities Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left mb-6'>
                        {promptSuggestions.map((item, idx) => {
                            const IconComponent = item.icon
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectPrompt(item)}
                                    className='group p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left relative overflow-hidden shadow-sm hover:shadow-indigo-500/5'
                                >
                                    <div className='flex items-start justify-between mb-2 w-full'>
                                        <div className={`p-2 rounded-xl border ${item.color}`}>
                                            <IconComponent size={16} />
                                        </div>
                                        <span className='text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-white/[0.03] px-2 py-0.5 rounded-md'>
                                            {item.tag}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className='text-sm font-semibold text-slate-200 group-hover:text-white mb-1 flex items-center justify-between'>
                                            {item.title}
                                            <ArrowRight size={13} className='text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100' />
                                        </h3>
                                        <p className='text-xs text-slate-400 line-clamp-2 leading-relaxed'>
                                            {item.desc}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Fast Prompt Pills */}
                    <div className='flex flex-wrap items-center justify-center gap-2 pt-1'>
                        <span className='text-[11px] text-slate-500 font-medium mr-1'>Or try:</span>
                        {["Explain Redis in 3 minutes", "Design SaaS pricing table", "Create futuristic spaceship wallpaper"].map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectPrompt({ prompt: s, agent: "auto" })}
                                className='text-xs text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] px-3 py-1.5 rounded-full transition-colors cursor-pointer'
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='max-w-4xl mx-auto space-y-6 pb-4'>
                    {messages?.map((msg, i) => (
                        <div key={i}>
                            <MessageBubble 
                                role={msg?.role} 
                                content={msg?.content} 
                                images={msg?.images || []} 
                            />
                        </div>
                    ))}

                    {isLoading && (
                        <div className='flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] w-fit'>
                            <OrbitLogo size={20} className="animate-spin" />
                            <LoadingAnimation />
                        </div>
                    )}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessageList
