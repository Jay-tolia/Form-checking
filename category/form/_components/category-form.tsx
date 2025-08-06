"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormElement from "@/components/elements/form-elements";
import { FormInput, FormTextarea } from "@/components/elements/form-elements/form-tags";
import { CategoryFormSchema, CategoryFormValues } from "./category-form-validations";
import { Switch } from "@/components/ui/switch";

const defaultValues: Partial<CategoryFormValues> = {
  name: "",
  description: "",
  isActive: true,
};

export type CategoryFormProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function CategoryForm({ searchParams }: CategoryFormProps) {
  const { category_id: id } = searchParams ?? {};
  const isAddMode = !id;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    console.log("Category form submitted:", data);
    toast.success("Category saved successfully");
  };

  return (
    <FormElement
      form={form}
      onFormSubmit={onSubmit}
      className="space-y-4"
      id="form-category"
      horizontal
    >
      <div className="space-y-4">
        {/* Name */}
        <FormElement.Field
          name="name"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="input-name">
                Name
              </FormElement.Label>
              <FormElement.Control>
                <FormInput
                  {...field}
                  id="input-name"
                  type="text"
                  placeholder="Enter category name"
                  autoComplete="off"
                />
              </FormElement.Control>
              
            </FormElement.Item>
          )}
        />

        {/* Description */}
        <FormElement.Field
                        name="description"
                        render={({ field }) => (
                          <FormElement.Item>
                            <FormElement.Label htmlFor="input-description">
                               Description
                            </FormElement.Label>
                            <FormElement.Control>
                              <FormTextarea
                                {...field}
                                onChange={field.onChange}
                                value={field.value}
                                rows={5}
                                placeholder="Please give your description"
                                id="input-description"
                                autoComplete="off"
                                className="h-30"
                              />
                            </FormElement.Control>
                          </FormElement.Item>
                        )}
                      />
                      <FormElement.Field
                                    name="image"
                                    render={({ field }) => (
                                      <FormElement.Item required>
                                        <FormElement.Label htmlFor="input-avatar">
                                          Image
                                        </FormElement.Label>
                                        <FormElement.Control>
                                          <FormInput
                                            type="file"
                                            value={field.value}
                                            onFileChange={field.onChange}
                                            id="input-Image"
                                          />
                                        </FormElement.Control>
                                      </FormElement.Item>
                                    )}
                                  />
<FormElement.Field
          name="display-order"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="input-display-order">
                Display order
              </FormElement.Label>
              <FormElement.Control>
                <FormInput
                  {...field}
                  value={field.value ?? ""}
                  id="input-display-order"
                    onChange={field.onChange}
                  type="number"
                  placeholder="0."
                  autoComplete="off"
                 
                />
              </FormElement.Control>
              
            </FormElement.Item>
          )}
        />
        {/* Is Active */}
        <FormElement.Field
                        name={`isActive`}
                        render={({ field }) => (
                          <FormElement.Item>
                            <FormElement.Label htmlFor="input-is-Active">
                              Is Active
                            </FormElement.Label>
                            <FormElement.Label htmlFor="input-is-Active">
                              <div className="flex space-x-2">
                                <Switch
                                  id="airplane-mode"
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </div>
                            </FormElement.Label>
                            <FormElement.Control>switch</FormElement.Control>
                          </FormElement.Item>
                        )}
                      />
      </div>
    </FormElement>
  );
}
