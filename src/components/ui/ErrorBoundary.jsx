import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Only log in dev
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <h2 className="text-white font-black text-lg uppercase tracking-widest mb-2">
            Something went wrong
          </h2>
          <p className="text-white/40 text-sm mb-6">
            A display error occurred. Tap below to go back.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.history.back();
            }}
            className="px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            ← Go Back
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
