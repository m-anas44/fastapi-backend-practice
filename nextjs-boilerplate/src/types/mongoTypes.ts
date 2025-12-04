// Types for MongoDB related entities will go here

export interface MongoUser extends Document {
  _id: string;
  name: string;
  email: string;
  assets: string[];
}
