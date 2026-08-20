// import { useEffect, useState } from "react";
import { Claim } from "../component/Claim";
import { ListItems } from "../component/ListItems";

export function ClaimsList() {
  const url = "http://127.0.0.1:5000/api/claims";

  return <ListItems Component={Claim} url={url} />;
}
