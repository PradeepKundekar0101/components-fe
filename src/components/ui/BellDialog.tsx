import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
const BellDialog = ({
  handleSubmit,
  isSubmitting,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`
            flex items-center justify-center
            h-6 w-6 md:h-6 md:w-6
            rounded-full p-0
            
               text-gray-700 hover:bg-gray-100

            transition-all duration-200 ease-in-out
            transform hover:scale-105
            hover:bg-transparent bg-gray-100 border-gray-400 border-[0.8px]
          `}
          size="sm"
        >
          <Bell className="h-3 w-3 md:h-5 md:w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Set Product Reminder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderType">Reminder Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Back in Stock</SelectItem>
                <SelectItem value="price">Price Drop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Alert>
            <AlertDescription className="text-sm text-muted-foreground">
              🚧 This feature is currently under development. We'll notify you
              when it's ready!
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Setting reminder..." : "Set Reminder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BellDialog;
