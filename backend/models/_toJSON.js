// O frontend (herdado do json-server) espera "id", não "_id".
export const toJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
};
