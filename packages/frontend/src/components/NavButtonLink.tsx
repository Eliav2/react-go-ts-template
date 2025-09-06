import React from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface NavButtonLinkProps extends ButtonProps<"a"> {
  // Add any additional props you want to pass to the Button
}

const NavButtonLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  NavButtonLinkProps
>((props, ref) => <Button ref={ref} component="a" {...props} />);

const CreatedNavButtonLinkComponent = createLink(NavButtonLinkComponent);

export const NavButtonLink: LinkComponent<typeof NavButtonLinkComponent> = (
  props
) => {
  return (
    <CreatedNavButtonLinkComponent
      color="inherit"
      activeProps={{
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          fontWeight: "bold",
        },
      }}
      sx={{
        textDecoration: "none",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
      preload="intent"
      {...props}
    />
  );
};
