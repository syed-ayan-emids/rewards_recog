import { StoreProvider } from './store'
import AppShell from './components/templates/AppShell'

function Root() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  )
}

export default Root
