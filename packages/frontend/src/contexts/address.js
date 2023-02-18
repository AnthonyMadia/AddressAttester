import { createContext } from "react";
import { makeAutoObservable } from "mobx";
import { SERVER } from "../config";

class Address {
  hasSignedUp = false;
  address = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
  }
}

export const address = new Address();
export default createContext(address);
