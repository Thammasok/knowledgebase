import MainLayoutClient from './main-layout-client'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return <MainLayoutClient>{children}</MainLayoutClient>
}

export default MainLayout
