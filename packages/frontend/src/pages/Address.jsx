import React from "react";
import { observer } from "mobx-react-lite";
import "./dashboard.css";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";

import User from "../contexts/User";

export default observer(() => {
  return (
    <div>
      <h1>Claim an address</h1>
      <h2>...logic for claiming an address</h2>
      {/* allow user to click button to hash something */}
      {/* todo: call address function to call relay */}
      <Button>Claim Address</Button>
    </div>
  );
});
