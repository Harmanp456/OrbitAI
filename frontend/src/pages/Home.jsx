import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from 'react-redux'
import { setUserdata } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import ChatArea from '../components/ChatArea'
import Artifact from '../components/Artifact'
import OrbitLogo from '../components/OrbitLogo'
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

function Home() {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log("Auth error:", error)
        }
    }

    const googleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            await handleLogin(token)
        } catch (error) {
            console.log("Google popup error:", error)
        }
    }

    return (
        <div className='h-screen flex bg-[#090a0f] text-white overflow-hidden'>
            <SideBar />
            <ChatArea />
            <Artifact />

            {/* Authentication Modal */}
            {!userData && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4'>
                    <div className='w-full max-w-[380px] bg-[#11141e] border border-white/[0.1] rounded-3xl p-7 flex flex-col gap-6 shadow-2xl relative overflow-hidden'>
                        {/* Background subtle radial ambient glow */}
                        <div className='absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none' />
                        <div className='absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none' />

                        <div className='flex flex-col items-center text-center gap-3 relative'>
                            <div className='p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner mb-1'>
                                <OrbitLogo size={38} />
                            </div>
                            
                            <div>
                                <h2 className='text-xl font-bold text-white tracking-tight'>
                                    Welcome to orbitAI
                                </h2>
                                <p className='text-xs text-slate-400 mt-1 leading-relaxed'>
                                    Autonomous Multi-Agent Workspace for Coding, Research & Production
                                </p>
                            </div>
                        </div>

                        {/* Feature Checklist */}
                        <div className='space-y-2.5 py-1 text-xs text-slate-300'>
                            <div className='flex items-center gap-2.5'>
                                <CheckCircle2 size={15} className='text-emerald-400 shrink-0' />
                                <span>Multi-agent Coding Sandbox & Live Preview</span>
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <CheckCircle2 size={15} className='text-emerald-400 shrink-0' />
                                <span>Automated PDF Intelligence & Slide Decks</span>
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <CheckCircle2 size={15} className='text-emerald-400 shrink-0' />
                                <span>Includes 100 free credits on sign up</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <div className='space-y-3 pt-1'>
                            <button
                                type="button"
                                onClick={googleLogin}
                                className='w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-lg shadow-white/5 active:scale-[0.99]'
                            >
                                <FcGoogle size={18} />
                                Continue with Google
                            </button>

                            <div className='flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center'>
                                <ShieldCheck size={13} className='text-slate-400' />
                                <span>Protected by Firebase Enterprise Auth</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
