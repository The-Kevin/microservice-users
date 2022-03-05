import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserSerialize {
  first_name: string;
  last_name: string;
  email: string;
}

export interface User extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  serialize: () => UserSerialize;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema<User> = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});

UserSchema.methods.serialize = function (): UserSerialize {
  const obj = {
    _id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    email: this.email,
  };
  return obj;
};

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const SALT_WORK_FACTOR = 10;
UserSchema.pre<User>('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

export default mongoose.model<User>('User', UserSchema);
