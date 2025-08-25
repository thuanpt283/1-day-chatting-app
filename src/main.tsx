import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/services/apolloClient.ts'
import { InfoProvider } from './components/context/common'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <InfoProvider>
        <App />
      </InfoProvider>
    </ApolloProvider>
  </StrictMode>,
)
