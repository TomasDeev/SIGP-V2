import { currentYear } from "@app/_utilities/constants/data";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <Div
      sx={{
        py: 2,
        px: { lg: 6, sm: 4, xs: 2.5 },
        borderTop: 2,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Div
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant={"body1"} color={"text.primary"}>
          {`Sistema SIGP © ${currentYear}`}
        </Typography>
      </Div>
    </Div>
  );
};

export { Footer };
