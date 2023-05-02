import React, { type ReactNode } from 'react'

interface BackgroundWrapperProps {
  children: ReactNode
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return <div className="bg-wrapper min-h-screen">{children}</div>
}

export default BackgroundWrapper