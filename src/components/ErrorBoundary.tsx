import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Something went wrong. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-800 max-h-64 overflow-auto">
                <summary className="cursor-pointer font-semibold text-red-900 dark:text-red-200 mb-2">
                  Error Details (Click to expand)
                </summary>
                <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {'\n\nStack:\n'}
                  {this.state.error.stack || 'No stack trace available'}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
