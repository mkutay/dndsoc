"use client";

import { CheckIcon, CircleIcon } from "lucide-react";
import { useState } from "react";

import { TypographyLarge, TypographySmall } from "./typography/paragraph";
import { TypographyHr } from "./typography/blockquote";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { voteOnPoll } from "@/server/polls";
import { actionResultToResult } from "@/types/error-typing";

export function Options({
  options,
  votedId,
  pollId,
  expired,
}: {
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  votedId: string | null | undefined;
  pollId: string;
  expired: boolean;
}) {
  const [votedOptionId, setVotedOptionId] = useState(votedId);
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const onVote = (optionId: string) => {
    setPending(true);

    if (votedOptionId !== optionId) {
      voteOnPoll({ optionId, pollId }).then((result) => {
        actionResultToResult(result).match(
          () => {
            setVotedOptionId(optionId);
          },
          (error) => {
            toast({
              title: "Error Voting, refresh?",
              description: error.message,
              variant: "destructive",
            });
          },
        );
      });
    } else {
      voteOnPoll({ optionId, pollId }).then((result) => {
        actionResultToResult(result).match(
          () => {
            setVotedOptionId(null);
          },
          (error) => {
            toast({
              title: "Error Voting, refresh?",
              description: error.message,
              variant: "destructive",
            });
          },
        );
      });
    }

    setPending(false);
  };

  const optionsNodes: React.ReactNode[] = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    let currentVoteCount = option.votes;

    // Calculate vote changes based on original vs current vote
    // If this option is currently voted for but wasn't originally, +1
    if (votedOptionId === option.id && votedId !== option.id) {
      currentVoteCount += 1;
    }
    // If this option was originally voted for but isn't currently, -1
    if (votedId === option.id && votedOptionId !== option.id) {
      currentVoteCount -= 1;
    }

    optionsNodes.push(
      <div key={option.id} className="flex flex-col gap-2">
        <Option
          optionId={option.id}
          optionText={option.text}
          voteCount={currentVoteCount}
          votedOptionId={votedOptionId}
          expired={expired}
          onVote={() => onVote(option.id)}
          pending={pending}
        />
      </div>,
    );

    if (i !== options.length - 1) {
      optionsNodes.push(<TypographyHr key={`hr-${option.id}`} />);
    }
  }

  return <div className="flex flex-col gap-6 mt-6">{optionsNodes}</div>;
}

export function Option({
  optionId,
  optionText,
  voteCount,
  votedOptionId,
  expired,
  onVote,
  pending,
}: {
  optionId: string;
  optionText: string;
  voteCount: number;
  votedOptionId: string | null | undefined;
  expired: boolean;
  onVote: () => void;
  pending: boolean;
}) {
  const voted = votedOptionId === optionId;
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2 max-w-prose">
      <TypographyLarge className="text-xl font-normal pl-6 py-2 border-l-2 border-border">{optionText}</TypographyLarge>
      <TypographySmall className="text-lg">VOTES: {voteCount}</TypographySmall>
      <Button
        className="w-[100px] mt-3 flex flex-row gap-2 items-center"
        variant={voted ? "secondary" : "default"}
        onClick={
          votedOptionId !== undefined
            ? onVote
            : () => {
                toast({
                  title: "You must be logged in to vote!",
                  description: "Please log in to cast your vote.",
                  variant: "destructive",
                });
              }
        }
        disabled={pending || expired}
      >
        {voted ? (
          <CheckIcon className="w-4 h-4" strokeWidth="2.5px" />
        ) : (
          <CircleIcon className="w-4 h-4" strokeWidth="2.5px" />
        )}
        {voted ? "Voted" : "Vote!"}
      </Button>
    </div>
  );
}
