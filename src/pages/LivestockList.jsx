// import { useEffect, useState } from "react";
import { Claim } from "../component/Claim";
import { ListItems } from "../component/ListItems";

export function LivestockList() {
  const url =
    "http://127.0.0.1:5000/api/animal/farm_profile/f1c574de-93d9-4cf0-881d-e4d1be318b89";

  return <ListItems Component={Claim} url={url} />;
}
