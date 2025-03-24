import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { isFutureDate } from "../../../../../shared/utils/dates.utils";

interface PostConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    status: "published" | "draft" | "scheduled",
    date?: Date,
    hour?: string,
    minute?: string
  ) => void;
  isPending: boolean;
}

export function PostConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: PostConfirmationDialogProps) {
  const [postStatus, setPostStatus] = useState<
    "published" | "draft" | "scheduled"
  >("published");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledHour, setScheduledHour] = useState<string>("12");
  const [scheduledMinute, setScheduledMinute] = useState<string>("00");

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  // Generate minutes (0-59)
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleConfirm = () => {
    if (postStatus === "scheduled" && scheduledDate) {
      // Create a new date with the selected time
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(parseInt(scheduledHour));
      scheduledDateTime.setMinutes(parseInt(scheduledMinute));
      onConfirm(postStatus, scheduledDateTime, scheduledHour, scheduledMinute);
    } else {
      onConfirm(postStatus);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Almost done!</DialogTitle>
          <DialogDescription>
            Choose how you want to publish your post
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Select
              value={postStatus}
              onValueChange={(value: "published" | "draft" | "scheduled") =>
                setPostStatus(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publish Now</SelectItem>
                <SelectItem value="draft">Save as Draft</SelectItem>
                <SelectItem value="scheduled">Schedule Post</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2 space-y-2">
              {postStatus === "published" ? (
                <p className="text-sm text-muted-foreground">
                  Your post will be immediately visible to everyone on the feed
                </p>
              ) : postStatus === "draft" ? (
                <p className="text-sm text-muted-foreground">
                  Your post will be saved privately and can be edited later
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Your post will be published at the selected date and time
                  </p>
                  <div className="flex flex-col gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? (
                            format(scheduledDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                          disabled={isFutureDate}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center gap-2">
                      <Select
                        value={scheduledHour}
                        onValueChange={setScheduledHour}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">:</span>
                      <Select
                        value={scheduledMinute}
                        onValueChange={setScheduledMinute}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Minute" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem
                              key={minute}
                              value={minute}
                            >
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            disabled={
              isPending || (postStatus === "scheduled" && !scheduledDate)
            }
            onClick={handleConfirm}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
