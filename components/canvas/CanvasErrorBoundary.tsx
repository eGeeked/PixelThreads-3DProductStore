"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class CanvasErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("[v0] Canvas error caught:", error.message, errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center p-8">
              <p className="text-lg font-semibold text-foreground mb-2">3D Model Loading</p>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to load 3D model. Please refresh to try again.
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-foreground text-background rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
