import { FormProvider } from "react-hook-form";
import SelectSearch from "../../components/Fields/SelectSearch";
import DatePickerComponent from "../../components/Fields/DatePicker";
import TextFieldComponent from "../../components/Fields/TextFieldComponent";

export default function ReportFilter({
  methods,
  state,
  actions,
}: any) {
  const {
    showFilters,
    departments,
    branches,
    fiscalYears,
    reportType,
    reportTypes,
    fieldOfficers,
    BRANCH_TYPES,
    REPORT_FILTERS,
  } = state;

  const { setShowFilters, onSubmit } = actions;

  const renderReportFilters = () => {
    return REPORT_FILTERS[reportType]?.map((filter: any) => {
      if (filter.type === "select") {
        const options =
          filter.name === "department"
            ? departments
            : filter.name === "branch"
            ? branches
            : [];

        return (
          <SelectSearch
            key={filter.name}
            label={filter.label}
            name={filter.name}
            options={options}
          />
        );
      }

      if (filter.type === "text") {
        return (
          <TextFieldComponent
            key={filter.name}
            label={filter.label}
            name={filter.name}
          />
        );
      }

      return null;
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow-sm">
          <h2 className="text-lg font-semibold">Report Filters</h2>
          <button
            type="button"
            onClick={() => setShowFilters((p: boolean) => !p)}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
            {/* REPORT TYPE */}
            <div className="grid grid-cols-4 gap-4">
              <SelectSearch
                label="Report Type"
                name="reportType"
                options={reportTypes}
                required
              />
            </div>

            {/* COMMON FILTERS */}
            <div className="grid grid-cols-4 gap-4">
              <DatePickerComponent label="From Date" name="fromDate" />
              <DatePickerComponent label="To Date" name="toDate" />
              <SelectSearch
                label="Fiscal Year"
                name="fiscalYear"
                options={fiscalYears}
              />
              <SelectSearch
                label="Branch Type"
                name="branchType"
                options={BRANCH_TYPES}
              />
              <SelectSearch
                label="Branch / Province / Region"
                name="branch"
                options={branches}
              />
              <SelectSearch
                label="Field Officers"
                name="fieldOfficer"
                options={fieldOfficers}
              />
            </div>

            {/* CONDITIONAL FILTERS */}
            {reportType && (
              <div className="grid grid-cols-4 gap-4">
                {renderReportFilters()}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => methods.reset()}
                className="rounded border px-4 py-2 text-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Load Report
              </button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
