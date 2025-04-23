import { getAchievementsFromIds, getCombinedAchievements } from "./achievements";
import { getCampaign, getCampaigns, getCampaignsByCharacterUuid, getCampaignsByDMUuid, getCampaignsByPlayerUuid } from "./campaigns";
import { deleteCharacterClass, getCharacterByShortened, getCharacterPlayerByShortened, getCharacters, getCharactersByPlayerUuid, upsertCharacterClass } from "./characters";
import { insertClasses } from "./classes";
import { getDMByUsername, getDMs, getDMUser, insertDM } from "./dms";
import { getParties, getPartyByDMUuid, getPartyByShortened } from "./parties";
import { getPlayerAuthUserUuid, getPlayerByUsername, getPlayers, insertPlayer, upsertPlayer, getPlayerUser, getPlayerRoleUser } from "./players";
import { deleteCharacterRace, upsertCharacterRace, upsertRace } from "./races";
import { getRole, getUserRole, insertRole } from "./roles";
import { getUserByAuthUuid, getUsers, insertUser } from "./users";

const Users = {
  Insert: insertUser,
  Get: {
    All: getUsers,
    Auth: getUserByAuthUuid,
  }
};

const Roles = {
  Insert: insertRole,
  Get: {
    Auth: getRole,
    With: {
      User: getUserRole,
    }
  }
};

const Races = {
  Upsert: upsertRace,
};

const CharacterRace = {
  Delete: deleteCharacterRace,
  Upsert: upsertCharacterRace,
};

const Players = {
  Insert: insertPlayer,
  Upsert: upsertPlayer,
  Get: {
    With: {
      User: getPlayerUser
    },
    All: getPlayers,
    Auth: getPlayerAuthUserUuid,
    Username: getPlayerByUsername,
  },
};

const Parties = {
  Get: {
    All: getParties,
    Shortened: getPartyByShortened,
    DM: getPartyByDMUuid,
  },
};

const DMs = {
  Insert: insertDM,
  Get: {
    All: getDMs,
    Username: getDMByUsername,
    With: {
      User: getDMUser,
    },
  },
};

const Classes = {
  Insert: insertClasses,
};

const Characters = {
  Get: {
    All: getCharacters,
    Shortened: getCharacterByShortened,
    Player: getCharactersByPlayerUuid,
    With: {
      Player: {
        Shortened: getCharacterPlayerByShortened,
      },
    },
  }
};

const CharacterClass = {
  Delete: deleteCharacterClass,
  Upsert: upsertCharacterClass,
};

const Campaigns = {
  Get: {
    All: getCampaigns,
    Player: getCampaignsByPlayerUuid,
    Character: getCampaignsByCharacterUuid,
    DM: getCampaignsByDMUuid,
    Shortened: getCampaign,
  },
};

const Achievements = {
  Get: {
    Id: getAchievementsFromIds,
    Combined: getCombinedAchievements,
  },
};

const Auth = {
  Get: {
    With: {
      PlayerAndRole: getPlayerRoleUser,
    },
  },
};

const DB = {
  Users,
  Roles,
  Races,
  CharacterRace,
  Players,
  Parties,
  DMs,
  Classes,
  Characters,
  CharacterClass,
  Campaigns,
  Achievements,
  Auth,
};

export default DB;