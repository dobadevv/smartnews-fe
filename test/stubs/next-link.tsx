import type { ComponentProps } from 'react';

type NextLinkStubProps = Omit<ComponentProps<'a'>, 'href'> & { href: string };

export default function NextLinkStub({ href, children, ...rest }: NextLinkStubProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
