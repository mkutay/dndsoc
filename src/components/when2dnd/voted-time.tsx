"use client";

import { format, startOfDay, differenceInMinutes } from "date-fns";
import { GiArrowCluster } from "react-icons/gi";

import { TypographyHr } from "@/components/typography/blockquote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styling";

interface TimeSlot {
  from: Date;
  to: Date;
  participants: number;
}

interface DayAvailability {
  date: Date;
  timeSlots: TimeSlot[];
  totalParticipants: number;
}

export function VotedTime({
  votes,
}: {
  votes: {
    from: Date;
    to: Date;
    userHash: string | null;
  }[];
}) {
  const dayAvailability = (() => {
    if (votes.length === 0) return [];

    // Group votes by day
    const votesByDay = votes.reduce(
      (acc, vote) => {
        const dayKey = startOfDay(vote.from).toISOString();
        if (!acc[dayKey]) {
          acc[dayKey] = [];
        }
        acc[dayKey].push(vote);
        return acc;
      },
      {} as Record<string, typeof votes>,
    );

    // Convert to DayAvailability format
    const availability: DayAvailability[] = Object.entries(votesByDay)
      .map(([dayKey, dayVotes]) => {
        const date = new Date(dayKey);

        // Create time slots by merging overlapping votes
        const timeSlots = mergeTimeSlots(dayVotes);

        // Get unique participants for this day
        const uniqueParticipants = new Set(dayVotes.map((vote) => vote.userHash).filter(Boolean)).size;

        return {
          date,
          timeSlots,
          totalParticipants: uniqueParticipants,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return availability;
  })();

  const totalUniqueParticipants = (() => {
    const uniqueIds = new Set(votes.map((vote) => vote.userHash).filter(Boolean));
    return uniqueIds.size;
  })();

  if (votes.length === 0) {
    return (
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle>Group Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyParagraph className="text-muted-foreground">
            No votes have been submitted yet. When people vote on their availability, you&apos;ll see the group&apos;s
            schedule here.
          </TypographyParagraph>
        </CardContent>
      </Card>
    );
  }

  const bestTimeSlots = findBestTimeSlots(dayAvailability, totalUniqueParticipants);

  return (
    <div className="w-full mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap gap-1 items-center justify-between">
            Group Availability
            <Badge variant="secondary">
              {totalUniqueParticipants} participant{totalUniqueParticipants !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bestTimeSlots.length > 0 ? (
            <div className="mb-6 p-4 rounded-lg border">
              <TypographyH3 className="text-card-foreground mb-2 flex gap-2 font-headings">
                <GiArrowCluster className="w-8 h-8" /> Best Times (Everyone Available)
              </TypographyH3>
              <TypographyHr className="my-3" />
              <div className="sm:space-y-2 space-y-4 mt-1">
                {bestTimeSlots.map((slot, index) => (
                  <div key={index} className="flex flex-wrap gap-1 items-center justify-between">
                    <span className="text-lg">{format(slot.date, "EEEE, MMM do")}</span>
                    <div className="flex flex-wrap gap-1">
                      {slot.timeSlots.map((timeSlot, timeIndex) => (
                        <Badge key={timeIndex} variant="default" className="flex">
                          {format(timeSlot.from, "HH:mm")}
                          <span className="ml-1.5 mr-1">to</span>
                          {format(timeSlot.to, "HH:mm")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <TypographyParagraph className="text-muted-foreground mb-6">
              Unfortunately, no time slots found where everyone is available.
            </TypographyParagraph>
          )}

          <CardTitle className="mb-4">Daily Breakdown</CardTitle>
          <div className="space-y-4">
            {dayAvailability.map((day) => (
              <DayAvailabilityCard key={day.date.toISOString()} day={day} totalParticipants={totalUniqueParticipants} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DayAvailabilityCard({ day, totalParticipants }: { day: DayAvailability; totalParticipants: number }) {
  const availabilityPercentage = Math.round((day.totalParticipants / totalParticipants) * 100);

  return (
    <div className="border-l-4 border-l-primary border px-5 py-4 rounded-lg">
      <div className="flex flex-wrap gap-1 items-center justify-between">
        <CardTitle className="text-2xl">{format(day.date, "EEEE, MMMM do")}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={availabilityPercentage === 100 ? "default" : "secondary"}>
            {day.totalParticipants}/{totalParticipants} available
          </Badge>
          <Badge variant="outline">{availabilityPercentage}%</Badge>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {day.timeSlots.map((slot, index) => (
            <TimeSlotBadge key={index} slot={slot} totalParticipants={totalParticipants} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimeSlotBadge({ slot, totalParticipants }: { slot: TimeSlot; totalParticipants: number }) {
  const percentage = Math.round((slot.participants / totalParticipants) * 100);
  const duration = differenceInMinutes(slot.to, slot.from);

  const getVariant = () => {
    if (percentage === 100) return "default";
    if (percentage >= 75) return "secondary";
    return "outline";
  };

  return (
    <Badge variant={getVariant()} className={cn("flex flex-col items-center py-3 px-4")}>
      <div className="font-medium text-sm">
        {format(slot.from, "HH:mm")}
        <span className="ml-1.5 mr-1">to</span>
        {format(slot.to, "HH:mm")}
      </div>
      <div className="text-xs">
        {slot.participants}/{totalParticipants} ({percentage}%)
      </div>
      <div className="text-xs">{duration}min</div>
    </Badge>
  );
}

// Helper function to merge overlapping time slots and count participants
function mergeTimeSlots(votes: { from: Date; to: Date; userHash: string | null }[]): TimeSlot[] {
  if (votes.length === 0) return [];

  // Get all unique time points (start and end times)
  const timePoints = new Set<number>();
  votes.forEach((vote) => {
    if (vote.userHash) {
      timePoints.add(vote.from.getTime());
      timePoints.add(vote.to.getTime());
    }
  });

  // Sort time points
  const sortedTimePoints = Array.from(timePoints).sort((a, b) => a - b);

  const timeSlots: TimeSlot[] = [];

  // Create intervals between consecutive time points
  for (let i = 0; i < sortedTimePoints.length - 1; i++) {
    const intervalStart = new Date(sortedTimePoints[i]);
    const intervalEnd = new Date(sortedTimePoints[i + 1]);

    // Count unique participants available during this interval
    const availableUsers = new Set(
      votes
        .filter((vote) => vote.userHash && vote.from <= intervalStart && vote.to >= intervalEnd)
        .map((vote) => vote.userHash),
    );
    const participants = availableUsers.size;

    if (participants > 0) {
      // Check if we can merge with the previous slot
      const lastSlot = timeSlots[timeSlots.length - 1];
      if (lastSlot && lastSlot.to.getTime() === intervalStart.getTime() && lastSlot.participants === participants) {
        // Extend the previous slot
        lastSlot.to = intervalEnd;
      } else {
        // Create a new slot
        timeSlots.push({
          from: intervalStart,
          to: intervalEnd,
          participants,
        });
      }
    }
  }

  return timeSlots;
}

// Helper function to find time slots where everyone is available
function findBestTimeSlots(dayAvailability: DayAvailability[], totalParticipants: number): DayAvailability[] {
  return dayAvailability
    .map((day) => ({
      ...day,
      timeSlots: day.timeSlots.filter((slot) => slot.participants === totalParticipants),
    }))
    .filter((day) => day.timeSlots.length > 0);
}
