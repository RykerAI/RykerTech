
import type { PropsWithChildren } from 'react';

interface PageTitleProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight font-headline">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
