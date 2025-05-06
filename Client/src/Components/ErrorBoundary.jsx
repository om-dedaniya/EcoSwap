// ErrorBoundary.jsx
import { Component } from "react";
import Error503 from "./ErrorPages/Error503";
import Error500 from "./ErrorPages/Error500";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorType: "500" };
  }

  static getDerivedStateFromError(error) {
    // You can inspect error to choose type (for now we default to 500)
    return { hasError: true, errorType: "500" };
  }

  render() {
    if (this.state.hasError) {
      if (this.state.errorType === "500") return <Error500 />;
      if (this.state.errorType === "503") return <Error503 />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
