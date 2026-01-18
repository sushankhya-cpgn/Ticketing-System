import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReportAPI } from "../src/api/Report/reportApi";
import { BRANCH_TYPES, REPORT_FILTERS } from "../constants/reportMapping";


export interface OptionType {
    label: string;
    value: string | number;
}

export function useReportFilter() {
    const methods = useForm({
        defaultValues: {
            reportType: "",
            reportHead: "",
            fromDate: "",
            toDate: "",
            fiscalYear: "",
            branchType: "",
            branch: "",
            department: "",
            agent: "",
            clientCode: "",
            riskCode: "",
            fieldOfficer: "",
        },
    })
    const { watch, setValue } = methods;
    const reportType = watch("reportType");
    const branchType = watch("branchType");
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [departments, setDepartments] = useState<OptionType[]>([]);
    const [branches, setBranches] = useState<OptionType[]>([]);
    const [fiscalYears, setFiscalYears] = useState<OptionType[]>([]);
    const [reportTypes, setReportTypes] = useState<OptionType[]>([]);
    const [fieldOfficers, setFieldOfficers] = useState<OptionType[]>([]);
    const [captions,setCaptions] = useState<any[]>([]);

    useEffect(() => {
        const loadMasters = async () => {

            try {
                const [reports, depts, fys, fieldOfficers] = await Promise.all([
                    ReportAPI.getSubReports("sp_Report_UW_RegisterPaid"),
                    ReportAPI.getDepartments(),
                    ReportAPI.getFiscalYears(),
                    ReportAPI.getFieldOfficers()
                ]);

                setReportTypes(
                    reports.data?.data?.map((rh: any) => ({ label: rh.reportTypeName, value: rh.reportTypeCode })) || []
                );
                setDepartments(
                    depts.data?.data?.map((d: any) => ({ label: d.deptName, value: d.deptKey })) || []
                );
                setFiscalYears(
                    fys.data?.data?.map((fy: any) => ({ label: fy.fyDisplay, value: fy.orderNumber })) || []
                );
                setFieldOfficers(
                    fieldOfficers.data?.data?.map((fo: any) => ({ label: `${fo.doCode} -${fo.doName}`, value: fo.doCode })) || []
                );
            }

            catch(error){
                console.error("Error loading report data:", error);
            }

            
        }
        loadMasters();


    }, [])



  useEffect(() => {
  if (!branchType) {
    setBranches([]);
    return;
  }

  const fetchBranches = async () => {
    try {
      let res;

      switch (branchType) {
        case "BRANCH":
          res = await ReportAPI.getBranches();
          break;
        case "PROVINCE":
          res = await ReportAPI.getProvinces();
          break;
        case "REGION":
          res = await ReportAPI.getBranchRegions();
          break;
        default:
          return;
      }

      setBranches(
        res?.data?.data?.map((b: any) => ({
          label:
            branchType === "BRANCH"
              ? `${b.branchCode} - ${b.branchEName}`
              : branchType === "PROVINCE"
              ? b.provinceEName
              : b.regionEName,
          value:
            branchType === "BRANCH"
              ? b.branchCode
              : branchType === "PROVINCE"
              ? b.provinceCode
              : b.regionCode,
        })) || []
      );

      setValue("branch", "");
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
    }
  };

  fetchBranches();
}, [branchType, setValue]);

    const onSubmit = (data: any) => {
        console.log("Form Data Submitted:", data);
    };

    return{
        methods,
        state: {
            showFilters,
            reportType,
            departments,
            branches,
            fiscalYears,
            reportTypes,
            branchType,
            BRANCH_TYPES,
            REPORT_FILTERS,
            fieldOfficers,
        },
        actions:{
            setShowFilters,
            onSubmit
        }
    }

};