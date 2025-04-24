import { forgotPasswordAction } from "./auth/forgot-password";
import { resetPasswordAction } from "./auth/reset-password";
import { signInAction } from "./auth/sign-in";
import { signOutAction } from "./auth/sign-out";
import { signUpAction } from "./auth/sign-up";
import { insertCharacter, updateCharacter } from "./characters";
import { updateDM } from "./dms";
import { insertParty, updateDMParty, updatePlayerParty } from "./parties";
import { updatePlayer } from "./players";
import { updateRole } from "./roles";

const Auth = {
  ForgotPassword: forgotPasswordAction,
  ResetPassword: resetPasswordAction,
  SignIn: signInAction,
  SignOut: signOutAction,
  SignUp: signUpAction,
};

const Characters = {
  Insert: insertCharacter,
  Update: updateCharacter,
};

const DMs = {
  Update: updateDM,
};

const Parties = {
  Insert: insertParty,
  Update: {
    Player: updatePlayerParty,
    DM: updateDMParty,
  }
};

const Players = {
  Update: updatePlayer,
};

const Roles = {
  Update: updateRole,
}

const Server = {
  Auth,
  Characters,
  DMs,
  Parties,
  Players,
  Roles,
};

export default Server;