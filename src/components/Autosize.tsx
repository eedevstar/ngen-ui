/** @jsx jsx */
import * as R from 'ramda';
import React from 'react';
import { jsx } from '@emotion/core';

/**
 * Passes width/height of container according to layout-from-above
 * Has no size of its own
 */
export class Autosized extends React.Component<
  Partial<{
    css: any;
    className: any;
    padding: any;
    paddingLeft: any;
    paddingRight: any;
    paddingTop: any;
    paddingBottom: any;
    onSizeChanged: any;
  }>,
  Partial<{
    width: number;
    height: number;
    clientWidth: number;
    clientHeight: number;
  }>
> {
  private readonly selfRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.selfRef = React.createRef();
    this.state = {};
  }

  getPadding() {
    const {
      padding = 0,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = this.props;
    return {
      paddingLeft: paddingLeft || padding,
      paddingRight: paddingRight || padding,
      paddingTop: paddingTop || padding,
      paddingBottom: paddingBottom || padding,
    };
  }

  updateDim = () => {
    const { clientWidth, clientHeight } = this.selfRef.current;
    const {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    } = this.getPadding();
    const width = clientWidth - paddingLeft - paddingRight;
    const height = clientHeight - paddingTop - paddingBottom;
    if (
      width === this.state.width &&
      height === this.state.height &&
      clientWidth === this.state.clientWidth &&
      clientHeight === this.state.clientHeight
    ) {
      return;
    }
    this.setState({
      width,
      height,
      clientWidth,
      clientHeight,
    });
    if (this.props.onSizeChanged) {
      console.log(width, height);
      this.props.onSizeChanged({ width, height });
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDim);
    this.updateDim();
  }

  componentDidUpdate() {
    const { clientWidth, clientHeight } = this.selfRef.current || {};
    const { state } = this;
    if (
      state.clientWidth !== clientWidth ||
      state.clientHeight !== clientHeight
    ) {
      this.updateDim();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDim);
  }

  render() {
    const { css, children, className } = this.props;
    const {
      paddingLeft,
      paddingTop,
      paddingBottom,
      paddingRight,
    } = this.getPadding();
    const { width = 0, height = 0 } = this.state;
    return (
      <div
        className={className}
        css={{
          ...css,
          position: 'relative',
          paddingLeft,
          paddingTop,
          paddingBottom,
          paddingRight,
          overflow: 'hidden',
        }}
        ref={this.selfRef}
      >
        <div
          style={{
            width,
            height,
          }}
          css={{
            position: 'absolute',
          }}
        >
          {React.Children.map(children, child =>
            R.is(String, child)
              ? child
              : // @ts-ignore
                React.cloneElement(child, {
                  width,
                  height,
                })
          )}
        </div>
      </div>
    );
  }
}
