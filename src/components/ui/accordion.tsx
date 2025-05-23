import * as React from 'react';

export function Accordion({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export function AccordionItem({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export function AccordionTrigger({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>;
}

export function AccordionContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
} 