import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Check, Crown, Sparkles, X, Zap } from 'lucide-react'
import { useSelector } from 'react-redux'
import { createOrder } from '../features/createOrder'
import { verifyPayment } from '../features/verifyPayment'

function BillingDrawer({ open, onClose }) {
    const { userData } = useSelector(state => state.user)

    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data?.order?.amount,
                currency: data?.order?.currency,
                name: "orbitAI",
                description: `${data?.plan?.name} Plan`,
                order_id: data?.order?.id,
                handler: async (response) => {
                    try {
                        const res = await verifyPayment(response)
                        console.log(res)
                        onClose()
                    } catch (error) {
                        console.log("Payment verification error:", error)
                    }
                },
                theme: {
                    color: "#6366F1"
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log("Order creation error:", error)
        }
    }

    const currentCredits = userData?.credits ?? 0
    const totalCredits = userData?.totalCredits || 100
    const percentage = Math.min(100, Math.round((currentCredits / totalCredits) * 100))

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="fixed right-0 top-0 z-50 h-screen w-full sm:w-[400px] bg-[#0c0e14] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className='flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#0f1118]'>
                            <div>
                                <h2 className='text-white text-base font-bold tracking-tight flex items-center gap-2'>
                                    <Sparkles size={16} className='text-indigo-400' />
                                    Plans & Quota
                                </h2>
                                <p className='text-slate-400 text-xs mt-0.5'>
                                    Supercharge your orbitAI capabilities
                                </p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Current Usage Widget */}
                        <div className='p-5 pb-3'>
                            <div className='rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4.5 shadow-sm'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className='text-slate-400 text-xs font-medium uppercase tracking-wider'>
                                            Active Membership
                                        </p>
                                        <h3 className='text-white text-lg font-bold capitalize mt-0.5'>
                                            {userData?.plan || "Free"} Tier
                                        </h3>
                                    </div>
                                    <div className='w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400'>
                                        <Crown size={18} />
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    <div className='flex justify-between text-xs text-slate-400 mb-2 font-medium'>
                                        <span>Credits Balance</span>
                                        <span className='text-slate-200'>{currentCredits} / {totalCredits}</span>
                                    </div>

                                    <div className='h-2 rounded-full bg-white/[0.08] overflow-hidden p-0.5'>
                                        <div 
                                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Tiers */}
                        <div className='px-5 flex-1 overflow-y-auto space-y-4 py-2 [scrollbar-width:thin]'>
                            {/* Starter Plan */}
                            <div className='rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-white/[0.15] transition-all'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h3 className='text-white font-bold text-base'>Starter</h3>
                                        <p className='text-xs text-slate-400 mt-0.5'>Ideal for students & hobbyists</p>
                                    </div>
                                    <div className='text-right'>
                                        <span className='text-indigo-400 text-2xl font-extrabold'>₹199</span>
                                        <span className='text-xs text-slate-500 block'>one-time</span>
                                    </div>
                                </div>

                                <div className='space-y-2 mt-4 text-xs text-slate-300'>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span><strong>500 Credits</strong> valid forever</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span>Access to Code & Chat Agents</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span>PDF RAG document queries</span>
                                    </div>
                                </div>

                                <button 
                                    className='mt-5 w-full rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white py-2.5 text-xs font-semibold transition-all cursor-pointer border border-white/[0.08]'
                                    onClick={() => handleUpgrade("starter")}
                                >
                                    Choose Starter
                                </button>
                            </div>

                            {/* Pro Plan (Highlighted) */}
                            <div className='rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 to-transparent p-5 relative shadow-lg shadow-indigo-500/5'>
                                <div className='absolute -top-3 right-4 px-2.5 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm'>
                                    Most Popular
                                </div>

                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h3 className='text-white font-bold text-base flex items-center gap-1.5'>
                                            Pro Power
                                            <Zap size={14} className='text-amber-400 fill-amber-400' />
                                        </h3>
                                        <p className='text-xs text-slate-400 mt-0.5'>For builders, devs & researchers</p>
                                    </div>
                                    <div className='text-right'>
                                        <span className='text-indigo-400 text-2xl font-extrabold'>₹499</span>
                                        <span className='text-xs text-slate-500 block'>one-time</span>
                                    </div>
                                </div>

                                <div className='space-y-2 mt-4 text-xs text-slate-300'>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span><strong>1,000 Credits</strong> premium pool</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span>Full PPTX & PDF Slide generation</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span>Unlimited Live Sandboxes & Export</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check size={14} className='text-emerald-400 shrink-0' />
                                        <span>Priority processing speed</span>
                                    </div>
                                </div>

                                <button 
                                    className='mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white py-2.5 text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer'
                                    onClick={() => handleUpgrade("pro")}
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default BillingDrawer
