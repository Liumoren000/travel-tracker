import { Component } from 'react';
import { Button, Result } from 'antd';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.removeItem('travel-tracker-routes');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f5f5f5'
        }}>
          <Result
            status="error"
            title="页面出现错误"
            subTitle={this.state.error?.message || '未知错误'}
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>,
              <Button key="reset" onClick={this.handleReset}>
                重置数据并刷新
              </Button>
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
