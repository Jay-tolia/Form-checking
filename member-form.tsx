"use client";

import * as React from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormElement from "@/components/elements/form-elements";
import {
  FormInput,
  FormSelect,
} from "@/components/elements/form-elements/form-tags";
import { Icon } from "@/components/elements/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormRadio } from "@/components/elements/form-elements/form-tags/radio";
import { cn } from "@/lib/utils";
import {
  CustomerFormSchema,
  CustomerFormValues,
} from "./member-form-validtions";
import { Fieldset } from "@/components/ui/fieldset";
import { PhoneFormFieldArray } from "./phone-form-field-array";
import { EmailFormFieldArray } from "./email-form-field-array";
import { FormFieldArray } from "@/components/elements/form-elements/form-field-array";
import { AddressFormFieldArray } from "./address-form-field-array";
import { useGetLocations } from "@/lib/api/localisation/location";
import { useGetAreas } from "@/lib/api/localisation/area";
import { useGetCustomer } from "@/lib/api/customer/customer";

interface AddressArrayProps {
  isSociety?: boolean;
  societyId?: string;
  society?: string;
  name?: string;
  fullname?: string;
  flat_no?: string;
  line_1?: string;
  line_2?: string;
  landmark?: string;
  pincode?: string;
  location?: string;
  area?: string;
}

const defaultValues: Partial<CustomerFormValues> = {
  marketing: true,
  avatar: [],
  name: "",
  billing: "",
  line_1: "",
  line_2: "",
  landmark: "",
  pincode: "",
  gst_applicable: "unregistered",
  gst_no: "",
  email: [],
  phone: [],
  address: [],
};
export type CustomerFormProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function MemberForm({ searchParams }: CustomerFormProps) {
  const { customer_id: id } = searchParams ?? {};
  const isAddMode = !id;

  const locationDefault = new URLSearchParams();
  locationDefault.set("limit", "0");
  locationDefault.set("sort", "name");

  const { data: locations, isLoading: isLocationsLoading } = useGetLocations(
    locationDefault.size > 0 ? locationDefault : "",
  );

  const areaDefault = new URLSearchParams();
  areaDefault.set("limit", "0");
  areaDefault.set("sort", "name");

  const { data: area, isLoading: isAreaLoading } = useGetAreas(
    areaDefault.size > 0 ? areaDefault : "",
  );

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomer(
    id as string,
  );

  const {
    data: member,
    isLoading: isMemberLoading,
    refetch: refetchQuery,
  } = useGetCustomer(id as string);

  const editValues: Partial<CustomerFormValues> = React.useMemo(() => {
    if (member) {
      const { primary, additional, ...rest } = member;
      return (
        !isMemberLoading &&
        member && {
          marketing: member.marketing,
          avatar: member.avatar,
          name: member.name,
          billing: member.billing,
          line_1: member.line_1,
          line_2: member.line_2,
          landmark: member.landmark,
          pincode: member.pincode,
          gst_applicable: member.gst_applicable,
          gst_no: member.gst_no,
          email: member.email,
          phone: [primary.phone],
          address: member.address,
        }
      );
    }
  }, [member]);

  React.useEffect(() => {
    if (!isAddMode && !isMemberLoading && !member) {
      toast.error("Member not found");
    } else if (!isAddMode && isMemberLoading) {
      toast.loading("Loading member details");
    } else if (!isAddMode && !isMemberLoading && member) {
      refetchQuery();
    }
  }, [isAddMode, isMemberLoading, member]);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: !isAddMode ? editValues : defaultValues,
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!isAddMode && member && !isMemberLoading) {
      const { primary, additional, ...rest } = member;
      form.reset(rest);
    }
  }, [isAddMode, refetchQuery, member, isMemberLoading]);

  const onSubmit: SubmitHandler<CustomerFormValues> = async (data) => {};

  const watchAddress = useWatch({
    control: form.control,
    name: "address",
    defaultValue: [
      {
        isSociety: false,
        societyId: "",
        society: "",
        name: "",
        fullname: "",
        flat_no: "",
        line_1: "",
        line_2: "",
        landmark: "",
        pincode: "",
        location: "",
        area: "",
        // gst_applicable: "",
        // gst_no: "",
      },
    ],
  });

  const statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const marketingCall = [
    { label: "Call", value: "call" },
    { label: "Do Not Call", value: "do not call" },
  ];
  const gstOptions = [
    { label: "Unregistered", value: "unregistered" },
    { label: "Registerd", value: "registerd" },
    { label: "Composite", value: "composite" },
  ];
  const watchGSTApplicable = form.watch("gst_applicable");

  const fetchAreas = async (query?: string): Promise<(typeof area)[]> => {
    // Simulate server delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 100),
    );

    const results = !isAreaLoading && area ? area.data : [];

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      return results
        .filter((result: typeof area) => {
          return result.name.toLowerCase().includes(lowercaseQuery);
        })
        .slice(0, 5);
    }
    // return results based on areas
    return !isAddMode && member && member.area
      ? results.filter((result: typeof area) => {
          return result._id === member.area;
        })
      : results.slice(0, 5);

    // return results.slice(0, 5);
  };

  const fetchLocations = async (
    query?: string,
  ): Promise<(typeof locations)[]> => {
    // Simulate server delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 100),
    );

    const results = !isLocationsLoading && locations ? locations.data : [];

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      return results
        .filter((result: typeof locations) => {
          return result.name.toLowerCase().includes(lowercaseQuery);
        })
        .slice(0, 5);
    }
    // return results based on area location
    return !isAddMode && member && member.location
      ? results.filter((result: typeof locations) => {
          return result._id === member.location;
        })
      : results.slice(0, 5);

    // return results.slice(0, 5);
  };

  // if (customer) {
  //   const { primary, additional, address, ...rest } = customer;
  //   const addEmail = customer?.primary?.email?.map((item: any) => {
  //     return item?.email?.map((email: any) => ({
  //       label: email?.label,
  //       value: email?.value,
  //     }));
  //   });
  //   const addPhone = customer?.primary?.phone?.map((item: any) => {
  //     return item?.phone?.map((phone: any) => ({
  //       label: phone?.label,
  //       value: phone?.value,
  //     }));
  //   });
  //   console.log("object", addPhone);
  // }

  // console.log("object", customer);

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
          </TabsList>
          <TabsContent value="tab-general" className="w-full">
            {/* Marketing Call */}
            <FormElement.Field
              name="marketing_call"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-marketing-call">
                    Marketing Call
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormRadio
                      {...field}
                      radioStyle="button"
                      options={marketingCall}
                      getOptionValue={(option) => option.value}
                      getDisplayValue={(option) => option.label}
                      renderOption={(option) => option.label}
                      value={field.value}
                      onChange={(value) =>
                        form.setValue("marketing", value === "call")
                      }
                      data-testid="marketing"
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

            {/* Avatar */}
            <FormElement.Field
              name="avatar"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-avatar">
                    Avatar
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

            {/* Full Name */}
            <FormElement.Field
              name="name"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-name">
                    Full Name
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      // value={field.value}
                      type="text"
                      placeholder="Please enter your name"
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

            {/* Phone Number */}
            <Fieldset legend="Phone">
              <PhoneFormFieldArray name="phone" />
            </Fieldset>

            {/* Email Address */}
            <Fieldset legend="Email" className="mt-5">
              <EmailFormFieldArray name="email" />
            </Fieldset>

            {/*Billing name */}
            <FormElement.Field
              name="billing"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-billing">
                    Billing Name
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter billing name"
                      id="input-billing"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-billing"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/*Address */}
            {/* <FormElement.Field
              name={`line_1`}
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-address">
                    Address
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter address"
                      id="input-address"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-address"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            /> */}

            {/* Landmark */}
            {/* <FormElement.Field
              name="landmark"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-landmark">
                    Landmark
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter landmark"
                      id="input-landmark"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-landmark"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            /> */}

            {/* City */}
            {/* <FormElement.Field
              name="city"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-city">
                    City
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter city"
                      id="input-city"
                      autoComplete="off"
                      inputGroup
                      disabled={form.formState.isSubmitting || true}
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-city"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            /> */}

            {/* Pincode */}
            {/* <FormElement.Field
              name="pincode"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-pincode">
                    Pincode
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter pincode"
                      id="input-pincode"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-pincode"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            /> */}
            {/* Gst Applicable */}
            <FormElement.Field
              name="gst_applicable"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-gst-applicable">
                    GST Applicable
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormSelect
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      id="input-gst-applicable"
                      type="single"
                      placeholder="Please select a gst-applicable"
                      options={gstOptions}
                      getOptionValue={(option) => option.value}
                      getDisplayValue={(option) => option.value}
                      renderOption={(option) => option.label}
                      onValueChange={(value) => field.onChange(value)}
                      label="GST Applicable"
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />
            {/* GSTIN */}
            {watchGSTApplicable !== "" &&
              watchGSTApplicable !== "unregistered" && (
                <FormElement.Field
                  name="gst_no"
                  render={({ field }) => (
                    <FormElement.Item>
                      <FormElement.Label htmlFor="input-gst-no">
                        GSTIN
                      </FormElement.Label>
                      <FormElement.Control>
                        <FormInput
                          {...field}
                          onChange={field.onChange}
                          value={field.value}
                          type="text"
                          placeholder="Please enter gst no"
                          id="input-gst-no"
                          autoComplete="off"
                          inputGroup
                          append={{
                            children: (
                              <FormElement.Label
                                htmlFor="input-gst-no"
                                className="flex h-10 items-center justify-center pr-2"
                              ></FormElement.Label>
                            ),
                          }}
                        />
                      </FormElement.Control>
                    </FormElement.Item>
                  )}
                />
              )}

            <Fieldset legend="Address">
              <AddressFormFieldArray name="address" />
            </Fieldset>
          </TabsContent>
        </Tabs>
      </FormElement>
    </>
  );
}
