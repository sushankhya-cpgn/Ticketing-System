import api from "../axiosClient";

export const ReportAPI = {

    // Get list of Branches
    getBranches: () => {
        return api.post("/Reports/generic-getbranches");
    },

    // Get Fiscal Years
    getFiscalYears: () => {
        return api.post("/Reports/generic-fiscalyears");
    },

    getDepartments: () => {
        return api.get("/Reports/generic-departments");
    },

    getSubReports: (reportCode: string) => {
        return api.post(`/Reports/generic-msreporttypes`, null, {
            params: { reportCode: "sp_Report_UW_RegisterPaid" }, // query param
        });
    },

    getProvinces: () => {
        return api.post("/Reports/generic-getprovinces");
    },

    getBranchRegions: () => {
        return api.post("/Reports/generic-BranchRegions");
    },

    getFieldOfficers: () => {
        return api.get("/Reports/generic-getfieldofficers",
            {
                params: {
                    doCode: null,
                }
            }

        );
    },

    getReportCaption: () => {
        return api.post("/Reports/setup-caption", {
            ProcName: "sp_Report_UW_RegisterPaid",
            ReportType: "1",
            DeptCode: "",
            TreatyCategory: null
        });
    },

    getUWRegisterPaidReport: (filters: any) => {
  // map your form filters to backend keys
  const body = {
  OrganizationName: "SALICO",
  OrganizationAddress: "Naxal",
  ReportMode: false,
  IsOption1: false,
  UserName: "bikram",
  TypeMode: 0,
  PrintType: "",
  FromDate: "2025-07-01",
  ToDate: "2025-07-02",
  FY: "",
  MonthCode: 0,
  MonthPeriod: 0,
  ReportName: "",
  ReportHead: "",
  ReportHeadName: "",
  Action: "",
  ReportCode: "",
  ReportTitle: "Title",
  ReportType: "1",
  ReportTypeName: "",
  ReportSubType: "",
  ReportSubTypeName: "",
  SearchType: 0,
  SearchText: "",
  Particular: "",
  DeptCode: "",
  DeptName: "",
  ClassCode: "",
  TreatyCategory: null,
  ClassName: "",
  SubClassCode: "",
  SubClassName: "",
  DocType: "",
  DocTypeName: "",
  EndorseType: "",
  EndorseTypeName: "",
  AdjType: "",
  AdjTypeName: "",
  CoverType: "",
  ConsumptionType: "",
  OccpCode: "",
  CoverTypeName: "",
  FldOffCode: "",
  FldOffName: "",
  VATNo: "",
  VoucherNo: "",
  AgentType: "",
  AgentCode: "",
  AgentName: "",
  SurveyorCode: "",
  SurveyorName: "",
  BranchType: "1",
  BranchCode: "001",
  Code: "",
  BranchName: "",
  BranchUnit: 0,
  BranchUnitName: "",
  ClientCode: "",
  ClientName: "",
  BookAdjustment: false,
  BankCode: "",
  BankName: "",
  TotalSalesSlab: null,
  FiscalYear: "",
  PolicyNo: "",
  DocumentNo: "",
  ClosingNo: "",
  ClaimNo: "",
  CessionNo: "",
  ShowClientName: false,
  InsuredCode: "",
  InsuredName: "",
  PolicyPeriod: "",
  RegionCode: "",
  ProvienceCode: "",
  IsRiskLocation: false,
  DistrictCode: "",
  DistrictName: "",
  PrintedBy: "",
  ClaimStatus: "",
  Status: "",
  ClaimCategory: "",
  ClaimType: "",
  RiskCategory: "",
  RiskCode: "",
  OpenFrom: 0,
  OpenTo: 0,
  RIDate: null,
  IsPool: false,
  Field: "",
  Operator: "",
  FilterValue: "",
  VDCMCode: "",
  WardNo: "",
  Category: "",
  Gender: "",
  Occupation: "",
  IsVIP: 0,
  ApprovalFor: ""
}

  return api.post("/Reports/report-UW_RegisterPaid", body);
}
};





