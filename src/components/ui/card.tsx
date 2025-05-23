import React from 'react';

export function Card({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function CardHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function CardTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <h2 className={className}>{children}</h2>;
}

export function CardDescription({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={className}>{children}</p>;
}

export function CardContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function CardFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}
