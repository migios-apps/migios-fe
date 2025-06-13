import { AuthProvider } from '@/auth'
import Theme from '@/components/template/Theme'
import Views from '@/pages'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Loading from './components/shared/Loading'
import './locales'

function App() {
  return (
    <Theme>
      <Suspense
        fallback={
          <div className="flex flex-auto flex-col h-[100vh]">
            <Loading loading={true} />
          </div>
        }
      >
        <BrowserRouter>
          <AuthProvider>
            <Views />
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </Theme>
  )
}

export default App
