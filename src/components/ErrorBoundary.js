import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
    // Example: logErrorToMyService(error, errorInfo);
  }

  handleRefresh = () => {
      // Attempt to reload the page to recover
      window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            p: 3,
            backgroundColor: 'background.default'
          }}
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 'sm' }}>
            <Typography variant="h4" color="error" gutterBottom>
              😟 Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>
            {/* Optional: Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ my: 2, textAlign: 'left', maxHeight: '200px', overflowY: 'auto', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}
            <Button
                variant="contained"
                onClick={this.handleRefresh}
                color="primary"
            >
              Refresh Page
            </Button>
          </Paper>
        </Box>
      );
    }

    // If no error, render children
    return this.props.children;
  }
}

export default ErrorBoundary;
