"use client";

import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormElement from "@/components/elements/form-elements";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/elements/form-elements/form-tags";
import { Icon } from "@/components/elements/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormRadio } from "@/components/elements/form-elements/form-tags/radio";
import { cn } from "@/lib/utils";
import {
  EmployeeFormSchema,
  EmployeeFormValues,
} from "./employee-form-validtions";
import { getPhoneData } from "@/components/elements/form-elements/form-tags/input/components/form-input-phone";
import { Switch } from "@/components/ui/switch";
import { Fieldset } from "@/components/ui/fieldset";
import { useGetEmployee } from "@/lib/api/customer/employee";
import { EducationFormFieldArray } from "./education-form-field-array";
import { EmploymentFormFieldArray } from "./employment-form-field-array ";
import { FamilyFormFieldArray } from "./family-form-field-array ";
import { ReferencesFormFieldArray } from "./references-form-field-array ";
import { useGetAreas } from "@/lib/api/localisation/area";
import { useGetSerivces } from "@/lib/api/catalog/service";
import { useGetSerivcesTypes } from "@/lib/api/catalog/service-type";

const defaultValues: Partial<EmployeeFormValues> = {
  firstname: "",
  lastname: "",
  job_title: "",
  address: "",
  isSameAsAddress: true,
  permanent_address: "",
  email: "",
  phone: "",
  mobile: "",
  dob: undefined,
  avatar: [],
  marital_status: "single",
  pan: "",
  aadhar: "",
  driving_license: "",
  passport: "",
  election_card: "",
  electric_meter_no: "",
  area: "",
  education: [],
  employment: [],
  family: [],
  references: [],
  status: 1,
};
export type EmployeeFormProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function EmployeeForm({ searchParams }: EmployeeFormProps) {
  const { employee_id: id } = searchParams ?? {};
  const isAddMode = !id;

  const areaDefault = new URLSearchParams();
  areaDefault.set("limit", "0");
  areaDefault.set("sort", "name");

  const { data: area, isLoading: isAreaLoading } = useGetAreas(
    areaDefault.size > 0 ? areaDefault : "",
  );

  const serviceDefault = new URLSearchParams();
  serviceDefault.set("limit", "0");
  serviceDefault.set("sort", "name");

  const { data: service, isLoading: isServiceLoading } = useGetSerivcesTypes(
    serviceDefault.size > 0 ? serviceDefault : "",
  );

  const {
    data: employee,
    isLoading: isEmployeeLoading,
    refetch: refetchQuery,
  } = useGetEmployee(id as string);

  const editValues: Partial<EmployeeFormValues> = !isEmployeeLoading &&
    employee && {
      firstname: employee.firstname,
      lastname: employee.lastname,
      job_title: employee.job_title,
      address: employee.address,
      isSameAsAddress: employee.is_same_as_address,
      permanent_address: employee.permanent_address,
      email: employee.email,
      phone: employee.phone,
      mobile: employee.mobile,
      dob: employee.dob,
      avatar: employee.avatar,
      marital_status: employee.marital_status,
      pan: employee.pan,
      aadhar: employee.aadhar,
      driving_license: employee.driving_license,
      passport: employee.passport,
      election_card: employee.election_card,
      electric_meter_no: employee.electric_meter_no,
      area: employee.area,
      education: employee.education,
      employment: employee.employment,
      family: employee.family,
      references: employee.references,
      status: employee.status,
    };

  React.useEffect(() => {
    if (!isAddMode && !isEmployeeLoading && !employee) {
      toast.error("Employee not found");
    } else if (!isAddMode && isEmployeeLoading) {
      toast.loading("Loading employee details");
    } else if (!isAddMode && !isEmployeeLoading && employee) {
      refetchQuery();
    }
  }, [isAddMode, isEmployeeLoading, employee]);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: !isAddMode ? editValues : defaultValues,
    mode: "onBlur",
  });
  React.useEffect(() => {
    if (!isAddMode && employee && !isEmployeeLoading) {
      const { ...rest } = employee;
      form.reset(rest);
    }
  }, [isAddMode, refetchQuery, employee, isEmployeeLoading]);

  const statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];
  const martialStatus = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
    { label: "Widowed", value: "widowed" },
  ];

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (data) => {};

  const fetchAreas = async (query?: string): Promise<(typeof area)[]> => {
    // Simulate server delay
    // await new Promise((resolve) =>
    //   setTimeout(resolve, Math.random() * 1000 + 100),
    // );

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
    return !isAddMode && employee && employee.area
      ? results.filter((result: typeof area) => {
          return result._id === employee.area;
        })
      : results.slice(0, 5);

    // return results.slice(0, 5);
  };

  const fetchServices = async (query?: string): Promise<(typeof service)[]> => {
    // Simulate server delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 100),
    );

    const results = !isServiceLoading && service ? service.data : [];

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      return results
        .filter((result: typeof service) => {
          return result.name.toLowerCase().includes(lowercaseQuery);
        })
        .slice(0, 5);
    }
    // return results based on service
    return !isAddMode && employee && employee.country
      ? results.filter((result: typeof service) => {
          return result._id === employee.country;
        })
      : results.slice(0, 5);

    // return results.slice(0, 5);
  };
  const watchIsSameAsAddress = form.watch("isSameAsAddress");
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
            <TabsTrigger value="tab-education" className="w-1/7">
              Education
            </TabsTrigger>
            <TabsTrigger value="tab-employment" className="w-1/7">
              Employment
            </TabsTrigger>
            <TabsTrigger value="tab-family" className="w-1/7">
              Family
            </TabsTrigger>
            <TabsTrigger value="tab-references" className="w-1/7">
              References
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab-general" className="w-full">
            {/* Employee Id */}
            {!isAddMode && (
              <FormElement.Field
                name="employee_id"
                render={({ field }) => (
                  <FormElement.Item required>
                    <FormElement.Label htmlFor="input-employee-id">
                      Employee Id
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter your employee-id"
                        id="input-employee-id"
                        autoComplete="off"
                        disabled
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-employee-id"
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

            {/* First Name */}
            <FormElement.Field
              name="firstname"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-firstname">
                    First Name
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter your firstname"
                      id="input-firstname"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-firstname"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Last Name */}
            <FormElement.Field
              name="lastname"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-lastname">
                    Last Name
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter your lastname"
                      id="input-lastname"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-firstname"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Last Name */}
            <FormElement.Field
              name="designation"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-designation">
                    Designation
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="text"
                      placeholder="Please enter the designation"
                      id="input-designation"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-designation"
                            className="flex h-10 items-center justify-center pr-2"
                          ></FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />



            {/* Communication Address */}
            <FormElement.Field
              name="address"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-address">
                    Communication Address
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormTextarea
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Please enter your communication address"
                      id="input-address"
                      autoComplete="off"
                      rows={5}
                      className="h-30"
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* button */}
            <FormElement.Field
              name="isSameAsAddress"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-same-as-address">
                    Same as Above
                  </FormElement.Label>
                  <FormElement.Control>
                    <div className="flex space-x-2">
                      <Switch
                        id="airplane-mode"
                        // {...field}
                        // checked={field.value}
                        // onChange={(e) =>
                        //   field.onChange((e.target as HTMLInputElement).checked)
                        // }
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    </div>
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Permanent Address */}
            {!watchIsSameAsAddress && (
              <FormElement.Field
                name="permanent_address"
                render={({ field }) => (
                  <FormElement.Item required>
                    <FormElement.Label htmlFor="input-permanent-address">
                      Permanent Address
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormTextarea
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        placeholder="Please enter your permanent address"
                        id="input-permanent-address"
                        autoComplete="off"
                        rows={5}
                        className="h-30"
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />
            )}

            {/* Email */}
            <FormElement.Field
              name="email"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-email">
                    Email
                  </FormElement.Label>
                  <FormElement.Control>
                    <FormInput
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                      type="email"
                      placeholder="Enter email"
                      id="input-email"
                      autoComplete="off"
                      inputGroup
                      append={{
                        children: (
                          <FormElement.Label
                            htmlFor="input-email"
                            className="flex h-8 items-center justify-center pr-2"
                          >
                            <Icon name="Mail" />
                          </FormElement.Label>
                        ),
                      }}
                    />
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Mobile */}
            <FormElement.Field
              name="phone"
              render={({ field }) => (
                <FormElement.Item required>
                  <FormElement.Label htmlFor="input-phone">
                    Mobile
                  </FormElement.Label>
                  <FormElement.Control>
                    <div>
                      <FormInput
                        {...field}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        type="phone"
                        placeholder="Enter your phone number"
                        id="input-phone"
                        autoComplete="off"
                        defaultCountry="IN"
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-phone"
                              className="flex h-8 items-center justify-center pr-2"
                            >
                              <Icon name="Phone" />
                            </FormElement.Label>
                          ),
                        }}
                      />
                      <p className="text-muted-foreground text-sm">
                        Please include country code.
                      </p>
                    </div>
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />

            {/* Alt. Mobile */}
            <FormElement.Field
              name="mobile"
              render={({ field }) => (
                <FormElement.Item>
                  <FormElement.Label htmlFor="input-mobile">
                    Alt. Mobile
                  </FormElement.Label>
                  <FormElement.Control>
                    <div>
                      <FormInput
                        {...field}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        type="phone"
                        placeholder="Enter your mobile number"
                        id="input-mobile"
                        autoComplete="off"
                        defaultCountry="IN"
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-alt-mobile"
                              className="flex h-8 items-center justify-center pr-2"
                            >
                              <Icon name="Phone" />
                            </FormElement.Label>
                          ),
                        }}
                      />
                      <p className="text-muted-foreground text-sm">
                        Please include country code.
                      </p>
                    </div>
                  </FormElement.Control>
                </FormElement.Item>
              )}
            />
          </TabsContent>
          <TabsContent value="tab-data" className="w-full">
            <Fieldset legend="Personal Information">
              {/* date */}
              <FormElement.Field
                name="dob"
                render={({ field }) => (
                  <FormElement.Item required>
                    <FormElement.Label htmlFor="input-dob">
                      {" "}
                      Date of Birth
                    </FormElement.Label>
                    <FormInput
                      date={
                        field.value
                          ? {
                              from: new Date(field.value),
                              to: new Date(field.value),
                            }
                          : { from: new Date(), to: new Date() }
                      }
                      onDateSelect={(date) => {
                        console.log("outside date", date);
                        field.onChange(date.from);
                      }}
                      id="input-dob"
                      numberOfMonths={1}
                      type="date"
                      placeholder="Please select your date of birth"
                      closeOnSelect={true}
                      variant={"outline"}
                    />
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

              {/* Marital Status */}
              <FormElement.Field
                name="marital_status"
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-marital-status">
                      Marital Status
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormSelect
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        id="input-marital-status"
                        type="single"
                        placeholder="Please select marital status"
                        options={martialStatus}
                        getOptionValue={(option) => option.value}
                        getDisplayValue={(option) => option.value}
                        renderOption={(option) => option.label}
                        onValueChange={(value) => field.onChange(value)}
                        label="Marital Status"
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />

              {/* area */}
              <FormElement.Field
                name="area"
                render={({ field }) => (
                  <FormElement.Item required>
                    <FormElement.Label htmlFor="input-area">
                      Area
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormSelect
                        {...field}
                        value={field.value}
                        id="input-area"
                        type="async"
                        placeholder="Please enter area"
                        fetcher={fetchAreas}
                        getOptionValue={(option) => option._id}
                        getDisplayValue={(option) => option.name}
                        renderOption={(option) => option.name}
                        onChange={(value) => field.onChange(value)}
                        label="Area"
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />
              {/* service Name */}

              <FormElement.Field
                name="service"
                render={({ field }) => (
                  <FormElement.Item required>
                    <FormElement.Label htmlFor="input-service">
                      Services
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormSelect
                        {...field}
                        value={field.value}
                        id="input-service"
                        type="async"
                        placeholder="Please enter service"
                        fetcher={fetchServices}
                        getOptionValue={(option) => option._id}
                        getDisplayValue={(option) => option.name}
                        renderOption={(option) => option.name}
                        onChange={(value) => field.onChange(value)}
                        label="Services"
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />
            </Fieldset>
            <Fieldset legend="STATUTORY INFORMATION">
              {/*Pan No. */}
              <FormElement.Field
                name="pan"
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-pan">
                      Pan No.
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter pan number"
                        id="input-pan"
                        autoComplete="off"
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-pan"
                              className="flex h-10 items-center justify-center pr-2"
                            ></FormElement.Label>
                          ),
                        }}
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />

              {/*Aadhar No. */}
              <FormElement.Field
                name="aadhar"
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-aadhar">
                      Aadhar No.
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter aadhar number"
                        id="input-aadhar"
                        autoComplete="off"
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-aadhar"
                              className="flex h-10 items-center justify-center pr-2"
                            ></FormElement.Label>
                          ),
                        }}
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />

              {/*Driving License */}
              <FormElement.Field
                name="driving_license"
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-driving-license">
                      Driving License
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter your driving license number"
                        id="input-driving-license"
                        autoComplete="off"
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-driving-license"
                              className="flex h-10 items-center justify-center pr-2"
                            ></FormElement.Label>
                          ),
                        }}
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />

              {/*Passport No. */}
              <FormElement.Field
                name="passport"
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-passport">
                      Passport No.
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter your passport number"
                        id="input-passport"
                        autoComplete="off"
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-passport"
                              className="flex h-10 items-center justify-center pr-2"
                            ></FormElement.Label>
                          ),
                        }}
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />

              {/*Election Card no. */}
              <FormElement.Field
                name="election_card"
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-election-card">
                      Election Card no.
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter election card number"
                        id="input-election-card"
                        autoComplete="off"
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-election-card"
                              className="flex h-10 items-center justify-center pr-2"
                            ></FormElement.Label>
                          ),
                        }}
                      />
                    </FormElement.Control>
                  </FormElement.Item>
                )}
              />

              {/* Electric Meter No. */}
              <FormElement.Field
                name="electric_meter_no."
                render={({ field }) => (
                  <FormElement.Item>
                    <FormElement.Label htmlFor="input-electric-meter-no.">
                      Electric Meter No.
                    </FormElement.Label>
                    <FormElement.Control>
                      <FormInput
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                        type="text"
                        placeholder="Please enter electric meter no."
                        id="input-electric-meter-no."
                        autoComplete="off"
                        inputGroup
                        append={{
                          children: (
                            <FormElement.Label
                              htmlFor="input-electric-meter-no."
                              className="flex h-10 items-center justify-center pr-2"
                            ></FormElement.Label>
                          ),
                        }}
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
                      status
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
            </Fieldset>
          </TabsContent>

          <TabsContent value="tab-education" className="w-full">
            <EducationFormFieldArray name="education" />
          </TabsContent>

          <TabsContent value="tab-employment" className="w-full">
            <EmploymentFormFieldArray name="employment" />
          </TabsContent>

          <TabsContent value="tab-family" className="w-full">
            <FamilyFormFieldArray name="family" />
          </TabsContent>
          <TabsContent value="tab-references" className="w-full">
            <ReferencesFormFieldArray name="references" />
          </TabsContent>
        </Tabs>
      </FormElement>
    </>
  );
}
