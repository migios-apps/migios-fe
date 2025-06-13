import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000 * 1, // 1 minute
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* {import.meta.env.MODE === 'development' &&
        createPortal(
          <ReactQueryDevtools
            buttonPosition="bottom-right"
            position="bottom"
            initialIsOpen={false}
          />,
          document.body
        )} */}
    </QueryClientProvider>
  </React.StrictMode>
)
