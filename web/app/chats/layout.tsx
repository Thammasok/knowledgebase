import ChatLayoutClient from './chat-layout-client'

interface ChatLayoutProps {
  children: React.ReactNode
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return <ChatLayoutClient>{children}</ChatLayoutClient>
}

export default ChatLayout
