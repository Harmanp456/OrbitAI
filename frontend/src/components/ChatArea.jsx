import React, { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setArtifacts, setMessages } from '../redux/messageSlice'

function ChatArea() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation) {
        if (selectedConversation.title === "New Chat") return;
        try {
          const data = await getMessages(selectedConversation?._id)
          dispatch(setMessages(data || []))
          const latestArtifactMessage = [...(data || [])].reverse().find(msg => msg.artifacts && msg.artifacts.length > 0)
          dispatch(setArtifacts(latestArtifactMessage?.artifacts || []))
        } catch (err) {
          console.log("Error loading messages:", err)
        }
      }
    }

    getMesg()
  }, [selectedConversation?._id])

  return (
    <div className='flex-1 flex flex-col min-w-0 bg-[#090a0f] relative overflow-hidden'>
      {/* Ambient background glow */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-indigo-500/[0.08] via-purple-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none' />

      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea
