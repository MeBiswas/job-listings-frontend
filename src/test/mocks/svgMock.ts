import React from 'react';

const SvgMock = React.forwardRef<SVGSVGElement>((props, ref) =>
  React.createElement('svg', { ref, ...props })
);
SvgMock.displayName = 'SvgMock';

export default SvgMock;
export const ReactComponent = SvgMock;
