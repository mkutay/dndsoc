"use client";

import { useOptimistic } from "react";

import { PollVoteForm } from "./poll-vote-form";
import { VotedTime } from "./voted-time";

type Vote = {
  from: Date;
  to: Date;
  userHash: string | null;
};

type OptimisticAction = {
  type: "ADD_VOTES" | "REVERT_VOTES";
  votes: {
    from: Date;
    to: Date;
  }[];
  userHash: string;
  originalVotes?: Vote[]; // For reverting on error
};

function optimisticReducer(state: Vote[], action: OptimisticAction): Vote[] {
  switch (action.type) {
    case "ADD_VOTES":
      // Remove existing votes from this user
      const filteredVotes = state.filter((vote) => vote.userHash !== action.userHash);

      // Add new votes from this user
      const newVotes = action.votes.map((vote) => ({
        from: vote.from,
        to: vote.to,
        userHash: action.userHash,
      }));

      return [...filteredVotes, ...newVotes];

    case "REVERT_VOTES":
      // Revert to original state if an error occurs
      if (action.originalVotes) {
        return action.originalVotes;
      }
      return state;
  }
}

export function OptimisticWrapper({
  code,
  authUserUuid,
  pollId,
  dateRange,
  createdAt,
  deadline,
  title,
  userVotes,
  allVotes,
}: {
  code: string;
  authUserUuid: string;
  pollId: string;
  dateRange: { from: Date; to: Date };
  createdAt: Date;
  deadline: Date | undefined;
  title: string;
  userVotes: {
    from: Date;
    to: Date;
  }[];
  allVotes: {
    from: Date;
    to: Date;
    userHash: string | null;
  }[];
}) {
  const [optimisticVotes, addOptimisticVote] = useOptimistic(allVotes, optimisticReducer);

  const handleOptimisticUpdate = (votes: { from: Date; to: Date }[]) => {
    addOptimisticVote({
      type: "ADD_VOTES",
      votes,
      userHash: authUserUuid,
    });
  };

  const handleOptimisticRevert = () => {
    addOptimisticVote({
      type: "REVERT_VOTES",
      votes: [],
      userHash: authUserUuid,
      originalVotes: allVotes,
    });
  };

  return (
    <>
      <VotedTime votes={optimisticVotes} />
      <PollVoteForm
        code={code}
        authUserUuid={authUserUuid}
        pollId={pollId}
        dateRange={dateRange}
        createdAt={createdAt}
        deadline={deadline}
        title={title}
        votes={userVotes}
        onOptimisticUpdate={handleOptimisticUpdate}
        onOptimisticRevert={handleOptimisticRevert}
      />
    </>
  );
}
