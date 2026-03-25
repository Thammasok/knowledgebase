import SecondLayoutClient from './second-layout-client'

interface SecondLayoutProps {
  children: React.ReactNode
}

const SecondLayout = ({ children }: SecondLayoutProps) => {
  return <SecondLayoutClient>{children}</SecondLayoutClient>
}

export default SecondLayout
