// All types will go in this folder

type Asset = "crypto" | "stocks" | "forex";

export interface User {
  id: string;
  name: string;
  email: string;
  assets: Asset[];
}
