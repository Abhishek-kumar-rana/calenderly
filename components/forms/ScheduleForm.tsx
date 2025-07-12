"use client"

import { DAYS_OF_WEEK_IN_ORDER } from "@/constants"
import { timeToFloat } from "@/lib/utils"
import { scheduleFormSchema } from "@/schema/schedule"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { formatTimezoneOffset } from "@/lib/formatters"
import { Fragment } from "react"
import { Button } from "../ui/button"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { toast } from "sonner"
import { saveSchedule } from "@/server/actions/schedule"
import groupBy from "lodash/groupBy"

type Availability = {
  startTime: string
  endTime: string
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}

export function ScheduleForm({
  schedule,
}: {
  schedule?: {
    timezone: string
    availabilities: Availability[]
  }
}) {
  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone: schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities?.toSorted(
        (a, b) => timeToFloat(a.startTime) - timeToFloat(b.startTime)
      ),
    },
  })

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({ name: "availabilities", control: form.control })

  const groupedAvailabilityFields = groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (field) => field.dayOfWeek
  )

  async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
    try {
      await saveSchedule(values)
      toast("Schedule saved successfully.", {
        duration: 5000,
        className: '!rounded-md !py-5 !px-5 !justify-left !text-green-600 !font-black',
      })
    } catch (error: any) {
      form.setError("root" as any, {
        type: "manual",
        message: `There was an error saving your schedule: ${error.message}`,
      })
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Root error */}
        {"root" in form.formState.errors && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root?.message}
          </div>
        )}

        {/* Timezone Selector */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-x-clip backdrop-blur-md">
                  {Intl.supportedValuesOf("timeZone").map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone} ({formatTimezoneOffset(timezone)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Availabilities grouped by day */}
        <div className="grid grid-cols-[auto_auto] gap-y-6">
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
            <Fragment key={dayOfWeek}>
              <div className="capitalize text-sm font-semibold">
                {dayOfWeek.substring(0, 3)}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  className="size-6 p-1 cursor-pointer hover:scale-125 hover:bg-gray-300/30 shadow-2xl"
                  variant="outline"
                  onClick={() =>
                    addAvailability({
                      dayOfWeek,
                      startTime: "09:00",
                      endTime: "17:00",
                    })
                  }
                >
                  <Plus color="red" />
                </Button>

                {(groupedAvailabilityFields[dayOfWeek] ?? []).map((field, idx) => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {/* Start time */}
                      <FormField
                        control={form.control}
                        name={`availabilities.${field.index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className="w-24" aria-label={`${dayOfWeek} Start ${idx + 1}`} {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      -

                      {/* End time */}
                      <FormField
                        control={form.control}
                        name={`availabilities.${field.index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className="w-24" aria-label={`${dayOfWeek} End ${idx + 1}`} {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Remove button */}
                      <Button
                        type="button"
                        className="size-6 p-1 bg-red-500 hover:bg-red-700 hover:scale-125"
                        variant="destructive"
                        onClick={() => removeAvailability(field.index)}
                      >
                        <X className="text-white" />
                      </Button>
                    </div>

                    {/* Validation errors */}
                    <FormMessage className="text-red-500">
                      {
                        form.formState.errors.availabilities?.[field.index]?.startTime
                          ?.message
                      }
                    </FormMessage>
                    <FormMessage className="text-red-500">
                      {
                        form.formState.errors.availabilities?.[field.index]?.endTime
                          ?.message
                      }
                    </FormMessage>
                    <FormMessage className="text-red-500">
                      {
                        form.formState.errors.availabilities?.[field.index]?.root
                          ?.message
                      }
                    </FormMessage>
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-start">
          <Button
            className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
