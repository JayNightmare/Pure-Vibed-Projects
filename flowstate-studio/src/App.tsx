import { AppShell } from './components/layout/AppShell'
import { SessionTimer } from './components/sessions/SessionTimer'
import { SessionList } from './components/sessions/SessionList'
import { SessionForm } from './components/sessions/SessionForm'
import { PresenceOverlay } from './components/overlays/PresenceOverlay'
import { useSessions } from './context/SessionContext'
import { usePresenceCheck } from './hooks/usePresenceCheck'

function AppContent() {
  const { pendingSession, saveSession, discardSession, isRunning, pauseSession } = useSessions();
  const { isCheckActive, intensity, confirmPresence } = usePresenceCheck(isRunning, pauseSession);

  return (
    <>
      {isCheckActive && (
        <PresenceOverlay intensity={intensity} onConfirm={confirmPresence} />
      )}

      <div className="flex flex-col items-center justify-start h-full w-full pt-8 md:pt-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#FF1744] tracking-tighter drop-shadow-[0_0_15px_rgba(255,23,68,0.8)]">
            FLOWSTATE STUDIO
          </h1>
          <p className="text-[#7C3AED] font-mono text-sm mt-2 tracking-widest uppercase">
            Flow session tracker
          </p>
        </div>
        
        <SessionTimer />
        <SessionList />
      </div>

      {pendingSession && (
        <SessionForm 
          onSubmit={saveSession} 
          onCancel={discardSession} 
        />
      )}
    </>
  );
}

function App() {
  return (
    <AppShell>
      <AppContent />
    </AppShell>
  )
}

export default App
