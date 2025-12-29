import React from 'react';
import { type QRCodeProps as ReactQRProps } from 'react-qr-code';
import QRCodeReact from 'react-qr-code';

export interface QRCodeProps extends Omit<ReactQRProps, 'size'> {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({
  value,
  size = 180,
  className,
  ...props
}: QRCodeProps) {
  return (
    <div className={className}>
      <QRCodeReact
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 ${size} ${size}`}
        {...props}
      />
    </div>
  );
}
