import React, { Component } from 'react';
import ReactLoading from 'react-loading';

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false, // 控制加载指示器的可见性
    };
  }

  // 在某个事件或异步操作中显示加载指示器
  showLoadingIndicator = () => {
    this.setState({ isLoading: true });
  }

  // 在某个事件或异步操作中隐藏加载指示器
  hideLoadingIndicator = () => {
    this.setState({ isLoading: false });
  }

  render() {
    return (
      <div>
        <h1>My Page</h1>
        <button onClick={this.showLoadingIndicator}>显示加载指示器</button>
        <button onClick={this.hideLoadingIndicator}>隐藏加载指示器</button>

        {this.state.isLoading && (
          <div className="loading-overlay">
            <ReactLoading type={'spin'} color={'blue'} height={50} width={50} />
          </div>
        )}
      </div>
    );
  }
}

export default MyPage;