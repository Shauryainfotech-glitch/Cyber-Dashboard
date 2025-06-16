import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useErrorHandler } from "@/components/error-boundary";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description too long"),
  type: z.string().min(1, "Case type is required"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  location: z.string().max(500, "Location too long").optional(),
  createdAt: z.date().optional().default(() => new Date()),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional().default("open"),
  userId: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface CaseFormProps {
  onSubmit: (data: FormData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

const caseTypes = [
  { value: "hacking", label: "Hacking", description: "Unauthorized access to systems/data" },
  { value: "job_fraud", label: "Job Fraud", description: "Deceptive employment schemes" },
  { value: "matrimonial_fraud", label: "Matrimonial Fraud", description: "Fake matrimonial profiles" },
  { value: "ransomware", label: "Ransomware", description: "Malware locking data for ransom" },
  { value: "phishing", label: "Phishing", description: "Fraudulent information gathering" },
  { value: "identity_theft", label: "Identity Theft", description: "Unauthorized use of personal info" },
  { value: "financial_fraud", label: "Financial Fraud", description: "Fraudulent financial transactions" },
  { value: "cyber_stalking", label: "Cyber Stalking", description: "Online harassment and stalking" },
  { value: "online_harassment", label: "Online Harassment", description: "Digital bullying and abuse" },
  { value: "data_breach", label: "Data Breach", description: "Unauthorized data access" }
];

export default function CaseForm({ onSubmit, isLoading = false, error, onClearError }: CaseFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleError = useErrorHandler();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      priority: "medium",
      location: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setSubmitSuccess(false);
      await onSubmit(data);
      setSubmitSuccess(true);
      form.reset();
    } catch (err) {
      handleError(err as Error);
    }
  };

  // Clear success message after 3 seconds
  React.useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => setSubmitSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
              {onClearError && (
                <Button
                  variant="link"
                  className="ml-2 p-0 h-auto text-sm"
                  onClick={onClearError}
                >
                  Dismiss
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="ml-2">
              Case created successfully
            </AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter case title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {caseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{type.label}</span>
                        <span className="text-xs text-gray-500">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter incident location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide detailed case description..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 law-enforcement-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Case...
              </>
            ) : (
              "Create Case"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
