"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Plus, Save, Trash2 } from "lucide-react";

const itemsFormSchema = z.object({
  items: z.array(z.string().min(1)).min(1),
});

type ItemsFormValues = z.infer<typeof itemsFormSchema>;

export default function ItemsForm(props: {
  items: string[];
  onSubmit: (items: string[]) => void;
}) {
  const form = useForm<ItemsFormValues>({
    resolver: zodResolver(itemsFormSchema),
    defaultValues: {
      items: props.items,
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "items" as never,
    control: form.control,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => props.onSubmit(data.items))}
        className="space-y-8"
      >
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`items.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Items
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder="Enter text..." {...field} />
                      <Button
                        onClick={() => remove(index)}
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 flex items-center justify-center gap-2 px-6"
            onClick={() => append("")}
          >
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>
        <Button type="submit" className="flex justify-center gap-2">
          {" "}
          <Save className="h-4 w-4" /> Save
        </Button>
      </form>
    </Form>
  );
}
