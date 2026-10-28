import { MessageSquare, Sparkles } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import OrbitLogo from './OrbitLogo'

function Nav() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)

  return (
    <header className='h-14 flex items-center justify-between px-5 pl-14 lg:px-6 border-b border-white/[0.06] bg-[#0c0e14]/80 backdrop-blur-md shrink-0 z-10'>
      <div className='flex items-center gap-3 min-w-0'>
        {selectedConversation ? (
          <>
            <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0'>
              <MessageSquare size={13} className="text-indigo-400" />
            </div>
            <h2 className='text-[14px] font-semibold text-slate-100 tracking-tight truncate max-w-[220px] sm:max-w-md'>
              {selectedConversation?.title || "New Chat"}
            </h2>
            <span className='hidden sm:inline-flex text-[10px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.07] px-2.5 py-0.5 rounded-full'>
              {messages?.length || 0} messages
            </span>
          </>
        ) : (
          <div className='flex items-center gap-2.5'>
            <OrbitLogo size={20} />
            <span className='text-[13px] font-semibold tracking-tight text-slate-200'>
              orbitAI Studio
            </span>
          </div>
        )}
      </div>

    </header>
  )
}

export default Nav
