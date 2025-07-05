import { z } from "zod";
import { getEndOfDate, getMidnightOfDate } from "@/utils/formatting";

export const enterCodeFormSchema = z.object({
  code: z.string().min(1, "Code is required."),
});

const baseDateRangeSchema = z
  .object({
    from: z.date().min(getMidnightOfDate(new Date()), "Start date must be today or in the future."),
    to: z.date().max(
      getEndOfDate(new Date(4 * 7 * 24 * 60 * 60 * 1000 + Date.now())), // four weeks from now
      "End date must be within four weeks from today.",
    ),
  })
  .refine((data) => data.from <= data.to, {
    message: "Start date must be before end date.",
    path: ["to"],
  });

const basePollSchema = z.object({
  title: z.string().min(1, "Title is required."),
  deadline: z.date().min(new Date(), "Deadline must be today or in the future.").optional(),
});

export const createPollFormSchema = basePollSchema.extend({
  dateRange: baseDateRangeSchema,
});

export const editPollFormSchema = basePollSchema.extend({
  dateRange: baseDateRangeSchema.and(
    z.object({
      from: z
        .date()
        .min(
          getMidnightOfDate(new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000)),
          "Start date must be within three weeks from today.",
        ),
    }),
  ),
});

export const pollVoteFormSchema = z
  .object({
    dateRange: baseDateRangeSchema.and(
      z.object({
        from: z.date().min(getMidnightOfDate(new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000)), {
          message: "Start date must be within three weeks from today.",
        }),
      }),
    ),
    dateSelections: z.array(
      z
        .object({
          date: z.date(),
          times: z
            .array(
              z
                .object({
                  from: z.date(),
                  to: z.date(),
                })
                .refine(({ from, to }) => from < to, {
                  message: "Start time must be before end time.",
                })
                .refine(({ from, to }) => new Date(from).toDateString() === new Date(to).toDateString(), {
                  message: "Start and end times must be on the same day.",
                }),
            )
            .min(1, {
              message: "At least one time selection is required for each date.",
            }),
        })
        // .refine(
        //   ({ date, times }) => {
        //     const dateStart = getMidnightOfDate(date);
        //     const dateEnd = getEndOfDate(date);
        //     return times.every(
        //       ({ from, to }) => from >= dateStart && from <= dateEnd && to >= dateStart && to <= dateEnd,
        //     );
        //   },
        //   {
        //     message: "All time selections must be within the selected date.",
        //   },
        // )
        .refine(
          ({ times }) => {
            // Check for overlapping time ranges
            for (let i = 0; i < times.length; i++) {
              for (let j = i + 1; j < times.length; j++) {
                const time1 = times[i];
                const time2 = times[j];
                if (time1.from < time2.to && time2.from < time1.to) {
                  return false;
                }
              }
            }
            return true;
          },
          {
            message: "Time selections cannot overlap on the same date.",
          },
        ),
    ),
  })
  .refine((data) => data.dateSelections.every(({ date }) => date >= data.dateRange.from && date <= data.dateRange.to), {
    message: "All date selections must be within the specified date range.",
  })
  .refine(
    (data) => {
      const uniqueDates = new Set(data.dateSelections.map(({ date }) => date.toDateString()));
      return uniqueDates.size === data.dateSelections.length;
    },
    {
      message: "Duplicate date selections are not allowed.",
    },
  );
