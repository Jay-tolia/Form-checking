"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormElement from "@/components/elements/form-elements";
import { FormInput, FormSelect, FormTextarea } from "@/components/elements/form-elements/form-tags";
import { ProductFormSchema, ProductFormValues } from "./product-form-validations";
import { Switch } from "@/components/ui/switch";

const defaultValues: Partial<ProductFormValues> = {
  title: "",
  image: "",
  price: 0,
  discountedPrice: 0,
  summary: "",
  stock: 0,
  categories: [],
  isActive: true,
};

export type ProductFormProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function ProductForm({ searchParams }: ProductFormProps) {
  const { product_id: id } = searchParams ?? {};
  const isAddMode = !id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
  });
  const demoCategories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home & Kitchen" },
  { value: "sports", label: "Sports" },
];

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    console.log("Product form submitted:", data);
    toast.success("Product saved successfully");
  };

  return (
    <FormElement
      form={form}
      onFormSubmit={onSubmit}
      className="space-y-4"
      id="form-product"
      horizontal
    >
      <div className="space-y-4">
        {/* Title */}
        <FormElement.Field
          name="title"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="input-title">
                Title
              </FormElement.Label>
              <FormElement.Control>
                <FormInput
                  {...field}
                  id="input-title"
                  type="text"
                  placeholder="Enter product title"
                  autoComplete="off"
                />
              </FormElement.Control>
              
            </FormElement.Item>
          )}
        />

        {/* Image */}
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

        {/* Price */}
        <FormElement.Field
          name="price"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="input-price">
                Price
              </FormElement.Label>
              <FormElement.Control>
                <FormInput
                  {...field}
                  id="input-price"
                    onChange={field.onChange}
                  type="number"
                  placeholder="0."
                  autoComplete="off"
                 
                />
              </FormElement.Control>
              
            </FormElement.Item>
          )}
        />

        {/* Discounted Price */}
        <FormElement.Field
          name="discounted_price"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="discounted-price">
                 Discounted Price
              </FormElement.Label>
              <FormElement.Control>
                <FormInput
                  {...field}
                  id="input-price"
                    onChange={field.onChange}
                  type="number"
                  placeholder="0.00"
                  autoComplete="off"
                 
                />
              </FormElement.Control>
              
            </FormElement.Item>
          )}
        />

        {/* Summary */}
        <FormElement.Field
                                name="summary"
                                render={({ field }) => (
                                  <FormElement.Item>
                                    <FormElement.Label htmlFor="input-summary">
                                       Summary
                                    </FormElement.Label>
                                    <FormElement.Control>
                                      <FormTextarea
                                        {...field}
                                        onChange={field.onChange}
                                        value={field.value}
                                        rows={5}
                                        placeholder="Please give your summary"
                                        id="input-summary"
                                        autoComplete="off"
                                        className="h-30"
                                      />
                                    </FormElement.Control>
                                  </FormElement.Item>
                                )}
                              />

        {/* Stock */}
        <FormElement.Field
          name="stock"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="input-stock">
                Stock
              </FormElement.Label>
              <FormElement.Control>
                <FormInput
                  {...field}
                  id="input-stock"
                    onChange={field.onChange}
                  type="number"
                  placeholder="0."
                  autoComplete="off"
                 
                />
              </FormElement.Control>
              
            </FormElement.Item>
          )}
        />
        <FormElement.Field
          name="categories"
          render={({ field }) => (
            <FormElement.Item required>
              <FormElement.Label htmlFor="input-categories">
                Categories
              </FormElement.Label>
              <FormElement.Control>
                <FormSelect
                  type="multi"
                  showMultiSelectValues="inside"
                  fetcher={() => Promise.resolve(demoCategories)}
                  getOptionValue={(cat) => cat.value}
                  getDisplayValue={(cat) => cat.label}
                  renderOption={(cat) => cat.label}
                  value={field.value || []}
                  onChange={field.onChange}
                  label="Categories"
                  placeholder="Select categories"
                />
              </FormElement.Control>
            </FormElement.Item>
          )}
        />       
        {/* Is Active */}
        <FormElement.Field
                        name={`isActive.product`}
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
