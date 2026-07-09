import "react";

declare module "react" {
  interface ViewTransitionProps {
    children?: React.ReactNode;
    name?: string;
    share?: string;
    enter?: string | Record<string, string>;
    exit?: string | Record<string, string>;
    default?: string | Record<string, string>;
    className?: string | Record<string, string>;
  }

  function ViewTransition(props: ViewTransitionProps): React.JSX.Element;
  function addTransitionType(type: string): void;
}
