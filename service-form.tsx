"use client";

import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormElement from "@/components/elements/form-elements";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/elements/form-elements/form-tags";
import { Icon } from "@/components/elements/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormRadio } from "@/components/elements/form-elements/form-tags/radio";
import { cn } from "@/lib/utils";
import {
  ServiceFormSchema,
  ServiceFormValues,
} from "./service-form-validtions";
import { getPhoneData } from "@/components/elements/form-elements/form-tags/input/components/form-input-phone";
import { Switch } from "@/components/ui/switch";
import { useGetSerivce, useGetSerivces } from "@/lib/api/catalog/service";
import { useGetLocations } from "@/lib/api/localisation/location";

const defaultValues: Partial<ServiceFormValues> = {
  service_prefix: "",
  name: "",
  description: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  parent: null,
  avatar: [],
  location: [],
  sort_order: 0,
  status: 1,
  isVendor: false,
  vendor: undefined,
};
export type ServiceFormProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function ServiceForm({ searchParams }: ServiceFormProps) {
  const { service_id: id } = searchParams ?? {};
  const isAddMode = !id;

  // Fetch API Calls - Start
  const locationDefault = new URLSearchParams();
  locationDefault.set("limit", "0");
  locationDefault.set("sort", "name");

  const { data: locations, isLoading: isLocationsLoading } = useGetLocations(
    locationDefault.size > 0 ? locationDefault : "",
  );

  const serviceDefault = new URLSearchParams();
  serviceDefault.set("limit", "0");
  serviceDefault.set("sort", "name");

  const { data: services, isLoading: isServicesLoading } = useGetSerivces(
    serviceDefault.size > 0 ? serviceDefault : "",
  );

  const {
    data: service,
    isLoading: isServiceLoading,
    refetch: refetchQuery,
  } = useGetSerivce(id as string);
  console.log("object", service);

  const editValues: Partial<ServiceFormValues> = !isServiceLoading &&
    service && {
      name: service.name,
      description: service.description,
      meta_title: service.meta_title,
      meta_description: service.meta_description,
      meta_keywords: service.meta_keywords,
      parent: service.parent_id,
      avatar: service.avatar,
      location: service.location_id,
      sort_order: service.sort_order,
      status: service.status,
      isVendor: service.is_vendor,
      vendor: service.vendor_id,
    };

  React.useEffect(() => {
    if (!isAddMode && !isServiceLoading && !service) {
      toast.error("Service not found");
    } else if (!isAddMode && isServiceLoading) {
      toast.loading("Loading service details");
    } else if (!isAddMode && !isServiceLoading && service) {
      refetchQuery();
    }
  }, [isAddMode, isServiceLoading, service]);
  // Fetch API Calls - End

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: !isAddMode ? editValues : defaultValues,
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!isAddMode && service && !isServiceLoading) {
      const { ...rest } = service;
      form.reset(rest);
    }
  }, [isAddMode, refetchQuery, service, isServiceLoading]);

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
  ];

  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {};

  const fetchLocations = async (
    query?: string,
  ): Promise<(typeof locations)[]> => {
    // Simulate server delay
    // await new Promise((resolve) =>
    //   setTimeout(resolve, Math.random() * 1000 + 100),
    // );

    const results = locations ? locations.data : [];

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      return results.filter((result: typeof locations) => {
        return result.name.toLowerCase().includes(lowercaseQuery);
      });
    }

    return results;
  };

  const fetchServices = async (
    query?: string,
  ): Promise<(typeof services)[]> => {
    // Simulate server delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 100),
    );

    const results = !isServicesLoading && services ? services.data : [];

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      return results
        .filter((result: typeof services) => {
          return result.name.toLowerCase().includes(lowercaseQuery);
        })
        .slice(0, 5);
    }
    // return results based on service location
    return !isAddMode && service && service.services
      ? results.filter((result: typeof services) => {
          return result._id === service.services;
        })
      : results.slice(0, 5);

    // return results.slice(0, 5);
  };

  return (
    <>
      {form.formState.errors && form.formState.errors.root && (
        <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-500">
          {form.formState.errors.root.message}
        </div>
      )}
      <FormElement
        form={form}
        onFormSubmit={onSubmit}
        className="space-y-4"
        id="form-login"
        horizontal
      >
        <Tabs defaultValue="tab-general" className="mt-5 w-full px-4">
          <TabsList className="flex w-full items-start justify-start">
            <TabsTrigger value="tab-general" className="w-1/7">
              General
            </TabsTrigger>
            <TabsTrigger value="tab-data" className="w-1/7">
              Data
            </TabsTrigger>
            {/* <TabsTrigger value="tab-vendor" className="w-1/7">
              Vendor
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="tab-general" className="w-full">
            {/* Service Prefix */}
            <FormElement.Field
              name="service_prefix"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-service-prefix">
                    Service Prefix
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter your service prefix"
                      id="input-service-prefix"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-service-prefix"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Service Name */}
            <FormElement.Field
              name="name"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-name">
                    Service Name
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter your service name"
                      id="input-name"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-name"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
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
                      placeholder="Please enter your service description"
                      id="input-description"
                      autoComplete="off"
                      className="h-30"
                      rows={5}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Meta Title */}
            <FormElement.Field
              name="meta_title"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-meta-title">
                    Meta Title
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter your meta title"
                      id="input-meta-title"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-meta-title"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Meta Description */}
            <FormElement.Field
              name="meta_description"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-meta-description">
                    Meta Description
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormTextarea
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Please enter your meta description"
                      id="input-meta-description"
                      autoComplete="off"
                      className="h-30"
                      rows={5}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Meta Keywords */}
            <FormElement.Field
              name="meta_keywords"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-meta-keywords">
                    Meta Keywords
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormTextarea
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Please enter your meta keywords"
                      id="input-meta-keywords"
                      autoComplete="off"
                      className="h-30"
                      rows={5}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />
          </TabsContent>

          <TabsContent value="tab-data" className="w-full">
            {/* Parent*/}
            <FormElement.Field
              name="parent"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-parent">
                    Parent
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormSelect
                      {...field}
                      value={field.value}
                      id="input-parent"
                      type="async"
                      placeholder="Please select a parent"
                      fetcher={fetchServices}
                      getOptionValue={(option) => option._id}
                      getDisplayValue={(option) => option.name}
                      renderOption={(option) => option.name}
                      onChange={(value) => field.onChange(value)}
                      label="Parent"
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Avatar */}
            <FormElement.Field
              name="avatar"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-avatar">
                    Image
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      type="file"
                      value={field.value}
                      onFileChange={field.onChange}
                      id="input-avatar"
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Location */}
            <FormElement.Field
                          name="location"
                          render={({ field }) => (
                            <FormElement.Item required>
                              <FormElement.Label htmlFor="input-location">
                                Office Location
                              </FormElement.Label>
                              <FormElement.Control>
                                <FormSelect<typeof locations>
                                  value={field.value}
                                  id="input-location"
                                  type="multi"
                                  showMultiSelectValues="inside"
                                  placeholder="Please select a office location"
                                  fetcher={fetchLocations}
                                  getOptionValue={(option) => option._id}
                                  getDisplayValue={(option) => option.name}
                                  renderOption={(option) => option.name}
                                  onChange={(value) => field.onChange(value)}
                                  label="Office location"
                                />
                              </FormElement.Control>
                            </FormElement.Item>
                          )}
                        />
          

            {/* Sort Order */}
            <FormElement.Field
              name="sort_order"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-sort_order">
                    Sort Order
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      id="input-sort_order"
                      autoComplete="off"
                      inputGroup
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Status */}
            <FormElement.Field
              name="status"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-status">
                    Status
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormRadio
                      {...field}
                      radioStyle="button"
                      options={statusOptions}
                      getOptionValue={(option) => option.value}
                      getDisplayValue={(option) => option.label}
                      renderOption={(option) => option.label}
                      value={field.value}
                      onChange={(value) => form.setValue("status", +value)}
                      data-testid="status"
                      className="bg-muted flex rounded-full p-2"
                      highlighterClassName="bg-primary rounded-full"
                      aria-label="Order type"
                      radioClassName={cn(
                        "relative mx-2 flex h-9 cursor-pointer items-center justify-center",
                        "rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground",
                        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                      )}
                      highlighterIncludeMargin={true}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />
          </TabsContent>
          <TabsContent value="tab-vendor" className="w-full">
            <FormElement.Field
              name="status"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-status">
                    Is Vendor
                  </FormElement.Label>
                  <FormElement.Control>
                    <div className="flex space-x-2">
                      <Switch
                        id="airplane-mode"
                        {...field}
                        checked={field.value}
                        onChange={(e) =>
                          field.onChange((e.target as HTMLInputElement).checked)
                        }
                      />
                    </div>
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />
          </TabsContent>
        </Tabs>
      </FormElement>
    </>
  );
}
