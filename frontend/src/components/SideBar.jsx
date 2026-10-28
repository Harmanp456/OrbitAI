import React, { useState, useEffect } from 'react'
import { Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, Plus, Search, Sparkles, User, X } from "lucide-react"
import { getConversations } from '../features/getConversations'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice'
import { createConversation } from '../features/createConversation'
import logOut from '../features/logOut'
import { setUserdata } from '../redux/userSlice'
import BillingDrawer from './BillingDrawer'
import OrbitLogo from './OrbitLogo'

function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const { conversations, selectedConversation } = useSelector(state => state.conversation)
    const { userData } = useSelector(state => state.user)
    const [showBilling, setShowBilling] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            dispatch(setConversations(data))
        }
        getConv()
    }, [userData?._id])

    const handleCreateConversation = async () => {
        const data = await createConversation()
        dispatch(addConversation(data))
    }

    const filteredConversations = conversations?.filter(c => 
        (c?.title || "New Chat").toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[60px] h-screen bg-[#0c0e14] border-r border-white/[0.06] py-4 gap-2 shrink-0 z-20'>
                <div className='p-1 mb-1'>
                    <OrbitLogo size={24} />
                </div>

                <button 
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors bg-transparent border-none cursor-pointer'
                    onClick={() => setCollapsed(false)}
                    title="Expand sidebar"
                >
                    <PanelRight size={17} />
                </button>

                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer'
                    onClick={() => dispatch(setSelectedConversation(null))}
                    title="New Chat"
                >
                    <Plus size={16} />
                </button>

                <div className='flex-1 overflow-y-auto px-1.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-3 w-full flex flex-col items-center gap-1.5'>
                    {conversations?.map((conv) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <button
                                key={conv?._id}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                title={conv?.title || "Chat"}
                                className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer
                                ${isActive ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"}`}
                            >
                                <MessageSquare size={14} />
                            </button>
                        )
                    })}
                </div>

                <div className='shrink-0 pt-2'>
                    {userData?.avatar && !imageError ? (
                        <img
                            className='w-8 h-8 rounded-lg object-cover border border-indigo-500/30'
                            src={userData?.avatar}
                            alt="Avatar"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className='w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-slate-400'>
                            <User size={14} />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Mobile Open Toggle */}
            <button 
                className='lg:hidden fixed top-3 left-3 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0e1118] border border-white/[0.1] text-slate-300 hover:text-white shadow-lg transition-colors cursor-pointer'
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={15} />
            </button>

            {mobileOpen && (
                <div 
                    onClick={() => setMobileOpen(false)} 
                    className='lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm'
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[275px] h-screen shrink-0 bg-[#0c0e14] border-r border-white/[0.06] transition-transform duration-200 flex flex-col ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                
                {/* Header branding */}
                <div className='flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]'>
                    <div className='flex items-center gap-2.5'>
                        <OrbitLogo size={22} />
                        <span className='text-[15px] font-bold text-white tracking-tight flex items-center gap-1.5'>
                            orbitAI
                            <span className='text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider'>
                                2.0
                            </span>
                        </span>
                    </div>

                    <div className='flex items-center gap-1'>
                        <button 
                            onClick={() => setCollapsed(true)}
                            className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer'
                            title="Collapse sidebar"
                        >
                            <PanelLeftIcon size={15} />
                        </button>
                        <button 
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* New Chat Button */}
                <div className='p-3 pb-2'>
                    <button 
                        onClick={() => {
                            dispatch(setSelectedConversation(null))
                            if (mobileOpen) setMobileOpen(false)
                        }}
                        className='w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl py-2.5 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer active:scale-[0.99]'
                    >
                        <Plus size={15} />
                        New Conversation
                    </button>
                </div>

                {/* Search Conversations */}
                {conversations?.length > 3 && (
                    <div className='px-3 pt-1 pb-1'>
                        <div className='flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 focus-within:border-indigo-500/40 focus-within:bg-white/[0.05] transition-all'>
                            <Search size={13} className='text-slate-500 shrink-0' />
                            <input 
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='bg-transparent outline-none text-slate-200 placeholder:text-slate-500 text-xs w-full'
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className='text-slate-500 hover:text-slate-300'>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Recents Label */}
                <div className='px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between'>
                    <span>Conversations</span>
                    <span className='text-[10px] text-slate-600 font-normal'>{filteredConversations.length}</span>
                </div>

                {/* Conversation List */}
                <div className='flex-1 overflow-y-auto px-2.5 pb-2 space-y-0.5 [scrollbar-width:thin]'>
                    {filteredConversations.length === 0 ? (
                        <div className='py-8 text-center text-xs text-slate-500'>
                            {searchQuery ? "No matching chats" : "No conversations yet"}
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const isActive = selectedConversation?._id === conv?._id
                            return (
                                <div
                                    key={conv?._id}
                                    onClick={() => {
                                        dispatch(setSelectedConversation(conv))
                                        if (mobileOpen) setMobileOpen(false)
                                    }}
                                    className={`group flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-xl border transition-all text-left
                                    ${isActive 
                                        ? "bg-indigo-500/12 border-indigo-500/25 text-white shadow-sm" 
                                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"}`}
                                >
                                    <div className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-lg transition-colors
                                        ${isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-white/[0.04] text-slate-500 group-hover:text-slate-300"}`}>
                                        <MessageSquare size={12} />
                                    </div>
                                    <span className='text-[13px] font-medium truncate flex-1'>
                                        {conv?.title || "New Chat"}
                                    </span>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* User Profile & Credits Bottom Bar */}
                <div className='border-t border-white/[0.06] p-3 bg-[#0a0c10]'>
                    {userData ? (
                        <div className='flex items-center gap-2.5 rounded-xl p-2 hover:bg-white/[0.04] transition-colors'>
                            <div className='relative shrink-0'>
                                {userData?.avatar && !imageError ? (
                                    <img
                                        className='w-9 h-9 rounded-xl object-cover border border-indigo-500/30'
                                        src={userData?.avatar}
                                        alt="Avatar"
                                        onError={() => setImageError(true)} 
                                    />
                                ) : (
                                    <div className='w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-300'>
                                        <User size={16} />
                                    </div>
                                )}
                                <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0c10]' />
                            </div>

                            <div className='flex-1 min-w-0'>
                                <p className='text-[13px] font-semibold text-slate-200 truncate'>{userData?.name || "User"}</p>
                                <div className='flex items-center gap-1.5 mt-0.5'>
                                    <span className='text-[10px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-1.5 py-0.2 rounded'>
                                        {userData?.plan || "free"}
                                    </span>
                                    <span className='text-[10px] text-slate-500'>
                                        {userData?.credits ?? 100} credits
                                    </span>
                                </div>
                            </div>

                            <div className='flex items-center gap-1'>
                                <button 
                                    onClick={() => setShowBilling(true)}
                                    title="View Plans & Credits"
                                    className='flex items-center justify-center w-7 h-7 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer'
                                >
                                    <Coins size={15} />
                                </button>
                                <button 
                                    onClick={() => {
                                        logOut();
                                        dispatch(setUserdata(null))
                                    }}
                                    title="Sign Out"
                                    className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer'
                                >
                                    <LogOut size={15} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='text-center py-1 text-xs text-slate-500'>
                            Guest Session
                        </div>
                    )}
                </div>
            </aside>

            <BillingDrawer
                open={showBilling}
                onClose={() => setShowBilling(false)}
            />
        </>
    )
}

export default SideBar
