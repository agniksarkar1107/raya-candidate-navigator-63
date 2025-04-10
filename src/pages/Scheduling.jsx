
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Mail, CheckCircle, Loader2 } from "lucide-react";
import SearchHeader from "@/components/search/SearchHeader";

const Scheduling = () => {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [subject, setSubject] = useState("Interview Invitation");
  const [message, setMessage] = useState(
    "We would like to invite you for an interview for the position you applied for. Please confirm if the suggested time works for you."
  );
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  const availableTimeSlots = [
    "9:00 AM - 10:00 AM",
    "10:30 AM - 11:30 AM",
    "12:00 PM - 1:00 PM",
    "1:30 PM - 2:30 PM",
    "3:00 PM - 4:00 PM",
    "4:30 PM - 5:30 PM",
  ];

  const handleSendEmail = () => {
    if (!candidateEmail || !date || !timeSlot) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      const newEmail = {
        id: Date.now().toString(),
        candidateEmail,
        subject,
        date: format(date, "PPP"),
        timeSlot,
        sentAt: new Date(),
      };

      setSentEmails([newEmail, ...sentEmails]);
      toast.success("Email sent successfully!");
      
      // Reset form
      setCandidateEmail("");
      setDate(null);
      setTimeSlot("");
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <SearchHeader />

      <main className="flex-1 container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-4 text-center">Interview Scheduling</h1>
          <p className="text-muted-foreground text-center mb-12">
            Schedule interviews and send automated emails to candidates
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-raya-purple/20">
              <CardHeader>
                <CardTitle>Schedule Interview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Candidate Email</label>
                  <Input
                    type="email"
                    placeholder="candidate@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Subject</label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Slot</label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {slot}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Message</label>
                  <Textarea
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full bg-raya-purple hover:bg-raya-purple/90"
                  onClick={handleSendEmail}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Interview Invitation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  {sentEmails.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No emails sent yet
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                      <AnimatedList items={sentEmails} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const AnimatedList = ({ items }) => (
  <>
    {items.map((email, index) => (
      <motion.div
        key={email.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <h3 className="font-medium">{email.subject}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  To: {email.candidateEmail}
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {email.date}, {email.timeSlot}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(email.sentAt, "h:mm a")}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </>
);

export default Scheduling;
