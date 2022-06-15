import mongoose from "mongoose";
import AutoIncrementField from "mongoose-sequence";
const AutoIncrement = AutoIncrementField(mongoose);
import { inputFields } from "./clients_enum.js";
import generateFields from "../../utils/generatedFields.js";
const modalFields = generateFields(inputFields);


const clientSchema = mongoose.Schema(
  modalFields,  
  {
    timestamps: true,
  }
);

clientSchema.plugin(AutoIncrement, {
    inc_field: "client_id",
    start_seq: 1000,
  });


const Client = mongoose.model("Client", clientSchema);

export default Client;
