import type { ComponentProps } from 'react';

type NextImageStubProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: string;
  fill?: boolean;
  preload?: boolean;
};

export default function NextImageStub({ fill, preload, alt, ...rest }: NextImageStubProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      data-preload={preload ? 'true' : undefined}
      {...rest}
    />
  );
}
