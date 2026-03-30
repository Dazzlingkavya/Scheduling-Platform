type AnyRecord = Record<string, unknown> & {
  _id?: { toString(): string } | string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeDocument<T extends AnyRecord>(doc: T) {
  return {
    ...doc,
    _id: doc._id?.toString?.() ?? doc._id,
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt
  };
}
