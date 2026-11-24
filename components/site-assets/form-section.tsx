"use client";

import emailjs from "@emailjs/browser";
import { Loader2, MailCheck, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

const inputClassName =
  "mt-2 flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

export type FormSectionProps = {
  className?: string;
  submitLabel?: string;
  successLabel?: string;
};

export function FormSection({
  className,
  submitLabel = "Send message",
  successLabel = "Sent!",
}: FormSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef.current) return;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are missing.");
      toast.error("Email service is not configured.");
      return;
    }

    setStatus("sending");

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      });
      setStatus("success");
      formRef.current.reset();
      toast.success("Email sent successfully");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      toast.error("Error sending email");
    }
  };

  const isSubmitting = status === "sending";
  const isSuccessful = status === "success";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={cn("relative", className)}
    >
      <div className="flex flex-col">
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          Name
        </label>
        <input
          id={`${id}-name`}
          name="user_name"
          autoComplete="name"
          placeholder="Roberto Carlos"
          required
          className={inputClassName}
        />
      </div>

      <div className="my-4 flex flex-col">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="user_email"
          type="email"
          autoComplete="email"
          placeholder="ambassador@realmadrid.com"
          required
          className={inputClassName}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor={`${id}-message`} className="text-sm font-medium">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          placeholder="Tell me about your product, timeline, and goals."
          required
          className={cn(inputClassName, "min-h-30 resize-y py-2")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="relative my-5 flex items-center gap-3"
        disabled={isSubmitting}
      >
        <span>{isSuccessful ? successLabel : submitLabel}</span>

        <AnimatePresence mode="wait" initial={false}>
          {isSubmitting && (
            <motion.span
              key="loader"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Loader2 className="size-5 animate-spin" />
            </motion.span>
          )}
          {!isSubmitting && !isSuccessful && (
            <motion.span
              key="send"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Send className="size-5" />
            </motion.span>
          )}
          {!isSubmitting && isSuccessful && (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <MailCheck className="size-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <div className="mt-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
    </form>
  );
}
