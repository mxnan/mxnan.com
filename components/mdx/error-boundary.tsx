"use client";
import React from 'react';

class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MDX Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultFallback;
      return <Fallback error={this.state.error!} />;
    }
    return this.props.children;
  }
}

const DefaultFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
    <h3 className="text-lg font-semibold text-destructive mb-2">Content Error</h3>
    <p className="text-sm text-muted-foreground">
      There was an error rendering this content. Please try refreshing the page.
    </p>
    {process.env.NODE_ENV === 'development' && (
      <details className="mt-2">
        <summary className="cursor-pointer text-sm">Error Details</summary>
        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
          {error.message}
        </pre>
      </details>
    )}
  </div>
);

export default MDXErrorBoundary;