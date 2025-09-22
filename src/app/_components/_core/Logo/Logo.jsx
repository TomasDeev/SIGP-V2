import { Div, Link } from "@jumbo/shared";
import PropTypes from "prop-types";

const Logo = ({ mini = false, mode = "light", sx }) => {
  return (
    <Div sx={{ display: "inline-flex", ...sx }}>
      <Link to={"/"}>
        {!mini ? (
          <img
            src="/PNG SIGP.png"
            alt="SIGP"
            width={110}
            height={35}
            style={{ verticalAlign: "middle" }}
          />
        ) : (
          <img
            src="/PNG SIGP.png"
            alt="SIGP"
            width={35}
            height={35}
            style={{ verticalAlign: "middle" }}
          />
        )}
      </Link>
    </Div>
  );
};

export { Logo };

Logo.propTypes = {
  mini: PropTypes.bool,
  mode: PropTypes.oneOf(["light", "semi-dark", "dark"]).isRequired,
  sx: PropTypes.object,
};
