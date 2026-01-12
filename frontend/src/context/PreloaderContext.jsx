import { createContext, useContext, useState, useEffect } from 'react'

const PreloaderContext = createContext()

export const PreloaderProvider = ({ children }) => {
    // Check sessionStorage to persist across reloads within the same session
    const [hasPlayed, setHasPlayed] = useState(() => {
        return sessionStorage.getItem('preloaderPlayed') === 'true'
    })

    // Persist to sessionStorage when hasPlayed changes
    useEffect(() => {
        if (hasPlayed) {
            sessionStorage.setItem('preloaderPlayed', 'true')
        }
    }, [hasPlayed])

    return (
        <PreloaderContext.Provider value={{ hasPlayed, setHasPlayed }}>
            {children}
        </PreloaderContext.Provider>
    )
}

export const usePreloader = () => {
    const context = useContext(PreloaderContext)
    if (!context) {
        throw new Error('usePreloader must be used within a PreloaderProvider')
    }
    return context
}
