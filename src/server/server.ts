import { forgotPasswordAction } from "./auth/forgot-password";
import { resetPasswordAction } from "./auth/reset-password";
import { signInAction } from "./auth/sign-in";
import { signOutAction } from "./auth/sign-out";
import { signUpAction } from "./auth/sign-up";
import { addCampaignToParty, removeCampaignFromParty } from "./campaigns";
import { addCharacterToParty, insertCharacter, removeCharacterFromParty, updateCharacter } from "./characters";
import { addPartyToDM, removePartyFromDM, updateDM } from "./dms";
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
  Remove: {
    Party: removeCharacterFromParty,
  }
};

const DMs = {
  Update: updateDM,
  Remove: {
    Party: removePartyFromDM,
  },
  Add: {
    Party: addPartyToDM,
  }
};

const Parties = {
  Insert: insertParty,
  Update: {
    Player: updatePlayerParty,
    DM: updateDMParty,
  },
  Add: {
    Campaign: addCampaignToParty,
    Character: addCharacterToParty,
  }
};

const Players = {
  Update: updatePlayer,
};

const Roles = {
  Update: updateRole,
};

const Campaigns = {
  Remove: {
    Party: removeCampaignFromParty,
  },
};

const Server = {
  Auth,
  Characters,
  DMs,
  Parties,
  Players,
  Roles,
  Campaigns,
};

export default Server;